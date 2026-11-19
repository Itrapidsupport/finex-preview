import { useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { NAV, SITE } from '../data/site'

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Full-screen opaque mobile menu: focus trap (Tab/Shift+Tab cycle panel + toggle), Escape closes and
 * returns focus, scroll lock on <html> only (keeps the sticky header in place), main/footer inert.
 */
export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const toggle = document.querySelector<HTMLButtonElement>('[aria-controls="mobile-menu"]')
    const html = document.documentElement
    html.classList.add('menu-open')
    window.__lenis?.stop()
    const outside = Array.from(document.querySelectorAll<HTMLElement>('main, footer'))
    outside.forEach((el) => el.setAttribute('inert', ''))
    panel.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
      if (e.key !== 'Tab' || !panel.current) return
      const items = [toggle, ...Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE))].filter(Boolean) as HTMLElement[]
      const i = items.indexOf(document.activeElement as HTMLElement)
      e.preventDefault()
      items[(i + (e.shiftKey ? -1 : 1) + items.length) % items.length].focus()
    }
    const onFocusIn = (e: FocusEvent) => {
      const t = e.target as Node
      if (panel.current && !panel.current.contains(t) && t !== toggle) panel.current.querySelector<HTMLElement>(FOCUSABLE)?.focus()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('focusin', onFocusIn)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('focusin', onFocusIn)
      outside.forEach((el) => el.removeAttribute('inert'))
      html.classList.remove('menu-open')
      window.__lenis?.start()
      toggle?.focus({ preventScroll: true })
    }
  }, [open, onClose])

  return (
    <div id="mobile-menu" ref={panel} role="dialog" aria-modal="true" aria-label="Menu" hidden={!open} className="mm">
      <nav aria-label="Mobile" className="wrap mm-in">
        <ul className="mm-list">
          {[{ to: '/', label: 'Home' }, ...NAV].map((n, i) => (
            <li key={n.to} style={{ animationDelay: `${60 + i * 45}ms` }}>
              <NavLink to={n.to} end={n.to === '/'} onClick={onClose} className="mm-link">
                {n.label}
                <span aria-hidden className="mm-n tnum">0{i + 1}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <Link to="/contact" onClick={onClose} className="btn btn-coral mm-cta">Get a quote</Link>
        <div className="mm-foot">
          <a href={SITE.tollFreeHref} className="mm-tel">{SITE.tollFree}</a>
          <a href={`mailto:${SITE.email}`} className="mm-mail">{SITE.email}</a>
          <p className="mm-addr">{SITE.street}, {SITE.city}, {SITE.region} {SITE.postal}</p>
        </div>
      </nav>
    </div>
  )
}
