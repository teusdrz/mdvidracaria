"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── Painel por serviço ──────────────────────────────────────────────────────
// Usa a primeira imagem de cada pasta como representação fullscreen do serviço.
const PANELS = [
    {
        slug: "espelhos",
        title: "Espelhos",
        src: "/images/espelhos/image.png",
    },
    {
        slug: "box-de-vidro",
        title: "Box de Vidro",
        src: "/images/box-de-vidro/image.png",
    },
    {
        slug: "guarda-corpo",
        title: "Guarda Corpo",
        src: "/images/guarda-corpo/image.png",
    },
    {
        slug: "envelopamento-e-peliculas",
        title: "Envelopamento e Películas",
        src: "/images/envelopamento-e-peliculas/image.png",
    },
    {
        slug: "divisorias",
        title: "Divisórias",
        src: "/images/divisorias/image.png",
    },
    {
        slug: "cobertura",
        title: "Cobertura",
        src: "/images/cobertura/image.png",
    },
] as const;

// ─── Componente ──────────────────────────────────────────────────────────────
export default function ServicesGallery() {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const panels = gsap.utils.toArray<HTMLElement>(".sg-panel");

            // Posiciona todos os painéis (exceto o primeiro) abaixo da viewport.
            gsap.set(panels.slice(1), { yPercent: 100 });

            // Timeline: cada painel sobe de yPercent 100 → 0 em sequência.
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: wrapperRef.current,
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
        { scope: wrapperRef }
    );

    return (
        // Altura 100vh — o ScrollTrigger adiciona o espaço extra via pinSpacing.
        <div ref={wrapperRef} className="relative h-screen w-full overflow-hidden bg-white">
            {PANELS.map((panel, i) => (
                <div
                    key={panel.slug}
                    className="sg-panel absolute inset-0 flex items-center justify-center bg-white"
                    style={{ zIndex: i + 1 }}
                >
                    <div
                        className="relative rounded-2xl overflow-hidden"
                        style={{
                            width: "min(88vw, 860px)",
                            aspectRatio: "16 / 10",
                            boxShadow:
                                "0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 24px 48px rgba(0,0,0,0.06)",
                        }}
                    >
                        <Image
                            src={panel.src}
                            alt={panel.title}
                            fill
                            className="object-cover"
                            priority={i === 0}
                            sizes="(max-width: 768px) 88vw, 860px"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
