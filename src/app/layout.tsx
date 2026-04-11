import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import ArchitectModeProvider from "@/hooks/useArchitectMode";

export const metadata: Metadata = {
  title: "MC Vidracaria | Vidros & Design - Solucoes em Vidro Premium",
  description:
    "MC Vidracaria oferece solucoes em vidro que unem design, seguranca e funcionalidade. Espelhos, box de vidro, guarda corpo, divisorias, sacadas e coberturas. Orcamento online.",
  keywords:
    "vidracaria, espelhos, box de vidro, guarda corpo, divisorias, sacada, cobertura, vidro temperado, Sao Paulo",
  openGraph: {
    title: "MC Vidracaria | Vidros & Design",
    description:
      "Solucoes em vidro que unem design, seguranca e funcionalidade.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-body">
        <ArchitectModeProvider>
          <LoadingScreen />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ArchitectModeProvider>
      </body>
    </html>
  );
}
