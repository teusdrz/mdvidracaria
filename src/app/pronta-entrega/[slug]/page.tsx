import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services } from "@/data/services";
import { getProductsBySlug } from "@/data/products";
import StoreHeader from "@/components/loja/StoreHeader";
import ProductGrid from "@/components/loja/ProductGrid";
import EmptyState from "@/components/loja/EmptyState";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const service = services.find((s) => s.slug === slug);
    if (!service) return { title: "Pronta Entrega | MC Vidracaria" };
    return {
        title: `${service.title} Pronta Entrega | MC Vidracaria`,
        description: `Confira nossos ${service.title.toLowerCase()} prontos para entrega. Qualidade MC Vidracaria com entrega imediata.`,
    };
}

export default async function ProntaEntregaPage({ params }: Props) {
    const { slug } = await params;
    const service = services.find((s) => s.slug === slug);
    if (!service) notFound();

    const products = getProductsBySlug(slug);

    return (
        <section
            style={{
                minHeight: "100vh",
                background: "linear-gradient(155deg, #eef3ff 0%, #ffffff 45%, #f5f8ff 100%)",
            }}
        >
            <StoreHeader service={service} productCount={products.length} />
            {products.length === 0 ? (
                <EmptyState service={service} />
            ) : (
                <ProductGrid
                    products={products}
                    serviceSlug={slug}
                    serviceName={service.title}
                />
            )}
        </section>
    );
}
