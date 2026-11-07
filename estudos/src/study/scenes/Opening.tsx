import { useStudy } from '../ctx'
import type { Scene } from '../../lib/scenes'
import { brl, dateBR, pad2 } from '../../lib/format'
import { discountPct, discountValue } from '../../lib/derive'
import { Count, Label, Prism, Words } from '../primitives'
import { studies } from '../../data/studies'

export const PAD = 'px-6 pt-24 pb-32 md:px-[7vw] md:pt-28 md:pb-36'

/* ───────────────────────── Capa ───────────────────────── */
export function Cover() {
  const { study: s } = useStudy()
  const no = studies.findIndex((x) => x.slug === s.slug) + 1
  return (
    <>
      <div className="layer-back absolute inset-0">
        <div className="photo-duo absolute inset-0">
          <img src={s.images.photo} alt={`Fachada do ${s.fullTitle}`} />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(10_10_11/.85),rgb(10_10_11/.25)_55%,transparent)]" />
      </div>
      <div className={`relative z-10 flex h-full flex-col justify-end ${PAD}`}>
        <p className="label" data-reveal="fade" data-delay="0.1">
          {s.kicker} · Estudo {pad2(no)}/{pad2(studies.length)}
        </p>
        <h1 className="display mt-5 max-w-[14ch] text-[clamp(3.6rem,min(11vw,19vh),12rem)]">
          <Words text={s.title} delay={0.15} step={0.09} />
        </h1>
        <p className="mt-7 max-w-[46ch] text-[clamp(1rem,1.5vw,1.35rem)] leading-snug text-ink-2" data-reveal="up" data-delay="0.55">
          Imóvel avaliado em <span className="text-ink">{brl(s.appraisal.value)}</span> pelo {s.appraisal.source}, com lance a partir de{' '}
          <span className="acc">{brl(s.minimumBid)}</span>.
        </p>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <dl className="grid grid-cols-2 gap-x-10 gap-y-3 sm:flex sm:gap-12" data-reveal="up" data-delay="0.7">
            <div>
              <dt className="label">Modalidade</dt>
              <dd className="mt-1.5 text-[14px]">{s.sale.modality}</dd>
            </div>
            {s.sale.date && (
              <div>
                <dt className="label">Data</dt>
                <dd className="mono mt-1.5 text-[14px]">
                  {dateBR(s.sale.date)} · {s.sale.time}
                </dd>
              </div>
            )}
            {s.sale.lot && (
              <div>
                <dt className="label">Nº do bem</dt>
                <dd className="mono mt-1.5 text-[14px]">{s.sale.lot}</dd>
              </div>
            )}
            <div>
              <dt className="label">Local</dt>
              <dd className="mt-1.5 text-[14px]">{s.property.city.split(' · ')[0]}</dd>
            </div>
          </dl>
          <p className="label hidden items-center gap-3 md:flex" data-reveal="fade" data-delay="1.1">
            Role ou use → para começar
            <span className="relative block h-px w-16 overflow-hidden bg-white/15">
              <span className="absolute inset-y-0 left-0 w-1/3 animate-[slide_2.4s_cubic-bezier(.76,0,.24,1)_infinite]" style={{ background: 'var(--acc)' }} />
            </span>
          </p>
        </div>
      </div>
    </>
  )
}

