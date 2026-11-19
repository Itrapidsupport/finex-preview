import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { gsap, LineReveal, MagneticButton, MaskReveal, prefersReduced, useIsoLayoutEffect, ScrollTrigger } from '../motion'
import { SITE } from '../data/site'
import Swirl from './Swirl'
import Img from './Img'
import type { Stock } from '../data/stock'

/** IntersectionObserver flag (true once in view). */
export function useInView<T extends HTMLElement>(margin = '0px 0px -12% 0px') {
  const ref = useRef<T>(null)
  const [inView, set] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { set(true); io.disconnect() } }, { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [margin])
  return [ref, inView] as const
}

/** Section index ("01 / Services") on a hairline that draws as the section enters. */
export function Idx({ n, label, className = '' }: { n?: string; label: string; className?: string }) {
  const [ref, on] = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className={`idx t-label ${className}`} data-in={on ? '1' : '0'}>
      {n && <b className="tnum">{n}</b>}
      {n && <span aria-hidden>/</span>}
      <span>{label}</span>
    </div>
  )
}

export const Arrow = () => <span className="arr" aria-hidden>→</span>

/** Headline that rises line by line (straight, masked). */
export function Head({ children, as = 'h2', className = '', immediate, delay }: { children: ReactNode; as?: 'h1' | 'h2' | 'h3'; className?: string; immediate?: boolean; delay?: number }) {
  return (
    <LineReveal as={as} className={className} immediate={immediate} delay={delay}>
      {children}
    </LineReveal>
  )
}

/** Block that fades up (paragraphs, lists). */
export function Rise({ children, className = '', delay = 0, as = 'div' }: { children: ReactNode; className?: string; delay?: number; as?: 'div' | 'p' | 'ul' | 'ol' | 'li' }) {
  return (
    <MaskReveal as={as} className={className} delay={delay} variant="fade">
      {children}
    </MaskReveal>
  )
}

/**
 * Scroll "word brighten": every word starts dim and brightens as the paragraph scrolls past (straight,
 * colour only). Unlit colour still >= 3:1 (large text). Static full colour with reduced motion / JS off.
 */
export function Brighten({ text, className = '', as: Tag = 'p' }: { text: string; className?: string; as?: 'p' | 'h2' }) {
  const ref = useRef<HTMLElement>(null)
  useIsoLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReduced()) return
    const words = el.querySelectorAll('.bw')
    const ctx = gsap.context(() => {
      const dark = !!el.closest('.theme-ink, .theme-navy')
      gsap.fromTo(words, { color: dark ? '#7E8299' : '#8A8792' }, { color: dark ? '#FFFFFF' : '#15182A', stagger: 0.05, ease: 'none', scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 45%', scrub: 0.5 } })
    }, el)
    return () => ctx.revert()
  }, [text])
  return (
    <Tag ref={ref as never} className={`brighten ${className}`}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="bw">{w}{' '}</span>
      ))}
    </Tag>
  )
}

/** Client-side navigation for raw <a> (MagneticButton renders <a>). */
export function spaNav(e: React.MouseEvent, to: string) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
  e.preventDefault()
  window.dispatchEvent(new CustomEvent('fx:navigate', { detail: to }))
}

export function TextLink({ to, children, className = '' }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link to={to} className={`lnk ${className}`}>
      {children} <Arrow />
    </Link>
  )
}

export function Btn({ to, children, className = 'btn' }: { to: string; children: ReactNode; className?: string }) {
  return (
    <MagneticButton href={`${import.meta.env.BASE_URL.replace(/\/$/, '')}${to}`} className={className} onClick={(e: React.MouseEvent) => spaNav(e, to)}>
      {children} <Arrow />
    </MagneticButton>
  )
}

