import { notFound } from "next/navigation";
import { getServiceBySlug, services } from "@/data/services";
import { serviceImages } from "@/data/serviceImages";
import ServiceDetail from "@/components/service/ServiceDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

// Gera as rotas estáticas para todos os serviços
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

// Metadados dinâmicos por serviço
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: `${service.title} | MC Vidracaria`,
    description: service.description,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const images = serviceImages[slug] ?? [];

  return <ServiceDetail service={service} images={images} />;
}
