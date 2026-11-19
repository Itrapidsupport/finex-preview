import { Link } from 'react-router-dom'
import { ABOUT, CREDO, FIGURES, PROGRAMS, SITE, SPONSORS, TRADES } from '../data/site'
import { Counter, HorizontalRail, PinnedProcess } from '../motion'
import Swirl from '../components/Swirl'
import Img from '../components/Img'
import { STOCK, TRADE_PHOTOS, WORK_TYPES } from '../data/stock'
import { Arrow, Brighten, Btn, CtaBlock, Head, Idx, PhotoBand, Rise, Shot, TextLink, Words } from '../components/ui'
import { ProgramCard } from '../components/ProgramCard'
import { SponsorLogo } from '../components/Logos'
import Clients from '../components/Clients'

function Hero() {
  return (
    <section className="hero hero--photo theme-ink" data-theme="dark" aria-labelledby="hero-h">
      <div className="ph-media hero-media">
        <Img id={STOCK.hero.id} alt={STOCK.hero.alt} pos={STOCK.hero.pos} priority sizes="100vw" className="h-full w-full" />
        <span className="ph-scrim" aria-hidden />
      </div>
      <div className="wrap hero-in">
        <p className="t-label hero-k in-rise" style={{ animationDelay: '60ms' }}>
          <span>Finex Development Inc.</span>
          <span className="hero-k-sep" aria-hidden />
          <span>Mississauga, since {SITE.established}</span>
        </p>
        <h1 id="hero-h" className="t-hero">
          <Words text="Leaders in construction and facility maintenance." />
        </h1>
        <div className="hero-foot">
          <p className="t-lead hero-lead in-rise" style={{ animationDelay: '520ms' }}>
            One point of contact for maintenance, renovation and build-outs, with coverage in all 10 provinces.
          </p>
          <div className="hero-cta in-rise" style={{ animationDelay: '640ms' }}>
            <Btn to="/contact" className="btn btn-coral">Get a quote</Btn>
            <a href={SITE.tollFreeHref} className="lnk">{SITE.tollFree}</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Statement() {
  return (
    <section className="sec theme-paper" data-theme="light" aria-labelledby="st-h">
      <div className="wrap">
        <Idx n="01" label="Who we are" />
        <h2 id="st-h" className="sr-only">Who we are</h2>
        <Brighten className="t-statement max-w-[22ch]" text="Tell us what needs to be done and leave everything to us." />
        <div className="grid12 mt-[clamp(48px,7vw,112px)] gap-y-8">
          <Rise as="p" className="col-span-4 sm:col-span-8 lg:col-start-6 lg:col-span-4 t-lead">{ABOUT.intro}</Rise>
          <Rise className="col-span-4 sm:col-span-8 lg:col-span-3" delay={0.1}>
            <p className="c-mute">{ABOUT.oneContact}</p>
            <TextLink to="/about" className="mt-6">About Finex</TextLink>
          </Rise>
        </div>
      </div>
    </section>
  )
}

function Figures() {
  return (
    <section className="figs theme-coral" data-theme="light" aria-labelledby="fig-h">
      <div className="wrap">
        <h2 id="fig-h" className="sr-only">Finex in numbers</h2>
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
  )
}

function Programs() {
  return (
    <section className="sec theme-ink" data-theme="dark" aria-labelledby="pg-h">
      <div className="wrap">
        <Idx n="02" label="Services" />
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Head className="t-l max-w-[14ch]"><span id="pg-h">Three ways to keep a facility running.</span></Head>
          <TextLink to="/services" className="text-white">All services</TextLink>
        </div>
        <ul className="pg-grid mt-[clamp(40px,5vw,80px)]">
          {PROGRAMS.map((p) => <li key={p.slug}><ProgramCard p={p} /></li>)}
        </ul>
      </div>
    </section>
  )
}

function Work() {
  return (
    <section className="theme-ink pb-[clamp(56px,7vw,112px)]" data-theme="dark" aria-labelledby="wk-h">
      <div className="wrap">
        <Idx n="03" label="Projects" />
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Head className="t-l max-w-[15ch]"><span id="wk-h">Build-outs, fit-outs and upkeep for busy sites.</span></Head>
          <TextLink to="/projects" className="text-white">Project gallery</TextLink>
        </div>
      </div>
      <HorizontalRail
        className="mt-[clamp(40px,5vw,72px)]"
        label="Projects"
        itemWidth="min(76vw, 440px)"
        items={WORK_TYPES.map((w, i) => (
          <article key={w.label} className="prj">
            <div className="prj-media">
              <Img id={w.s.id} alt={w.s.alt} pos={w.s.pos} sizes="(min-width: 1024px) 34vw, 80vw" ratio={4 / 5} className="h-full w-full" />
            </div>
            <div className="prj-cap">
              <h3 className="prj-name">{w.label}</h3>
              <span className="t-label tnum prj-i">{String(i + 1).padStart(2, '0')}</span>
            </div>
          </article>
        ))}
      />
    </section>
  )
}

function Trades() {
  return (
    <section className="sec theme-white" data-theme="light" aria-labelledby="tr-h">
      <div className="wrap grid12 gap-y-12">
        <div className="col-span-4 sm:col-span-8 lg:col-span-4">
          <div className="sticky-side">
            <Idx n="04" label="Trades" />
            <Head className="t-h1x"><span id="tr-h">Every trade, one call.</span></Head>
            <Rise as="p" className="mt-8 c-mute t-body max-w-[38ch]">{ABOUT.coverage}</Rise>
          </div>
        </div>
        <ol className="trades col-span-4 sm:col-span-8 lg:col-start-6 lg:col-span-7">
          {TRADES.map((t, i) => (
            <li key={t} className="trade">
              <span className="trade-n tnum">{String(i + 1).padStart(2, '0')}</span>
              <span className="trade-t">{t}</span>
              <span className="trade-bar" aria-hidden />
            </li>
          ))}
        </ol>
      </div>
      <div className="wrap">
        <ul className="shots mt-[clamp(56px,7vw,112px)]" aria-label="Trades at work">
          {TRADE_PHOTOS.map((t) => <li key={t.trade}><Shot photo={t.s} cap={t.trade} /></li>)}
        </ul>
      </div>
    </section>
  )
}

const CREDO_TONES = ['navy', 'coral', 'sky', 'ink'] as const
function Credo() {
  return (
    <section className="sec theme-paper" data-theme="light" aria-labelledby="cr-h">
      <div className="wrap">
        <Idx n="05" label="Our credo" />
        <Head className="t-l max-w-[16ch]"><span id="cr-h">How we work with every client.</span></Head>
        <PinnedProcess
          className="mt-[clamp(40px,6vw,96px)]"
          label="Our credo"
          minWidth={1100}
          steps={CREDO.map((c, i) => ({
            title: c.title,
            body: c.body,
            visual: (
              <div className={`cv cv--${CREDO_TONES[i]}`}>
                <Swirl tone={CREDO_TONES[i] === 'coral' ? 'coral' : CREDO_TONES[i] === 'navy' ? 'navy' : 'dark'} variant={i + 1} />
                <span className="cv-n tnum">{String(i + 1).padStart(2, '0')}</span>
              </div>
            ),
          }))}
        />
      </div>
    </section>
  )
}

function Sectors() {
  return (
    <section className="sec theme-navy" data-theme="dark" aria-labelledby="se-h">
      <div className="wrap grid12 gap-y-10">
        <div className="col-span-4 sm:col-span-8 lg:col-span-6">
          <Idx n="06" label="Who we work for" />
          <Head className="t-l"><span id="se-h">Multi-site operators, retailers and chain stores.</span></Head>
        </div>
        <div className="col-span-4 sm:col-span-8 lg:col-start-8 lg:col-span-5 lg:pt-[clamp(60px,7vw,120px)]">
          <Rise as="p" className="t-lead">{ABOUT.sectors}</Rise>
          <Rise as="p" className="mt-6 on-dark-mute" delay={0.1}>{ABOUT.malls}</Rise>
        </div>
        <div className="col-span-4 sm:col-span-8 lg:col-span-12 sec-photos">
          <Shot photo={STOCK.retailWhite} ratio={16 / 10} sizes="(min-width: 1024px) 58vw, 100vw" />
          <Shot photo={STOCK.accessPanel} ratio={16 / 10} sizes="(min-width: 1024px) 40vw, 100vw" />
        </div>
      </div>
    </section>
  )
}

function Community() {
  return (
    <section className="sec theme-white" data-theme="light" aria-labelledby="co-h">
      <div className="wrap">
        <Idx n="08" label="Community" />
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Head className="t-l max-w-[12ch]"><span id="co-h">A proud sponsor of.</span></Head>
          <TextLink to="/community">Community</TextLink>
        </div>
        <ul className="spons mt-[clamp(40px,5vw,72px)]">
          {SPONSORS.map((s) => (
            <li key={s.name} className="spon">
              <div className="spon-logo"><SponsorLogo id={s.logo} alt={s.name} /></div>
              <p className="t-h4 mt-6">{s.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Statement />
      <Figures />
      <Programs />
      <Work />
      <Trades />
      <Credo />
      <Sectors />
      <PhotoBand id="cov-h" photo={STOCK.toronto} label="Coverage" text="Head office in Mississauga. Crews and trades in all 10 provinces." />
      <Clients n="07" />
      <Community />
      <CtaBlock />
      <p className="sr-only"><Link to="/contact">Contact Finex <Arrow /></Link></p>
    </>
  )
}