/* ───────────────────── Big number: desconto ───────────────────── */
export function Discount() {
  const { study: s } = useStudy()
  const d = discountPct(s)
  const ratio = s.minimumBid / s.appraisal.value
  return (
    <div className={`relative z-10 grid h-full items-center gap-10 md:grid-cols-[1.25fr_1fr] ${PAD}`}>
      <div>
        <Label>Desconto sobre a avaliação</Label>
        <div style={{ perspective: 900 }}>
          <p className="num acc mt-4 text-[clamp(5.5rem,min(17vw,30vh),17rem)]" data-reveal="z" data-delay="0.1">
            <Count value={d} fmt="pct1" delay={0.25} />
          </p>
        </div>
        <p className="mt-6 max-w-[40ch] text-[clamp(1rem,1.4vw,1.25rem)] leading-snug text-ink-2" data-reveal="up" data-delay="0.5">
          Lance inicial de <span className="text-ink">{brl(s.minimumBid)}</span> sobre avaliação {s.appraisal.source} de{' '}
          <span className="text-ink">{brl(s.appraisal.value)}</span>.
        </p>
        <p className="label mt-5 !normal-case !tracking-normal" data-reveal="fade" data-delay="0.8">
          Calculado a partir do PDF · 1 − lance ÷ avaliação
        </p>
      </div>

      <DiscountBars s={s} ratio={ratio} />
    </div>
  )
}

function DiscountBars({ s, ratio }: { s: ReturnType<typeof useStudy>['study']; ratio: number }) {
  // altura máxima em px, calculada pelo viewport (barras proporcionais aos valores)
  const max = Math.min(window.innerHeight * 0.4, 400)
  return (
    <figure className="hidden justify-self-center md:block" aria-label={`Avaliação ${brl(s.appraisal.value)}; lance inicial ${brl(s.minimumBid)}`}>
      <div className="tilt3d flex items-end gap-14">
        {[
          { label: `Avaliação ${s.appraisal.source}`, v: s.appraisal.value, h: max, acc: false },
          { label: 'Lance inicial', v: s.minimumBid, h: max * ratio, acc: true },
        ].map((b, i) => (
          <div key={b.label} className="flex flex-col items-center">
            <span className="mono mb-5 text-[13px] text-ink" data-reveal="fade" data-delay={0.9 + i * 0.15}>
              {brl(b.v)}
            </span>
            <Prism h={b.h} w={88} depth={46} acc={b.acc} delay={0.4 + i * 0.15} />
            <span className="label mt-5" data-reveal="fade" data-delay={1 + i * 0.15}>
              {b.label}
            </span>
          </div>
        ))}
      </div>
      <figcaption className="label mt-8 text-center !normal-case !tracking-normal" data-reveal="fade" data-delay="1.3">
        Diferença: <span className="mono text-ink">{brl(discountValue(s))}</span> · calculado
      </figcaption>
    </figure>
  )
}

/* ───────────────────────── Capítulo ───────────────────────── */
export function Chapter({ scene }: { scene: Scene }) {
  const { scenes } = useStudy()
  const items = scenes.map((x, i) => ({ x, i })).filter((o) => o.x.chapter === scene.chapter && o.x.id !== scene.id)
  return (
    <>
      <div className="layer-back pointer-events-none absolute inset-0 flex items-center justify-end pr-[4vw]" aria-hidden>
        <span
          className="display select-none text-[min(62vh,48vw)] leading-none text-transparent"
          style={{ WebkitTextStroke: '1px rgb(237 234 228 / .14)' }}
          data-reveal="z"
          data-delay="0"
        >
          {scene.chapterNo}
        </span>
      </div>
      <div className={`relative z-10 flex h-full flex-col justify-center ${PAD}`}>
        <Label>
          Capítulo {scene.chapterNo} · Nível {scene.chapter + 1}
        </Label>
        <h2 className="display mt-5 text-[clamp(4rem,min(12vw,22vh),13rem)]">
          <Words text={scene.title} delay={0.1} step={0.1} />
        </h2>
        <div className="mt-10 h-px w-full max-w-[640px] bg-white/20" data-reveal="line" data-delay="0.4" />
        <ol className="mt-6 space-y-2">
          {items.map(({ x, i }, k) => (
            <li key={x.id} className="flex gap-6 text-[14px] text-ink-2" data-reveal="up" data-delay={0.55 + k * 0.07}>
              <span className="mono text-mute">{pad2(i + 1)}</span>
              {x.title}
              {x.insight && <span className="label !text-[var(--acc)]">insight</span>}
            </li>
          ))}
        </ol>
      </div>
    </>
  )
}

