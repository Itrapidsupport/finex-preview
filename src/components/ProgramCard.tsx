import { Link } from 'react-router-dom'
import type { Program } from '../data/site'
import Img from './Img'
import { PROGRAM_PHOTO } from '../data/stock'

/** Service program panel: solid brand block, crescent art, hover reveals what is included (straight rise). */
export function ProgramCard({ p, headingLevel = 3 }: { p: Program; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <article className={`pcard pcard--${p.tone}`}>
      <div className="pcard-art">
        <Img id={PROGRAM_PHOTO[p.slug].id} alt={PROGRAM_PHOTO[p.slug].alt} pos={PROGRAM_PHOTO[p.slug].pos} sizes="(min-width: 1024px) 33vw, 90vw" className="h-full w-full" />
      </div>
      <div className="pcard-top">
        <span className="t-label tnum">{p.n}</span>
        <span className="t-label">Program</span>
      </div>
      <div className="pcard-body">
        <H className="pcard-name">
          <Link to={`/services/${p.slug}`} className="pcard-link">{p.name}</Link>
        </H>
        <p className="pcard-short">{p.short}</p>
        <ul className="pcard-inc">
          {p.includes.map((x) => <li key={x}>{x}</li>)}
        </ul>
        <span className="pcard-more" aria-hidden>Explore <span className="arr">→</span></span>
      </div>
    </article>
  )
}
