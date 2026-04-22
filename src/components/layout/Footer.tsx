"use client";

import { useRef, useCallback, CSSProperties } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Camera } from "lucide-react";
import gsap from "gsap";

const NAV_LINKS = [
  { label: "Início", href: "/" },
  { label: "Modelos", href: "/#solucoes" },
  { label: "Sobre Nós", href: "/#sobre" },
  { label: "Orçamento", href: "/orcamento" },
  { label: "Contato", href: "https://wa.me/5511941123118", external: true },
];

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/mcvidracaria_oficial",
    icon: Camera,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/5511941123118",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
];

// ── Letter-by-letter hover animation ──────────────────────────
function LetterHover({
  text,
  baseColor,
  hoverColor = "#93C5FD",
  className,
  style,
  stagger = 0.03,
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
    gsap.to(chars, { color: hoverColor, stagger, duration: 0.18, ease: "power2.out" });
  }, [hoverColor, stagger]);

  const handleLeave = useCallback(() => {
    if (!ref.current) return;
    const chars = ref.current.querySelectorAll<HTMLSpanElement>(".lh-c");
    gsap.killTweensOf(chars);
    gsap.to(chars, {
      color: baseColor,
      stagger: { each: stagger, from: "end" },
      duration: 0.18,
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

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="text-white"
      style={{ background: "linear-gradient(160deg, #0c2a5e 0%, #073763 55%, #091f3a 100%)" }}
    >
      {/* Top accent line */}
      <div
        className="h-px w-full"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 40%, rgba(255,255,255,0.18) 60%, transparent 100%)" }}
      />

      {/* Main content */}
      <div
        className="w-full"
        style={{
          paddingLeft: "clamp(1.5rem, 7vw, 10rem)",
          paddingRight: "clamp(1.5rem, 7vw, 10rem)",
          paddingTop: "clamp(4rem, 7vw, 6rem)",
          paddingBottom: "clamp(4rem, 7vw, 6rem)",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[2.5fr_1fr_1.5fr] gap-12 lg:gap-20">

          {/* Brand column */}
          <div className="flex flex-col">
            <Link
              href="/"
              className="inline-block mb-6"
              aria-label="MC Vidraçaria – página inicial"
            >
              <LetterHover
                text="MC Vidraçaria"
                baseColor="#ffffff"
                hoverColor="#93C5FD"
                className="text-lg tracking-[0.18em] uppercase"
                style={{ fontFamily: "var(--font-julius)" }}
              />
            </Link>

            <p
              className="text-[13px] leading-[1.8] mb-8 max-w-xs"
              style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.45)" }}
            >
              Soluções em vidro que unem design, segurança e funcionalidade,
              transformando projetos em ambientes modernos e sofisticados.
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mt-auto">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.55)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.14)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.55)";
                  }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <h4
              className="text-[11px] tracking-[0.22em] uppercase mb-6"
              style={{
                fontFamily: "var(--font-display)",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              Páginas
            </h4>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map(({ label, href, external }) => (
                <li key={href}>
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      <LetterHover
                        text={label}
                        baseColor="rgba(255,255,255,0.5)"
                        hoverColor="#93C5FD"
                      />
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="text-[13px]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      <LetterHover
                        text={label}
                        baseColor="rgba(255,255,255,0.5)"
                        hoverColor="#93C5FD"
                      />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4
              className="text-[11px] tracking-[0.22em] uppercase mb-6"
              style={{
                fontFamily: "var(--font-display)",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              Contato
            </h4>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href="https://wa.me/5511941123118"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[13px] transition-colors duration-200 group"
                  style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.5)" }}
                >
                  <Phone
                    size={14}
                    strokeWidth={1.5}
                    className="shrink-0"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  />
                  <LetterHover
                    text="(11) 94112-3118"
                    baseColor="rgba(255,255,255,0.5)"
                    hoverColor="#93C5FD"
                    stagger={0.025}
                  />
                </a>
              </li>
              <li>
                <a
                  href="mailto:mc.vidracaria@hotmail.com"
                  className="flex items-center gap-3 text-[13px] transition-colors duration-200"
                  style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.5)" }}
                >
                  <Mail
                    size={14}
                    strokeWidth={1.5}
                    className="shrink-0"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  />
                  <LetterHover
                    text="mc.vidracaria@hotmail.com"
                    baseColor="rgba(255,255,255,0.5)"
                    hoverColor="#93C5FD"
                    stagger={0.018}
                  />
                </a>
              </li>
              <li>
                <div
                  className="flex items-start gap-3 text-[13px]"
                  style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.5)" }}
                >
                  <MapPin
                    size={14}
                    strokeWidth={1.5}
                    className="shrink-0 mt-0.5"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  />
                  <LetterHover
                    text="Rua São Vitório, 214 — São Paulo, SP"
                    baseColor="rgba(255,255,255,0.5)"
                    hoverColor="#93C5FD"
                    stagger={0.022}
                  />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div
          className="w-full py-5 flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{
            paddingLeft: "clamp(1.5rem, 7vw, 10rem)",
            paddingRight: "clamp(1.5rem, 7vw, 10rem)",
          }}
        >
          <p
            className="text-[12px]"
            style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.25)" }}
          >
            © {currentYear} MC Vidraçaria. Todos os direitos reservados.
          </p>
          <p
            className="text-[12px]"
            style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.18)" }}
          >
            Refletindo qualidade e confiança em cada projeto.
          </p>
        </div>
      </div>
    </footer>
  );
}

