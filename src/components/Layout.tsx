import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SmoothScroll, ScrollTrigger } from '../motion'
import Seo from '../lib/Seo'
import Footer from './Footer'
import Header from './Header'
import { RouteShell } from './RouteShell'

const hdrH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--fx-header-h')) || 72

/** App shell: skip link, opaque sticky header, <main id="main">, footer, per-route <head>, Lenis. */
export default function Layout() {
  const { pathname, hash } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) requestAnimationFrame(() => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - hdrH() - 8))
      return
    }
    const l = window.__lenis
    if (l) l.scrollTo(0, { immediate: true, force: true })
    else window.scrollTo(0, 0)
    if (first.current) first.current = false
    else
      requestAnimationFrame(() => {
        const h = document.querySelector<HTMLElement>('#main h1')
        if (h) {
          if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1')
          h.style.outline = 'none'
          h.focus({ preventScroll: true })
        } else document.getElementById('main')?.focus({ preventScroll: true })
      })
    const t = setTimeout(() => ScrollTrigger.refresh(), 120)
    return () => clearTimeout(t)
  }, [pathname, hash])
  // In-page anchors: one delegated handler (Lenis anchors overshoot once scrolled).
  useEffect(() => {
    const on = (e: MouseEvent) => {
      const a = (e.target as Element)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (!a || a.classList.contains('skip-link')) return
      const el = document.getElementById(a.getAttribute('href')!.slice(1))
      if (!el) return
      e.preventDefault()
      const y = el.getBoundingClientRect().top + window.scrollY - hdrH() - 8
      const l = window.__lenis
      if (l) l.scrollTo(y, { force: true })
      else window.scrollTo({ top: y, behavior: 'smooth' })
    }
    document.addEventListener('click', on)
    return () => document.removeEventListener('click', on)
  }, [])
  return (
    <SmoothScroll anchorOffset={-72}>
      <a href="#main" className="skip-link">Skip to content</a>
      <Seo />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <RouteShell resetKey={pathname}>
          <Outlet />
        </RouteShell>
      </main>
      <Footer />
    </SmoothScroll>
  )
}
