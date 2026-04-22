"use client";

import { useRef, useCallback, useEffect, CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Gem, ShieldCheck, Clock3, Users } from "lucide-react";
import { useArchitectMode } from "@/hooks/useArchitectMode";
import ArchitectWhyCards from "@/components/home/architect/ArchitectWhyCards";

gsap.registerPlugin(ScrollTrigger);

// ── Letter-by-letter hover animation ──────────────────────────
function LetterHover({
  text,
  baseColor,
  hoverColor = "#1C4587",
  className,
  style,
  stagger = 0.025,
}: {
  text: string;
  baseColor: string;
  hoverColor?: string;
  className?: string;
  style?: CSSProperties;
  stagger?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const handleEnter = useCallback(() => {
    if (!ref.current) return;
    const chars = ref.current.querySelectorAll<HTMLSpanElement>(".lh-c");
    gsap.killTweensOf(chars);
    gsap.to(chars, { color: hoverColor, stagger, duration: 0.2, ease: "power2.out" });
  }, [hoverColor, stagger]);

  const handleLeave = useCallback(() => {
    if (!ref.current) return;
    const chars = ref.current.querySelectorAll<HTMLSpanElement>(".lh-c");
    gsap.killTweensOf(chars);
    gsap.to(chars, {
      color: baseColor,
      stagger: { each: stagger, from: "end" },
      duration: 0.2,
      ease: "power2.in",
    });
  }, [baseColor, stagger]);

  return (
    <span
      ref={ref}
      className={className}
      style={style}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          className={char !== " " ? "lh-c" : undefined}
          style={{ color: char !== " " ? baseColor : undefined }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
// ────────────────────────────────────────────────────────────────

const REASONS = [
  {
    icon: Gem,
    title: "Acabamento técnico e refinado",
    description:
      "Cada projeto é executado com atenção aos mínimos detalhes, garantindo um acabamento impecável que une sofisticação e precisão técnica.",
    backStat: "100%",
    backLabel: "dos projetos entregues com garantia total de qualidade",
    backQuote: "Cada detalhe é uma assinatura do nosso trabalho.",
  },
  {
    icon: ShieldCheck,
    title: "Materiais de alta qualidade",
    description:
      "Trabalhamos apenas com vidros e acessórios de procedência confiável, assegurando durabilidade, resistência e estética superior em cada instalação.",
    backStat: "+15",
    backLabel: "anos selecionando os melhores materiais e fornecedores",
    backQuote: "Qualidade que você vê e sente todos os dias.",
  },
  {
    icon: Clock3,
    title: "Compromisso com prazos e qualidade",
    description:
      "Respeitamos o tempo de nossos clientes, entregando obras dentro do prazo estabelecido sem abrir mão da excelência em cada etapa.",
    backStat: "98%",
    backLabel: "de entregas realizadas dentro do prazo combinado",
    backQuote: "Seu tempo é tão valioso quanto o nosso resultado.",
  },
  {
    icon: Users,
    title: "Equipe capacitada para instalações complexas",
    description:
      "Contamos com profissionais especializados e experientes, preparados para realizar desde os projetos mais simples até os mais desafiadores.",
    backStat: "+500",
    backLabel: "projetos concluídos com excelência pela nossa equipe",
    backQuote: "Experiência que transforma desafios em soluções.",
  },
];

export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const flippedRef = useRef<Map<string, boolean>>(new Map());
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { active } = useArchitectMode();

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const newText = active ? "POR QUE ARQUITETOS NOS ESCOLHEM" : "POR QUE NOS ESCOLHER";
    gsap.to(el, {
      autoAlpha: 0, y: -10, duration: 0.25, ease: "power2.in",
      onComplete: () => {
        // Atualiza os spans internos do LetterHover não é viável — trocamos por texto simples temporariamente
        // mas como LetterHover é inline, forçamos via data-text
        el.setAttribute("data-text", newText);
        gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" });
      },
    });
  }, [active]);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
        },
      });

      tl.from(".wcu-heading", { opacity: 0, y: 32, duration: 0.85, ease: "power3.out" })
        .from(".wcu-card", {
          opacity: 0,
          y: 36,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.11,
        }, "-=0.35");
    },
    { scope: sectionRef }
  );

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

  const onFlip = useCallback((wrap: HTMLDivElement, title: string) => {
    const flipper = wrap.querySelector<HTMLDivElement>(".wcu-flipper");
    if (!flipper) return;
    const isFlipped = flippedRef.current.get(title) ?? false;
    flippedRef.current.set(title, !isFlipped);
    gsap.to(flipper, { rotateY: isFlipped ? 0 : 180, duration: 0.75, ease: "power3.inOut" });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-white pt-0 pb-28 md:pb-36 lg:pb-44"
    >
      <div className="w-full text-center px-6" style={{ marginBottom: "6rem" }}>
        <h2
          ref={titleRef}
          className="wcu-heading inline-block text-[2rem] md:text-[2.5rem] lg:text-[3rem] leading-[1.1]"
          style={{ fontFamily: "var(--font-julius)", letterSpacing: "0.01em" }}
        >
          <LetterHover
            text={active ? "POR QUE ARQUITETOS NOS ESCOLHEM" : "POR QUE NOS ESCOLHER"}
            baseColor="#1a1a1a"
            hoverColor="#1C4587"
            stagger={0.03}
          />
        </h2>
      </div>

      {active ? (
        <ArchitectWhyCards />
      ) : (
      <div style={{ width: "100%", paddingLeft: "clamp(1rem, 4vw, 7rem)", paddingRight: "clamp(1rem, 4vw, 7rem)" }}>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {REASONS.map(({ icon: Icon, title, description, backStat, backLabel, backQuote }) => (
            <div
              key={title}
              className="wcu-card"
              style={{ minHeight: "320px", perspective: "1200px", cursor: "pointer" }}
              onMouseEnter={(e) => onEnter(e.currentTarget)}
              onMouseLeave={(e) => onLeave(e.currentTarget)}
              onClick={(e) => onFlip(e.currentTarget, title)}
            >
              {/* Flipper */}
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
                    <Icon
                      className="wcu-icon-svg"
                      size={22}
                      strokeWidth={1.6}
                      style={{ color: "var(--color-primary)" }}
                    />
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
                  <span
                    className="text-[3.5rem] font-bold leading-none text-white"
                    style={{ fontFamily: "var(--font-julius)" }}
                  >
                    {backStat}
                  </span>

                  <p
                    className="mt-4 text-[13px] leading-[1.7] text-white/75"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {backLabel}
                  </p>

                  <div className="w-10 my-6" style={{ height: "1px", background: "rgba(255,255,255,0.25)" }} />

                  <p
                    className="text-[12px] italic leading-relaxed text-white/50"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    &ldquo;{backQuote}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
      )}
    </section>
  );
}
