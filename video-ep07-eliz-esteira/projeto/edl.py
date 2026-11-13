"""Lista de cortes do EP07. Lê a transcrição da gravação bruta (src/) e gera timeline.json com o tempo novo de cada palavra."""
import json, wave, numpy as np, os
S = os.path.dirname(os.path.abspath(__file__)) + '/'
a = json.load(open(S + '../src/transcript.json')); b = json.load(open(S + '../src/tail.json'))
segs = [s for s in a if s['start'] < 262] + [s for s in b if s['start'] >= 264]
W = [dict(w=w['w'].strip(), s=w['s'], e=w['e']) for s in segs for w in s['words'] if w['w'].strip()]
wf = wave.open(S + '../src/audio.wav'); au = np.frombuffer(wf.readframes(wf.getnframes()), dtype=np.int16).astype(np.float32) / 32768
env = np.sqrt(np.convolve(au ** 2, np.ones(320) / 320, 'same')[::160] + 1e-9)   # 10 ms
def snap(t, r=0.06):
    i0 = max(0, int((t - r) * 100)); i1 = int((t + r) * 100); return (i0 + int(np.argmin(env[i0:i1]))) / 100
# Cortes (segundos da gravação bruta) e motivo
REMOVE = [(0, 6.25),        # janela do gravador e "só para a gente tangibilizar..."
          (87.30, 98.55),   # "Pegou, Milton?" repetido à espera de resposta
          (102.85, 108.45), # frase recomeçada + "tirar esse negócio aqui"
          (147.98, 157.10), # frase incompleta + falas de edição do quadro
          (263.95, 482.45), # outros participantes falando (áudio não gravado)
          (514.35, 538.10), # idem
          (598.70, 999)]    # tela com conversa privada, sem fala
def removed(t): return any(x <= t < y for x, y in REMOVE)
def find(phrase, after=0):
    toks = [x.strip('.,?!').lower() for x in phrase.split()]
    for i in range(len(W)):
        if W[i]['s'] < after: continue
        if all(W[i + k]['w'].lower().strip('.,?!') == toks[k] for k in range(len(toks))): return W[i]['s']
    raise SystemExit(phrase)
CH = [(0, 'Os produtos e os perfis', 0),
      (1, 'Trilha do corretor', find('Qual que é a ascensão')),
      (2, 'Pessoa física: do crédito ao investimento', find('Aí, no pessoa física')),
      (3, 'Investidor: das operações à mentoria', find('Aí, o seguinte', 150)),
      (4, 'A mentoria: do conceito ao cálculo', find('Só que, dentro da mentoria')),
      (5, 'SCP: o destino da esteira', find('E aí é um ponto', 480)),
      (6, 'A esteira completa', find('então, por mim', 560))]
words = [w for w in W if not removed((w['s'] + w['e']) / 2)]
keep = []; MAXGAP = 0.45; PAD = 0.10
cur = [words[0]['s'] - PAD, words[0]['e']]
for prev, w in zip(words, words[1:]):
    gap = w['s'] - prev['e']
    cut = any(prev['e'] <= y and x <= w['s'] for x, y in REMOVE)
    forced = any(abs(w['s'] - c[2]) < 0.01 for c in CH[1:])
    if gap > MAXGAP + 0.2 or cut or forced:
        cur[1] = snap(prev['e'] + min(PAD + 0.1, gap / 2 if not cut else PAD))
        keep.append(cur); cur = [snap(w['s'] - min(PAD, gap / 2)), w['e']]
    else: cur[1] = w['e']
cur[1] = words[-1]['e'] + 0.35; keep.append(cur)
CHGAP = 1.8; INTRO = 3.2
out = []; t = INTRO; chs = {round(c[2], 2): c for c in CH[1:]}
for x, y in keep:
    for cs, c in chs.items():
        if x - 0.5 <= cs <= x + 0.5:
            out.append(dict(kind='gap', t0=t, t1=t + CHGAP, chapter=c[0], title=c[1])); t += CHGAP
    out.append(dict(kind='clip', src0=x, src1=y, t0=t, t1=t + (y - x))); t += y - x
def remap(v):
    for c in out:
        if c['kind'] == 'clip' and c['src0'] - 0.001 <= v <= c['src1'] + 0.001: return c['t0'] + (v - c['src0'])
nw = []
for w in words:
    s, e = remap(w['s']), remap(w['e']); s = s if s is not None else e; e = e if e is not None else s
    if s is not None: nw.append(dict(w=w['w'], s=round(s, 3), e=round(e, 3), os=w['s']))
chap = [dict(n=0, title=CH[0][1], t=0)] + [dict(n=c['chapter'], title=c['title'], t=c['t0']) for c in out if c['kind'] == 'gap']
json.dump(dict(segments=out, words=nw, chapters=chap, total=t), open(S + 'timeline.json', 'w'), ensure_ascii=False, indent=1)
print('clips', sum(c['kind'] == 'clip' for c in out), 'fala termina em', round(t, 1))
for c in chap: print('  %6.2f %s' % (c['t'], c['title']))
