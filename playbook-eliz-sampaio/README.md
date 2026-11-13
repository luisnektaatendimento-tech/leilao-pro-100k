# Playbook Comercial — Eliz Sampaio

Mentoria Investidor Imobiliário · processo de ascensão.

Abra `index.html` no navegador.

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Interface navegável: 7 módulos, vídeo com capítulos e transcrição sincronizada, pendências |
| `ep07-esteira-de-ascensao.mp4` | Episódio 07 · Esteira de Ascensão (5:25, versão web 720p). O original em 1080p e o projeto ficam em `../video-ep07-eliz-esteira/` |
| `esteira-ascensao-editado.mp4` | Primeira versão: só os cortes da gravação de tela (5min11s) |
| `legendas.vtt` | Legendas em português |
| `docs/01-transcricao.md` | Transcrição bruta do original e revisada do editado |
| `docs/02-mapa-de-conhecimento.md` | Mapa de conhecimento extraído do vídeo |
| `docs/03-esteira-e-fluxo-de-ascensao.md` | Esteira e fluxogramas |
| `docs/05-relatorio-de-edicao.md` | Cortes feitos, motivos e auditoria |

O relatório de pendências para a Eliz está na interface, na seção “Pendências”.

O vídeo-fonte é uma reunião de desenho da esteira. Quem fala é o condutor da reunião; não há falas da Eliz no áudio. O playbook separa o que está no vídeo, o que está pendente e o que é sugestão.

## Área de controle (Multiply)

A seção **Performance da ascensão → Área de controle** é o lugar do Multiply. Enquanto o endereço não é configurado, a tela mostra "Em integração".

Para ligar o Multiply, edite `index.html` e preencha a constante (procure por `MULTIPLY_URL`):

```js
const MULTIPLY_URL='https://endereco-do-multiply';
```

- O endereço precisa começar com `https://`.
- A área abre o Multiply dentro da tela, com um botão "Abrir em nova aba" ao lado.
- Para abrir embutido, o Multiply precisa permitir ser exibido em outro site (cabeçalhos `X-Frame-Options` e `Content-Security-Policy: frame-ancestors`). Se ele bloquear, o botão "Abrir em nova aba" continua funcionando.
- Fluxo do sistema: quem abre o link assiste primeiro à aula; o botão "Entrar na área de controle da ascensão" leva direto para esta tela.
