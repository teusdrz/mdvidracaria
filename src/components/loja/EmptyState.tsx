import Link from "next/link";

interface Props {
    service: { title: string; slug: string };
}

export default function EmptyState({ service }: Props) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px 24px",
                gap: "16px",
                textAlign: "center",
            }}
        >
            <div
                style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "18px",
                    background: "rgba(28,69,135,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(28,69,135,0.25)"
                    strokeWidth={1.2}
                    style={{ width: 30, height: 30 }}
                >
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                    <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
                </svg>
            </div>

            <p style={{ fontFamily: "var(--font-julius)", fontSize: "20px", color: "#1C4587" }}>
                Em breve aqui
            </p>

            <p
                style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    color: "rgba(28,69,135,0.48)",
                    maxWidth: "300px",
                    lineHeight: 1.6,
                }}
            >
                Estamos preparando os produtos de {service.title}. Por enquanto, solicite um orçamento personalizado.
            </p>

            <Link
                href={`/orcamento?servico=${service.slug}`}
                style={{
                    marginTop: "8px",
                    padding: "14px 28px",
                    borderRadius: "12px",
                    background: "#1C4587",
                    color: "#ffffff",
                    fontFamily: "var(--font-display)",
                    fontSize: "10px",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                }}
            >
                Solicitar Orçamento
            </Link>
        </div>
    );
}
