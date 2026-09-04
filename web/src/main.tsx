import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Side-effect import, deliberately first: attaches the beforeinstallprompt
// listener as early as possible, before React even starts rendering — see
// installPrompt.ts for why the timing here matters.
import './lib/installPrompt'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
