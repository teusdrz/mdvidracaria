export interface Service {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  benefits: string[];
  icon: string;
  gradient: string;
}

export const services: Service[] = [
  {
    slug: "espelhos",
    title: "Espelhos",
    subtitle: "Amplie seus ambientes com elegancia",
    description:
      "Espelhos sao muito mais do que superficies refletivas, sao ferramentas poderosas que ampliam ambientes, multiplicam luz e funcionam como pecas decorativas. Trabalhamos com espelhos sob medida para banheiros, salas, closets e ambientes comerciais, com acabamento impecavel e instalacao profissional.",
    features: [
      "Espelhos sob medida",
      "Espelho bisote",
      "Espelho redondo",
      "Espelho decorativo",
      "Espelho para banheiro",
      "Espelho para sala",
    ],
    benefits: [
      "Amplia ambientes",
      "Multiplica iluminacao",
      "Acabamento premium",
      "Instalacao profissional",
    ],
    icon: "Maximize2",
    gradient: "from-blue-500/20 to-purple-500/20",
  },
  {
    slug: "box-de-vidro",
    title: "Box de Vidro",
    subtitle: "Elegancia e Seguranca para Seu Banheiro",
    description:
      "O box de vidro temperado transforma seu banheiro em um ambiente moderno e funcional. Com opcoes de vidro incolor, fume, ou serigrafado, garantimos seguranca com normas ABNT e design que valoriza seu espaco.",
    features: [
      "Box de canto",
      "Box frontal",
      "Box em L",
      "Vidro temperado 8mm",
      "Vidro fume",
      "Vidro serigrafado",
    ],
    benefits: [
      "Seguranca certificada ABNT",
      "Facilidade de limpeza",
      "Valoriza o imovel",
      "Durabilidade superior",
    ],
    icon: "Square",
    gradient: "from-cyan-500/20 to-blue-500/20",
  },
  {
    slug: "guarda-corpo",
    title: "Guarda Corpo",
    subtitle: "Protecao sem abrir mao da elegancia",
    description:
      "Os guarda-corpos de vidro oferecem protecao sem abrir mao da elegancia. Ideais para escadas, sacadas e mezaninos, combinam seguranca estrutural com visual clean e sofisticado.",
    features: [
      "Guarda corpo para escada",
      "Guarda corpo para sacada",
      "Guarda corpo para mezanino",
      "Vidro laminado",
      "Fixacao por bottons",
      "Fixacao por perfil",
    ],
    benefits: [
      "Seguranca estrutural",
      "Visual clean",
      "Resistencia a impactos",
      "Versatilidade de aplicacao",
    ],
    icon: "Shield",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    slug: "envelopamento-e-peliculas",
    title: "Envelopamento e Peliculas",
    subtitle: "Funcionalidade, estetica e seguranca",
    description:
      "Um dos diferenciais da MC Vidracaria e a aplicacao de peliculas e envelopamentos personalizados, que agregam funcionalidade, estetica e seguranca aos vidros. Proteja seus ambientes com tecnologia de ponta.",
    features: [
      "Pelicula de controle solar",
      "Pelicula de seguranca",
      "Pelicula decorativa",
      "Pelicula jateada",
      "Envelopamento arquitetonico",
      "Pelicula antivandalismo",
    ],
    benefits: [
      "Reducao de calor",
      "Protecao UV",
      "Privacidade",
      "Economia de energia",
    ],
    icon: "Layers",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    slug: "divisorias",
    title: "Divisorias",
    subtitle: "Ambientes Integrados com Estilo e Funcionalidade",
    description:
      "As divisorias de vidro sao a solucao ideal para quem busca delimitar espacos sem perder iluminacao e amplitude. Seja em residencias ou ambientes corporativos, elas oferecem leveza visual, modernidade e praticidade.",
    features: [
      "Divisoria de escritorio",
      "Divisoria residencial",
      "Divisoria com porta",
      "Vidro temperado",
      "Vidro laminado",
      "Perfil de aluminio",
    ],
    benefits: [
      "Mantem iluminacao natural",
      "Isolamento acustico",
      "Modernidade",
      "Facil manutencao",
    ],
    icon: "LayoutGrid",
    gradient: "from-violet-500/20 to-indigo-500/20",
  },
  {
    slug: "sacada",
    title: "Sacada",
    subtitle: "Conforto, Protecao e Estilo",
    description:
      "A sacada envidracada transforma sua varanda em um novo ambiente, protegido de chuva, vento e ruido, sem perder a vista e a ventilacao. Sistema de vidros deslizantes com acabamento premium.",
    features: [
      "Sistema de cortina de vidro",
      "Vidro temperado",
      "Sistema deslizante",
      "Sistema de recolhimento",
      "Perfil em aluminio",
      "Vedacao acustica",
    ],
    benefits: [
      "Protecao contra intemperies",
      "Reducao de ruido",
      "Novo ambiente util",
      "Valorizacao do imovel",
    ],
    icon: "Home",
    gradient: "from-sky-500/20 to-cyan-500/20",
  },
  {
    slug: "cobertura",
    title: "Cobertura",
    subtitle: "Protecao e Sofisticacao para Seu Espaco",
    description:
      "Coberturas em vidro e policarbonato que protegem areas externas com elegancia. Perfeitas para garagens, areas gourmet, pergolados e entradas, combinando funcionalidade com design arquitetonico.",
    features: [
      "Cobertura de vidro laminado",
      "Cobertura de policarbonato",
      "Pergolado com vidro",
      "Cobertura retratil",
      "Estrutura em aluminio",
      "Estrutura em aco inox",
    ],
    benefits: [
      "Protecao contra chuva",
      "Iluminacao natural",
      "Durabilidade",
      "Design arquitetonico",
    ],
    icon: "Umbrella",
    gradient: "from-rose-500/20 to-pink-500/20",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getRelatedServices(currentSlug: string): Service[] {
  return services.filter((s) => s.slug !== currentSlug).slice(0, 3);
}
