"""Roteiro de cenas do Episódio 05: Follow-up e reativação de leads."""
import json, re, os
S = os.path.dirname(os.path.abspath(__file__)) + '/'
TL = json.load(open(S + 'timeline.json'))
W = TL['words']
def norm(x): return re.sub(r'[^\wà-ú$%]', '', x.lower())
def idx(phrase, after=0.0):
    toks = [norm(x) for x in phrase.split()]
    for i in range(len(W) - len(toks) + 1):
        if W[i]['os'] < after - 0.01: continue
        if all(norm(W[i + k]['w']) == toks[k] for k in range(len(toks))): return i, i + len(toks) - 1
    raise SystemExit('phrase not found: %r after %s' % (phrase, after))
def T(p, after=0.0, end=False): i, j = idx(p, after); return round(W[j]['e'] if end else W[i]['s'], 2)
CH = {c['n']: c for c in TL['chapters']}
GAPS = [s for s in TL['segments'] if s['kind'] == 'gap']
LAST = W[-1]['e']; RECAP = LAST + 0.8; TOTAL = round(LAST + 19.0, 2)

FIX = {'luiz': 'Luís', 'necta': 'Nekta', 'closer': 'Closer'}
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
        if out and (x['w'][0] in '-$%' or re.match(r'^[.,]\d', x['w']) or out[-1]['w'] in ('R', 'R$')): out[-1]['w'] += x['w']; out[-1]['e'] = x['e']
        else: out.append(x)
    for x in out: x['w'] = x['w'].replace('...', '…')
    return out
def span(p0, p1, a0=0.0, a1=0.0):
    i, _ = idx(p0, a0); _, j = idx(p1, a1)
    ws = [[x['w'], x['s']] for x in merged(W[i:j + 1])]; ws[0][0] = ws[0][0][:1].upper() + ws[0][0][1:]
    return ws, W[i]['s'], W[j]['e']

# ---------------------------------------------------------------- mapa: linha do tempo da cadência
N = {}
def node(id, title, x, y, kind, sub='', w=360, tag=None):
    N[id] = dict(id=id, title=title, sub=sub, x=x, y=y, kind=kind, w=w, tag=tag, reveal=None, prio=None, prioAt=9999)
DX = {'d7': 300, 'd10': 720, 'd14': 1140, 'd21': 1560, 'd30': 1980, 'd45': 2400, 'd60': 2820, 'd90': 3240}
node('d7', 'D7 · Porta aberta', DX['d7'], 300, 'f1', '1 toque, sem esforço', tag='WHATSAPP')
node('d10', 'D10 · Troca de canal', DX['d10'], 300, 'f1', 'a voz humaniza', tag='LIGAÇÃO + ÁUDIO')
node('d14', 'D14 · Case', DX['d14'], 300, 'f2', 'entrega valor, não pede reunião', tag='WHATSAPP')
node('d21', 'D21 · Insight', DX['d21'], 300, 'f2', '1 ideia, 2–3 linhas', tag='WHATSAPP')
node('d30', 'D30 · Gatilho', DX['d30'], 300, 'f2', 'novidade = motivo novo', tag='WHATSAPP')
node('d45', 'D45 · Check-in', DX['d45'], 300, 'f3', 'o momento pode ter mudado', tag='WHATSAPP')
node('d60', 'D60 · Material', DX['d60'], 300, 'f3', 'conteúdo útil + convite leve', tag='E-MAIL / WHATSAPP')
node('d90', 'D90 · Último toque', DX['d90'], 300, 'f3', 'encerra com respeito', tag='WHATSAPP')
node('resp', 'Respondeu em qualquer toque → pare a cadência e classifique no CRM', 1770, 540, 'conv', '', w=1700, tag='REGRA')
node('c1', 'Quero / tenho interesse', 700, 740, 'yes', 'volta ao fluxo: qualificação → reunião', w=400, tag='RESPOSTA')
node('c2', 'Agora não', 1240, 740, 'f1', '"quando faz mais sentido?" → agenda o follow', w=400, tag='RESPOSTA')
node('c3', 'Não tenho interesse', 1780, 740, 'no', '1 pergunta: motivo → "Perdido"', w=400, tag='RESPOSTA')
node('c4', 'Pare de mandar', 2320, 740, 'no', 'opt-out imediato, nunca mais', w=400, tag='RESPOSTA')
node('c5', 'Respondeu e sumiu', 2860, 740, 'ghost', 'entra na mini-cadência anti-ghosting', w=400, tag='RESPOSTA')
node('g1', '+24h · Retomar contexto', 1100, 960, 'conv', 'ficou alguma dúvida?', w=400, tag='ANTI-GHOSTING')
node('g2', '+48h · Pergunta fácil', 1640, 960, 'conv', 'sim ou não, ligada ao que ele disse', w=400, tag='ANTI-GHOSTING')
node('g3', '+4 dias · Break-up leve', 2180, 960, 'conv', '"vou deixar em pausa"', w=400, tag='ANTI-GHOSTING')
node('g4', 'Sem resposta? → D14', 2720, 960, 'f2', 'pula a repescagem, vai à nutrição', w=400, tag='ANTI-GHOSTING')
E = {}
def edge(id, a, b, style='solid', label='', bend=0, side=None, off=150):
    E[id] = dict(id=id, a=a, b=b, style=style, label=label, bend=bend, kind=None, reveal=None, side=side, off=off)
