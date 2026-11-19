import { Component, Suspense, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

/** A route that throws (e.g. its chunk is gone after a deploy and the one auto-reload already ran). */
export class RouteBoundary extends Component<{ children: ReactNode; resetKey: string }, { err: boolean }> {
  state = { err: false }
  static getDerivedStateFromError() { return { err: true } }
  componentDidUpdate(prev: { resetKey: string }) { if (prev.resetKey !== this.props.resetKey && this.state.err) this.setState({ err: false }) }
  render() { return this.state.err ? <RouteError /> : this.props.children }
}

function RouteError() {
  return (
    <section className="theme-ink" data-theme="dark" aria-labelledby="re-h">
      <div className="wrap pt-[clamp(48px,8vw,128px)] pb-[clamp(72px,9vw,144px)] min-h-[calc(100svh-var(--fx-header-h))]">
        <p className="t-label c-coral">Updated</p>
        <h1 id="re-h" className="t-l mt-6" tabIndex={-1}>This page was just updated.</h1>
        <p className="t-lead on-dark-mute mt-8 max-w-[34em]">A newer version of the site went live while this tab was open. Reload to get it.</p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
          <button type="button" className="btn btn-coral" onClick={() => window.location.reload()}>Reload the page <span className="arr" aria-hidden>→</span></button>
          <Link to="/" reloadDocument className="link-u text-white">Back to home</Link>
        </div>
      </div>
    </section>
  )
}


/** Inside Layout (header + footer always stay). One persistent Suspense boundary: router navigations run
 *  in a transition, so the old page stays up while a chunk loads; the fallback itself is ink, never paper. */
export function RouteShell({ children, resetKey }: { children: ReactNode; resetKey: string }) {
  return (
    <RouteBoundary resetKey={resetKey}>
      <Suspense fallback={<div className="min-h-[100svh] bg-[#15182A]" aria-busy="true" />}>{children}</Suspense>
    </RouteBoundary>
  )
}
