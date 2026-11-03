"""Roteiro de cenas do Episódio 04: Como fazer ligações que geram agendamentos de qualidade (SPIN na prática)."""
import json, re, os
S = os.path.dirname(os.path.abspath(__file__)) + '/'
TL = json.load(open(S + 'timeline.json'))
W = TL['words']
def norm(x): return re.sub(r'[^\wà-ú$%]', '', x.lower())
def T(phrase, after=0.0, end=False):
    toks = [norm(x) for x in phrase.split()]
    for i in range(len(W) - len(toks) + 1):
        if W[i]['os'] < after - 0.01: continue
        if all(norm(W[i + k]['w']) == toks[k] for k in range(len(toks))):
            return round(W[i + len(toks) - 1]['e'] if end else W[i]['s'], 2)
    raise SystemExit('phrase not found: %r after %s' % (phrase, after))
CH = {c['n']: c for c in TL['chapters']}
GAPS = [s for s in TL['segments'] if s['kind'] == 'gap']
LAST = W[-1]['e']; TOTAL = round(TL['total'], 2)

FIX = {'luiz': 'Luís', 'necta': 'Nekta', 'closer': 'Closer', 'close': 'Closer', 'spin': 'SPIN'}
def fixw(w):
    m = re.match(r'^(\W*)([\wà-úÀ-Ú$%]+)(\W*)$', w)
    if not m: return w
    a, core, b = m.groups()
    if core.lower() in FIX: core = FIX[core.lower()]
    return a + core + b
def merged(ws):
    out = []
    for w in ws:
        x = dict(w); x['w'] = fixw(x['w'])
        if out and (x['w'].startswith('-') or x['w'].startswith('$') or x['w'] == '%' or re.match(r'^[.,]\d', x['w'])): out[-1]['w'] += x['w']; out[-1]['e'] = x['e']
        else: out.append(x)
    for x in out: x['w'] = x['w'].replace('SPIN-selling', 'SPIN Selling').replace('Spin', 'SPIN')
    return out

# ---------------------------------------------------------------- mapa: quadro SPIN
N = {}
def node(id, title, x, y, kind, sub='', w=540, tag=None):
    N[id] = dict(id=id, title=title, sub=sub, x=x, y=y, kind=kind, w=w, tag=tag, reveal=None, prio=None, prioAt=9999)
X = {'S': 450, 'P': 1150, 'I': 1850, 'N': 2550}
node('hS', 'Situação', X['S'], 150, 'h1', 'mapear o cenário atual', tag='S')
node('hP', 'Problema', X['P'], 150, 'h2', 'fazer a dor aparecer', tag='P')
node('hI', 'Implicação', X['I'], 150, 'h3', 'ampliar o custo de não agir', tag='I')
node('hN', 'Necessidades', X['N'], 150, 'h4', 'o cliente verbaliza o valor', tag='N')
Y = [330, 470, 610, 750, 890, 1030]
Q = {
 'S': [('Onde está o seu dinheiro hoje?', 'e quanto disso está em imóveis', 'onde o seu dinheiro está investido hoje'),
       ('Já teve experiência com leilões?', 'como foi?', 'Você já teve alguma experiência com leilões?'),
       ('Quanto capital você tem?', 'e consegue mobilizar em 12 meses', 'Quanto de capital você tem disponível, Paulo?'),
       ('Quanto tempo por semana?', 'de verdade: pode ser sincero', 'Me conta. Quanto tempo por semana'),
       ('Qual meta e em quanto tempo?', 'patrimônio ou renda mensal', 'E qual meta de patrimônio')],
 'P': [('O que te impediu até hoje?', 'de atingir o seu objetivo', 'E o que é que te impediu'),
       ('Qual é o seu maior medo?', 'perder dinheiro ou não saber começar', 'Quando você pensa em leilão'),
       ('Você avalia uma oportunidade sozinho?', 'ou depende da opinião de outros', 'E quando aparece uma oportunidade?'),
       ('Seu dinheiro rende o que poderia?', 'hoje, de verdade', 'Você sente que o seu dinheiro'),
       ('Já deixou uma oportunidade passar?', 'por insegurança ou falta de conhecimento', 'E você já deixou alguma oportunidade passar por insegurança?')],
 'I': [('Se nada mudar em 3 anos…', 'quanto terá deixado na mesa?', 'se nada mudar nos próximos'),
       ('E se tentar sozinho e der errado?', 'impacto no caixa e na família', 'se você tentar sozinho e der errado'),
       ('E se levar mais 5 anos?', 'aprendendo na tentativa e erro', 'O que acontece com a meta'),
       ('Enquanto você espera o momento certo…', 'outros fecham os melhores negócios', 'Enquanto você espera o momento certo')],
 'N': [('Se tivesse um método validado…', 'o que mudaria na sua vida?', 'se você tivesse um método'),
       ('Quanto vale alguém experiente revisando?', 'cada decisão antes do seu dinheiro', 'quanto valeria para você'),
       ('O que faria com esse lucro?', 'se conquistasse o resultado', 'se você conquistasse o resultado'),
       ('E uma renda que cobrisse seus custos?', 'como seria a sua rotina', 'como seria sua rotina'),
       ('O que precisaria existir na solução?', 'para se sentir seguro e começar agora', 'o que precisaria existir numa solução para'),
       ('Você pode alcançar ou é uma necessidade?', 'a pergunta que qualifica', 'é realmente algo que você acredita')]}
