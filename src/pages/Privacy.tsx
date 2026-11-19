import blocks from '../data/privacy.json'
import { PageHero } from '../components/ui'

type B = { h?: string; h3?: string; p?: string; ul?: string[] }

export default function Privacy() {
  return (
    <>
      <PageHero label="Legal" title="Privacy policy." tone="paper" art={false} />
      <section className="sec pt-0 theme-paper" data-theme="light">
        <div className="wrap">
          <div className="legal">
            {(blocks as B[]).map((b, i) =>
              b.h ? <h2 key={i}>{b.h}</h2> : b.h3 ? <h3 key={i}>{b.h3}</h3> : b.ul ? <ul key={i}>{b.ul.map((x, j) => <li key={j}>{x}</li>)}</ul> : <p key={i}>{b.p}</p>,
            )}
          </div>
        </div>
      </section>
    </>
  )
}
