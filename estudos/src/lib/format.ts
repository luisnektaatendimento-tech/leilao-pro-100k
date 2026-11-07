const brlFmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 })
const brl0Fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 })
const numFmt = (d: number) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d })

/** "R$ 45.896,16" (espaço normal, não NBSP, para alinhar em mono). */
export const brl = (v: number) => brlFmt.format(v).replace(/ /g, ' ')
export const brl0 = (v: number) => brl0Fmt.format(v).replace(/ /g, ' ')
/** "R$ 204 mil" */
export const brlK = (v: number) => {
  const k = v / 1000
  return `R$ ${numFmt(Number.isInteger(k) ? 0 : 1).format(k)} mil`
}
export const pct = (v: number, d = 2) => `${numFmt(d).format(v)}%`
export const num = (v: number, d = 0) => numFmt(d).format(v)
export const pad2 = (n: number) => String(n).padStart(2, '0')

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
export const dateBR = (iso?: string) => {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
export const dateShort = (iso?: string) => {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  return `${pad2(d)} ${MONTHS[m - 1]} ${y}`
}
export const mmss = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1000))
  return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`
}

export type Fmt = 'brl' | 'brl0' | 'pct' | 'pct1' | 'int'
export const formatBy = (f: Fmt, v: number) =>
  f === 'brl' ? brl(v) : f === 'brl0' ? brl0(v) : f === 'pct' ? pct(v) : f === 'pct1' ? pct(v, 1) : num(v)
