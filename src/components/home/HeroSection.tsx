"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useArchitectMode } from "@/hooks/useArchitectMode";

const HEADLINE_LINES = [
  { text: "REFLETINDO", color: "#ffffff", architectColor: "#1C4587" },
  { text: "QUALIDADE  EM CADA", color: "#5BC8F5", architectColor: "#1C4587" },
  { text: "PROJETO", color: "#ffffff", architectColor: "#1C4587" },
] as const;

const TRANSITION_DURATION = 0.8;
const TRANSITION_EASE = "power3.inOut";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { active } = useArchitectMode();

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.to(sectionRef.current, {
      backgroundColor: active ? "#ffffff" : "#0d1b2e",
      duration: TRANSITION_DURATION,
      ease: TRANSITION_EASE,
    });
  }, [active]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center"
      style={{ background: "#0d1b2e" }}
    >
      <Background active={active} />
      <Content active={active} />
      <ScrollIndicator active={active} />
      <WatermarkLogo active={active} />
    </section>
  );
}

function Background({ active }: { active: boolean }) {
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imageRef.current || !overlayRef.current) return;
    gsap.to(imageRef.current, {
      opacity: active ? 0 : 1,
      duration: TRANSITION_DURATION,
      ease: TRANSITION_EASE,
    });
    gsap.to(overlayRef.current, {
      opacity: active ? 0 : 1,
      duration: TRANSITION_DURATION,
      ease: TRANSITION_EASE,
    });
  }, [active]);

  return (
    <div className="absolute inset-0 z-0">
      <div ref={imageRef}>
        <Image
          src="/image-home/Image-home.jpeg"
          alt=""
          fill
          priority
          sizes="100vw"
          aria-hidden="true"
          className="object-cover"
          style={{ objectPosition: "center 15%", opacity: 0.55 }}
        />
      </div>
      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(13,27,46,0.45) 0%, rgba(13,27,46,0.15) 35%, rgba(13,27,46,0.70) 100%)",
        }}
      />
    </div>
  );
}

function Content({ active }: { active: boolean }) {
  return (
    <div className="relative z-10 flex flex-col items-center" style={{ gap: "32px", paddingTop: "72px" }}>
      <Headline active={active} />
      <SearchBar active={active} />
    </div>
  );
}

function Headline({ active }: { active: boolean }) {
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const { displayLines, cursorLine, done } = useTypewriter({
    lines: [...HEADLINE_LINES],
    charDuration: 0.05,
    lineDelay: 0.18,
    initialDelay: 0.3,
    waitForLoading: true,
  });

  useEffect(() => {
    lineRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        color: active ? HEADLINE_LINES[i].architectColor : HEADLINE_LINES[i].color,
        duration: TRANSITION_DURATION,
        ease: TRANSITION_EASE,
      });
    });
  }, [active]);

  const titleStyle: React.CSSProperties = {
    fontFamily: "var(--font-jura)",
    fontWeight: 700,
    fontSize: "clamp(28px, 4.5vw, 56px)",
    letterSpacing: "0.20em",
    lineHeight: 1.05,
    textTransform: "uppercase",
    display: "block",
    textAlign: "center",
    minHeight: "1.1em",
    whiteSpace: "pre",
  };

  return (
    <div className="flex flex-col items-center" style={{ gap: "0px" }}>
      {HEADLINE_LINES.map((line, i) => (
        <span
          key={i}
          ref={(el) => { lineRefs.current[i] = el; }}
          style={{ ...titleStyle, color: line.color }}
        >
          {displayLines[i]}
          {cursorLine === i && !done && <Cursor active={active} />}
        </span>
      ))}
    </div>
  );
}

function Cursor({ active }: { active: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      background: active ? "#1C4587" : "#5BC8F5",
      duration: TRANSITION_DURATION,
      ease: TRANSITION_EASE,
    });
  }, [active]);

  return (
    <span
      ref={ref}
      className="inline-block"
      style={{
        width: "2px",
        height: "0.85em",
        background: "#5BC8F5",
        marginLeft: "2px",
        verticalAlign: "middle",
        animation: "blink 0.6s step-end infinite",
      }}
    />
  );
}

function SearchBar({ active }: { active: boolean }) {
  const borderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!borderRef.current || !textRef.current) return;
    gsap.to(borderRef.current, {
      borderColor: active ? "rgba(28,69,135,0.55)" : "rgba(255,255,255,0.55)",
      duration: TRANSITION_DURATION,
      ease: TRANSITION_EASE,
    });
    gsap.to(textRef.current, {
      color: active ? "rgba(28,69,135,0.50)" : "rgba(255,255,255,0.50)",
      duration: TRANSITION_DURATION,
      ease: TRANSITION_EASE,
    });
  }, [active]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 2.8 }}
      style={{ width: "100%", maxWidth: "580px", padding: "0 20px" }}
    >
      <div
        ref={borderRef}
        style={{
          border: "1.5px solid rgba(255,255,255,0.55)",
          borderRadius: "40px",
          padding: "13px 30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          ref={textRef}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "9px",
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.50)",
          }}
        >
          Pesquise seu modelo para deixar sua refletindo qualidade
        </span>
      </div>
    </motion.div>
  );
}

function ScrollIndicator({ active }: { active: boolean }) {
  const lineRef = useRef<SVGLineElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const color = active ? "rgba(28,69,135,0.45)" : "rgba(255,255,255,0.45)";
    if (lineRef.current) {
      gsap.to(lineRef.current, { attr: { stroke: color }, duration: TRANSITION_DURATION, ease: TRANSITION_EASE });
    }
    if (pathRef.current) {
      gsap.to(pathRef.current, { attr: { stroke: color }, duration: TRANSITION_DURATION, ease: TRANSITION_EASE });
    }
  }, [active]);

  return (
    <motion.div
      className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.2, duration: 0.6 }}
    >
      <svg width="14" height="38" viewBox="0 0 14 38" fill="none">
        <line ref={lineRef} x1="7" y1="0" x2="7" y2="28" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />
        <path
          ref={pathRef}
          d="M1 22 L7 30 L13 22"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}

function WatermarkLogo({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const img = ref.current.querySelector("img");
    if (!img) return;
    gsap.to(img, {
      filter: active ? "brightness(0)" : "brightness(1)",
      duration: TRANSITION_DURATION,
      ease: TRANSITION_EASE,
    });
  }, [active]);

  return (
    <motion.div
      ref={ref}
      className="absolute bottom-8 right-12 z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.4, duration: 0.6 }}
    >
      <Image
        src="/logo-mc.png"
        alt=""
        width={82}
        height={82}
        aria-hidden="true"
        className="object-contain"
        style={{ opacity: 0.30 }}
      />
    </motion.div>
  );
}
