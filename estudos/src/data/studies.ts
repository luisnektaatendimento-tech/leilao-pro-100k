import type { Scenario, Study } from './types'

type RawStudy = Omit<Study, 'costs' | 'scenarios' | 'period' | 'financing'> & {
  costs: { items: Study['costs']['items'] }
  period: { items: Study['period']['items'] }
  financing?: { downPaymentLabel: string; installment: number }
  scenarios: [ScenarioInput, ScenarioInput]
}
type ScenarioInput = Pick<Scenario, 'months' | 'sale' | 'taxPct'> & { brokerageRate: number }
import { asset } from '../lib/asset'

/**
 * CONTEÚDO DOS ESTUDOS
 * --------------------
 * Fonte única de verdade. Para adicionar um estudo novo, copie um objeto,
 * troque os valores e coloque as imagens em /public/img/<slug>/.
 * As cenas são montadas automaticamente a partir destes dados (src/lib/scenes.ts).
 *
 * Regra: os números são transcritos exatamente como estão nos PDFs.
 * Divergências encontradas ficam em `caveats` (aparecem só nas notas do apresentador).
 */

export const company = {
  name: 'PJK Invest',
  tagline: 'Estudos de oportunidade em imóveis de leilão',
  creci: 'Trend Imobilis CRECI 20401 J · Todos os direitos reservados',
  disclaimer: 'Documento elaborado para fins informativos e sujeito a alterações.',
  confidentiality:
    'As informações contidas neste estudo são estritamente confidenciais e destinadas exclusivamente para o uso do destinatário. É proibida a divulgação, reprodução ou distribuição de qualquer parte deste material sem a devida autorização. Em conformidade com a LGPD, quaisquer dados pessoais compartilhados serão tratados com a máxima confidencialidade e utilizados apenas para os fins especificados.',
}

const VALIDATION = [
  'Consulta com corretores locais e vistoria técnica presencial',
  'Comparativo em sites',
  'Análise documental',
  'Análise jurídica',
  'Levantamento de débitos',
]

const closing = (who: string) =>
  `Este investimento apresenta um potencial significativo de retorno, considerando a valorização da região e os custos envolvidos. ${who} está à disposição para esclarecer dúvidas e auxiliar em todas as etapas do processo.`

