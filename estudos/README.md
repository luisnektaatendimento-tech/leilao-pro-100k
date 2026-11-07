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
| T | Alterna a paleta A (Champagne) / B (Verde) |
| Esc · H | Voltar aos estudos |

Cada imóvel é **uma única tela**: foto e ficha à esquerda; lucro líquido, ROI, desconto, posição de mercado,
composição do investimento, cenários de 6 e 12 meses e validação à direita. A navegação horizontal passa de um
imóvel para o outro, e a URL acompanha (`/estudo/parque-florence`), servindo de link direto.

Os imóveis já vistos ("Vistos 2/4" e "Novo" / "Explorado" nas cartas) ficam salvos só no navegador de quem assiste.
Quando os 4 imóveis forem vistos, aparece um selo e uma onda de luz no fundo.

## Regras de conteúdo

- Nenhum número é inventado: tudo vem do PDF.
- Valores derivados por conta simples (desconto sobre a avaliação, % de cada custo, IRGC em reais, restante financiado) aparecem sempre marcados como **calculado**.

## Tipografia

Usa a tipografia da Apple pelas fontes do sistema: **SF Pro** (títulos e textos) e **SF Mono** (valores).
Em Mac, iPhone e iPad ela aparece nativamente. A Apple não permite embutir a SF em sites, então em
Windows e Android o site usa automaticamente **Inter** e **JetBrains Mono**, as alternativas mais próximas.
