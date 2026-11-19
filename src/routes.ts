import { lazy, type ComponentType } from 'react'

/** Route chunk loaders (lazy + idle/hover prefetch). A stale chunk after a deploy reloads once. */
const loaders = {
  services: () => import('./pages/Services'),
  serviceDetail: () => import('./pages/ServiceDetail'),
  projects: () => import('./pages/Projects'),
  projectDetail: () => import('./pages/ProjectDetail'),
  about: () => import('./pages/About'),
  community: () => import('./pages/Community'),
  contact: () => import('./pages/Contact'),
  brand: () => import('./pages/Brand'),
  privacy: () => import('./pages/Privacy'),
  notFound: () => import('./pages/NotFound'),
}
export type RouteKey = keyof typeof loaders

const RELOAD_FLAG = 'fx-chunk-reload'
const cache: Partial<Record<RouteKey, Promise<{ default: ComponentType<any> }>>> = {}

export function reloadOnceForStaleChunk(key = 'entry'): boolean {
  try {
    if (sessionStorage.getItem(RELOAD_FLAG)) return false
    sessionStorage.setItem(RELOAD_FLAG, key)
  } catch {
    return false
  }
  window.location.reload()
  return true
}

export function load(key: RouteKey) {
  if (!cache[key]) {
    cache[key] = loaders[key]().then((m) => {
      if (!m || !(m as { default?: unknown }).default) throw new Error(`route chunk "${key}" resolved empty`)
      return m
    }).catch((err) => {
      delete cache[key]
      throw err
    }) as Promise<{ default: ComponentType<any> }>
  }
  return cache[key]!
}

export const route = (key: RouteKey) =>
  lazy(() =>
    load(key).then(
      (m) => {
        try { if (sessionStorage.getItem(RELOAD_FLAG) === key) sessionStorage.removeItem(RELOAD_FLAG) } catch { /* private mode */ }
        return m
      },
      (err) => {
        if (typeof window !== 'undefined' && reloadOnceForStaleChunk(key)) return new Promise<never>(() => {})
        throw err
      },
    ),
  )

export function keyFor(path: string): RouteKey | null {
  const p = path.replace(/[?#].*$/, '').replace(/^\/finex-preview/, '').replace(/\/+$/, '') || '/'
  if (p === '/') return null
  if (p === '/services') return 'services'
  if (p.startsWith('/services/')) return 'serviceDetail'
  if (p === '/projects') return 'projects'
  if (p.startsWith('/projects/')) return 'projectDetail'
  if (p === '/about') return 'about'
  if (p === '/community') return 'community'
  if (p === '/contact') return 'contact'
  if (p === '/brand') return 'brand'
  if (p === '/privacy') return 'privacy'
  return 'notFound'
}

export function prefetchPath(path: string) {
  const k = keyFor(path)
  if (k) load(k).catch(() => {})
}

export function prefetchAllOnIdle() {
  if (typeof window === 'undefined') return
  const nav = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
  if (nav.connection?.saveData || /(^|-)2g$/.test(nav.connection?.effectiveType ?? '')) return
  const go = () => (Object.keys(loaders) as RouteKey[]).forEach((k) => load(k).catch(() => {}))
  const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback
  const start = () => (ric ? ric(go, { timeout: 4000 }) : setTimeout(go, 1500))
  if (document.readyState === 'complete') setTimeout(start, 1200)
  else window.addEventListener('load', () => setTimeout(start, 1200), { once: true })
}
