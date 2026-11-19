// Stock-photo pass shots: node qa/stock-shots.cjs <base> <outdir> [routes]
// Chromium 1440x900 first screen + full page (reduced motion); WebKit 390x844 full page. Reports overflow/broken/console errors.
const { chromium, webkit, devices } = require('playwright')
const fs = require('node:fs')
const [base0, out = 'qa/out/stock', routesArg] = process.argv.slice(2)
const base = base0.replace(/\/?$/, '/')
const routes = (routesArg || '/,/services,/services/on-the-go-maintenance,/projects,/projects/kfc,/about,/community,/contact').split(',')
fs.mkdirSync(out, { recursive: true })
;(async () => {
  const rep = []
  for (const [name, w] of [['c1440', 1440], ['w390', 390]]) {
    const b = w === 390 ? await webkit.launch() : await chromium.launch({ args: ['--use-mock-keychain', '--password-store=basic'] })
    const ctx = await b.newContext(w === 390 ? { ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' } : { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
    for (const r of routes) {
      const p = await ctx.newPage(); const errs = []
      p.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 160)))
      p.on('pageerror', (e) => errs.push('pageerror ' + e.message.slice(0, 160)))
      p.on('response', (s) => s.status() >= 400 && errs.push(`http ${s.status()} ${s.url()}`))
      await p.goto(base + r.replace(/^\//, ''), { waitUntil: 'networkidle' })
      const H = await p.evaluate(() => document.documentElement.scrollHeight)
      for (let y = 0; y < H; y += 600) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(80) }
      await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(900)
      const slug = r === '/' ? 'home' : r.replace(/^\//, '').replace(/\//g, '-')
      if (w === 1440) await p.screenshot({ path: `${out}/${slug}-${w}.png` })
      await p.screenshot({ path: `${out}/${slug}-${w}-full.png`, fullPage: true })
      const res = await p.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
        imgs: document.images.length,
      }))
      rep.push({ r, w, ...res, errs }); await p.close()
    }
    await b.close()
  }
  console.log(JSON.stringify(rep, null, 0))
})()
