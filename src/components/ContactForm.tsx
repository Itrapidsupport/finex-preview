import { useState, type FormEvent } from 'react'
import { PROGRAMS, SITE } from '../data/site'

/**
 * Quote form, NO BACKEND: submit composes an email to general@ in the visitor's mail app (mailto built in
 * JS, never as form action). Fields mirror the live site form: name, email, phone, address, company + message.
 */
export default function ContactForm() {
  const [err, setErr] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)
  const validate = (f: HTMLFormElement) => {
    const d = new FormData(f)
    const v = (k: string) => String(d.get(k) ?? '').trim()
    const errs: Record<string, string> = {}
    if (!v('name')) errs.name = 'Please enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(v('email'))) errs.email = 'Please enter a valid email.'
    if (!v('message')) errs.message = 'Tell us briefly what needs to be done.'
    return { errs, v }
  }
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { errs, v } = validate(e.currentTarget)
    setErr(errs)
    if (Object.keys(errs).length) {
      document.getElementById(`f-${Object.keys(errs)[0]}`)?.focus()
      return
    }
    const body = [`Name: ${v('name')}`, `Email: ${v('email')}`, `Phone: ${v('phone')}`, `Address: ${v('address')}`, `Company: ${v('company')}`, `Service: ${v('topic')}`, '', v('message')].join('\n')
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent('Quote request: ' + (v('company') || v('name')))}&body=${encodeURIComponent(body)}`
    setSent(true)
  }
  const onInput = (e: FormEvent<HTMLFormElement>) => {
    if (!Object.keys(err).length) return
    setErr(validate(e.currentTarget).errs)
  }
  const F = ({ id, label, type = 'text', auto, opt, wide }: { id: string; label: string; type?: string; auto?: string; opt?: boolean; wide?: boolean }) => (
    <div className={`fld ${wide ? 'sm:col-span-2' : ''}`}>
      <label htmlFor={`f-${id}`}>{label} {opt && <span className="c-mute font-normal">(optional)</span>}</label>
      <input id={`f-${id}`} name={id} type={type} autoComplete={auto} aria-invalid={!!err[id]} aria-describedby={err[id] ? `e-${id}` : undefined} />
      {err[id] && <p id={`e-${id}`} className="fld-err">{err[id]}</p>}
    </div>
  )
  return (
    <form onSubmit={submit} onInput={onInput} noValidate action="#quote" className="grid gap-x-8 gap-y-7 sm:grid-cols-2" aria-describedby="form-note">
      {F({ id: 'name', label: 'Name', auto: 'name' })}
      {F({ id: 'email', label: 'Email', type: 'email', auto: 'email' })}
      {F({ id: 'phone', label: 'Phone', type: 'tel', auto: 'tel', opt: true })}
      {F({ id: 'company', label: 'Company', auto: 'organization', opt: true })}
      {F({ id: 'address', label: 'Site address', auto: 'street-address', opt: true, wide: true })}
      <div className="fld sm:col-span-2">
        <label htmlFor="f-topic">Service</label>
        <select id="f-topic" name="topic" defaultValue="Not sure yet">
          <option>Not sure yet</option>
          {PROGRAMS.map((p) => <option key={p.slug}>{p.name}</option>)}
          <option>A single trade job</option>
        </select>
      </div>
      <div className="fld sm:col-span-2">
        <label htmlFor="f-message">What needs to be done?</label>
        <textarea id="f-message" name="message" rows={5} aria-invalid={!!err.message} aria-describedby={err.message ? 'e-message' : undefined} />
        {err.message && <p id="e-message" className="fld-err">{err.message}</p>}
      </div>
      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p id="form-note" className="t-small c-mute">Opens your email app, addressed to {SITE.email}. Nothing is sent from this page.</p>
        <button type="submit" className="btn">Send request <span className="arr" aria-hidden>→</span></button>
      </div>
      <p role="status" aria-live="polite" className="t-small sm:col-span-2">
        {sent ? <>Your email app should open now. If it did not, email <a className="underline underline-offset-4" href={`mailto:${SITE.email}`}>{SITE.email}</a> or call <a className="underline underline-offset-4" href={SITE.tollFreeHref}>{SITE.tollFree}</a>.</> : ''}
      </p>
    </form>
  )
}
