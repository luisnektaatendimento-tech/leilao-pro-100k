# Estudos · PJK Invest

Apresentações web imersivas dos estudos de oportunidade (imóveis de leilão).
Site estático: React + Vite + React Three Fiber + GSAP + Lenis + Tailwind.

## Rodar

```bash
cd estudos
npm install
npm run dev        # http://localhost:5173
```

Build de produção: `npm run build` (gera `dist/`), e `npm run preview` para testar o build.

## Publicar na Vercel

1. Na Vercel, **Add New → Project** e importe este repositório.
2. Em **Root Directory**, escolha `estudos`. A Vercel detecta Vite sozinha (build `npm run build`, saída `dist`).
3. Deploy. O `vercel.json` já redireciona `/estudo/<slug>` para o app, então os deep links funcionam.

## Adicionar um estudo novo

1. Coloque as imagens em `public/img/<slug>/`: `foto.webp` (fachada), `foto-thumb.webp` (~720 px) e `mapa.webp`.
2. Em `src/data/studies.ts`, copie um objeto do array `studies`, troque o `slug` e preencha os valores **exatamente como no PDF**.
   - Compra financiada: preencha `financing`, marque o valor arrematado com `ref: true`. A tela mostra a parcela, o saldo devedor e o ROI sobre o capital próprio.
   - Divergências do PDF vão em `caveats`. Elas aparecem só nas notas do apresentador (tecla N).
3. Pronto. A tela do imóvel (`src/study/PropertyScreen.tsx`) é montada a partir dos dados, sem tocar no layout.

## Durante a reunião

| Tecla | Ação |
|---|---|
| ← → · Espaço | Imóvel anterior / próximo (rolagem e swipe também funcionam) |
| M | Mapa dos estudos |
| F | Tela cheia |
| P | Modo apresentador (esconde a interface não essencial) |
| N (segurar) | Notas do apresentador |
| S | Liga/desliga o snap entre imóveis |
| A | Som (desligado por padrão) |
| Esc · H | Voltar aos estudos |

Cada imóvel é **um painel único em tela cheia**, com identidade própria (foto do imóvel ao fundo, cor de luz em `theme.tint`, nome em marca d'água e o destaque em que ele lidera o portfólio): foto e ficha à esquerda; lucro líquido, ROI, desconto, posição de mercado,
composição do investimento, cenários de 6 e 12 meses e validação à direita. A navegação horizontal passa de um
imóvel para o outro, e a URL acompanha (`/estudo/parque-florence`), servindo de link direto.

Os imóveis já vistos ("Vistos 2/4" e "Novo" / "Explorado" nas cartas) ficam salvos só no navegador de quem assiste.
Quando os 4 imóveis forem vistos, aparece um selo e uma onda de luz no fundo.

## Regras de conteúdo

- Nenhum número é inventado: tudo vem do PDF.
- Valores derivados por conta simples (desconto sobre a avaliação, % de cada custo, IRGC em reais, restante financiado) aparecem sempre marcados como **calculado**.

## Design system

Segue o design system e a tipografia da **Apple** (modo escuro): SF Pro (fontes do sistema em Mac, iPhone e iPad;
fora deles o fallback é Inter), cores do sistema (#000, #1C1C1E, cinzas translúcidos, amarelo #FFD60A, verde #30D158,
azul #0A84FF), legendas em caixa normal, botões nos estilos cheio/tingido/cinza, controles segmentados e materiais
translúcidos. Cada imóvel tem a própria cor de luz em `theme.tint` (`src/data/studies.ts`). Os tokens ficam no topo de
`src/styles/index.css`.

## Linha do tempo dos pagamentos

No painel de cada imóvel, o botão "Linha do tempo dos pagamentos" (ou a tecla L) mostra, etapa por etapa, o que se
paga e em que ordem: arremate, registro, débitos, reforma, manutenção, venda, imposto e resultado, com o saldo do
investidor em cada momento. A etapa de cada custo fica no campo `phase` das linhas de custo em `studies.ts`. A ordem é
a típica de uma compra em leilão; os prazos reais seguem o edital.
