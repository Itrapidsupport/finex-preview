import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { NAV, PROGRAMS, SITE } from '../data/site'
import { gsap, prefersReduced, useIsoLayoutEffect } from '../motion'
import { Seal } from './Mark'

export default function Footer() {
  const word = useRef<HTMLDivElement>(null)
  useIsoLayoutEffect(() => {
    const el = word.current?.firstElementChild
    if (!el || prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.from(el, { yPercent: 102, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: word.current, start: 'top 98%', once: true } })
    })
    return () => ctx.revert()
  }, [])
  return (
    <footer className="ftr" data-theme="dark">
      <div className="wrap relative">
        <div className="ftr-grid">
          <div>
            <Seal size={112} dark className="ftr-seal" />
            <p className="t-h3 mt-8 max-w-[18ch]">Construction and facility maintenance, one point of contact.</p>
          </div>
          <div>
            <p className="ftr-h">Head office</p>
            <address className="not-italic">
              <a className="l link-u" href={SITE.mapUrl} target="_blank" rel="noopener">{SITE.street}<br />{SITE.city}, {SITE.region} {SITE.postal}<span className="sr-only"> (opens Google Maps)</span></a>
            </address>
            <p className="ftr-h mt-8">Call</p>
            <ul>
              <li><a className="l link-u" href={SITE.phoneHref}>T {SITE.phone}</a></li>
              <li><a className="l link-u" href={SITE.tollFreeHref}>Toll free {SITE.tollFree}</a></li>
            </ul>
          </div>
          <div>
            <p className="ftr-h">Services</p>
            <ul>{PROGRAMS.map((p) => <li key={p.slug}><Link className="l link-u" to={`/services/${p.slug}`}>{p.name}</Link></li>)}</ul>
            <p className="ftr-h mt-8">Email</p>
            <ul>
              <li><a className="l link-u" href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              <li><a className="l link-u" href={`mailto:${SITE.hrEmail}`}>{SITE.hrEmail}</a> <span className="on-dark-mute">(careers)</span></li>
            </ul>
          </div>
          <div>
            <p className="ftr-h">Company</p>
            <ul>
              {NAV.map((n) => <li key={n.to}><Link className="l link-u" to={n.to}>{n.label}</Link></li>)}
              <li><Link className="l link-u" to="/brand">Brand assets</Link></li>
              <li><Link className="l link-u" to="/privacy">Privacy policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="ftr-word" ref={word} aria-hidden>
          <span>Finex<i /></span>
        </div>
        <div className="ftr-base">
          <p>© {new Date().getFullYear()} {SITE.name} Established {SITE.established}, {SITE.city}, Ontario.</p>
          <p>Serving all 10 provinces.</p>
        </div>
      </div>
    </footer>
  )
}