order = list(DX)
for a, b in zip(order, order[1:]): edge(a + b, a, b, label='sem resposta' if a == 'd7' else '')
for c in ['c1', 'c2', 'c3', 'c4', 'c5']: edge('r' + c, 'resp', c)
edge('g12', 'g1', 'g2'); edge('g23', 'g2', 'g3'); edge('g34', 'g3', 'g4')
HEADERS = [dict(t='FASE 1 · REPESCAGEM', s='D7 – D10', x=510, y=150, c='#ffb547', rid='d7', small=1),
           dict(t='FASE 2 · NUTRIÇÃO', s='D14 – D30', x=1560, y=150, c='#4d8dff', rid='d14', small=1),
           dict(t='FASE 3 · LONGO PRAZO', s='D45 – D90', x=2820, y=150, c='#b79cff', rid='d45', small=1)]
def reveal(t, *ids):
    for i in ids:
        d = N if i in N else E
        if d[i]['reveal'] is None: d[i]['reveal'] = t
ACT = []
def active(t0, t1, *ids, color=None): ACT.append(dict(t0=t0, t1=t1, ids=list(ids), color=color))
CAM = []
def cam(t, x, y, z, dur=1.4): CAM.append(dict(t=t, x=x, y=y, z=z, d=dur))
OVL = []
def ovl(kind, t0, t1, **kw): OVL.append(dict(kind=kind, t0=t0, t1=t1, **kw))
def focus(nid, t, z=0.85): cam(t, N[nid]['x'] + 380 / z, 420, z)       # nó à esquerda, celular à direita
FULL = (1770, 560, 0.48)
def phone(t0, t1, day, color, items, lead='Paulo', channel='WhatsApp', sub=None):
    ovl('phone', t0, t1, day=day, color=color, items=items, lead=lead, channel=channel, sub=sub)

# ---------------------------------------------------------------- 0. por que
ovl('title', 0.0, 3.4)
cam(0, 1770, 300, 0.5, 0.01)
t = T('Agora nós vamos')
ovl('lower', t + 0.3, t + 6, name='Luís Nekta', role='Episódio 05 · Follow-up e reativação')
ovl('quote', T('É interessante entender que dificilmente') - 0.2, CH[1]['t'] - 0.15, text='Quase ninguém fecha com você se você chamar só uma vez.', by='o follow-up é onde a venda é recuperada')

# ---------------------------------------------------------------- 1. as 3 fases
c1 = CH[1]['t'] + 1.8
cam(c1 - 0.6, 1770, 300, 0.5)
ovl('cards', T('três fases,') - 0.2, CH[2]['t'] - 0.15, head='cadência de reativação · leads que não respondem', keep=True, w=440, h=230,
    items=[dict(k='FASE 1 · D7–D10', t='Repescagem', b='porta aberta e troca de canal', c='#ffb547', at=T('a de repescagem')),
           dict(k='FASE 2 · D14–D30', t='Nutrição', b='valor, insight e gatilho', c='#4d8dff', at=T('a de nutrição')),
           dict(k='FASE 3 · D45–D90', t='Longo prazo', b='check-in, material e último toque', c='#b79cff', at=T('e a de longo prazo'))])
