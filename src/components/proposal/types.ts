export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string | null;
  category: "gestao" | "juridico" | "administrativo";
}

export interface ArgumentRow {
  id: string;
  argumento: string;
  fundamento: string;
  observacao: string;
}

export interface ProposalData {
  clientName: string;
  coverSubtitle: string;

  // Page 2 - Diagnóstico
  diagnosticoTitle: string;
  diagnosticoGreeting: string;
  diagnosticoIntro: string;
  diagnosticoBody: string;
  diagnosticoJurisprudencia: string;
  diagnosticoConclusao: string;

  // Page 3-6 - Estratégia
  estrategiaIntro: string;
  movimento1Title: string;
  movimento1Intro: string;
  movimento1Item1: string;
  movimento1Item2: string;
  movimento1Item3: string;
  movimento1Resultado: string;
  movimento2Title: string;
  movimento2Consignacao: string;
  movimento2Obrigacao: string;
  movimento2Pedidos: string;
  movimento2Observacoes: string;
  movimento3Title: string;
  movimento3Body: string;

  // Page 7 - Argumentos
  argumentos: ArgumentRow[];

  // Page 8 - Sobre
  sobreTitle: string;
  sobreText1: string;
  sobreText2: string;
  sobreText3: string;

  // Page 9 - Equipe
  team: TeamMember[];

  // Page 11 - Investimento
  honorarioAntecipado1: string;
  honorarioAntecipado1Desc: string;
  honorarioAntecipado2: string;
  honorarioAntecipado2Desc: string;
  honorarioExito1: string;
  honorarioExito2: string;
  parcelamento: string;
  validadeProposta: string;

  // Page 12 - Fechamento
  fechamentoSteps: string[];
  fechamentoCTA: string;

  // Page 13 - Contato
  telefone: string;
  instagram1: string;
  instagram2: string;
  website: string;
  contatoTexto: string;
  contatoSlogan: string;

  // Settings
  textSize: "small" | "medium" | "large";
  visibleSections: Record<string, boolean>;
}