E = {}
def edge(id, a, b, style='solid', label='', bend=0, side=None, off=150):
    E[id] = dict(id=id, a=a, b=b, style=style, label=label, bend=bend, kind=None, reveal=None, side=side, off=off)
KIND = {'S': 'q1', 'P': 'q2', 'I': 'q3', 'N': 'q4'}
QT = {}
for L, qs in Q.items():
    prev = 'h' + L
    for i, (t, sub, anc) in enumerate(qs):
        nid = '%s%d' % (L.lower(), i + 1); node(nid, t, X[L], Y[i], KIND[L], sub, tag='PERGUNTA %d' % (i + 1))
        QT[nid] = T(anc); edge('e_' + nid, prev, nid); prev = nid
edge('hsp', 'hS', 'hP'); edge('hpi', 'hP', 'hI'); edge('hin', 'hI', 'hN')
node('ag', 'Agendamento com o especialista', 1500, 1230, 'out', 'data e hora marcadas na ligação', w=520, tag='RESULTADO')
edge('n6ag', 'n6', 'ag', side='l', off=120)
def reveal(t, *ids):
    for i in ids:
        d = N if i in N else E
        if d[i]['reveal'] is None: d[i]['reveal'] = t
ACT = []
def active(t0, t1, *ids, color=None): ACT.append(dict(t0=t0, t1=t1, ids=list(ids), color=color))
CAM = []
def cam(t, x, y, z, dur=1.4): CAM.append(dict(t=t, x=x, y=y, z=z, d=dur))
DEMO = []
OVL = []
def ovl(kind, t0, t1, **kw): OVL.append(dict(kind=kind, t0=t0, t1=t1, **kw))
for nid, t in QT.items():
    reveal(t, nid, 'e_' + nid); active(t, t + 4, nid)
def col(L, t, z=0.85): cam(t, X[L], 620, z)
FULL = (1500, 650, 0.5)

# ---------------------------------------------------------------- simulador de ligação (gerado da fala)
calls = []; cur = []
for w in W:
    if w.get('call'):
        if cur and w['s'] - cur[-1]['e'] > 4.0: calls.append(cur); cur = []
        cur.append(w)
    elif cur:
        calls.append(cur); cur = []
