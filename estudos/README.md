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
   - Compra financiada: preencha `financing`, marque o valor arrematado com `ref: true` e o roteiro ganha a cena "Estrutura financiada" sozinho.
   - Divergências do PDF vão em `caveats`. Elas aparecem só nas notas do apresentador (tecla N).
3. Pronto. As cenas são montadas a partir dos dados (`src/lib/scenes.ts`), sem tocar no layout.

## Durante a reunião

| Tecla | Ação |
|---|---|
| ← → · Espaço | Navegar entre cenas (rolagem e swipe também funcionam) |
| M | Mapa de capítulos |
| F | Tela cheia |
| P | Modo apresentador (esconde a interface não essencial) |
| N (segurar) | Notas do apresentador |
| S | Liga/desliga o snap |
| A | Som (desligado por padrão) |
| T | Alterna a paleta A (Champagne) / B (Verde) |
| Esc · H | Voltar aos estudos |

Deep link por cena: `/estudo/parque-florence#cena-5`.

O progresso ("novo", "em andamento X%", "explorado") e os insights ficam salvos só no navegador de quem assiste.

## Regras de conteúdo

- Nenhum número é inventado: tudo vem do PDF.
- Valores derivados por conta simples (desconto sobre a avaliação, % de cada custo, IRGC em reais, restante financiado) aparecem sempre marcados como **calculado**.

## Tipografia

Usa a tipografia da Apple pelas fontes do sistema: **SF Pro** (títulos e textos) e **SF Mono** (valores).
Em Mac, iPhone e iPad ela aparece nativamente. A Apple não permite embutir a SF em sites, então em
Windows e Android o site usa automaticamente **Inter** e **JetBrains Mono**, as alternativas mais próximas.
