"use client";

import Image from "next/image";
import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const FONT_DISPLAY = "var(--font-display)";
const FONT_JULIUS = "var(--font-julius)";
const FONT_SLAB = "var(--font-slab)";

const headingStyle = {
  fontFamily: FONT_DISPLAY,
  fontWeight: 200,
  fontSize: "clamp(48px, 5.6vw, 80px)",
} as const;

export default function HeroSection() {
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const imgParallaxRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const blueLayerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (imgContainerRef.current) {
      gsap.from(imgContainerRef.current, {
        xPercent: 12,
        autoAlpha: 0,
        duration: 1.4,
        ease: "power3.out",
        delay: 0.2,
      });
    }

    if (!imgParallaxRef.current) return;
    gsap.to(imgParallaxRef.current, {
      yPercent: -18,
      ease: "none",
      scrollTrigger: {
        trigger: imgParallaxRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
      },
    });
  });

  const onDescEnter = useCallback(() => {
    gsap.to(blueLayerRef.current, {
      clipPath: "inset(0 0% 0 0)",
      duration: 0.75,
      ease: "power2.inOut",
    });
  }, []);

  const onDescLeave = useCallback(() => {
    gsap.to(blueLayerRef.current, {
      clipPath: "inset(0 100% 0 0)",
      duration: 0.55,
      ease: "power2.inOut",
    });
  }, []);

  return (
    <section className="relative h-screen bg-white overflow-x-hidden">
      {/* Circular photo com parallax */}
      <div
        ref={imgContainerRef}
        className="absolute hidden md:block rounded-full overflow-hidden"
        style={{
          width: "84vw",
          height: "80vw",
          maxWidth: "1179px",
          maxHeight: "1118px",
          left: "50%",
          top: "-3%",
        }}
      >
        <div
          ref={imgParallaxRef}
          style={{
            position: "absolute",
            inset: 0,
            top: "-15%",
            height: "130%",
          }}
        >
          <Image
            src="/images/espelhos/image.png"
            alt="Espelho redondo com LED instalado"
            fill
            className="object-cover"
            style={{ objectPosition: "50% 40%" }}
            priority
          />
        </div>
      </div>

      {/* Content — Figma: REFLETINDO at X:41 Y:438 em frame 1440px */}
      <div className="relative z-10 h-full flex flex-col">
        <div
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
          style={{
            paddingLeft: "clamp(32px, 6vw, 120px)",
            paddingTop: "clamp(180px, 30vh, 320px)",
          }}
        >
          {/* Small logo icon — above REFLETINDO, matching Figma position */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block pointer-events-none mb-4"
            style={{
              width: "40px",
              height: "60px",
              marginLeft: "clamp(120px, 18vw, 260px)",
            }}
          >
            <Image
              src="/logo-mc.png"
              alt=""
              width={54}
              height={80}
              className="object-contain w-full h-full opacity-40"
              aria-hidden="true"
            />
          </motion.div>

          {/* Line 1: REFLETINDO */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="uppercase tracking-[0.01em] text-dark leading-none"
            style={headingStyle}
          >
            REFLETINDO
          </motion.p>

          {/* Line 2: [QUALIDADE ->] EM CADA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex items-center justify-center gap-3 mt-1 lg:justify-start"
          >
            <motion.span
              className="inline-flex items-center gap-2 text-white uppercase leading-none cursor-default"
              style={{
                fontFamily: FONT_JULIUS,
                fontWeight: 400,
                fontSize: "clamp(36px, 3.8vw, 55px)",
                paddingInline: "clamp(14px, 1.2vw, 18px)",
                paddingBlock: "clamp(8px, 0.7vw, 11px)",
                background:
                  "linear-gradient(90deg, #1B38A2 0%, #18318D 53%, #0F2266 100%)",
                borderRadius: "17px",
                boxShadow: "0 4px 14px rgba(15, 34, 102, 0.35)",
              }}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 8px 28px rgba(15, 34, 102, 0.52)",
              }}
              transition={{ type: "spring", stiffness: 340, damping: 22 }}
            >
              QUALIDADE
              <ArrowRight
                size={20}
                strokeWidth={1.5}
                className="shrink-0 opacity-80"
              />
            </motion.span>
            <span
              className="uppercase text-dark leading-none"
              style={{
                fontFamily: FONT_SLAB,
                fontWeight: 400,
                fontSize: "clamp(24px, 2.4vw, 35px)",
              }}
            >
              EM CADA
            </span>
          </motion.div>

          {/* Line 3: PROJETO — Figma: Josefin Slab Light 80px, letter-spacing 6% */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="uppercase text-dark leading-none mt-1"
            style={{
              fontFamily: FONT_SLAB,
              fontWeight: 300,
              fontSize: "clamp(48px, 5.6vw, 80px)",
              letterSpacing: "0.06em",
            }}
          >
            PROJETO
          </motion.p>

        </div>

        {/* Description text — efeito pintura azul (wipe) ao passar o mouse */}
        <div
          ref={descRef}
          className="absolute uppercase text-center left-8 right-8 lg:text-left lg:left-[18vw] lg:right-auto lg:max-w-[440px]"
          style={{
            fontFamily: FONT_JULIUS,
            fontWeight: 400,
            fontSize: "15px",
            lineHeight: "1.9",
            bottom: "clamp(60px, 10vh, 120px)",
            cursor: "default",
            position: "absolute",
          }}
          onMouseEnter={onDescEnter}
          onMouseLeave={onDescLeave}
        >
          {/* Camada base — texto cinza */}
          <p style={{ color: "rgba(0,0,0,0.40)" }}>
            Solucoes em vidro que unem design, seguranca e funcionalidade,
            transformando projetos arquitetonicos em ambientes modernos e sofisticados.
          </p>
          {/* Camada azul — revelada da esquerda para a direita via clip-path */}
          <div
            ref={blueLayerRef}
            style={{
              position: "absolute",
              inset: 0,
              clipPath: "inset(0 100% 0 0)",
              color: "#1C4587",
            }}
          >
            <p>
              Solucoes em vidro que unem design, seguranca e funcionalidade,
              transformando projetos arquitetonicos em ambientes modernos e sofisticados.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
