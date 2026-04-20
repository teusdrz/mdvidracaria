"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/data/products";
import type { CheckoutData } from "./CheckoutForm";

const WHATSAPP = "5511941123118";
const PIX_KEY = "11941123118"; // chave Pix (celular)

interface CartItem {
    product: Product;
    quantity: number;
}

interface Props {
    items: CartItem[];
    total: number;
    serviceName: string;
    formData: CheckoutData;
    onBack: () => void;
}

function formatBRL(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

const PAYMENT_METHODS = [
    { id: "pix", label: "Pix", desc: "Transferência instantânea" },
] as const;

type PaymentId = (typeof PAYMENT_METHODS)[number]["id"];

const tag: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "9px",
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: "rgba(28,69,135,0.45)",
};

export default function PaymentScreen({ items, total, serviceName, formData, onBack }: Props) {
    const [method, setMethod] = useState<PaymentId | null>(null);
    const [step, setStep] = useState<"select" | "pix">("select");
    const [copied, setCopied] = useState(false);
    const [copiedSelect, setCopiedSelect] = useState(false);

    const sendWhatsApp = () => {
        const label = PAYMENT_METHODS.find((m) => m.id === method)!.label;
        const addrParts = [
            `${formData.rua}, ${formData.numero}`,
            formData.complemento,
            formData.bairro,
            `${formData.cidade} - ${formData.uf}`,
            formData.cep,
        ].filter(Boolean);

        const lines = items.map(
            (i) => `   • ${i.product.name} × ${i.quantity} — ${formatBRL(i.product.price * i.quantity)}`
        );

        const msg =
            `Olá! Sou *${formData.name.trim()}* e gostaria de confirmar um pedido.\n\n` +
            `*Pronta Entrega — ${serviceName}*\n\n` +
            lines.join("\n") +
            `\n\n💰 *Total: ${formatBRL(total)}*` +
            `\n\n📦 *Endereço:* ${addrParts.join(", ")}` +
            `\n💳 *Pagamento:* ${label}${method === "pix" ? `\n🔑 *Chave Pix:* ${PIX_KEY}` : ""}` +
            `\n📱 *WhatsApp:* ${formData.phone.trim()}` +
            `\n\nAguardo o retorno. Obrigado!`;

        window.open(
            `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`,
            "_blank",
            "noopener,noreferrer"
        );
    };

    const handleConfirm = () => {
        if (!method) return;
        if (method === "pix") {
            setStep("pix");
        } else {
            sendWhatsApp();
        }
    };

    return (
        <div style={{ maxWidth: "560px", margin: "0 auto", padding: "0 24px 80px" }}>

            {/* ─── PIX SCREEN ─── */}
            {step === "pix" ? (
                <>
                    {/* Back */}
                    <button type="button" onClick={() => setStep("select")} style={{
                        display: "inline-flex", alignItems: "center", gap: "7px",
                        background: "none", border: "none", cursor: "pointer",
                        fontFamily: "var(--font-display)", fontSize: "10px",
                        letterSpacing: "0.3em", textTransform: "uppercase",
                        color: "rgba(28,69,135,0.40)", padding: "0 0 28px",
                    }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: 14, height: 14 }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                        </svg>
                        Voltar ao pagamento
                    </button>

                    <div style={{ marginBottom: "28px" }}>
                        <p style={{ ...tag, marginBottom: "6px" }}>Pix · Transferência instantânea</p>
                        <h2 style={{ fontFamily: "var(--font-julius)", fontSize: "clamp(22px, 5vw, 30px)", color: "#1C4587", lineHeight: 1.1 }}>
                            Dados para pagamento
                        </h2>
                    </div>

                    {/* Total */}
                    <div style={{ background: "#ffffff", borderRadius: "16px", border: "1.5px solid rgba(28,69,135,0.08)", padding: "16px 20px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p style={{ ...tag }}>Total a pagar</p>
                        <p style={{ fontFamily: "var(--font-julius)", fontSize: "24px", color: "#1C4587" }}>{formatBRL(total)}</p>
                    </div>

                    {/* PIX Key card */}
                    <div style={{ background: "#f0f5ff", borderRadius: "20px", border: "1.5px solid rgba(28,69,135,0.10)", padding: "28px 24px", marginBottom: "16px", textAlign: "center" }}>
                        {/* PIX icon */}
                        <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "#1C4587", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                            <svg viewBox="0 0 24 24" fill="none" style={{ width: 26, height: 26 }}>
                                <path d="M6.5 17.5L2 13l4.5-4.5M17.5 6.5L22 11l-4.5 4.5M14.5 3l-5 18" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <p style={{ fontFamily: "var(--font-display)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(28,69,135,0.45)", marginBottom: "8px" }}>
                            Chave Pix (celular)
                        </p>
                        <p style={{ fontFamily: "var(--font-julius)", fontSize: "22px", color: "#1C4587", letterSpacing: "0.05em", marginBottom: "16px" }}>
                            (11) 94112-3118
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                navigator.clipboard.writeText(PIX_KEY).catch(() => { });
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2500);
                            }}
                            style={{
                                display: "inline-flex", alignItems: "center", gap: "7px",
                                padding: "10px 20px", borderRadius: "10px",
                                border: "1.5px solid rgba(28,69,135,0.20)",
                                background: copied ? "#1C4587" : "#ffffff",
                                color: copied ? "#ffffff" : "#1C4587",
                                fontFamily: "var(--font-display)", fontSize: "9px",
                                letterSpacing: "0.20em", textTransform: "uppercase",
                                cursor: "pointer", transition: "all 0.2s ease",
                            }}
                        >
                            {copied ? (
                                <>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 13, height: 13 }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Copiado!
                                </>
                            ) : (
                                <>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 13, height: 13 }}>
                                        <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                                    </svg>
                                    Copiar chave
                                </>
                            )}
                        </button>
                    </div>

                    <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(28,69,135,0.45)", textAlign: "center", marginBottom: "24px", lineHeight: 1.6 }}>
                        Após realizar o pagamento, clique em <strong>Confirmar via WhatsApp</strong><br />
                        e envie o comprovante para agilizarmos sua entrega.
                    </p>

                    {/* Send WhatsApp */}
                    <button
                        type="button"
                        onClick={sendWhatsApp}
                        style={{
                            width: "100%", padding: "17px 24px", borderRadius: "14px", border: "none",
                            background: "#25D366", color: "#ffffff",
                            fontFamily: "var(--font-display)", fontSize: "10px",
                            letterSpacing: "0.22em", textTransform: "uppercase",
                            cursor: "pointer", display: "flex", alignItems: "center",
                            justifyContent: "center", gap: "10px",
                            boxShadow: "0 4px 20px rgba(37,211,102,0.35)",
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}>
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Confirmar pedido via WhatsApp
                    </button>
                </>
            ) : (
                <>
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
                        Voltar ao formulário
                    </button>

                    {/* Title */}
                    <div style={{ marginBottom: "28px" }}>
                        <p style={{ ...tag, marginBottom: "6px" }}>Pagamento</p>
                        <h2 style={{ fontFamily: "var(--font-julius)", fontSize: "clamp(22px, 5vw, 30px)", color: "#1C4587", lineHeight: 1.1 }}>
                            Como vai pagar?
                        </h2>
                    </div>

                    {/* Order summary */}
                    <div style={{ background: "#ffffff", borderRadius: "20px", border: "1.5px solid rgba(28,69,135,0.08)", overflow: "hidden", marginBottom: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(28,69,135,0.07)" }}>
                            <p style={tag}>Resumo do pedido</p>
                        </div>
                        {items.map((item) => (
                            <div key={item.product.id} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 20px", borderBottom: "1px solid rgba(28,69,135,0.05)" }}>
                                <div style={{ width: "48px", height: "48px", borderRadius: "10px", overflow: "hidden", flexShrink: 0, position: "relative", background: "rgba(28,69,135,0.04)" }}>
                                    {item.product.image && (
                                        <Image src={item.product.image} alt={item.product.name} fill style={{ objectFit: "cover" }} sizes="48px" />
                                    )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontFamily: "var(--font-julius)", fontSize: "13px", color: "#1C1C1C", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {item.product.name}
                                    </p>
                                    <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(28,69,135,0.40)", marginTop: "2px" }}>
                                        Qtd: {item.quantity}
                                    </p>
                                </div>
                                <p style={{ fontFamily: "var(--font-julius)", fontSize: "14px", color: "#1C4587", flexShrink: 0 }}>
                                    {formatBRL(item.product.price * item.quantity)}
                                </p>
                            </div>
                        ))}
                        <div style={{ padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(28,69,135,0.02)" }}>
                            <p style={tag}>Total</p>
                            <p style={{ fontFamily: "var(--font-julius)", fontSize: "22px", color: "#1C4587" }}>{formatBRL(total)}</p>
                        </div>
                    </div>

                    {/* Address summary */}
                    <div style={{ background: "#ffffff", borderRadius: "16px", border: "1.5px solid rgba(28,69,135,0.08)", padding: "16px 20px", marginBottom: "20px" }}>
                        <p style={{ ...tag, marginBottom: "10px" }}>Endereço de entrega</p>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#1C1C1C", lineHeight: 1.6 }}>
                            {formData.rua}, {formData.numero}
                            {formData.complemento ? ` — ${formData.complemento}` : ""}
                            <br />
                            {formData.bairro} · {formData.cidade} / {formData.uf}
                            <br />
                            <span style={{ color: "rgba(28,69,135,0.45)", fontSize: "12px" }}>{formData.cep}</span>
                        </p>
                    </div>

                    {/* Payment methods */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                        {PAYMENT_METHODS.map((pm) => {
                            const selected = method === pm.id;
                            return (
                                <button
                                    key={pm.id}
                                    type="button"
                                    onClick={() => setMethod(pm.id)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "14px",
                                        padding: "16px 20px",
                                        borderRadius: "16px",
                                        border: selected ? "2px solid #1C4587" : "1.5px solid rgba(28,69,135,0.14)",
                                        background: selected ? "rgba(28,69,135,0.04)" : "#ffffff",
                                        cursor: "pointer",
                                        textAlign: "left",
                                        transition: "all 0.15s ease",
                                    }}
                                >
                                    {/* Radio dot */}
                                    <span style={{
                                        width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                                        border: selected ? "6px solid #1C4587" : "2px solid rgba(28,69,135,0.25)",
                                        background: "#ffffff",
                                        transition: "all 0.15s ease",
                                    }} />
                                    <div>
                                        <p style={{ fontFamily: "var(--font-julius)", fontSize: "14px", color: selected ? "#1C4587" : "#1C1C1C" }}>
                                            {pm.label}
                                        </p>
                                        <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(28,69,135,0.45)", marginTop: "2px" }}>
                                            {pm.desc}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* PIX copy card (shown when PIX is selected) */}
                    {method === "pix" && (
                        <div style={{
                            background: "#f0f5ff",
                            borderRadius: "16px",
                            border: "1.5px solid rgba(28,69,135,0.14)",
                            padding: "18px 20px",
                            marginBottom: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "12px",
                        }}>
                            <div>
                                <p style={{ fontFamily: "var(--font-display)", fontSize: "9px", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(28,69,135,0.45)", marginBottom: "4px" }}>
                                    Chave Pix
                                </p>
                                <p style={{ fontFamily: "var(--font-julius)", fontSize: "15px", color: "#1C4587", letterSpacing: "0.04em" }}>
                                    (11) 94112-3118
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    navigator.clipboard.writeText(PIX_KEY).catch(() => { });
                                    setCopiedSelect(true);
                                    setTimeout(() => setCopiedSelect(false), 2500);
                                }}
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: "6px",
                                    padding: "9px 16px", borderRadius: "10px", flexShrink: 0,
                                    border: "1.5px solid rgba(28,69,135,0.20)",
                                    background: copiedSelect ? "#1C4587" : "#ffffff",
                                    color: copiedSelect ? "#ffffff" : "#1C4587",
                                    fontFamily: "var(--font-display)", fontSize: "9px",
                                    letterSpacing: "0.18em", textTransform: "uppercase",
                                    cursor: "pointer", transition: "all 0.2s ease",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {copiedSelect ? (
                                    <>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 12, height: 12 }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Copiado!
                                    </>
                                ) : (
                                    <>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 12, height: 12 }}>
                                            <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                                        </svg>
                                        Copiar chave
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Confirm */}
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!method}
                        style={{
                            width: "100%",
                            padding: "17px 24px",
                            borderRadius: "14px",
                            border: "none",
                            background: method ? "#25D366" : "rgba(28,69,135,0.08)",
                            color: method ? "#ffffff" : "rgba(28,69,135,0.25)",
                            fontFamily: "var(--font-display)",
                            fontSize: "10px",
                            letterSpacing: "0.22em",
                            textTransform: "uppercase",
                            cursor: method ? "pointer" : "not-allowed",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px",
                            boxShadow: method ? "0 4px 20px rgba(37,211,102,0.35)" : "none",
                            transition: "all 0.2s ease",
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}>
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Confirmar pedido via WhatsApp
                    </button>
                </>
            )}
        </div>
    );
}
