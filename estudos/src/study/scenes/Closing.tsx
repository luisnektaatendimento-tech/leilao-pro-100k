import { useEffect, useState } from 'react'
import { useStudy } from '../ctx'
import { company } from '../../data/studies'
import { mmss, pad2 } from '../../lib/format'
import { navigate } from '../../lib/router'
import { sound } from '../../lib/sound'
import { Icon } from '../../components/Icon'
import { Brand } from '../../components/Brand'
import { Label, Words } from '../primitives'
import { PAD } from './Opening'

/* ───────────────────────── Validação ───────────────────────── */
export function Validation() {
  const { study: s } = useStudy()
  const n = s.validation.length
  return (
    <div className={`relative z-10 grid h-full items-center gap-10 md:grid-cols-[1.3fr_1fr] ${PAD}`}>
      <div>
        <Label>Capítulo III · Nível 4</Label>
        <h2 className="display mt-3 text-[clamp(2.1rem,min(4vw,8vh),4.4rem)]">
          <Words text="Validação do valor de mercado" delay={0.1} />
        </h2>
        <ul className="mt-10 max-w-2xl">
          {s.validation.map((v, i) => (
            <li key={v} className="flex items-center gap-5 border-t border-white/[.08] py-[clamp(10px,2vh,18px)]" data-reveal="up" data-delay={0.35 + i * 0.12}>
              <span className="grid h-8 w-8 flex-none place-items-center rounded-full border" style={{ borderColor: 'rgb(var(--acc-rgb) / .5)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12.5l4.5 4.5L19 7.5" stroke="var(--acc)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} data-reveal="draw" data-delay={0.6 + i * 0.12} />
                </svg>
              </span>
              <span className="text-[clamp(14px,1.25vw,18px)] text-ink">{v}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="hidden text-right md:block">
        <p className="num text-[clamp(6rem,min(16vw,30vh),16rem)]" data-reveal="z" data-delay="0.2" aria-label={`${n} de ${n} validações concluídas`}>
          {pad2(n)}
          <span className="text-mute">/{pad2(n)}</span>
        </p>
        <p className="label mt-2">validações concluídas</p>
      </div>
    </div>
  )
}

/* ───────────────────────── Conclusão + conquistas ───────────────────────── */
export function Conclusion({ complete }: { complete: boolean }) {
  const { study: s, scenes, unlocked, visited, elapsed, next, goTo, goHome } = useStudy()
  const [time, setTime] = useState(elapsed())
  useEffect(() => {
    const t = setInterval(() => setTime(elapsed()), 1000)
    return () => clearInterval(t)
  }, [elapsed])
  const keys = scenes.map((x, i) => ({ x, i })).filter((o) => o.x.insight)
  const explored = Math.round((visited.size / scenes.length) * 100)

  return (
    <div className={`relative z-10 grid h-full content-center items-center gap-6 md:grid-cols-[1fr_1.1fr] md:gap-[5vw] ${PAD} !pb-28`}>
      <div className="flex flex-col justify-center md:h-full">
        <Label>Considerações finais</Label>
        <p className="display mt-6 max-w-[30ch] text-[clamp(1.25rem,min(2vw,4vh),2.25rem)] !font-medium !leading-[1.22] !tracking-[-0.02em]" data-reveal="up" data-delay="0.15">
          {s.closing}
        </p>
        <div className="mt-6 flex flex-wrap gap-3 md:mt-10" data-reveal="up" data-delay="0.4">
          <button
            className="group inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-[14px] font-medium text-[#0a0a0b] transition-transform duration-500 hover:scale-[1.03]"
            style={{ background: 'var(--acc)' }}
            onClick={() => {
              sound.click()
              navigate(`/estudo/${next.slug}`)
            }}
          >
            Próximo estudo · {next.title}
            <Icon name="right" />
          </button>
          <button className="inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3.5 text-[14px] text-ink transition-colors duration-500 hover:border-white/50" onClick={goHome}>
            Voltar aos estudos
          </button>
        </div>
        <div className="mt-10 hidden items-center gap-4 text-[13px] text-ink-2 md:flex" data-reveal="fade" data-delay="0.6">
          <Brand name={s.brand.name} />
          <span className="mono text-mute">Instagram {s.brand.instagram}</span>
        </div>
      </div>

      <div className={`glass relative overflow-hidden rounded-2xl p-5 md:p-8 ${complete ? 'shadow-[0_0_120px_-30px_rgb(var(--acc-rgb)/.6)]' : ''}`} data-reveal="up" data-delay="0.3">
        {complete && <Seal />}
        <p className="label">Resumo da exploração</p>
        <dl className="mt-5 grid grid-cols-3 gap-4">
          {[
            { k: 'Insights', v: `${pad2(unlocked.size)}/${pad2(keys.length)}` },
            { k: 'Explorado', v: `${explored}%` },
            { k: 'Tempo', v: mmss(time) },
          ].map((m) => (
            <div key={m.k}>
              <dt className="label !text-[10px]">{m.k}</dt>
              <dd className="num mt-2 text-[clamp(1.6rem,2.6vw,2.6rem)]">{m.v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 hidden h-px bg-white/10 md:block" />
        <ul className="mt-6 hidden gap-2.5 sm:grid-cols-2 md:grid">
          {keys.map(({ x, i }, k) => {
            const got = unlocked.has(x.id)
            return (
              <li key={x.id} data-reveal="up" data-delay={0.5 + k * 0.06}>
                <button
                  className="h-full w-full rounded-xl border p-3.5 text-left transition-colors duration-500 hover:border-white/30"
                  style={{ borderColor: got ? 'rgb(var(--acc-rgb) / .35)' : 'rgb(237 234 228 / .08)', background: got ? 'rgb(var(--acc-rgb) / .05)' : 'transparent' }}
                  onClick={() => goTo(i)}
                  aria-label={got ? `${x.insight!.value} — ${x.insight!.label}. Ir para a cena ${i + 1}` : `Insight bloqueado. Visite a cena ${i + 1}: ${x.title}`}
                >
                  {got ? (
                    <>
                      <span className="block text-[clamp(14px,1.3vw,18px)] font-light tracking-tight text-ink">{x.insight!.value}</span>
                      <span className="mt-1 block text-[11px] leading-snug text-ink-2">{x.insight!.label}</span>
                    </>
                  ) : (
                    <span className="flex items-center gap-2 text-[12px] text-mute">
                      <Icon name="lock" size={14} /> Cena {pad2(i + 1)} · {x.title}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
        {complete && (
          <p className="label mt-5 flex items-center gap-2 !text-[var(--acc)]">
            <Icon name="spark" size={12} /> Estudo 100% explorado
          </p>
        )}
      </div>

      <footer className="pointer-events-none absolute inset-x-6 bottom-[86px] hidden text-[10px] leading-relaxed text-mute md:inset-x-[7vw] md:block">
        <span className="text-ink-2">{company.creci}</span> · {company.disclaimer} {company.confidentiality}
      </footer>
    </div>
  )
}

/** Easter egg: selo gravado que aparece ao completar 100%. */
function Seal() {
  const text = 'ESTUDO COMPLETO · PJK INVEST · ESTUDO COMPLETO · PJK INVEST · '
  return (
    <svg className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 opacity-80" viewBox="0 0 200 200" aria-hidden style={{ animation: 'spin 40s linear infinite' }}>
      <defs>
        <path id="sealpath" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
      </defs>
      <circle cx="100" cy="100" r="92" fill="none" stroke="var(--acc)" strokeOpacity=".35" />
      <circle cx="100" cy="100" r="64" fill="none" stroke="var(--acc)" strokeOpacity=".25" />
      <text fill="var(--acc)" fontFamily="ui-monospace, SF Mono, Menlo, JetBrains Mono Variable, monospace" fontSize="10.5" letterSpacing="3">
        <textPath href="#sealpath">{text}</textPath>
      </text>
    </svg>
  )
}
