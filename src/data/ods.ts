export interface Goal {
  id: number;
  title: string;
  description: string;
  localFocus: string;
  icon: string;
  color: string;
}

export interface OdsTarget {
  code: string;
  title: string;
  description: string;
  owner: string;
  deadline: string;
  priority: 'Alta' | 'Média' | 'Contínua';
}

export interface OdsIndicator {
  name: string;
  value: string;
  period: string;
  source: string;
  trend: 'Melhora' | 'Atenção' | 'Estável' | 'Planejado';
}

export interface OdsDetail extends Goal {
  status: 'Alerta' | 'Atenção' | 'Em acompanhamento' | 'Integrado';
  score: number;
  situation: string;
  municipalObjective: string;
  targets: OdsTarget[];
  indicators: OdsIndicator[];
  actions: string[];
}

const goalImageUrls = import.meta.glob('../assets/*.{jpg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
});

export const goals: Goal[] = [
  {
    id: 1,
    title: 'Erradicação da pobreza',
    description: 'Acabar com a pobreza em todas as suas formas, em todos os lugares.',
    localFocus: 'Mapear famílias vulneráveis, renda, moradia e acesso aos serviços essenciais.',
    icon: 'family_restroom',
    color: '#e5243b',
  },
  {
    id: 2,
    title: 'Fome zero e agricultura sustentável',
    description:
      'Acabar com a fome, alcançar segurança alimentar e promover agricultura sustentável.',
    localFocus: 'Acompanhar segurança alimentar, agricultura familiar e abastecimento municipal.',
    icon: 'restaurant',
    color: '#dda63a',
  },
  {
    id: 3,
    title: 'Saúde e bem-estar',
    description: 'Assegurar uma vida saudável e promover o bem-estar para todos.',
    localFocus:
      'Monitorar atenção básica, vigilância em saúde e qualidade de vida nos territórios.',
    icon: 'monitor_heart',
    color: '#4c9f38',
  },
  {
    id: 4,
    title: 'Educação de qualidade',
    description: 'Assegurar educação inclusiva, equitativa e de qualidade.',
    localFocus: 'Observar aprendizagem, permanência escolar, creches e ensino integral.',
    icon: 'school',
    color: '#c5192d',
  },
  {
    id: 5,
    title: 'Igualdade de gênero',
    description: 'Alcançar igualdade de gênero e empoderar todas as mulheres e meninas.',
    localFocus: 'Acompanhar políticas de proteção, autonomia econômica e participação social.',
    icon: 'female',
    color: '#ff3a21',
  },
  {
    id: 6,
    title: 'Água potável e saneamento',
    description: 'Garantir disponibilidade e manejo sustentável da água e saneamento.',
    localFocus: 'Medir abastecimento, esgotamento sanitário, drenagem e segurança hídrica.',
    icon: 'water_drop',
    color: '#26bde2',
  },
  {
    id: 7,
    title: 'Energia acessível e limpa',
    description: 'Garantir acesso confiável, sustentável, moderno e a preço acessível à energia.',
    localFocus: 'Mapear eficiência energética, iluminação pública e iniciativas de energia limpa.',
    icon: 'bolt',
    color: '#fcc30b',
  },
  {
    id: 8,
    title: 'Trabalho decente e crescimento',
    description: 'Promover crescimento econômico sustentado, emprego pleno e trabalho decente.',
    localFocus: 'Acompanhar emprego formal, empreendedorismo local e inclusão produtiva.',
    icon: 'trending_up',
    color: '#a21942',
  },
  {
    id: 9,
    title: 'Indústria, inovação e infraestrutura',
    description: 'Construir infraestrutura resiliente e fomentar inovação.',
    localFocus: 'Observar conectividade, infraestrutura urbana, tecnologia e ambiente de negócios.',
    icon: 'hub',
    color: '#fd6925',
  },
  {
    id: 10,
    title: 'Redução das desigualdades',
    description: 'Reduzir as desigualdades dentro dos países e entre eles.',
    localFocus: 'Comparar indicadores por território, renda, gênero, raça e faixa etária.',
    icon: 'balance',
    color: '#dd1367',
  },
  {
    id: 11,
    title: 'Cidades sustentáveis',
    description: 'Tornar cidades e comunidades inclusivas, seguras, resilientes e sustentáveis.',
    localFocus: 'Acompanhar mobilidade, habitação, planejamento urbano e resiliência municipal.',
    icon: 'location_city',
    color: '#fd9d24',
  },
  {
    id: 12,
    title: 'Consumo e produção responsáveis',
    description: 'Assegurar padrões de produção e de consumo sustentáveis.',
    localFocus: 'Monitorar resíduos, compras públicas sustentáveis e economia circular.',
    icon: 'all_inclusive',
    color: '#bf8b2e',
  },
  {
    id: 13,
    title: 'Ação contra a mudança do clima',
    description: 'Tomar medidas urgentes para combater a mudança do clima e seus impactos.',
    localFocus: 'Registrar riscos climáticos, arborização, defesa civil e mitigação de emissões.',
    icon: 'public',
    color: '#3f7e44',
  },
  {
    id: 14,
    title: 'Vida na água',
    description: 'Conservar e usar de forma sustentável oceanos, mares e recursos marinhos.',
    localFocus: 'Relacionar educação ambiental, recursos hídricos e impactos em bacias locais.',
    icon: 'waves',
    color: '#0a97d9',
  },
  {
    id: 15,
    title: 'Vida terrestre',
    description: 'Proteger, recuperar e promover o uso sustentável dos ecossistemas terrestres.',
    localFocus: 'Acompanhar unidades verdes, cobertura vegetal, biodiversidade e áreas degradadas.',
    icon: 'forest',
    color: '#56c02b',
  },
  {
    id: 16,
    title: 'Paz, justiça e instituições eficazes',
    description: 'Promover sociedades pacíficas, acesso à justiça e instituições eficazes.',
    localFocus: 'Monitorar transparência, controle social, segurança cidadã e acesso a direitos.',
    icon: 'gavel',
    color: '#00689d',
  },
  {
    id: 17,
    title: 'Parcerias e meios de implementação',
    description:
      'Fortalecer meios de implementação e parcerias para o desenvolvimento sustentável.',
    localFocus: 'Integrar governo, universidades, sociedade civil, empresas e cooperação técnica.',
    icon: 'diversity_3',
    color: '#19486a',
  },
  {
    id: 18,
    title: 'Todas as metas',
    description: 'Visão integrada das metas priorizadas pelo município no observatório.',
    localFocus:
      'Consolidar os indicadores transversais e a leitura integrada da Agenda 2030 local.',
    icon: 'apps',
    color: '#123c19',
  },
];

