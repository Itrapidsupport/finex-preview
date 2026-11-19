import { lazy, Suspense, useRef, useState, type ReactNode } from 'react'
import { ScrollTrigger } from './gsap'
import { prefersReduced, useIsoLayoutEffect, useMedia } from './env'

const PinnedStage = lazy(() => import('./PinnedStage'))
import { scrollToTarget } from './SmoothScroll'

export type ProcessStep = {
  /** Short step title, e.g. 'Map the workflow' */
  title: string
  /** One or two sentences. */
  body: ReactNode
  /** Meaningful visual for this step (SVG diagram, screenshot, <img>). Fills a 4/3 frame. */
  visual: ReactNode
}

export type PinnedProcessProps = {
  steps: ProcessStep[]
  /** Accessible name for the sequence. */
  label: string
  /** Scroll distance per step in svh. Default 70 */
  scrollPerStep?: number
  /** Viewport width (px) from which the pinned mode runs; below it = stacked list. Default 900 */
  minWidth?: number
  className?: string
}

/**
 * 'How it works' sequence. Desktop: CSS-sticky stage (no pin-spacer, Lenis friendly) under the
 * sticky header (--mk-header-h); scroll progress picks the active step; text + visual swap with
 * AnimatePresence mode="wait" (outgoing fully leaves before incoming enters => never overlaps).
 * Mobile / reduced motion / SSR / JS off: a plain stacked ordered list showing every step.
 */
export function PinnedProcess({ steps, label, scrollPerStep = 70, minWidth = 1200, className = '' }: PinnedProcessProps) {
  const wide = useMedia(`(min-width: ${minWidth}px)`)
  const [reduced, setReduced] = useState(false)
  useIsoLayoutEffect(() => setReduced(prefersReduced()), [])
  const pinned = wide && !reduced
  const root = useRef<HTMLDivElement>(null)
  const st = useRef<ScrollTrigger | null>(null)
  const [active, setActive] = useState(0)
  const n = steps.length

  useIsoLayoutEffect(() => {
    if (!pinned || !root.current) return
    const el = root.current
    const top = () => parseFloat(getComputedStyle(el).getPropertyValue('--mk-header-h')) || 72
    st.current = ScrollTrigger.create({
      trigger: el,
      start: () => `top top+=${top()}`,
      end: () => `bottom bottom`,
      onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n * 0.9999))),
    })
    return () => {
      st.current?.kill()
      st.current = null
    }
  }, [pinned, n])

  const go = (i: number) => {
    const s = st.current
    if (!s) return
    scrollToTarget(s.start + ((s.end - s.start) * (i + 0.5)) / n)
  }

  if (!pinned) {
    return (
      <div role="group" className={`mk-process mk-process--stacked ${className}`} aria-label={label} data-mk="process" data-mode="stacked">
        <ol className="mk-process-stack">
          {steps.map((s, i) => (
            <li key={i} className="mk-process-item">
              <span className="mk-process-num" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mk-process-title">{s.title}</h3>
              <div className="mk-process-body">{s.body}</div>
              <div className="mk-process-visual">{s.visual}</div>
            </li>
          ))}
        </ol>
      </div>
    )
  }

  return (
    <div ref={root} role="group" className={`mk-process mk-process--pinned ${className}`} aria-label={label} data-mk="process" data-mode="pinned" data-active={active}
      style={{ height: `calc(${n * scrollPerStep}svh + 100svh - var(--mk-header-h, 72px))` }}>
      <ol className="mk-sr-only">
        {steps.map((x, i) => (
          <li key={i}>{x.title}: {typeof x.body === 'string' ? x.body : ''}</li>
        ))}
      </ol>
      <Suspense fallback={null}>
        <PinnedStage steps={steps} active={active} go={go} />
      </Suspense>
    </div>
  )
}
