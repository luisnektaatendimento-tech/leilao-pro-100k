"""Roteiro de cenas do EP07 · Esteira de Ascensão (Mentoria Investidor Imobiliário · Eliz Sampaio).
Cada ação é ancorada numa frase real da fala: T('frase', depois_de_segundo_original)."""
import json, re, os
S = os.path.dirname(os.path.abspath(__file__)) + '/'
TL = json.load(open(S + 'timeline.json'))
W = TL['words']

def norm(x): return re.sub(r'[^\wà-ú$]', '', x.lower())

def T(phrase, after=0.0, end=False):
    toks = [norm(x) for x in phrase.split()]
    for i in range(len(W) - len(toks) + 1):
        if W[i]['os'] < after - 0.01: continue
        if all(norm(W[i + k]['w']) == toks[k] for k in range(len(toks))):
            return round(W[i + len(toks) - 1]['e'] if end else W[i]['s'], 2)
    raise SystemExit('frase não encontrada: %r depois de %s' % (phrase, after))

CH = {c['n']: c for c in TL['chapters']}
GAPS = [s for s in TL['segments'] if s['kind'] == 'gap']
LAST = W[-1]['e']
TOTAL = round(LAST + 6.5, 2)

# ------------------------------------------------------------------ MAPA
# kinds: icp | low | int | prog | scp | pend
N = {}
def node(id, title, x, y, kind, sub='', w=340, tag=None, price=None):
    N[id] = dict(id=id, title=title, sub=sub, x=x, y=y, kind=kind, w=w, tag=tag, price=price, reveal=None)

XI, XL, XN, XP, XS = 200, 650, 1280, 1910, 2560
YV, YM, YC, YK, YX = 420, 620, 820, 1270, 1590
node('icp_inv', 'Pessoa física', XI, YV, 'icp', 'investidor · já tem capital', w=300, tag='PERFIL')
node('icp_cre', 'Pessoa física', XI, YC, 'icp', 'autônomo · busca crédito', w=300, tag='PERFIL')
node('icp_cor', 'Corretor', XI, YK, 'icp', 'vende imóvel financiado', w=300, tag='PERFIL')
node('lt_bib', 'Biblioteca Investidor Imobiliário', XL, YV, 'low', '20 operações com a conta aberta', w=400, tag='LOW TICKET')
node('lt_pla', 'O Planner do Autônomo', XL, YC, 'low', '12 modelos · finanças e crédito', w=400, tag='LOW TICKET')
node('lt_fic', '50 Fichas de Pré-Análise', XL, YK, 'low', 'aprovação antes do imóvel', w=400, tag='LOW TICKET', price='R$ 37')
node('in_op', 'Operações Imobiliárias', XN, YV, 'int', 'entender as operações', w=380, tag='INTENSIVO', price='R$ 997')
node('in_fi', 'Finanças para o financiamento', XN, YC, 'int', 'alinhar as finanças', w=380, tag='INTENSIVO', price='R$ 997')
node('in_de', 'Geração de demanda', XN, YK, 'int', 'narrativa que converte', w=380, tag='INTENSIVO', price='R$ 997')
node('pr_me', 'Mentoria Investidor Imobiliário', XP, YM, 'prog', 'do conceito ao cálculo', w=430, tag='PROGRAMA', price='R$ 2.997')
node('pr_as', 'Assessor de Investimentos Imobiliários', XP, YK, 'prog', 'mais produtos, mais clientes', w=470, tag='PROGRAMA', price='R$ 2.997')
node('scp', 'SCP', XS, 930, 'scp', 'objetivo final', w=300, tag='DESTINO')
node('icp_ass', 'Assessor de investimentos', XI, YX, 'pend', 'perfil sem trilha', w=320, tag='PERFIL')
node('lt_ass', 'Low ticket a criar', XL, YX, 'pend', 'pendente de definição', w=360, tag='LOW TICKET')
node('web', 'Webinário gravado', XN, YX, 'pend', 'em avaliação', w=340, tag='VENDA DO INTENSIVO')

E = {}
def edge(id, a, b, style='solid', label='', bend=0):
    E[id] = dict(id=id, a=a, b=b, style=style, label=label, bend=bend, reveal=None)
