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
for _w in W['A']:
    if abs(_w['s'] - 163.5) < 0.01: _w['e'] = 164.30
W['A'] = [w for w in W['A'] if not (466.9 < w['s'] < 476.7 and w['w'] in ('as', 'vendas'))]
for _w in W['A']:
    if _w['w'] in ('vão',) and 476.0 < _w['s'] < 477.5: _w['s'] = 476.84
    if 186.0 < _w['s'] < 187.6 and _w['w'] == 'é,': _w['s'] = 187.6
    if 204.0 < _w['s'] < 204.45 and _w['w'] == 'às': _w['s'] = 204.40; _w['w'] = 'Às'
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

CH_TITLES = ['Abertura', 'Manhã · planejar e mensagens', 'Bloco 1 · ligações', 'Meio do dia · CRM e almoço', 'Tarde · follow-up e bloco 2',
             'Fim do dia · bloco 3 e preparação', 'As metas diárias', 'Regras de ouro', 'Encerramento da série']
P = []
def seg(v, a, b, ch=None, call=False): P.append((ch, v, a, b, call))
A = 'A'
seg(A, F(A, 'Agora que você já sabe'), E(A, 'final do seu expediente.'), ch=0)
seg(A, F(A, 'Como iniciamos às 9 horas, é interessante que às 8h30 você já'), E(A, 'que já estão em conversa.'), ch=1)
seg(A, F(A, 'Das 9 horas às 9h30'), E(A, 'precisam do seu retorno.'))
seg(A, 96.50, E(A, 'fazer as ligações.'), ch=2)
seg(A, F(A, 'Esse horário é inegociável'), E(A, 'realizar as ligações.'))
seg(A, F(A, 'deixe o celular'), E(A, 'foque no resultado.'))
seg(A, F(A, 'De 11h30 às 12h'), E(A, 'qualificados ao Closer.'), ch=3)
seg(A, F(A, 'Das 12h às 14h'), 164.40)
seg(A, F(A, 'é o seu período de almoço.'), E(A, 'é o seu período de almoço.'))
seg(A, F(A, 'Das 14h às 14h30'), E(A, 'e reagendamentos.'), ch=4)
seg(A, 187.45, 193.95)
seg(A, 197.10, E(A, 'exclusivamente, em ligações.'))
seg(A, 204.38, E(A, 'manter a energia alta.'))
seg(A, F(A, 'é o terceiro bloco'), E(A, 'em executar.'), ch=5)
seg(A, 233.62, E(A, 'colher muito resultado.'))
seg(A, F(A, 'Não se esqueça'), E(A, 'coloca no bolso.'))
seg(A, F(A, 'Sendo assim, você tem três blocos'), E(A, 'bater as suas metas.'), ch=6)
seg(A, F(A, 'E vamos lá para as metas diárias.'), E(A, 'agendamentos por dia.'))
seg(A, F(A, 'Nem 3, nem 2.'), E(A, 'aos seus objetivos.'))
seg(A, F(A, 'Lembre -se, ligue nos blocos'), E(A, 'métricas toda sexta -feira.'), ch=7)
seg(A, F(A, 'E eu vou te ajudar a contornar'), E(A, 'nos nossos treinamentos.'))
seg(A, F(A, 'Agora você tem tudo.'), E(A, 'o seu destino'), ch=8)
seg(A, F(A, 'E principalmente,'), 468.20)
seg(A, 476.78, E(A, 'Estamos juntos nessa.'))
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
