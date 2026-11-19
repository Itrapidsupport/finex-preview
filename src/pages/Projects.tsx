import { PROJECTS } from '../data/projects'
import { CtaBlock, Idx, PageHero } from '../components/ui'
import { ProjectCard } from '../components/ProjectCard'
import Clients from '../components/Clients'
import { STOCK, WORK_TYPES } from '../data/stock'
import { Shot } from '../components/ui'

export default function Projects() {
  return (
    <>
      <PageHero label="Projects" title="Work for the brands we maintain." lead="Before-and-after photos from the Finex project gallery: retail stores, a restaurant and offices." tone="ink" variant={3} photo={STOCK.cranesDusk} />
      <section className="sec pt-0 theme-ink" data-theme="dark" aria-labelledby="pj-h">
        <div className="wrap">
          <Idx n="01" label="Selected projects" />
          <h2 id="pj-h" className="sr-only">Selected projects</h2>
          <ul className="prj-grid">
            {PROJECTS.map((p, i) => <li key={p.slug}><ProjectCard p={p} i={i} priority={i < 1} sizes="(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 100vw" /></li>)}
          </ul>
        </div>
      </section>
      <section className="sec theme-paper" data-theme="light" aria-labelledby="kw-h">
        <div className="wrap">
          <Idx n="02" label="What we build and maintain" />
          <h2 id="kw-h" className="t-h1x max-w-[18ch]">Build-outs, fit-outs and maintenance for occupied space.</h2>
          <ul className="shots mt-[clamp(40px,5vw,80px)]">
            {WORK_TYPES.map((w) => <li key={w.label}><Shot photo={w.s} cap={w.label} /></li>)}
          </ul>
          <p className="t-small c-mute mt-8">Representative photography of the type of work. Project photos above are from the Finex project gallery.</p>
        </div>
      </section>
      <Clients n="03" />
      <CtaBlock />
    </>
  )
}
