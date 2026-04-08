"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function LoadingScreen() {
    const overlayRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(true);

    useEffect(() => {
        const overlay = overlayRef.current;
        const logo = logoRef.current;
        if (!overlay || !logo) return;

        // Spin the inner wrapper — rotationZ garante giro 2D puro
        const spinner = logo.querySelector<HTMLDivElement>(".ls-spinner");
        const colorEl = logo.querySelector<HTMLDivElement>(".ls-color");
        if (!spinner || !colorEl) return;

        const spinTween = gsap.to(spinner, {
            rotationZ: "+=360",
            duration: 2,
            ease: "none",
            repeat: -1,
            transformOrigin: "50% 50%",
        });

        // Cor: azul → preto no elemento de cor (separado do rotation)
        gsap.fromTo(
            colorEl,
            { filter: "brightness(0.35) sepia(1) saturate(20) hue-rotate(195deg)" },
            {
                filter: "brightness(0) sepia(0) saturate(0) hue-rotate(0deg)",
                duration: 2.8,
                ease: "power1.inOut",
                delay: 0.2,
            }
        );

        // Após 7s: para, snap vertical, fade out
        const exitTimer = setTimeout(() => {
            spinTween.kill();
            gsap.set(spinner, { rotationZ: 0 });
            gsap.to(overlay, {
                opacity: 0,
                duration: 0.65,
                ease: "power2.inOut",
                onComplete: () => setMounted(false),
            });
        }, 4000);

        return () => {
            clearTimeout(exitTimer);
            spinTween.kill();
        };
    }, []);

    if (!mounted) return null;

    return (
        <div
            ref={overlayRef}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {/* ls-color: recebe o filtro de cor */}
            <div
                ref={logoRef}
                style={{ width: "96px", height: "144px" }}
            >
                {/* ls-color: cor */}
                <div className="ls-color" style={{ width: "100%", height: "100%" }}>
                    {/* ls-spinner: rotação pura */}
                    <div
                        className="ls-spinner"
                        style={{ width: "100%", height: "100%", willChange: "transform" }}
                    >
                        <Image
                            src="/logo-mc.png"
                            alt="MC Vidraçaria"
                            width={96}
                            height={144}
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
