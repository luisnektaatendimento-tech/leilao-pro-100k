import { forwardRef, useEffect, useState } from 'react'
import { useStudy } from './ctx'
import { CHAPTERS } from '../lib/scenes'
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

function InsightCounter({ total, toast }: { total: number; toast: Toast | null }) {
  const { unlocked } = useStudy()
  const n = unlocked.size
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
      <div className="flex items-center gap-2.5 rounded-full border border-white/10 py-1.5 pl-2 pr-3.5">
        <svg width="24" height="24" viewBox="0 0 24 24" className="-rotate-90" aria-hidden>
          <circle cx="12" cy="12" r={r} fill="none" stroke="rgb(237 234 228 / .12)" strokeWidth="1.5" />
          <circle cx="12" cy="12" r={r} fill="none" stroke="var(--acc)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - n / total)} style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.16,1,.3,1)' }} />
        </svg>
        <span className="label !text-ink-2 hidden sm:inline">Insights</span>
        <span key={pulse} className="mono text-[12px] text-ink" style={{ animation: pulse ? 'unlock .9s cubic-bezier(.16,1,.3,1)' : undefined }}>
          {pad2(n)}<span className="text-mute">/{pad2(total)}</span>
        </span>
      </div>
      {show && (
        <div key={show.id} className="glass absolute right-0 hidden sm:block top-[calc(100%_+_12px)] w-[280px] rounded-xl p-4" style={{ animation: 'toast 3.2s cubic-bezier(.16,1,.3,1) forwards' }}>
          <p className="label flex items-center gap-1.5 !text-[var(--acc)]">
            <Icon name="spark" size={12} /> Insight desbloqueado
          </p>
          <p className="mt-2 text-[20px] font-light tracking-tight text-ink">{show.value}</p>
          <p className="mt-0.5 text-[12px] text-ink-2">{show.label}</p>
        </div>
      )}
    </div>
  )
}

const HUD = forwardRef<HTMLDivElement, { onMap: () => void; toast: Toast | null; insightTotal: number }>(function HUD({ onMap, toast, insightTotal }, ref) {
  const { study, scenes, index, goTo, visited, goHome } = useStudy()
  const p = usePrefs()
  const [fs, setFs] = useState(!!document.fullscreenElement)
  useEffect(() => {
    const f = () => setFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', f)
    return () => document.removeEventListener('fullscreenchange', f)
  }, [])
  const chapter = scenes[index].chapter
  const groups = CHAPTERS.map((name, c) => ({ name, c, items: scenes.map((s, i) => ({ s, i })).filter((x) => x.s.chapter === c) })).filter((g) => g.items.length)

  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 z-40">
      {/* topo */}
      <div className="hud pointer-events-auto absolute inset-x-0 top-0 flex items-center justify-between gap-3 px-4 py-4 md:px-8 md:py-6">
        <div className="flex min-w-0 items-center gap-3">
          <button className="icon-btn" onClick={goHome} aria-label="Voltar aos estudos (Esc)" title="Voltar aos estudos · Esc">
            <Icon name="back" />
          </button>
          <span className="hud-optional hidden md:inline-flex">
            <Brand compact />
          </span>
          <span className="hud-optional hidden truncate text-[13px] text-ink-2 sm:inline">{study.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <InsightCounter total={insightTotal} toast={toast} />
          <div className="hud-optional flex items-center gap-2">
            <button className="icon-btn" onClick={onMap} aria-label="Mapa de capítulos (M)" title="Mapa · M">
              <Icon name="map" />
            </button>
            <button className="icon-btn hidden md:inline-grid" aria-pressed={p.snap} onClick={() => prefs.toggle('snap')} aria-label="Snap entre cenas (S)" title={`Snap ${p.snap ? 'ligado' : 'desligado'} · S`}>
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

      {/* rodapé: progresso segmentado por capítulo */}
      <div className="hud pointer-events-auto absolute inset-x-0 bottom-0 px-4 pb-4 md:px-8 md:pb-6">
        <div className="flex items-end justify-between gap-4 pb-3">
          <span className="label">
            <span className="text-ink">Nível {chapter + 1}</span> · {CHAPTERS[chapter]}
          </span>
          <span className="mono text-[12px] text-ink-2">
            {pad2(index + 1)} <span className="text-mute">/ {pad2(scenes.length)}</span>
          </span>
        </div>
        <nav className="flex gap-3" aria-label="Linha do tempo de cenas">
          {groups.map((g) => (
            <div key={g.c} className="flex flex-1 flex-col gap-2" style={{ flexGrow: g.items.length }}>
              <div className="flex gap-[3px]">
                {g.items.map(({ s, i }) => (
                  <button
                    key={s.id}
                    onClick={() => goTo(i)}
                    className="group relative h-5 flex-1"
                    aria-label={`Ir para cena ${i + 1}: ${s.title}`}
                    aria-current={i === index ? 'step' : undefined}
                    title={`${pad2(i + 1)} · ${s.title}`}
                  >
                    <span
                      className="absolute inset-x-0 top-1/2 block h-[2px] -translate-y-1/2 rounded-full transition-all duration-700 group-hover:h-[4px]"
                      style={{
                        background: i === index ? 'var(--acc)' : i < index ? 'rgb(237 234 228 / .55)' : visited.has(i) ? 'rgb(237 234 228 / .28)' : 'rgb(237 234 228 / .12)',
                      }}
                    />
                    {s.insight && <span className="absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 rounded-full bg-white/30" aria-hidden />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
})
export default HUD