if cur: calls.append(cur)
META_CALLS = [dict(lead='Paulo', persona='comprou um produto de leilões', si=-1, color='#c8f43c', label='Abertura · conexão e direção'),
              dict(lead='Paulo', persona='investidor', si=0, color='#ffd166', label='S · Situação'),
              dict(lead='Paulo', persona='investidor', si=1, color='#ff9f43', label='P · Problema'),
              dict(lead='Ângela', persona='quer atuar no mercado', si=1, color='#ff9f43', label='P · Problema · adaptado ao público'),
              dict(lead='Márcio', persona='moradia', si=1, color='#ff9f43', label='P · Problema · adaptado ao público'),
              dict(lead='Paulo', persona='investidor', si=2, color='#ff5d5d', label='I · Implicação'),
              dict(lead='Lead', persona='quer atuar no mercado', si=2, color='#ff5d5d', label='I · Implicação · nova profissão'),
              dict(lead='Lead', persona='moradia', si=2, color='#ff5d5d', label='I · Implicação · moradia'),
              dict(lead='Paulo', persona='investidor', si=3, color='#e0245e', label='N · Necessidades')]
assert len(calls) == len(META_CALLS), len(calls)
for ws, meta in zip(calls, META_CALLS):
    ws = merged(ws); items = []; u = [ws[0]]
    for p, w in zip(ws, ws[1:]):
        if w['s'] - p['e'] > 0.9:
            items.append(dict(who='sdr', t0=u[0]['s'], t1=u[-1]['e'], w=[[x['w'], x['s']] for x in u]))
            items.append(dict(who='lead', t0=p['e'] + 0.15, t1=w['s'] - 0.1)); u = [w]
        else: u.append(w)
    items.append(dict(who='sdr', t0=u[0]['s'], t1=u[-1]['e'], w=[[x['w'], x['s']] for x in u]))
    ovl('call', ws[0]['s'] - 0.5, ws[-1]['e'] + 0.9, items=items, **meta)

# ---------------------------------------------------------------- abertura
ovl('title', 0.0, 3.4)
cam(0, *FULL, dur=0.01)
t = T('Agora que você já sabe')
ovl('lower', t + 0.3, t + 6, name='Luís Nekta', role='Episódio 04 · SPIN Selling na prática')
reveal(T('utilizando o Spin'), 'hS', 'hP', 'hI', 'hN', 'hsp', 'hpi', 'hin')

# ---------------------------------------------------------------- 1. público
c = CH[1]['t'] + 1.8
t = T('Moradia, investimento')
ovl('cards', T('E como nós atuamos no mercado') + 0.5, T('Entendendo essas três') + 2.5, head='o público do mercado imobiliário · 3 objetivos', keep=True,
    items=[dict(k='01', t='Moradia', b='quer o imóvel para morar e sair do aluguel', c='#c8f43c', at=t),
           dict(k='02', t='Investimento', b='quer patrimônio e renda com imóveis', c='#4d8dff', at=T('investimento ou uma nova')),
           dict(k='03', t='Nova profissão', b='quer trabalhar no mercado: nova fonte de renda', c='#ffb547', at=T('uma nova profissão'))])
ovl('quote', T('Entendendo essas três') + 2.7, CH[2]['t'] - 0.15, text='Adapte o discurso ao público e ao produto.', by='o SPIN é o mesmo: as perguntas mudam')

# ---------------------------------------------------------------- 2. abertura da ligação
ovl('cards', CH[2]['t'] + 1.8, T('Então, vamos para a prática.', 330) + 0.6, head='antes da primeira pergunta', keep=True, w=520, h=240,
    items=[dict(k='TOM', t='Voz que conecta', b='energia, ritmo e simpatia desde o "bom dia"', c='#c8f43c', at=T('um tom de voz')),
           dict(k='DIREÇÃO', t='Diga o que vai acontecer', b='"vou te fazer algumas perguntas para entender se…"', c='#4d8dff', at=T('e dar a direção'))])

# ---------------------------------------------------------------- 3..6 SPIN
for L, n in [('S', 3), ('P', 4), ('I', 5), ('N', 6)]:
    t = CH[n]['t'] + 1.8; col(L, t - 0.6); active(t, t + 6, 'h' + L)
