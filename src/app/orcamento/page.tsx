import type { Metadata } from "next";
import OrcamentoWizard from "@/components/orcamento/OrcamentoWizard";

export const metadata: Metadata = {
    title: "Solicitar Orçamento | MC Vidracaria",
    description:
        "Solicite seu orçamento online em minutos. Selecione o serviço, informe as medidas e envie pelo WhatsApp. Retorno em até 2 horas.",
};

export default async function OrcamentoPage({
    searchParams,
}: {
    searchParams: Promise<{ servico?: string }>;
}) {
    const params = await searchParams;
    return <OrcamentoWizard initialServico={params.servico} />;
}