reveal(T('a de repescagem'), 'd7', 'd10', 'd7d10'); reveal(T('a de nutrição'), 'd14', 'd21', 'd30', 'd10d14', 'd14d21', 'd21d30')
reveal(T('e a de longo prazo'), 'd45', 'd60', 'd90', 'd30d45', 'd45d60', 'd60d90')

# ---------------------------------------------------------------- 2. fase 1
focus('d7', CH[2]['t'] + 1.2)
w, a, b = span('fala Paulo, passando', 'novidade para você.')
phone(T('Então para iniciar a fase 1') + 0.8, T('Ainda na fase 1') - 0.2, 'D7 · Porta aberta', '#ffb547', [dict(type='sep', text='Dia 7', t0=T('Então para iniciar a fase 1') + 0.9), dict(type='text', t0=a, t1=b, w=w, hour='10:14')])
active(T('Então para iniciar a fase 1'), T('Ainda na fase 1'), 'd7')
t = T('Ainda na fase 1')
focus('d10', t); active(t, CH[3]['t'], 'd10', 'd7d10')
w, a, b = span('Paulo, aqui é o', 'em dois minutos.')
phone(t + 0.3, CH[3]['t'] - 0.15, 'D10 · Troca de canal', '#ffb547',
      [dict(type='sep', text='Dia 10', t0=t + 0.4), dict(type='missed', text='Chamada de voz não atendida · 10:42', t0=T('uma ligação')),
       dict(type='audio', t0=a, t1=b, w=w)])

# ---------------------------------------------------------------- 3. fase 2
c3 = CH[3]['t'] + 1.8
focus('d14', c3 - 0.6); active(c3, T('Ainda na etapa de nutrição, nós podemos fazer'), 'd14', 'd10d14')
w, a, b = span('Ângelo, lembrei de', 'caso desse cliente?')
phone(T('Na fase 2, nós') + 0.6, T('Ainda na etapa de nutrição, nós podemos fazer') - 0.2, 'D14 · Nutrição 1: case', '#4d8dff', [dict(type='sep', text='Dia 14', t0=T('Na fase 2, nós') + 0.7), dict(type='text', t0=a, t1=b, w=w, hour='09:31')], lead='Ângelo')
t = T('Ainda na etapa de nutrição, nós podemos fazer')
focus('d21', t); active(t, T('E no próximo dia, ainda na fase'), 'd21', 'd14d21')
w, a, b = span('Um dado muito comum', 'com você também?')
phone(t + 0.3, T('E no próximo dia, ainda na fase') - 0.2, 'D21 · Nutrição 2: insight', '#4d8dff', [dict(type='sep', text='Dia 21', t0=t + 0.4), dict(type='text', t0=a, t1=b, w=w, hour='14:05')])
t = T('E no próximo dia, ainda na fase')
focus('d30', t); active(t, CH[4]['t'], 'd30', 'd21d30')
w, a, b = span('É novidade que', 'esse seria o seu caso?')
phone(t + 0.3, CH[4]['t'] - 0.15, 'D30 · Reativação com gatilho', '#4d8dff', [dict(type='sep', text='Dia 30', t0=t + 0.4), dict(type='text', t0=a, t1=b, w=w, hour='10:02')])

# ---------------------------------------------------------------- 4. fase 3
c4 = CH[4]['t'] + 1.8
focus('d45', c4 - 0.6); active(c4, T('Um próximo follow'), 'd45', 'd30d45')
w, a, b = span('Paulo, mudou alguma', 'ainda é uma prioridade?')
phone(c4 + 0.2, T('Um próximo follow') - 0.2, 'D45 · Check-in de momento', '#b79cff', [dict(type='sep', text='Dia 45', t0=c4 + 0.3), dict(type='text', t0=a, t1=b, w=w, hour='11:20')])
t = T('Um próximo follow')
focus('d60', t); active(t, T('E um último toque'), 'd60', 'd45d60')
w, a, b = span('Paulo, veja só', 'de entrada.')
phone(t + 0.3, T('E um último toque') - 0.2, 'D60 · Material + convite leve', '#b79cff',
      [dict(type='sep', text='Dia 60', t0=t + 0.4), dict(type='att', badge='PODCAST', title='Podcast · Paulinho dos Leilões', sub='arrematação de um aluno', t0=T('Paulo, veja só') + 0.8), dict(type='text', t0=a, t1=b, w=w, hour='19:10')])
