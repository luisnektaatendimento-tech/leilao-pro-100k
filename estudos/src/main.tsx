import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Tipografia do design system Fexô: Inter (variável, auto-hospedada).
import '@fontsource-variable/inter'
import './styles/index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
