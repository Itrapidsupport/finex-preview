import { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import { prefetchAllOnIdle, prefetchPath, route } from './routes'

const Services = route('services')
const ServiceDetail = route('serviceDetail')
const Projects = route('projects')
const ProjectDetail = route('projectDetail')
const About = route('about')
const Community = route('community')
const Contact = route('contact')
const Brand = route('brand')
const Privacy = route('privacy')
const NotFound = route('notFound')

/** Bridges raw <a> CTAs (MagneticButton) to client-side navigation; prefetches route chunks on intent. */
function NavBridge() {
  const nav = useNavigate()
  useEffect(() => {
    const on = (e: Event) => nav((e as CustomEvent<string>).detail)
    window.addEventListener('fx:navigate', on)
    const intent = (e: Event) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="/"]') as HTMLAnchorElement | null
      if (a) prefetchPath(a.getAttribute('href')!)
    }
    document.addEventListener('pointerover', intent, { passive: true })
    document.addEventListener('focusin', intent)
    document.addEventListener('touchstart', intent, { passive: true })
    prefetchAllOnIdle()
    return () => {
      window.removeEventListener('fx:navigate', on)
      document.removeEventListener('pointerover', intent)
      document.removeEventListener('focusin', intent)
      document.removeEventListener('touchstart', intent)
    }
  }, [nav])
  return null
}

export default function App() {
  return (
    <>
      <NavBridge />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetail />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          <Route path="about" element={<About />} />
          <Route path="community" element={<Community />} />
          <Route path="contact" element={<Contact />} />
          <Route path="brand" element={<Brand />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}
