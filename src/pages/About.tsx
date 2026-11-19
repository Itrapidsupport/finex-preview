import { ABOUT, CEO, CREDO, FIGURES, SITE } from '../data/site'
import { Counter } from '../motion'
import { Brighten, CtaBlock, Head, Idx, PageHero, Rise } from '../components/ui'
import Clients from '../components/Clients'
import { STOCK } from '../data/stock'
import { Shot } from '../components/ui'

export default function About() {
  return (
    <>
      <PageHero label={`About · Established ${SITE.established}`} title="Keeping facilities in top shape since 2002." lead={ABOUT.history} tone="paper" variant={2} photo={STOCK.mississauga} />
      <section className="sec theme-white" data-theme="light" aria-labelledby="ab-h">
        <div className="wrap">
          <Idx n="01" label="Our approach" />
          <h2 id="ab-h" className="sr-only">Our approach</h2>
          <Brighten className="t-statement max-w-[20ch]" text="Customer satisfaction is our utmost goal." />
          <div className="grid12 mt-[clamp(48px,7vw,112px)] gap-y-8">
            <Rise as="p" className="col-span-4 sm:col-span-8 lg:col-start-6 lg:col-span-4 t-lead">{ABOUT.satisfaction}</Rise>
            <Rise as="p" className="col-span-4 sm:col-span-8 lg:col-span-3 c-mute" delay={0.1}>{ABOUT.focus}</Rise>
          </div>
          <div className="about-photos mt-[clamp(48px,7vw,112px)]">
            <Shot photo={STOCK.blueprint} ratio={4 / 5} sizes="(min-width: 1024px) 33vw, 100vw" />
            <Shot photo={STOCK.siteAerial} ratio={16 / 10} sizes="(min-width: 1024px) 60vw, 100vw" />
          </div>
        </div>
      </section>
      <section className="figs theme-navy" data-theme="dark" aria-labelledby="af-h">
        <div className="wrap">
          <h2 id="af-h" className="sr-only">Finex in numbers</h2>
          <ul className="figs-grid">
            <li>
              <span className="fig-v tnum">{SITE.established}</span>
              <span className="fig-k">Year established</span>
            </li>
            <li>
              <span className="fig-v"><Counter value={FIGURES.contractors.value} source={FIGURES.contractors.source} suffix="+" /></span>
              <span className="fig-k">{FIGURES.contractors.label}</span>
            </li>
            <li>
              <span className="fig-v tnum">{FIGURES.provinces.value}</span>
              <span className="fig-k">{FIGURES.provinces.label}</span>
            </li>
            <li>
              <span className="fig-v tnum">24/7</span>
              <span className="fig-k">Availability</span>
            </li>
          </ul>
        </div>
      </section>
      <section className="sec theme-paper" data-theme="light" aria-labelledby="sx-h">
        <div className="wrap grid12 gap-y-10">
          <div className="col-span-4 sm:col-span-8 lg:col-span-5">
            <Idx n="02" label="Experience" />
            <Head className="t-h1x"><span id="sx-h">Built for multi-site, retail and chain-store facilities.</span></Head>
          </div>
          <div className="col-span-4 sm:col-span-8 lg:col-start-7 lg:col-span-6">
            <Rise as="p" className="t-lead">{ABOUT.sectors}</Rise>
            <Rise as="p" className="mt-6 c-mute" delay={0.08}>{ABOUT.malls}</Rise>
            <Rise as="p" className="mt-6 c-mute" delay={0.12}>{ABOUT.coverage}</Rise>
          </div>
          <div className="col-span-4 sm:col-span-8 lg:col-span-12">
            <Shot photo={STOCK.openFitout} ratio={21 / 9} sizes="100vw" />
          </div>
        </div>
      </section>
      <section className="sec theme-white" data-theme="light" aria-labelledby="cd-h">
        <div className="wrap">
          <Idx n="03" label="Our credo" />
          <Head className="t-l max-w-[14ch]"><span id="cd-h">Four promises to every client.</span></Head>
          <ol className="credo-grid mt-[clamp(40px,6vw,88px)]">
            {CREDO.map((c, i) => (
              <li key={c.title} className="credo">
                <span className="credo-n tnum">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="t-h3 mt-5">{c.title}</h3>
                <Rise as="p" className="mt-4 c-mute">{c.body}</Rise>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="sec theme-ink" data-theme="dark" aria-labelledby="ceo-h" id="ceo">
        <div className="wrap grid12 gap-y-10">
          <div className="col-span-4 sm:col-span-8 lg:col-span-4">
            <Idx n="04" label="From the CEO" />
            <Head className="t-h1x"><span id="ceo-h">One point of contact.</span></Head>
          </div>
          <div className="col-span-4 sm:col-span-8 lg:col-start-6 lg:col-span-7 ceo">
            {CEO.paragraphs.map((p, i) => <Rise as="p" key={i} className={i === 0 ? 't-lead' : 'mt-6 on-dark-mute'} delay={i * 0.05}>{p}</Rise>)}
            <p className="ceo-sig mt-10"><span className="t-h4">{CEO.name}</span><span className="t-label on-dark-mute">{CEO.title}, {SITE.name}</span></p>
          </div>
        </div>
      </section>
      <Clients n="05" />
      <CtaBlock />
    </>
  )
}
