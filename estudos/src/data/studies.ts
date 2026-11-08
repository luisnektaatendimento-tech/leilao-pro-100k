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

const imgs = (slug: string) => ({
  photo: asset(`/img/${slug}/foto.webp`),
  thumb: asset(`/img/${slug}/foto-thumb.webp`),
  blur: asset(`/img/${slug}/foto-blur.webp`),
})
const PJK = { name: 'PJK Invest', instagram: '@pjkinvest' }
const ADJ = (pdf: string) => `Assessoria ajustada para R$ 10.000 (no PDF: ${pdf}); totais, ROI e lucro recalculados.`

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
      blur: asset('/img/parque-florence/foto-blur.webp'),
    },
    theme: { tint: '#e8b57a', name: 'Areia' },
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
        { label: 'Valor arrematado', value: 100148.49, phase: 'arremate' },
        { label: 'Leiloeiro (5%)', value: 0, pctOfBid: 0.05, phase: 'arremate' },
        { label: 'Assessoria', value: 10000, phase: 'arremate' },
        { label: 'Imposto de transmissão (ITBI)', value: 3380, phase: 'registro' },
        { label: 'Custos cartorários (escritura + registro)', value: 10250, phase: 'registro' },
        { label: 'Possível reforma', value: 0, phase: 'obra' },
        { label: 'Débitos pendentes (IPTU + condomínio)', value: 9728.6, phase: 'debitos' },
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
      blur: asset('/img/alberto-monteiro/foto-blur.webp'),
    },
    theme: { tint: '#6fa3ff', name: 'Azul' },
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
        { label: 'Valor arrematado', value: 119000, ref: true, phase: 'arremate' },
        { label: 'Entrada (30%)', value: 0, pctOfBid: 0.3, phase: 'arremate' },
        { label: 'Leiloeiro (5%)', value: 0, pctOfBid: 0.05, phase: 'arremate' },
        { label: 'Assessoria', value: 10000, phase: 'arremate' },
        { label: 'Imposto de transmissão (ITBI)', value: 2380, phase: 'registro' },
        { label: 'Custos cartorários (escritura + registro)', value: 10245, phase: 'registro' },
        { label: 'Possível reforma', value: 10000, phase: 'obra' },
        { label: 'Débitos pendentes (IPTU + condomínio)', value: 7000, phase: 'debitos' },
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
      'Saldo devedor sem amortização: R$ 83.300 quitados na venda (as parcelas já entram como custo). O PDF descontava também o condomínio: R$ 66.200 / R$ 49.100.',
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
      blur: asset('/img/alta-vista-passare/foto-blur.webp'),
    },
    theme: { tint: '#7ddc8f', name: 'Verde' },
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
        { label: 'Valor arrematado', value: 150626.91, phase: 'arremate' },
        { label: 'Leiloeiro (5%)', value: 0, pctOfBid: 0.05, phase: 'arremate' },
        { label: 'Assessoria', value: 10000, phase: 'arremate' },
        { label: 'Imposto de transmissão (ITBI)', value: 4880, phase: 'registro' },
        { label: 'Custos cartorários (escritura + registro)', value: 10000, phase: 'registro' },
        { label: 'Possível reforma', value: 0, phase: 'obra' },
        { label: 'Débitos pendentes (IPTU + condomínio)', value: 10000, phase: 'debitos' },
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
      blur: asset('/img/ville-de-marseille/foto-blur.webp'),
    },
    theme: { tint: '#f0937a', name: 'Terracota' },
    market: {
      listings: [
        { title: 'Apto novo, 2 quartos · Ville de Marseille', price: 189000, area: '44 m²', where: 'Novo Mondubim' },
        { title: 'Apartamento à venda', price: 180000, area: '80 m²', where: 'Mondubim' },
        { title: 'Apto 2 dormitórios, 44 m²', price: 179000, area: '44 m²', where: 'Mondubim' },
      ],
    },
    costs: {
      items: [
        { label: 'Valor arrematado', value: 94222.54, phase: 'arremate' },
        { label: 'Assessoria', value: 10000, phase: 'arremate' },
        { label: 'Imposto de transmissão (ITBI)', value: 3180, phase: 'registro' },
        { label: 'Custos cartorários (escritura + registro)', value: 9500, phase: 'registro' },
        { label: 'Possível reforma', value: 5000, phase: 'obra' },
        { label: 'Débitos pendentes (IPTU + condomínio)', value: 8500, phase: 'debitos' },
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
  /* ═════════════════════ estudos adicionados em nov/2026 ═════════════════════ */

  /* ─────────────────────────── GREEN MAISON ─────────────────────────── */
  {
    slug: 'green-maison',
    title: 'Green Maison',
    fullTitle: 'Condomínio Green Maison',
    kicker: 'Oportunidade de Investimento',
    brand: PJK,
    sale: { modality: 'Licitação Aberta', date: '2026-08-06', time: '10h', lot: '144440000758-7', hasAuctioneerLink: true },
    appraisal: { source: 'Caixa', value: 550000 },
    minimumBid: 350522.87,
    property: { address: 'Rua José Bento, 313 · Casa 42 · Amador', city: 'Eusébio · CE · 61769-240', unit: 'Casa 42', area: 123.52, bedrooms: 3, bathrooms: 4, condoFee: 500 },
    images: imgs('green-maison'),
    theme: { tint: '#9fd36b', name: 'Verde-folha' },
    market: { listings: [] },
    costs: {
      items: [
        { label: 'Valor arrematado', value: 350522.87, ref: true, phase: 'arremate' },
        { label: 'Entrada (5%)', value: 0, pctOfBid: 0.05, phase: 'arremate' },
        { label: 'Leiloeiro (5%)', value: 0, pctOfBid: 0.05, phase: 'arremate' },
        { label: 'Assessoria', value: 10000, phase: 'arremate' },
        { label: 'Imposto de transmissão (ITBI)', value: 11000, phase: 'registro' },
        { label: 'Custos cartorários (escritura + registro)', value: 9500, phase: 'registro' },
        { label: 'Possível reforma', value: 10000, phase: 'obra' },
        { label: 'Débitos pendentes (IPTU + condomínio)', value: 55000, phase: 'debitos' },
      ],
    },
    period: {
      items: [
        { label: 'IPTU (12 meses)', value: 850, kind: 'once' },
        { label: 'Condomínio mensal', value: 500, kind: 'monthly' },
        { label: 'Parcela mensal', value: 3680.48, kind: 'monthly' },
        { label: 'Desocupação amigável', value: 0, kind: 'once' },
        { label: 'Taxa seguro Caixa', value: 190, kind: 'once' },
      ],
    },
    financing: { downPaymentLabel: 'Entrada (5%)', installment: 3680.48 },
    scenarios: [
      { months: 6, sale: 590000, brokerageRate: 0.06, taxPct: 15 },
      { months: 12, sale: 600000, brokerageRate: 0.06, taxPct: 15 },
    ],
    heroScenario: 0,
    roiLabel: 'ROI líquido s/ capital próprio',
    validation: [],
    closing: closing('A PJK Invest'),
    caveats: [
      'PDF de 2 páginas: dados do imóvel tirados do print do anúncio da Caixa (avaliação, lance, endereço, área privativa 123,52 m², 4 WC).',
      ADJ('R$ 17.526,10'),
      'Arremate igualado ao lance mínimo R$ 350.522,87 (a planilha usava R$ 350.522,00).',
      'Entrada de apenas 5% do arremate, como no PDF; o PDF não traz análise de mercado nem checklist de validação.',
    ],
  },

  /* ─────────────────────────── PLANALTO ARACAPÉ ─────────────────────────── */
  {
    slug: 'planalto-aracape',
    title: 'Planalto Aracapé',
    fullTitle: 'Loteamento Planalto Aracapé',
    kicker: 'Oportunidade de Investimento',
    brand: PJK,
    sale: { modality: 'Licitação Aberta', date: '2026-09-09', time: '10h', lot: '844440104800-5', hasAuctioneerLink: true },
    appraisal: { source: 'Caixa', value: 270000 },
    minimumBid: 165322.22,
    property: { address: 'R. Alan Castelo, 64 · LT 24 QD A · Aracapé', city: '', unit: 'Casa · terreno 156 m²', area: 83.15, bedrooms: 3, bathrooms: 2, parking: 1, condoFee: 0 },
    images: imgs('planalto-aracape'),
    theme: { tint: '#c79bff', name: 'Lavanda' },
    market: { from: 240000, listings: [] },
    costs: {
      items: [
        { label: 'Valor arrematado', value: 165322.22, phase: 'arremate' },
        { label: 'Leiloeiro (5%)', value: 0, pctOfBid: 0.05, phase: 'arremate' },
        { label: 'Assessoria', value: 10000, phase: 'arremate' },
        { label: 'Imposto de transmissão (ITBI)', value: 3620, phase: 'registro' },
        { label: 'Custos cartorários (escritura + registro)', value: 10200, phase: 'registro' },
        { label: 'Possível reforma', value: 15000, phase: 'obra' },
        { label: 'Débitos pendentes (IPTU + condomínio)', value: 0, phase: 'debitos' },
      ],
    },
    period: {
      items: [
        { label: 'IPTU (12 meses)', value: 0, kind: 'once' },
        { label: 'Condomínio mensal', value: 0, kind: 'monthly' },
        { label: 'Desocupação', value: 0, kind: 'once' },
        { label: 'Taxa seguro Caixa', value: 750, kind: 'once' },
      ],
    },
    scenarios: [
      { months: 6, sale: 270000, brokerageRate: 0.06, taxPct: 15 },
      { months: 12, sale: 275000, brokerageRate: 0.06, taxPct: 15 },
    ],
    heroScenario: 0,
    roiLabel: 'ROI líquido',
    validation: VALIDATION,
    closing: closing('A PJK Invest'),
    caveats: [ADJ('“Assessoria (5%)” R$ 7.000'), 'Corretagem 12 meses rotulada 5%, mas o valor do PDF (R$ 16.500) é 6%; mantido 6%.', 'Aceita FGTS (à vista). O PDF não informa a cidade.'],
  },

  /* ─────────────────────────── PARQUE BOUGAINVILLE ─────────────────────────── */
  {
    slug: 'parque-bougainville',
    title: 'Parque Bougainville',
    fullTitle: 'Condomínio Parque Bougainville',
    kicker: 'Oportunidade de Investimento',
    brand: PJK,
    sale: { modality: 'Licitação Aberta', date: '2026-10-26', time: '10h', lot: '878771884061-9', hasAuctioneerLink: true },
    appraisal: { source: 'Caixa', value: 196000 },
    minimumBid: 118465.05,
    property: { address: 'Condomínio Parque Bougainville', city: 'Fortaleza · CE', unit: 'Apartamento 805 · Torre 02', area: 39.03, bedrooms: 2, bathrooms: 1, parking: 1, condoFee: 269.68 },
    images: imgs('parque-bougainville'),
    theme: { tint: '#ff8fb1', name: 'Buganvília' },
    market: { from: 230000, listings: [] },
    costs: {
      items: [
        { label: 'Valor arrematado', value: 118465.05, phase: 'arremate' },
        { label: 'Leiloeiro (5%)', value: 0, pctOfBid: 0.05, phase: 'arremate' },
        { label: 'Assessoria', value: 10000, phase: 'arremate' },
        { label: 'Imposto de transmissão (ITBI)', value: 3920, phase: 'registro' },
        { label: 'Custos cartorários (escritura + registro)', value: 10200, phase: 'registro' },
        { label: 'Possível reforma', value: 5000, phase: 'obra' },
        { label: 'Débitos pendentes (IPTU + condomínio)', value: 11260, phase: 'debitos' },
      ],
    },
    period: {
      items: [
        { label: 'IPTU (12 meses)', value: 0, kind: 'once' },
        { label: 'Condomínio mensal', value: 269.68, kind: 'monthly' },
        { label: 'Desocupação', value: 0, kind: 'once' },
        { label: 'Taxa seguro Caixa', value: 750, kind: 'once' },
      ],
    },
    scenarios: [
      { months: 6, sale: 220000, brokerageRate: 0.06, taxPct: 15 },
      { months: 12, sale: 230000, brokerageRate: 0.06, taxPct: 15 },
    ],
    heroScenario: 0,
    roiLabel: 'ROI líquido',
    validation: VALIDATION,
    closing: closing('A PJK Invest'),
    caveats: [ADJ('“Assessoria (5%)” R$ 8.500'), 'O “Investimento total” do PDF (R$ 152.008,30) não somava os débitos pendentes (R$ 11.260); aqui eles entram no total.', 'Corretagem 12 meses rotulada 5%, mas o valor do PDF (R$ 13.800) é 6%; mantido 6%.'],
  },

  /* ─────────────────────────── OSVALDO STUDART ─────────────────────────── */
  {
    slug: 'osvaldo-studart',
    title: 'Osvaldo Studart',
    fullTitle: 'Condomínio Osvaldo Studart',
    kicker: 'Oportunidade de Investimento',
    brand: PJK,
    sale: { modality: 'Edital Único', hasAuctioneerLink: true },
    appraisal: { source: '', value: 1800000 },
    minimumBid: 1000000,
    property: { address: 'Condomínio Osvaldo Studart', city: '', unit: 'Casa duplex', area: 232.68, bedrooms: 4, bathrooms: 2, parking: 2, condoFee: 650 },
    images: imgs('osvaldo-studart'),
    theme: { tint: '#e6c86e', name: 'Ouro' },
    market: { from: 2000000, listings: [] },
    costs: {
      items: [
        { label: 'Valor arrematado', value: 1000000, ref: true, phase: 'arremate' },
        { label: 'Entrada (20%)', value: 0, pctOfBid: 0.2, phase: 'arremate' },
        { label: 'Leiloeiro (5%)', value: 0, pctOfBid: 0.05, phase: 'arremate' },
        { label: 'Assessoria', value: 10000, phase: 'arremate' },
        { label: 'Imposto de transmissão (ITBI)', value: 14150, phase: 'registro' },
        { label: 'Custos cartorários (escritura + registro)', value: 12000, phase: 'registro' },
        { label: 'Possível reforma', value: 30000, phase: 'obra' },
        { label: 'Débitos pendentes (IPTU + condomínio)', value: 0, phase: 'debitos' },
      ],
    },
    period: {
      items: [
        { label: 'IPTU (12 meses)', value: 4477, kind: 'once' },
        { label: 'Condomínio mensal', value: 650, kind: 'monthly' },
        { label: 'Parcela mensal', value: 10500, kind: 'monthly' },
        { label: 'Desocupação amigável', value: 12000, kind: 'once' },
        { label: 'Taxa seguro Caixa', value: 0, kind: 'once' },
      ],
    },
    financing: { downPaymentLabel: 'Entrada (20%)', installment: 10500 },
    scenarios: [
      { months: 6, sale: 1650000, brokerageRate: 0.06, taxPct: 15 },
      { months: 12, sale: 1700000, brokerageRate: 0.05, taxPct: 15 },
    ],
    heroScenario: 0,
    roiLabel: 'ROI líquido s/ capital próprio',
    validation: VALIDATION,
    closing: closing('A PJK Invest'),
    caveats: [
      ADJ('R$ 50.000'),
      'Corretagem 6 meses rotulada 6%, mas o PDF usou R$ 82.500 (5%); mantido 6% (R$ 99.000). 12 meses: 5% (R$ 85.000), como no PDF.',
      'O PDF não informa data do edital, endereço nem quem fez a avaliação.',
    ],
  },

  /* ─────────────────────────── CONQUISTA CASTELLI ─────────────────────────── */
  {
    slug: 'conquista-castelli',
    title: 'Conquista Castelli',
    fullTitle: 'Condomínio Conquista Castelli',
    kicker: 'Oportunidade de Investimento',
    brand: PJK,
    sale: { modality: 'Licitação Aberta', date: '2026-09-24', time: '10h', lot: '878771671206-0', hasAuctioneerLink: true },
    appraisal: { source: 'Caixa', value: 175000 },
    minimumBid: 103704.06,
    property: { address: 'Condomínio Conquista Castelli', city: '', unit: 'Apartamento 504 · Bloco 09', area: 42.64, bedrooms: 2, bathrooms: 1, parking: 1, condoFee: 300 },
    images: imgs('conquista-castelli'),
    theme: { tint: '#ffb86b', name: 'Âmbar' },
    market: { from: 235000, listings: [] },
    costs: {
      items: [
        { label: 'Valor arrematado', value: 103704.06, phase: 'arremate' },
        { label: 'Leiloeiro (5%)', value: 0, pctOfBid: 0.05, phase: 'arremate' },
        { label: 'Assessoria', value: 10000, phase: 'arremate' },
        { label: 'Imposto de transmissão (ITBI)', value: 3620, phase: 'registro' },
        { label: 'Custos cartorários (escritura + registro)', value: 10200, phase: 'registro' },
        { label: 'Possível reforma', value: 5000, phase: 'obra' },
        { label: 'Débitos pendentes (IPTU + condomínio)', value: 11929.31, phase: 'debitos' },
      ],
    },
    period: {
      items: [
        { label: 'IPTU (12 meses)', value: 0, kind: 'once' },
        { label: 'Condomínio mensal', value: 300, kind: 'monthly' },
        { label: 'Desocupação', value: 0, kind: 'once' },
        { label: 'Taxa seguro Caixa', value: 750, kind: 'once' },
      ],
    },
    scenarios: [
      { months: 6, sale: 210000, brokerageRate: 0.06, taxPct: 15 },
      { months: 12, sale: 215000, brokerageRate: 0.06, taxPct: 15 },
    ],
    heroScenario: 0,
    roiLabel: 'ROI líquido',
    validation: VALIDATION,
    closing: closing('A PJK Invest'),
    caveats: [ADJ('“Assessoria (5%)” R$ 10.108'), 'Corretagem 12 meses rotulada 5%, mas o valor do PDF (R$ 12.900) é 6%; mantido 6%.', 'Aceita FGTS (à vista). O PDF não informa a cidade.'],
  },

  /* ─────────────────────────── EXPEDICIONÁRIOS ─────────────────────────── */
  {
    slug: 'expedicionarios',
    title: 'Expedicionários',
    fullTitle: 'Edifício Expedicionários',
    kicker: 'Oportunidade de Investimento',
    brand: PJK,
    sale: { modality: 'Praça Única', date: '2026-10-27', time: '14h', hasAuctioneerLink: true },
    appraisal: { source: '', value: 250000 },
    minimumBid: 135000,
    property: { address: 'Av. dos Expedicionários, 4885 · Vila União', city: '', unit: 'Apartamento 302', area: 120, bedrooms: 3, bathrooms: 2, parking: 1, condoFee: 300 },
    images: imgs('expedicionarios'),
    theme: { tint: '#ff9f6b', name: 'Coral' },
    market: { from: 265000, listings: [] },
    costs: {
      items: [
        { label: 'Valor arrematado', value: 135000, phase: 'arremate' },
        { label: 'Leiloeiro (5%)', value: 0, pctOfBid: 0.05, phase: 'arremate' },
        { label: 'Assessoria', value: 10000, phase: 'arremate' },
        { label: 'Imposto de transmissão (ITBI)', value: 5000, phase: 'registro' },
        { label: 'Custos cartorários (escritura + registro)', value: 10200, phase: 'registro' },
        { label: 'Possível reforma', value: 5000, phase: 'obra' },
        { label: 'Débitos pendentes (IPTU + condomínio)', value: 0, phase: 'debitos' },
      ],
    },
    period: {
      items: [
        { label: 'IPTU (12 meses)', value: 746, kind: 'once' },
        { label: 'Condomínio mensal', value: 300, kind: 'monthly' },
        { label: 'Desocupação', value: 3000, kind: 'once' },
        { label: 'Taxa seguro Caixa', value: 750, kind: 'once' },
      ],
    },
    scenarios: [
      { months: 6, sale: 250000, brokerageRate: 0.06, taxPct: 15 },
      { months: 12, sale: 260000, brokerageRate: 0.06, taxPct: 15 },
    ],
    heroScenario: 0,
    roiLabel: 'ROI líquido',
    validation: VALIDATION,
    closing: closing('A PJK Invest'),
    caveats: [ADJ('“Assessoria (5%)” R$ 7.000'), 'Lance inicial digitado “R$ 135.00,00” no PDF; usado R$ 135.000,00 (igual ao arremate da planilha).', 'Corretagem 12 meses rotulada 5%, mas o valor do PDF (R$ 15.600) é 6%; mantido 6%.'],
  },

  /* ─────────────────────────── MARIANA II ─────────────────────────── */
  {
    slug: 'mariana-ii',
    title: 'Mariana II',
    fullTitle: 'Edifício Mariana II',
    kicker: 'Oportunidade de Investimento',
    brand: PJK,
    sale: { modality: 'Praça Única', date: '2026-10-20', time: '10h', hasAuctioneerLink: true },
    appraisal: { source: '', value: 196000 },
    minimumBid: 81164,
    property: { address: 'R. Alfeu Aboim, 401 · Papicu', city: '', unit: 'Apartamento 401', area: 66.8, bedrooms: 3, bathrooms: 2, parking: 1, condoFee: 300 },
    images: imgs('mariana-ii'),
    theme: { tint: '#b4a3ff', name: 'Violeta' },
    market: { from: 230000, listings: [] },
    costs: {
      items: [
        { label: 'Valor arrematado', value: 81164, ref: true, phase: 'arremate' },
        { label: 'Entrada (20%)', value: 0, pctOfBid: 0.2, phase: 'arremate' },
        { label: 'Leiloeiro (5%)', value: 0, pctOfBid: 0.05, phase: 'arremate' },
        { label: 'Assessoria', value: 10000, phase: 'arremate' },
        { label: 'Imposto de transmissão (ITBI)', value: 649.32, phase: 'registro' },
        { label: 'Custos cartorários (escritura + registro)', value: 12000, phase: 'registro' },
        { label: 'Possível reforma', value: 5000, phase: 'obra' },
        { label: 'Débitos pendentes (IPTU + condomínio)', value: 0, phase: 'debitos' },
      ],
    },
    period: {
      items: [
        { label: 'IPTU (12 meses)', value: 0, kind: 'once' },
        { label: 'Condomínio mensal', value: 300, kind: 'monthly' },
        { label: 'Parcela mensal', value: 892.8, kind: 'monthly' },
        { label: 'Desocupação amigável', value: 3000, kind: 'once' },
        { label: 'Taxa seguro Caixa', value: 0, kind: 'once' },
      ],
    },
    financing: { downPaymentLabel: 'Entrada (20%)', installment: 892.8 },
    scenarios: [
      { months: 6, sale: 220000, brokerageRate: 0.05, taxPct: 15 },
      { months: 12, sale: 230000, brokerageRate: 0.05, taxPct: 15 },
    ],
    heroScenario: 0,
    roiLabel: 'ROI líquido s/ capital próprio',
    validation: VALIDATION,
    closing: closing('A PJK Invest'),
    caveats: [ADJ('R$ 7.000'), 'Corretagem de 5% nos dois cenários, como no PDF.', 'ITBI de R$ 649,32 conforme o PDF (bem abaixo dos demais estudos). Financiado em até 420 meses.'],
  },

  /* ─────────────────────────── CONJUNTO CEARÁ ─────────────────────────── */
  {
    slug: 'conjunto-ceara',
    title: 'Conjunto Ceará',
    fullTitle: 'Casa no Conjunto Ceará',
    kicker: 'Oportunidade de Investimento',
    brand: PJK,
    sale: { modality: 'Licitação Aberta', date: '2026-11-24', time: '10h', lot: '832810000005-6', hasAuctioneerLink: true },
    appraisal: { source: 'Caixa', value: 144000 },
    minimumBid: 144000,
    property: { address: 'R. 515, 126 · Conjunto Ceará II', city: '', unit: 'Casa · terreno 155,10 m²', area: 40.57, bedrooms: 2, bathrooms: 1, parking: 1, condoFee: 0 },
    images: imgs('conjunto-ceara'),
    theme: { tint: '#6fd0b0', name: 'Menta' },
    market: { from: 295000, listings: [] },
    costs: {
      items: [
        { label: 'Valor arrematado', value: 144000, phase: 'arremate' },
        { label: 'Leiloeiro (5%)', value: 0, pctOfBid: 0.05, phase: 'arremate' },
        { label: 'Assessoria', value: 10000, phase: 'arremate' },
        { label: 'Imposto de transmissão (ITBI)', value: 2880, phase: 'registro' },
        { label: 'Custos cartorários (escritura + registro)', value: 10200, phase: 'registro' },
        { label: 'Possível reforma', value: 40000, phase: 'obra' },
        { label: 'Débitos pendentes (IPTU + condomínio)', value: 231.94, phase: 'debitos' },
      ],
    },
    period: {
      items: [
        { label: 'IPTU (12 meses)', value: 196.12, kind: 'once' },
        { label: 'Condomínio mensal', value: 0, kind: 'monthly' },
        { label: 'Desocupação', value: 0, kind: 'once' },
        { label: 'Taxa seguro Caixa', value: 750, kind: 'once' },
      ],
    },
    scenarios: [
      { months: 6, sale: 280000, brokerageRate: 0.06, taxPct: 15 },
      { months: 12, sale: 300000, brokerageRate: 0.06, taxPct: 15 },
    ],
    heroScenario: 0,
    roiLabel: 'ROI líquido',
    validation: VALIDATION,
    closing: closing('A PJK Invest'),
    caveats: [ADJ('“Assessoria (5%)” R$ 7.000'), 'Lance inicial igual à avaliação (sem desconto), como no PDF.', 'Corretagem 12 meses rotulada 5%, mas o valor do PDF (R$ 18.000) é 6%; mantido 6%. Área sem unidade no PDF (40,57).'],
  },

  /* ─────────────────────────── PARQUE DOIS IRMÃOS ─────────────────────────── */
  {
    slug: 'parque-dois-irmaos',
    title: 'Parque Dois Irmãos',
    fullTitle: 'Casa no Parque Dois Irmãos',
    kicker: 'Oportunidade de Investimento',
    brand: PJK,
    sale: { modality: 'Venda Direta', date: '2026-10-16', time: 'até 17h', hasAuctioneerLink: true },
    appraisal: { source: '', value: 250000 },
    minimumBid: 125000,
    property: { address: 'R. 108, 36 · Parque Dois Irmãos', city: '', unit: 'Casa · terreno 140 m²', area: 46.75, bedrooms: 2, bathrooms: 1, parking: 1, condoFee: 0 },
    images: imgs('parque-dois-irmaos'),
    theme: { tint: '#ffd27a', name: 'Areia clara' },
    market: { from: 285000, listings: [] },
    costs: {
      items: [
        { label: 'Valor arrematado', value: 125000, phase: 'arremate' },
        { label: 'Leiloeiro (5%)', value: 0, pctOfBid: 0.05, phase: 'arremate' },
        { label: 'Assessoria', value: 10000, phase: 'arremate' },
        { label: 'Imposto de transmissão (ITBI)', value: 5000, phase: 'registro' },
        { label: 'Custos cartorários (escritura + registro)', value: 10200, phase: 'registro' },
        { label: 'Possível reforma', value: 15000, phase: 'obra' },
        { label: 'Débitos pendentes (IPTU + condomínio)', value: 2000, phase: 'debitos' },
      ],
    },
    period: {
      items: [
        { label: 'IPTU (12 meses)', value: 0, kind: 'once' },
        { label: 'Condomínio mensal', value: 0, kind: 'monthly' },
        { label: 'Desocupação', value: 3000, kind: 'once' },
        { label: 'Taxa seguro Caixa', value: 750, kind: 'once' },
      ],
    },
    scenarios: [
      { months: 6, sale: 260000, brokerageRate: 0.06, taxPct: 15 },
      { months: 12, sale: 280000, brokerageRate: 0.06, taxPct: 15 },
    ],
    heroScenario: 0,
    roiLabel: 'ROI líquido',
    validation: VALIDATION,
    closing: closing('A PJK Invest'),
    caveats: [
      ADJ('“Assessoria (5%)” R$ 7.000'),
      '⚠ O PDF traz “Avaliação R$ 125.000” e “Lance inicial R$ 250.000”, aparentemente invertidos; usado lance R$ 125.000 (igual ao arremate) e avaliação R$ 250.000. CONFIRMAR.',
      'Corretagem 12 meses rotulada 5%, mas o valor do PDF (R$ 16.800) é 6%; mantido 6%.',
    ],
  },

  /* ─────────────────────────── CASA EM ITAITINGA ─────────────────────────── */
  {
    slug: 'casa-itaitinga',
    title: 'Casa em Itaitinga',
    fullTitle: 'Casa em Itaitinga · Caracanga',
    kicker: 'Oportunidade de Investimento',
    brand: PJK,
    sale: { modality: 'Licitação Aberta', date: '2026-10-26', time: '10h', lot: '844442169435-2', hasAuctioneerLink: true },
    appraisal: { source: 'Caixa', value: 110000 },
    minimumBid: 62856.87,
    property: { address: 'R. Itapó, 72 · QD B LT 17 · Caracanga', city: 'Itaitinga · CE', unit: 'Casa · terreno 125 m²', area: 55.61, bedrooms: 2, bathrooms: 1, parking: 1, condoFee: 0 },
    images: imgs('casa-itaitinga'),
    theme: { tint: '#9be37a', name: 'Lima' },
    market: { from: 170000, listings: [] },
    costs: {
      items: [
        { label: 'Valor arrematado', value: 62856.87, phase: 'arremate' },
        { label: 'Leiloeiro (5%)', value: 0, pctOfBid: 0.05, phase: 'arremate' },
        { label: 'Assessoria', value: 10000, phase: 'arremate' },
        { label: 'Imposto de transmissão (ITBI)', value: 2200, phase: 'registro' },
        { label: 'Custos cartorários (escritura + registro)', value: 10200, phase: 'registro' },
        { label: 'Possível reforma', value: 15000, phase: 'obra' },
        { label: 'Débitos pendentes (IPTU + condomínio)', value: 69.33, phase: 'debitos' },
      ],
    },
    period: {
      items: [
        { label: 'IPTU (12 meses)', value: 63, kind: 'once' },
        { label: 'Condomínio mensal', value: 0, kind: 'monthly' },
        { label: 'Desocupação', value: 2000, kind: 'once' },
        { label: 'Taxa seguro Caixa', value: 750, kind: 'once' },
      ],
    },
    scenarios: [
      { months: 6, sale: 140000, brokerageRate: 0.06, taxPct: 15 },
      { months: 12, sale: 150000, brokerageRate: 0.06, taxPct: 15 },
    ],
    heroScenario: 0,
    roiLabel: 'ROI líquido',
    validation: VALIDATION,
    closing: closing('A PJK Invest'),
    caveats: [ADJ('“Assessoria (5%)” R$ 7.000'), 'Corretagem 12 meses rotulada 5%, mas o valor do PDF (R$ 9.000) é 6%; mantido 6%.', 'Aceita FGTS (à vista).'],
  },

  /* ─────────────────────────── CLARICE LISPECTOR ─────────────────────────── */
  {
    slug: 'clarice-lispector',
    title: 'Clarice Lispector',
    fullTitle: 'Condomínio Clarice Lispector',
    kicker: 'Oportunidade de Investimento',
    brand: PJK,
    sale: { modality: 'Licitação Aberta', date: '2026-07-17', time: '10h', hasAuctioneerLink: true },
    appraisal: { source: 'Caixa', value: 243000 },
    minimumBid: 154867.37,
    property: { address: 'R. 05H, 270 · Prefeito José Walter', city: 'Fortaleza · CE · 60749-025', unit: 'Casa 210', area: 53.66, bedrooms: 3, bathrooms: 2, parking: 1, condoFee: 500 },
    images: imgs('clarice-lispector'),
    theme: { tint: '#f0a3c8', name: 'Rosa' },
    market: { from: 300000, listings: [] },
    costs: {
      items: [
        { label: 'Valor arrematado', value: 154867.37, phase: 'arremate' },
        { label: 'Leiloeiro (5%)', value: 0, pctOfBid: 0.05, phase: 'arremate' },
        { label: 'Assessoria', value: 10000, phase: 'arremate' },
        { label: 'Imposto de transmissão (ITBI)', value: 4860, phase: 'registro' },
        { label: 'Custos cartorários (escritura + registro)', value: 10000, phase: 'registro' },
        { label: 'Possível reforma', value: 5000, phase: 'obra' },
        { label: 'Débitos pendentes (IPTU + condomínio)', value: 12000, phase: 'debitos' },
      ],
    },
    period: {
      items: [
        { label: 'IPTU (12 meses)', value: 0, kind: 'once' },
        { label: 'Condomínio mensal', value: 500, kind: 'monthly' },
        { label: 'Desocupação', value: 0, kind: 'once' },
        { label: 'Taxa seguro Caixa', value: 0, kind: 'once' },
      ],
    },
    scenarios: [
      { months: 6, sale: 290000, brokerageRate: 0.06, taxPct: 15 },
      { months: 12, sale: 310000, brokerageRate: 0.06, taxPct: 15 },
    ],
    heroScenario: 0,
    roiLabel: 'ROI líquido',
    validation: VALIDATION,
    closing: closing('A PJK Invest'),
    caveats: [ADJ('“Assessoria (5%)” R$ 7.743'), 'Arremate igualado ao lance R$ 154.867,37 (a planilha usava R$ 154.867,00).', 'Licitação de 17/07/2026 já ocorreu.'],
  },

]

/* ───────────── números calculados ─────────────
 * Todas as contas da apresentação saem daqui, com as fórmulas da planilha dos PDFs:
 *   leiloeiro / entrada   = % × valor arrematado
 *   investimento total    = soma dos custos (sem linhas de referência)
 *   custo operacional N m = Σ itens mensais × N + itens únicos
 *   investimento N meses  = investimento total + custo operacional N meses
 *   corretagem            = taxa × venda
 *   saldo devedor         = arremate − entrada (sem amortização, conservador; parcelas entram como custo)
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
  // saldo devedor sem amortização (conservador): as parcelas entram como custo do período e a dívida é quitada inteira na venda
  const balance = (_months: number) => (r.financing ? cents(bid - down) : undefined)

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
