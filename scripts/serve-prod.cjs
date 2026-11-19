// Production static server for zeitwerk.ca (Render web service). Serves the prerendered dist/ at '/'.
//   /path            -> dist/path/index.html (200)   canonical form, no trailing slash
//   /path/           -> 301 /path
//   real files       -> as-is, Range support (Safari video), gzip for text
//   anything else    -> dist/404.html with status 404 (no SPA fallback, so unknown URLs are real 404s)
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const zlib = require('node:zlib')
const ROOT = path.join(__dirname, '..', 'dist')
const PORT = +(process.env.PORT || 10000)
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.woff2': 'font/woff2', '.woff': 'font/woff', '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon', '.gif': 'image/gif', '.mp4': 'video/mp4', '.webm': 'video/webm' }
const TEXT = /^(text\/|application\/(json|xml|manifest)|image\/svg)/

// CSP, REPORT-ONLY (audit L6, SEO lane 2 2026-11-15): violations only log in the browser console, nothing is blocked.
// Inline bootstrap script(s) are allowed by hash, computed from the built index.html at start. Enforce only after a clean run.
const CSP_RO = (() => {
  try {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')
    const hashes = [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g)]
      .map((m) => `'sha256-${require('node:crypto').createHash('sha256').update(m[1]).digest('base64')}'`)
    return ["default-src 'self'", `script-src 'self' ${hashes.join(' ')}`, "style-src 'self' 'unsafe-inline'", "img-src 'self' data: blob:", "font-src 'self' data:",
      "media-src 'self' blob:", "connect-src 'self'", "worker-src 'self' blob:", "object-src 'none'", "base-uri 'self'", "form-action 'self' mailto:", "frame-ancestors 'self'", 'report-uri /csp-report', 'report-to csp'].join('; ')
  } catch { return '' }
})()

function headers(file, type) {
  const h = { 'Content-Type': type, 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000', 'X-Frame-Options': 'SAMEORIGIN', 'Cross-Origin-Opener-Policy': 'same-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()' }
  if (file.includes(`${path.sep}assets${path.sep}`)) h['Cache-Control'] = 'public, max-age=31536000, immutable'
  else if (type.startsWith('text/html')) { h['Cache-Control'] = 'public, max-age=0, must-revalidate'; if (CSP_RO) { h['Content-Security-Policy-Report-Only'] = CSP_RO; h['Reporting-Endpoints'] = 'csp="/csp-report"' } }
  else if (/\.(txt|xml|json|webmanifest)$/.test(file)) h['Cache-Control'] = 'public, max-age=3600'
  // fonts, video, posters, images: stable file names, re-encoded rarely -> 30 days
  else h['Cache-Control'] = 'public, max-age=2592000'
  return h
}

function send(req, res, file, status = 200) {
  const stat = fs.statSync(file)
  const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream'
  const h = headers(file, type)
  const head = req.method === 'HEAD'
  const range = req.headers.range
  if (status === 200 && range && /^bytes=\d*-\d*$/.test(range)) {
    let [a, b] = range.slice(6).split('-')
    let start = a === '' ? Math.max(0, stat.size - +b) : +a
    let end = a === '' || b === '' ? stat.size - 1 : Math.min(+b, stat.size - 1)
    if (start > end || start >= stat.size) { res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }); return res.end() }
    res.writeHead(206, { ...h, 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 })
    return head ? res.end() : fs.createReadStream(file, { start, end }).pipe(res)
  }
  if (TEXT.test(type) && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
    const body = zlib.gzipSync(fs.readFileSync(file))
    res.writeHead(status, { ...h, 'Content-Encoding': 'gzip', 'Vary': 'Accept-Encoding', 'Content-Length': body.length })
    return res.end(head ? undefined : body)
  }
  res.writeHead(status, { ...h, 'Content-Length': stat.size, 'Accept-Ranges': 'bytes' })
  return head ? res.end() : fs.createReadStream(file).pipe(res)
}

const isFile = (p) => { try { return fs.statSync(p).isFile() } catch { return false } }
const notFound = (req, res) => send(req, res, path.join(ROOT, '404.html'), 404)

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url.split('?')[0] === '/csp-report') {
    // CSP report-only sink: log a trimmed line to the service log (Render logs), never store anything.
    let body = ''
    req.on('data', (c) => { if (body.length < 8192) body += c })
    req.on('end', () => { console.log('[csp-report]', body.replace(/\s+/g, ' ').slice(0, 600)); res.writeHead(204); res.end() })
    return
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, { Allow: 'GET, HEAD' }); return res.end() }
  const [rawPath, query] = req.url.split('?')
  let u
  try { u = decodeURIComponent(rawPath) } catch { return notFound(req, res) }
  if (u.includes('\0')) return notFound(req, res)
  if (u.length > 1 && u.endsWith('/')) {
    const t = u.replace(/\/+$/, '') || '/'
    if (isFile(path.join(ROOT, t, 'index.html'))) { res.writeHead(301, { Location: encodeURI(t) + (query ? '?' + query : '') }); return res.end() }
    return notFound(req, res)
  }
  const p = path.normalize(path.join(ROOT, u))
  if (p !== ROOT && !p.startsWith(ROOT + path.sep)) return notFound(req, res)
  if (path.basename(p) === '404.html') return notFound(req, res)
  if (isFile(p)) return send(req, res, p)
  const idx = path.join(p, 'index.html')
  if (isFile(idx)) return send(req, res, idx)
  return notFound(req, res)
})
if (require.main === module) server.listen(PORT, '0.0.0.0', () => console.log(`zeitwerk.ca static server on :${PORT}`))
module.exports = { server }