/** Page hero for inner pages: label, H1 (CSS-driven word rise so LCP text paints at once), lead, optional art. */
export function PageHero({ label, title, lead, tone = 'paper', art = true, variant = 1, photo, children }: { label: string; title: string; lead?: string; tone?: 'paper' | 'ink' | 'navy' | 'coral'; art?: boolean; variant?: number; photo?: Stock; children?: ReactNode }) {
  if (photo) { tone = 'ink'; art = false }
  const dark = tone === 'ink' || tone === 'navy'
  return (
    <section className={`phero theme-${tone}${photo ? ' phero--photo' : ''}`} data-theme={dark ? 'dark' : 'light'}>
      {photo && (
        <div className="ph-media">
          <Img id={photo.id} alt={photo.alt} pos={photo.pos} priority sizes="100vw" className="h-full w-full" />
          <span className="ph-scrim" aria-hidden />
        </div>
      )}
      <div className="wrap phero-in">
        <div className="phero-copy">
          <p className="t-label in-rise" style={{ animationDelay: '60ms' }}>{label}</p>
          <h1 className="t-h1x mt-6"><Words text={title} /></h1>
          {lead && <p className="t-lead mt-8 in-rise" style={{ animationDelay: '380ms' }}>{lead}</p>}
          {children}
        </div>
        {art && (
          <div className="phero-art" aria-hidden>
            <Swirl tone={tone === 'coral' ? 'coral' : tone === 'navy' ? 'navy' : 'dark'} scrub intro variant={variant} />
          </div>
        )}
      </div>
    </section>
  )
}

/** CSS-only masked word rise (hero/LCP text). Visible without JS; reduced motion = no animation. */
export function Words({ text, delay = 40 }: { text: string; delay?: number }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span key={i}>
          <span className="wm"><span className="wi" style={{ animationDelay: `${delay + i * 40}ms` }}>{w}</span></span>{' '}
        </span>
      ))}
    </>
  )
}

/** The page's closing coral block: quote call to action with the real phone numbers. */
export function CtaBlock({ title = 'Tell us what needs to be done.', body = 'Leave everything to us. Call for a quote or send the details and we will get back to you.' }: { title?: string; body?: string }) {
  const ref = useRef<HTMLElement>(null)
  useIsoLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const t = setTimeout(() => ScrollTrigger.refresh(), 200)
    return () => clearTimeout(t)
  }, [])
  return (
    <section ref={ref} className="cta theme-coral" data-theme="light" aria-labelledby="cta-h">
      <div className="wrap cta-in">
        <div className="cta-copy">
          <Idx label="Get a quote" />
          <Head className="t-l" as="h2"><span id="cta-h">{title}</span></Head>
          <Rise as="p" className="t-lead mt-8" delay={0.1}>{body}</Rise>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <Btn to="/contact" className="btn btn-ink">Request a quote</Btn>
            <a href={SITE.tollFreeHref} className="lnk text-lg font-medium">Toll free {SITE.tollFree}</a>
          </div>
        </div>
        <div className="cta-art" aria-hidden>
          <Swirl tone="coral" scrub variant={2} />
        </div>
      </div>
    </section>
  )
}

/** Full-bleed stock photo band with a solid ink scrim and a short line of copy (text rises straight). */
export function PhotoBand({ photo, label, text, id }: { photo: Stock; label: string; text: string; id: string }) {
  return (
    <section className="pband theme-ink" data-theme="dark" aria-labelledby={id}>
      <div className="ph-media">
        <Img id={photo.id} alt={photo.alt} pos={photo.pos} sizes="100vw" className="h-full w-full" />
        <span className="ph-scrim ph-scrim--band" aria-hidden />
      </div>
      <div className="wrap pband-in">
        <Idx label={label} />
        <Rise><h2 id={id} className="t-l pband-t">{text}</h2></Rise>
      </div>
    </section>
  )
}

/** Photo with a hairline caption underneath (caption = type of work / trade only). */
export function Shot({ photo, cap, ratio = 4 / 3, sizes = '(min-width: 1024px) 33vw, 50vw', className = '' }: { photo: Stock; cap?: string; ratio?: number; sizes?: string; className?: string }) {
  return (
    <figure className={`shot ${className}`}>
      <Img id={photo.id} alt={photo.alt} pos={photo.pos} ratio={ratio} sizes={sizes} className="w-full" />
      {cap && <figcaption className="shot-cap">{cap}</figcaption>}
    </figure>
  )
}
