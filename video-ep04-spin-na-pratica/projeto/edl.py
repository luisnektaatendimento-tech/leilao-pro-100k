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
_fix('A', 1046.0, 1050.0, [])
_fix('A', 1050.0, 1053.2, [('Nunca', 1050.32, 1051.12), ('diga', 1051.12, 1051.92), ('"te', 1051.92, 1052.10), ('mando', 1052.10, 1052.40), ('o', 1052.40, 1052.48), ('link', 1052.48, 1052.66), ('depois".', 1052.66, 1053.14)])
_fix('A', 1180.7, 1190.0, [('Acompanhe', 1185.80, 1186.30), ('o', 1186.30, 1186.40), ('próximo', 1186.40, 1186.75), ('capítulo', 1186.75, 1187.40), ('para', 1188.20, 1188.45), ('dominar', 1188.45, 1188.90), ('as', 1188.90, 1189.08), ('vendas.', 1189.08, 1189.58)])
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

CH_TITLES = ['Abertura', 'O público: 3 objetivos', 'Abrindo a ligação', 'S · Situação', 'P · Problema', 'I · Implicação',
             'N · Necessidades', 'Sem script: domine o fluxo', 'Dicas e postura', 'Fechamento e pós-ligação', 'O controle é seu']
P = []
def seg(v, a, b, ch=None, call=False): P.append((ch, v, a, b, call))
A = 'A'
seg(A, F(A, 'Agora que você já sabe'), E(A, 'da forma correta.'), ch=0)
seg(A, F(A, 'Na metodologia Spin'), E(A, 'entenda o público.'), ch=1)
seg(A, F(A, 'E como nós atuamos no mercado'), E(A, 'que nós temos.'))
seg(A, F(A, 'O primeiro passo a iniciar'), E(A, 'vamos para a prática.', 335), ch=2)
seg(A, F(A, 'Fala, Paulo. Bom dia.'), E(A, 'Tudo bom?', 342), call=True)
seg(A, F(A, 'Ótimo.', 348), E(A, 'Correto?', 354), call=True)
seg(A, F(A, 'Seguinte.', 357), E(A, 'dentro do mercado.', 370), call=True)
seg(A, F(A, 'Quando nós falamos de etapa'), E(A, 'mapear o cenário atual.'), ch=3)
seg(A, F(A, 'Então, me conta.', 378), E(A, 'Qual meta e qual tempo você deseja atingir esse objetivo?'), call=True)
seg(A, F(A, 'Essas são perguntas que explicam'), E(A, 'as informações que você precisa.'))
seg(A, F(A, 'Depois dessa etapa de situação'), E(A, 'etapa do problema.'), ch=4)
seg(A, F(A, 'Paulo, me conta. E o que'), E(A, 'que você busca dentro desse mercado?'), call=True)
seg(A, F(A, 'Me diz. Quando você pensa'), E(A, 'o que poderia render hoje?'), call=True)
seg(A, F(A, 'Perfeito.', 534), E(A, 'E o que aconteceu depois?'), call=True)
seg(A, F(A, 'Essas são perguntas que vão bater'), E(A, 'próxima etapa de implicação.'))
seg(A, F(A, 'Então, mesmo sendo um cliente'), E(A, 'Por exemplo,', 580))
seg(A, F(A, 'Ângela, me diz. Você está satisfeita com o modelo de atuação que'), E(A, 'que você tem hoje?'), call=True)
seg(A, F(A, 'Ou até mesmo para moradia?'), E(A, 'Ou até mesmo para moradia?'))
seg(A, F(A, 'Márcio, o aluguel'), E(A, 'realmente seja seu?'), call=True)
seg(A, F(A, 'Então, tanto para moradia, para investimento'), E(A, 'variam muito bem.'))
seg(A, F(A, 'Agora vamos para a etapa de implicação'), E(A, 'onde colocamos a mão na ferida.'), ch=5)
seg(A, F(A, 'Paulo, se nada mudar'), E(A, 'fazer essa conta?'), call=True)
seg(A, F(A, 'Deixa eu te perguntar, se você tentar sozinho e der'), E(A, 'na tentativa e erro?'), call=True)
seg(A, F(A, 'Ótimo. Enquanto você espera'), E(A, 'Como você se sente com isso?', 690), call=True)
seg(A, F(A, 'Outro exemplo.'), E(A, 'Outro exemplo.'))
seg(A, F(A, 'Enquanto você espera o momento certo', 695), E(A, 'Como você se sente com isso?', 700), call=True)
seg(A, F(A, 'Moradia.', 707), E(A, 'Moradia.', 707))
seg(A, F(A, 'Enquanto você espera o momento certo', 709), E(A, 'Como você se sente com isso?', 715), call=True)
seg(A, F(A, 'As implicações, elas servem'), E(A, 'vivendo nesse momento.'))
seg(A, F(A, 'Sendo assim, agora vamos para o processo final'), E(A, 'que é o de necessidade.'), ch=6)
seg(A, F(A, 'Paulo, se você tivesse um método'), E(A, 'custos fixos todos os meses?'), call=True)
seg(A, F(A, 'Paulo, na sua visão, o que precisaria existir numa solução para'), E(A, 'para começar agora?'), call=True)
seg(A, F(A, 'ótimo, e para entender se eu consigo'), E(A, 'como uma necessidade?'), call=True)
seg(A, F(A, 'Tendo em vista esse combo'), E(A, 'que elas são aplicadas,'), ch=7)
seg(A, F(A, 'você vai ter autonomia'), E(A, 'de um script.', 855))
seg(A, F(A, 'E assim, aplicando', 869), E(A, 'pelo nosso time.'))
seg(A, F(A, 'E aqui vão algumas dicas importantes. Na situação,', 915), E(A, 'nessa etapa cansam.'), ch=8)
seg(A, F(A, 'E na parte de implicação'), E(A, 'que ficaram na mesa.'))
seg(A, F(A, 'e na necessidade entenda'), E(A, 'e não você.'))
seg(A, F(A, 'Além disso, tenha postura'), E(A, 'seja direto.'))
seg(A, F(A, 'Antes de propor o agendamento'), E(A, 'É isso?', 1030), ch=9)
seg(A, F(A, 'Muito importante, saia'), 1046.12)
seg(A, 1050.25, 1053.20)
seg(A, F(A, 'Crie compromisso. Pergunte. Se fizer sentido na conversa'), E(A, 'ainda esse mês?'))
seg(A, F(A, 'Depois da ligação'), E(A, 'do lead.', 1085))
seg(A, F(A, 'Nós sempre vamos ter as ligações gravadas.'), E(A, 'ter melhores resultados.'))
seg(A, F(A, 'Basicamente, esse é o processo'), E(A, 'o controle é seu.'), ch=10)
seg(A, F(A, 'Ótimo, acredito que você', 1176), 1180.66)
seg(A, 1185.70, 1189.62)
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