edge('a1', 'icp_inv', 'lt_bib'); edge('a2', 'icp_cre', 'lt_pla'); edge('a3', 'icp_cor', 'lt_fic')
edge('b1', 'lt_bib', 'in_op'); edge('b2', 'lt_pla', 'in_fi'); edge('b3', 'lt_fic', 'in_de')
edge('c1', 'in_op', 'pr_me'); edge('c2', 'in_fi', 'pr_me'); edge('c3', 'in_de', 'pr_as')
edge('d1', 'pr_me', 'scp', label='prepara para entrar'); edge('d2', 'pr_as', 'scp', style='dash', label='futuro: captam pessoas')
edge('p1', 'icp_ass', 'lt_ass', style='dash'); edge('p2', 'web', 'in_de', style='dash', label='vender o intensivo')

def reveal(t, *ids):
    for i in ids:
        d = N if i in N else E
        if d[i]['reveal'] is None: d[i]['reveal'] = t

ACT = []
def active(t0, t1, *ids, color=None): ACT.append(dict(t0=t0, t1=t1, ids=list(ids), color=color))
CAM = []
def cam(t, x, y, z, dur=1.5): CAM.append(dict(t=t, x=x, y=y, z=z, d=dur))
DEMO = []
def demo(t0, t1, src, url, kf, hl=(), label=None):
    DEMO.append(dict(t0=t0, t1=t1, src=src, url=url, kf=kf, hl=list(hl), label=label))
OVL = []
def ovl(kind, t0, t1, **kw): OVL.append(dict(kind=kind, t0=t0, t1=t1, **kw))
def chips(t0, t1, anchor, items, dy=None):
    ovl('chips', t0, t1, anchor=anchor, items=items, dy=dy)

FULL = (1380, 880, 0.56)
ROW = lambda y, z=0.82: (1280, y, z)

# ------------------------------------------------------------------ ABERTURA
ovl('title', 0.0, 3.4)
cam(0, 420, 640, 0.9, 0.01)
t_cards = T('Milton, você fez os produtos')
t_cut = T('Eu criei a ascensão')
ovl('cards', t_cards - 0.2, t_cut + 0.9,
    c=[['planner', 'eliz-pasta-do-autonomo.vercel.app', 'O Planner do Autônomo', 'Pessoa física', T('No final das contas')],
       ['biblioteca', 'eliz-biblioteca-imobiliaria.vercel.app', 'Biblioteca Investidor Imobiliário', 'Pessoa física · investidor', T('pessoa física também')],
       ['fichas', 'venda-aprovada.vercel.app', '50 Fichas de Pré-Análise', 'Corretor', T('pegando o corretor')],
       [None, '', '50 Projetos de Casas Populares', 'Pessoa física final', T('no do Stefano')]],
    three=T('esses três aqui'), head=t_cards)
reveal(t_cut + 0.2, 'icp_inv', 'icp_cre', 'icp_cor')
reveal(t_cut + 0.5, 'a1', 'a2', 'a3', 'lt_bib', 'lt_pla', 'lt_fic')
cam(t_cut, 430, 850, 0.72, 1.8)
active(t_cut + 0.6, CH[1]['t'], 'lt_bib', 'lt_pla', 'lt_fic')

# ------------------------------------------------------------------ CAP 1 · CORRETOR
c1 = CH[1]['t'] + 1.8
t = T('Qual que é a ascensão do corretor')
demo(t - 0.15, T('Então, a Elis vai colocar') - 0.1, 'fichas', 'venda-aprovada.vercel.app',
     kf=[dict(t=0, cx=950, cy=340, z=1.12), dict(t=5.5, cx=950, cy=300, z=1.35)],
     hl=[dict(t0=0.9, t1=3.0, x=440, y=40, w=1030, h=96),
         dict(t0=3.2, t1=9, x=640, y=150, w=620, h=216, label='não ter trava na hora de vender')])
cam(c1 - 0.6, 900, YK - 40, 0.92)
t = T('Então, a Elis vai colocar')
reveal(t, 'b3', 'in_de'); cam(t, 980, YK, 0.9); active(t, T('Então, ele vai para esse evento'), 'in_de')
chips(T('narrativa que converte'), T('Então, ele vai para esse evento') + 0.3, 'in_de',
      [['narrativa que converte', T('narrativa que converte')], ['ângulo de crédito', T('ângulo de crédito')], ['imóvel financiado', T('imóvel financeiro')]])
