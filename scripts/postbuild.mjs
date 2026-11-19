// Prerender: after `vite build` (client) + `vite build --ssr src/entry-server.tsx` (dist-ssr), write
// dist/<route>/index.html for every route with full page markup AND its SEO head, plus dist/404.html
// (GH Pages serves it for unknown paths = SPA fallback with a 404 status). Preview guards: noindex + robots Disallow.
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const app = join(dirname(fileURLToPath(import.meta.url)), '..')
const root = join(app, 'dist')
const ssr = await import(join(app, 'dist-ssr', 'entry-server.js'))
let shell = readFileSync(join(root, 'index.html'), 'utf8')
// Inline the entry stylesheet (one small file) so first paint does not wait on a CSS request (LCP on mobile).
shell = shell.replace(/<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/, (m, href) => {
  const f = join(root, href.replace(/^\/finex-preview\//, ''))
  if (!existsSync(f)) return m
  return `<style>${readFileSync(f, 'utf8').replace(/<\/style/g, '<\\/style')}</style>`
})
if (!/name="robots" content="noindex/.test(shell)) throw new Error('noindex meta missing from index.html, refusing to build preview')

const page = async (path) => {
  const html = await ssr.render(path)
  if (!html || html.length < 500) throw new Error(`prerender produced no markup for ${path}`)
  return shell.replace(/<!--SEO:START-->[\s\S]*?<!--SEO:END-->/, ssr.headHtml(path)).replace('<!--app-->', html)
}
let n = 0
for (const p of ssr.ROUTES) {
  const out = p === '/' ? join(root, 'index.html') : join(root, p.slice(1), 'index.html')
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, await page(p))
  n++
}
writeFileSync(join(root, '404.html'), await page('/404-not-found'))
writeFileSync(join(root, '.nojekyll'), '')
writeFileSync(join(root, 'robots.txt'), 'User-agent: *\nDisallow: /\n')
writeFileSync(join(root, 'routes.json'), JSON.stringify(ssr.ROUTES, null, 1))
// Guard: no placeholder / foreign-brand strings in shipped HTML.
const BANNED = /Zeitwerk|zeitwerk|Lorem ipsum|I'm a paragraph/
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]))
for (const f of walk(root).filter((f) => /\.(html|txt|json|webmanifest|js)$/.test(f))) {
  const m = readFileSync(f, 'utf8').match(BANNED)
  if (m) throw new Error(`banned string "${m[0]}" in ${f}`)
}
rmSync(join(app, 'dist-ssr'), { recursive: true, force: true })
console.log(`prerender: ${n} routes + 404.html with full markup`)
