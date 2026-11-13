# Black Casa Barata de Leilão · página de vendas

Site estático (sem build), um único arquivo: `index.html`. Mesma sequência de blocos da página Venda Aprovada (01 a 19), em versão escura.

## O que trocar antes de publicar
Tudo fica no fim do `index.html`, no bloco `CONFIGURAÇÃO`:

| Campo | O que é |
|---|---|
| `CHECKOUT_COMPLETO` | Link do checkout (todos os botões): https://ggcheckout.app/checkout/v3/E5SbQcPcSKb0gnSA9uvvl1 (ggCheckout, Mercado Pago; desde 13/11 substitui a Cakto também na /joao) |
| `IC_NA_PAGINA` | `true`: a página manda o InitiateCheckout no clique. Trocar para `false` se o GG passar a mandar o IC dele |
| (sem campo) | A oferta termina sempre às 23:59 do dia em que a pessoa abre a página, no relógio dela |

No HTML, revise também:
- **Preços** (bloco 12, `id="planos"`, e a barra fixa do celular `data-dock`).
- **Aula bônus** (bloco 11) e a descrição de cada parte do arsenal (blocos 04 e 07).
- **Bloco 14**: mostra as 4 plataformas trabalhando juntas (CANAW, Fexô, Multy e Dossiê).
- **Garantia** (bloco 15) e FAQ (bloco 17).

## Como publicar
Suba a pasta `black-casa-barata/` em qualquer hospedagem de site estático (Vercel, Netlify, GitHub Pages).

## Identidade de cada plataforma
Cada produto aparece com o design system da própria plataforma, lido dos sites (variáveis no bloco "DESIGN SYSTEM DE CADA PLATAFORMA" do CSS):

| Produto | Cores | Fontes | Arquivos |
|---|---|---|---|
| Fexô | lima `#bff23a`, escuro `#17181d`, azul `#2563eb` | Manrope, Space Grotesk | `assets/fexo-logo.webp`, `assets/fexo-simbolo.webp` |
| Multy | roxo `#7c3aed` → `#c084fc` | Manrope | `assets/multy.webp` (mascote), símbolo em SVG |
| CANAW | preto, branco `#f5f5f7`, vermelho ao vivo `#ff453a` | Inter | símbolo em SVG |
| Leilão PRO | `#050505`, prata metálico | Montserrat | — |
| Dossiê do Assessor | navy e azul (aproximado, o site não pôde ser lido) | Archivo | — |

## Vitrine com vídeos (bloco 05)
Gravações de tela feitas no celular, em `assets/video/` (`fexo`, `multy`, `canaw`, `pro`), cada uma em `.mp4` (principal), `.webm` (reserva) e `.webp` (capa).
O vídeo da vez toca sozinho, sem som, só enquanto a seção está na tela, e ao terminar passa para a próxima plataforma. Para trocar um vídeo, substitua os três arquivos de mesmo nome.
O Dossiê do Assessor ainda não tem vídeo: o site dele não pôde ser aberto para gravar.

## Páginas de afiliado

Cada afiliado usa a mesma página, só com outro link de checkout.

- Atual (13/11): `blackcasabaratadeleilao.com/joao` → `https://ggcheckout.app/checkout/v3/E5SbQcPcSKb0gnSA9uvvl1?src=joao` (o `src=joao` marca a venda do perfil do João). O link antigo da Cakto (`364q77y_1305972?affiliate=Vefhwodg`) saiu de uso.
- Para criar outro (ex.: `/maria`):
  1. Em `index.html`, no bloco `CHECKOUT_AFILIADOS`, acrescente `"/maria": "link-de-checkout-da-maria"`.
  2. Em `vercel.json`, repita as entradas de `/joao` trocando por `/maria` (rewrite para `/index.html`, redirect de `/maria/` e cabeçalho de cache).
- As UTMs da URL continuam sendo repassadas ao checkout também nas páginas de afiliado.

## Rastreamento (13/11/2026)

- **Pixel / dataset:** "Black Casa Barata de Leilões" `1886866205827899`, conta CA02 - Paulinho dos Leilões (act 1438294331143484). O pixel antigo `1633178111557271` ("Eventos para Homens - Paulinho") fica só no histórico.
- **Na página** (head do `index.html`): PageView e ViewContent (R$ 37) ao abrir; InitiateCheckout no clique de cada botão com `data-checkout`. `external_id` = código do visitante (`pd_visitante`). Vale para `/` e `/joao` (mesmo arquivo).
- **API de Conversões:** `api/capi.js` recebe o mesmo evento com o mesmo `event_id`. Precisa de `META_CAPI_TOKEN` (Production) no projeto Vercel `black-casa-barata`; sem ele a rota responde 503 e só o pixel conta. O token nunca vai para arquivo. Teste: abra a página com `?test_event_code=TEST…`.
- **Checkout:** os botões levam ao GG repassando todos os parâmetros da URL (UTMs, fbclid). Conferido em 13/11: o GG não carregava nenhum pixel ao abrir.
- **Purchase:** sai do pixel configurado no produto do GG (Pixels & Rastreio, com o token da API de Conversões), valor 37,00 BRL.
- **Multifly** (https://multifly-tracking.vercel.app), cliente **Paulinho dos Leilões**, id `paulinho-dos-leiloes`: `rastreio.js` no fim da página (`data-cliente="paulinho-dos-leiloes"`). Guarda UTMs, fbclid, `src` e `sck` por 7 dias e leva tudo nos links do GG, com `utm_term=<termo>|mfv:<visitante>` (mesmo `pd_visitante` do pixel). Mede visita, clique para o checkout, rolagem, tempo e os blocos `data-secao` 01-topo … 12-rodape, numerados na ordem da página (bloco novo ganha o número da posição dele; não repetir chave).
- **UTMs dos anúncios** (campo "Parâmetros de URL"), padrão da Multifly e do NEKTA, com nome **e id** para a venda chegar até o anúncio:
  `utm_source=FB&utm_campaign={{campaign.name}}|{{campaign.id}}&utm_medium={{adset.name}}|{{adset.id}}&utm_content={{ad.name}}|{{ad.id}}&utm_term={{placement}}`
  O padrão antigo (`utm_source=meta&utm_medium=paid&…&utm_term={{adset.name}}`) não serve: a Multifly lê o conjunto no `utm_medium` e, sem id, casa só pelo nome (anúncios com o mesmo nome em conjuntos diferentes se misturam).