t = T('Então, ele vai para esse evento')
active(t, t + 3, 'in_de')
t = T('planta na ideia dele')
ovl('badge', t, T('Sacou?') + 0.4, text='plantar', at='in_de')
t = T('mais produtos imobiliários')
cam(t - 0.4, 1450, YK - 20, 0.78, 1.8)
t = T('assessor de investimentos imobiliários', 70)
reveal(t, 'c3', 'pr_as'); active(t, T('Então, assim que eu vou') , 'pr_as')
ovl('vs', T('e não apenas um corretor'), T('Então, assim que eu vou') + 0.4, a='corretor de imóveis', b='assessor de investimentos imobiliários', at='pr_as')
t = T('Então, assim que eu vou')
cam(t, 1100, YK - 30, 0.66, 1.8)
active(t, CH[2]['t'], 'icp_cor', 'a3', 'lt_fic', 'b3', 'in_de', 'c3', 'pr_as', color='violet')

# ------------------------------------------------------------------ CAP 2 · PESSOA FÍSICA (CRÉDITO)
c2 = CH[2]['t'] + 1.8
cam(c2 - 0.6, 700, YC, 0.92)
t = T('Aí, no pessoa física aqui')
active(t, t + 4, 'icp_cre', 'lt_pla')
t_al = T('Como que ele vai alinhar', 104)
demo(t + 0.6, t_al - 0.1, 'planner', 'eliz-pasta-do-autonomo.vercel.app',
     kf=[dict(t=0, cx=950, cy=400, z=1.12), dict(t=4, cx=950, cy=420, z=1.3)],
     hl=[dict(t0=0.6, t1=9, x=570, y=372, w=760, h=160, label='finanças em ordem para acessar crédito')])
reveal(t_al, 'b2', 'in_fi'); cam(t_al, 1000, YC, 0.9); active(t_al, T('E aí, a gente cropa'), 'in_fi')
chips(T('tempo de tela'), T('E aí, a gente cropa') + 0.2, 'in_fi', [['tempo de tela com a equipe', T('tempo de tela')]])
t = T('E aí, a gente cropa')
ovl('badge', t, T('Então, a narrativa aqui') , text='plantar', at='in_fi')
t2 = T('investidor imobiliário', 118)
reveal(t2, 'c2', 'pr_me'); cam(t2 - 0.3, 1600, 720, 0.82, 1.8); active(t2, T('Então, a narrativa aqui'), 'pr_me')
chips(T('já têm um perfil'), T('Então, a narrativa aqui') + 0.2, 'pr_me', [['quem já tem perfil', T('já têm um perfil')]], dy=-118)
t = T('Então, a narrativa aqui')
cam(t, 1500, 1000, 0.6, 1.8); active(t, T('Eu estou plantando'), 'c3', 'c2', 'pr_me', 'pr_as', color='violet')
t = T('Eu estou plantando')
cam(t, 1450, YC - 60, 0.78)
active(t, T('Os especialistas'), 'icp_cre', 'a2', 'lt_pla', 'b2', 'in_fi', 'c2', 'pr_me', color='violet')
chips(T('começando devagar'), T('Os especialistas') + 0.3, 'in_fi',
      [['começar devagar', T('começando devagar')], ['leilão', T('o leilão')]], dy=110)
t = T('Os especialistas')
active(t, CH[3]['t'], 'in_fi')
ovl('tag', t, CH[3]['t'], text='os especialistas conduzem as dores', at='in_fi', dy=-112)

# ------------------------------------------------------------------ CAP 3 · INVESTIDOR
c3 = CH[3]['t'] + 1.8
cam(c3 - 0.6, 760, YV + 40, 0.9)
t = T('mais qualificado'); active(t, t + 6, 'icp_inv', 'lt_bib')
chips(t, T('20 modelos') - 0.2, 'lt_bib', [['mais qualificado', t], ['já tem capital', T('com uma graninha')]], dy=-118)
t = T('20 modelos')
demo(t - 0.3, T('Então, eu já vou colocar') - 0.1, 'biblioteca', 'eliz-biblioteca-imobiliaria.vercel.app',
     kf=[dict(t=0, cx=950, cy=380, z=1.12), dict(t=5, cx=950, cy=520, z=1.4)],
     hl=[dict(t0=0.7, t1=9, x=548, y=508, w=812, h=124, label='20 operações imobiliárias')])
