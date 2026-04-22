export interface ArchitectService {
    slug: string;
    title: string;
    subtitle: string;
    icon: string;
}

export const architectServices: ArchitectService[] = [
    {
        slug: "espelhos",
        title: "Espelhos em Grande Escala",
        subtitle: "Fornecimento para lobbies, halls e ambientes corporativos de alto padrão.",
        icon: "Maximize2",
    },
    {
        slug: "box-de-vidro",
        title: "Box de Vidro para Obras",
        subtitle: "Atendimento em volume para condomínios, hotéis e empreendimentos residenciais.",
        icon: "Square",
    },
    {
        slug: "guarda-corpo",
        title: "Guarda-Corpo Estrutural",
        subtitle: "Soluções certificadas para edifícios, mezaninos e escadas de grande porte.",
        icon: "Shield",
    },
    {
        slug: "envelopamento-e-peliculas",
        title: "Películas Técnicas de Fachada",
        subtitle: "Controle solar, privacidade e identidade visual em fachadas de alto desempenho.",
        icon: "Layers",
    },
    {
        slug: "divisorias",
        title: "Divisórias Corporativas",
        subtitle: "Ambientes open-space e salas privativas para escritórios e plantas comerciais.",
        icon: "LayoutGrid",
    },
    {
        slug: "sacada",
        title: "Sacadas para Empreendimentos",
        subtitle: "Sistemas de cortina de vidro para torres residenciais e complexos hoteleiros.",
        icon: "Home",
    },
    {
        slug: "cobertura",
        title: "Coberturas Arquitetônicas",
        subtitle: "Estruturas em vidro laminado para áreas gourmet, pergolados e entradas de edifícios.",
        icon: "Umbrella",
    },
];