const raw: RawStudy[] = [
  /* ───────────────────────────── PARQUE FLORENCE ───────────────────────────── */
  {
    slug: 'parque-florence',
    title: 'Parque Florence',
    fullTitle: 'Condomínio Parque Florence',
    kicker: 'Oportunidade de Investimento',
    brand: { name: 'Grupo PJK', instagram: '@pjkgrupo' },
    sale: { modality: 'Licitação Aberta', date: '2026-08-14', time: '10:00', hasAuctioneerLink: true },
    appraisal: { source: 'Caixa', value: 169000 },
    minimumBid: 100148.49,
    property: {
      address: 'R. Monte Líbano, 944 · Mondubim',
      city: 'Fortaleza · CE · 60762-376',
      unit: 'Apartamento 712 · TR 01',
      area: 36.88,
      bedrooms: 2,
      bathrooms: 1,
      parking: 1,
      condoFee: 250,
    },
    images: {
      photo: asset('/img/parque-florence/foto.webp'),
      thumb: asset('/img/parque-florence/foto-thumb.webp'),
      map: asset('/img/parque-florence/mapa.webp'),
    },
    market: {
      from: 193000,
      listings: [
        { title: 'Apto 44 m², 2 dormitórios', price: 210000, area: '44 m²', where: 'Rua Monte Líbano' },
        { title: 'Apto 44 m², 2 quartos', price: 193000, area: '44 m²', where: 'Rua Monte Líbano' },
        { title: 'Apto 44 m², 2 dormitórios e 1 suíte', price: 205000, area: '44 m²', where: 'Rua Monte Líbano' },
        { title: '“Oportunidade no Parque Fluence”', price: 205000, area: '44 m²', where: 'Rachel de Queiroz' },
      ],
    },
    costs: {
      items: [
        { label: 'Valor arrematado', value: 100148.49 },
        { label: 'Leiloeiro (5%)', value: 0, pctOfBid: 0.05 },
        { label: 'Assessoria', value: 10000 },
        { label: 'Imposto de transmissão (ITBI)', value: 3380 },
        { label: 'Custos cartorários (escritura + registro)', value: 10250 },
        { label: 'Possível reforma', value: 0 },
        { label: 'Débitos pendentes (IPTU + condomínio)', value: 9728.6 },
      ],
    },
    period: {
      items: [
        { label: 'IPTU (12 meses)', value: 0, kind: 'once' },
        { label: 'Condomínio mensal', value: 250, kind: 'monthly' },
        { label: 'Desocupação', value: 0, kind: 'once' },
        { label: 'Engenharia', value: 750, kind: 'once' },
      ],
    },
    scenarios: [
      { months: 6, sale: 204000, brokerageRate: 0.06, taxPct: 15 },
      { months: 12, sale: 204000, brokerageRate: 0.06, taxPct: 15 },
    ],
    heroScenario: 0,
    roiLabel: 'ROI líquido',
    validation: VALIDATION,
    closing: closing('O Grupo PJK'),
    caveats: [
      'Assessoria ajustada para R$ 10.000 (no PDF: R$ 7.000); totais, ROI e lucro recalculados.',
      'PDF assinado como “Grupo PJK / @pjkgrupo” (os demais usam PJK Invest).',
      'Data da licitação (14/08/2026) já passou em relação à data desta apresentação.',
    ],
  },

  /* ─────────────────────────── ALBERTO MONTEIRO ─────────────────────────── */
  {
    slug: 'alberto-monteiro',
    title: 'Alberto Monteiro',
    fullTitle: 'Condomínio Edifício Alberto Monteiro',
    kicker: 'Oportunidade de Investimento',
    brand: { name: 'PJK Invest', instagram: '@pjkinvest' },
    sale: { modality: 'Leilão Único', date: '2025-08-06', time: '10h', hasAuctioneerLink: true },
    appraisal: { source: 'Bradesco', value: 285000 },
    minimumBid: 119000,
    property: {
      address: 'Rua Ageu Romero, 100 · São Gerardo',
      city: 'Fortaleza · CE · 60325-110',
      unit: 'Apartamento 202',
      area: 87.5,
      bedrooms: 3,
      bathrooms: 2,
      parking: 1,
      condoFee: 650,
    },
    images: {
      photo: asset('/img/alberto-monteiro/foto.webp'),
      thumb: asset('/img/alberto-monteiro/foto-thumb.webp'),
      map: asset('/img/alberto-monteiro/mapa.webp'),
    },
    market: {
      from: 280000,
      listings: [
        { title: 'Apto 3 quartos, 103 m²', price: 296000, area: '103 m²', where: 'Rua Ageu Romero' },
        { title: 'Apto · condomínio R$ 450', price: 300000, where: 'São Gerardo' },
        { title: 'Apartamento São Gerardo', price: 280000, where: 'São Gerardo' },
      ],
    },
    costs: {
      items: [
        { label: 'Valor arrematado', value: 119000, ref: true },
        { label: 'Entrada (30%)', value: 0, pctOfBid: 0.3 },
        { label: 'Leiloeiro (5%)', value: 0, pctOfBid: 0.05 },
        { label: 'Assessoria', value: 10000 },
        { label: 'Imposto de transmissão (ITBI)', value: 2380 },
        { label: 'Custos cartorários (escritura + registro)', value: 10245 },
        { label: 'Possível reforma', value: 10000 },
        { label: 'Débitos pendentes (IPTU + condomínio)', value: 7000 },
      ],
    },
    period: {
      items: [
        { label: 'IPTU (12 meses)', value: 0, kind: 'once' },
        { label: 'Condomínio mensal', value: 650, kind: 'monthly' },
        { label: 'Parcela mensal', value: 2200, kind: 'monthly' },
        { label: 'Desocupação amigável', value: 0, kind: 'once' },
        { label: 'Taxa seguro Caixa', value: 0, kind: 'once' },
      ],
    },
    financing: {
      downPaymentLabel: 'Entrada (30%)',
      installment: 2200,
    },
    scenarios: [
      { months: 6, sale: 230000, brokerageRate: 0.06, taxPct: 15 },
      { months: 12, sale: 240000, brokerageRate: 0.06, taxPct: 15 },
    ],
    heroScenario: 0,
    roiLabel: 'ROI líquido s/ capital próprio',
    validation: VALIDATION,
    closing: closing('A PJK Invest'),
    caveats: [
      'Assessoria ajustada para R$ 10.000 (no PDF: R$ 7.000); totais, ROI e lucro recalculados.',
      'Compra financiada: o investimento total não inclui os 70% financiados; ROI calculado sobre o capital próprio.',
      'Saldo devedor recalculado: financiado (R$ 83.300) − parcelas pagas, sem juros (o PDF não informa a taxa). O PDF também descontava o condomínio: R$ 66.200 / R$ 49.100.',
      'Avaliação feita pelo Bradesco (não Caixa). Leilão de 06/08/2025 já ocorreu.',
    ],
  },

  /* ─────────────────────────── ALTA VISTA PASSARÉ ─────────────────────────── */
  {
    slug: 'alta-vista-passare',
    title: 'Alta Vista Passaré',
    fullTitle: 'Condomínio Alta Vista Passaré',
    kicker: 'Oportunidade de Investimento',
    brand: { name: 'PJK Invest', instagram: '@pjkinvest' },
    sale: { modality: 'Licitação Aberta', date: '2025-07-21', time: '10h', lot: '878771238773-4', hasAuctioneerLink: true },
    appraisal: { source: 'Caixa', value: 246000 },
    minimumBid: 150626.91,
    property: {
      address: 'Condomínio Alta Vista Passaré · Passaré',
      city: 'Fortaleza · CE',
      unit: 'Apartamento 505 · TR 01',
      area: 43.9,
      bedrooms: 2,
      bathrooms: 2,
      parking: 1,
      condoFee: 570,
    },
    images: {
      photo: asset('/img/alta-vista-passare/foto.webp'),
      thumb: asset('/img/alta-vista-passare/foto-thumb.webp'),
      map: asset('/img/alta-vista-passare/mapa.webp'),
    },
    market: {
      from: 290000,
      listings: [
        { title: '“01 - Vendo Alta Vista Passaré”', price: 314700, area: '44 m²', where: 'Passaré' },
        { title: 'Apartamento Alta Vista Passaré', price: 312000, area: '44 m²', where: 'Passaré' },
        { title: 'Alta Vista Passaré · 2 qtos', price: 314700, area: '44 m²', where: 'Passaré' },
        { title: 'Alta Vista Passaré · 2 quartos c/ piscina', price: 300000, area: '46 m²', where: 'Passaré' },
      ],
    },
    costs: {
      items: [
        { label: 'Valor arrematado', value: 150626.91 },
        { label: 'Leiloeiro (5%)', value: 0, pctOfBid: 0.05 },
        { label: 'Assessoria', value: 10000 },
        { label: 'Imposto de transmissão (ITBI)', value: 4880 },
        { label: 'Custos cartorários (escritura + registro)', value: 10000 },
        { label: 'Possível reforma', value: 0 },
        { label: 'Débitos pendentes (IPTU + condomínio)', value: 10000 },
      ],
    },
    period: {
      items: [
        { label: 'IPTU (12 meses)', value: 0, kind: 'once' },
        { label: 'Condomínio mensal', value: 600, kind: 'monthly' },
        { label: 'Desocupação', value: 0, kind: 'once' },
        { label: 'Taxa seguro Caixa', value: 0, kind: 'once' },
      ],
    },
    scenarios: [
      { months: 6, sale: 265000, brokerageRate: 0.06, taxPct: 15 },
      { months: 12, sale: 275000, brokerageRate: 0.06, taxPct: 15 },
    ],
    heroScenario: 0,
    roiLabel: 'ROI líquido',
    validation: VALIDATION,
    closing: closing('A PJK Invest'),
    caveats: [
      'Assessoria ajustada para R$ 10.000 (no PDF: “Assessoria (5%)” R$ 6.000); totais, ROI e lucro recalculados.',
      'Arremate igualado ao lance inicial R$ 150.626,91 (a planilha usava R$ 150.620,00, abaixo do lance mínimo); leiloeiro 5% recalculado.',
      'Condomínio R$ 570 na ficha × R$ 600 na planilha.',
      'Corretagem 6 meses corrigida para 6% de R$ 265.000 = R$ 15.900 (o PDF trazia R$ 13.250, que é 5%).',
      '“A partir de R$ 290.000”, mas os anúncios visíveis vão de R$ 300.000 a R$ 314.700.',
      'Licitação de 21/07/2025 já ocorreu.',
    ],
  },

  /* ─────────────────────────── VILLE DE MARSEILLE ─────────────────────────── */
  {
    slug: 'ville-de-marseille',
    title: 'Ville de Marseille',
    fullTitle: 'Apto · Condomínio Ville de Marseille',
    kicker: 'Oportunidade de Investimento',
    brand: { name: 'PJK Invest', instagram: '@pjkinvest' },
    sale: { modality: 'Venda Direta', lot: '878771849005-7' },
    appraisal: { source: 'Caixa', value: 159000 },
    minimumBid: 94222.54,
    property: {
      address: 'Rua 101, 420 · Novo Mondubim',
      city: 'Fortaleza · CE',
      unit: 'Apartamento 213 · BL 04',
      area: 38.56,
      condoFee: 300,
    },
    images: {
      photo: asset('/img/ville-de-marseille/foto.webp'),
      thumb: asset('/img/ville-de-marseille/foto-thumb.webp'),
      map: asset('/img/ville-de-marseille/mapa.webp'),
    },
    market: {
      listings: [
        { title: 'Apto novo, 2 quartos · Ville de Marseille', price: 189000, area: '44 m²', where: 'Novo Mondubim' },
        { title: 'Apartamento à venda', price: 180000, area: '80 m²', where: 'Mondubim' },
        { title: 'Apto 2 dormitórios, 44 m²', price: 179000, area: '44 m²', where: 'Mondubim' },
      ],
    },
    costs: {
      items: [
        { label: 'Valor arrematado', value: 94222.54 },
        { label: 'Assessoria', value: 10000 },
        { label: 'Imposto de transmissão (ITBI)', value: 3180 },
        { label: 'Custos cartorários (escritura + registro)', value: 9500 },
        { label: 'Possível reforma', value: 5000 },
        { label: 'Débitos pendentes (IPTU + condomínio)', value: 8500 },
      ],
    },
    period: {
      items: [
        { label: 'IPTU (12 meses)', value: 0, kind: 'once' },
        { label: 'Condomínio mensal', value: 300, kind: 'monthly' },
        { label: 'Desocupação amigável', value: 0, kind: 'once' },
        { label: 'Engenharia Caixa', value: 750, kind: 'once' },
      ],
    },
    scenarios: [
      { months: 6, sale: 175000, brokerageRate: 0.06, taxPct: 15 },
      { months: 12, sale: 180000, brokerageRate: 0.06, taxPct: 15 },
    ],
    heroScenario: 0,
    roiLabel: 'ROI líquido',
    validation: VALIDATION,
    closing: closing('A PJK Invest'),
    caveats: [
      'Assessoria ajustada para R$ 10.000 (no PDF: R$ 7.000); totais, ROI e lucro recalculados.',
      'Corretagem 12 meses corrigida para 6% de R$ 180.000 = R$ 10.800 (o PDF trazia R$ 9.000, que é 5%).',
      'O PDF não traz o “a partir de” do mercado; 3º anúncio: título R$ 179.900, preço R$ 179.000 (usado R$ 179.000).',
      'Venda Direta: o PDF não informa data.',
    ],
  },
]

