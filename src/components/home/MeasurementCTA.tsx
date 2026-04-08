"use client";

import { motion } from "framer-motion";
import { Ruler, Calculator, Send, ArrowRight } from "lucide-react";

export default function MeasurementCTA() {
  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-gold/[0.02]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="relative bg-gradient-to-br from-primary-dark via-primary to-primary-light rounded-3xl overflow-hidden p-8 md:p-12 lg:p-16">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/10 rounded-full translate-y-1/3 -translate-x-1/3" />
          <div className="absolute top-1/2 right-1/4 w-32 h-32 border border-white/5 rounded-2xl rotate-45" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-1.5 text-xs tracking-[0.3em] uppercase font-medium text-gold border border-gold/30 rounded-full mb-6"
              >
                Nova Funcionalidade
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-heading text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-6"
              >
                Calcule Suas Medidas
                <br />
                <span className="text-gold">Online</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-white/60 leading-relaxed mb-8 max-w-lg"
              >
                Utilize nossa ferramenta interativa para inserir as medidas do
                seu projeto, escolher o tipo de vidro e receber um orcamento
                personalizado diretamente no seu WhatsApp.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <a
                  href="https://wa.me/5511941123118"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gold text-white font-semibold rounded-lg hover:bg-gold-light transition-all duration-300 hover:shadow-lg hover:shadow-gold/25 text-sm uppercase tracking-widest group"
                >
                  Falar no WhatsApp
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </a>
              </motion.div>
            </div>

            {/* Steps visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-4"
            >
              {[
                {
                  icon: <Ruler size={22} />,
                  title: "1. Insira as Medidas",
                  desc: "Largura e altura do seu projeto em centimetros",
                },
                {
                  icon: <Calculator size={22} />,
                  title: "2. Escolha as Opcoes",
                  desc: "Tipo de vidro, acabamento e especificacoes",
                },
                {
                  icon: <Send size={22} />,
                  title: "3. Receba o Orcamento",
                  desc: "Enviamos direto no seu WhatsApp",
                },
              ].map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center text-gold shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm mb-1">
                      {step.title}
                    </h4>
                    <p className="text-white/40 text-sm">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
