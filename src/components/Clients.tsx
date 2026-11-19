import clients from '../data/clients.json'
import { BASE } from '../lib/env'
import { Head, Idx } from './ui'

type C = { name: string; file: string; w: number; h: number }

/** Client logo wall (logos as shown in the live site's CLIENTS section). Hidden until logos exist. */
export default function Clients({ n }: { n?: string }) {
  const list = clients as C[]
  if (!list.length) return null
  return (
    <section className="sec theme-paper" data-theme="light" aria-labelledby="cl-h">
      <div className="wrap">
        <Idx n={n} label="Clients" />
        <Head className="t-l max-w-[14ch]"><span id="cl-h">Trusted by the brands we maintain.</span></Head>
        <ul className="clients mt-[clamp(40px,5vw,72px)]">
          {list.map((c) => (
            <li key={c.file}><img src={`${BASE}logos/${c.file}`} width={c.w} height={c.h} alt={c.name} loading="lazy" decoding="async" /></li>
          ))}
        </ul>
      </div>
    </section>
  )
}
