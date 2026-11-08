import { forwardRef, useEffect, useState } from 'react'
import { useStudy } from './ctx'
import { studies } from '../data/studies'
import { pad2 } from '../lib/format'
import { prefs, usePrefs } from '../lib/prefs'
import { Icon } from '../components/Icon'
import { SoundButton } from '../components/Prefs'
import { Brand } from '../components/Brand'

export interface Toast {
  id: string
  value: string
  label: string
}

function SeenCounter({ toast }: { toast: Toast | null }) {
  const { visited } = useStudy()
  const total = studies.length
  const n = visited.size
  const [pulse, setPulse] = useState(0)
  const [show, setShow] = useState<Toast | null>(null)
  useEffect(() => {
    if (!toast) return
    setPulse((p) => p + 1)
    setShow(toast)
    const t = setTimeout(() => setShow(null), 3200)
    return () => clearTimeout(t)
  }, [toast])
  return (
    <div className="relative" aria-live="polite">
      <div
        className="flex h-9 items-center gap-2 rounded-full px-3.5 transition-all duration-1000"
        style={{ background: n >= total ? 'rgb(var(--acc-rgb) / .16)' : 'var(--color-fill)' }}
        title="Imóveis vistos neste navegador"
      >
        <span className="h-2 w-2 rounded-full" style={{ background: 'var(--acc)', boxShadow: '0 0 0 3px rgb(var(--acc-rgb) / .2)' }} />
        <span key={pulse} className="mono text-[13px] font-bold text-ink" style={{ animation: pulse ? 'unlock .9s cubic-bezier(.16,1,.3,1)' : undefined }}>
          {pad2(n)}/{pad2(total)}
        </span>
        <span className="text-[13px] text-ink-2">{n >= total ? 'todos vistos' : 'vistos'}</span>
      </div>
      {show && (
        <div key={show.id} className="fx-card fixed left-[3vw] top-[100px] z-50 hidden w-[310px] p-4 shadow-[0_30px_60px_-20px_#000] md:block" style={{ animation: 'toast 3.2s cubic-bezier(.16,1,.3,1) forwards' }}>
          <span className="fx-pill fx-tinted px-2.5 py-1 text-[11px]">
            <Icon name="bolt" size={12} stroke={2} /> Estudo explorado
          </span>
          <p className="mt-2 text-[18px] font-semibold tracking-tight text-ink">{show.value}</p>
          <p className="mt-0.5 text-[12px] text-ink-2">{show.label}</p>
        </div>
      )}
    </div>
  )
}

const HUD = forwardRef<HTMLDivElement, { onMap: () => void; toast: Toast | null }>(function HUD({ onMap, toast }, ref) {
  const { index, goTo, visited, goHome } = useStudy()
  const p = usePrefs()
  const [fs, setFs] = useState(!!document.fullscreenElement)
  useEffect(() => {
    const f = () => setFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', f)
    return () => document.removeEventListener('fullscreenchange', f)
  }, [])

  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 z-40 hidden md:block">
      <div className="hud pointer-events-auto absolute inset-x-0 top-0 flex items-center justify-between gap-3 bg-gradient-to-b from-[#0b0c0e] via-[#0b0c0e]/90 to-transparent px-4 pb-6 pt-3 md:bg-none md:px-8 md:py-6">
        <div className="flex min-w-0 items-center gap-3">
          <button className="fx-pill h-9 pl-1 pr-2 text-[17px] font-normal text-[var(--acc)] transition-opacity hover:opacity-70" onClick={goHome} aria-label="Voltar aos estudos (Esc)" title="Voltar aos estudos · Esc">
            <Icon name="left" size={22} stroke={2.2} /> Estudos
          </button>
          <span className="hud-optional hidden md:inline-flex">
            <Brand />
          </span>
        </div>
        <div className="flex items-center gap-2">
          <SeenCounter toast={toast} />
          <div className="hud-optional flex items-center gap-2">
            <button className="icon-btn" onClick={onMap} aria-label="Mapa dos estudos (M)" title="Mapa · M">
              <Icon name="map" />
            </button>
            <SoundButton />
            <button
              className="icon-btn hidden md:inline-grid"
              aria-pressed={fs}
              onClick={() => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.().catch(() => {}))}
              aria-label="Tela cheia (F)"
              title="Tela cheia · F"
            >
              <Icon name="full" />
            </button>
          </div>
          <button className="icon-btn hidden md:inline-grid" aria-pressed={p.presenter} onClick={() => prefs.toggle('presenter')} aria-label="Modo apresentador (P)" title="Modo apresentador · P">
            <Icon name="present" />
          </button>
        </div>
      </div>

      {/* rodapé: abas-pílula por imóvel (estilo Fexô) + contador com traço */}
      <div className="hud pointer-events-auto absolute inset-x-0 bottom-0 flex items-center gap-4 bg-gradient-to-t from-[#0b0c0e] via-[#0b0c0e]/90 to-transparent px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-8 md:bg-none md:px-[3vw] md:pb-6 md:pt-0">
        <span className="mono hidden items-center gap-2 text-[12px] font-semibold text-ink md:flex">
          {pad2(index + 1)} <span className="text-mute">/ {pad2(studies.length)}</span>
          <span className="relative ml-1 block h-[3px] w-12 overflow-hidden rounded-full bg-white/15">
            <span className="absolute inset-y-0 left-0 rounded-full transition-all duration-700" style={{ width: `${((index + 1) / studies.length) * 100}%`, background: 'var(--acc)' }} />
          </span>
        </span>
        <nav className="flex min-w-0 flex-1 justify-center" aria-label="Imóveis">
          <div className="seg max-w-full overflow-x-auto [scrollbar-width:none]" style={{ background: 'rgb(44 44 46 / .72)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', borderRadius: 14, padding: 3 }}>
            {studies.map((s, i) => {
              const cur = i === index
              return (
                <button
                  key={s.slug}
                  onClick={() => goTo(i)}
                  className="flex flex-none items-center gap-1.5 !rounded-[11px] !px-3.5 !py-1.5"
                  aria-label={`Ir para ${s.title}`}
                  aria-current={cur ? 'step' : undefined}
                >
                  {visited.has(s.slug) && !cur ? <span className="text-[var(--color-green)]"><Icon name="check" size={12} stroke={2.4} /></span> : <span className="mono text-[11px] opacity-60">{pad2(i + 1)}</span>}
                  <span className={cur ? 'max-w-[40vw] truncate sm:max-w-none' : 'hidden sm:inline'}>{s.title}</span>
                </button>
              )
            })}
          </div>
        </nav>
        <span className="hidden w-[88px] md:block" aria-hidden />
      </div>
    </div>
  )
})
export default HUD
