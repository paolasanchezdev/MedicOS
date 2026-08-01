/* ==========================================================================
   AiCapabilities.tsx
   ========================================================================== */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { AI_SECTION_DATA } from "../data/aiSectionData";
import { aiSupportStyles } from "../AiSupportSection.styles";
import { CapabilitySelector } from "./CapabilitySelector";
import { ClinicalSimulator } from "./ClinicalSimulator";

export const AiCapabilities: React.FC = () => {
  const { capabilities } = AI_SECTION_DATA;

  const standardCapabilities = capabilities.filter((c) => !c.isHighlight);
  const highlightCapability = capabilities.find((c) => c.isHighlight);

  const [activeId, setActiveId] = useState<string>("validation");

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Título de Sección */}
      <div className="text-center">
        <p className={`${aiSupportStyles.pipelineTitle} text-[10px] sm:text-xs tracking-widest`}>
          • CAPACIDADES DE ASISTENCIA EN TIEMPO REAL •
        </p>
      </div>

      {/* Grid Principal: Selector + Simulador */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
        <div className="lg:col-span-7">
          <CapabilitySelector
            capabilities={standardCapabilities}
            activeId={activeId}
            onSelect={(id) => setActiveId(id)}
          />
        </div>

        <div className="lg:col-span-5">
          <ClinicalSimulator activeId={activeId} />
        </div>
      </div>

      {/* Tarjeta Destacada "Supervisión Profesional" */}
      {highlightCapability && (
        <motion.div
          whileHover={{ scale: 1.003 }}
          transition={{ duration: 0.2 }}
          className="relative rounded-2xl sm:rounded-3xl bg-linear-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-500/30 p-5 sm:p-6 lg:p-8 shadow-xl overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6"
        >
          <div className="relative z-10 space-y-2 flex-1">
            {/* Badges con flex-wrap para evitar desbordamientos en móviles muy estrechos */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                {highlightCapability.badge || "Inviolable"}
              </span>
              <span className="text-slate-400 text-[11px] sm:text-xs font-mono">
                | Regla de Arquitectura Médica
              </span>
            </div>

            <h3 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
              {highlightCapability.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl font-normal">
              {highlightCapability.description}
            </p>
          </div>

          <div className="relative z-10 w-full md:w-auto shrink-0">
            <div className="px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white shadow-inner flex items-center gap-3">
              <span className="text-xl sm:text-2xl">🛡️</span>
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-300">
                  Control Absoluto
                </p>
                <p className="text-xs font-semibold text-slate-200">
                  El médico siempre decide
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AiCapabilities;