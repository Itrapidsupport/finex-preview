import { SITE } from '../data/site'
import ContactForm from '../components/ContactForm'
import { Idx, PageHero, PhotoBand } from '../components/ui'
import { STOCK } from '../data/stock'

export default function Contact() {
  return (
    <>
      <PageHero label="Contact" title="Get a quote." lead={`For any inquiries, questions or commendations, call ${SITE.tollFree} or send the details below.`} tone="coral" variant={2}>
        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 in-rise" style={{ animationDelay: '500ms' }}>
          <a className="lnk t-h4" href={SITE.tollFreeHref}>Toll free {SITE.tollFree}</a>
          <a className="lnk t-h4" href={SITE.phoneHref}>T {SITE.phone}</a>
        </div>
      </PageHero>
      <section className="sec theme-white" data-theme="light" aria-labelledby="fm-h" id="quote">
        <div className="wrap grid12 gap-y-16">
          <div className="col-span-4 sm:col-span-8 lg:col-span-7">
            <Idx n="01" label="Request a quote" />
            <h2 id="fm-h" className="t-h2 mb-10">Tell us what needs to be done.</h2>
            <ContactForm />
          </div>
          <aside className="col-span-4 sm:col-span-8 lg:col-start-9 lg:col-span-4" aria-label="Contact details">
            <Idx n="02" label="Head office" />
            <address className="not-italic t-h4">
              {SITE.name}<br />{SITE.street}<br />{SITE.city}, {SITE.region} {SITE.postal}
            </address>
            <a className="lnk mt-5" href={SITE.mapUrl} target="_blank" rel="noopener">Open in Google Maps <span aria-hidden className="arr">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
            <dl className="cdl mt-12">
              <div><dt>Telephone</dt><dd><a className="link-u" href={SITE.phoneHref}>{SITE.phone}</a></dd></div>
              <div><dt>Toll free</dt><dd><a className="link-u" href={SITE.tollFreeHref}>{SITE.tollFree}</a></dd></div>
              <div><dt>Email</dt><dd><a className="link-u" href={`mailto:${SITE.email}`}>{SITE.email}</a></dd></div>
            </dl>
            <div className="emp mt-14">
              <p className="t-label">Employment</p>
              <p className="mt-4 c-mute">To apply for a job with Finex Development, send a cover letter together with your resume to</p>
              <a className="lnk mt-3" href={`mailto:${SITE.hrEmail}`}>{SITE.hrEmail}</a>
            </div>
          </aside>
        </div>
      </section>
      <PhotoBand id="ct-band-h" photo={STOCK.toronto} label="Head office" text="Mississauga, Ontario. Serving clients in all 10 provinces." />
    </>
  )
}
