# Esteira de produtos e fluxograma de ascensão

A ficha completa de cada produto, com os onze campos (perfil, momento, problema, transformação, entregáveis, argumento, qualificação, objeções, prontidão, próxima ascensão), está no Módulo 03 e no Módulo 05 da interface (`index.html`). Aqui ficam a visão de conjunto e os fluxogramas.

## Esteira

```mermaid
flowchart LR
  subgraph Corretor
    F["50 Fichas de Pré-Análise<br/>R$ 37"] --> ID["Intensivo: geração de demanda<br/>R$ 997"] --> A["Assessor de Investimentos Imobiliários<br/>R$ 2.997"]
  end
  subgraph PF_credito["Pessoa física · crédito"]
    P["O Planner do Autônomo<br/>preço pendente"] --> IF["Intensivo: finanças para o financiamento<br/>R$ 997"]
  end
  subgraph PF_investidor["Pessoa física · investidor"]
    B["Biblioteca Investidor Imobiliário<br/>preço pendente"] --> IO["Intensivo: Operações Imobiliárias<br/>R$ 997"]
  end
  IF --> M["Mentoria / comunidade Investidor Imobiliário<br/>R$ 2.997"]
  IO --> M
  M -->|prepara para entrar| S(("SCP<br/>objetivo final"))
  A -.->|futuro: capta pessoas| S
  W["Webinário gravado<br/>(em avaliação)"] -.-> ID
  W -.-> IF
  W -.-> IO
```

Fora desta versão: 50 Projetos de Casas Populares (“o do Stefano”) e o perfil Assessor de Investimentos, que ainda não tem low ticket.

## Fluxo de ascensão

```mermaid
flowchart TD
  E["Entrada do cliente<br/>compra de um low ticket"] --> I["Identificação do perfil<br/>corretor · PF crédito · PF investidor"]
  I --> D["Diagnóstico<br/>usou o material? qual a dor de agora? pensa em investir?"]
  D --> AT["Etapa atual<br/>convite ao intensivo de R$ 997 da trilha"]
  AT --> V["Acompanhamento e entrega de valor<br/>tempo de tela com a equipe no intensivo"]
  V --> N["Identificação de nova necessidade<br/>plantar a ideia do próximo nível"]
  N --> Q{"Qualificado?<br/>tem perfil · já pensa nisso · tem capital"}
  Q -- sim --> O["Apresentação da próxima oferta<br/>Mentoria ou Assessor · R$ 2.997"]
  Q -- ainda não --> V
  O --> C["Conversão<br/>condições pendentes de definição"]
  C --> NJ["Nova etapa da jornada<br/>mentoria prepara para a SCP · assessores captam para a SCP"]
```

Passos 1, 2, 4, 5, 6, 7, 8 e 10 têm base no vídeo. O passo 3 (diagnóstico) é sugestão: o vídeo só diz que “os especialistas vão conseguir conduzir melhor as dores dele”. O passo 9 (conversão) está pendente.

## Princípio

A ascensão acompanha a maturidade do cliente. O vídeo usa o verbo “plantar”: a equipe alinha quem “já pensa nisso” e prepara a pessoa para o próximo nível, “às vezes começando devagar”. Quem ainda não tem perfil continua recebendo valor no degrau em que está.
