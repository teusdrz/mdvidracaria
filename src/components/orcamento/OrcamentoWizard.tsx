"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { services } from "@/data/services";

gsap.registerPlugin(useGSAP);

// ─── Constants ───────────────────────────────────────────────────────────────

const WHATSAPP_NUMBER = "5511941123118";
const TOTAL_STEPS = 6;

const STEP_TITLES = [
    "Qual serviço você precisa?",
    "Como você prefere receber?",
    "Quais são as dimensões?",
    "Personalize seu pedido",
    "Seus dados de contato",
    "Revise e envie",
];

const STEP_SUBTITLES = [
    "Selecione o tipo de serviço desejado",
    "Escolha a forma de aquisição do seu produto",
    "Informe as medidas para o cálculo da área",
    "Escolha as especificações do seu projeto",
    "Para enviarmos o orçamento pelo WhatsApp",
    "Confirme tudo e envie para orçamento",
];

// Services measured in linear meters
const LINEAR_SERVICES = new Set(["guarda-corpo", "sacada", "cobertura"]);

// Per-service customization options
const DETALHES: Record<string, { label: string; key: string; options: string[] }[]> = {
    "box-de-vidro": [
        { label: "Tipo de vidro", key: "vidro", options: ["Incolor", "Fumê", "Serigrafado"] },
        { label: "Espessura", key: "espessura", options: ["8mm", "10mm"] },
        { label: "Modelo", key: "modelo", options: ["Box de canto", "Box frontal", "Box em L"] },
    ],
    "espelhos": [
        { label: "Acabamento", key: "acabamento", options: ["Lapidado", "Bisotado"] },
        { label: "Formato", key: "formato", options: ["Retangular", "Redondo", "Irregular"] },
        { label: "Ambiente", key: "ambiente", options: ["Banheiro", "Sala", "Closet", "Outro"] },
    ],
    "guarda-corpo": [
        { label: "Fixação", key: "fixacao", options: ["Bottons", "Perfil U", "Perfil lateral"] },
        { label: "Tipo de vidro", key: "vidro", options: ["Temperado", "Laminado"] },
        { label: "Acabamento", key: "acabamento", options: ["Alumínio natural", "Alumínio preto", "Inox"] },
    ],
    "sacada": [
        { label: "Sistema", key: "sistema", options: ["Cortina de vidro", "Fixo"] },
        { label: "Cor do perfil", key: "perfil", options: ["Preto", "Branco", "Alumínio natural"] },
        { label: "Vidro", key: "vidro", options: ["Incolor", "Fumê"] },
    ],
    "divisorias": [
        { label: "Modelo", key: "modelo", options: ["Sem porta", "Com porta de correr", "Com porta de abrir"] },
        { label: "Tipo de vidro", key: "vidro", options: ["Temperado", "Laminado"] },
        { label: "Perfil", key: "perfil", options: ["Alumínio natural", "Alumínio preto", "Sem perfil"] },
    ],
    "cobertura": [
        { label: "Material", key: "material", options: ["Vidro laminado", "Policarbonato"] },
        { label: "Estrutura", key: "estrutura", options: ["Alumínio", "Aço inox"] },
        { label: "Inclinação", key: "inclinacao", options: ["Plana", "Inclinada"] },
    ],
    "envelopamento-e-peliculas": [
        { label: "Tipo de película", key: "tipo", options: ["Controle solar", "Segurança", "Decorativa", "Jateada", "Antivandalismo"] },
        { label: "Aplicação", key: "aplicacao", options: ["Residencial", "Comercial"] },
    ],
};

// Preços base por unidade (m² ou metro linear)
// Faixa: mínimo – referência para estimativa
const PRECOS: Record<string, { min: number; max: number; unidade: string }> = {
    "box-de-vidro": { min: 420, max: 680, unidade: "m²" },
    "espelhos": { min: 280, max: 520, unidade: "m²" },
    "guarda-corpo": { min: 680, max: 1100, unidade: "ml" },
    "envelopamento-e-peliculas": { min: 90, max: 220, unidade: "m²" },
    "divisorias": { min: 380, max: 640, unidade: "m²" },
    "sacada": { min: 750, max: 1300, unidade: "ml" },
    "cobertura": { min: 550, max: 950, unidade: "m²" },
};

// Chave PIX para pagamento antecipado (celular)
const PIX_CHAVE = "11941123118";
const PIX_CHAVE_MASCARADA = "(11) *****-****";
const PIX_TITULAR = "MC Vidracaria";
const PARCELAMENTO_MAX = 6;

function formatBRL(value: number) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}



function ajustarMedidaRetangularCm(metros: number): number {
    const cm = Math.round(metros * 100);
    if (cm <= 0) return 0;
    return Math.ceil(cm / 5) * 5;
}

function ajustarMedidaEspecialCm(metros: number): number {
    const cm = Math.round(metros * 100);
    if (cm <= 0) return 0;
    if (cm % 5 === 0) return cm;
    return Math.ceil(cm / 5) * 5 + 10;
}

const ESPELHO_MARKUP_ESPECIAL = 1.20; // +20% apenas para redondo/irregular

// ─── Sub-components ──────────────────────────────────────────────────────────

function ServiceIcon({ slug }: { slug: string }) {
    const icons: Record<string, React.ReactNode> = {
        "espelhos": (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: 22, height: 22 }}>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 3v9H3M21 15v6H3v-6" strokeDasharray="3 2" />
            </svg>
        ),
        "box-de-vidro": (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: 22, height: 22 }}>
                <path d="M4 4h16v16H4V4z" />
                <path d="M4 4l4 4M20 4l-4 4M4 20l4-4M20 20l-4-4" />
            </svg>
        ),
        "guarda-corpo": (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: 22, height: 22 }}>
                <path d="M3 20h18M6 20V10M10 20V10M14 20V10M18 20V10M3 10h18" />
            </svg>
        ),
        "envelopamento-e-peliculas": (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: 22, height: 22 }}>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M3 15h18M12 3v18" strokeDasharray="3 2" />
            </svg>
        ),
        "divisorias": (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: 22, height: 22 }}>
                <path d="M12 3v18M3 3h18v18H3V3z" />
                <path d="M3 12h9" />
            </svg>
        ),
        "sacada": (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: 22, height: 22 }}>
                <path d="M3 10l9-7 9 7v10a1 1 0 01-1 1H4a1 1 0 01-1-1V10z" />
                <path d="M9 21V12h6v9" />
            </svg>
        ),
        "cobertura": (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: 22, height: 22 }}>
                <path d="M3 11l9-8 9 8" />
                <path d="M5 9.5V20h14V9.5" />
                <path d="M10 20v-6h4v6" />
            </svg>
        ),
    };
    return (
        <>
            {icons[slug] ?? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: 22, height: 22 }}>
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                </svg>
            )}
        </>
    );
}

