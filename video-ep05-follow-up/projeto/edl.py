"""EDL do Episódio 03: intercala o vídeo A (fluxo explicado) e o B (demonstração do CRM).
Cada trecho é definido por frases reais (início/fim de palavra), sem repetições nem erros de gravação."""
import json, re, os, wave, numpy as np
S = os.path.dirname(os.path.abspath(__file__)) + '/'
W = {v: [dict(w=w['w'].strip(), s=w['s'], e=w['e']) for w in json.load(open(S + f'src/w{v}.json'))] for v in 'A'}
# correções de palavras (re-transcrição fina dos trechos regravados)
def _fix(v, a, b, new):
    W[v] = [w for w in W[v] if not (a <= w['s'] < b)] + [dict(w=x, s=s0, e=s1) for x, s0, s1 in new]
    W[v].sort(key=lambda w: w['s'])
def _fix(v, a, b, new):
    W[v] = [w for w in W[v] if not (a <= w['s'] < b)] + [dict(w=x, s=s0, e=s1) for x, s0, s1 in new]
    W[v].sort(key=lambda w: w['s'])
def norm(x): return re.sub(r'[^\wà-ú$]', '', x.lower())
def idx(v, phrase, after=0.0):
    toks = [norm(x) for x in phrase.split()]
    ws = W[v]
    for i in range(len(ws) - len(toks) + 1):
        if ws[i]['s'] < after - 0.01: continue
        if all(norm(ws[i + k]['w']) == toks[k] for k in range(len(toks))): return i, i + len(toks) - 1
    raise SystemExit('not found %s %r after %s' % (v, phrase, after))
def F(v, p, after=0.0): return W[v][idx(v, p, after)[0]]['s']
def E(v, p, after=0.0): return W[v][idx(v, p, after)[1]]['e']

CH_TITLES = ['Por que fazer follow-up', 'As 3 fases', 'Fase 1 · Repescagem', 'Fase 2 · Nutrição', 'Fase 3 · Longo prazo',
             'Respondeu? Atualize o CRM', 'Anti-ghosting', 'O que realmente importa']
P = []
def seg(v, a, b, ch=None, call=False): P.append((ch, v, a, b, call))
A = 'A'
seg(A, F(A, 'Agora nós vamos'), E(A, 'apenas uma vez.'), ch=0)
seg(A, F(A, 'Então por conta disso'), E(A, 'com esse cliente.'), ch=1)
seg(A, F(A, 'Então para iniciar a fase 1'), E(A, 'canal do WhatsApp.'), ch=2)
seg(A, 84.00, E(A, 'novidade para você.'))
seg(A, F(A, 'Ainda na fase 1'), E(A, 'mais um áudio.'))
seg(A, 125.15, E(A, 'em dois minutos.'))
seg(A, F(A, 'Na fase 2, nós'), E(A, 'caso desse cliente?'), ch=3)
seg(A, F(A, 'Ainda na etapa de nutrição, nós podemos fazer'), E(A, 'com você também?'))
seg(A, F(A, 'E no próximo dia, ainda na fase'), E(A, 'esse seria o seu caso?'))
seg(A, F(A, 'Iniciando a fase 3'), E(A, 'ainda é uma prioridade?'), ch=4)
seg(A, F(A, 'Um próximo follow'), 291.45)
seg(A, F(A, 'E um último toque'), E(A, 'para o fechamento.'))
seg(A, 303.95, E(A, 'que eu te retorno.'))
seg(A, F(A, 'E é interessante que a cada etapa'), E(A, 'simplesmente sumiu.'), ch=5)
seg(A, 366.05, E(A, 'último ponto que eu te falei?'), ch=6)
seg(A, F(A, 'Deixa eu entender, Ângela.'), E(A, 'ainda esse mês?'))
seg(A, F(A, 'O mais importante que você precisa'), E(A, 'no primeiro contato.'), ch=7)
seg(A, F(A, 'O follow -up serve para retomar pessoas que não sinalizaram'), E(A, 'para a venda.'))
seg(A, F(A, 'É interessante entender que não existe uma mensagem milagrosa.'), E(A, 'figurinhas, conteúdos,'))
seg(A, F(A, 'Pontos que tragam de forma humanizada esse lead'), E(A, 'fluxo comercial novamente.'))
seg(A, F(A, 'Então, o follow -up deve ser'), E(A, 'fazer os follow -ups.'))
# envelopes para alinhar cortes em pontos silenciosos
env = {}
for v in 'A':
    wf = wave.open(S + f'src/{v}.wav'); a = np.frombuffer(wf.readframes(wf.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    env[v] = np.sqrt(np.convolve(a ** 2, np.ones(320) / 320, 'same')[::160] + 1e-9)
def snap(v, t, r=0.06):
    i0 = max(0, int((t - r) * 100)); i1 = int((t + r) * 100); return (i0 + int(np.argmin(env[v][i0:i1]))) / 100

MAXGAP = 0.45; PAD = 0.10; CHGAP = 1.8; INTRO = 3.0
out = []; words = []; t = INTRO; chapters = [dict(n=0, title=CH_TITLES[0], t=0)]
for ch, v, a, b, call in P:
    if ch is not None and ch > 0:
        out.append(dict(kind='gap', t0=t, t1=t + CHGAP, chapter=ch, title=CH_TITLES[ch])); chapters.append(dict(n=ch, title=CH_TITLES[ch], t=t)); t += CHGAP
    ws = [w for w in W[v] if a - 0.01 <= w['s'] and w['e'] <= b + 0.01]
    # sub-clips: split on long pauses
    cur = [snap(v, ws[0]['s'] - PAD), ws[0]['e']]; subs = []
    for p, w in zip(ws, ws[1:]):
        if w['s'] - p['e'] > (1.25 if call else MAXGAP) + 0.2:
            cur[1] = snap(v, p['e'] + PAD + 0.05); subs.append(cur); cur = [snap(v, w['s'] - PAD), w['e']]
        else: cur[1] = w['e']
    cur[1] = snap(v, ws[-1]['e'] + PAD + 0.05); subs.append(cur)
    for si_, (s0, s1) in enumerate(subs):
        out.append(dict(kind='clip', src=v, src0=s0, src1=s1, t0=t, t1=t + (s1 - s0), call=call))
        for w in ws:
            if s0 - 0.02 <= w['s'] < s1:
                words.append(dict(w=w['w'], s=round(t + w['s'] - s0, 3), e=round(t + min(w['e'], s1) - s0, 3), os=w['s'], src=v, call=call))
        t += s1 - s0
        if call and si_ < len(subs) - 1: t += 1.2   # o lead responde (pausa de escuta)
    t += 0.15 if not call else 1.2  # respiro entre trechos de fontes diferentes/emendas
total = t + 9.0
json.dump(dict(segments=out, words=words, chapters=chapters, total=total), open(S + 'timeline.json', 'w'), ensure_ascii=False, indent=1)
print('clips', sum(1 for o in out if o['kind'] == 'clip'), 'total %.1f' % total)
for c in chapters: print('  %6.1f %s' % (c['t'], c['title']))
