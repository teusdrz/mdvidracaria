export interface Product {
    id: string;
    serviceSlug: string;
    name: string;
    dimensions: string;
    description: string;
    price: number;
    badge?: string;
    image?: string;
}

const ALL_PRODUCTS: Product[] = [
    // ── Espelhos ──────────────────────────────────────────────────────────────
    {
        id: "esp-01",
        serviceSlug: "espelhos",
        name: "Espelho Bisotê",
        dimensions: "Sob consulta",
        description: "Espelho com bisotê de 4 mm ao redor de toda a borda, acabamento polido premium. Ideal para banheiros, lavabos e halls de entrada. Acompanha suporte de fixação incluso. Vidro de alta transparência com tratamento antiembaçante.",
        price: 500,
        badge: "Mais Vendido",
        image: "/fotos-pront-entrega/espelho-bisote.png",
    },
    {
        id: "esp-02",
        serviceSlug: "espelhos",
        name: "Espelho Orgânico Assimétrico",
        dimensions: "Sob consulta",
        description: "Espelho de formato orgânico assimétrico com bordas totalmente polidas. Design contemporâneo inspirado em formas naturais. Peça decorativa que transforma qualquer parede. Pronto para pendurar com suporte discreto incluso.",
        price: 450,
        image: "/fotos-pront-entrega/espelho-organico.png",
    },
    {
        id: "esp-03",
        serviceSlug: "espelhos",
        name: "Espelho Orgânico de Chão",
        dimensions: "Sob consulta",
        description: "Espelho orgânico de chão ou parede com formato fluido e bordas polidas. Combina com ambientes modernos, boho e minimalistas. Versátil para hall de entrada, sala ou quarto. Suporte metálico incluso para uso de piso.",
        price: 459,
        badge: "Destaque",
        image: "/fotos-pront-entrega/espelho.png",
    },
    // ── Envelopamento e Películas ─────────────────────────────────────────────
    {
        id: "env-01",
        serviceSlug: "envelopamento-e-peliculas",
        name: "Película Solar G20",
        dimensions: "Rolo 0,50 × 3 m",
        description: "Controle solar, bloqueia 80% dos raios UV",
        price: 85,
    },
    {
        id: "env-02",
        serviceSlug: "envelopamento-e-peliculas",
        name: "Película Jateada",
        dimensions: "Rolo 0,50 × 3 m",
        description: "Privacidade total, efeito fosco permanente",
        price: 95,
        badge: "Mais Vendido",
    },
    {
        id: "env-03",
        serviceSlug: "envelopamento-e-peliculas",
        name: "Película Solar G35",
        dimensions: "Rolo 1,00 × 3 m",
        description: "Controle solar moderado, maior largura",
        price: 149,
    },
    {
        id: "env-04",
        serviceSlug: "envelopamento-e-peliculas",
        name: "Película Decorativa Bambu",
        dimensions: "Rolo 0,50 × 3 m",
        description: "Padrão bambu, efeito decorativo e privacidade",
        price: 79,
    },
];

export function getProductsBySlug(slug: string): Product[] {
    return ALL_PRODUCTS.filter((p) => p.serviceSlug === slug);
}
