import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles.css'
import App from './App'
// Stale chunks after a deploy: handled by the route loaders in routes.ts (one reload, then a branded error
// screen). No vite:preloadError preventDefault here: Vite then resolves the import as undefined.

const el = document.getElementById('root')!
const tree = (
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <App />
    </BrowserRouter>
  </StrictMode>
)
// Prerendered routes hydrate; anything else (dev server) renders fresh.
if (el.firstElementChild) hydrateRoot(el, tree, { onRecoverableError: () => {} })
else createRoot(el).render(tree)