t = T('Essas são perguntas que explicam')
col('S', t - 0.3, 0.8); active(t, CH[4]['t'], 's1', 's2', 's3', 's4', 's5', color='#ffd166')
ovl('chips', t + 1, CH[4]['t'], anchor='hS', dy=-110, items=[['perguntas abertas', T('São perguntas abertas')], ['contexto', T('Elas trazem contexto.')], ['conexão', T('que você se conecte')]])
t = T('Essas são perguntas que vão bater')
col('P', t - 0.3, 0.8); active(t, T('Então, mesmo sendo um cliente'), 'p1', 'p2', 'p3', 'p4', 'p5', color='#ff9f43')
ovl('chips', t + 1, T('Então, mesmo sendo um cliente'), anchor='hP', dy=-110, items=[['falta de conhecimento', T('se é a falta de conhecimento')], ['medo do risco', T('se ele tem medo')], ['o maior medo', T('qual que é o maior medo')]])
t = T('Então, mesmo sendo um cliente')
ovl('cards', t - 0.2, T('Ângela, me diz.', 585) - 0.5, head='mesma etapa, discurso adaptado', keep=True, w=400, h=220,
    items=[dict(k='MORADIA', t='Moradia', b='', c='#c8f43c', at=T('para moradia,', 570)), dict(k='INVESTIMENTO', t='Investimento', b='', c='#4d8dff', at=T('para investimento ou')),
           dict(k='NOVA PROFISSÃO', t='Nova profissão', b='', c='#ffb547', at=T('uma nova profissão,', 570))])
t = T('Então, tanto para moradia')
col('P', t - 0.3, 0.8)
t = T('As implicações, elas servem')
col('I', t - 0.3, 0.8); active(t, CH[6]['t'], 'i1', 'i2', 'i3', 'i4', color='#ff5d5d')
ovl('quote', t, CH[6]['t'] - 0.15, text='Faça o cliente refletir sobre o problema que ele vive agora.', by='implicação · a mão na ferida')

# ---------------------------------------------------------------- 7. sem script
c7 = CH[7]['t'] + 1.8
cam(c7 - 0.6, *FULL, dur=2.0)
active(c7, T('E aqui vão algumas dicas', 915), *[n for n in N if n != 'ag'], color='all')
ovl('chips', T('aplicando uma ou duas'), CH[8]['t'], anchor='ag', dy=-120, items=[['1 ou 2 perguntas por etapa', T('aplicando uma ou duas')], ['6 a 8 perguntas no total', T('Seis, oito perguntas')]])
ovl('quote', T('você vai ter autonomia') - 0.2, T('E assim, aplicando', 869) - 0.2, text='Domine o fluxo, não o script.', by='S → P → I → N')

# ---------------------------------------------------------------- 8. dicas e postura
t8 = CH[8]['t'] + 1.8
ovl('cards', t8 - 0.1, T('um imóvel com 40', 950) - 0.4, head='dicas importantes', keep=False, w=440, h=300,
    items=[dict(k='S', big=1, t='2 ou 3 perguntas', b='pesquise o lead antes: perguntas demais nessa etapa cansam', c='#ffd166', at=T('Na situação, use', 915)),
           dict(k='I', big=1, t='Aqui a venda acontece', b='use números concretos', c='#ff5d5d', at=T('E na parte de implicação')),
           dict(k='N', big=1, t='Quem expõe é o cliente', b='a necessidade precisa sair da boca dele, não da sua', c='#e0245e', at=T('e na necessidade'))])
t = T('um imóvel com 40', 950)
ovl('calc', t - 0.3, T('e na necessidade') - 0.2, head='implicação com números', ts=[t, t + 0.6, T('de desconto', 955), T('num ticket', 955) + 0.4, T('são 120 mil', 955)],
    capAt=T('que ficaram na mesa.'), cap='"…são R$ 120 mil que ficaram na mesa."')
ovl('cards', T('e na necessidade') - 0.2, T('Além disso, tenha postura') - 0.2, head='dicas importantes', keep=False, w=440, h=300,
    items=[dict(k='N', big=1, t='Quem expõe é o cliente', b='a necessidade precisa sair da boca dele, não da sua', c='#e0245e', at=T('e na necessidade'))])
