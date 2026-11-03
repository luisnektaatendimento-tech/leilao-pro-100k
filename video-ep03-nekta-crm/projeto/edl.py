"""EDL do Episódio 03: intercala o vídeo A (fluxo explicado) e o B (demonstração do CRM).
Cada trecho é definido por frases reais (início/fim de palavra), sem repetições nem erros de gravação."""
import json, re, os, wave, numpy as np
S = os.path.dirname(os.path.abspath(__file__)) + '/'
W = {v: [dict(w=w['w'].strip(), s=w['s'], e=w['e']) for w in json.load(open(S + f'src/w{v}.json'))] for v in 'AB'}
# correções de palavras (re-transcrição fina dos trechos regravados)
def _fix(v, a, b, new):
    W[v] = [w for w in W[v] if not (a <= w['s'] < b)] + [dict(w=x, s=s0, e=s1) for x, s0, s1 in new]
    W[v].sort(key=lambda w: w['s'])
_fix('A', 234.0, 244.0, [('E', 238.86, 239.34), ('basicamente', 239.34, 239.94), ('a', 239.94, 240.06), ('metodologia', 240.06, 240.70), ('vai', 240.70, 240.90), ('te', 240.90, 241.00), ('mostrar', 241.00, 241.42), ('o', 241.42, 241.68), ('que', 241.68, 241.82), ('fazer', 241.82, 242.24), ('e', 242.24, 242.78), ('como', 242.78, 243.26), ('ligar.', 243.26, 243.78)])
_fix('A', 353.0, 362.5, [('Logo', 359.68, 360.40), ('depois,', 360.40, 360.88), ('vamos', 360.95, 361.14), ('para', 361.14, 361.34), ('as', 361.34, 361.50), ('necessidades.', 361.50, 362.00)])
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

CH_TITLES = ['Abertura', 'Todos os leads em um só lugar', 'Base de nutrição', 'Primeira abordagem: 5 minutos', 'A pipeline do CRM',
             'Respondeu ou não: ligue', 'SPIN Selling', 'Agendou ou não agendou', 'Agenda e passagem para o Closer', 'Comparecimento']
# (capitulo_que_inicia_ou_None, fonte, inicio, fim)
P = []
def seg(v, a, b, ch=None): P.append((ch, v, a, b))
seg('A', F('A', 'Ótimo!'), E('A', 'que é a Necta CRM.'), ch=0)
seg('A', F('A', 'Lá dentro, todos'), E('A', 'que permite a sua ligação.'), ch=1)
seg('A', F('A', 'Dentro da Necta CRM, todos'), E('A', 'que vai atendê -lo.'), ch=2)
seg('B', F('B', 'Aqui está a base de nutrição.'), E('B', 'aparecem primeiro,'))
seg('B', F('B', 'Quando ele entrou, a região', 54), E('B', 'quem já esteve na reunião.'))
seg('B', F('B', 'A partir do momento que você está visualizando'), E('B', 'para fazer essa abordagem.'))
seg('A', F('A', 'A partir do momento que você localizou'), E('A', 'qualificação e agendamento.'), ch=3)
seg('A', F('A', 'Assim que você inicia essa abordagem'), E('A', 'que esse lead está posicionado.'), ch=4)
seg('B', F('B', 'Assim que você definiu'), E('B', 'follow -ups aqui.'))
seg('A', F('A', 'Ali é o quadro'), E('A', 'que você era responsável.'))
seg('A', F('A', 'A partir do momento que você já iniciou'), E('A', 'para as próximas etapas.'), ch=5)
seg('A', F('A', 'Dentro das ligações de qualificação'), E('A', 'metodologia spin -selling,'), ch=6)
seg('A', F('A', 'E basicamente a metodologia'), E('A', 'tem um problema real.', 268))
seg('A', F('A', 'E qual esse problema?'), E('A', 'nós vamos para a implicação.', 315))
seg('A', F('A', 'A implicação é o momento onde nós'), E('A', 'problema que ele tem.', 345))
seg('A', F('A', 'Logo depois, vamos para as necessidades.'), E('A', 'Logo depois, vamos para as necessidades.'))
seg('A', F('A', 'As necessidades é o momento onde entendemos', 365), E('A', 'solução desse problema.'))
seg('A', F('A', 'Mas é muito interessante que você entenda'), E('A', 'para a vida inteira.'))
seg('A', F('A', 'A partir do momento que nós fizemos o spin'), E('A', 'do próprio CRM da Necta.'), ch=7)
seg('A', F('A', 'Ao iniciar o fluxo de marcar'), E('A', 'durante essa ligação.'), ch=8)
seg('B', F('B', 'Outro ponto importante é a parte da agenda.'), E('B', 'você pode agendar esse Lidia.'))
seg('A', F('A', 'Lembre -se, o papel do pré'), E('A', 'mais comissões você terá.'))
seg('A', F('A', 'Quando ele agenda, você marca'), E('A', 'desqualificado dentro do seu CRM.'))
seg('A', F('A', 'É muito importante que você faça o acompanhamento'), E('A', 'comparecimento da chamada.'), ch=9)
seg('A', F('A', 'Então, esse lead, ele não deve', 593), E('A', 'engajado para a nossa sessão.'))
seg('B', F('B', 'A partir do momento que você agendou'), E('B', 'dentro da ligação.'))
seg('A', F('A', 'É muito interessante que você tenha clareza'), E('A', 'dominar o nosso CRM.'))
seg('A', F('A', 'Então, com base nesse overview'), E('A', 'dominar muito bem a nossa ferramenta.'))
seg('A', F('A', 'Agora você já sabe', 705), E('A', 'para o nosso próximo capítulo.'))

