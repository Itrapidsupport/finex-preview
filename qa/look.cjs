// Screenshot sweep: node qa/look.cjs <base-url> <outdir> [routes comma] [widths comma]
// Per route x width: reduced-motion full page (?reduce) + a motion run (wheel-scrolled through, then full page)
// to prove every animation ends visible. Also reports overflow / broken images / console errors.
const { chromium, webkit, devices } = require('playwright')
const fs = require('node:fs')
const path = require('node:path')
const [base0, out = 'qa/out/look', routesArg, widthsArg] = process.argv.slice(2)
const base = base0.replace(/\/?$/, '/')
const routes = routesArg ? routesArg.split(',') : JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'dist', 'routes.json'), 'utf8'))
const widths = widthsArg ? widthsArg.split(',').map(Number) : [390, 1440]
fs.mkdirSync(out, { recursive: true })
const ARGS = ['--use-mock-keychain', '--password-store=basic']
;(async () => {
  const report = []
  for (const w of widths) {
    const isPhone = w === 390
    const browser = isPhone ? await webkit.launch() : await chromium.launch({ args: ARGS })
    const ctxOpts = isPhone ? { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } } : { viewport: { width: w, height: w >= 1440 ? 900 : w >= 1024 ? 768 : 1000 } }
    for (const mode of ['reduce', 'motion']) {
      const ctx = await browser.newContext({ ...ctxOpts, reducedMotion: mode === 'reduce' ? 'reduce' : 'no-preference' })
      for (const r of routes) {
        const page = await ctx.newPage()
        const errs = []
        page.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 200)))
        page.on('pageerror', (e) => errs.push('pageerror: ' + e.message.slice(0, 200)))
        page.on('response', (s) => s.status() >= 400 && !/does-not-exist/.test(s.url()) && errs.push(`http ${s.status()} ${s.url()}`))
        await page.goto(base + r.replace(/^\//, ''), { waitUntil: 'networkidle' })
        await page.waitForTimeout(600)
        const H = await page.evaluate(() => document.documentElement.scrollHeight)
        if (mode === 'reduce') { for (let y = 0; y < H; y += 700) { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(60) } await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(800) }
        if (mode === 'motion') {
          if (isPhone) { for (let y = 0; y < H; y += 500) { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(120) } }
          else { await page.mouse.move(w / 2, 400); for (let y = 0; y < H + 2000; y += 400) { await page.mouse.wheel(0, 400); await page.waitForTimeout(90) } }
          await page.waitForTimeout(1600)
        }
        const res = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth - innerWidth,
          broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
          hidden: [...document.querySelectorAll('h1,h2,h3,p,li,a')].filter((e) => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return r.width > 0 && (cs.visibility === 'hidden' || +cs.opacity < 0.05) && !e.closest('[hidden],.mk-sr-only,.sr-only,[aria-hidden=true],.pcard-inc') }).slice(0, 5).map((e) => e.tagName + ':' + (e.textContent || '').trim().slice(0, 40)),
        }))
        const name = `${(r === '/' ? 'home' : r.slice(1).replace(/\//g, '_'))}-${w}-${mode}`
        if (mode === 'motion' && !isPhone) await page.evaluate(() => scrollTo(0, 0))
        await page.screenshot({ path: path.join(out, name + '.png'), fullPage: true })
        report.push({ w, mode, r, ...res, errs })
        await page.close()
      }
      await ctx.close()
    }
    await browser.close()
  }
  fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 1))
  const bad = report.filter((x) => x.overflow > 0 || x.broken.length || x.errs.length || x.hidden.length)
  console.log(`look: ${report.length} shots, ${bad.length} with issues`)
  bad.forEach((b) => console.log(' ', b.w, b.mode, b.r, JSON.stringify({ o: b.overflow, b: b.broken, e: b.errs, h: b.hidden })))
})().catch((e) => { console.error(e); process.exit(2) })
