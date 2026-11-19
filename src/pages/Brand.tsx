import { BASE } from '../lib/env'
import brand from '../data/brand.json'
import { Idx, PageHero } from '../components/ui'

type F = { label: string; file: string; png: string; pngMB: number; bg: 'white' | 'ink'; preview: string; note: string }

const SW = [
  { name: 'Coral', hex: '#E07880', fg: '#15182A' },
  { name: 'Blush', hex: '#F8D8D8', fg: '#15182A' },
  { name: 'Navy', hex: '#4F588B', fg: '#FFFFFF' },
  { name: 'Sky', hex: '#B6D9F3', fg: '#15182A' },
  { name: 'Ink', hex: '#15182A', fg: '#FFFFFF' },
]

export default function Brand() {
  const files = brand as F[]
  return (
    <>
      <PageHero label="Brand assets" title="The Finex logo." lead="Vector SVG for screens and print, plus 12,288-pixel PNG masters with transparent backgrounds. Colours sampled from the original artwork." tone="paper" art={false} />
      <section className="sec pt-0 theme-paper" data-theme="light" aria-labelledby="bf-h">
        <div className="wrap">
          <Idx n="01" label="Logo files" />
          <h2 id="bf-h" className="sr-only">Logo files</h2>
          <ul className="bgrid">
            {files.map((f) => (
              <li key={f.file} className="bcard">
                <div className="bcard-art" style={{ background: f.bg === 'ink' ? '#15182A' : '#fff' }}>
                  <img src={`${BASE}${f.preview}`} alt={`${f.label} preview`} loading="lazy" width={320} height={320} />
                </div>
                <div className="bcard-meta">
                  <div>
                    <p className="t-h4">{f.label}</p>
                    <p className="t-small c-mute mt-1">{f.note}</p>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <a className="lnk" href={`${BASE}${f.file}`} download>SVG <span aria-hidden className="arr">↓</span></a>
                    <a className="lnk" href={`${BASE}${f.png}`} download>PNG 12,288 px, {f.pngMB} MB <span aria-hidden className="arr">↓</span></a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-[clamp(56px,7vw,112px)]">
            <Idx n="02" label="Colours" />
            <ul className="swatches">
              {SW.map((s) => (
                <li key={s.hex} className="swatch" style={{ background: s.hex, color: s.fg }}>
                  <span className="t-h4">{s.name}</span>
                  <span className="tnum">{s.hex}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
