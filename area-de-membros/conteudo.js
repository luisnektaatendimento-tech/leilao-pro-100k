/* ============================================================================
   CENTRAL COMERCIAL · conteúdo
   ----------------------------------------------------------------------------
   Este é o único arquivo que você precisa editar no dia a dia.
   - Para ligar um vídeo a uma aula, cole o link em `video` (YouTube, YouTube
     não listado, Google Drive com "qualquer pessoa com o link" ou um .mp4).
   - Tudo entre chaves, como {lead}, é preenchido pelo vendedor na barra
     "Personalizar" do Arsenal: {lead} {sdr} {esp} {produto} {data} {horario}.
   ========================================================================== */
window.CONTEUDO = {

  /* --------------------------------------------------------------- AULAS */
  aulas: [
    {
      n: 1, slug: 'aula-1', titulo: 'Canaw + Fexô: o ecossistema', duracao: '11:15', thumb: 'assets/aula-1.jpg',
      video: '',
      resumo: 'Por que existem duas plataformas e como elas se alimentam para vender serviço (assessoria) e mentoria dos especialistas do mercado imobiliário.',
      capitulos: [['00:00', 'Introdução: por que duas plataformas'], ['00:23', 'Fexô: vender serviço'], ['03:02', 'Fexô: vender mentoria'], ['05:26', 'A ponte Fexô ⇄ Canaw'],
                  ['06:51', 'Canaw: o funil da TV'], ['09:18', 'Low ticket e retroalimentação'], ['09:55', 'Onde as plataformas se encontram']],
      levar: ['A Fexô atrai pelo imóvel de oportunidade (leilão) e qualifica pelo crédito.',
              'A Canaw é a TV dos especialistas: gera atenção de qualidade e tempo de tela.',
              'Tudo converge para o mesmo lugar: agendamento com especialista → consultoria → assessoria (serviço) ou mentoria.',
              'O low ticket roda sozinho, com tráfego direto, e devolve gente para a Canaw.'],
      ver: [['arsenal', 'Abrir o Arsenal por origem']]
    },
    {
      n: 2, slug: 'aula-2', titulo: 'Como o time comercial opera', duracao: '7:02', thumb: 'assets/aula-2.jpg',
      video: '',
      resumo: 'As 3 fases do processo, quem faz o quê (SDR e Closer) e os 6 momentos em que o time entra, em ordem de prioridade.',
      capitulos: [['00:00', 'Abertura'], ['00:13', 'As 3 fases e os papéis (SDR e Closer)'], ['01:41', 'Inteligência comercial'], ['02:38', 'Fexô: 2 momentos'],
                  ['03:44', 'Canaw: 2 momentos'], ['04:25', 'Low ticket: 2 momentos'], ['05:21', 'Ligação primeiro'], ['05:54', 'A matriz de prioridade']],
      levar: ['Fase 1 gera demanda. Fase 2 é do SDR: qualificação e agendamento. Fase 3 é do Closer: fechamento e recuperação.',
              'Não ligamos para todo mundo. Ligamos nos 6 momentos de alta intenção, em ordem P1 → P5.',
              'O SDR sempre faz o contato, para confirmar e qualificar ou para qualificar do zero.',
              'Ligação gera mais resultado e mais rápido que WhatsApp. Nunca fique sem ligar.'],
      ver: [['arsenal', 'Ver os 6 momentos no Arsenal']]
    },
    {
      n: 3, slug: 'aula-3', titulo: 'Organize seus leads no Nekta CRM', duracao: '12:22', thumb: 'assets/aula-3.jpg',
      video: '',
      resumo: 'O caminho do lead dentro do Nekta CRM: base de nutrição, primeira abordagem em 5 minutos, pipeline, SPIN, agenda e comparecimento.',
      capitulos: [['00:00', 'Abertura'], ['00:24', 'Todos os leads em um só lugar'], ['01:20', 'Base de nutrição'], ['02:46', 'Primeira abordagem: 5 minutos'],
                  ['03:19', 'A pipeline do CRM'], ['04:15', 'Respondeu ou não: ligue'], ['05:00', 'SPIN Selling'], ['07:18', 'Agendou ou não agendou'],
                  ['08:12', 'Agenda e passagem para o Closer'], ['10:18', 'Comparecimento']],
      levar: ['Todo lead chega na base de nutrição. Você assume o lead como responsável e aborda.',
              'Primeiro contato em até 5 minutos. Respondeu ou não, você liga.',
              'Agendou: marque na agenda do CRM com o contexto do pré-vendas. Não agendou: desqualificado.',
              'Agendado não basta. Crie o grupo e garanta o comparecimento.'],
      ver: [['crm', 'Abrir o guia do Nekta CRM']]
    },
    {
      n: 4, slug: 'aula-4', titulo: 'SPIN na prática', duracao: '11:18', thumb: 'assets/aula-4.jpg',
      video: '',
      resumo: 'Como fazer ligações que geram agendamentos de qualidade: abertura, perguntas de Situação, Problema, Implicação e Necessidade, postura e fechamento.',
      capitulos: [['00:00', 'Abertura'], ['00:15', 'O público: 3 objetivos'], ['01:01', 'Abrindo a ligação'], ['01:42', 'S · Situação'], ['02:55', 'P · Problema'],
                  ['05:03', 'I · Implicação'], ['06:32', 'N · Necessidades'], ['07:39', 'Sem script: domine o fluxo'], ['08:24', 'Dicas e postura'],
                  ['09:36', 'Fechamento e pós-ligação'], ['10:29', 'O controle é seu']],
      levar: ['Três públicos: moradia, investimento e nova profissão. O SPIN é o mesmo, as perguntas se adaptam.',
              '1 ou 2 perguntas por etapa, 6 a 8 no total. Domine o fluxo, não o script.',
              'Na implicação a venda acontece: use números. Na necessidade, quem fala é o cliente.',
              'Resuma a dor em uma frase, ofereça dois horários e saia com a reunião marcada.'],
      ver: [['spin', 'Abrir o banco de perguntas SPIN']]
    },
    {
      n: 5, slug: 'aula-5', titulo: 'Follow-up e reativação', duracao: '5:33', thumb: 'assets/aula-5.jpg',
      video: '',
      resumo: 'A cadência de reativação para quem não respondeu: repescagem, nutrição e longo prazo, mais a mini-cadência anti-ghosting.',
      capitulos: [['00:00', 'Por que fazer follow-up'], ['00:37', 'As 3 fases'], ['00:50', 'Fase 1 · Repescagem'], ['01:30', 'Fase 2 · Nutrição'],
                  ['02:21', 'Fase 3 · Longo prazo'], ['03:05', 'Respondeu? Atualize o CRM'], ['03:27', 'Anti-ghosting'], ['03:43', 'O que realmente importa']],
      levar: ['Quase ninguém fecha se você chamar só uma vez.',
              'Cada toque traz um motivo novo. Varie o canal: texto, áudio, ligação.',
              'Respondeu em qualquer toque: pare a cadência e classifique no CRM.',
              'Follow-up é a primeira tarefa do seu dia.'],
      ver: [['cadencia', 'Abrir as mensagens da cadência']]
    },
    {
      n: 6, slug: 'aula-6', titulo: 'A rotina do SDR', duracao: '5:22', thumb: 'assets/aula-6.jpg',
      video: '',
      resumo: 'O dia do SDR de alta performance: ligações em blocos, follow-up com cadência, CRM sempre atualizado e as metas diárias.',
      capitulos: [['00:00', 'Abertura'], ['00:20', 'Manhã · planejar e mensagens'], ['00:54', 'Bloco 1 · ligações'], ['01:23', 'Meio do dia · CRM e almoço'],
                  ['01:51', 'Tarde · follow-up e bloco 2'], ['02:20', 'Fim do dia · bloco 3 e preparação'], ['03:01', 'As metas diárias'],
                  ['04:10', 'Regras de ouro'], ['04:44', 'Encerramento da série']],
      levar: ['Três blocos de ligação inegociáveis: 9h30–11h30, 14h30–16h e 16h20–17h15.',
              'O resultado você não controla. A sua execução, sim.',
              'Meta diária: 20 ligações atendidas, 15 conversas, 30 follow-ups e de 4 a 6 agendamentos.',
              'Termine o dia com o CRM 100% alinhado.'],
      ver: [['rotina', 'Abrir o Meu dia']]
    }
  ],

  /* ------------------------------------------------- ABERTURA PADRÃO (aula 4) */
  direcao: 'Seguinte: para que eu consiga te ajudar melhor, de uma forma mais efetiva, eu vou precisar te fazer algumas perguntas para entender se algum dos produtos que a gente tem aqui consegue acelerar o seu processo dentro do mercado. Pode ser?',

  /* ------------------------------------------------------------ ORIGENS */
  origens: [
    {
      slug: 'origem-fexo-consultoria', prio: 'P1', plataforma: 'Fexô', cor: 'lime',
      titulo: 'Pagou a consultoria 1:1',
      quem: 'Escolheu comprar à vista na Fexô e pagou o agendamento da consultoria individual com o especialista.',
      objetivo: 'Confirmação e qualificação. Colete as informações que o Closer vai usar no fechamento e garanta o comparecimento.',
      destino: 'Assessoria de leilão (moradia ou investimento)',
      aulas: [1, 2, 3],
      whatsapp: 'Oi {lead}, aqui é {sdr}, do time do Paulinho dos Leilões. Vi que você agendou a sua consultoria individual pela Fexô. Vou te ligar rapidinho para confirmar o horário e já deixar o especialista preparado para o seu caso, combinado?',
      abertura: 'Fala, {lead}! Bom dia, tudo bom? Eu sou {sdr}, do time do Paulinho dos Leilões, e vi que você agendou a sua consultoria com o nosso especialista, correto?',
      direcao: 'Seguinte: para o especialista já chegar preparado para o seu caso, eu vou te fazer algumas perguntas rápidas. Pode ser?',
      spin: {
        S: ['Onde o seu dinheiro está investido hoje e quanto disso está investido em imóveis?', 'Você já teve alguma experiência com leilões? Como foi?', 'Quanto de capital você tem disponível, ou consegue mobilizar, para essa compra nos próximos 12 meses?'],
        P: ['Quando você pensa em leilão, qual é o seu maior medo: perder dinheiro ou não saber por onde começar?', 'Quando aparece uma oportunidade, você consegue dizer com segurança se é um bom negócio ou depende da opinião de outras pessoas?'],
        I: ['Deixa eu te perguntar: se você tentar sozinho e der errado, qual seria o impacto disso no seu caixa e na sua família?'],
        N: ['Quanto valeria para você ter alguém experiente revisando cada decisão antes de você colocar o seu dinheiro?']
      },
      fechamento: { tipo: 'confirmacao',
        resumo: 'Então, se eu entendi bem, você tem [capital] para comprar [objetivo] e o que mais te preocupa é [dor]. É isso?',
        proposta: 'Perfeito, então está confirmado: {data} às {horario}, com o {esp}. Vou criar um grupo aqui no WhatsApp com você, comigo e com o especialista para te mandar alguns materiais até lá.',
        compromisso: 'E se fizer sentido na conversa com o especialista, você está em condições de começar ainda este mês?' }
    },
    {
      slug: 'origem-canaw-agendou', prio: 'P1', plataforma: 'Canaw', cor: 'red',
      titulo: 'Viu o evento e agendou',
      quem: 'Participou do evento (webinário) do especialista na Canaw e fez o agendamento da consultoria.',
      objetivo: 'Confirmação e qualificação. Recolha mais informações para o Closer e garanta o comparecimento.',
      destino: 'Mentoria do especialista (ou serviço)',
      aulas: [1, 2, 3],
      whatsapp: 'Oi {lead}, aqui é {sdr}, do time do {esp}. Vi que você participou do evento na Canaw e agendou a sua sessão. Vou te ligar rapidinho para confirmar e entender o seu momento, tudo bem?',
      abertura: 'Fala, {lead}! Bom dia, tudo bom? Eu sou {sdr}, do time do {esp}, e vi que você assistiu ao evento na Canaw e agendou a sua sessão, correto?',
      direcao: 'Que bom! Para a sua sessão render ao máximo, eu vou te fazer algumas perguntas rápidas. Pode ser?',
      spin: {
        S: ['Qual meta de patrimônio ou de renda mensal você quer atingir, e em quanto tempo?', 'Quanto tempo por semana você consegue dedicar de verdade a isso? Pode ser sincero comigo.'],
        P: ['O que te impediu até hoje de atingir esse objetivo?', 'Você já deixou alguma oportunidade passar por insegurança ou falta de conhecimento? O que aconteceu depois?'],
        I: ['O que acontece com a meta que você me falou se você levar mais 5 anos tentando aprender na tentativa e erro?'],
        N: ['Se você tivesse um método validado para chegar nesse objetivo com segurança, o que mudaria na sua vida?']
      },
      fechamento: { tipo: 'confirmacao',
        resumo: 'Então, se eu entendi bem, você quer [meta] em [prazo] e hoje o que te trava é [dor]. É isso?',
        proposta: 'Perfeito, a sua sessão com o {esp} está confirmada para {data} às {horario}. Vou criar um grupo aqui no WhatsApp com você, comigo e com o especialista.',
        compromisso: 'E se fizer sentido na conversa com o especialista, você está em condições de começar ainda este mês?' }
    },
    {
      slug: 'origem-lt-comprou', prio: 'P2', plataforma: 'Low ticket', cor: 'violet',
      titulo: 'Comprou o low ticket',
      quem: 'Comprou um produto de entrada do especialista e foi para a área de membros.',
      objetivo: 'Qualificar e levar para a reunião com o Closer (sessão diagnóstica).',
      destino: 'Mentoria: Leilão PRO, Investidor Imobiliário ou Milionário com Loteamento',
      aulas: [2, 4],
      whatsapp: 'Oi {lead}, aqui é {sdr}, do time do Paulinho dos Leilões. Vi que você garantiu o {produto}, parabéns! Posso te ligar 2 minutinhos para entender o seu objetivo?',
      abertura: 'Fala, {lead}! Bom dia, tudo bom? Eu sou {sdr}, do time do Paulinho dos Leilões, e vi que você adquiriu um dos nossos produtos, o {produto}, correto?',
      direcao: null,
      spin: {
        S: ['Onde o seu dinheiro está investido hoje e quanto disso está investido em imóveis?', 'Você já teve alguma experiência com leilões? Como foi?', 'Qual meta de patrimônio ou de renda mensal você quer atingir, e em quanto tempo?'],
        P: ['O que te impediu até hoje de atingir o seu objetivo de investir nos leilões?', 'Você sente que o seu dinheiro está rendendo o que poderia render hoje?'],
        I: ['Se nada mudar nos próximos três anos, onde vai estar o seu patrimônio e quanto você terá deixado na mesa? Você já parou para fazer essa conta?'],
        N: ['Na sua visão, o que precisaria existir numa solução para você se sentir seguro para começar agora?', 'Para eu entender se consigo te levar para o nosso especialista: isso é algo que você acredita que pode alcançar, ou você já vê como uma necessidade?']
      },
      fechamento: { tipo: 'agendar',
        resumo: 'Então, se eu entendi bem, você tem [capital] parado rendendo [onde] e tem medo de [dor]. É isso?',
        proposta: '{lead}, amanhã, na agenda do meu especialista, eu tenho dois horários: às [10h] e às [17h]. Qual deles fica melhor para você?',
        compromisso: 'Se fizer sentido na conversa com o meu especialista, você está em condições de começar ainda este mês?' }
    },
    {
      slug: 'origem-lt-iniciou', prio: 'P3', plataforma: 'Low ticket', cor: 'violet',
      titulo: 'Iniciou a compra e não concluiu',
      quem: 'Começou o checkout do produto de entrada e não finalizou.',
      objetivo: 'Recuperar pela ligação: entender se tem perfil e, se tiver, levar para a reunião.',
      destino: 'Reunião com o Closer (mentoria)',
      aulas: [2, 4],
      whatsapp: 'Oi {lead}, aqui é {sdr}, do time do Paulinho dos Leilões. Vi que você começou a garantir o {produto} e não finalizou. Ficou alguma dúvida? Posso te ligar rapidinho?',
      abertura: 'Fala, {lead}! Bom dia, tudo bom? Eu sou {sdr}, do time do Paulinho dos Leilões. Vi que você começou a garantir o {produto}, mas não finalizou. Aconteceu alguma coisa?',
      direcao: 'Entendi. Para eu te ajudar da melhor forma, deixa eu entender o seu momento com algumas perguntas rápidas. Pode ser?',
      spin: {
        S: ['O que te fez se interessar pelo mercado de leilões agora?', 'Quanto de capital você tem disponível, ou consegue mobilizar, nos próximos 12 meses?', 'Quanto tempo por semana você consegue dedicar de verdade a isso?'],
        P: ['Quando você pensa em leilão, qual é o seu maior medo: perder dinheiro ou não saber por onde começar?'],
        I: ['Enquanto você espera o momento certo, outras pessoas estão fechando os melhores negócios. Como você se sente com isso?'],
        N: ['Se você tivesse um método validado para investir em leilões com segurança, o que mudaria na sua vida?']
      },
      fechamento: { tipo: 'agendar',
        resumo: 'Então, se eu entendi bem, você quer [objetivo], tem [capital] e o que te segura hoje é [dor]. É isso?',
        proposta: 'Faz todo sentido você conversar com o nosso especialista. Amanhã eu tenho dois horários: às [10h] e às [17h]. Qual fica melhor para você?',
        compromisso: 'Se fizer sentido na conversa com o meu especialista, você está em condições de começar ainda este mês?' }
    },
    {
      slug: 'origem-fexo-score', prio: 'P4', plataforma: 'Fexô', cor: 'lime',
      titulo: 'Score de crédito alto',
      quem: 'Fez a estimativa de financiamento na Fexô e o CRM sinalizou score alto: grande potencial de conseguir o financiamento.',
      objetivo: 'Qualificação completa. Traga o lead para perto e leve para a reunião da assessoria. A maioria de quem financia quer o imóvel para morar.',
      destino: 'Assessoria (acompanhar a compra do imóvel)',
      aulas: [1, 2, 4],
      aviso: 'Nunca prometa aprovação. A Fexô não é instituição financeira: quem aprova o crédito é o banco.',
      whatsapp: 'Oi {lead}, aqui é {sdr}, do time do Paulinho dos Leilões. Vi a sua estimativa de financiamento na Fexô e o seu perfil tem um bom potencial. Posso te ligar para explicar os próximos passos?',
      abertura: 'Fala, {lead}! Bom dia, tudo bom? Eu sou {sdr}, do time do Paulinho dos Leilões, e vi que você fez a estimativa de financiamento na Fexô para comprar o seu imóvel, correto?',
      direcao: 'Analisando o seu perfil, você tem um bom potencial para seguir com o financiamento. Para eu entender se a nossa assessoria pode te acompanhar nessa compra, vou te fazer algumas perguntas. Pode ser?',
      spin: {
        S: ['Esse imóvel é para você morar ou para investir?', 'Qual meta você tem para essa compra, e em quanto tempo quer resolver isso?'],
        P: ['O aluguel que você paga hoje, você acredita que poderia ser melhor investido dentro de um imóvel que realmente seja seu?', 'Quando você pensa em comprar em leilão, qual é o seu maior medo?'],
        I: ['Enquanto você espera o momento certo para ter o seu imóvel próprio, outras pessoas estão comprando com condições muito boas, construindo patrimônio e saindo do aluguel. Como você se sente com isso?'],
        N: ['Na sua visão, o que precisaria existir numa solução para você se sentir seguro para começar agora?']
      },
      fechamento: { tipo: 'agendar',
        resumo: 'Então, se eu entendi bem, você quer sair do aluguel com [imóvel], tem bom potencial de financiamento e o que te preocupa é [dor]. É isso?',
        proposta: '{lead}, amanhã eu tenho dois horários com o nosso especialista em assessoria: às [10h] e às [17h]. Qual deles fica melhor para você?',
        compromisso: 'Se fizer sentido na conversa com o especialista, você está em condições de começar ainda este mês?' }
    },
    {
      slug: 'origem-canaw-nao-agendou', prio: 'P5', plataforma: 'Canaw', cor: 'red',
      titulo: 'Viu o evento e não agendou',
      quem: 'Participou do evento (webinário) do especialista na Canaw, mas não fez o agendamento.',
      objetivo: 'Pré-recuperação: qualificar e enviar para a reunião com o Closer.',
      destino: 'Reunião com o Closer (mentoria ou serviço)',
      aulas: [1, 2, 4],
      whatsapp: 'Oi {lead}, aqui é {sdr}, do time do {esp}. Vi que você assistiu ao evento na Canaw. O que mais fez sentido para você?',
      abertura: 'Fala, {lead}! Bom dia, tudo bom? Eu sou {sdr}, do time do {esp}, e vi que você assistiu ao evento na Canaw. O que mais chamou a sua atenção?',
      direcao: 'Bacana. Para eu entender se faz sentido você conversar com o nosso especialista, vou te fazer algumas perguntas rápidas. Pode ser?',
      spin: {
        S: ['Você já atua de alguma forma no mercado imobiliário hoje?', 'Qual meta de patrimônio ou de renda mensal você quer atingir, e em quanto tempo?'],
        P: ['Você está satisfeito com o modelo de atuação que você tem hoje?', 'O que te impediu até hoje de chegar nesse objetivo?'],
        I: ['Enquanto você espera o momento certo, outras pessoas já estão migrando para o mercado de leilões, fazendo assessorias e ganhando dinheiro. Como você se sente com isso?'],
        N: ['Para eu entender se consigo te levar para o nosso especialista: isso é algo que você acredita que pode alcançar, ou você já vê como uma necessidade?']
      },
      fechamento: { tipo: 'agendar',
        resumo: 'Então, se eu entendi bem, você quer [objetivo] e hoje o que te trava é [dor]. É isso?',
        proposta: 'Faz sentido você conversar com o {esp}. Amanhã eu tenho dois horários: às [10h] e às [17h]. Qual fica melhor para você?',
        compromisso: 'Se fizer sentido na conversa com o especialista, você está em condições de começar ainda este mês?' }
    }
  ],

  /* -------------------------------------------- COMPARECIMENTO (aula 3) */
  comparecimento: [
    ['Ao criar o grupo', '{lead}, criei este grupo para a sua sessão com o {esp} em {data} às {horario}. Estamos aqui eu ({sdr}), o especialista e você. Qualquer dúvida até lá, é só chamar.'],
    ['24h antes', 'Amanhã às {horario} é a sua sessão com o {esp}. Separei este material para você já chegar com contexto: [material].'],
    ['12h antes', 'Para a sessão de amanhã, anote as duas dúvidas que mais te travam hoje. O especialista vai trabalhar em cima delas.'],
    ['6h antes', 'Hoje às {horario}! Vale ouvir este podcast do Paulinho antes da sessão: [link do podcast].'],
    ['1h antes', 'Daqui a 1 hora a gente se fala. Link da sala: [link].'],
    ['15 min antes', 'Em 15 minutos começamos. Já pode entrar: [link].']
  ],

  /* ---------------------------------------------------- SPIN (aula 4) */
  spin: {
    S: { nome: 'Situação', meta: 'Mapear o cenário atual. Use 2 ou 3 perguntas e pesquise o lead antes: perguntas demais nessa etapa cansam.',
      perguntas: [
        ['todos', 'Onde o seu dinheiro está investido hoje e quanto disso está investido em imóveis?'],
        ['todos', 'Você já teve alguma experiência com leilões? Como foi?'],
        ['todos', 'Quanto de capital você tem disponível, ou consegue mobilizar, para os leilões nos próximos 12 meses?'],
        ['todos', 'Quanto tempo por semana você consegue se dedicar a isso? De verdade. Pode ser sincero comigo.'],
        ['todos', 'Qual meta de patrimônio ou de renda mensal você quer atingir, e em quanto tempo?']] },
    P: { nome: 'Problema', meta: 'Fazer a dor aparecer: falta de conhecimento, medo de um risco específico, o maior medo do mercado.',
      perguntas: [
        ['investimento', 'O que te impediu até hoje de atingir o seu objetivo de investir nos leilões?'],
        ['investimento', 'Quando você pensa em leilão, qual é o seu maior medo: perder dinheiro ou não saber por onde começar?'],
        ['investimento', 'Quando aparece uma oportunidade, você consegue dizer com segurança se é um bom negócio ou depende da opinião de outras pessoas?'],
        ['investimento', 'Você sente que o seu dinheiro está rendendo o que poderia render hoje?'],
        ['todos', 'Você já deixou alguma oportunidade passar por insegurança ou falta de conhecimento? O que aconteceu depois?'],
        ['profissao', 'Você está satisfeito com o modelo de atuação que você tem hoje?'],
        ['moradia', 'O aluguel que você paga hoje, você acredita que poderia ser melhor investido dentro de um imóvel que realmente seja seu?']] },
    I: { nome: 'Implicação', meta: 'Colocar o dedo na ferida: o custo de não agir. É aqui que a venda acontece. Use números.',
      perguntas: [
        ['investimento', 'Se nada mudar nos próximos três anos, onde vai estar o seu patrimônio e quanto você terá deixado na mesa? Você já parou para fazer essa conta?'],
        ['todos', 'Se você tentar sozinho e der errado, qual seria o impacto disso no seu caixa e na sua família?'],
        ['todos', 'O que acontece com a meta que você me falou se você levar mais 5 anos tentando aprender na tentativa e erro?'],
        ['investimento', 'Enquanto você espera o momento certo, outras pessoas estão fechando os melhores negócios. Como você se sente com isso?'],
        ['profissao', 'Enquanto você espera o momento certo, outras pessoas já estão migrando para o mercado de leilões, fazendo assessorias e ganhando dinheiro. Como você se sente com isso?'],
        ['moradia', 'Enquanto você espera o momento certo para ter o seu imóvel próprio, outras pessoas estão comprando com condições muito boas e saindo do aluguel. Como você se sente com isso?']] },
    N: { nome: 'Necessidades', meta: 'Quem expõe a necessidade é o cliente, não você.',
      perguntas: [
        ['todos', 'Se você tivesse um método validado para investir em leilões com segurança, o que mudaria na sua vida?'],
        ['todos', 'Quanto valeria para você ter alguém experiente revisando cada decisão antes de você colocar o seu dinheiro?'],
        ['investimento', 'Se você conquistasse o resultado que você busca nos próximos meses, o que faria com esse lucro?'],
        ['investimento', 'Como seria a sua rotina com uma renda imobiliária que cobrisse os seus custos fixos todos os meses?'],
        ['todos', 'Na sua visão, o que precisaria existir numa solução para você se sentir seguro para começar agora?'],
        ['todos', 'Para eu entender se consigo te levar para o nosso especialista: isso é algo que você acredita que pode alcançar, ou você já vê como uma necessidade?']] }
  },
  postura: [
    ['Consultor, não vendedor', 'Você está avaliando se ele tem perfil, não implorando para ele entrar.'],
    ['Desqualificar é um bom resultado', 'Lead sem perfil passado adiante queima a agenda do Closer e derruba a conversão.'],
    ['Energia e tom', 'Ligue sorrindo e com ritmo. O lead sente pelo telefone.'],
    ['Espelhamento', 'Se ele é analítico, vá devagar e com dados. Se é acelerado, seja direto.']
  ],
  implicacaoNumeros: 'Um imóvel com 40% de desconto num ticket de R$ 300 mil são R$ 120 mil que ficaram na mesa.',

  /* ------------------------------------------------ CADÊNCIA (aula 5) */
  cadencia: [
    { fase: 'Fase 1 · Repescagem', cor: 'amber', toques: [
      ['D7', 'Porta aberta', 'WhatsApp', 'Fala, {lead}! Passando rápido para entender se ainda faz sentido conversarmos sobre o seu interesse no mercado de leilões. Se sim ou se não, me responde aqui, que eu tenho uma novidade para você.', 'Resposta de 1 toque, sem esforço para o lead.'],
      ['D10', 'Troca de canal', 'Ligação + áudio', '{lead}, aqui é {sdr}, SDR do time do Paulinho. Eu tentei te ligar agora e vi que você busca entender um pouco mais sobre o mercado de leilões. Quando puder, me responde aqui que eu te explico em dois minutos.', 'Uma ligação. Não atendeu? Mande este áudio de ~20 s. A voz humaniza.']]},
    { fase: 'Fase 2 · Nutrição', cor: 'blue', toques: [
      ['D14', 'Case', 'WhatsApp', '{lead}, lembrei de você, que estava pesquisando sobre os leilões. Tem um caso muito parecido com as informações que você me mandou no formulário. Posso te mostrar como funcionou o caso desse cliente?', 'Não pede reunião. Só entrega valor.'],
      ['D21', 'Insight', 'WhatsApp ou e-mail', 'Um dado muito comum de quem atua no mercado de leilão é que a desocupação é algo que preocupa muito. Isso acontece com você também?', '1 ideia, 2 a 3 linhas, uma pergunta aberta.'],
      ['D30', 'Gatilho', 'WhatsApp', '{lead}, novidade: [novidade concreta do mercado ou da agenda]. Abri 2 horários nesta semana para conversar sobre isso. Fica melhor às 10h ou às 15h?', 'Motivo novo + escolha fechada entre 2 opções.']]},
    { fase: 'Fase 3 · Longo prazo', cor: 'violet', toques: [
      ['D45', 'Check-in de momento', 'WhatsApp', '{lead}, mudou alguma coisa desde quando você preencheu o nosso formulário? Entender sobre leilões ainda é uma prioridade?', 'O timing do lead pode ter mudado.'],
      ['D60', 'Material + convite leve', 'E-mail ou WhatsApp', '{lead}, veja só este podcast do Paulinho, em que ele explica como foi a arrematação de um dos alunos, num imóvel 95% financiado. [link]', 'Conteúdo útil. Se quiser aplicar no caso dele, convide para uma conversa.'],
      ['D90', 'Último toque', 'WhatsApp', '{lead}, eu vou encerrar o nosso atendimento aqui para não te incomodar. Se mudar de ideia, é só me mandar um oi que eu te retorno.', 'Arquive no CRM como "Perdido · sem resposta".']]}
  ],
  respostas: [
    ['Quero / tenho interesse', 'lime', 'Volta para o fluxo principal: qualificação → agendamento da reunião.'],
    ['Agora não', 'amber', 'Pergunte "Quando faz mais sentido eu te chamar?" e agende o follow-up na data que ele disser.'],
    ['Não tenho interesse', 'red', 'Agradeça, faça uma pergunta só sobre o motivo, marque "Perdido · motivo" e encerre.'],
    ['Pare de mandar', 'red', 'Opt-out imediato. Confirme e nunca mais contate esse número.'],
    ['Respondeu e sumiu', 'muted', 'Entra na mini-cadência anti-ghosting.']
  ],
  antiGhosting: [
    ['+24h', 'Retomar contexto', '{lead}, ficou alguma dúvida sobre aquele último ponto que eu te falei?'],
    ['+48h', 'Pergunta fácil', 'Deixa eu entender, {lead}: ainda é uma prioridade para você resolver isso ainda este mês?'],
    ['+4 dias', 'Break-up leve', 'Imagino que a rotina apertou. Vou deixar em pausa; se quiser retomar, é só me chamar.'],
    ['Sem resposta', 'Volta para a nutrição', 'Pula a repescagem e entra direto no D14, porque ele já conhece a conversa.']
  ],
  regrasReativacao: ['1 mensagem por toque. Nunca 2 seguidas sem resposta.', 'Todo toque traz um motivo novo. Proibido "só passando para saber".', 'Use o contexto do formulário e da conversa anterior.',
    'Horários: segunda a sexta, 9h–11h e 14h–17h.', 'Varie o canal: texto, áudio, ligação, e-mail.', 'Respeite o opt-out na hora, sem exceção.', 'Volume baixo por número, para não ser bloqueado.', 'Registre cada toque e cada resposta no CRM.'],

  /* -------------------------------------------------- ROTINA (aula 6) */
  rotina: [
    ['08:30', '09:00', 'Planejamento', 'plan', 'Revisar as metas do dia, alinhar CRM e agenda, priorizar leads quentes e retornos.'],
    ['09:00', '09:30', 'Follow-up · mensagens', 'msg', 'Mensagens de ativação no WhatsApp para todos que precisam do seu retorno.'],
    ['09:30', '11:30', 'Bloco de ligações 1', 'call', 'Inegociável. Celular no silencioso, sem notificações, foco no resultado.'],
    ['11:30', '12:00', 'CRM + agendamentos', 'crm', 'Registrar ligações, confirmar reuniões, passar leads qualificados ao Closer.'],
    ['12:00', '14:00', 'Almoço', 'pause', 'Desconectar de verdade.'],
    ['14:00', '14:30', 'Follow-up · ligações', 'fu', 'Retornos combinados, quem não atendeu, quem está perto de agendar, reagendamentos.'],
    ['14:30', '16:00', 'Bloco de ligações 2', 'call', 'Inegociável. Foco exclusivo em ligações.'],
    ['16:00', '16:20', 'Café da tarde', 'pause', 'Pausa curta: recarregar e manter a energia alta.'],
    ['16:20', '17:15', 'Bloco de ligações 3', 'call', 'Inegociável. Mais uma hora focada em executar.'],
    ['17:15', '18:00', 'Preparação do dia seguinte', 'plan', 'Revisar leads, completar informações, montar a lista de amanhã. CRM 100% alinhado.']
  ],
  metas: [['ligacoes', 'Ligações atendidas', 20], ['conversas', 'Conversas efetivas', 15], ['followups', 'Follow-ups por mensagem', 30], ['agendamentos', 'Agendamentos', 4]],
  regrasDia: ['Ligue nos blocos, sem multitarefa.', 'Lista pronta antes do bloco de ligações.', 'Registre tudo no CRM na hora.', 'Melhores horários: 9h–11h30 e 14h–16h.',
    'Sempre marque o próximo passo com o cliente.', 'Revisão de métricas toda sexta-feira.', 'Treino de objeções todos os dias.'],

  /* ------------------------------------------------- NEKTA CRM (aula 3) */
  crm: {
    fluxo: [
      ['Base de nutrição', 'Todo lead da Fexô, da Canaw e do low ticket chega aqui. Use os filtros: situação, qualificação, origem, urgência, valor disponível, pagamento, responsável, entrada e região.'],
      ['Assuma o lead', 'Identifique a origem e defina você como responsável.'],
      ['Primeira abordagem em até 5 minutos', 'Clique em Abordar: o WhatsApp abre com a mensagem pronta. Lead aquecido + velocidade = boa qualificação.'],
      ['Pipeline', 'Ao abordar, o lead entra na sua pipeline. Arraste o card conforme ele avança.'],
      ['Respondeu ou não: ligue', 'Respondeu? Ligue na hora. Não respondeu em 5 minutos? Ligue mesmo assim.'],
      ['Ligação de qualificação (SPIN)', 'Situação → Problema → Implicação → Necessidades.'],
      ['Agendou', 'Marque na agenda do CRM e preencha o contexto do pré-vendas.'],
      ['Não agendou', 'Mova para desqualificado. Nós decidimos se faz sentido ele estar conosco.'],
      ['Comparecimento', 'Crie o grupo (SDR + Closer + cliente) e mande as mensagens até a reunião.']
    ],
    etapas: ['Aguardando contato', 'Contato iniciado', 'Em conversa', 'Qualificado', 'Reunião agendada', 'Em negociação', 'Venda realizada', 'Banco de investidores', 'Follow-ups'],
    contexto: ['Data, início e fim da reunião', 'Temperatura do lead', 'Urgência ou prazo', 'Faixa de investimento', 'Objetivo declarado', 'Dor, trava ou objeção percebida', 'Informações importantes da conversa'],
    posLigacao: ['Dor', 'Capital', 'Prazo', 'Decisor', 'Frases-chave do lead'],
    papel: 'O papel do pré-vendedor é colher informações, descartar quem ainda não está pronto e garantir que o Closer tenha tudo para fazer um bom atendimento. Venda a reunião ao cliente.'
  }
};