const detailSeeds: Record<
  number,
  Pick<OdsDetail, 'status' | 'score' | 'situation' | 'municipalObjective' | 'actions'>
> = {
  1: {
    status: 'Atenção',
    score: 52,
    situation:
      'A leitura municipal prioriza famílias em vulnerabilidade, acesso a renda, moradia digna e chegada dos serviços públicos aos territórios com maior fragilidade social.',
    municipalObjective:
      'Reduzir vulnerabilidades sociais com busca ativa, integração cadastral e acompanhamento territorial das famílias.',
    actions: ['Busca ativa nos CRAS', 'Integração com Cadastro Único', 'Mapa de vulnerabilidade por bairro'],
  },
  2: {
    status: 'Alerta',
    score: 47,
    situation:
      'O acompanhamento observa segurança alimentar, abastecimento, agricultura familiar e capacidade de resposta da rede pública para famílias em insegurança alimentar.',
    municipalObjective:
      'Fortalecer abastecimento, alimentação escolar, agricultura familiar e apoio às famílias em insegurança alimentar.',
    actions: ['Compras da agricultura familiar', 'Mapeamento de insegurança alimentar', 'Feiras e abastecimento local'],
  },
  3: {
    status: 'Em acompanhamento',
    score: 61,
    situation:
      'A saúde municipal é acompanhada pela cobertura da atenção básica, vigilância, vacinação, prevenção e acesso territorial aos serviços de cuidado.',
    municipalObjective:
      'Ampliar prevenção, qualificar a atenção básica e reduzir desigualdades de acesso à saúde nos territórios.',
    actions: ['Monitoramento da atenção básica', 'Campanhas de vacinação', 'Vigilância territorial em saúde'],
  },
  4: {
    status: 'Alerta',
    score: 40,
    situation:
      'A agenda educacional exige foco em permanência, alfabetização, aprendizagem, creches e redução das desigualdades entre territórios.',
    municipalObjective:
      'Garantir permanência escolar, aprendizagem adequada e ampliação progressiva do atendimento educacional.',
    actions: ['Busca ativa escolar', 'Reforço de aprendizagem', 'Acompanhamento de frequência'],
  },
  6: {
    status: 'Em acompanhamento',
    score: 83,
    situation:
      'A leitura de saneamento observa abastecimento, esgotamento, drenagem, segurança hídrica e priorização de áreas com maior demanda territorial.',
    municipalObjective:
      'Qualificar a gestão de saneamento e reduzir lacunas de infraestrutura urbana e rural.',
    actions: ['Mapa de saneamento por território', 'Monitoramento de drenagem', 'Priorização de áreas críticas'],
  },
  11: {
    status: 'Em acompanhamento',
    score: 72,
    situation:
      'O município acompanha mobilidade, habitação, planejamento urbano, equipamentos públicos e capacidade de resposta a riscos urbanos.',
    municipalObjective:
      'Promover planejamento urbano integrado, com foco em mobilidade, habitação, infraestrutura e resiliência.',
    actions: ['Leitura territorial de infraestrutura', 'Planejamento de mobilidade', 'Monitoramento de equipamentos públicos'],
  },
};

