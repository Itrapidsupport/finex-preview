import { AnimatePresence, motion } from 'framer-motion'
import type { ProcessStep } from './PinnedProcess'
import { EASE } from './env'

/** Pinned stage of PinnedProcess (lazy chunk: framer-motion only loads on wide screens with motion allowed). */
export default function PinnedStage({ steps, active, go }: { steps: ProcessStep[]; active: number; go: (i: number) => void }) {
  const n = steps.length
  const s = steps[active]
  return (
      <div className="mk-process-stage" aria-hidden>
        <div className="mk-process-copy">
          <nav className="mk-process-rail">
            {steps.map((x, i) => (
              <button key={i} type="button" tabIndex={-1} className={`mk-process-tab ${i === active ? 'is-active' : ''}`} onClick={() => go(i)}>
                <span>{String(i + 1).padStart(2, '0')}</span> {x.title}
              </button>
            ))}
            <span className="mk-process-progress" style={{ transform: `scaleY(${(active + 1) / n})` }} />
          </nav>
          <div className="mk-process-active">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45, ease: EASE }} className="mk-process-panel" data-mk-panel="">
                <span className="mk-process-num">{String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
                <h3 className="mk-process-title">{s.title}</h3>
                <div className="mk-process-body">{s.body}</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="mk-process-visual">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={active} className="mk-process-visual-inner" initial={{ clipPath: 'inset(100% 0% 0% 0%)' }} animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              exit={{ clipPath: 'inset(0% 0% 100% 0%)' }} transition={{ duration: 0.5, ease: EASE }}>
              {s.visual}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
  )
}
