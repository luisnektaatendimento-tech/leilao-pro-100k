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
  const r = 9
  const c = 2 * Math.PI * r
  return (
    <div className="relative" aria-live="polite">
      <div
        className="flex items-center gap-2.5 rounded-full border py-1.5 pl-2 pr-3.5 transition-all duration-1000"
        style={{ borderColor: n >= total ? 'rgb(var(--acc-rgb) / .6)' : 'rgb(237 234 228 / .1)', boxShadow: n >= total ? '0 0 40px -8px rgb(var(--acc-rgb) / .55)' : undefined }}
        title="Imóveis vistos neste navegador"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" className="-rotate-90" aria-hidden>
          <circle cx="12" cy="12" r={r} fill="none" stroke="rgb(237 234 228 / .12)" strokeWidth="1.5" />
          <circle cx="12" cy="12" r={r} fill="none" stroke="var(--acc)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - n / total)} style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.16,1,.3,1)' }} />
        </svg>
        <span className={`label hidden sm:inline ${n >= total ? '!text-[var(--acc)]' : '!text-ink-2'}`}>{n >= total ? 'Todos vistos' : 'Vistos'}</span>
        <span key={pulse} className="mono text-[12px] text-ink" style={{ animation: pulse ? 'unlock .9s cubic-bezier(.16,1,.3,1)' : undefined }}>
          {pad2(n)}<span className="text-mute">/{pad2(total)}</span>
        </span>
      </div>
      {show && (
        <div key={show.id} className="glass fixed left-8 top-24 hidden w-[300px] rounded-xl p-4 md:block" style={{ animation: 'toast 3.2s cubic-bezier(.16,1,.3,1) forwards', background: 'rgb(14 14 16 / .9)' }}>
          <p className="label flex items-center gap-1.5 !text-[var(--acc)]">
            <Icon name="spark" size={12} /> Estudo explorado
          </p>
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
    <div ref={ref} className="pointer-events-none fixed inset-0 z-40">
      <div className="hud pointer-events-auto absolute inset-x-0 top-0 flex items-center justify-between gap-3 px-4 py-4 md:px-8 md:py-6">
        <div className="flex min-w-0 items-center gap-3">
          <button className="icon-btn bg-black/30 backdrop-blur-md" onClick={goHome} aria-label="Voltar aos estudos (Esc)" title="Voltar aos estudos · Esc">
            <Icon name="back" />
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
            <button className="icon-btn hidden md:inline-grid" aria-pressed={p.snap} onClick={() => prefs.toggle('snap')} aria-label="Snap entre imóveis (S)" title={`Snap ${p.snap ? 'ligado' : 'desligado'} · S`}>
              <Icon name="snap" />
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

      {/* rodapé: um segmento por imóvel */}
      <div className="hud pointer-events-auto absolute bottom-0 right-0 w-full px-4 pb-4 md:w-[calc(100%_-_42vw)] md:px-[3.6vw] md:pb-6">
        <nav className="flex gap-2" aria-label="Imóveis">
          {studies.map((s, i) => (
            <button
              key={s.slug}
              onClick={() => goTo(i)}
              className="group flex-1 text-left"
              aria-label={`Ir para ${s.title}`}
              aria-current={i === index ? 'step' : undefined}
            >
              <span
                className="block h-[2px] rounded-full transition-all duration-700 group-hover:h-[4px]"
                style={{ background: i === index ? 'var(--acc)' : visited.has(s.slug) ? 'rgb(237 234 228 / .45)' : 'rgb(237 234 228 / .14)' }}
              />
              <span className={`mt-2 hidden truncate text-[11px] transition-colors duration-500 sm:block ${i === index ? 'text-ink' : 'text-mute group-hover:text-ink-2'}`}>
                <span className="mono mr-1.5">{pad2(i + 1)}</span>
                {s.title}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
})
export default HUD
