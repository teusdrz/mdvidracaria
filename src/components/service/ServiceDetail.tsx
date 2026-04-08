"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Service } from "@/data/services";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Props {
    service: Service;
    images: readonly string[];
}

export default function ServiceDetail({ service, images }: Props) {
    const galleryRef = useRef<HTMLDivElement>(null);
    const ctaCardRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!ctaCardRef.current) return;
        gsap.fromTo(
            ctaCardRef.current,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: { trigger: ctaCardRef.current, start: "top 90%" },
            }
        );
    });

    useGSAP(
        () => {
            const panels = gsap.utils.toArray<HTMLElement>(".sd-panel");
            if (panels.length < 2) return;

            // Posiciona todos exceto o primeiro abaixo da viewport
            gsap.set(panels.slice(1), { yPercent: 100 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: galleryRef.current,
                    start: "top top",
                    end: () => `+=${(panels.length - 1) * window.innerHeight}`,
                    scrub: 1,
                    pin: true,
                    pinSpacing: true,
                    anticipatePin: 1,
                },
            });

            panels.slice(1).forEach((panel) => {
                tl.to(panel, { yPercent: 0, ease: "none", duration: 1 });
            });
        },
        { scope: galleryRef }
    );

    return (
        <div className="flex flex-col min-h-screen bg-white">

            {/* ── Galeria fullscreen com ScrollTrigger ─────────────────── */}
            {images.length > 0 ? (
                <div ref={galleryRef} className="relative h-screen w-full overflow-hidden">
                    {images.map((src, i) => (
                        <div
                            key={src}
                            className="sd-panel absolute inset-0"
                            style={{ zIndex: i + 1 }}
                        >
                            <Image
                                src={src}
                                alt={`${service.title} — foto ${i + 1}`}
                                fill
                                className="object-cover"
                                priority={i === 0}
                                sizes="100vw"
                            />
                            {/* Overlay sutil com número da foto */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-8 right-8">
                                <span
                                    className="text-[10px] tracking-[0.3em] text-white/40"
                                    style={{ fontFamily: "var(--font-display)" }}
                                >
                                    {String(i + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="px-6 lg:px-16 max-w-4xl mx-auto w-full pb-24">
                    <div className="rounded-xl border border-primary/10 p-12 text-center">
                        <p
                            className="text-primary/40 text-sm"
                            style={{ fontFamily: "var(--font-body)" }}
                        >
                            Fotos em breve
                        </p>
                    </div>
                </div>
            )}

            {/* ── Rodapé da página ─────────────────────────────────────── */}
            <section
                className="w-full bg-white flex justify-center items-center"
                style={{ paddingTop: "120px", paddingBottom: "120px" }}
            >
                {/* Card container */}
                <div
                    ref={ctaCardRef}
                    className="cta-card w-[calc(100%-48px)] sm:w-auto"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "32px",
                        padding: "clamp(40px, 8vw, 64px) clamp(32px, 8vw, 80px)",
                        borderRadius: "24px",
                        background: "rgba(28, 69, 135, 0.04)",
                        border: "1px solid rgba(28, 69, 135, 0.10)",
                        boxShadow: "0 4px 40px rgba(28, 69, 135, 0.08), 0 1px 8px rgba(28, 69, 135, 0.05)",
                        transition: "transform 0.35s ease, box-shadow 0.35s ease",
                        cursor: "default",
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 56px rgba(28, 69, 135, 0.16), 0 4px 16px rgba(28, 69, 135, 0.10)";
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 40px rgba(28, 69, 135, 0.08), 0 1px 8px rgba(28, 69, 135, 0.05)";
                    }}
                >
                    <Link
                        href={`/orcamento?servico=${service.slug}`}
                        style={{
                            fontFamily: "var(--font-display)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "18px 40px",
                            background: "#1C4587",
                            color: "#ffffff",
                            fontSize: "11px",
                            letterSpacing: "0.25em",
                            textTransform: "uppercase",
                            borderRadius: "12px",
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                            boxShadow: "0 8px 28px rgba(28, 69, 135, 0.35)",
                            transition: "background 0.3s, box-shadow 0.3s",
                        }}
                    >
                        Solicitar orçamento
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>
        </div>
    );
}
