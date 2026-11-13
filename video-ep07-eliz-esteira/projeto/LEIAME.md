# Projeto editável: EP07 Esteira de Ascensão

O vídeo é gerado **por código**: cada quadro é desenhado a partir do tempo. Para mudar textos, cores, posições, tempos ou telas, edite os scripts e renderize de novo. É o mesmo método do EP01.

| Arquivo | Função |
|---|---|
| `edl.py` | Lista de cortes (`REMOVE`, com o motivo de cada um) e capítulos. Comprime pausas e gera `timeline.json`, com o tempo novo de cada palavra |
| `voice.py` | Monta a voz a partir dos cortes (`voice_raw.wav`) |
| `cues.py` | **O roteiro de cenas.** Nós e setas da esteira, câmera, telas, destaques, selos e legendas. Cada ação é ancorada numa frase da fala, por exemplo `T('20 modelos')`. Gera `engine/data.js` e o `.srt` |
| `engine/index.html` | O motor gráfico: `render(t)` desenha o quadro do segundo `t`. Abra no Chrome e chame `render(120)` no console para ver o quadro de 2:00 |
| `music.py` | Trilha original e efeitos (gera `music.wav`) |
| `render.js` | Renderiza um intervalo de quadros para MP4 (Playwright + ffmpeg) |
| `snap.js` | Gera imagens de teste: `node snap.js 30 120 200` (saem em `test/`) |
| `assets/` | Telas reais dos produtos e do quadro, recortadas da gravação |

## Como renderizar de novo
A gravação bruta e a transcrição ficam em `../src/` (fora do Git): `transcript.json`, `tail.json` e `audio.wav` (16 kHz). O áudio a 48 kHz fica em `orig48.wav`.

```bash
npm i @fontsource/inter@5.0.18 @fontsource/manrope@5.0.18 @fontsource/jetbrains-mono@5.0.20 playwright
python3 edl.py && python3 cues.py && python3 voice.py && python3 music.py
node render.js 0 9749 video.mp4
```

Depois, trate a voz e mixe com a trilha:

```bash
ffmpeg -i voice_raw.wav -af "highpass=f=80,afftdn=nf=-25,equalizer=f=3200:t=q:w=1.2:g=2,acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=3,loudnorm=I=-16:TP=-1.5:LRA=8" -ar 48000 voice.wav
ffmpeg -i voice.wav -i music.wav -filter_complex "[1:a]volume=0.55[m];[m][0:a]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[md];[0:a][md]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-14:TP=-1.0:LRA=9" -ar 48000 mix.wav
ffmpeg -i video.mp4 -i mix.wav -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart final.mp4
```

## Exemplos de ajuste rápido
- **Texto de uma caixa:** em `cues.py`, `node('in_de', 'Geração de demanda', ...)`.
- **Quando algo aparece:** troque a frase dentro de `T('…')`.
- **Preço novo (ex.: Planner):** passe `price='R$ 47'` no `node('lt_pla', ...)`.
- **Tirar uma pendência do mapa:** mude o `kind` de `'pend'` para o tipo real (`'low'`, `'int'`…).
