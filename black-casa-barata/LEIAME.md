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
- **Bônus** (bloco 11) e os nomes das ferramentas (blocos 04 e 07).
- **Casos** (bloco 14): os 3 cartões são modelos. Troque pelos casos reais e apague a etiqueta "Modelo" e a frase de aviso.
- **Garantia** (bloco 15) e FAQ (bloco 17).

## Como publicar
Suba a pasta `black-casa-barata/` em qualquer hospedagem de site estático (Vercel, Netlify, GitHub Pages).
