# Black Casa Barata de Leilão · página de vendas

Site estático (sem build), um único arquivo: `index.html`. Mesma sequência de blocos da página Venda Aprovada (01 a 19), em versão escura.

## O que trocar antes de publicar
Tudo fica no fim do `index.html`, no bloco `CONFIGURAÇÃO`:

| Campo | O que é |
|---|---|
| `CHECKOUT_COMPLETO` | Link do checkout do Arsenal Completo (todos os botões) |
| `CHECKOUT_BASICO` | Link do checkout do Arsenal Básico |
| `FIM_DA_OFERTA` | Data e hora reais do fim da oferta (alimenta a barra do topo, o contador e o CTA final) |

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
Gravações de tela feitas no celular, em `assets/video/` (`fexo`, `multy`, `canaw`, `pro`), cada uma em `.mp4` (principal), `.webm` (reserva) e `.jpg` (capa).
O vídeo da vez toca sozinho, sem som, só enquanto a seção está na tela, e ao terminar passa para a próxima plataforma. Para trocar um vídeo, substitua os três arquivos de mesmo nome.
O Dossiê do Assessor ainda não tem vídeo: o site dele não pôde ser aberto para gravar.