/* ───────────── números calculados ─────────────
 * Todas as contas da apresentação saem daqui, com as fórmulas da planilha dos PDFs:
 *   leiloeiro / entrada   = % × valor arrematado
 *   investimento total    = soma dos custos (sem linhas de referência)
 *   custo operacional N m = Σ itens mensais × N + itens únicos
 *   investimento N meses  = investimento total + custo operacional N meses
 *   corretagem            = taxa × venda
 *   saldo devedor N m     = (arremate − entrada) − parcela × N   (sem juros: o PDF não informa a taxa)
 *   resultado bruto       = venda − corretagem − saldo devedor − investimento N meses
 *   resultado líquido     = resultado bruto × (1 − IRGC)
 *   ROI                   = resultado ÷ investimento N meses
 * Valores em reais são arredondados ao centavo; ROI a duas casas.
 */
const cents = (v: number) => Math.round((v + Number.EPSILON) * 100) / 100
const pct2 = (v: number) => Math.round((v + Number.EPSILON) * 10000) / 100
const pctLabel = (r: number) => `${Math.round(r * 1000) / 10}%`.replace('.', ',')

function finalize(r: RawStudy): Study {
  const bid = r.costs.items[0].value // primeira linha: valor arrematado
  const items = r.costs.items.map((i) => (i.pctOfBid ? { ...i, value: cents(bid * i.pctOfBid) } : i))
  const total = cents(items.filter((i) => !i.ref).reduce((a, i) => a + i.value, 0))
  const op = (months: number) =>
    cents(r.period.items.reduce((a, i) => a + (i.kind === 'monthly' ? i.value * months : i.value), 0))
  const down = items.find((i) => i.label.startsWith('Entrada'))?.value ?? 0
  const balance = (months: number) => (r.financing ? cents(bid - down - r.financing.installment * months) : undefined)

  const scenarios = r.scenarios.map((sc) => {
    const investment = cents(total + op(sc.months))
    const brokerage = cents(sc.sale * sc.brokerageRate)
    const bal = balance(sc.months)
    const grossResult = cents(sc.sale - brokerage - (bal ?? 0) - investment)
    const netResult = cents(grossResult * (1 - sc.taxPct / 100))
    return {
      months: sc.months,
      sale: sc.sale,
      ...(bal !== undefined ? { balance: bal } : {}),
      brokerage,
      brokerageLabel: `Corretagem (${pctLabel(sc.brokerageRate)})`,
      investment,
      grossResult,
      grossRoi: pct2(grossResult / investment),
      taxPct: sc.taxPct,
      netResult,
      netRoi: pct2(netResult / investment),
    }
  }) as Study['scenarios']

  return {
    ...r,
    costs: { items, total },
    period: { items: r.period.items, op6: op(6), op12: op(12) },
    financing: r.financing && { ...r.financing, downPayment: down, balance6: balance(6)!, balance12: balance(12)! },
    scenarios,
  }
}

export const studies: Study[] = raw.map(finalize)

export const getStudy = (slug: string) => studies.find((s) => s.slug === slug)
