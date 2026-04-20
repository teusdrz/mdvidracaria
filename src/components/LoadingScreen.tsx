"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

const LOGO_INITIAL_SIZE = 320;
const LOGO_FINAL_SIZE = 48;

const PHASE_1_DURATION = 1.0;
const PHASE_2_DURATION = 0.9;
const PHASE_3_DURATION = 0.85;

const PHASE_1_HOLD = 0.8;
const PHASE_2_HOLD = 0.3;

export default function LoadingScreen() {
    const overlayRef = useRef<HTMLDivElement>(null);
    const logoWrapRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(true);

    useEffect(() => {
        const overlay = overlayRef.current;
        const logoWrap = logoWrapRef.current;
        if (!overlay || !logoWrap) return;

        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

        tl.fromTo(
            logoWrap,
            { scale: 0.6, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: PHASE_1_DURATION, ease: "power3.out" }
        );

        tl.to(logoWrap, {
            scale: LOGO_FINAL_SIZE / LOGO_INITIAL_SIZE,
            duration: PHASE_2_DURATION,
            ease: "power2.inOut",
            delay: PHASE_1_HOLD,
        });

        tl.add(() => {
            const headerLogo = document.querySelector<HTMLElement>("[data-header-logo]");
            if (!headerLogo) {
                gsap.to(overlay, {
                    autoAlpha: 0,
                    duration: 0.5,
                    ease: "power2.inOut",
                    onComplete: () => {
                        (window as any).__loadingComplete = true;
                        window.dispatchEvent(new Event("loading-complete"));
                        setMounted(false);
                    },
                });
                return;
            }

            const targetRect = headerLogo.getBoundingClientRect();
            const wrapRect = logoWrap.getBoundingClientRect();

            const deltaX = targetRect.left + targetRect.width / 2 - (wrapRect.left + wrapRect.width / 2);
            const deltaY = targetRect.top + targetRect.height / 2 - (wrapRect.top + wrapRect.height / 2);

            const exitTl = gsap.timeline();

            exitTl.to(logoWrap, {
                x: deltaX,
                y: deltaY,
                duration: PHASE_3_DURATION,
                ease: "power2.inOut",
                delay: PHASE_2_HOLD,
            });

            exitTl.to(
                overlay,
                {
                    autoAlpha: 0,
                    duration: 0.4,
                    ease: "power2.in",
                    onComplete: () => {
                        (window as any).__loadingComplete = true;
                        window.dispatchEvent(new Event("loading-complete"));
                        setMounted(false);
                    },
                },
                `-=${PHASE_3_DURATION * 0.35}`
            );
        });

        return () => {
            tl.kill();
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
            <div
                ref={logoWrapRef}
                style={{
                    width: `${LOGO_INITIAL_SIZE}px`,
                    height: `${LOGO_INITIAL_SIZE}px`,
                    willChange: "transform, opacity",
                    transformOrigin: "center center",
                }}
            >
                <Image
                    src="/logo-mc.png"
                    alt="MC Vidraçaria"
                    width={LOGO_INITIAL_SIZE}
                    height={LOGO_INITIAL_SIZE}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    priority
                />
            </div>
        </div>
    );
}
