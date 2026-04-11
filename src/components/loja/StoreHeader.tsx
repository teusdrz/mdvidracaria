"use client";

import Link from "next/link";
import type { Service } from "@/data/services";

interface Props {
    service: Service;
    productCount: number;
}

export default function StoreHeader({ service, productCount }: Props) {
    return (
        <div
            style={{
                padding: "32px 24px 28px",
                maxWidth: "860px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
            }}
        >
            {/* Back */}
            <Link
                href={`/orcamento?servico=${service.slug}`}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    fontFamily: "var(--font-display)",
                    fontSize: "10px",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "rgba(28, 69, 135, 0.40)",
                    textDecoration: "none",
                    width: "fit-content",
                }}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: 14, height: 14 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                Voltar
            </Link>

            {/* Title block */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <p
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "10px",
                        letterSpacing: "0.35em",
                        textTransform: "uppercase",
                        color: "rgba(28, 69, 135, 0.38)",
                    }}
                >
                    Pronta Entrega &middot; {productCount} {productCount === 1 ? "produto" : "produtos"}
                </p>
                <h1
                    style={{
                        fontFamily: "var(--font-julius)",
                        fontSize: "clamp(24px, 5vw, 36px)",
                        color: "#1C4587",
                        lineHeight: 1.1,
                    }}
                >
                    {service.title}
                </h1>
                <p
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "13px",
                        color: "rgba(28, 69, 135, 0.48)",
                    }}
                >
                    {service.subtitle}
                </p>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(28, 69, 135, 0.07)" }} />
        </div>
    );
}
