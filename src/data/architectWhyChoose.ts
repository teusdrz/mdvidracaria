import { Ruler, Building2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ArchitectWhyCard {
    icon: LucideIcon;
    title: string;
    description: string;
    backStat: string;
    backLabel: string;
    backQuote: string;
}

export const architectWhyCards: ArchitectWhyCard[] = [
    {
        icon: Ruler,
        title: "Parceiro técnico para grandes obras",
        description:
            "Atendemos escritórios de arquitetura e construtoras com fornecimento de vidros técnicos em escala, laudos, memoriais descritivos e suporte de projeto.",
        backStat: "+200",
        backLabel: "obras de médio e grande porte entregues com excelência",
        backQuote: "Do projeto ao acabamento, somos seu parceiro técnico.",
    },
    {
        icon: Building2,
        title: "Escala e agilidade para empreendimentos",
        description:
            "Estoque dedicado, equipe especializada e prazos alinhados ao cronograma da obra. Entregamos volume sem abrir mão da precisão milimétrica.",
        backStat: "15+",
        backLabel: "anos fornecendo para o mercado de construção civil",
        backQuote: "Prazo e qualidade que o seu empreendimento exige.",
    },
];