function getSeed(goal: Goal) {
  return (
    detailSeeds[goal.id] ?? {
      status: goal.id === 18 ? 'Integrado' : 'Atenção',
      score: goal.id === 18 ? 58 : 50 + ((goal.id * 7) % 28),
      situation: `A leitura municipal deste ODS concentra-se em ${goal.localFocus.toLowerCase()}`,
      municipalObjective: goal.localFocus,
      actions: [
        'Mapear fontes municipais disponíveis',
        'Definir responsável técnico por indicador',
        'Publicar série histórica no painel',
      ],
    }
  );
}

export function getOdsDetail(id: number): OdsDetail | undefined {
  const goal = goals.find((item) => item.id === id);

  if (!goal) {
    return undefined;
  }

  const seed = getSeed(goal);
  const owner =
    goal.id === 3 || goal.id === 4
      ? 'Educação e Saúde'
      : goal.id === 6 || goal.id === 11 || goal.id === 13 || goal.id === 15
        ? 'Infraestrutura e Meio Ambiente'
        : 'Desenvolvimento Social e Gestão';

  return {
    ...goal,
    ...seed,
    targets: [
      {
        code: `${goal.id}.1 VC`,
        title: 'Organizar diagnóstico municipal',
        description: `Consolidar dados públicos para ${goal.localFocus.toLowerCase()}`,
        owner,
        deadline: '2026',
        priority: 'Alta',
      },
      {
        code: `${goal.id}.2 VC`,
        title: 'Priorizar territórios vulneráveis',
        description:
          'Aplicar recortes por bairro, distrito, renda, gênero, raça e faixa etária quando houver disponibilidade.',
        owner,
        deadline: '2028',
        priority: 'Média',
      },
      {
        code: `${goal.id}.3 VC`,
        title: 'Publicar evidências e ações',
        description:
          'Manter metas, indicadores, fontes e ações vinculadas disponíveis para acompanhamento público.',
        owner: 'ObservaODS',
        deadline: 'Contínua',
        priority: 'Contínua',
      },
    ],
    indicators: [
      {
        name: 'Cobertura territorial monitorada',
        value: `${Math.min(96, 46 + goal.id * 3)}%`,
        period: '2026',
        source: 'Base municipal demonstrativa',
        trend: seed.status === 'Alerta' ? 'Atenção' : 'Melhora',
      },
      {
        name: 'Ações municipais vinculadas',
        value: String(2 + (goal.id % 5)),
        period: '2026',
        source: 'ObservaODS',
        trend: 'Estável',
      },
      {
        name: 'Indicadores com fonte definida',
        value: String(3 + (goal.id % 4)),
        period: '2026',
        source: 'Catálogo de fontes',
        trend: goal.id === 18 ? 'Planejado' : 'Melhora',
      },
    ],
  };
}

export function getGoalImageUrl(id: number) {
  const extension = id === 18 ? 'png' : 'jpg';

  return goalImageUrls[`../assets/${id}.${extension}`] as string | undefined;
}
