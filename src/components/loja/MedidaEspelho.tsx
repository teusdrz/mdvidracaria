"use client";

import { useState, useMemo } from "react";

const WHATSAPP = "5511941123118";

const TIPOS = [
    { id: "lapidado", label: "Espelho Lapidado", precoM2: 450 },
    { id: "bisote", label: "Espelho Bisotê", precoM2: 500 },
] as const;

type TipoId = (typeof TIPOS)[number]["id"];

function formatBRL(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const tag: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "9px",
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: "rgba(28,69,135,0.45)",
};

export default function MedidaEspelho() {
    const [tipo, setTipo] = useState<TipoId | null>(null);
    const [largura, setLargura] = useState("");
    const [altura, setAltura] = useState("");

    const larg = parseFloat(largura.replace(",", ".")) || 0;
    const alt = parseFloat(altura.replace(",", ".")) || 0;
    const area = larg * alt;

    const precoM2 = useMemo(
        () => TIPOS.find((t) => t.id === tipo)?.precoM2 ?? 0,
        [tipo],
    );

    const total = area * precoM2;
    const valid = tipo && larg > 0 && alt > 0;

    const handleWhatsApp = () => {
        if (!valid) return;
        const tipoLabel = TIPOS.find((t) => t.id === tipo)!.label;

        const msg =
            `Olá! Gostaria de solicitar um espelho *por medida*.\n\n` +
            `🪞 *Tipo:* ${tipoLabel}\n` +
            `📐 *Dimensões:* ${largura}m × ${altura}m\n` +
            `📏 *Área:* ${area.toFixed(2)} m²\n` +
            `💰 *Valor estimado:* ${formatBRL(total)}\n\n` +
            `Aguardo retorno. Obrigado!`;

        window.open(
            `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`,
            "_blank",
            "noopener,noreferrer",
        );
    };

    return (
        <div
            style={{
                marginTop: "48px",
                padding: "32px 28px",
                borderRadius: "20px",
                border: "1.5px solid rgba(28,69,135,0.12)",
                background: "#ffffff",
                boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
            }}
        >
            {/* Title */}
            <p style={tag}>Espelho por medida</p>
            <p
                style={{
                    fontFamily: "var(--font-julius)",
                    fontSize: "20px",
                    color: "#1C1C1C",
                    margin: "8px 0 4px",
                }}
            >
                Solicite no tamanho ideal
            </p>
            <p
                style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    color: "rgba(28,69,135,0.45)",
                    marginBottom: "24px",
                    lineHeight: 1.5,
                }}
            >
                Informe o tipo e as dimensões desejadas. O valor é calculado por metro quadrado.
            </p>

            {/* Tipo selection */}
            <p style={{ ...tag, marginBottom: "10px" }}>Tipo do espelho</p>
            <div style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
                {TIPOS.map((t) => {
                    const sel = tipo === t.id;
                    return (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => setTipo(t.id)}
                            style={{
                                flex: "1 1 0",
                                minWidth: "140px",
                                padding: "14px 16px",
                                borderRadius: "14px",
                                border: sel
                                    ? "2px solid #1C4587"
                                    : "1.5px solid rgba(28,69,135,0.14)",
                                background: sel ? "rgba(28,69,135,0.04)" : "#ffffff",
                                cursor: "pointer",
                                textAlign: "left",
                                transition: "all 0.18s ease",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "var(--font-julius)",
                                    fontSize: "14px",
                                    color: sel ? "#1C4587" : "#1C1C1C",
                                    display: "block",
                                }}
                            >
                                {t.label}
                            </span>
                            <span
                                style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: "11px",
                                    color: "rgba(28,69,135,0.45)",
                                }}
                            >
                                {formatBRL(t.precoM2)} / m²
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Dimensions */}
            <p style={{ ...tag, marginBottom: "10px" }}>Dimensões (em metros)</p>
            <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
                <div style={{ flex: 1 }}>
                    <label
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "11px",
                            color: "rgba(28,69,135,0.55)",
                            marginBottom: "5px",
                            display: "block",
                        }}
                    >
                        Largura (m)
                    </label>
                    <input
                        type="text"
                        inputMode="decimal"
                        placeholder="0.80"
                        value={largura}
                        onChange={(e) => setLargura(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "14px 16px",
                            borderRadius: "12px",
                            border: "1.5px solid rgba(28,69,135,0.14)",
                            background: "#ffffff",
                            fontFamily: "var(--font-body)",
                            fontSize: "14px",
                            color: "#1C1C1C",
                            outline: "none",
                            boxSizing: "border-box",
                        }}
                    />
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-end",
                        paddingBottom: "16px",
                        fontFamily: "var(--font-julius)",
                        fontSize: "16px",
                        color: "rgba(28,69,135,0.30)",
                    }}
                >
                    ×
                </div>
                <div style={{ flex: 1 }}>
                    <label
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "11px",
                            color: "rgba(28,69,135,0.55)",
                            marginBottom: "5px",
                            display: "block",
                        }}
                    >
                        Altura (m)
                    </label>
                    <input
                        type="text"
                        inputMode="decimal"
                        placeholder="1.10"
                        value={altura}
                        onChange={(e) => setAltura(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "14px 16px",
                            borderRadius: "12px",
                            border: "1.5px solid rgba(28,69,135,0.14)",
                            background: "#ffffff",
                            fontFamily: "var(--font-body)",
                            fontSize: "14px",
                            color: "#1C1C1C",
                            outline: "none",
                            boxSizing: "border-box",
                        }}
                    />
                </div>
            </div>

            {/* Result */}
            {valid && (
                <div
                    style={{
                        padding: "18px 20px",
                        borderRadius: "14px",
                        background: "rgba(28,69,135,0.03)",
                        border: "1px solid rgba(28,69,135,0.08)",
                        marginBottom: "20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(28,69,135,0.55)" }}>
                            Área total
                        </span>
                        <span style={{ fontFamily: "var(--font-julius)", fontSize: "13px", color: "#1C1C1C" }}>
                            {area.toFixed(2)} m²
                        </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(28,69,135,0.55)" }}>
                            Preço / m²
                        </span>
                        <span style={{ fontFamily: "var(--font-julius)", fontSize: "13px", color: "#1C1C1C" }}>
                            {formatBRL(precoM2)}
                        </span>
                    </div>
                    <div
                        style={{
                            borderTop: "1px solid rgba(28,69,135,0.08)",
                            paddingTop: "8px",
                            marginTop: "4px",
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(28,69,135,0.55)" }}>
                            Valor estimado
                        </span>
                        <span style={{ fontFamily: "var(--font-julius)", fontSize: "20px", color: "#1C4587" }}>
                            {formatBRL(total)}
                        </span>
                    </div>
                </div>
            )}

            {/* WhatsApp CTA */}
            <button
                type="button"
                disabled={!valid}
                onClick={handleWhatsApp}
                style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "14px",
                    background: valid ? "#25D366" : "rgba(28,69,135,0.08)",
                    color: valid ? "#ffffff" : "rgba(28,69,135,0.28)",
                    border: "none",
                    cursor: valid ? "pointer" : "not-allowed",
                    fontFamily: "var(--font-display)",
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    transition: "all 0.2s ease",
                    boxShadow: valid ? "0 4px 20px rgba(37,211,102,0.30)" : "none",
                }}
            >
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.243-1.214l-.257-.154-2.871.854.854-2.871-.154-.257A8 8 0 1112 20z" />
                </svg>
                Solicitar via WhatsApp
            </button>
        </div>
    );
}
