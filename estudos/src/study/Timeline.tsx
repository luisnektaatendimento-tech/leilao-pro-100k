import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import type { Study } from '../data/types'
import { buildTimeline, type TPhase } from '../lib/timeline'
import { brl, pad2, pct } from '../lib/format'
import { reducedMotion, useMedia } from '../lib/media'
import { sound } from '../lib/sound'
import { Icon } from '../components/Icon'

const signed = (v: number) => (v < 0 ? `−${brl(-v)}` : v > 0 ? `+${brl(v)}` : brl(0))

/** Linha do tempo dos pagamentos: etapa por etapa, com o saldo do investidor. */
export default function Timeline({ study: s, onClose }: { study: Study; onClose: () => void }) {
  const [sc, setSc] = useState<0 | 1>(s.heroScenario)
  const phases = useMemo(() => buildTimeline(s, sc), [s, sc])
  const mobile = useMedia('(max-width: 767px)')
  return (
    <div className="flex min-h-0 flex-col gap-4 md:h-full">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button className="fx-pill h-8 flex-none pl-0.5 pr-2 text-[15px] font-normal text-[var(--acc)] hover:opacity-70" onClick={onClose} aria-label="Voltar à visão geral (L)">
            <Icon name="left" size={20} stroke={2.2} /> Visão geral
          </button>
          <div className="min-w-0">
            <p className="label">Linha do tempo dos pagamentos</p>
            <p className="truncate text-[15px] font-semibold tracking-tight text-ink">{s.title}</p>
          </div>
        </div>
        <div className="seg" role="group" aria-label="Cenário">
          {s.scenarios.map((x, i) => (
            <button
              key={x.months}
              onClick={() => setSc(i as 0 | 1)}
              aria-pressed={sc === i}
            >
              Venda em {x.months} meses
            </button>
          ))}
        </div>
      </header>
      {mobile ? <Vertical phases={phases} study={s} sc={sc} /> : <Stepper key={sc} phases={phases} study={s} sc={sc} onClose={onClose} />}
      <p className="text-[11px] leading-snug text-mute">
        Ordem típica de uma compra em leilão; prazos e formas de pagamento seguem o edital de cada imóvel. Valores do estudo.
      </p>
    </div>
  )
}

