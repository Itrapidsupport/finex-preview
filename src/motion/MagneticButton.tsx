import { useEffect, useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { gsap } from './gsap'
import { useFinePointer, useReducedMotion } from './env'

type Common = {
  children: ReactNode
  /** Pull strength 0..1 (fraction of pointer offset). Default 0.3 */
  strength?: number
  className?: string
}
export type MagneticButtonProps =
  | (Common & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className'>)
  | (Common & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'>)

/**
 * Square-edged CTA that leans toward the pointer (spring), label leans a little further.
 * Only on hover-capable fine pointers and when motion is allowed; otherwise a normal link/button.
 * Renders <a> when href is set, else <button type="button">. Styling via className / .mk-magnetic.
 */
export function MagneticButton({ children, strength = 0.3, className = '', ...rest }: MagneticButtonProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const on = fine && !reduce
  const q = useRef<((v: number) => void)[] | null>(null)
  useEffect(() => {
    if (!on || !ref.current || !label.current) { q.current = null; return }
    const o = { duration: 0.6, ease: 'elastic.out(1, 0.45)' }
    q.current = [gsap.quickTo(ref.current, 'x', o), gsap.quickTo(ref.current, 'y', o), gsap.quickTo(label.current, 'x', o), gsap.quickTo(label.current, 'y', o)]
    const el = ref.current, lb = label.current
    return () => { gsap.set([el, lb], { clearProps: 'transform' }); q.current = null }
  }, [on])
  const move = (e: React.PointerEvent) => {
    if (!q.current || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    const [x, y, lx, ly] = q.current
    x(dx * strength); y(dy * strength); lx(dx * strength * 0.35); ly(dy * strength * 0.35)
  }
  const leave = () => q.current?.forEach((f) => f(0))
  const inner = <span ref={label} className="mk-magnetic-label">{children}</span>
  const cls = `mk-magnetic ${className}`
  return (
    <span ref={ref} className="mk-magnetic-wrap" onPointerMove={move} onPointerLeave={leave} data-mk="magnetic">
      {'href' in rest && rest.href !== undefined ? (
        <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} className={cls}>
          {inner}
        </a>
      ) : (
        <button type="button" {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)} className={cls}>
          {inner}
        </button>
      )}
    </span>
  )
}
