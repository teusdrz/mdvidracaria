"use client";

import Image from "next/image";
import type { Product } from "@/data/products";

interface Props {
    product: Product;
    quantity: number;
    onAdd: () => void;
    onRemove: () => void;
}

function formatBRL(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

const countBtn = (bg: string, color: string): React.CSSProperties => ({
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    border: bg === "transparent" ? "1.5px solid rgba(28,69,135,0.20)" : "none",
    background: bg,
    color,
    fontSize: "18px",
    lineHeight: "1",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
});

export default function ProductCard({ product, quantity, onAdd, onRemove }: Props) {
    const selected = quantity > 0;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "20px",
                border: selected ? "2px solid #1C4587" : "1.5px solid rgba(28,69,135,0.10)",
                background: "#ffffff",
                boxShadow: selected ? "0 4px 24px rgba(28,69,135,0.12)" : "0 2px 10px rgba(0,0,0,0.04)",
                overflow: "hidden",
                transition: "all 0.22s ease",
                position: "relative",
            }}
        >
            {/* Badge */}
            {product.badge && (
                <div
                    style={{
                        position: "absolute",
                        top: "14px",
                        right: "14px",
                        padding: "4px 10px",
                        borderRadius: "100px",
                        background: "#1C4587",
                        fontFamily: "var(--font-display)",
                        fontSize: "8px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "#ffffff",
                        zIndex: 1,
                    }}
                >
                    {product.badge}
                </div>
            )}

            {/* Visual */}
            <div
                style={{
                    height: "220px",
                    position: "relative",
                    overflow: "hidden",
                    background: selected ? "rgba(28, 69, 135, 0.06)" : "rgba(28, 69, 135, 0.03)",
                    transition: "background 0.22s ease",
                }}
            >
                {product.image ? (
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        style={{ objectFit: "cover", objectPosition: "center" }}
                        sizes="(max-width: 768px) 100vw, 300px"
                    />
                ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="rgba(28,69,135,0.18)"
                            strokeWidth={1}
                            style={{ width: 48, height: 48 }}
                        >
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M3 9h18M3 15h18M9 3v18M15 3v18" strokeDasharray="2 2" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Info */}
            <div style={{ padding: "16px 18px 20px", display: "flex", flexDirection: "column", gap: "5px", flex: 1 }}>
                <p
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "9px",
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        color: "rgba(28,69,135,0.38)",
                    }}
                >
                    {product.dimensions}
                </p>
                <p style={{ fontFamily: "var(--font-julius)", fontSize: "15px", color: "#1C1C1C", lineHeight: 1.3 }}>
                    {product.name}
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(28,69,135,0.42)", lineHeight: 1.5 }}>
                    {product.description}
                </p>

                {/* Price + Controls */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px" }}>
                    <p style={{ fontFamily: "var(--font-julius)", fontSize: "18px", color: "#1C4587" }}>
                        {formatBRL(product.price)}
                    </p>

                    {quantity === 0 ? (
                        <button
                            type="button"
                            onClick={onAdd}
                            style={{
                                padding: "9px 18px",
                                borderRadius: "10px",
                                background: "#1C4587",
                                color: "#ffffff",
                                border: "none",
                                fontFamily: "var(--font-display)",
                                fontSize: "9px",
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                                cursor: "pointer",
                            }}
                        >
                            Adicionar
                        </button>
                    ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <button type="button" onClick={onRemove} style={countBtn("transparent", "#1C4587")}>−</button>
                            <span style={{ fontFamily: "var(--font-julius)", fontSize: "16px", color: "#1C4587", minWidth: "20px", textAlign: "center" }}>
                                {quantity}
                            </span>
                            <button type="button" onClick={onAdd} style={countBtn("#1C4587", "#ffffff")}>+</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