function NumberInput({
    label, value, onChange, unit, placeholder,
}: {
    label: string; value: string; onChange: (v: string) => void; unit: string; placeholder: string;
}) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{
                fontFamily: "var(--font-display)", fontSize: "10px",
                letterSpacing: "0.25em", textTransform: "uppercase" as const,
                color: "rgba(28, 69, 135, 0.50)",
            }}>
                {label}
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                    type="number"
                    inputMode="decimal"
                    min="0.01"
                    max="999"
                    step="0.01"
                    value={value}
                    placeholder={placeholder}
                    onChange={e => onChange(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "18px 60px 18px 20px",
                        fontFamily: "var(--font-julius)",
                        fontSize: "24px",
                        color: "#1C4587",
                        background: "rgba(28, 69, 135, 0.03)",
                        border: "1.5px solid rgba(28, 69, 135, 0.15)",
                        borderRadius: "16px",
                        outline: "none",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                        WebkitAppearance: "none",
                        MozAppearance: "textfield" as unknown as undefined,
                    }}
                    onFocus={e => {
                        e.target.style.borderColor = "#1C4587";
                        e.target.style.boxShadow = "0 0 0 3px rgba(28,69,135,0.08)";
                    }}
                    onBlur={e => {
                        e.target.style.borderColor = "rgba(28, 69, 135, 0.15)";
                        e.target.style.boxShadow = "none";
                    }}
                />
                <span style={{
                    position: "absolute", right: "18px",
                    fontFamily: "var(--font-display)", fontSize: "11px",
                    letterSpacing: "0.1em", color: "rgba(28, 69, 135, 0.40)",
                    pointerEvents: "none",
                }}>
                    {unit}
                </span>
            </div>
        </div>
    );
}

function PillGroup({ label, options, selected, onSelect }: {
    label: string; options: string[]; selected: string; onSelect: (v: string) => void;
}) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{
                fontFamily: "var(--font-display)", fontSize: "10px",
                letterSpacing: "0.28em", textTransform: "uppercase" as const,
                color: "rgba(28, 69, 135, 0.50)",
            }}>
                {label}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "10px" }}>
                {options.map(opt => (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => onSelect(opt)}
                        style={{
                            padding: "10px 22px",
                            borderRadius: "100px",
                            fontFamily: "var(--font-display)",
                            fontSize: "10px",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase" as const,
                            cursor: "pointer",
                            transition: "all 0.22s ease",
                            border: selected === opt ? "1.5px solid #1C4587" : "1.5px solid rgba(28, 69, 135, 0.15)",
                            background: selected === opt ? "#1C4587" : "rgba(255,255,255,0.8)",
                            color: selected === opt ? "#ffffff" : "rgba(28, 69, 135, 0.60)",
                            boxShadow: selected === opt ? "0 2px 10px rgba(28,69,135,0.2)" : "none",
                        }}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}

function SummaryRow({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "14px", flexShrink: 0, marginTop: "2px" }}>{icon}</span>
            <div>
                <p style={{
                    fontFamily: "var(--font-display)", fontSize: "9px",
                    letterSpacing: "0.28em", textTransform: "uppercase" as const,
                    color: "rgba(28, 69, 135, 0.40)", marginBottom: "3px",
                }}>
                    {label}
                </p>
                <p style={{
                    fontFamily: "var(--font-body)", fontSize: "13px",
                    color: "#1c1c1c", lineHeight: 1.5,
                }}>
                    {value}
                </p>
            </div>
        </div>
    );
}

// ─── Wizard ──────────────────────────────────────────────────────────────────

interface Props {
    initialServico?: string;
}

interface FormState {
    servicoSlug: string;
    modalidade: "" | "medida" | "pronta";
    largura: string;
    altura: string;
    metros: string;
    detalhes: Record<string, string>;
    observacoes: string;
    nome: string;
    telefone: string;
    whatsapp: string;
}

