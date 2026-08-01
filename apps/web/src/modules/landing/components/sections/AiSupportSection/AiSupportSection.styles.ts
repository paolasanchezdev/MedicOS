/* ==========================================================================
   AiSupportSection.styles.ts
   ========================================================================== */

export const aiSupportStyles = {
  /* Contenedores Principales */
  // 🔴 CORREGIDO: Reducción del padding vertical excesivo (py-12 sm:py-16 lg:py-20)
  section:
    "relative isolate overflow-hidden w-full bg-medicos-canvas py-12 sm:py-16 lg:py-20 border-t border-teal-950/10 select-none",
  container:
    "relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12 lg:space-y-16",

  /* Encabezado Principal */
  headerWrapper: "text-left max-w-3xl space-y-3 sm:space-y-4 relative z-10",
  eyebrowBadge:
    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] sm:text-xs font-black font-mono uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-300 shadow-2xs",
  eyebrowDot: "w-2 h-2 rounded-full bg-teal-500 animate-pulse",
  
  // 🔴 CORREGIDO: Escala tipográfica adaptativa
  titleMain:
    "text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-[1.12] text-slate-900",
  titleAccent:
    "bg-linear-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent font-extrabold",
  description:
    "text-xs sm:text-sm lg:text-base leading-relaxed text-slate-600 font-normal max-w-2xl",

  /* Capacidades de Asistencia (AiCapabilities.tsx) */
  capabilitiesGrid: "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6",
  capabilityCard:
    "group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-teal-200/80 bg-white/85 hover:bg-white backdrop-blur-md p-5 sm:p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-default",
  capabilityIconBox:
    "flex items-center justify-center h-10 w-10 rounded-2xl bg-teal-50 border border-teal-200/80 text-teal-700 text-lg group-hover:scale-110 transition-transform duration-300 mb-3 sm:mb-4",
  capabilityTitle:
    "text-base font-bold text-slate-900 tracking-tight mb-1 group-hover:text-teal-900 transition-colors",
  capabilityDescription:
    "text-xs sm:text-sm text-slate-600 leading-relaxed font-normal",

  /* Tarjeta Destacada "Supervisión Profesional Permanente" */
  capabilityHighlightCard:
    "relative rounded-2xl sm:rounded-3xl bg-linear-to-br from-slate-900 via-teal-950 to-slate-950 border border-teal-500/40 p-5 sm:p-8 shadow-xl overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 cursor-default group",
  highlightBadge:
    "inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-xs",
  highlightTitle:
    "text-lg sm:text-2xl font-extrabold text-white tracking-tight leading-tight",
  highlightDescription:
    "text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-normal",
  highlightSidebarBox:
    "w-full md:w-64 p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white/90 shadow-inner flex flex-col justify-center shrink-0",

  /* Flujo Transversal de Información (AiDataFlowPipeline.tsx)
     🔴 CORREGIDO: Carrusel en móvil (< md), 2 columnas en Tablet (md) y 4 en Desktop (lg) */
  pipelineContainer: "w-full space-y-4 sm:space-y-6 overflow-hidden",
  pipelineHeader: "text-left mb-2 sm:mb-4",
  pipelineTitle:
    "text-xs font-bold font-mono uppercase tracking-widest text-teal-800/80",
  pipelineGrid:
    "flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar pb-4 md:pb-0 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 items-stretch touch-pan-x",

  /* Ajuste de tarjeta individual */
  nodeCard:
    "group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-teal-200/80 bg-white/85 hover:bg-white backdrop-blur-md p-4 sm:p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-default h-full w-[82vw] sm:w-[300px] md:w-full shrink-0 md:shrink snap-center",

  nodeStepHeader: "flex items-center justify-between gap-2 mb-3 relative z-10",
  nodeStepNumber:
    "text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-300 group-hover:text-teal-600 transition-colors",
  nodeImageWrapper:
    "mb-3 flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-teal-50 border border-teal-200/80 shadow-2xs overflow-hidden",
  nodeBadge: (type?: string) => {
    switch (type) {
      case "ai":
        return "bg-teal-100 text-teal-800 border-teal-300 shadow-2xs";
      case "doctor":
        return "bg-emerald-100 text-emerald-800 border-emerald-300 shadow-2xs";
      case "warning":
        return "bg-amber-100 text-amber-800 border-amber-300 shadow-2xs";
      case "neutral":
      default:
        return "bg-cyan-100 text-cyan-800 border-cyan-300 shadow-2xs";
    }
  },
  nodeTitle:
    "text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide truncate",
  nodeSubtitle:
    "text-[10px] sm:text-[11px] font-bold font-mono uppercase tracking-wider text-teal-700",
  nodeDescription:
    "text-xs font-medium text-slate-600 mt-1 leading-snug line-clamp-3",
  nodeExampleBox:
    "mt-3 p-2.5 sm:p-3 rounded-2xl bg-teal-50/80 border border-teal-200/60 text-[11px] text-slate-700 leading-normal font-sans italic backdrop-blur-xs shadow-xs",

  /* Banner Inferior (AiHumanControl.tsx) */
  humanControlWrapper:
    "relative w-full rounded-2xl sm:rounded-3xl border border-teal-200/80 bg-white/90 backdrop-blur-xl p-5 sm:p-8 lg:p-10 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-default",
  humanControlContent:
    "grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10",
  humanControlTextGroup: "lg:col-span-7 space-y-3 sm:space-y-4",
  humanControlBadge:
    "inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-300 shadow-2xs",
  humanControlTitle:
    "text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight",
  humanControlDescription:
    "text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed font-normal",
  humanControlQuote:
    "lg:col-span-5 p-4 sm:p-6 rounded-2xl bg-linear-to-br from-teal-900 to-slate-900 border border-teal-700 text-white shadow-md relative overflow-hidden border-l-4 border-l-teal-400",
};