import { SPONSORS } from '../data/site'
import { CtaBlock, Idx, PageHero, Rise } from '../components/ui'
import { SponsorLogo } from '../components/Logos'
import { STOCK } from '../data/stock'

export default function Community() {
  return (
    <>
      <PageHero label="Community" title="A proud sponsor." lead="Finex Development is a proud sponsor of four organizations serving kids, students, Veterans and their families." tone="navy" variant={3} photo={STOCK.cranes} />
      <section className="sec theme-white" data-theme="light" aria-labelledby="sp-h">
        <div className="wrap">
          <Idx n="01" label="We sponsor" />
          <h2 id="sp-h" className="sr-only">Organizations we sponsor</h2>
          <ul className="spon-rows">
            {SPONSORS.map((s, i) => (
              <li key={s.name} className="spon-row">
                <span className="tnum c-mute">{String(i + 1).padStart(2, '0')}</span>
                <div className="spon-logo"><SponsorLogo id={s.logo} alt={s.name} /></div>
                <div>
                  <h3 className="t-h2">{s.name}</h3>
                  <Rise as="p" className="mt-4 c-mute max-w-[52ch]">{s.body}</Rise>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBlock />
    </>
  )
}
