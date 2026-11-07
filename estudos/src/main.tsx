import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Tipografia Apple: SF Pro / SF Mono nativos em Mac e iPhone.
// Fora do ecossistema Apple (Windows/Android), o fallback é Inter + JetBrains Mono.
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import './styles/index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
