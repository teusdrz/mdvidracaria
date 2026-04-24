/**
 * Textos descritivos para cada imagem dentro da página de detalhe do serviço.
 * A ordem segue exatamente a ordem em `serviceImages.ts`.
 */

export interface ImageCaption {
    eyebrow: string;
    title: string;
    description: string;
}

export const serviceCaptions: Record<string, readonly ImageCaption[]> = {
    espelhos: [
        {
            eyebrow: "Sala de estar",
            title: "Espelho sob medida",
            description:
                "Peças dimensionadas milimetricamente para valorizar o ambiente, ampliar a sensação de espaço e refletir a luz natural de forma equilibrada.",
        },
        {
            eyebrow: "Acabamento refinado",
            title: "Lapidação bisotê e recortes",
            description:
                "Bordas lapidadas com bisotê e recortes especiais transformam o espelho em um elemento decorativo com presença arquitetônica.",
        },
        {
            eyebrow: "Ambientes integrados",
            title: "Espelho decorativo",
            description:
                "Composições que reforçam a profundidade de salas e halls, trabalhando a reflexão como parte do projeto de interiores.",
        },
        {
            eyebrow: "Banheiro",
            title: "Fixação oculta",
            description:
                "Instalação limpa, sem parafusos aparentes, garantindo um acabamento sofisticado e seguro sobre qualquer revestimento.",
        },
        {
            eyebrow: "Iluminação",
            title: "Espelho com luz embutida",
            description:
                "Combinação de vidro e iluminação LED para criar pontos focais funcionais em áreas de banho, closets e penteadeiras.",
        },
        {
            eyebrow: "Painéis amplos",
            title: "Parede espelhada",
            description:
                "Grandes painéis aplicados em paredes inteiras para expandir visualmente closets, corredores e salas comerciais.",
        },
    ],
    "box-de-vidro": [
        {
            eyebrow: "Clássico",
            title: "Box frontal temperado 8mm",
            description:
                "Solução segura e atemporal para boxes retangulares, com perfis reduzidos e vidro incolor que valoriza o revestimento.",
        },
        {
            eyebrow: "Compacto",
            title: "Box de canto em L",
            description:
                "Ideal para banheiros reduzidos, aproveita o canto do ambiente mantendo circulação ampla e visual elegante.",
        },
        {
            eyebrow: "Sofisticado",
            title: "Vidro fumê com ferragens inox",
            description:
                "Privacidade sutil combinada com ferragens em aço inox escovado, pensadas para resistir à umidade sem perder o brilho.",
        },
        {
            eyebrow: "Privacidade",
            title: "Box jateado",
            description:
                "Vidro com acabamento fosco que garante privacidade total sem bloquear a passagem da luz no ambiente.",
        },
        {
            eyebrow: "Design clean",
            title: "Incolor com puxador minimalista",
            description:
                "Linhas retas, perfil discreto e puxador tubular — ideal para banheiros de alto padrão com estética contemporânea.",
        },
    ],
    "guarda-corpo": [
        {
            eyebrow: "Sacada",
            title: "Guarda-corpo laminado",
            description:
                "Proteção sem bloquear a vista, com vidro laminado de segurança, fixação por bottons de inox e cumprimento da NBR 14718.",
        },
        {
            eyebrow: "Escada interna",
            title: "Design clean",
            description:
                "Acabamento que valoriza o desenho da escada, integra pavimentos e mantém a iluminação natural fluindo entre os ambientes.",
        },
        {
            eyebrow: "Varanda residencial",
            title: "Vidro temperado 10mm",
            description:
                "Instalação com fixação em bottons de inox escovado, garantindo resistência estrutural e transparência total para valorizar a vista.",
        },
        {
            eyebrow: "Projeto em execução",
            title: "Instalação em movimento",
            description:
                "Acompanhe o processo de instalação do guarda-corpo: medição precisa, alinhamento milimétrico e acabamento profissional em cada detalhe.",
        },
    ],
    "envelopamento-e-peliculas": [
        {
            eyebrow: "Controle solar",
            title: "Película térmica para fachadas",
            description:
                "Redução significativa de calor e proteção contra raios UV, preservando a estética original do vidro e o conforto interno.",
        },
        {
            eyebrow: "Privacidade",
            title: "Película jateada",
            description:
                "Efeito fosco aplicado em portas, divisórias e áreas de banho, criando privacidade sem perder luminosidade.",
        },
        {
            eyebrow: "Personalização",
            title: "Película decorativa",
            description:
                "Padrões gráficos, logos e recortes personalizados aplicados em vidros comerciais e residenciais para reforçar a identidade do espaço.",
        },
    ],
    divisorias: [
        {
            eyebrow: "Corporativo",
            title: "Divisória fixa de vidro",
            description:
                "Ambientes integrados que preservam iluminação natural, com isolamento acústico e acabamento profissional.",
        },
        {
            eyebrow: "Versatilidade",
            title: "Divisória de correr",
            description:
                "Vidro temperado em sistema de correr, ideal para abrir ou fechar espaços conforme a necessidade do dia.",
        },
        {
            eyebrow: "Identidade visual",
            title: "Jateamento decorativo",
            description:
                "Combina a leveza do vidro com privacidade pontual, aplicando grafismos e logos diretamente na superfície.",
        },
    ],
    cobertura: [
        {
            eyebrow: "Áreas externas",
            title: "Cobertura em vidro laminado",
            description:
                "Luz natural o dia inteiro com proteção contra chuva e raios UV, mantendo a área gourmet sempre utilizável.",
        },
        {
            eyebrow: "Circulação",
            title: "Cobertura lateral",
            description:
                "Valoriza corredores e entradas laterais, mantendo o projeto luminoso e com vedação anti-infiltração.",
        },
    ],
    sacada: [
        {
            eyebrow: "Varanda envidraçada",
            title: "Sacada em movimento",
            description:
                "Sistema de vidros deslizantes com acabamento premium que transforma a varanda em um ambiente protegido de chuva, vento e ruído, preservando a vista e a ventilação.",
        },
    ],
};