t = T('Então, eu já vou colocar')
reveal(T('produto de', 170), 'b1', 'in_op'); cam(t, 1000, YV + 20, 0.9); active(T('produto de', 170), T('Aí, eu vendo para ele'), 'in_op')
ovl('tag', T('produto de', 170), T('Aí, eu vendo para ele') + 0.3, text='o produto do meio', at='in_op', dy=-112)
t = T('Aí, eu vendo para ele')
reveal(t + 0.3, 'c1'); cam(t, 1600, 560, 0.8); active(t, T('Então, em dois produtos'), 'c1', 'pr_me')
t = T('Então, em dois produtos')
cam(t, 1300, 640, 0.66, 1.8)
active(t, T('E aqui é outro produto'), 'lt_bib', 'lt_pla', 'b1', 'b2', 'in_op', 'in_fi', 'c1', 'c2', 'pr_me', color='violet')
t = T('E aqui é outro produto')
cam(t, 1300, YK - 40, 0.7); active(t, T('Aí, o que vai faltar'), 'lt_fic', 'b3', 'in_de', 'c3', 'pr_as', color='violet')
t = T('Aí, o que vai faltar')
cam(t, 900, 1380, 0.78, 1.8)
reveal(T('outro perfil de cliente'), 'icp_ass'); active(T('outro perfil de cliente'), CH[4]['t'], 'icp_ass', color='amber')
reveal(T('no Low Ticket para isso'), 'p1', 'lt_ass'); active(T('no Low Ticket para isso'), CH[4]['t'], 'p1', 'lt_ass', color='amber')

# ------------------------------------------------------------------ CAP 4 · A MENTORIA (painel)
c4 = CH[4]['t']
cam(c4 + 0.5, XP, YM, 0.9, 0.01)
ovl('grade', c4 + 1.6, CH[5]['t'] + 0.2,
    a=T('o conceito do mercado'), b=T('cálculo de investimento'), v=T('de viabilidade'),
    task=T('fica uma'), esc=T('maneira escalável'), etapa=T('cada etapa'))

# ------------------------------------------------------------------ CAP 5 · SCP
c5 = CH[5]['t'] + 1.8
cam(c5 - 0.6, 2150, 820, 0.82)
t = T('o último produto antes')
reveal(T('do SCP', 480), 'd1', 'scp'); active(T('do SCP', 480), T('e a outra via'), 'pr_me', 'd1', 'scp')
ovl('tag', T('mentoria barra comunidade'), T('e a outra via'), text='mentoria / comunidade', at='pr_me', dy=-112)
t = T('e a outra via')
cam(t, 2150, 1080, 0.8); active(t, T('foi isso que eu'), 'pr_as')
reveal(T('captem pessoas'), 'd2'); active(T('captem pessoas'), T('foi isso que eu') + 1.5, 'd2', 'scp', 'pr_as')
t = T('esse desenho bateu bem')
cam(t, *FULL, dur=2.0); active(t, T('Só um contexto'), *[k for k in N if N[k]['kind'] != 'pend'], color='violet')
t = T('Só um contexto')
cam(t, 1280, 1300, 0.78)
reveal(T('webinário'), 'web', 'p2'); active(T('webinário'), CH[6]['t'], 'web', 'p2', 'in_de', 'in_fi', 'in_op', color='amber')
ovl('tag', T('vale ou não'), CH[6]['t'], text='a decidir se vale a pena', at='web', dy=-112)
cam(T('esse intensivão'), 1280, 1000, 0.62, 1.8)

# ------------------------------------------------------------------ CAP 6 · RESUMO
c6 = CH[6]['t'] + 1.8
cam(c6 - 0.6, *FULL, dur=1.8)
t = T('objetivo final', 560); active(T('o SCP', 565), T('os investidores aqui'), 'scp', color='white')
t = T('os investidores aqui'); active(t, T('os assessores aqui'), 'pr_me', 'd1', color='violet')
t = T('os assessores aqui'); active(t, T('por uma consultoria'), 'pr_as', 'd2', color='violet')
t = T('por uma consultoria'); active(t, T('são adquiridos'), 'in_op', 'in_fi', 'in_de', 'c1', 'c2', 'c3', color='violet')
ovl('colhl', t, T('são adquiridos'), col=XN)
t = T('são adquiridos'); active(t, T('cada público'), 'lt_bib', 'lt_pla', 'lt_fic', 'b1', 'b2', 'b3', color='violet')
ovl('colhl', t, T('cada público'), col=XL)
t = T('cada público'); active(t, T('top?'), 'icp_inv', 'icp_cre', 'icp_cor', 'a1', 'a2', 'a3', color='violet')
ovl('colhl', t, T('top?'), col=XI)
t = T('top?'); active(t, TOTAL, *[k for k in N if N[k]['kind'] != 'pend'], *[k for k in E if k not in ('p1', 'p2')], color='all')
ovl('end', LAST + 0.9, TOTAL)

