"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Service } from "@/data/services";
import { serviceCaptions, type ImageCaption } from "@/data/serviceCaptions";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Props {
    service: Service;
    images: readonly string[];
}

export default function ServiceDetail({ service, images }: Props) {
    const sectionRef = useRef<HTMLElement>(null);
    const ctaCardRef = useRef<HTMLDivElement>(null);

    const captions = serviceCaptions[service.slug] ?? [];

    const rows = images.map((src, i) => {
        const caption: ImageCaption =
            captions[i] ?? {
                eyebrow: service.title,
                title: `${service.title} — detalhe ${i + 1}`,
                description: service.description,
            };
        return { src, caption, index: i };
    });

    useGSAP(
        () => {
            const rowsEls = gsap.utils.toArray<HTMLElement>(".sd-row");
            rowsEls.forEach((row) => {
                const text = row.querySelector(".sd-text");
                const media = row.querySelector(".sd-media");

                if (text) {
                    gsap.fromTo(
                        text,
                        { opacity: 0, y: 40 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: row,
                                start: "top 82%",
                                toggleActions: "play none none reverse",
                            },
                        }
                    );
                }
                if (media) {
                    gsap.fromTo(
                        media,
                        { opacity: 0, y: 60 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.9,
                            delay: 0.1,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: row,
                                start: "top 82%",
                                toggleActions: "play none none reverse",
                            },
                        }
                    );
                }
            });

            if (ctaCardRef.current) {
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
            }
        },
        { scope: sectionRef }
    );

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <section
                ref={sectionRef}
                className="w-full bg-white"
                style={{
                    paddingTop: "clamp(6rem, 14vh, 10rem)",
                    paddingBottom: "clamp(4rem, 10vh, 8rem)",
                }}
            >
                {/* Cabeçalho do serviço */}
                <div
                    className="max-w-5xl"
                    style={{
                        paddingLeft: "clamp(1.25rem, 6vw, 7rem)",
                        paddingRight: "clamp(1.25rem, 6vw, 7rem)",
                        marginBottom: "clamp(4rem, 9vw, 7rem)",
                    }}
                >
                    <p
                        className="text-[11px] tracking-[0.4em] text-neutral-400 mb-6 uppercase"
                        style={{ fontFamily: "var(--font-body)" }}
                    >
                        Nossas soluções — {service.title}
                    </p>
                    <h1
                        className="text-4xl md:text-5xl lg:text-6xl text-neutral-800 leading-tight mb-8"
                        style={{ fontFamily: "var(--font-julius)" }}
                    >
                        {service.title}
                    </h1>
                    <p
                        className="text-base md:text-lg text-neutral-500 leading-relaxed max-w-2xl"
                        style={{ fontFamily: "var(--font-body)" }}
                    >
                        {service.description}
                    </p>
                </div>

                {/* Linhas alternadas texto / imagem */}
                {rows.length > 0 ? (
                    <div
                        className="flex flex-col gap-24 md:gap-32 lg:gap-40"
                        style={{
                            paddingLeft: "clamp(1.25rem, 6vw, 7rem)",
                            paddingRight: "clamp(1.25rem, 6vw, 7rem)",
                        }}
                    >
                        {rows.map(({ src, caption, index }) => {
                            const reverse = index % 2 === 1;
                            return (
                                <div
                                    key={src}
                                    className="sd-row grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
                                >
                                    <div
                                        className={`sd-text lg:col-span-5 ${reverse ? "lg:col-start-8 lg:row-start-1" : ""
                                            }`}
                                    >
                                        <p
                                            className="text-[11px] tracking-[0.35em] text-neutral-400 mb-4 tabular-nums uppercase"
                                            style={{ fontFamily: "var(--font-body)" }}
                                        >
                                            {String(index + 1).padStart(2, "0")} — {caption.eyebrow}
                                        </p>
                                        <h2
                                            className="text-3xl md:text-4xl lg:text-[2.4rem] leading-[1.15] text-neutral-900 mb-6"
                                            style={{ fontFamily: "var(--font-julius)" }}
                                        >
                                            {caption.title}
                                        </h2>
                                        <p
                                            className="text-base md:text-[1.05rem] leading-relaxed text-neutral-600 max-w-xl"
                                            style={{ fontFamily: "var(--font-body)" }}
                                        >
                                            {caption.description}
                                        </p>
                                    </div>

                                    <div
                                        className={`sd-media lg:col-span-7 ${reverse ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-6"
                                            }`}
                                    >
                                        <div
                                            className="relative w-full overflow-hidden rounded-[6px] bg-neutral-100 group"
                                            style={{ aspectRatio: "4 / 3" }}
                                        >
                                            {/\.(mp4|webm|mov)$/i.test(src) ? (
                                                <video
                                                    src={src}
                                                    autoPlay
                                                    loop
                                                    muted
                                                    playsInline
                                                    preload="metadata"
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                                                />
                                            ) : (
                                                <Image
                                                    src={src}
                                                    alt={caption.title}
                                                    fill
                                                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                                                    sizes="(max-width: 1024px) 100vw, 58vw"
                                                    priority={index === 0}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div
                        className="max-w-4xl mx-auto w-full"
                        style={{
                            paddingLeft: "clamp(1.25rem, 6vw, 7rem)",
                            paddingRight: "clamp(1.25rem, 6vw, 7rem)",
                        }}
                    >
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
            </section>

            {/* Card de CTA */}
            <section
                className="w-full bg-white flex justify-center items-center"
                style={{ paddingTop: "60px", paddingBottom: "120px" }}
            >
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
                        boxShadow:
                            "0 4px 40px rgba(28, 69, 135, 0.08), 0 1px 8px rgba(28, 69, 135, 0.05)",
                        transition: "transform 0.35s ease, box-shadow 0.35s ease",
                        cursor: "default",
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow =
                            "0 16px 56px rgba(28, 69, 135, 0.16), 0 4px 16px rgba(28, 69, 135, 0.10)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow =
                            "0 4px 40px rgba(28, 69, 135, 0.08), 0 1px 8px rgba(28, 69, 135, 0.05)";
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
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            style={{ width: "14px", height: "14px" }}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </Link>
                </div>
            </section>
        </div>
    );
}
