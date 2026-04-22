"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import { architectWhyCards } from "@/data/architectWhyChoose";

export default function ArchitectWhyCards() {
  const flippedRef = useRef<Map<number, boolean>>(new Map());

  const onEnter = useCallback((el: HTMLDivElement) => {
    gsap.to(el, { y: -7, boxShadow: "0 20px 52px rgba(7,55,99,0.28)", borderColor: "transparent", duration: 0.4, ease: "power2.out" });
    gsap.to(el.querySelector(".wcu-gradient-overlay"), { clipPath: "inset(0% 0 0 0)", duration: 0.6, ease: "power3.out" });
    gsap.to(el.querySelector(".wcu-icon-bg"), { backgroundColor: "rgba(255,255,255,0.15)", duration: 0.35, ease: "power2.out", delay: 0.1 });
    gsap.to(el.querySelector(".wcu-icon-svg"), { color: "#ffffff", duration: 0.35, ease: "power2.out", delay: 0.1 });
    gsap.to(el.querySelector(".wcu-title"), { color: "#ffffff", duration: 0.32, ease: "power2.out", delay: 0.13 });
    gsap.to(el.querySelector(".wcu-desc"), { color: "rgba(255,255,255,0.7)", duration: 0.35, ease: "power2.out", delay: 0.16 });
    gsap.to(el.querySelector(".wcu-hint"), { color: "rgba(255,255,255,0.4)", duration: 0.35, ease: "power2.out", delay: 0.19 });
  }, []);

  const onLeave = useCallback((el: HTMLDivElement) => {
    gsap.to(el, { y: 0, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", borderColor: "rgba(0,0,0,0.09)", duration: 0.45, ease: "power2.inOut" });
    gsap.to(el.querySelector(".wcu-gradient-overlay"), { clipPath: "inset(100% 0 0 0)", duration: 0.55, ease: "power3.inOut" });
    gsap.to(el.querySelector(".wcu-icon-bg"), { backgroundColor: "rgba(28,69,135,0.07)", duration: 0.38, ease: "power2.inOut" });
    gsap.to(el.querySelector(".wcu-icon-svg"), { color: "var(--color-primary)", duration: 0.38, ease: "power2.inOut" });
    gsap.to(el.querySelector(".wcu-title"), { color: "#1a1a1a", duration: 0.35, ease: "power2.inOut" });
    gsap.to(el.querySelector(".wcu-desc"), { color: "rgba(163,163,163,1)", duration: 0.35, ease: "power2.inOut" });
    gsap.to(el.querySelector(".wcu-hint"), { color: "rgba(212,212,212,1)", duration: 0.35, ease: "power2.inOut" });
  }, []);

  const onFlip = useCallback((wrap: HTMLDivElement, idx: number) => {
    const flipper = wrap.querySelector<HTMLDivElement>(".wcu-flipper");
    if (!flipper) return;
    const isFlipped = flippedRef.current.get(idx) ?? false;
    flippedRef.current.set(idx, !isFlipped);
    gsap.to(flipper, { rotateY: isFlipped ? 0 : 180, duration: 0.75, ease: "power3.inOut" });
  }, []);

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5"
      style={{ paddingLeft: "clamp(1rem, 4vw, 7rem)", paddingRight: "clamp(1rem, 4vw, 7rem)" }}
    >
      {architectWhyCards.map(({ icon: Icon, title, description, backStat, backLabel, backQuote }, idx) => (
        <div
          key={idx}
          className="wcu-card"
          style={{ minHeight: "320px", perspective: "1200px", cursor: "pointer" }}
          onMouseEnter={(e) => onEnter(e.currentTarget)}
          onMouseLeave={(e) => onLeave(e.currentTarget)}
          onClick={(e) => onFlip(e.currentTarget, idx)}
        >
          <div
            className="wcu-flipper relative w-full h-full"
            style={{ transformStyle: "preserve-3d", minHeight: "320px" }}
          >
            {/* FRENTE */}
            <div
              className="absolute inset-0 flex flex-col rounded-2xl"
              style={{
                padding: "clamp(2rem, 3.5vw, 2.75rem)",
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.09)",
                boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <div
                className="wcu-gradient-overlay absolute inset-0 rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, #073763 0%, #1C4587 50%, #2A5FAD 100%)",
                  clipPath: "inset(100% 0 0 0)",
                  pointerEvents: "none",
                }}
              />
              <div
                className="wcu-icon-bg relative z-10 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(28,69,135,0.07)", flexShrink: 0 }}
              >
                <Icon className="wcu-icon-svg" size={22} strokeWidth={1.6} style={{ color: "var(--color-primary)" }} />
              </div>
              <h3
                className="wcu-title relative z-10 mt-8 text-[15px] font-semibold leading-snug"
                style={{ fontFamily: "var(--font-body)", color: "#1a1a1a" }}
              >
                {title}
              </h3>
              <p
                className="wcu-desc relative z-10 mt-4 mb-auto text-[13px] leading-[1.8] text-neutral-400"
                style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}
              >
                {description}
              </p>
              <p
                className="wcu-hint relative z-10 mt-6 text-[9px] tracking-[0.22em] uppercase text-neutral-300"
                style={{ fontFamily: "var(--font-display)" }}
              >
                clique para ver mais
              </p>
            </div>

            {/* VERSO */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl text-center"
              style={{
                padding: "clamp(2rem, 3.5vw, 2.75rem)",
                background: "linear-gradient(135deg, #1B38A2 0%, #18318D 50%, #0F2266 100%)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <span className="text-[3.5rem] font-bold leading-none text-white" style={{ fontFamily: "var(--font-julius)" }}>
                {backStat}
              </span>
              <p className="mt-4 text-[13px] leading-[1.7] text-white/75" style={{ fontFamily: "var(--font-body)" }}>
                {backLabel}
              </p>
              <div className="w-10 my-6" style={{ height: "1px", background: "rgba(255,255,255,0.25)" }} />
              <p className="text-[12px] italic leading-relaxed text-white/50" style={{ fontFamily: "var(--font-body)" }}>
                &ldquo;{backQuote}&rdquo;
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