# envelopes para alinhar cortes em pontos silenciosos
env = {}
for v in 'AB':
    wf = wave.open(S + f'src/{v}.wav'); a = np.frombuffer(wf.readframes(wf.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    env[v] = np.sqrt(np.convolve(a ** 2, np.ones(320) / 320, 'same')[::160] + 1e-9)
def snap(v, t, r=0.06):
    i0 = max(0, int((t - r) * 100)); i1 = int((t + r) * 100); return (i0 + int(np.argmin(env[v][i0:i1]))) / 100

MAXGAP = 0.45; PAD = 0.10; CHGAP = 1.8; INTRO = 3.0
out = []; words = []; t = INTRO; chapters = [dict(n=0, title=CH_TITLES[0], t=0)]
for ch, v, a, b in P:
    if ch is not None and ch > 0:
        out.append(dict(kind='gap', t0=t, t1=t + CHGAP, chapter=ch, title=CH_TITLES[ch])); chapters.append(dict(n=ch, title=CH_TITLES[ch], t=t)); t += CHGAP
    ws = [w for w in W[v] if a - 0.01 <= w['s'] and w['e'] <= b + 0.01]
    # sub-clips: split on long pauses
    cur = [snap(v, ws[0]['s'] - PAD), ws[0]['e']]; subs = []
    for p, w in zip(ws, ws[1:]):
        if w['s'] - p['e'] > MAXGAP + 0.2:
            cur[1] = snap(v, p['e'] + PAD + 0.05); subs.append(cur); cur = [snap(v, w['s'] - PAD), w['e']]
        else: cur[1] = w['e']
    cur[1] = snap(v, ws[-1]['e'] + PAD + 0.05); subs.append(cur)
    for s0, s1 in subs:
        out.append(dict(kind='clip', src=v, src0=s0, src1=s1, t0=t, t1=t + (s1 - s0)))
        for w in ws:
            if s0 - 0.02 <= w['s'] < s1:
                words.append(dict(w=w['w'], s=round(t + w['s'] - s0, 3), e=round(t + min(w['e'], s1) - s0, 3), os=w['s'], src=v))
        t += s1 - s0
    t += 0.15  # respiro entre trechos de fontes diferentes/emendas
total = t + 9.0
json.dump(dict(segments=out, words=words, chapters=chapters, total=total), open(S + 'timeline.json', 'w'), ensure_ascii=False, indent=1)
print('clips', sum(1 for o in out if o['kind'] == 'clip'), 'total %.1f' % total)
for c in chapters: print('  %6.1f %s' % (c['t'], c['title']))
