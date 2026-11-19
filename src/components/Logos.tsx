import logos from '../data/logos.json'
import { BASE } from '../lib/env'

type L = { file: string; w: number; h: number }
const MAN = logos as Record<string, L>

/** Sponsor logos: vector SVGs from assets/logos/sponsors (official or traced, see SPONSOR-LOGOS.md). Missing id => name in type. */
export function SponsorLogo({ id, alt }: { id: string; alt: string }) {
  const m = MAN[id]
  if (!m) return <span className="t-h4">{alt}</span>
  return <img className={`sl sl-${id}`} src={`${BASE}logos/${m.file}`} width={m.w} height={m.h} alt={alt} loading="lazy" decoding="async" />
}