/* ───────────── desktop: etapa por etapa ───────────── */
function Stepper({ phases, study: s, sc, onClose }: { phases: TPhase[]; study: Study; sc: 0 | 1; onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const detail = useRef<HTMLDivElement>(null)
  const posEl = useRef<HTMLSpanElement>(null)
  const prevPos = useRef(0)
  const last = phases.length - 1
  const p = phases[step]
  const go = (i: number) => {
    const c = Math.max(0, Math.min(last, i))
    if (c !== step) sound.click()
    setStep(c)
  }

  // teclado / roda / swipe dentro da linha do tempo
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'ArrowRight' || (e.key === ' ' && !e.shiftKey)) (e.preventDefault(), setPlaying(false), go(step + 1))
      else if (e.key === 'ArrowLeft' || (e.key === ' ' && e.shiftKey)) (e.preventDefault(), setPlaying(false), go(step - 1))
      else if (e.key === 'Escape' || e.key.toLowerCase() === 'l') (e.preventDefault(), onClose())
    }
    let lock = 0
    const wheel = (e: WheelEvent) => {
      e.preventDefault()
      const now = performance.now()
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (now < lock || Math.abs(d) < 8) return
      lock = now + 700
      setPlaying(false)
      go(step + (d > 0 ? 1 : -1))
    }
    addEventListener('keydown', key)
    addEventListener('wheel', wheel, { passive: false })
    return () => {
      removeEventListener('keydown', key)
      removeEventListener('wheel', wheel)
    }
  })

  // reprodução automática
  useEffect(() => {
    if (!playing) return
    if (step >= last) return setPlaying(false)
    const t = setTimeout(() => go(step + 1), 3600)
    return () => clearTimeout(t)
  })

  // entrada de cada etapa + contador do saldo
  useLayoutEffect(() => {
    const el = detail.current
    if (!el) return
    const rm = reducedMotion()
    if (!rm) {
      gsap.fromTo(el.querySelectorAll('[data-t]'), { y: 18, opacity: 0, filter: 'blur(6px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.7, ease: 'expo.out', stagger: 0.06, clearProps: 'filter' })
    }
    const o = { v: prevPos.current }
    const to = p.position
    const tw = gsap.to(o, {
      v: to,
      duration: rm ? 0 : 1,
      ease: 'power3.out',
      onUpdate: () => {
        if (posEl.current) posEl.current.textContent = signed(tw.progress() > 0.92 ? to : Math.round(o.v * 100) / 100)
      },
      onComplete: () => {
        if (posEl.current) posEl.current.textContent = signed(to)
      },
    })
    prevPos.current = to
    return () => {
      tw.kill()
    }
  }, [step, p.position])

  const sx = s.scenarios[sc]
  return (
    <div className="grid min-h-0 flex-1 grid-rows-[auto_1fr_auto] gap-4">
      {/* trilha */}
      <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${phases.length}, minmax(0,1fr))` }} aria-label="Etapas">
        <span className="absolute left-[6.25%] right-[6.25%] top-[15px] h-[2px] rounded bg-white/10" aria-hidden />
        <span
          className="absolute left-[6.25%] top-[15px] h-[2px] rounded transition-[width] duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
          style={{ width: `${(step / last) * 87.5}%`, background: 'var(--tint)', boxShadow: '0 0 12px var(--tint)' }}
          aria-hidden
        />
        {phases.map((ph, i) => {
          const done = i < step
          const cur = i === step
          return (
            <li key={ph.key} className="relative flex flex-col items-center px-1 text-center">
              <button
                onClick={() => (setPlaying(false), go(i))}
                aria-current={cur ? 'step' : undefined}
                aria-label={`Etapa ${i + 1}: ${ph.title}`}
                className="relative z-10 grid h-8 w-8 place-items-center rounded-full border text-[12px] font-bold transition-all duration-500"
                style={{
                  borderColor: cur || done ? 'var(--tint)' : 'rgb(255 255 255 / .18)',
                  background: cur ? 'var(--tint)' : done ? 'color-mix(in srgb, var(--tint) 22%, #0b0c0e)' : '#0b0c0e',
                  color: cur ? '#0b0c0e' : done ? 'var(--color-ink)' : 'var(--color-mute)',
                  boxShadow: cur ? '0 0 0 6px color-mix(in srgb, var(--tint) 18%, transparent)' : undefined,
                }}
              >
                {ph.key === 'resultado' ? <Icon name="check" size={14} stroke={2.4} /> : i + 1}
              </button>
              <span className={`mt-2 line-clamp-2 text-[11px] leading-tight transition-colors ${cur ? 'font-semibold text-ink' : done ? 'text-ink-2' : 'text-mute'}`}>{ph.title}</span>
              <span className={`mono mt-0.5 text-[10px] ${ph.total > 0 ? 'acc' : 'text-mute'}`}>{ph.key === 'resultado' ? '' : signed(ph.total)}</span>
            </li>
          )
        })}
      </ol>

      {/* etapa atual + saldo */}
      <div ref={detail} className="grid min-h-0 grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-4">
        <div className="fx-card flex min-h-0 flex-col p-5">
          <p className="label" data-t>
            Etapa {pad2(step + 1)} de {pad2(phases.length)} · <span style={{ color: 'var(--tint)' }}>{p.when}</span>
          </p>
          <h3 className="display mt-2 text-[clamp(1.6rem,2.4vw,2.6rem)]" data-t>
            {p.title}
          </h3>
          <p className="mt-1.5 text-[13px] leading-snug text-ink-2" data-t>
            {p.desc}
          </p>
          {p.key === 'resultado' ? (
            <div className="mt-auto grid grid-cols-2 gap-4 pt-4" data-t>
              <div>
                <p className="label">Lucro líquido · {sx.months} meses</p>
                <p className="num acc mt-1 text-[clamp(1.8rem,2.6vw,2.8rem)]">{brl(sx.netResult)}</p>
              </div>
              <div>
                <p className="label">{s.roiLabel}</p>
                <p className="num acc mt-1 text-[clamp(1.8rem,2.6vw,2.8rem)]">{pct(sx.netRoi)}</p>
              </div>
              <div>
                <p className="label">Maior valor aplicado</p>
                <p className="mono mt-1 text-[15px] font-semibold text-ink">{brl(sx.investment)}</p>
              </div>
              <div>
                <p className="label">Recebido na venda (líquido)</p>
                <p className="mono mt-1 text-[15px] font-semibold text-ink">{brl(sx.investment + sx.netResult)}</p>
              </div>
            </div>
          ) : (
            <>
              <ul className="mt-4 min-h-0 flex-1 overflow-auto [scrollbar-width:thin]">
                {p.items.map((it) => (
                  <li key={it.label} className="flex items-baseline justify-between gap-3 border-b border-white/[.06] py-2" data-t>
                    <span className={`min-w-0 text-[13px] ${it.flow === 0 || it.value === 0 ? 'text-mute' : 'text-ink-2'}`}>
                      {it.label}
                      {it.note && <span className="ml-1.5 text-[11px] text-mute">· {it.note}</span>}
                    </span>
                    <span className={`mono whitespace-nowrap text-[14px] font-semibold ${it.flow > 0 ? 'acc' : it.flow === 0 || it.value === 0 ? 'text-mute' : 'text-ink'}`}>
                      {it.flow === 0 ? brl(it.value) : signed(it.flow * it.value)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="fx-total mt-3 flex items-center justify-between px-4 py-2.5" data-t>
                <span className="text-[13px] font-semibold text-ink">{p.total >= 0 ? 'Entra nesta etapa' : 'Sai nesta etapa'}</span>
                <span className={`num whitespace-nowrap text-[18px] ${p.total > 0 ? 'acc' : 'text-ink'}`}>{signed(p.total)}</span>
              </div>
            </>
          )}
        </div>

        <div className="fx-card flex min-h-0 flex-col p-5">
          <p className="label">Saldo do investidor ao fim da etapa</p>
          <p className={`num mt-2 text-[clamp(1.8rem,3vw,3.2rem)] ${p.position > 0 ? 'acc' : 'text-ink'}`} aria-live="polite">
            <span ref={posEl}>{signed(p.position)}</span>
          </p>
          <p className="mt-1 text-[12px] text-ink-2">
            {p.position < 0 ? `Dinheiro aplicado até aqui: ${brl(-p.position)}` : `Já com o dinheiro de volta e ${p.key === 'venda' ? 'antes do imposto' : 'livre de imposto'}`}
          </p>
          <BalanceChart phases={phases} step={step} />
        </div>
      </div>

      {/* controles */}
      <div className="flex items-center justify-between gap-3">
        <button className="fx-pill fx-gray h-10 px-4 text-[14px] disabled:opacity-30" onClick={() => (setPlaying(false), go(step - 1))} disabled={step === 0}>
          <Icon name="left" size={15} /> Etapa anterior
        </button>
        <button
          className="fx-pill fx-gray h-10 px-4 text-[14px]"
          onClick={() => {
            if (step >= last) setStep(0)
            setPlaying((v) => !v)
          }}
          aria-pressed={playing}
        >
          <Icon name={playing ? 'pause' : 'play'} size={14} /> {playing ? 'Pausar' : step >= last ? 'Ver de novo' : 'Reproduzir'}
        </button>
        <button className="fx-pill fx-acc h-10 px-5 text-[14px] disabled:opacity-30" onClick={() => (setPlaying(false), go(step + 1))} disabled={step === last}>
          Próxima etapa <Icon name="right" size={15} />
        </button>
      </div>
    </div>
  )
}

/** Gráfico em degraus do saldo do investidor ao longo das etapas. */
function BalanceChart({ phases, step }: { phases: TPhase[]; step: number }) {
  const W = 520
  const H = 220
  const padX = 18
  const padY = 22
  const vals = [0, ...phases.map((p) => p.position)]
  const min = Math.min(...vals)
  const max = Math.max(...vals, 0)
  const y = (v: number) => padY + ((max - v) / (max - min || 1)) * (H - padY * 2)
  const n = phases.length
  const x = (i: number) => padX + (i / n) * (W - padX * 2)
  // degraus: começa em 0, cada etapa muda o nível
  let d = `M${x(0)} ${y(0)}`
  phases.forEach((p, i) => {
    const prev = i === 0 ? 0 : phases[i - 1].position
    d += ` L${x(i)} ${y(prev)} L${x(i)} ${y(p.position)} L${x(i + 1)} ${y(p.position)}`
  })
  const z = y(0)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-auto w-full" role="img" aria-label="Saldo do investidor por etapa">
      <line x1={padX} x2={W - padX} y1={z} y2={z} stroke="rgb(255 255 255 / .18)" strokeDasharray="3 4" />
      <text x={W - padX} y={z - 6} textAnchor="end" fontSize="10" fill="var(--color-mute)">
        zero
      </text>
      <clipPath id="upto">
        <rect x="0" y="0" width={x(step + 1)} height={H} style={{ transition: 'width .8s cubic-bezier(.16,1,.3,1)' }} />
      </clipPath>
      <path d={d} fill="none" stroke="rgb(255 255 255 / .12)" strokeWidth="2" />
      <path d={`${d} L${x(n)} ${z} L${x(0)} ${z} Z`} fill="color-mix(in srgb, var(--tint) 14%, transparent)" clipPath="url(#upto)" />
      <path d={d} fill="none" stroke="var(--tint)" strokeWidth="2.5" strokeLinejoin="round" clipPath="url(#upto)" />
      {phases.map((p, i) => (
        <circle key={p.key} cx={x(i + 1) - (x(1) - x(0)) / 2} cy={y(p.position)} r={i === step ? 5 : 3} fill={i <= step ? (p.position > 0 ? 'var(--acc)' : 'var(--tint)') : 'rgb(255 255 255 / .2)'} stroke="#0b0c0e" strokeWidth="2" />
      ))}
      <text x={x(0) + 2} y={y(min) + 14} fontSize="10" fill="var(--color-mute)">
        maior aplicação {brl(-min)}
      </text>
    </svg>
  )
}

/* ───────────── celular: linha vertical ───────────── */
function Vertical({ phases, study: s, sc }: { phases: TPhase[]; study: Study; sc: 0 | 1 }) {
  const root = useRef<HTMLOListElement>(null)
  useEffect(() => {
    const els = root.current?.querySelectorAll<HTMLElement>('[data-v]') ?? []
    if (reducedMotion() || !('IntersectionObserver' in window)) return els.forEach((e) => e.classList.add('is-in'))
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('is-in')), { threshold: 0.25 })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [phases])
  const sx = s.scenarios[sc]
  return (
    <ol ref={root} className="relative ml-1 border-l-2 pl-5" style={{ borderColor: 'color-mix(in srgb, var(--tint) 40%, transparent)' }}>
      {phases.map((p, i) => (
        <li key={p.key} data-v className="tl-v relative pb-6 last:pb-0">
          <span className="absolute -left-[31px] top-0 grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold" style={{ background: 'var(--tint)', color: '#0b0c0e' }}>
            {p.key === 'resultado' ? <Icon name="check" size={12} stroke={2.4} /> : i + 1}
          </span>
          <p className="label !text-[10px]" style={{ color: 'var(--tint)' }}>
            {p.when}
          </p>
          <p className="mt-0.5 text-[17px] font-semibold tracking-tight text-ink">{p.title}</p>
          <p className="mt-1 text-[13px] leading-snug text-ink-2">{p.desc}</p>
          {p.items.length > 0 && (
            <ul className="mt-2">
              {p.items.map((it) => (
                <li key={it.label} className="flex items-baseline justify-between gap-3 border-b border-white/[.06] py-1.5 text-[13px]">
                  <span className={it.flow === 0 || it.value === 0 ? 'text-mute' : 'text-ink-2'}>{it.label}</span>
                  <span className={`mono whitespace-nowrap font-semibold ${it.flow > 0 ? 'acc' : 'text-ink'}`}>{it.flow === 0 ? brl(it.value) : signed(it.flow * it.value)}</span>
                </li>
              ))}
            </ul>
          )}
          {p.key === 'resultado' ? (
            <p className="mt-2 text-[14px] text-ink">
              Lucro líquido <b className="num acc text-[22px]">{brl(sx.netResult)}</b> · {pct(sx.netRoi)}
            </p>
          ) : (
            <p className="mt-2 flex justify-between text-[12px]">
              <span className="text-mute">Saldo ao fim da etapa</span>
              <span className={`mono font-semibold ${p.position > 0 ? 'acc' : 'text-ink'}`}>{signed(p.position)}</span>
            </p>
          )}
        </li>
      ))}
    </ol>
  )
}
