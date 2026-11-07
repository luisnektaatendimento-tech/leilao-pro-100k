import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Tipografia do design system Fexô: Inter (variável, auto-hospedada).
import '@fontsource-variable/inter'
import './styles/index.css'
import App from './App'
import gsap from 'gsap'

// animações seguem o relógio mesmo com quadros lentos (contadores sempre terminam no valor exato)
gsap.ticker.lagSmoothing(0)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
