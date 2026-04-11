"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Logo from "@/components/Logo";
import { useArchitectMode } from "@/hooks/useArchitectMode";

/* ─── dados ─── */

const NAV_LINKS = [
  { href: "/pronta-entrega", label: "MODELOS" },
  { href: "/", label: "INICIO" },
  { href: "/sobre", label: "SOBRE" },
];

const SCROLL_THRESHOLD = 100;

/* ─── cores por estado ─── */

const COLORS = {
  hero: {
    text: "rgba(255,255,255,0.85)",
    textHover: "#ffffff",
    btnText: "#ffffff",
    btnBorder: "rgba(255,255,255,0.70)",
    btnHoverText: "#1C4587",
    btnHoverBorder: "#ffffff",
    btnBg: "#ffffff",
    logoVariant: "light" as const,
  },
  scrolled: {
    text: "rgba(28,69,135,0.85)",
    textHover: "#1C4587",
    btnText: "#1C4587",
    btnBorder: "rgba(28,69,135,0.50)",
    btnHoverText: "#ffffff",
    btnHoverBorder: "#1C4587",
    btnBg: "#1C4587",
    logoVariant: "dark" as const,
  },
};

/* ─── hook de scroll ─── */

function useScrolled(threshold: number) {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > threshold);
  }, [threshold]);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return scrolled;
}

/* ─── componente principal ─── */

export default function Header() {
  const pathname = usePathname();
  const scrolled = useScrolled(SCROLL_THRESHOLD);
  const { active: architectMode, toggle: toggleArchitect } = useArchitectMode();

  if (pathname.startsWith("/servicos/") || pathname === "/orcamento") return null;

  const colors = (scrolled || architectMode) ? COLORS.scrolled : COLORS.hero;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="flex items-center justify-between h-[72px] px-10 lg:px-20">
        <Link href="/" className="shrink-0">
          <Logo size={44} variant={colors.logoVariant} />
        </Link>

        <NavLinks colors={colors} architectMode={architectMode} onToggleArchitect={toggleArchitect} />

        <ContactButton colors={colors} />
      </div>
    </motion.header>
  );
}

/* ─── links de navegação ─── */

function NavLinks({
  colors,
  architectMode,
  onToggleArchitect,
}: {
  colors: typeof COLORS.hero;
  architectMode: boolean;
  onToggleArchitect: () => void;
}) {
  return (
    <nav
      className="hidden lg:flex items-center gap-10"
      style={{ marginRight: "auto", marginLeft: "clamp(40px, 6vw, 100px)" }}
    >
      {NAV_LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "11px",
            letterSpacing: "0.18em",
            fontWeight: 400,
            color: colors.text,
            textDecoration: "none",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = colors.textHover;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = colors.text;
          }}
        >
          {label}
        </Link>
      ))}

      <button
        type="button"
        onClick={onToggleArchitect}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "11px",
          letterSpacing: "0.18em",
          fontWeight: architectMode ? 600 : 400,
          color: architectMode ? "#1C4587" : colors.text,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          transition: "color 0.3s ease, font-weight 0.3s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.color = architectMode ? "#1C4587" : colors.textHover;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.color = architectMode ? "#1C4587" : colors.text;
        }}
      >
        ARQUITETO
      </button>
    </nav>
  );
}

/* ─── botão de contato ─── */

function ContactButton({ colors }: { colors: typeof COLORS.hero }) {
  return (
    <Link
      href="/orcamento"
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "11px",
        letterSpacing: "0.18em",
        fontWeight: 400,
        color: colors.btnText,
        border: `1.5px solid ${colors.btnBorder}`,
        borderRadius: "4px",
        padding: "8px 20px",
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        position: "relative",
        overflow: "hidden",
        zIndex: 1,
        transition: "color 0.35s ease, border-color 0.35s ease",
        marginRight: "clamp(4px, 1vw, 12px)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.color = colors.btnHoverText;
        el.style.borderColor = colors.btnHoverBorder;
        const bg = el.querySelector<HTMLSpanElement>(".btn-bg");
        if (bg) bg.style.transform = "translateY(0)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.color = colors.btnText;
        el.style.borderColor = colors.btnBorder;
        const bg = el.querySelector<HTMLSpanElement>(".btn-bg");
        if (bg) bg.style.transform = "translateY(100%)";
      }}
    >
      <span
        className="btn-bg"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: colors.btnBg,
          transform: "translateY(100%)",
          transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          zIndex: -1,
          borderRadius: "3px",
        }}
      />
      CONTATO
      <span style={{ fontSize: "13px", lineHeight: 1 }}>→</span>
    </Link>
  );
}
