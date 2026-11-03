# Projeto editável: EP01 Canaw + Fexô

O vídeo é gerado **por código**, e cada quadro é desenhado a partir do tempo. Para mudar textos, cores, posições, tempos ou demonstrações, edite os scripts e renderize de novo.

| Arquivo | Função |
|---|---|
| `edl.py` | Lista de cortes. Define o que sai da gravação, comprime pausas, insere as pausas de capítulo e gera `timeline.json` (palavras com o tempo novo) |
| `voice.py` | Monta a trilha de voz a partir dos cortes (`voice_raw.wav`). O tratamento (EQ, compressão, loudness) é feito com ffmpeg, como descrito no relatório |
| `cues.py` | **O roteiro de cenas.** Nós e setas do mapa, câmera, demonstrações, destaques, chips e legendas. Cada ação é ancorada numa frase da fala, por exemplo `T('clicar em financiamento')`. Gera `engine/data.js` e o `.srt` |
| `engine/index.html` | O motor gráfico: `render(t)` desenha o quadro do segundo `t`. Pode ser aberto no Chrome; no console, `render(120)` mostra o quadro de 2:00 |
| `music.py` | Trilha original e efeitos sonoros (gera `music.wav`) |
| `render.js` | Renderiza um intervalo de quadros para MP4 (Playwright + ffmpeg) |
| `snap.js` | Gera imagens de teste de tempos específicos: `node snap.js 30 120 400` |
| `assets/` | Telas reais da Canaw e da Fexô (capturadas em 1,5x), logos e o rascunho original |

## Como renderizar de novo
```bash
npm i @fontsource/inter@5.0.18 @fontsource/space-grotesk@5.0.18 @fontsource/jetbrains-mono@5.0.20 playwright
python3 cues.py
node render.js 0 20258 video.mp4
```
Depois, junte o vídeo com o áudio mixado (`voice.wav` + `music.wav`, com ducking e loudnorm em −14 LUFS) usando ffmpeg.

## Exemplos de ajuste rápido
- **Mudar o texto de uma caixa:** em `cues.py`, `node('f_score', 'Classificação do score', ...)`.
- **Mudar quando algo aparece:** troque a frase dentro de `T('…')`.
- **Trocar uma tela real:** coloque o PNG novo em `assets/` e aponte o `demo(...)` correspondente para ele.
