import { Link } from 'react-router-dom'
import type { Project } from '../data/projects'
import Img from './Img'

/** Project card for the rail/hub: real archive photo, name, scope; hover lifts a coral veil with the summary (straight rise). */
export function ProjectCard({ p, i, dark = true, priority = false, sizes = '(min-width: 1024px) 34vw, 80vw' }: { p: Project; i: number; dark?: boolean; priority?: boolean; sizes?: string }) {
  return (
    <article className={`prj ${dark ? '' : 'prj--light'}`}>
      <div className="prj-media">
        <Img id={p.cover.id} alt={p.cover.alt} sizes={sizes} ratio={4 / 5} className="h-full w-full" priority={priority} />
        <p className="prj-veil">{p.summary}</p>
      </div>
      <div className="prj-cap">
        <div>
          <h3 className="prj-name"><Link to={`/projects/${p.slug}`}>{p.name}</Link></h3>
          <p className="prj-scope">{p.scope}</p>
        </div>
        <span className="t-label tnum prj-i">{String(i + 1).padStart(2, '0')}</span>
      </div>
    </article>
  )
}
