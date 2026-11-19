import { Link } from 'react-router-dom'
import { PROGRAMS, TRADES, ABOUT } from '../data/site'
import { CtaBlock, Head, Idx, PageHero, Rise, Shot } from '../components/ui'
import Img from '../components/Img'
import { PROGRAM_PHOTO, STOCK } from '../data/stock'

export default function Services() {
  return (
    <>
      <PageHero label="Services" title="Maintenance, renovation and build-outs." lead="Three service programs and ten trades, managed through one point of contact." tone="ink" variant={1} photo={STOCK.floorWide} />
      <section className="sec theme-white" data-theme="light" aria-labelledby="sv-h">
        <div className="wrap">
          <Idx n="01" label="Programs" />
          <h2 id="sv-h" className="sr-only">Service programs</h2>
          <ul className="svc-list">
            {PROGRAMS.map((p) => (
              <li key={p.slug} className="svc-row">
                <span className="bar" aria-hidden />
                <span className="svc-n tnum">{p.n}</span>
                <div>
                  <h3 className="t-h2"><Link to={`/services/${p.slug}`} className="svc-link">{p.name}</Link></h3>
                  <p className="mt-4 c-mute max-w-[46ch]">{p.lead}</p>
                </div>
                <ul className="svc-inc">
                  {p.includes.map((x) => <li key={x}>{x}</li>)}
                </ul>
                <div className={`svc-art svc-art--${p.tone}`}><Img id={PROGRAM_PHOTO[p.slug].id} alt={PROGRAM_PHOTO[p.slug].alt} pos={PROGRAM_PHOTO[p.slug].pos} sizes="(min-width: 1024px) 18vw, 90vw" className="h-full w-full" /></div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="sec theme-paper" data-theme="light" aria-labelledby="tr-h">
        <div className="wrap grid12 gap-y-12">
          <div className="col-span-4 sm:col-span-8 lg:col-span-5">
            <Idx n="02" label="Trades" />
            <Head className="t-h1x"><span id="tr-h">Skilled and licensed professionals in all areas.</span></Head>
            <Rise as="p" className="mt-8 c-mute max-w-[40ch]">{ABOUT.coverage}</Rise>
            <div className="mt-12 shots shots--2">
              <Shot photo={STOCK.panelHivis} cap="Electrical" />
              <Shot photo={STOCK.tile} cap="Flooring" />
            </div>
          </div>
          <ol className="trades trades--grid col-span-4 sm:col-span-8 lg:col-start-7 lg:col-span-6">
            {TRADES.map((t, i) => (
              <li key={t} className="trade">
                <span className="trade-n tnum">{String(i + 1).padStart(2, '0')}</span>
                <span className="trade-t">{t}</span>
                <span className="trade-bar" aria-hidden />
              </li>
            ))}
          </ol>
        </div>
      </section>
      <CtaBlock />
    </>
  )
}
