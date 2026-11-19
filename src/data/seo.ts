/**
 * Per-route SEO for the preview. Used at runtime by lib/Seo.tsx and at build time by the prerender
 * (scripts/postbuild.mjs via the SSR bundle). The preview is always noindex (index.html meta + robots.txt).
 */
import { PROGRAMS, SITE } from './site'
import { PROGRAM_PHOTO, STOCK } from './stock'
import { PROJECTS } from './projects'
import manifest from './images.json'

const MAN = manifest as Record<string, { ws: number[] }>
const BASE = '/finex-preview/'

export type SeoEntry = { path: string; title: string; description: string; jsonld?: unknown; preload?: { id: string; sizes: string } }

const ORIGIN = SITE.preview
const ORG_ID = SITE.origin + '/#organization'
const org = {
  '@type': 'GeneralContractor',
  '@id': ORG_ID,
  name: SITE.name,
  url: SITE.origin + '/',
  email: SITE.email,
  telephone: '+1-905-826-1808',
  foundingDate: String(SITE.established),
  address: { '@type': 'PostalAddress', streetAddress: SITE.street, addressLocality: SITE.city, addressRegion: SITE.region, postalCode: SITE.postal, addressCountry: 'CA' },
  areaServed: { '@type': 'Country', name: 'Canada' },
  contactPoint: [
    { '@type': 'ContactPoint', telephone: '+1-888-513-4639', contactType: 'customer service', areaServed: 'CA', availableLanguage: 'en' },
  ],
}
const crumbs = (items: [string, string][]) => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: ORIGIN + path })) })
const page = (path: string, title: string, description: string, type = 'WebPage', crumb?: string, extra: object[] = []): SeoEntry => ({
  path,
  title,
  description,
  jsonld: {
    '@context': 'https://schema.org',
    '@graph': [
      org,
      { '@type': type, '@id': ORIGIN + path + '#webpage', url: ORIGIN + path, name: title, description, about: { '@id': ORG_ID }, inLanguage: 'en-CA' },
      ...(crumb ? [crumbs([['Home', '/'], [crumb, path]])] : []),
      ...extra,
    ],
  },
})

export const SEO: SeoEntry[] = [
  { ...page('/', 'Finex Development | Construction and Facility Maintenance, Mississauga', 'Finex Development Inc. is a Canadian nationwide construction and facility maintenance company, established in 2002 in Mississauga, with coverage in all 10 provinces.'), preload: { id: STOCK.hero.id, sizes: '100vw' } },
  { ...page('/services', 'Services | Finex Development', 'Integrated facilities management, on-the-go maintenance and preventative maintenance, plus plumbing, electrical, HVAC, carpentry, flooring, painting and more.', 'CollectionPage', 'Services'), preload: { id: STOCK.floorWide.id, sizes: '100vw' } },
  ...PROGRAMS.map((p) => ({
    ...page(`/services/${p.slug}`, `${p.name} | Finex Development`, p.lead.slice(0, 158), 'WebPage', p.name, [
      { '@type': 'Service', '@id': `${ORIGIN}/services/${p.slug}#service`, name: p.name, description: p.lead, provider: { '@id': ORG_ID }, areaServed: { '@type': 'Country', name: 'Canada' } },
    ]),
    preload: { id: PROGRAM_PHOTO[p.slug].id, sizes: '100vw' },
  })),
  { ...page('/projects', 'Projects | Finex Development', 'Before-and-after photos from Finex projects for Tommy Hilfiger, Canadian Tire, KFC and Discount: flooring, exteriors, fixtures and interiors.', 'CollectionPage', 'Projects'), preload: { id: STOCK.cranesDusk.id, sizes: '100vw' } },
  ...PROJECTS.map((p) => ({ ...page(`/projects/${p.slug}`, `${p.name}: ${p.scope} | Finex Development`, p.summary.slice(0, 158), 'WebPage', p.name), preload: { id: p.photos[0].id, sizes: '(min-width: 900px) 66vw, 100vw' } })),
  { ...page('/about', 'About | Finex Development, established 2002', 'Since 2002 Finex Development Inc. has provided integrated facilities maintenance management to multi-site operators, retailers and chain stores across Canada.', 'AboutPage', 'About'), preload: { id: STOCK.mississauga.id, sizes: '100vw' } },
  { ...page('/community', 'Community | Finex Development', 'Finex Development is a proud sponsor of Canadian Tire Jumpstart, St. Matthew Catholic Elementary School, the Royal Canadian Legion and the Hospital Activity Book.', 'WebPage', 'Community'), preload: { id: STOCK.cranes.id, sizes: '100vw' } },
  page('/contact', 'Contact | Finex Development, Mississauga', 'Head office at 2179 Dunwin Drive, Unit 2, Mississauga, ON. Call 905-826-1808 or toll free 1-888-513-4639 for a quote.', 'ContactPage', 'Contact'),
  page('/brand', 'Brand assets | Finex Development', 'Finex Development logo files: vector SVG and high-resolution PNG masters.', 'WebPage', 'Brand assets'),
  page('/privacy', 'Privacy policy | Finex Development', 'How Finex Development Inc. collects, uses and protects personal data on this website.', 'WebPage', 'Privacy policy'),
]
const NOT_FOUND: SeoEntry = { path: '/404', title: 'Page not found | Finex Development', description: 'This page does not exist. Go back to the Finex Development home page.' }

const norm = (p: string) => p.replace(/[?#].*$/, '').replace(/\/+$/, '') || '/'
export const seoFor = (pathname: string): SeoEntry => SEO.find((e) => e.path === norm(pathname)) ?? NOT_FOUND
export const canonical = (pathname: string) => ORIGIN + (norm(pathname) === '/' ? '/' : norm(pathname))

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
/** <head> fragment for the prerender (replaces <!--SEO:START-->...<!--SEO:END--> in index.html). */
export function headHtml(pathname: string): string {
  const e = seoFor(pathname)
  const nf = e.path === '/404'
  const url = canonical(pathname)
  return [
    `<title>${esc(e.title)}</title>`,
    `<meta name="description" content="${esc(e.description)}" />`,
    `<meta property="og:title" content="${esc(e.title)}" />`,
    `<meta property="og:description" content="${esc(e.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Finex Development" />`,
    `<meta property="og:locale" content="en_CA" />`,
    ...(nf ? [] : [`<link rel="canonical" href="${url}" />`, `<meta property="og:url" content="${url}" />`]),
    ...(e.preload && MAN[e.preload.id] ? [`<link rel="preload" as="image" type="image/avif" fetchpriority="high" imagesrcset="${MAN[e.preload.id].ws.map((w) => `${BASE}img/${e.preload!.id}-${w}.avif ${w}w`).join(', ')}" imagesizes="${e.preload.sizes}" />`] : []),
    ...(e.jsonld ? [`<script type="application/ld+json">${JSON.stringify(e.jsonld).replace(/</g, '\\u003c')}</script>`] : []),
  ].join('\n    ')
}
