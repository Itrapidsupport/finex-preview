import { BASE } from '../lib/env'

/** Finex logo files (vector masters from the asset lane, copied to public/brand/). Always SVG. */
const SRC = {
  mark: `${BASE}brand/finex-mark.svg`,
  logo: `${BASE}brand/finex-logo.svg`,
  logoDark: `${BASE}brand/finex-logo-white.svg`,
}

/** Full seal (crescents + circular "FINEX Development Inc. / Construction and Maintenance Systems"). */
export function Seal({ size = 48, dark = false, className = '' }: { size?: number; dark?: boolean; className?: string }) {
  return <img src={dark ? SRC.logoDark : SRC.logo} width={size} height={size} alt="Finex Development Inc. logo" className={`seal ${className}`} decoding="async" loading="lazy" />
}

/** Header lockup: the crescent mark + company name set in the display face (legible at small sizes). */
export function Logo() {
  return (
    <span className="logo">
      <img src={SRC.mark} width={40} height={40} alt="" className="logo-mark" decoding="async" />
      <span className="logo-t">
        <span className="logo-n">Finex</span>
        <span className="logo-s">Development Inc.</span>
      </span>
    </span>
  )
}
