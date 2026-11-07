import type { Scenario, Study } from './types'

type RawStudy = Omit<Study, 'costs' | 'scenarios'> & {
  costs: { items: Study['costs']['items'] }
  scenarios: [ScenarioInput, ScenarioInput]
}
type ScenarioInput = Pick<Scenario, 'months' | 'sale' | 'balance' | 'brokerage' | 'brokerageLabel' | 'taxPct'>
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
        { label: 'Leiloeiro (5%)', value: 5007.42 },
        { label: 'Assessoria', value: 10000 },
        { label: 'Imposto de transmissão (ITBI)', value: 3380 },
        { label: 'Custos cartorários (escritura + registro)', value: 10250 },
        { label: 'Possível reforma', value: 0 },
        { label: 'Débitos pendentes (IPTU + condomínio)', value: 9728.6 },
      ],
    },
    period: {
      items: [
        { label: 'IPTU (12 meses)', value: 0 },
        { label: 'Condomínio mensal', value: 250 },
        { label: 'Desocupação', value: 0 },
        { label: 'Engenharia', value: 750 },
      ],
      op6: 2250,
      op12: 3750,
    },
    scenarios: [
      { months: 6, sale: 204000, brokerage: 12240, brokerageLabel: 'Corretagem (6%)', taxPct: 15 },
      { months: 12, sale: 204000, brokerage: 12240, brokerageLabel: 'Corretagem (6%)', taxPct: 15 },
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
        { label: 'Entrada (30%)', value: 35700 },
        { label: 'Leiloeiro (5%)', value: 5950 },
        { label: 'Assessoria', value: 10000 },
        { label: 'Imposto de transmissão (ITBI)', value: 2380 },
        { label: 'Custos cartorários (escritura + registro)', value: 10245 },
        { label: 'Possível reforma', value: 10000 },
        { label: 'Débitos pendentes (IPTU + condomínio)', value: 7000 },
      ],
    },
    period: {
      items: [
        { label: 'IPTU (12 meses)', value: 0 },
        { label: 'Condomínio mensal', value: 650 },
        { label: 'Parcela mensal', value: 2200 },
        { label: 'Desocupação amigável', value: 0 },
        { label: 'Taxa seguro Caixa', value: 0 },
      ],
      op6: 17100,
      op12: 34200,
    },
    financing: {
      downPaymentLabel: 'Entrada (30%)',
      downPayment: 35700,
      installment: 2200,
      balance6: 66200,
      balance12: 49100,
    },
    scenarios: [
      { months: 6, sale: 230000, balance: 66200, brokerage: 13800, brokerageLabel: 'Corretagem (6%)', taxPct: 15 },
      { months: 12, sale: 240000, balance: 49100, brokerage: 14400, brokerageLabel: 'Corretagem (6%)', taxPct: 15 },
    ],
    heroScenario: 0,
    roiLabel: 'ROI líquido s/ capital próprio',
    validation: VALIDATION,
    closing: closing('A PJK Invest'),
    caveats: [
      'Assessoria ajustada para R$ 10.000 (no PDF: R$ 7.000); totais, ROI e lucro recalculados.',
      'Compra financiada: o investimento total não inclui os 70% financiados; ROI calculado sobre o capital próprio.',
      'Saldo devedor (R$ 66.200 / R$ 49.100) não fecha com R$ 83.300 financiados menos as parcelas — valores mantidos como no PDF.',
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
        { label: 'Valor arrematado', value: 150620 },
        { label: 'Leiloeiro (5%)', value: 7531 },
        { label: 'Assessoria', value: 10000 },
        { label: 'Imposto de transmissão (ITBI)', value: 4880 },
        { label: 'Custos cartorários (escritura + registro)', value: 10000 },
        { label: 'Possível reforma', value: 0 },
        { label: 'Débitos pendentes (IPTU + condomínio)', value: 10000 },
      ],
    },
    period: {
      items: [
        { label: 'IPTU (12 meses)', value: 0 },
        { label: 'Condomínio mensal', value: 600 },
        { label: 'Desocupação', value: 0 },
        { label: 'Taxa seguro Caixa', value: 0 },
      ],
      op6: 3600,
      op12: 7200,
    },
    scenarios: [
      { months: 6, sale: 265000, brokerage: 13250, brokerageLabel: 'Corretagem (6%)', taxPct: 15 },
      { months: 12, sale: 275000, brokerage: 16500, brokerageLabel: 'Corretagem (6%)', taxPct: 15 },
    ],
    heroScenario: 0,
    roiLabel: 'ROI líquido',
    validation: VALIDATION,
    closing: closing('A PJK Invest'),
    caveats: [
      'Assessoria ajustada para R$ 10.000 (no PDF: “Assessoria (5%)” R$ 6.000); totais, ROI e lucro recalculados.',
      'Lance inicial R$ 150.626,91 × valor arrematado na planilha R$ 150.620,00.',
      'Condomínio R$ 570 na ficha × R$ 600 na planilha.',
      'Corretagem 6 meses rotulada 6%, mas R$ 13.250 equivale a 5% de R$ 265.000.',
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
        { label: 'IPTU (12 meses)', value: 0 },
        { label: 'Condomínio mensal', value: 300 },
        { label: 'Desocupação amigável', value: 0 },
        { label: 'Engenharia Caixa', value: 750 },
      ],
      op6: 2550,
      op12: 4350,
    },
    scenarios: [
      { months: 6, sale: 175000, brokerage: 10500, brokerageLabel: 'Corretagem (6%)', taxPct: 15 },
      { months: 12, sale: 180000, brokerage: 9000, brokerageLabel: 'Corretagem (6%)', taxPct: 15 },
    ],
    heroScenario: 0,
    roiLabel: 'ROI líquido',
    validation: VALIDATION,
    closing: closing('A PJK Invest'),
    caveats: [
      'Assessoria ajustada para R$ 10.000 (no PDF: R$ 7.000); totais, ROI e lucro recalculados.',
      'Corretagem 12 meses rotulada 6%, mas R$ 9.000 equivale a 5% de R$ 180.000.',
      'O PDF não traz o “a partir de” do mercado; 3º anúncio: título R$ 179.900, preço R$ 179.000 (usado R$ 179.000).',
      'Venda Direta: o PDF não informa data.',
    ],
  },
]

