"use client";

import { useState, useMemo } from "react";
import type { Product } from "@/data/products";
import ProductCard from "./ProductCard";
import CheckoutForm, { type CheckoutData } from "./CheckoutForm";
import PaymentScreen from "./PaymentScreen";
import MedidaEspelho from "./MedidaEspelho";

function formatBRL(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

interface Props {
    products: Product[];
    serviceSlug: string;
    serviceName: string;
}

export default function ProductGrid({ products, serviceSlug, serviceName }: Props) {
    const [cart, setCart] = useState<Map<string, number>>(new Map());
    const [view, setView] = useState<"catalog" | "checkout" | "payment">("catalog");
    const [formData, setFormData] = useState<CheckoutData | null>(null);

    const add = (id: string) =>
        setCart((prev) => new Map(prev).set(id, (prev.get(id) ?? 0) + 1));

    const remove = (id: string) =>
        setCart((prev) => {
            const m = new Map(prev);
            const cur = (m.get(id) ?? 0) - 1;
            cur <= 0 ? m.delete(id) : m.set(id, cur);
            return m;
        });

    const cartItems = useMemo(
        () => products.filter((p) => (cart.get(p.id) ?? 0) > 0),
        [products, cart],
    );

    const total = useMemo(
        () => cartItems.reduce((acc, p) => acc + p.price * (cart.get(p.id) ?? 0), 0),
        [cartItems, cart],
    );

    if (view === "checkout") {
        return (
            <CheckoutForm
                items={cartItems.map((p) => ({ product: p, quantity: cart.get(p.id) ?? 0 }))}
                total={total}
                serviceName={serviceName}
                onBack={() => setView("catalog")}
                onContinue={(data) => {
                    setFormData(data);
                    setView("payment");
                }}
            />
        );
    }

    if (view === "payment" && formData) {
        return (
            <PaymentScreen
                items={cartItems.map((p) => ({ product: p, quantity: cart.get(p.id) ?? 0 }))}
                total={total}
                serviceName={serviceName}
                formData={formData}
                onBack={() => setView("checkout")}
            />
        );
    }

    return (
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px 120px" }}>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: "20px",
                }}
            >
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        quantity={cart.get(product.id) ?? 0}
                        onAdd={() => add(product.id)}
                        onRemove={() => remove(product.id)}
                    />
                ))}
            </div>

            {/* Custom measurement section for espelhos */}
            {serviceSlug === "espelhos" && <MedidaEspelho />}

            {/* Floating cart bar */}
            {cartItems.length > 0 && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "24px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "min(calc(100% - 48px), 560px)",
                        background: "#1C4587",
                        borderRadius: "18px",
                        padding: "16px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "16px",
                        boxShadow: "0 16px 48px rgba(28,69,135,0.35)",
                        zIndex: 50,
                    }}
                >
                    <div>
                        <p
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "9px",
                                letterSpacing: "0.25em",
                                textTransform: "uppercase",
                                color: "rgba(255,255,255,0.55)",
                                marginBottom: "3px",
                            }}
                        >
                            {cartItems.length} {cartItems.length === 1 ? "item" : "itens"} selecionados
                        </p>
                        <p style={{ fontFamily: "var(--font-julius)", fontSize: "20px", color: "#ffffff" }}>
                            {formatBRL(total)}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setView("checkout")}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "12px 22px",
                            borderRadius: "12px",
                            background: "#ffffff",
                            color: "#1C4587",
                            fontFamily: "var(--font-display)",
                            fontSize: "10px",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            border: "none",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            boxShadow: "0 4px 16px rgba(28,69,135,0.20)",
                        }}
                    >
                        Finalizar Pedido
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 14, height: 14 }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}
