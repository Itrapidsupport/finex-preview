import { Btn, PageHero } from '../components/ui'

export default function NotFound() {
  return (
    <PageHero label="404" title="This page does not exist." lead="The link may be old or mistyped. Everything Finex offers is one click away." tone="ink" variant={4}>
      <div className="mt-10 in-rise" style={{ animationDelay: '500ms' }}>
        <Btn to="/" className="btn btn-coral">Back to home</Btn>
      </div>
    </PageHero>
  )
}