t = T('Além disso, tenha postura')
ovl('cards', t - 0.1, CH[9]['t'] - 0.15, head='postura do SDR', keep=False, w=370, h=330,
    items=[dict(k='01', t='Consultor, não vendedor', b='você avalia se ele tem perfil: não implore para ele entrar', c='#c8f43c', at=T('seja consultor')),
           dict(k='02', t='Desqualificar é bom', b='lead sem perfil passado adiante queima a agenda do Closer', c='#ff3d3d', at=T('Desqualificar é')),
           dict(k='03', t='Energia e tom', b='ligue sorrindo, com ritmo: o lead sente pelo telefone', c='#ffb547', at=T('energia e tom')),
           dict(k='04', t='Espelhamento', b='analítico: devagar e com dados · acelerado: seja direto', c='#4d8dff', at=T('é o espelhamento.'))])

# ---------------------------------------------------------------- 9. fechamento e pós-ligação
t9 = CH[9]['t'] + 1.8
ovl('quote', T('Por exemplo, então,', 1025) - 0.1, T('Muito importante, saia') - 0.2,
    text='"Então, se entendi bem, você tem R$ 200 mil parados rendendo CDI e tem medo de arrematar sozinho por causa da ocupação. É isso?"', by='antes de propor o agendamento: resuma a dor em uma frase')
ovl('quote', T('Muito importante, saia') - 0.1, T('Crie compromisso.', 1060) - 0.2,
    text='Saia com o próximo passo agendado.<br><span style="color:#ff6b6b;font-size:.8em">nunca: <s>"te mando o link depois"</s></span>', by='data e hora marcadas na hora')
reveal(T('Muito importante, saia'), 'ag', 'n6ag')
ovl('quote', T('Crie compromisso.', 1060) - 0.1, T('Depois da ligação') - 0.2,
    text='"Se fizer sentido na conversa com o meu especialista, você está em condições de começar ainda este mês?"', by='crie compromisso')
t = T('Depois da ligação')
ovl('cards', t - 0.1, T('Nós sempre vamos ter as ligações gravadas.') - 0.2, head='depois da ligação · preencha o CRM em até 5 minutos', keep=True, w=300, h=170,
    items=[dict(k='✓', big=1, t='Dor', c='#c8f43c', at=T('Registre a dor,')), dict(k='✓', big=1, t='Capital', c='#c8f43c', at=T('capital,', 1080)),
           dict(k='✓', big=1, t='Prazo', c='#c8f43c', at=T('prazo,', 1080)), dict(k='✓', big=1, t='Decisor', c='#c8f43c', at=T('decisor', 1080)),
           dict(k='✓', big=1, t='Frases-chave', c='#c8f43c', at=T('e as frases'))])
ovl('quote', T('Nós sempre vamos ter as ligações gravadas.') - 0.1, CH[10]['t'] - 0.15, text='As ligações são gravadas: analise e busque dicas com o seu gestor.', by='melhoria contínua')

# ---------------------------------------------------------------- 10. o controle é seu
c10 = CH[10]['t'] + 1.8
cam(c10 - 0.6, *FULL, dur=1.8)
active(c10, T('Exemplo, Paulo, amanhã'), 'hS', 'hP', 'hI', 'hN', 'hsp', 'hpi', 'hin', 'ag', color='all')
t = T('Exemplo, Paulo, amanhã')
ovl('slots', t - 0.2, T('Ótimo, acredito que você', 1176) - 0.2, head='amanhã · agenda do especialista', q='"Qual deles fica melhor pra você?"', qAt=T('Qual deles fica'),
    items=[['10:00', 'opção 1', T('às 10')], ['17:00', 'opção 2', T('e às 17')]], pick=T('Lembre -se, o controle'), pi=0, cap='o controle é seu: dê duas opções, não uma pergunta aberta')
