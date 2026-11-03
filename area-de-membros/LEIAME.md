# Central Comercial · área de membros do time

**No ar:** https://central-comercial-topaz.vercel.app

Site estático (sem build) com as 6 aulas da formação e o Arsenal de roteiros por origem de lead.

| Arquivo | O que é |
|---|---|
| `index.html` | O site: layout, navegação e telas |
| `conteudo.js` | **Todo o conteúdo**: aulas, links dos vídeos, roteiros, SPIN, follow-up, rotina e CRM |
| `assets/` | Miniaturas das aulas e logos |

## Como ligar os vídeos
Abra `conteudo.js` e cole o link de cada aula no campo `video`. Aceita:
- **YouTube (não listado):** o mais recomendado. Os capítulos ficam clicáveis e pulam para o minuto certo.
- **Google Drive:** com o compartilhamento "Qualquer pessoa com o link". Os capítulos não pulam o vídeo.
- **Arquivo .mp4:** um link direto para o arquivo.

## Como publicar
Funciona em qualquer hospedagem de site estático (Vercel, Netlify, GitHub Pages): suba a pasta `area-de-membros/` inteira.

## O que fica salvo
O progresso das aulas, o placar do dia e os nomes da barra "Personalizar" ficam salvos só no navegador de cada vendedor.
