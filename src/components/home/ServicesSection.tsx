"use client";

import { useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
    Maximize2,
    Square,
    Shield,
    Layers,
    LayoutGrid,
    Home,
    Umbrella,
    type LucideIcon,
} from "lucide-react";
import { services } from "@/data/services";
import { useArchitectMode } from "@/hooks/useArchitectMode";
import ArchitectCarousel from "@/components/home/architect/ArchitectCarousel";

gsap.registerPlugin(ScrollTrigger);

const ICON_MAP: Record<string, LucideIcon> = {
    Maximize2,
    Square,
    Shield,
    Layers,
    LayoutGrid,
    Home,
    Umbrella,
};

export default function ServicesSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const { active } = useArchitectMode();

    useEffect(() => {
        const el = titleRef.current;
        if (!el) return;
        gsap.to(el, {
            autoAlpha: 0, y: -10, duration: 0.25, ease: "power2.in",
            onComplete: () => {
                el.textContent = active ? "PARA ARQUITETOS" : "SOLUÇÕES EM VIDRO";
                gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" });
            },
        });
    }, [active]);

    useGSAP(
        () => {
            gsap.utils.toArray<HTMLElement>(".service-card").forEach((card, i) => {
                gsap.from(card, {
                    y: 50,
                    autoAlpha: 0,
                    duration: 0.65,
                    ease: "power3.out",
                    delay: i * 0.07,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 87%",
                        toggleActions: "play none none reverse",
                    },
                });
            });
            gsap.from(".services-title", {
                y: 35,
                autoAlpha: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".services-title",
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
            });
        },
        { scope: sectionRef }
    );

    const onEnter = useCallback((el: HTMLDivElement) => {
        gsap.to(el, {
            y: -6,
            boxShadow: "0 20px 52px rgba(28,69,135,0.13)",
            borderColor: "rgba(28,69,135,0.30)",
            duration: 0.3,
            ease: "power2.out",
        });
        gsap.to(el.querySelector(".sc-icon-bg"), {
            backgroundColor: "var(--color-primary, #1C4587)",
            duration: 0.26,
            ease: "power2.out",
        });
        gsap.to(el.querySelector(".sc-icon-svg"), {
            color: "#ffffff",
            duration: 0.26,
            ease: "power2.out",
        });
        gsap.to(el.querySelector(".sc-title"), {
            color: "var(--color-primary, #1C4587)",
            duration: 0.24,
            ease: "power2.out",
        });
    }, []);

    const onLeave = useCallback((el: HTMLDivElement) => {
        gsap.to(el, {
            y: 0,
            boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
            borderColor: "rgba(0,0,0,0.09)",
            duration: 0.36,
            ease: "power2.inOut",
        });
        gsap.to(el.querySelector(".sc-icon-bg"), {
            backgroundColor: "rgba(28,69,135,0.07)",
            duration: 0.3,
            ease: "power2.inOut",
        });
        gsap.to(el.querySelector(".sc-icon-svg"), {
            color: "var(--color-primary, #1C4587)",
            duration: 0.3,
            ease: "power2.inOut",
        });
        gsap.to(el.querySelector(".sc-title"), {
            color: "#1a1a1a",
            duration: 0.26,
            ease: "power2.inOut",
        });
    }, []);

    return (
        <section
            ref={sectionRef}
            className="bg-white pt-48 md:pt-56 lg:pt-64 pb-32 md:pb-40 lg:pb-48 w-full"
        >
            <div className="services-title text-center mb-20 md:mb-28 px-6">
                <h2
                    ref={titleRef}
                    className="text-4xl md:text-5xl lg:text-6xl text-neutral-800 leading-tight"
                    style={{ fontFamily: "var(--font-julius)" }}
                >
                    SOLUÇÕES EM VIDRO
                </h2>
            </div>

            {active ? (
                <ArchitectCarousel />
            ) : (
            <div style={{ paddingLeft: "clamp(1rem, 4vw, 7rem)", paddingRight: "clamp(1rem, 4vw, 7rem)" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                    {services.map((service, i) => {
                        const Icon = ICON_MAP[service.icon] ?? Square;
                        const isLast = i === services.length - 1 && services.length % 3 === 1;
                        return (
                            <Link
                                key={service.slug}
                                href={`/servicos/${service.slug}`}
                                className={`service-card block${isLast ? " lg:col-start-2" : ""}`}
                            >
                                <div
                                    className="flex flex-col rounded-2xl h-full"
                                    style={{
                                        padding: "clamp(1.75rem, 3vw, 2.5rem)",
                                        background: "#ffffff",
                                        border: "1px solid rgba(0,0,0,0.09)",
                                        boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
                                        minHeight: "260px",
                                    }}
                                    onMouseEnter={(e) => onEnter(e.currentTarget)}
                                    onMouseLeave={(e) => onLeave(e.currentTarget)}
                                >
                                    <div
                                        className="sc-icon-bg w-12 h-12 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: "rgba(28,69,135,0.07)", flexShrink: 0 }}
                                    >
                                        <Icon
                                            className="sc-icon-svg"
                                            size={22}
                                            strokeWidth={1.6}
                                            style={{ color: "var(--color-primary, #1C4587)" }}
                                        />
                                    </div>

                                    <p
                                        className="mt-6 text-[10px] tracking-[0.3em] text-neutral-300 tabular-nums"
                                        style={{ fontFamily: "var(--font-body)" }}
                                    >
                                        {String(i + 1).padStart(2, "0")}
                                    </p>

                                    <h3
                                        className="sc-title mt-2 text-[15px] font-semibold leading-snug"
                                        style={{ fontFamily: "var(--font-body)", color: "#1a1a1a" }}
                                    >
                                        {service.title}
                                    </h3>

                                    <p
                                        className="mt-3 mb-auto text-[13px] leading-[1.8] text-neutral-400"
                                        style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}
                                    >
                                        {service.subtitle}
                                    </p>

                                    <p
                                        className="mt-6 text-[9px] tracking-[0.22em] uppercase text-neutral-300"
                                        style={{ fontFamily: "var(--font-display)" }}
                                    >
                                        ver mais
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
            )}
        </section>
    );
}
