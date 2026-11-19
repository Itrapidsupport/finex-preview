import { Link, useParams } from 'react-router-dom'
import { PROJECTS, projectBySlug } from '../data/projects'
import { ImageReveal } from '../motion'
import { CtaBlock, Idx, PageHero, TextLink } from '../components/ui'
import Img, { src, srcset } from '../components/Img'
import manifest from '../data/images.json'
import NotFound from './NotFound'

const MAN = manifest as Record<string, { w: number; h: number }>

export default function ProjectDetail() {
  const { slug } = useParams()
  const p = projectBySlug(slug)
  if (!p) return <NotFound />
  const i = PROJECTS.indexOf(p)
  const next = PROJECTS[(i + 1) % PROJECTS.length]
  return (
    <>
      <PageHero label={`Project ${String(i + 1).padStart(2, '0')} · ${p.scope}`} title={p.name} lead={p.summary} tone="ink" art={false} />
      <section className="theme-ink pb-[var(--fx-section)]" data-theme="dark" aria-labelledby="gl-h">
        <div className="wrap">
          <Idx n="01" label="Photos" />
          <h2 id="gl-h" className="sr-only">Photos</h2>
          <ul className="gal">
            {p.photos.map((ph, k) => {
              const m = MAN[ph.id]
              const ratio = m ? `${m.w} / ${m.h}` : '4 / 3'
              return (
                <li key={ph.id + k} className={k === 0 ? 'wide' : ''}>
                  <figure>
                    {m && k === 0 ? (
                      <Img id={ph.id} alt={ph.alt} priority sizes="(min-width: 900px) 66vw, 100vw" />
                    ) : m ? (
                      <ImageReveal ratio={ratio} src={src(ph.id, 1200)} srcSet={srcset(ph.id, 'webp')} sizes={k === 0 ? '(min-width: 900px) 66vw, 100vw' : '(min-width: 900px) 33vw, 50vw'} alt={ph.alt} curtain="#23273D" loading="lazy" />
                    ) : (
                      <Img id={ph.id} alt={ph.alt} />
                    )}
                    {ph.cap && <figcaption>{ph.cap}</figcaption>}
                  </figure>
                </li>
              )
            })}
          </ul>
          <p className="t-small on-dark-mute mt-10 max-w-[60ch]">Photos from the Finex project gallery on the company’s earlier website (2011).</p>
        </div>
      </section>
      <section className="sec theme-white" data-theme="light" aria-labelledby="nx-h">
        <div className="wrap flex flex-wrap items-end justify-between gap-8">
          <div>
            <Idx label="Next project" />
            <h2 id="nx-h" className="t-l"><Link to={`/projects/${next.slug}`} className="link-u">{next.name}</Link></h2>
            <p className="mt-4 c-mute">{next.scope}</p>
          </div>
          <TextLink to="/projects">All projects</TextLink>
        </div>
      </section>
      <CtaBlock />
    </>
  )
}
