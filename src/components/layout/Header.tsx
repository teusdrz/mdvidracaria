"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";

const NAV_FONT = {
  fontFamily: "var(--font-display)",
  fontWeight: 400,
  fontSize: "12px",
  letterSpacing: "0.12em",
} as const;

const NAV_LINKS = [
  { href: "/", label: "INICIO" },
  { href: "/sobre", label: "SOBRE" },
  { href: "/servicos", label: "SERVICOS" },
  { href: "/orcamento", label: "ORCAMENTO" },
  { href: "/contato", label: "CONTATO" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname.startsWith("/servicos/") || pathname === "/orcamento") return null;

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-transparent"
      >
        <div className="flex items-center justify-between h-[72px] px-14 lg:px-12 xl:px-16">
          <Link href="/" className="shrink-0" onClick={() => setMobileOpen(false)}>
            <Logo size={48} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-dark/45 hover:text-dark transition-colors duration-200"
                style={NAV_FONT}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="lg:hidden shrink-0 p-1 text-dark/60 hover:text-dark transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileOpen
              ? <X size={22} strokeWidth={1.5} />
              : <Menu size={22} strokeWidth={1.5} />}
          </button>

          <div className="hidden lg:block shrink-0 w-10" />
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 bg-white flex flex-col lg:hidden"
          >
            <nav className="flex flex-col items-center justify-center flex-1 gap-10">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: 0.07 + i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-dark/55 hover:text-dark transition-colors duration-200"
                    style={{ ...NAV_FONT, fontSize: "14px", letterSpacing: "0.22em" }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
