import type { Study } from '../data/types'
import { brl, pct, dateBR } from './format'
import { discountPct, discountValue, hero, taxValue } from './derive'

export type SceneKind =
  | 'cover'
  | 'discount'
  | 'chapter'
  | 'property'
  | 'ruler'
  | 'composition'
  | 'financing'
  | 'period'
  | 'compare'
  | 'profit'
  | 'validation'
  | 'conclusion'

export interface Scene {
  id: string
  kind: SceneKind
  /** Índice do capítulo ("nível") a que a cena pertence. */
  chapter: number
  title: string
  /** Cenas-chave desbloqueiam um insight. */
  insight?: { value: string; label: string }
  notes: string[]
  /** Para cenas de capítulo. */
  chapterNo?: string
}

export const CHAPTERS = ['Abertura', 'O Imóvel', 'Os Números', 'Validação'] as const

/** Monta o roteiro de cenas de um estudo a partir dos dados. */
export function buildScenes(s: Study): Scene[] {
  const h = hero(s)
  const [s6, s12] = s.scenarios
  const disc = discountPct(s)
  const listings = s.market.listings.map((l) => l.price)
  const minL = Math.min(...listings)
  const maxL = Math.max(...listings)

  const scenes: Scene[] = [
    {
      id: 'capa',
      kind: 'cover',
      chapter: 0,
      title: s.title,
      notes: [
        `${s.sale.modality}${s.sale.date ? ` · ${dateBR(s.sale.date)} ${s.sale.time ?? ''}` : ''}.`,
        `Avaliação ${s.appraisal.source}: ${brl(s.appraisal.value)} · Lance inicial: ${brl(s.minimumBid)}.`,
        ...s.caveats.map((c) => `⚠ ${c}`),
      ],
    },
    {
      id: 'desconto',
      kind: 'discount',
      chapter: 0,
      title: 'Desconto sobre a avaliação',
      insight: { value: pct(disc, 1), label: 'abaixo da avaliação' },
      notes: [
        `Desconto calculado: 1 − ${brl(s.minimumBid)} ÷ ${brl(s.appraisal.value)} = ${pct(disc, 1)}.`,
        `Diferença calculada: ${brl(discountValue(s))}. Não é um número escrito no PDF — sinalizar como cálculo.`,
      ],
    },
    { id: 'cap-imovel', kind: 'chapter', chapter: 1, chapterNo: 'I', title: 'O Imóvel', notes: ['Ficha do imóvel e posição de mercado.'] },
    {
      id: 'imovel',
      kind: 'property',
      chapter: 1,
      title: 'Ficha do imóvel',
      notes: [
        `${s.property.unit} · ${s.property.area.toLocaleString('pt-BR')} m² · condomínio ${brl(s.property.condoFee)}.`,
        `${s.property.address} — ${s.property.city}.`,
      ],
    },
    {
      id: 'mercado',
      kind: 'ruler',
      chapter: 1,
      title: 'Posição de mercado',
      insight: {
        value: s.market.from ? `a partir de ${brl(s.market.from)}` : `${brl(minL)} – ${brl(maxL)}`,
        label: 'imóveis similares na região',
      },
      notes: [
        s.market.from ? `PDF: imóveis similares a partir de ${brl(s.market.from)}.` : 'O PDF não informa o “a partir de”; usamos só os anúncios.',
        `${listings.length} anúncios visíveis no PDF: ${listings.map(brl).join(' · ')}.`,
        `Venda projetada: ${brl(s6.sale)} (6m) e ${brl(s12.sale)} (12m).`,
      ],
    },
    { id: 'cap-numeros', kind: 'chapter', chapter: 2, chapterNo: 'II', title: 'Os Números', notes: ['Custos, cenários de 6 e 12 meses, imposto e resultado.'] },
    {
      id: 'investimento',
      kind: 'composition',
      chapter: 2,
      title: 'Composição do investimento',
      insight: { value: brl(s.costs.total), label: 'investimento total' },
      notes: [
        `Investimento total: ${brl(s.costs.total)}.`,
        ...(s.costs.items.some((r) => r.ref) ? ['Valor arrematado aparece como referência: não compõe o total (compra financiada).'] : []),
        'Percentuais de cada linha são calculados sobre o total.',
      ],
    },
  ]

  if (s.financing) {
    const f = s.financing
    scenes.push({
      id: 'financiamento',
      kind: 'financing',
      chapter: 2,
      title: 'Estrutura financiada',
      insight: { value: brl(f.downPayment), label: 'de entrada' },
      notes: [
        `${f.downPaymentLabel}: ${brl(f.downPayment)} · parcela mensal ${brl(f.installment)}.`,
        `Saldo devedor quitado na venda: ${brl(f.balance6)} (6m) · ${brl(f.balance12)} (12m).`,
        '⚠ O saldo devedor não fecha com o valor financiado menos as parcelas — mantido como no PDF.',
      ],
    })
  }

  scenes.push(
    {
      id: 'periodo',
      kind: 'period',
      chapter: 2,
      title: 'Custos do período',
      notes: [`Custo operacional: ${brl(s.period.op6)} em 6 meses · ${brl(s.period.op12)} em 12 meses.`],
    },
    {
      id: 'cenarios',
      kind: 'compare',
      chapter: 2,
      title: '6 meses × 12 meses',
      insight: { value: `${pct(s6.grossRoi)} · ${pct(s12.grossRoi)}`, label: 'ROI bruto em 6 e 12 meses' },
      notes: [
        `6 meses: venda ${brl(s6.sale)} · resultado bruto ${brl(s6.grossResult)} · ROI bruto ${pct(s6.grossRoi)}.`,
        `12 meses: venda ${brl(s12.sale)} · resultado bruto ${brl(s12.grossResult)} · ROI bruto ${pct(s12.grossRoi)}.`,
      ],
    },
    {
      id: 'resultado',
      kind: 'profit',
      chapter: 2,
      title: 'Resultado líquido',
      insight: { value: brl(h.netResult), label: `lucro líquido em ${h.months} meses · ${s.roiLabel} ${pct(h.netRoi)}` },
      notes: [
        `Lucro líquido (${h.months}m): ${brl(h.netResult)} · ${s.roiLabel} ${pct(h.netRoi)}.`,
        `IRGC de ${h.taxPct}% sobre o resultado bruto: ${brl(taxValue(h))} (calculado: bruto − líquido).`,
      ],
    },
    {
      id: 'validacao',
      kind: 'validation',
      chapter: 3,
      chapterNo: 'III',
      title: 'Validação do valor de mercado',
      insight: { value: `${s.validation.length}/${s.validation.length}`, label: 'validações concluídas' },
      notes: s.validation.map((v) => `✓ ${v}`),
    },
    {
      id: 'conclusao',
      kind: 'conclusion',
      chapter: 3,
      title: 'Considerações finais',
      notes: ['Texto de considerações finais idêntico ao PDF.', `Contato: Instagram ${s.brand.instagram}.`],
    },
  )
  return scenes
}

export const sceneSeconds = 25
export const estMinutes = (n: number) => Math.max(1, Math.round((n * sceneSeconds) / 60))
