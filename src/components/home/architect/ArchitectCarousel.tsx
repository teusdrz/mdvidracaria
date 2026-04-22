"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";

// 3 imagens na pasta public/images-arquiteto/
const IMAGES = [
    { src: "/images-arquiteto/arquiteto-1.jpeg", alt: "Projeto arquitetônico 1" },
    { src: "/images-arquiteto/arquiteto-3.jpeg", alt: "Projeto arquitetônico 3" },
    { src: "/images-arquiteto/arquiteto-4.jpeg", alt: "Projeto arquitetônico 4" },
    // duplicados para loop contínuo
    { src: "/images-arquiteto/arquiteto-1.jpeg", alt: "Projeto arquitetônico 1" },
    { src: "/images-arquiteto/arquiteto-3.jpeg", alt: "Projeto arquitetônico 3" },
    { src: "/images-arquiteto/arquiteto-4.jpeg", alt: "Projeto arquitetônico 4" },
    { src: "/images-arquiteto/arquiteto-1.jpeg", alt: "Projeto arquitetônico 1" },
    { src: "/images-arquiteto/arquiteto-3.jpeg", alt: "Projeto arquitetônico 3" },
    { src: "/images-arquiteto/arquiteto-4.jpeg", alt: "Projeto arquitetônico 4" },
    { src: "/images-arquiteto/arquiteto-1.jpeg", alt: "Projeto arquitetônico 1" },
    { src: "/images-arquiteto/arquiteto-3.jpeg", alt: "Projeto arquitetônico 3" },
    { src: "/images-arquiteto/arquiteto-4.jpeg", alt: "Projeto arquitetônico 4" },
];

const CARD_W = 320; // px
const GAP = 20; // px
const SPEED = 30; // segundos para voltar ao início

export default function ArchitectCarousel() {
    const trackRef = useRef<HTMLDivElement>(null);
    const tweenRef = useRef<gsap.core.Tween | null>(null);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const totalWidth = (CARD_W + GAP) * (IMAGES.length / 3); // largura de 1/3 (o set original)

        tweenRef.current = gsap.to(track, {
            x: `-=${totalWidth}`,
            duration: SPEED,
            ease: "none",
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize((val: number) => {
                    return val % totalWidth;
                }),
            },
        });

        return () => {
            tweenRef.current?.kill();
        };
    }, []);

    return (
        <div className="w-full overflow-hidden" style={{ paddingLeft: "clamp(1rem, 4vw, 7rem)" }}>
            <div
                ref={trackRef}
                className="flex"
                style={{ gap: `${GAP}px`, willChange: "transform" }}
            >
                {IMAGES.map((img, i) => (
                    <div
                        key={i}
                        className="relative flex-shrink-0 rounded-2xl overflow-hidden"
                        style={{
                            width: `${CARD_W}px`,
                            height: "220px",
                            background: "#e5e7eb",
                        }}
                    >
                        <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            className="object-cover"
                            sizes="320px"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
