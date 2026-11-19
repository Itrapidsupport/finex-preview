import { useParams } from 'react-router-dom'
import { PROGRAMS, programBySlug, SITE, TRADES } from '../data/site'
import { CtaBlock, Head, Idx, PageHero, Rise } from '../components/ui'
import { ProgramCard } from '../components/ProgramCard'
import NotFound from './NotFound'
import { PROGRAM_PHOTO } from '../data/stock'

export default function ServiceDetail() {
  const { slug } = useParams()
  const p = programBySlug(slug)
  if (!p) return <NotFound />
  const others = PROGRAMS.filter((x) => x.slug !== p.slug)
  return (
    <>
      <PageHero label={`Program ${p.n}`} title={p.name} lead={p.lead} tone={p.tone === 'coral' ? 'coral' : p.tone === 'navy' ? 'navy' : 'ink'} variant={Number(p.n)} photo={PROGRAM_PHOTO[p.slug]} />
      <section className="sec theme-white" data-theme="light" aria-labelledby="ov-h">
        <div className="wrap grid12 gap-y-12">
          <div className="col-span-4 sm:col-span-8 lg:col-span-6">
            <Idx n="01" label="Overview" />
            <Head className="t-h1x"><span id="ov-h">{p.short}</span></Head>
            {p.body.map((b, i) => <Rise as="p" key={i} className={`${i ? 'mt-5 c-mute' : 'mt-8 t-lead'} max-w-[46ch]`} delay={i * 0.08}>{b}</Rise>)}
          </div>
          <div className="col-span-4 sm:col-span-8 lg:col-start-8 lg:col-span-5">
            <Idx n="02" label="Included" />
            <ul className="inc-list">
              {p.includes.map((x, i) => (
                <li key={x}><span className="tnum c-mute">{String(i + 1).padStart(2, '0')}</span><span>{x}</span></li>
              ))}
            </ul>
            <p className="mt-10 c-mute">Questions about this program? Call <a className="lnk" href={SITE.phoneHref}>{SITE.phone}</a></p>
          </div>
        </div>
      </section>
      <section className="sec theme-paper" data-theme="light" aria-labelledby="td-h">
        <div className="wrap">
          <Idx n="03" label="Trades on call" />
          <Head className="t-h1x max-w-[18ch]"><span id="td-h">Every trade, through one point of contact.</span></Head>
          <ul className="tlist mt-12">
            {TRADES.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
      </section>
      <section className="sec theme-ink" data-theme="dark" aria-labelledby="ot-h">
        <div className="wrap">
          <Idx n="04" label="Other programs" />
          <h2 id="ot-h" className="sr-only">Other programs</h2>
          <div className="other-grid">
            {others.map((o) => <ProgramCard key={o.slug} p={o} />)}
          </div>
        </div>
      </section>
      <CtaBlock />
    </>
  )
}