export default function OrcamentoWizard({ initialServico }: Props) {
    const validSlug = services.some(s => s.slug === initialServico) ? initialServico! : "";
    const router = useRouter();

    const [step, setStep] = useState(validSlug ? 1 : 0);
    const [parcelas, setParcelas] = useState<number>(1);
    const [tipoPagamento, setTipoPagamento] = useState<"total" | "sinal">("sinal");
    const [form, setForm] = useState<FormState>({
        servicoSlug: validSlug,
        modalidade: "",
        largura: "",
        altura: "",
        metros: "",
        detalhes: {},
        observacoes: "",
        nome: "",
        telefone: "",
        whatsapp: "",
    });

    const wrapperRef = useRef<HTMLDivElement>(null);
    const stepRef = useRef<HTMLDivElement>(null);

    // Page entrance
    useGSAP(() => {
        gsap.fromTo(wrapperRef.current,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
        );
    }, { scope: wrapperRef });

    // Scroll to top on step change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [step]);

    const goToStep = (next: number) => {
        const el = stepRef.current;
        if (!el) { setStep(next); return; }
        const dir = next > step ? 1 : -1;
        gsap.to(el, {
            x: dir * -48,
            opacity: 0,
            duration: 0.22,
            ease: "power2.in",
            onComplete: () => {
                setStep(next);
                gsap.fromTo(el,
                    { x: dir * 48, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.35, ease: "power3.out" }
                );
            },
        });
    };

    const selectedService = services.find(s => s.slug === form.servicoSlug);
    const isLinear = LINEAR_SERVICES.has(form.servicoSlug);
    const area = isLinear
        ? parseFloat(form.metros) || 0
        : (parseFloat(form.largura) || 0) * (parseFloat(form.altura) || 0);

    const canProceed = (): boolean => {
        if (step === 0) return !!form.servicoSlug;
        if (step === 1) return form.modalidade === "medida";
        if (step === 2) {
            if (isLinear) return parseFloat(form.metros) > 0;
            return parseFloat(form.largura) > 0 && parseFloat(form.altura) > 0;
        }
        if (step === 4) return form.nome.trim().length > 0 && (form.whatsapp.trim().length > 0 || form.telefone.trim().length > 0);
        return true;
    };

    const preco = PRECOS[form.servicoSlug];
    const estimativaMin = preco ? Math.round(preco.min * area) : 0;
    const estimativaMax = preco ? Math.round(preco.max * area) : 0;

    // Step 3 — preço reativo baseado nas opções selecionadas
    const acabamentoSel = form.detalhes["acabamento"];
    const precoEspelhoUnit =
        form.servicoSlug === "espelhos" && acabamentoSel === "Lapidado" ? 400 :
            form.servicoSlug === "espelhos" && acabamentoSel === "Bisotado" ? 470 :
                null;

    // Espelhos: regra varia conforme formato
    const formatoEspelho = form.detalhes["formato"] ?? "Retangular";
    const isEspelhoEspecial = form.servicoSlug === "espelhos" && (formatoEspelho === "Redondo" || formatoEspelho === "Irregular");
    const ajustarCm = isEspelhoEspecial ? ajustarMedidaEspecialCm : ajustarMedidaRetangularCm;
    const espelhoLargCm = form.servicoSlug === "espelhos" ? ajustarCm(parseFloat(form.largura) || 0) : 0;
    const espelhoAltCm = form.servicoSlug === "espelhos" ? ajustarCm(parseFloat(form.altura) || 0) : 0;
    const espelhoAreaCobrada = (espelhoLargCm * espelhoAltCm) / 10000;
    const espelhoMarkup = isEspelhoEspecial ? ESPELHO_MARKUP_ESPECIAL : 1;
    const espelhoTotal = precoEspelhoUnit !== null
        ? Math.round(espelhoAreaCobrada * precoEspelhoUnit * espelhoMarkup)
        : 0;

    const step3Estimativa = area > 0 && preco
        ? precoEspelhoUnit !== null && espelhoTotal > 0
            ? {
                label: formatBRL(espelhoTotal),
                sub: `${(espelhoLargCm / 100).toFixed(2)}×${(espelhoAltCm / 100).toFixed(2)}m · R$${precoEspelhoUnit}/m²${isEspelhoEspecial ? " +20%" : ""}`,
            }
            : estimativaMin > 0
                ? { label: `${formatBRL(estimativaMin)} – ${formatBRL(estimativaMax)}`, sub: "estimativa" }
                : null
        : null;

    const buildWhatsAppMessage = () => {
        const svc = selectedService?.title ?? "";
        const isEspelhoComPreco = form.servicoSlug === "espelhos" && espelhoTotal > 0;
        const medidas = isLinear
            ? `${parseFloat(form.metros).toFixed(2)}m linear`
            : isEspelhoComPreco
                ? `${parseFloat(form.largura).toFixed(2)}m × ${parseFloat(form.altura).toFixed(2)}m (cobrado: ${(espelhoLargCm / 100).toFixed(2)}m × ${(espelhoAltCm / 100).toFixed(2)}m — ${espelhoAreaCobrada.toFixed(2)} m²)`
                : `${parseFloat(form.largura).toFixed(2)}m × ${parseFloat(form.altura).toFixed(2)}m — ${area.toFixed(2)} m²`;
        const groups = DETALHES[form.servicoSlug] ?? [];
        const specsLines = Object.entries(form.detalhes)
            .filter(([, v]) => v)
            .map(([key, v]) => {
                const found = groups.find(g => g.key === key);
                return `   • ${found?.label ?? key}: *${v}*`;
            })
            .join("\n");
        const obs = form.observacoes ? `\n\n📝 *Observações:*\n   ${form.observacoes}` : "";
        const estFx = isEspelhoComPreco
            ? `\n💰 *Valor estimado:* ${formatBRL(espelhoTotal)} _(R$${precoEspelhoUnit}/m² × área cobrada${isEspelhoEspecial ? " + 20% corte especial" : ""})_`
            : estimativaMin > 0
                ? `\n💰 *Estimativa preliminar:* ${formatBRL(estimativaMin)} – ${formatBRL(estimativaMax)} _(confirmado após visita técnica)_`
                : "";
        const contatoWa = form.whatsapp ? `\n📱 *WhatsApp:* ${form.whatsapp}` : "";
        const contatoTel = form.telefone ? `\n📞 *Telefone:* ${form.telefone}` : "";

        const msg =
            `Olá! Gostaria de solicitar um *orçamento*. Seguem os detalhes:\n` +
            `\n👤 *Nome:* ${form.nome}${contatoWa}${contatoTel}` +
            `\n\n🔧 *Serviço:* ${svc}` +
            `\n📐 *Dimensões:* ${medidas}` +
            `${estFx}` +
            `${specsLines ? `\n\n✅ *Especificações:*\n${specsLines}` : ""}` +
            `${obs}` +
            `\n\nAguardo o retorno. Obrigado!`;

        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    };

    // ── Step 0 — Serviço ─────────────────────────────────────────────────────
    const renderStep0 = () => (
        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "12px",
        }}>
            {services.map(svc => {
                const sel = form.servicoSlug === svc.slug;
                return (
                    <button
                        key={svc.slug}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, servicoSlug: svc.slug, modalidade: "", detalhes: {} }))}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: "14px",
                            padding: "18px 16px",
                            borderRadius: "18px",
                            border: sel ? "2px solid #1C4587" : "1.5px solid rgba(28, 69, 135, 0.10)",
                            background: sel ? "rgba(28, 69, 135, 0.05)" : "#ffffff",
                            boxShadow: sel
                                ? "0 4px 24px rgba(28,69,135,0.14)"
                                : "0 2px 8px rgba(0,0,0,0.04)",
                            cursor: "pointer",
                            transition: "all 0.22s ease",
                            textAlign: "left",
                        }}
                    >
                        <div style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: sel ? "#1C4587" : "rgba(28, 69, 135, 0.07)",
                            color: sel ? "#ffffff" : "#1C4587",
                            transition: "all 0.22s ease",
                            flexShrink: 0,
                        }}>
                            <ServiceIcon slug={svc.slug} />
                        </div>
                        <div>
                            <p style={{
                                fontFamily: "var(--font-julius)",
                                fontSize: "12px",
                                color: sel ? "#1C4587" : "#1C1C1C",
                                marginBottom: "4px",
                                lineHeight: 1.3,
                            }}>
                                {svc.title}
                            </p>
                            <p style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "10px",
                                color: "rgba(28, 69, 135, 0.40)",
                                lineHeight: 1.4,
                            }}>
                                {svc.subtitle}
                            </p>
                        </div>
                    </button>
                );
            })}
        </div>
    );

    // ── Step 1 — Medidas ─────────────────────────────────────────────────────
    const renderStep1 = () => {
        const w = parseFloat(form.largura) || 0;
        const h = parseFloat(form.altura) || 0;
        const m = parseFloat(form.metros) || 0;
        const computed = isLinear ? m : w * h;

        // Scale rectangle to max 240×180 while keeping aspect ratio
        const maxW = 240, maxH = 180;
        let rW = maxW * 0.5, rH = maxH * 0.5;
        if (!isLinear && w > 0 && h > 0) {
            const ratio = w / h;
            if (ratio > maxW / maxH) { rW = maxW; rH = maxW / ratio; }
            else { rH = maxH; rW = maxH * ratio; }
            rW = Math.max(rW, 60);
            rH = Math.max(rH, 60);
        }

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
                {/* Visual */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "200px",
                    gap: "16px",
                }}>
                    {isLinear ? (
                        <>
                            <div style={{
                                position: "relative",
                                width: `${Math.max(Math.min(m * 30, 300), 80)}px`,
                                height: "14px",
                                transition: "width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                            }}>
                                <div style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: 0,
                                    right: 0,
                                    height: "2px",
                                    background: "#1C4587",
                                    transform: "translateY(-50%)",
                                    borderRadius: "1px",
                                }} />
                                <div style={{ position: "absolute", top: 0, left: 0, width: "2px", height: "14px", background: "#1C4587", borderRadius: "1px" }} />
                                <div style={{ position: "absolute", top: 0, right: 0, width: "2px", height: "14px", background: "#1C4587", borderRadius: "1px" }} />
                            </div>
                            <p style={{
                                fontFamily: "var(--font-julius)",
                                fontSize: "42px",
                                color: "#1C4587",
                                lineHeight: 1,
                            }}>
                                {m > 0 ? m.toFixed(2) : "—"}
                                <span style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "13px",
                                    marginLeft: "8px",
                                    color: "rgba(28,69,135,0.45)",
                                    letterSpacing: "0.15em",
                                }}>
                                    m linear
                                </span>
                            </p>
                        </>
                    ) : (
                        <>
                            <div style={{ position: "relative", paddingRight: "44px", paddingTop: "28px" }}>
                                {/* Width label */}
                                {w > 0 && (
                                    <div style={{
                                        position: "absolute",
                                        top: "4px",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        fontFamily: "var(--font-display)",
                                        fontSize: "10px",
                                        letterSpacing: "0.12em",
                                        color: "rgba(28,69,135,0.55)",
                                    }}>
                                        {form.largura}m
                                    </div>
                                )}
                                {/* Height label */}
                                {h > 0 && (
                                    <div style={{
                                        position: "absolute",
                                        top: "50%",
                                        right: "4px",
                                        transform: "translateY(-50%)",
                                        fontFamily: "var(--font-display)",
                                        fontSize: "10px",
                                        letterSpacing: "0.12em",
                                        color: "rgba(28,69,135,0.55)",
                                        writingMode: "vertical-rl" as const,
                                    }}>
                                        {form.altura}m
                                    </div>
                                )}
                                {/* Rectangle */}
                                <div style={{
                                    width: `${rW}px`,
                                    height: `${rH}px`,
                                    border: "2px solid rgba(28,69,135,0.30)",
                                    borderRadius: "8px",
                                    background: "rgba(28, 69, 135, 0.05)",
                                    transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    {computed > 0 && (
                                        <span style={{
                                            fontFamily: "var(--font-julius)",
                                            fontSize: "14px",
                                            color: "#1C4587",
                                        }}>
                                            {computed.toFixed(2)} m²
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p style={{
                                fontFamily: "var(--font-julius)",
                                fontSize: "42px",
                                color: "#1C4587",
                                lineHeight: 1,
                                textAlign: "center",
                            }}>
                                {computed > 0 ? computed.toFixed(2) : "—"}
                                <span style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "13px",
                                    marginLeft: "8px",
                                    color: "rgba(28,69,135,0.45)",
                                    letterSpacing: "0.15em",
                                }}>
                                    m²
                                </span>
                            </p>
                        </>
                    )}
                </div>

                {/* Inputs */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: isLinear ? "1fr" : "1fr 1fr",
                    gap: "14px",
                }}>
                    {isLinear ? (
                        <NumberInput
                            label="Comprimento"
                            value={form.metros}
                            onChange={v => setForm(f => ({ ...f, metros: v }))}
                            unit="metros"
                            placeholder="0,00"
                        />
                    ) : (
                        <>
                            <NumberInput
                                label="Largura"
                                value={form.largura}
                                onChange={v => setForm(f => ({ ...f, largura: v }))}
                                unit="m"
                                placeholder="0,00"
                            />
                            <NumberInput
                                label="Altura"
                                value={form.altura}
                                onChange={v => setForm(f => ({ ...f, altura: v }))}
                                unit="m"
                                placeholder="0,00"
                            />
                        </>
                    )}
                </div>

                {/* Estimativa de valor */}
                {area > 0 && preco && (
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "6px",
                        padding: "18px 20px",
                        borderRadius: "16px",
                        background: "rgba(28, 69, 135, 0.04)",
                        border: "1px dashed rgba(28, 69, 135, 0.18)",
                    }}>
                        <p style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "9px",
                            letterSpacing: "0.3em",
                            textTransform: "uppercase" as const,
                            color: "rgba(28, 69, 135, 0.40)",
                        }}>
                            Estimativa preliminar
                        </p>
                        <p style={{
                            fontFamily: "var(--font-julius)",
                            fontSize: "26px",
                            color: "#1C4587",
                            lineHeight: 1.1,
                        }}>
                            {formatBRL(estimativaMin)} – {formatBRL(estimativaMax)}
                        </p>
                        <p style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "10px",
                            color: "rgba(28, 69, 135, 0.38)",
                            textAlign: "center" as const,
                            lineHeight: 1.5,
                        }}>
                            Valor referência · confirmado após visita técnica gratuita
                        </p>
                    </div>
                )}

                <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    color: "rgba(28,69,135,0.38)",
                    textAlign: "center",
                    lineHeight: 1.6,
                }}>
                    Não tem as medidas exatas? Informe uma estimativa —{" "}
                    nossa equipe verifica na visita técnica gratuita.
                </p>
            </div>
        );
    };

    // ── Step 2 — Detalhes ────────────────────────────────────────────────────
    const renderStep2 = () => {
        const rawGroups = DETALHES[form.servicoSlug] ?? [];

        // Regra especial para espelhos: Bisotado só permite formato Retangular
        const groups = rawGroups.map(g => {
            if (form.servicoSlug === "espelhos" && g.key === "formato" && form.detalhes["acabamento"] === "Bisotado") {
                return { ...g, options: ["Retangular"] };
            }
            return g;
        });

        const handleSelect = (key: string, v: string) => {
            setForm(f => {
                const next = { ...f.detalhes, [key]: v };
                // Se mudou acabamento para Bisotado, força formato Retangular
                if (f.servicoSlug === "espelhos" && key === "acabamento" && v === "Bisotado") {
                    next.formato = "Retangular";
                }
                return { ...f, detalhes: next };
            });
        };

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                {groups.map(group => (
                    <PillGroup
                        key={group.key}
                        label={group.label}
                        options={group.options}
                        selected={form.detalhes[group.key] ?? ""}
                        onSelect={v => handleSelect(group.key, v)}
                    />
                ))}
                {form.servicoSlug === "espelhos" && form.detalhes["acabamento"] === "Bisotado" && (
                    <p style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        color: "rgba(28,69,135,0.50)",
                        fontStyle: "italic",
                        marginTop: "-20px",
                    }}>
                        * Espelho Bisotê é produzido apenas em formato retangular.
                    </p>
                )}
                {/* Observações */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "10px",
                        letterSpacing: "0.28em",
                        textTransform: "uppercase" as const,
                        color: "rgba(28, 69, 135, 0.50)",
                    }}>
                        Observações (opcional)
                    </label>
                    <textarea
                        value={form.observacoes}
                        onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))}
                        placeholder="Descreva detalhes adicionais do seu projeto…"
                        rows={3}
                        style={{
                            padding: "14px 18px",
                            fontFamily: "var(--font-body)",
                            fontSize: "13px",
                            color: "#1c1c1c",
                            background: "rgba(28, 69, 135, 0.03)",
                            border: "1.5px solid rgba(28, 69, 135, 0.15)",
                            borderRadius: "14px",
                            outline: "none",
                            resize: "vertical" as const,
                            transition: "border-color 0.2s, box-shadow 0.2s",
                        }}
                        onFocus={e => {
                            e.target.style.borderColor = "#1C4587";
                            e.target.style.boxShadow = "0 0 0 3px rgba(28,69,135,0.08)";
                        }}
                        onBlur={e => {
                            e.target.style.borderColor = "rgba(28, 69, 135, 0.15)";
                            e.target.style.boxShadow = "none";
                        }}
                    />
                </div>
            </div>
        );
    };

    // ── Step 4 — Resumo ──────────────────────────────────────────────────────
    const renderStep4 = () => {
        const medidas = isLinear
            ? `${parseFloat(form.metros).toFixed(2)}m linear`
            : `${parseFloat(form.largura).toFixed(2)}m × ${parseFloat(form.altura).toFixed(2)}m — ${area.toFixed(2)} m²`;

        const specsEntries = Object.entries(form.detalhes).filter(([, v]) => v);
        const groups = DETALHES[form.servicoSlug] ?? [];

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Summary card */}
                <div style={{
                    borderRadius: "20px",
                    border: "1.5px solid rgba(28, 69, 135, 0.10)",
                    overflow: "hidden",
                    background: "#ffffff",
                    boxShadow: "0 4px 24px rgba(28, 69, 135, 0.07)",
                }}>
                    {/* Card header */}
                    <div style={{
                        padding: "20px 24px",
                        background: "rgba(28, 69, 135, 0.04)",
                        borderBottom: "1px solid rgba(28, 69, 135, 0.07)",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                    }}>
                        <div style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "12px",
                            background: "#1C4587",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#ffffff",
                            flexShrink: 0,
                        }}>
                            <ServiceIcon slug={form.servicoSlug} />
                        </div>
                        <div>
                            <p style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "9px",
                                letterSpacing: "0.3em",
                                textTransform: "uppercase" as const,
                                color: "rgba(28, 69, 135, 0.40)",
                                marginBottom: "4px",
                            }}>
                                Serviço selecionado
                            </p>
                            <p style={{
                                fontFamily: "var(--font-julius)",
                                fontSize: "18px",
                                color: "#1C4587",
                            }}>
                                {selectedService?.title}
                            </p>
                        </div>
                    </div>

                    {/* Detail rows */}
                    <div style={{
                        padding: "20px 24px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "18px",
                    }}>
                        <SummaryRow icon="�" label="Nome" value={form.nome} />
                        {form.whatsapp && <SummaryRow icon="📱" label="WhatsApp" value={form.whatsapp} />}
                        {form.telefone && <SummaryRow icon="📞" label="Telefone" value={form.telefone} />}
                        <SummaryRow icon="�📐" label="Dimensões" value={medidas} />
                        {specsEntries.map(([key, value]) => {
                            const found = groups.find(g => g.key === key);
                            return (
                                <SummaryRow
                                    key={key}
                                    icon="✓"
                                    label={found?.label ?? key}
                                    value={value}
                                />
                            );
                        })}
                        {form.observacoes && (
                            <SummaryRow icon="📝" label="Observações" value={form.observacoes} />
                        )}
                    </div>
                </div>

                {/* Info strip */}
                <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "16px 18px",
                    borderRadius: "14px",
                    background: "rgba(28, 69, 135, 0.04)",
                    border: "1px solid rgba(28, 69, 135, 0.08)",
                }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#1C4587" strokeWidth={1.5}
                        style={{ width: 18, height: 18, flexShrink: 0, marginTop: "1px" }}>
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4M12 16h.01" />
                    </svg>
                    <p style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "12px",
                        color: "rgba(28, 69, 135, 0.65)",
                        lineHeight: 1.6,
                    }}>
                        Nossa equipe retorna em <strong>até 5 dias úteis</strong> com o orçamento completo e agendamento de visita técnica <strong>gratuita</strong>.
                    </p>
                </div>

                {/* Estimativa resumo — mesmo valor da página anterior */}
                {step3Estimativa && (
                    <div style={{
                        borderRadius: "16px",
                        background: "rgba(28, 69, 135, 0.04)",
                        border: "1px dashed rgba(28, 69, 135, 0.18)",
                        padding: "16px 20px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                        flexWrap: "wrap" as const,
                    }}>
                        <div>
                            <p style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "9px",
                                letterSpacing: "0.28em",
                                textTransform: "uppercase" as const,
                                color: "rgba(28, 69, 135, 0.40)",
                                marginBottom: "4px",
                            }}>
                                Estimativa preliminar
                            </p>
                            <p style={{
                                fontFamily: "var(--font-julius)",
                                fontSize: "22px",
                                color: "#1C4587",
                            }}>
                                {step3Estimativa.label}
                            </p>
                        </div>
                        <p style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "10px",
                            color: "rgba(28, 69, 135, 0.38)",
                            lineHeight: 1.5,
                            maxWidth: "160px",
                        }}>
                            Confirmado após visita técnica gratuita
                        </p>
                    </div>
                )}

                {/* PIX antecipado */}
                <div style={{
                    borderRadius: "18px",
                    border: "1.5px solid rgba(28, 69, 135, 0.10)",
                    overflow: "hidden",
                    background: "#ffffff",
                    boxShadow: "0 2px 14px rgba(28, 69, 135, 0.05)",
                }}>
                    <div style={{
                        padding: "14px 20px",
                        background: "rgba(28, 69, 135, 0.04)",
                        borderBottom: "1px solid rgba(28, 69, 135, 0.07)",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}>
                        <svg viewBox="0 0 24 24" fill="#1C4587" style={{ width: 18, height: 18, flexShrink: 0 }}>
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                        </svg>
                        <p style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "10px",
                            letterSpacing: "0.25em",
                            textTransform: "uppercase" as const,
                            color: "#1C4587",
                        }}>
                            Pagamento antecipado por PIX
                        </p>
                    </div>
                    <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <p style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "12px",
                            color: "rgba(28, 69, 135, 0.60)",
                            lineHeight: 1.6,
                        }}>
                            Agilize seu pedido com um sinal de <strong style={{ color: "#1C4587" }}>50% via PIX</strong> após confirmar o orçamento com nossa equipe. O restante é pago na entrega.
                        </p>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            padding: "14px 16px",
                            borderRadius: "12px",
                            background: "rgba(28, 69, 135, 0.06)",
                            border: "1px solid rgba(28, 69, 135, 0.12)",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="#1C4587" strokeWidth={1.5}
                                    style={{ width: 16, height: 16, flexShrink: 0 }}>
                                    <rect x="2" y="6" width="20" height="12" rx="2" />
                                    <path d="M2 10h20M6 15h4" />
                                </svg>
                                <p style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "10px",
                                    letterSpacing: "0.22em",
                                    textTransform: "uppercase" as const,
                                    color: "#1C4587",
                                }}>
                                    Escolha como deseja pagar
                                </p>
                            </div>

                            {/* Seletor: valor total x sinal 50% */}
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "8px",
                            }}>
                                {([
                                    { id: "total" as const, titulo: "Valor total", sub: "Pague tudo agora" },
                                    { id: "sinal" as const, titulo: "Sinal 50%", sub: "Restante na entrega" },
                                ]).map((opt) => {
                                    const ativo = tipoPagamento === opt.id;
                                    return (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => setTipoPagamento(opt.id)}
                                            style={{
                                                padding: "12px 10px",
                                                borderRadius: "10px",
                                                border: ativo ? "1.5px solid #1C4587" : "1.5px solid rgba(28, 69, 135, 0.15)",
                                                background: ativo ? "#1C4587" : "#ffffff",
                                                color: ativo ? "#ffffff" : "rgba(28, 69, 135, 0.70)",
                                                cursor: "pointer",
                                                transition: "all 0.15s ease",
                                                textAlign: "left" as const,
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "2px",
                                            }}
                                        >
                                            <span style={{
                                                fontFamily: "var(--font-display)",
                                                fontSize: "11px",
                                                letterSpacing: "0.12em",
                                                textTransform: "uppercase" as const,
                                            }}>
                                                {opt.titulo}
                                            </span>
                                            <span style={{
                                                fontFamily: "var(--font-body)",
                                                fontSize: "10px",
                                                opacity: 0.85,
                                            }}>
                                                {opt.sub}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <p style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "11px",
                                color: "rgba(28, 69, 135, 0.65)",
                                lineHeight: 1.5,
                            }}>
                                Parcele em até <strong>{PARCELAMENTO_MAX}x sem juros</strong>, tanto no valor total quanto no sinal de 50%.
                            </p>

                            <div style={{
                                display: "grid",
                                gridTemplateColumns: `repeat(${PARCELAMENTO_MAX}, minmax(0, 1fr))`,
                                gap: "6px",
                            }}>
                                {Array.from({ length: PARCELAMENTO_MAX }, (_, i) => i + 1).map((n) => {
                                    const ativo = parcelas === n;
                                    return (
                                        <button
                                            key={n}
                                            type="button"
                                            onClick={() => setParcelas(n)}
                                            style={{
                                                padding: "10px 6px",
                                                borderRadius: "10px",
                                                border: ativo ? "1.5px solid #1C4587" : "1.5px solid rgba(28, 69, 135, 0.15)",
                                                background: ativo ? "#1C4587" : "#ffffff",
                                                color: ativo ? "#ffffff" : "rgba(28, 69, 135, 0.65)",
                                                fontFamily: "var(--font-display)",
                                                fontSize: "11px",
                                                letterSpacing: "0.08em",
                                                cursor: "pointer",
                                                transition: "all 0.15s ease",
                                            }}
                                        >
                                            {n}x
                                        </button>
                                    );
                                })}
                            </div>

                            {(() => {
                                const totalRef = espelhoTotal > 0 ? espelhoTotal : estimativaMin;
                                if (totalRef <= 0) return null;
                                const valorAPagar = tipoPagamento === "total" ? totalRef : Math.round(totalRef * 0.5);
                                const valorParcela = valorAPagar / parcelas;
                                const restante = totalRef - valorAPagar;
                                return (
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "4px",
                                        marginTop: "2px",
                                        paddingTop: "10px",
                                        borderTop: "1px dashed rgba(28, 69, 135, 0.15)",
                                    }}>
                                        <p style={{
                                            fontFamily: "var(--font-body)",
                                            fontSize: "11px",
                                            color: "rgba(28, 69, 135, 0.70)",
                                        }}>
                                            {tipoPagamento === "total" ? "Valor total" : "Sinal (50%)"}: <strong>{formatBRL(valorAPagar)}</strong>
                                        </p>
                                        <p style={{
                                            fontFamily: "var(--font-julius)",
                                            fontSize: "16px",
                                            color: "#1C4587",
                                        }}>
                                            {parcelas}x de {formatBRL(valorParcela)} sem juros
                                        </p>
                                        {tipoPagamento === "sinal" && restante > 0 && (
                                            <p style={{
                                                fontFamily: "var(--font-body)",
                                                fontSize: "10px",
                                                color: "rgba(28, 69, 135, 0.55)",
                                            }}>
                                                Restante de {formatBRL(restante)} pago na entrega.
                                            </p>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                            padding: "14px 16px",
                            borderRadius: "12px",
                            background: "rgba(28, 69, 135, 0.04)",
                            border: "1px solid rgba(28, 69, 135, 0.10)",
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", flexWrap: "wrap" as const }}>
                                <div>
                                    <p style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: "9px",
                                        letterSpacing: "0.25em",
                                        textTransform: "uppercase" as const,
                                        color: "rgba(28, 69, 135, 0.40)",
                                        marginBottom: "3px",
                                    }}>
                                        Chave PIX
                                    </p>
                                    <p style={{
                                        fontFamily: "var(--font-julius)",
                                        fontSize: "16px",
                                        color: "#1C4587",
                                        letterSpacing: "0.05em",
                                    }}>
                                        {PIX_CHAVE_MASCARADA}
                                    </p>
                                    <p style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: "10px",
                                        color: "rgba(28, 69, 135, 0.40)",
                                        marginTop: "2px",
                                    }}>
                                        {PIX_TITULAR}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => navigator.clipboard?.writeText(PIX_CHAVE)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        padding: "10px 16px",
                                        borderRadius: "10px",
                                        border: "1.5px solid rgba(28, 69, 135, 0.15)",
                                        background: "#ffffff",
                                        fontFamily: "var(--font-display)",
                                        fontSize: "9px",
                                        letterSpacing: "0.2em",
                                        textTransform: "uppercase" as const,
                                        color: "rgba(28, 69, 135, 0.55)",
                                        cursor: "pointer",
                                        whiteSpace: "nowrap" as const,
                                        flexShrink: 0,
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: 13, height: 13 }}>
                                        <rect x="9" y="9" width="13" height="13" rx="2" />
                                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                                    </svg>
                                    Copiar
                                </button>
                            </div>
                        </div>
                        <p style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "10px",
                            color: "rgba(28, 69, 135, 0.35)",
                            lineHeight: 1.5,
                        }}>
                            * O pagamento é opcional e não obrigatório para solicitar o orçamento.
                        </p>
                    </div>
                </div>

                {/* Edit link */}
                <button
                    type="button"
                    onClick={() => goToStep(0)}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "var(--font-display)",
                        fontSize: "10px",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase" as const,
                        color: "rgba(28, 69, 135, 0.45)",
                        textDecoration: "underline",
                        textUnderlineOffset: "4px",
                        padding: "4px 0",
                    }}
                >
                    Editar informações
                </button>

                {/* WhatsApp CTA */}
                <a
                    href={buildWhatsAppMessage()}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        padding: "18px 24px",
                        borderRadius: "16px",
                        background: "#25D366",
                        color: "#ffffff",
                        fontFamily: "var(--font-display)",
                        fontSize: "10px",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase" as const,
                        textDecoration: "none",
                        boxShadow: "0 8px 28px rgba(37, 211, 102, 0.35)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        textAlign: "center" as const,
                        lineHeight: 1.4,
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)";
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 16px 40px rgba(37, 211, 102, 0.45)";
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 28px rgba(37, 211, 102, 0.35)";
                    }}
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20, flexShrink: 0 }}>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Enviar orçamento pelo WhatsApp
                </a>
            </div>
        );
    };

    // ── Step 3 — Contato ─────────────────────────────────────────────────────
    const renderStep3 = () => {
        const inputStyle = {
            width: "100%",
            padding: "16px 20px",
            fontFamily: "var(--font-body)",
            fontSize: "15px",
            color: "#1c1c1c",
            background: "rgba(28, 69, 135, 0.03)",
            border: "1.5px solid rgba(28, 69, 135, 0.15)",
            borderRadius: "16px",
            outline: "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
            boxSizing: "border-box" as const,
        };
        const labelStyle = {
            fontFamily: "var(--font-display)",
            fontSize: "10px",
            letterSpacing: "0.28em",
            textTransform: "uppercase" as const,
            color: "rgba(28, 69, 135, 0.50)",
        };
        const focus = (e: React.FocusEvent<HTMLInputElement>) => {
            e.target.style.borderColor = "#1C4587";
            e.target.style.boxShadow = "0 0 0 3px rgba(28,69,135,0.08)";
        };
        const blur = (e: React.FocusEvent<HTMLInputElement>) => {
            e.target.style.borderColor = "rgba(28, 69, 135, 0.15)";
            e.target.style.boxShadow = "none";
        };
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Nome */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={labelStyle}>Nome completo *</label>
                    <input
                        type="text"
                        value={form.nome}
                        onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                        placeholder="Seu nome"
                        autoComplete="name"
                        style={inputStyle}
                        onFocus={focus}
                        onBlur={blur}
                    />
                </div>
                {/* WhatsApp */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={labelStyle}>Número do WhatsApp *</label>
                    <input
                        type="tel"
                        value={form.whatsapp}
                        onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                        placeholder="(11) 99999-9999"
                        autoComplete="tel"
                        inputMode="tel"
                        style={inputStyle}
                        onFocus={focus}
                        onBlur={blur}
                    />
                </div>
                {/* Telefone fixo (opcional) */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={labelStyle}>Telefone fixo (opcional)</label>
                    <input
                        type="tel"
                        value={form.telefone}
                        onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))}
                        placeholder="(11) 3333-3333"
                        autoComplete="tel"
                        inputMode="tel"
                        style={inputStyle}
                        onFocus={focus}
                        onBlur={blur}
                    />
                </div>
                <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    color: "rgba(28,69,135,0.38)",
                    lineHeight: 1.6,
                }}>
                    * Seus dados são usados apenas para retornar o orçamento. Não compartilhamos com terceiros.
                </p>
            </div>
        );
    };

    // ── Step 1 — Modalidade ──────────────────────────────────────────────────
    const renderStepModalidade = () => {
        const options = [
            {
                key: "medida" as const,
                title: "Personalizado por Medida",
                subtitle: "Projeto sob medida para o seu espaço, com visita técnica gratuita",
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} style={{ width: 28, height: 28 }}>
                        <path strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18M9 6v12M15 6v12" />
                    </svg>
                ),
            },
            {
                key: "pronta" as const,
                title: "Pronta Entrega",
                subtitle: "Produtos em estoque com entrega rápida, compre agora",
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} style={{ width: 28, height: 28 }}>
                        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                        <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
                    </svg>
                ),
            },
        ];

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {options.map(opt => {
                    const sel = form.modalidade === opt.key;
                    return (
                        <button
                            key={opt.key}
                            type="button"
                            onClick={() => {
                                if (opt.key === "pronta") {
                                    router.push(`/pronta-entrega/${form.servicoSlug}`);
                                    return;
                                }
                                setForm(f => ({ ...f, modalidade: opt.key }));
                            }}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "20px",
                                padding: "24px 22px",
                                borderRadius: "20px",
                                border: sel ? "2px solid #1C4587" : "1.5px solid rgba(28, 69, 135, 0.12)",
                                background: sel ? "rgba(28, 69, 135, 0.05)" : "#ffffff",
                                boxShadow: sel ? "0 4px 24px rgba(28,69,135,0.12)" : "0 2px 8px rgba(0,0,0,0.04)",
                                cursor: "pointer",
                                transition: "all 0.22s ease",
                                textAlign: "left" as const,
                            }}
                        >
                            <div style={{
                                width: "56px",
                                height: "56px",
                                borderRadius: "16px",
                                background: sel ? "#1C4587" : "rgba(28, 69, 135, 0.07)",
                                color: sel ? "#ffffff" : "#1C4587",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                transition: "all 0.22s ease",
                            }}>
                                {opt.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{
                                    fontFamily: "var(--font-julius)",
                                    fontSize: "16px",
                                    color: sel ? "#1C4587" : "#1C1C1C",
                                    marginBottom: "6px",
                                    lineHeight: 1.2,
                                }}>
                                    {opt.title}
                                </p>
                                <p style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: "12px",
                                    color: "rgba(28, 69, 135, 0.45)",
                                    lineHeight: 1.5,
                                }}>
                                    {opt.subtitle}
                                </p>
                            </div>
                            {opt.key === "pronta" && (
                                <svg viewBox="0 0 24 24" fill="none" stroke="rgba(28,69,135,0.30)" strokeWidth={1.5} style={{ width: 16, height: 16, flexShrink: 0 }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                        </button>
                    );
                })}
            </div>
        );
    };

    const renderCurrentStep = () => {
        if (step === 0) return renderStep0();
        if (step === 1) return renderStepModalidade();
        if (step === 2) return renderStep1();
        if (step === 3) return renderStep2();
        if (step === 4) return renderStep3();
        return renderStep4();
    };

    const proceed = canProceed();

    return (
        <div
            ref={wrapperRef}
            style={{
                minHeight: "100svh",
                background: "linear-gradient(155deg, #eef3ff 0%, #ffffff 45%, #f5f8ff 100%)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* ── Top bar ───────────────────────────────────────────────── */}
            <div style={{
                padding: "32px 24px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                maxWidth: "680px",
                width: "100%",
                margin: "0 auto",
            }}>
                <Link
                    href="/"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontFamily: "var(--font-display)",
                        fontSize: "10px",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: "rgba(28, 69, 135, 0.40)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                    }}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: 14, height: 14 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    MC Vidracaria
                </Link>

                {/* Step dots */}
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                        <div key={i} style={{
                            width: i === step ? "24px" : "6px",
                            height: "6px",
                            borderRadius: "3px",
                            background: i <= step ? "#1C4587" : "rgba(28, 69, 135, 0.13)",
                            transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        }} />
                    ))}
                </div>
            </div>

            {/* ── Content ───────────────────────────────────────────────── */}
            <div style={{
                flex: 1,
                maxWidth: "680px",
                width: "100%",
                margin: "0 auto",
                padding: "0 24px 60px",
                display: "flex",
                flexDirection: "column",
            }}>
                {/* Step header */}
                <div style={{ marginBottom: "32px" }}>
                    <p style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "10px",
                        letterSpacing: "0.35em",
                        textTransform: "uppercase",
                        color: "rgba(28, 69, 135, 0.38)",
                        marginBottom: "10px",
                    }}>
                        Etapa {step + 1} de {TOTAL_STEPS}
                    </p>
                    <h1 style={{
                        fontFamily: "var(--font-julius)",
                        fontSize: "clamp(22px, 5vw, 30px)",
                        color: "#1C4587",
                        lineHeight: 1.2,
                        marginBottom: "8px",
                    }}>
                        {STEP_TITLES[step]}
                    </h1>
                    <p style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "13px",
                        color: "rgba(28, 69, 135, 0.48)",
                        lineHeight: 1.5,
                    }}>
                        {STEP_SUBTITLES[step]}
                    </p>
                </div>

                {/* Step content */}
                <div ref={stepRef} style={{ flex: 1 }}>
                    {renderCurrentStep()}
                </div>

                {/* Navigation — not shown on step 4 (WhatsApp button handles it) */}
                {step < 5 && (
                    <div style={{
                        display: "flex",
                        justifyContent: step > 0 ? "space-between" : "flex-end",
                        alignItems: "center",
                        marginTop: "40px",
                        paddingTop: "24px",
                        borderTop: "1px solid rgba(28, 69, 135, 0.07)",
                    }}>
                        {step > 0 && (
                            <button
                                type="button"
                                onClick={() => goToStep(step - 1)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "14px 24px",
                                    borderRadius: "12px",
                                    border: "1.5px solid rgba(28, 69, 135, 0.15)",
                                    background: "transparent",
                                    fontFamily: "var(--font-display)",
                                    fontSize: "10px",
                                    letterSpacing: "0.2em",
                                    textTransform: "uppercase",
                                    color: "rgba(28, 69, 135, 0.50)",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: 13, height: 13 }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                                </svg>
                                Voltar
                            </button>
                        )}

                        {step === 3 && step3Estimativa && (
                            <div style={{
                                position: "fixed",
                                bottom: "24px",
                                right: "24px",
                                zIndex: 50,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-end",
                                gap: "4px",
                                padding: "16px 22px",
                                borderRadius: "18px",
                                background: "#ffffff",
                                border: "1.5px solid rgba(28, 69, 135, 0.15)",
                                boxShadow: "0 8px 32px rgba(28, 69, 135, 0.14)",
                            }}>
                                <p style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "9px",
                                    letterSpacing: "0.28em",
                                    textTransform: "uppercase" as const,
                                    color: "rgba(28, 69, 135, 0.40)",
                                    marginBottom: "2px",
                                }}>
                                    Estimativa
                                </p>
                                <p style={{
                                    fontFamily: "var(--font-julius)",
                                    fontSize: "22px",
                                    color: "#1C4587",
                                    lineHeight: 1,
                                    whiteSpace: "nowrap" as const,
                                }}>
                                    {step3Estimativa.label}
                                </p>
                                <p style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: "11px",
                                    color: "rgba(28, 69, 135, 0.42)",
                                }}>
                                    {step3Estimativa.sub}
                                </p>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => proceed && goToStep(step + 1)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "14px 32px",
                                borderRadius: "12px",
                                border: "none",
                                background: proceed ? "#1C4587" : "rgba(28, 69, 135, 0.12)",
                                color: proceed ? "#ffffff" : "rgba(28, 69, 135, 0.30)",
                                fontFamily: "var(--font-display)",
                                fontSize: "10px",
                                letterSpacing: "0.22em",
                                textTransform: "uppercase",
                                cursor: proceed ? "pointer" : "not-allowed",
                                whiteSpace: "nowrap",
                                transition: "all 0.25s ease",
                                boxShadow: proceed ? "0 6px 20px rgba(28, 69, 135, 0.28)" : "none",
                            }}
                        >
                            {step === 4 ? "Revisar pedido" : "Continuar"}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: 13, height: 13 }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