t = T('E um último toque')
focus('d90', t); active(t, CH[5]['t'], 'd90', 'd60d90')
w, a, b = span('Paulo, eu vou encerrar', 'que eu te retorno.')
phone(t + 0.3, CH[5]['t'] - 0.15, 'D90 · Último toque', '#b79cff', [dict(type='sep', text='Dia 90', t0=t + 0.4), dict(type='text', t0=a, t1=b, w=w, hour='10:00')])

# ---------------------------------------------------------------- 5. CRM
c5 = CH[5]['t'] + 1.8
cam(c5 - 0.6, 1770, 640, 0.48, 1.8)
reveal(c5, 'resp'); active(c5, c5 + 5, 'resp')
for nid, p in [('c1', 'quem realmente tem interesse'), ('c3', 'quem já não tem mais'), ('c4', 'quem já não tem mais'), ('c2', 'quem pode ser agendado'), ('c5', 'e aquele que simplesmente')]:
    tt = T(p) + (0.5 if nid == 'c4' else 0); reveal(tt, nid, 'r' + nid); active(tt, tt + 3.5, nid)
t = T('você automaticamente faça')
ovl('cards', 0, 0, head='', items=[])  # placeholder (mantém índice estável)
DEMO = [dict(t0=t - 0.2, t1=T('quem realmente tem interesse') - 0.3, src='crm_b_115', url='nekta crm/leads', mode='inset', label='Atualize a etapa no CRM',
             kf=[dict(t=0, cx=1100, cy=560, z=1.3)], hl=[dict(t0=0.4, t1=9, x=315, y=505, w=1565, h=40, label='')], cursor=[])]

# ---------------------------------------------------------------- 6. anti-ghosting
c6 = CH[6]['t'] + 1.8
cam(c6 - 0.6, 2508, 860, 0.56, 1.6)
reveal(c6, 'g1', 'g2', 'g3', 'g4', 'g12', 'g23', 'g34')
w1, a1, b1 = span('Paulo, ficou alguma', 'que eu te falei?')
w2, a2, b2 = span('Deixa eu entender, Ângela.', 'ainda esse mês?')
active(a1 - 0.5, b1 + 0.5, 'g1'); active(a2 - 0.5, b2 + 1, 'g2')
phone(c6 + 0.2, CH[7]['t'] - 0.15, 'mini-cadência anti-ghosting', '#c9cdd3',
      [dict(type='sep', text='+24h sem resposta', t0=a1 - 0.6), dict(type='text', t0=a1, t1=b1, w=w1, hour='09:12'),
       dict(type='sep', text='+48h', t0=a2 - 0.6), dict(type='text', t0=a2, t1=b2, w=w2, hour='15:40')], lead='Lead', sub='conversou e parou de responder')

# ---------------------------------------------------------------- 7. o que importa
c7 = CH[7]['t'] + 1.8
ovl('cards', c7 - 0.2, T('Então, o follow -up deve ser') - 0.2, head='o que realmente importa', keep=True, w=440, h=280,
    items=[dict(k='01', t='Contato ativo > mensagem perfeita', b='continue presente mesmo sem devolutiva no primeiro contato', c='#c8f43c', at=T('não é uma mensagem perfeita')),
           dict(k='02', t='Não existe mensagem milagrosa', b='seja criativo: use os materiais que a gente tem', c='#ffb547', at=T('não existe uma mensagem milagrosa.')),
           dict(k='03', t='Humanize', b='materiais, figurinhas, conteúdos: traga o lead de volta de forma pessoal', c='#4d8dff', at=T('figurinhas,'))])