export const defaultProposalData: ProposalData = {
  clientName: "Luciano Moraes Bernardes",
  coverSubtitle: "PAIVA NUNES\nDireito Imobiliário",

  diagnosticoTitle: "1. APRESENTAÇÃO E DIAGNÓSTICO GERAL",
  diagnosticoGreeting: "Prezado Sr. Luciano,",
  diagnosticoIntro:
    "Realizamos análise jurídica completa da Notificação Extrajudicial de Resolução Contratual recebida em 01/04/2026. Nosso parecer identifica fundamentos jurídicos relevantes que merecem ser considerados na defesa de seus interesses e na avaliação das opções disponíveis.",
  diagnosticoBody:
    "Diagnóstico: A notificação apresenta vulnerabilidades jurídicas significativas que justificam uma resposta fundamentada. Você já pagou R$ 97.000,00 em arras e vem mantendo regularmente o pagamento das parcelas do financiamento (aproximadamente R$ 7.300,00 mensais). O atraso de aproximadamente 33 dias na quitação final do saldo, considerando o volume já investido, levanta questões legítimas sobre a proporcionalidade da rescisão pretendida.",
  diagnosticoJurisprudencia:
    "A análise jurisprudencial recente do Superior Tribunal de Justiça (2021, 2022, 2023) aponta para entendimentos que podem ser relevantes à sua defesa, particularmente quanto à purga da mora, ao adimplemento substancial e à redução equitativa de penalidades. Além disso, os elementos probatórios que você forneceu (áudios, comprovantes de pagamento) merecem ser considerados na avaliação da conduta das partes durante a execução do contrato.",
  diagnosticoConclusao:
    "Conclusão do diagnóstico: Sua posição jurídica apresenta argumentos defensáveis e merece ser adequadamente fundamentada perante os vendedores e, se necessário, perante o Poder Judiciário. Não há, contudo, garantias de êxito em qualquer demanda judicial, sendo recomendável avaliar cuidadosamente os riscos, custos e benefícios de cada estratégia.",

  estrategiaIntro:
    "Propomos uma estratégia de defesa estruturada em três movimentos jurídicos sequenciais, cada um permitindo avaliação dos resultados antes de prosseguir para a etapa seguinte:",
  movimento1Title: "Movimento 1: Contranotificação Extrajudicial (Prazo recomendado: 5-7 dias)",
  movimento1Intro:
    "Enviaremos contranotificação formal aos vendedores, apresentando os fundamentos jurídicos que sustentam sua posição defensiva:",
  movimento1Item1:
    "Purga da Mora Viável — A legislação civil (Lei 9.514/1997, alterada pela Lei 13.465/2017) e a jurisprudência do STJ indicam que o devedor mantém o direito de sanar o inadimplemento enquanto a propriedade não for consolidada em nome do credor fiduciário. Como a propriedade permanece em nome dos vendedores, você pode quitar o saldo devedor junto à CEF. Este argumento encontra respaldo em decisão do STJ de 11/05/2023.",
  movimento1Item2:
    "Adimplemento Substancial — A jurisprudência reconhece que a resolução contratual deve ser proporcional ao inadimplemento verificado. Você cumpriu expressivamente o contrato: pagou as arras, mantém as parcelas em dia, e apenas faltam formalidades finais. O STJ consolidou entendimento (2022) de que a resolução é medida extrema quando há cumprimento substancial. Este argumento merece ser considerado na avaliação da proporcionalidade da rescisão.",
  movimento1Item3:
    "Elementos de Má-Fé Contratual — Os áudios que você nos forneceu indicam que a Sra. Vanessa estava anunciando o imóvel em imobiliárias locais antes da formalização da rescisão. Esse comportamento pode ser relevante para avaliar se houve violação aos princípios de boa-fé objetiva (arts. 187 e 422 do Código Civil).",
  movimento1Resultado:
    "Resultado esperado: A contranotificação bem fundamentada pode motivar os vendedores a reconsiderar sua posição, abrir negociação ou reconhecer a viabilidade de purga da mora. Não há garantia de que os vendedores responderão favoravelmente, mas esta etapa permite testar a receptividade deles a uma solução consensual.",
  movimento2Title:
    "Movimento 2: Ação Judicial de Consignação em Pagamento c/c Obrigação de Fazer (Prazo estimado: 3-6 meses)",
  movimento2Consignacao:
    "Depositar judicialmente o valor necessário para quitar o financiamento junto à CEF, demonstrando sua disposição em cumprir as obrigações contratuais.",
  movimento2Obrigacao:
    "Requerer que os vendedores outorguem a escritura pública de compra e venda e renovem a procuração necessária para a transferência registral.",
  movimento2Pedidos:
    "Conforme apropriado, requerer indenização por danos decorrentes da tentativa de rescisão.",
  movimento2Observacoes:
    "A ação judicial envolve custos, prazos processuais e incertezas inerentes ao sistema judiciário. O resultado dependerá da apreciação do juiz sobre os fatos e a aplicação da lei ao caso concreto. A jurisprudência favorável que identificamos não garante resultado específico em seu caso.",
  movimento3Title:
    "Movimento 3: Medida Cautelar de Manutenção de Posse (Simultânea ao Movimento 2, se necessário)",
  movimento3Body:
    "Caso haja risco concreto de ação de reintegração de posse, recomendamos requerer medida cautelar para assegurar sua permanência no imóvel durante o trâmite da ação principal. Esta medida pode ser requerida quando há contrato válido e posse mansa e pacífica, ambas presentes em seu caso. A concessão dessa medida dependerá da apreciação do juiz sobre a probabilidade do direito invocado e o risco de dano irreparável.",

  argumentos: [
    {
      id: "1",
      argumento: "Purga da Mora Viável",
      fundamento: "Lei 9.514/1997 + Lei 13.465/2017 + STJ 11/05/2023",
      observacao: "Argumento relevante enquanto propriedade não consolidada",
    },
    {
      id: "2",
      argumento: "Adimplemento Substancial",
      fundamento: "CC art. 422 + STJ 2022",
      observacao: "Merece consideração na avaliação da proporcionalidade",
    },
    {
      id: "3",
      argumento: "Elementos de Má-Fé",
      fundamento: "CC arts. 187 e 422 + Áudios",
      observacao: "Requer apreciação judicial",
    },
    {
      id: "4",
      argumento: "Redução de Cláusula Penal",
      fundamento: "CC art. 413 + STJ 24/05/2021",
      observacao: "Possível se houver condenação em penalidade",
    },
    {
      id: "5",
      argumento: "Enriquecimento Sem Causa",
      fundamento: "CC art. 884",
      observacao: "Argumento complementar",
    },
  ],

  sobreTitle: "SOBRE A PAIVA NUNES",
  sobreText1:
    "A Paiva Nunes Advogados atua há mais de 20 anos no Direito Imobiliário, com uma equipe altamente qualificada e pós-graduada na área. O escritório possui ampla experiência em incorporações imobiliárias e na assessoria a associações de consumidores adquirentes de imóveis, atualmente atendendo 18 instituições sem fins lucrativos e defendendo os direitos de mais de 1.700 associados em empreendimentos que envolvem cerca de 100 mil consumidores lesados.",
  sobreText2:
    "Reconhecida pela excelência, a Paiva Nunes foi destaque entre os Escritórios de Direito Imobiliário Mais Admirados do Rio Grande do Sul nos anos de 2020, 2021 e 2024, segundo o Anuário Análise Advocacia.",
  sobreText3:
    "Escolher a Paiva Nunes Advogados é optar por um escritório com histórico comprovado de resultados, atuação especializada e contínua, profundo conhecimento do mercado imobiliário e compromisso real com a defesa dos seus direitos. Cada caso é conduzido com análise técnica rigorosa, estratégia jurídica personalizada e acompanhamento próximo, garantindo segurança, transparência e efetividade na busca pelas melhores soluções jurídicas.",

  team: [
    { id: "1", name: "Rafael Paiva Nunes", role: "Sócio Diretor - CEO", photo: null, category: "gestao" },
    { id: "2", name: "Éverton Lemos", role: "Sócio - Gestão Produção", photo: null, category: "gestao" },
    { id: "3", name: "Andressa Collovini", role: "Sócia - Gestão Controladoria", photo: null, category: "gestao" },
    { id: "4", name: "Lauren", role: "Advogada", photo: null, category: "juridico" },
    { id: "5", name: "Maurício Mello", role: "Advogado", photo: null, category: "juridico" },
    { id: "6", name: "Bruno Bartz", role: "Advogado", photo: null, category: "juridico" },
    { id: "7", name: "Manuela Pedreschi", role: "Advogada", photo: null, category: "juridico" },
    { id: "8", name: "Ana Paula Martini", role: "Advogada", photo: null, category: "juridico" },
    { id: "9", name: "Gabriela Machado", role: "Advogada", photo: null, category: "juridico" },
    { id: "10", name: "Rafael Ferrão", role: "Advogado", photo: null, category: "juridico" },
    { id: "11", name: "Bruna Pires", role: "Administradora", photo: null, category: "administrativo" },
    { id: "12", name: "Juliany Braga", role: "", photo: null, category: "administrativo" },
    { id: "13", name: "Aline Almeida", role: "", photo: null, category: "administrativo" },
    { id: "14", name: "Claudine", role: "", photo: null, category: "administrativo" },
    { id: "15", name: "Catia", role: "", photo: null, category: "administrativo" },
    { id: "16", name: "Patrícia", role: "", photo: null, category: "administrativo" },
  ],

  honorarioAntecipado1: "R$ 4.100,00",
  honorarioAntecipado1Desc: "Notificação extrajudicial",
  honorarioAntecipado2: "R$ 8.200,00",
  honorarioAntecipado2Desc: "Ação judicial, se necessário",
  honorarioExito1: "Se resolvido pela via extrajudicial, sem percentual de êxito",
  honorarioExito2:
    "Se pela via judicial, 10% sobre o proveito econômico, proteção patrimonial",
  parcelamento: "Os parcelamentos serão por cartão de crédito.",
  validadeProposta:
    "Esta proposta tem validade de 30 dias. As despesas com custas judiciais, cartorárias e eventuais diligências não estão incluídas nos valores indicados.",

  fechamentoSteps: [
    "Contratação",
    "Coleta de documentos e preparação do caso",
    "Envio de contranotificação",
    "Se necessário, condução do processo em todas as instâncias e recursos.",
  ],
  fechamentoCTA:
    "Vamos juntos garantir seus direitos? Entre em contato e formalize sua contratação!",

  telefone: "(51) 3331-2525",
  instagram1: "@paivanunesadv",
  instagram2: "@rafaelpaivanunes",
  website: "www.paivanunes.com.br/",
  contatoTexto:
    "Cada caso merece atenção individual e um olhar técnico responsável. Estamos à disposição para ouvir você, esclarecer suas dúvidas e buscar a melhor solução jurídica para a sua situação. Fale com a Paiva Nunes Advogados.",
  contatoSlogan: "Paiva Nunes: defendendo seus Direitos Reais!",

  textSize: "medium",
  visibleSections: {
    cover: true,
    diagnostico: true,
    estrategia: true,
    argumentos: true,
    sobre: true,
    equipe: true,
    investimento: true,
    fechamento: true,
    contato: true,
  },
};