t = T('Ótimo, acredito que você', 1176)
cam(t, *FULL); active(t, LAST + 1, *N.keys(), *E.keys(), color='all')
ovl('end', LAST + 0.8, TOTAL)
for d in (N, E):
    for v in d.values():
        if v['reveal'] is None: v['reveal'] = LAST
CAM.sort(key=lambda c: c['t'])

# ---------------------------------------------------------------- legendas (com correção de trechos mal transcritos)
mw = merged(W)
SUBS = []; cur = []
for i, w in enumerate(mw):
    cur.append(w); txt = ' '.join(x['w'] for x in cur)
    nxt = mw[i + 1] if i + 1 < len(mw) else None
    gap = (nxt['s'] - w['e']) if nxt else 9
    if (not nxt or gap > 0.5 or w['w'][-1] in '.?!' or len(txt) > 40 or (w['w'][-1] in ',;:' and len(txt) > 22)
            or (w['e'] - cur[0]['s']) > 3.4 or (nxt and len(txt) + len(nxt['w']) > 44)):
        SUBS.append(dict(t0=cur[0]['s'], t1=max(w['e'], cur[0]['s'] + 0.7), words=[[x['w'], x['s']] for x in cur])); cur = []
REPL = [(r'Lide-se em perfil', 'Lead sem perfil'), (r'passado ou diante,', 'passado adiante'), (r'quem é uma agenda', 'queima a agenda'),
        (r'Data e horas marcada', 'Data e hora marcadas'), (r'até 5 minutos', 'em até 5 minutos'), (r'Lembre, não', 'Lembre: não')]
for s in SUBS:
    txt = ' '.join(w for w, _ in s['words']); new = txt
    for a, b in REPL: new = re.sub(a, b, new)
    if new != txt:
        toks = new.split(); n = len(toks); t0 = s['words'][0][1]; dt = (s['t1'] - t0) / max(n, 1)
        s['words'] = [[tk, round(t0 + k * dt, 3)] for k, tk in enumerate(toks)]
for a, b in zip(SUBS, SUBS[1:]): a['t1'] = min(a['t1'] + 0.25, b['t0'] - 0.02)
def srt_t(x): return '%02d:%02d:%06.3f' % (int(x // 3600), int(x % 3600 // 60), x % 60)
with open(S + 'legendas_ep04.srt', 'w') as f:
    for i, s in enumerate(SUBS, 1):
        f.write('%d\n%s --> %s\n%s\n\n' % (i, srt_t(s['t0']).replace('.', ','), srt_t(s['t1']).replace('.', ','), ' '.join(w for w, _ in s['words'])))

A = '../assets/'
META = dict(ep='Episódio 04', short='EP.04', brand='CANAW + FEXÔ · EP. 04', title='SPIN na prática',
            sub='Como fazer ligações que geram agendamentos de qualidade',
            endHTML=f'''<div style="position:absolute;left:0;right:0;top:300px;text-align:center"><div class="mono" style="color:#ffb547">Próximo capítulo</div>
<div style="font:700 64px Grotesk;margin-top:30px">Dominar as vendas</div>
<div style="font:400 26px Inter;color:#9aa1ab;margin-top:24px">S · P · I · N: 1 ou 2 perguntas por etapa, duas opções de horário, o controle é seu</div>
<div style="display:flex;justify-content:center;align-items:center;gap:50px;margin-top:60px;opacity:.85"><img src="{A}logo_fexo_dark.png" style="height:48px"><img src="{A}logo_canaw.png" style="height:100px"></div></div>''')
DATA = dict(total=TOTAL, chapters=TL['chapters'], gaps=GAPS, nodes=list(N.values()), edges=list(E.values()), active=ACT, cam=CAM,
            demo=DEMO, ovl=OVL, subs=SUBS, meta=META, headers=[])
open(S + 'engine/data.js', 'w').write('window.DATA=' + json.dumps(DATA, ensure_ascii=False) + ';')
print('ok total', TOTAL, 'subs', len(SUBS), 'calls', len(calls))
for c in TL['chapters']: print('  %6.2f  %s' % (c['t'], c['title']))
