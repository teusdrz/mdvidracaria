"use client";

import { useState } from "react";
import type { Product } from "@/data/products";

export interface CheckoutData {
    name: string;
    phone: string;
    cep: string;
    rua: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
}

interface CartItem {
    product: Product;
    quantity: number;
}

interface Props {
    items: CartItem[];
    total: number;
    serviceName: string;
    onBack: () => void;
    onContinue: (data: CheckoutData) => void;
}

function formatBRL(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "9px",
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color: "rgba(28,69,135,0.50)",
};

function inputCss(disabled?: boolean): React.CSSProperties {
    return {
        padding: "14px 18px",
        borderRadius: "12px",
        border: "1.5px solid rgba(28,69,135,0.14)",
        background: disabled ? "rgba(28,69,135,0.03)" : "#ffffff",
        fontFamily: "var(--font-body)",
        fontSize: "14px",
        color: disabled ? "rgba(28,69,135,0.38)" : "#1C1C1C",
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
    };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            <label style={labelStyle}>{label}</label>
            {children}
        </div>
    );
}

export default function CheckoutForm({ items, total, onBack, onContinue }: Props) {
    const [form, setForm] = useState<CheckoutData>({
        name: "", phone: "", cep: "",
        rua: "", numero: "", complemento: "",
        bairro: "", cidade: "", uf: "",
    });
    const [cepLoading, setCepLoading] = useState(false);
    const [cepError, setCepError] = useState("");

    const set = (k: keyof CheckoutData, v: string) => setForm((p) => ({ ...p, [k]: v }));

    async function handleCep(raw: string) {
        const digits = raw.replace(/\D/g, "").slice(0, 8);
        const formatted = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
        setForm((p) => ({ ...p, cep: formatted, rua: "", bairro: "", cidade: "", uf: "" }));
        setCepError("");
        if (digits.length !== 8) return;
        setCepLoading(true);
        try {
            const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
            const data = await res.json();
            if (data.erro) throw new Error();
            setForm((p) => ({
                ...p,
                cep: formatted,
                rua: data.logradouro ?? "",
                bairro: data.bairro ?? "",
                cidade: data.localidade ?? "",
                uf: data.uf ?? "",
            }));
        } catch {
            setCepError("CEP não encontrado");
        } finally {
            setCepLoading(false);
        }
    }

    const isValid =
        form.name.trim().length >= 2 &&
        form.phone.replace(/\D/g, "").length >= 10 &&
        form.cep.replace(/\D/g, "").length === 8 &&
        form.rua.length > 0 &&
        form.numero.trim().length > 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;
        onContinue(form);
    };

    return (
        <div style={{ maxWidth: "560px", margin: "0 auto", padding: "0 24px 80px" }}>
            <style>{`@keyframes ldr-spin { to { transform: rotate(360deg); } }`}</style>

            {/* Back */}
            <button type="button" onClick={onBack} style={{
                display: "inline-flex", alignItems: "center", gap: "7px",
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "var(--font-display)", fontSize: "10px",
                letterSpacing: "0.3em", textTransform: "uppercase",
                color: "rgba(28,69,135,0.40)", padding: "0 0 28px",
            }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: 14, height: 14 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                Voltar ao catálogo
            </button>

            {/* Title */}
            <div style={{ marginBottom: "28px" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(28,69,135,0.38)", marginBottom: "6px" }}>
                    Finalizar Pedido · {items.reduce((a, i) => a + i.quantity, 0)} {items.reduce((a, i) => a + i.quantity, 0) === 1 ? "item" : "itens"} · {formatBRL(total)}
                </p>
                <h2 style={{ fontFamily: "var(--font-julius)", fontSize: "clamp(22px, 5vw, 30px)", color: "#1C4587", lineHeight: 1.1 }}>
                    Dados de entrega
                </h2>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <Field label="Seu nome">
                    <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)}
                        placeholder="Como podemos te chamar?" required style={inputCss()} />
                </Field>

                <Field label="Seu WhatsApp">
                    <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)}
                        placeholder="(11) 9xxxx-xxxx" required style={inputCss()} />
                </Field>

                <div style={{ height: "1px", background: "rgba(28,69,135,0.07)", margin: "4px 0" }} />

                <Field label={cepError ? `CEP — ${cepError}` : cepLoading ? "CEP — buscando…" : "CEP"}>
                    <div style={{ position: "relative" }}>
                        <input
                            type="text"
                            value={form.cep}
                            onChange={(e) => handleCep(e.target.value)}
                            placeholder="00000-000"
                            maxLength={9}
                            required
                            style={{ ...inputCss(), borderColor: cepError ? "rgba(220,38,38,0.40)" : "rgba(28,69,135,0.14)" }}
                        />
                        {cepLoading && (
                            <span style={{
                                position: "absolute", right: "16px", top: "calc(50% - 8px)",
                                width: "16px", height: "16px", borderRadius: "50%",
                                border: "2px solid rgba(28,69,135,0.15)", borderTopColor: "#1C4587",
                                animation: "ldr-spin 0.7s linear infinite",
                                display: "block",
                            }} />
                        )}
                    </div>
                </Field>

                <Field label="Logradouro">
                    <input type="text" value={form.rua} readOnly
                        placeholder="Preenchido automaticamente pelo CEP"
                        style={inputCss(!form.rua)} />
                </Field>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px" }}>
                    <Field label="Número">
                        <input type="text" value={form.numero} onChange={(e) => set("numero", e.target.value)}
                            placeholder="Ex: 42" required style={inputCss()} />
                    </Field>
                    <Field label="Complemento (opcional)">
                        <input type="text" value={form.complemento} onChange={(e) => set("complemento", e.target.value)}
                            placeholder="Apto, bloco, casa…" style={inputCss()} />
                    </Field>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <Field label="Bairro">
                        <input type="text" value={form.bairro} readOnly placeholder="Auto" style={inputCss(!form.bairro)} />
                    </Field>
                    <Field label="Cidade / UF">
                        <input type="text" readOnly
                            value={form.cidade && form.uf ? `${form.cidade} / ${form.uf}` : ""}
                            placeholder="Auto" style={inputCss(!(form.cidade && form.uf))} />
                    </Field>
                </div>

                <button type="submit" disabled={!isValid} style={{
                    marginTop: "8px",
                    padding: "16px 24px",
                    borderRadius: "14px",
                    border: "none",
                    background: isValid ? "#1C4587" : "rgba(28,69,135,0.08)",
                    color: isValid ? "#ffffff" : "rgba(28,69,135,0.25)",
                    fontFamily: "var(--font-display)",
                    fontSize: "10px",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    cursor: isValid ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    boxShadow: isValid ? "0 4px 20px rgba(28,69,135,0.25)" : "none",
                }}>
                    Continuar para pagamento
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: 14, height: 14 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </form>
        </div>
    );
}
