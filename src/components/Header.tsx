import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NAV, SITE } from '../data/site'
import { Logo } from './Mark'
import MobileMenu from './MobileMenu'

/** Opaque sticky header (never transparent, no blur), ink or paper to match the section under it, coral page-progress hairline. */
export default function Header() {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const m = window.matchMedia('(min-width: 960px)')
    const close = () => setOpen(false)
    const onChange = () => { if (m.matches) close() }
    m.addEventListener('change', onChange)
    window.addEventListener('orientationchange', close)
    return () => { m.removeEventListener('change', onChange); window.removeEventListener('orientationchange', close) }
  }, [])
  useEffect(() => {
    let raf = 0
    const bar = document.querySelector<HTMLElement>('.hdr-progress')
    const run = () => {
      raf = 0
      const y = window.scrollY
      const h = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--fx-header-h')) || 72
      const el = document.elementFromPoint(Math.min(40, window.innerWidth / 2), h + 4) as HTMLElement | null
      const t = el?.closest<HTMLElement>('[data-theme]')?.dataset.theme
      setTheme(t === 'dark' ? 'dark' : 'light')
      setScrolled(y > 8)
      const max = document.documentElement.scrollHeight - window.innerHeight
      bar?.style.setProperty('--p', String(max > 0 ? Math.min(1, y / max) : 0))
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(run) }
    run()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    const t = setTimeout(run, 300)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); clearTimeout(t); cancelAnimationFrame(raf) }
  }, [pathname])

  return (
    <header className="hdr" data-theme={open ? 'light' : theme} data-scrolled={scrolled ? '1' : '0'}>
      <div className="wrap hdr-in">
        <Link to="/" aria-label="Finex Development home" className="hdr-logo">
          <Logo />
        </Link>
        <nav aria-label="Primary" className="hdr-nav">
          {NAV.filter((n) => n.to !== '/contact').map((n) => (
            <NavLink key={n.to} to={n.to} className="nav link-u">{n.label}</NavLink>
          ))}
          <NavLink to="/contact" className="nav link-u">Contact</NavLink>
          <a href={SITE.tollFreeHref} className="hdr-tel">{SITE.tollFree}</a>
          <Link to="/contact" className="btn btn-sm">Get a quote</Link>
        </nav>
        <button type="button" className="hdr-burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
          <span aria-hidden className="burger" data-open={open ? '1' : '0'}><i /><i /></span>
        </button>
      </div>
      <span className="hdr-progress" aria-hidden />
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  )
}