for d in (N, E):
    for v in d.values():
        if v['reveal'] is None: v['reveal'] = LAST
CAM.sort(key=lambda c: c['t']); DEMO.sort(key=lambda d: d['t0'])

# ------------------------------------------------------------------ LEGENDAS
FIX = {'elis': 'Eliz', 'cropa': 'planta', 'acender': 'ascender', 'financeiro': 'financiado', 'low': 'low', 'ticket': 'ticket'}
PROPER = {'SCP', 'Eliz', 'Milton', 'Stefano', 'Planner', 'Autônomo'}
words = []
for i, w in enumerate(W):
    m = re.match(r'^(\W*)([\wà-úÀ-Ú$]+)(\W*)$', w['w'])
    txt = w['w']
    if m:
        a, core, b = m.groups()
        if core.lower() in FIX: core = FIX[core.lower()]
        txt = a + core + b
    words.append(dict(w=txt, s=w['s'], e=w['e'], os=w['os']))
for i, w in enumerate(words):
    nx = words[i + 1]['w'] if i + 1 < len(words) else ''
    nx2 = words[i + 2]['w'] if i + 2 < len(words) else ''
    if w['w'] == 'plano' and nx == 'do' and nx2.startswith('autônomo'):
        w['w'] = 'Planner'; words[i + 2]['w'] = 'Autônomo' + nx2[len('autônomo'):]
    if w['w'] == 'de' and nx == 'e' and nx2.startswith('-mail'):
        w['w'] = 'do'; words[i + 1]['w'] = 'meio'; words[i + 2]['w'] = ''
    if w['w'].startswith('-') and i > 0:
        words[i - 1]['w'] += w['w']; w['w'] = ''
    # caixa: o transcritor capitaliza o início de cada linha
    prev = next((x['w'] for x in reversed(words[:i]) if x['w']), '.')
    core = re.sub(r'[^\wà-úÀ-Ú]', '', w['w'])
    if core and core[0].isupper() and prev[-1] not in '.?!' and core not in PROPER and not core.isupper():
        w['w'] = w['w'][0].lower() + w['w'][1:]
words = [w for w in words if w['w']]
SUBS = []; cur = []
for i, w in enumerate(words):
    cur.append(w)
    txt = ' '.join(x['w'] for x in cur)
    nxt = words[i + 1] if i + 1 < len(words) else None
    gap = (nxt['s'] - w['e']) if nxt else 9
    if (not nxt or gap > 0.5 or w['w'][-1] in '.?!' or len(txt) > 40 or (w['w'][-1] in ',;:' and len(txt) > 22)
            or (w['e'] - cur[0]['s']) > 3.4 or (nxt and len(txt) + len(nxt['w']) > 44)):
        SUBS.append(dict(t0=cur[0]['s'], t1=max(w['e'], cur[0]['s'] + 0.7), words=[[x['w'], x['s']] for x in cur])); cur = []
for a, b in zip(SUBS, SUBS[1:]):
    a['t1'] = min(a['t1'] + 0.25, b['t0'] - 0.02)
def srt_t(x):
    return '%02d:%02d:%06.3f' % (int(x // 3600), int(x % 3600 // 60), x % 60)
with open(S + '../legendas/legendas_ep07.srt', 'w') as f:
    for i, s in enumerate(SUBS, 1):
        f.write('%d\n%s --> %s\n%s\n\n' % (i, srt_t(s['t0']).replace('.', ','), srt_t(s['t1']).replace('.', ','), ' '.join(w for w, _ in s['words'])))

DATA = dict(total=TOTAL, chapters=TL['chapters'], gaps=GAPS, nodes=list(N.values()), edges=list(E.values()),
            active=ACT, cam=CAM, demo=DEMO, ovl=OVL, subs=SUBS, cols=dict(XI=XI, XL=XL, XN=XN, XP=XP, XS=XS))
open(S + 'engine/data.js', 'w').write('window.DATA=' + json.dumps(DATA, ensure_ascii=False) + ';')
print('ok total', TOTAL, 'legendas', len(SUBS), 'demos', len(DEMO), 'câmeras', len(CAM))
