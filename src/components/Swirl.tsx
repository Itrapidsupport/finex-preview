import { useId, useRef } from 'react'
import { gsap, prefersReduced, useIsoLayoutEffect } from '../motion'

/**
 * Finex crescent motif: three nested crescents taken from the shape language of the Finex seal
 * (outer coral crescent, middle crescent with a navy-to-sky inner edge, small inner crescent).
 * Solid brand colours only. Each crescent = circle masked by an offset circle.
 * `scrub` rotates the rings at different speeds while the element crosses the viewport (graphic only,
 * text never rotates). Static when reduced motion / JS off.
 */
type Ring = { r: number; cut: number; dx: number; dy: number; fill: string; rot: number }
const PALETTES: Record<string, string[]> = {
  dark: ['#E07880', '#F8D8D8', '#4F588B', '#B6D9F3'],
  light: ['#E07880', '#F8D8D8', '#4F588B', '#B6D9F3'],
  coral: ['#15182A', '#F8D8D8', '#4F588B', '#FFFFFF'],
  navy: ['#E07880', '#F8D8D8', '#15182A', '#B6D9F3'],
}

export default function Swirl({ className = '', tone = 'dark', scrub = false, intro = false, variant = 0 }: { className?: string; tone?: keyof typeof PALETTES; scrub?: boolean; intro?: boolean; variant?: number }) {
  const id = useId().replace(/:/g, '')
  const root = useRef<SVGSVGElement>(null)
  const [c1, c2, c3, c4] = PALETTES[tone]
  const base = variant * 47
  const rings: Ring[] = [
    { r: 300, cut: 262, dx: 58, dy: -52, fill: c1, rot: base },
    { r: 214, cut: 190, dx: -40, dy: 44, fill: c3, rot: base + 18 },
    { r: 200, cut: 186, dx: -36, dy: 40, fill: c4, rot: base + 18 },
    { r: 138, cut: 120, dx: 34, dy: -30, fill: c2, rot: base - 24 },
  ]
  useIsoLayoutEffect(() => {
    const el = root.current
    if (!el || !scrub || prefersReduced()) return
    const ctx = gsap.context(() => {
      const gs = el.querySelectorAll<SVGGElement>('g[data-ring]')
      const speeds = [28, -36, -36, 54]
      gs.forEach((g, i) => {
        gsap.fromTo(g, { rotation: -speeds[i] / 2 }, { rotation: speeds[i] / 2, svgOrigin: '400 400', ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.8 } })
      })
    }, el)
    return () => ctx.revert()
  }, [scrub])
  return (
    <svg ref={root} viewBox="0 0 800 800" className={`swirl ${intro ? 'swirl--intro' : ''} ${className}`} aria-hidden focusable="false">
      <defs>
        {rings.map((r, i) => (
          <mask id={`${id}m${i}`} key={i} maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="800">
            <circle cx="400" cy="400" r={r.r} fill="#fff" />
            <circle cx={400 + r.dx} cy={400 + r.dy} r={r.cut} fill="#000" />
          </mask>
        ))}
      </defs>
      {rings.map((r, i) => (
        <g key={i} data-ring={i} style={{ ['--i' as string]: i }}>
          <g transform={`rotate(${r.rot} 400 400)`}>
            <circle cx="400" cy="400" r={r.r} fill={r.fill} mask={`url(#${id}m${i})`} />
          </g>
        </g>
      ))}
    </svg>
  )
}