ovl('quote', T('Então, o follow -up deve ser') - 0.1, LAST + 0.6, text='Follow-up é a primeira tarefa do seu dia.', by='5 dias sem resposta → stand-by no pipeline')
gold = [('1 mensagem por toque', 'nunca 2 seguidas sem resposta'), ('Todo toque traz um motivo novo', 'proibido "só passando para saber"'),
        ('Use o contexto', 'do formulário e da conversa anterior'), ('Horários', 'seg–sex, 9–11h e 14–17h'),
        ('Varie o canal', 'texto, áudio, ligação, e-mail'), ('Respeite o opt-out', 'na hora, sem exceção'),
        ('Volume baixo por número', 'para não ser bloqueado'), ('Registre tudo no CRM', 'cada toque e cada resposta')]
ovl('cards', RECAP, RECAP + 10, head='do quadro da aula · regras de ouro da reativação', keep=True, w=380, h=150, top=150,
    items=[dict(k='%02d' % (i + 1), t=a, b=b, c='#ff6b6b', at=RECAP + 0.3 + i * 0.35) for i, (a, b) in enumerate(gold)])
ovl('end', RECAP + 10.2, TOTAL)
cam(c7, *FULL, dur=1.8); active(c7, TOTAL, *[n for n in N], *E.keys(), color='all')
for d in (N, E):
    for v in d.values():
        if v['reveal'] is None: v['reveal'] = LAST
OVL = [o for o in OVL if not (o['kind'] == 'cards' and not o['items'])]
CAM.sort(key=lambda c: c['t'])

# ---------------------------------------------------------------- legendas
mw = merged(W)
SUBS = []; cur = []
for i, w in enumerate(mw):
    cur.append(w); txt = ' '.join(x['w'] for x in cur)
    nxt = mw[i + 1] if i + 1 < len(mw) else None
    gap = (nxt['s'] - w['e']) if nxt else 9
    if (not nxt or gap > 0.5 or w['w'][-1] in '.?!…' or len(txt) > 40 or (w['w'][-1] in ',;:' and len(txt) > 22)
            or (w['e'] - cur[0]['s']) > 3.4 or (nxt and len(txt) + len(nxt['w']) > 44)):
        SUBS.append(dict(t0=cur[0]['s'], t1=max(w['e'], cur[0]['s'] + 0.7), words=[[x['w'], x['s']] for x in cur])); cur = []
for a, b in zip(SUBS, SUBS[1:]): a['t1'] = min(a['t1'] + 0.25, b['t0'] - 0.02)
def srt_t(x): return '%02d:%02d:%06.3f' % (int(x // 3600), int(x % 3600 // 60), x % 60)
with open(S + 'legendas_ep05.srt', 'w') as f:
    for i, s in enumerate(SUBS, 1):
        f.write('%d\n%s --> %s\n%s\n\n' % (i, srt_t(s['t0']).replace('.', ','), srt_t(s['t1']).replace('.', ','), ' '.join(w for w, _ in s['words'])))

A = '../assets/'
META = dict(ep='Episódio 05', short='EP.05', brand='CANAW + FEXÔ · EP. 05', title='Follow-up',
            sub='A cadência de reativação: como trazer o lead de volta sem queimar o contato',
            endHTML=f'''<div style="position:absolute;left:0;right:0;top:310px;text-align:center"><div class="mono" style="color:#ffb547">Resumo</div>
<div style="font:700 60px Grotesk;margin-top:30px">Repescagem → Nutrição → Longo prazo</div>
<div style="font:400 26px Inter;color:#9aa1ab;margin-top:24px">respondeu? pare, classifique e atualize o CRM · follow-up todo dia, logo cedo</div>
<div style="display:flex;justify-content:center;align-items:center;gap:50px;margin-top:60px;opacity:.85"><img src="{A}logo_fexo_dark.png" style="height:48px"><img src="{A}logo_canaw.png" style="height:100px"></div></div>''')
DATA = dict(total=TOTAL, chapters=TL['chapters'], gaps=GAPS, nodes=list(N.values()), edges=list(E.values()), active=ACT, cam=CAM,
            demo=DEMO, ovl=OVL, subs=SUBS, meta=META, headers=HEADERS)
open(S + 'engine/data.js', 'w').write('window.DATA=' + json.dumps(DATA, ensure_ascii=False) + ';')
print('ok total', TOTAL, 'subs', len(SUBS))
for c in TL['chapters']: print('  %6.2f  %s' % (c['t'], c['title']))