/* ───────────── números calculados ─────────────
 * Mesmas fórmulas da planilha dos PDFs (conferidas centavo a centavo nos 8 cenários originais):
 *   investimento total  = soma dos custos (sem as linhas de referência)
 *   investimento N meses = investimento total + custo operacional de N meses
 *   resultado bruto      = venda − corretagem − saldo devedor − investimento N meses
 *   ROI bruto            = resultado bruto ÷ investimento N meses
 *   resultado líquido    = resultado bruto × (1 − IRGC)   (centavos truncados, como no PDF)
 *   ROI líquido          = resultado líquido ÷ investimento N meses
 */
const cents = (v: number) => Math.round(v * 100) / 100
const floorCents = (v: number) => Math.floor(v * 100 + 1e-6) / 100
const pct2 = (v: number) => Math.round(v * 10000) / 100

function finalize(r: RawStudy): Study {
  const total = cents(r.costs.items.filter((i) => !i.ref).reduce((a, i) => a + i.value, 0))
  const scenarios = r.scenarios.map((sc) => {
    const investment = cents(total + (sc.months === 6 ? r.period.op6 : r.period.op12))
    const grossResult = cents(sc.sale - sc.brokerage - (sc.balance ?? 0) - investment)
    const netResult = floorCents(grossResult * (1 - sc.taxPct / 100))
    return { ...sc, investment, grossResult, grossRoi: pct2(grossResult / investment), netResult, netRoi: pct2(netResult / investment) }
  }) as Study['scenarios']
  return { ...r, costs: { items: r.costs.items, total }, scenarios }
}

export const studies: Study[] = raw.map(finalize)

export const getStudy = (slug: string) => studies.find((s) => s.slug === slug)
