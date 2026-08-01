/* =========================================================================
   ARCHIVO: MainModules.styles.ts
   ========================================================================= */

export const mainModulesStyles = {
  // Sección con respiración limpia y fluida
  section:
    "relative isolate py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-medicos-canvas select-none overflow-hidden scroll-mt-20",

  container: "max-w-7xl mx-auto w-full space-y-8 sm:space-y-12",

  // Encabezado
  headerWrapper: "text-center max-w-3xl mx-auto space-y-3 mb-4",
  eyebrow:
    "inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-medicos-teal/10 text-medicos-teal border border-medicos-teal/20 shadow-2xs",
  eyebrowDot: "w-2 h-2 rounded-full bg-medicos-cyan animate-pulse",
  title:
    "text-3xl sm:text-4xl lg:text-5xl font-black text-medicos-dark-blue tracking-tight leading-[1.15]",
  titleHighlight:
    "text-medicos-teal block sm:inline",
  description:
    "text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal",

  // Tabs / Selector de Rol (Estilo flotante PWA)
  selectorContainer: "w-full flex justify-center mb-4 z-10",
  selectorList:
    "w-full max-w-md grid grid-cols-3 gap-1.5 p-1.5 bg-slate-200/60 backdrop-blur-md rounded-2xl border border-slate-300/50 shadow-inner",
  selectorTab: (isActive: boolean) =>
    `w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer select-none whitespace-nowrap ${
      isActive
        ? "bg-white text-medicos-dark-blue shadow-sm scale-100"
        : "text-slate-600 hover:text-medicos-dark-blue hover:bg-white/50"
    }`,

  // Grid Principal
  grid: "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch",
  infoColumn:
    "lg:col-span-5 flex flex-col justify-between items-center text-center lg:items-start lg:text-left py-2",
  showcaseColumn: "lg:col-span-7 flex items-center justify-center w-full",

  // Detalles del Rol (Columna Izquierda)
  badgeBase:
    "inline-flex items-center px-3 py-1 rounded-lg text-[11px] font-bold font-mono tracking-wider uppercase mb-3 self-center lg:self-start border shadow-2xs",
  roleBadge: (role: string) => {
    switch (role) {
      case "brigadista":
        return "bg-amber-500/10 text-amber-700 border-amber-500/30";
      case "paciente":
        return "bg-emerald-500/10 text-emerald-700 border-emerald-500/30";
      case "doctor":
        return "bg-medicos-teal/10 text-medicos-teal border-medicos-teal/30";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  },
  roleTitle:
    "text-2xl sm:text-3xl lg:text-4xl font-black text-medicos-dark-blue tracking-tight text-center lg:text-left mb-2",
  roleSubtitle:
    "text-sm sm:text-base font-semibold text-medicos-teal mb-4 text-center lg:text-left",
  roleDescription:
    "text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 text-center lg:text-left max-w-xl",

  // Lista de Características (Bullets Limpios)
  featureList: "space-y-4 mb-6 text-left w-full max-w-xl",
  featureItem: "flex items-start gap-3.5 text-xs sm:text-sm text-slate-700 leading-snug",
  featureIconWrapper:
    "w-5 h-5 rounded-full bg-medicos-teal/15 text-medicos-teal flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5 shadow-2xs",

  // Indicador Técnico
  techIndicatorContainer:
    "pt-4 border-t border-slate-200/80 w-full flex justify-center lg:justify-start",
  techIndicator:
    "inline-flex items-center gap-2.5 text-xs font-mono font-medium text-slate-600 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs",
  pulseDot: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse",

  // Tarjeta de Showcase UI (Lado Derecho)
  showcaseCard:
    "w-full bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[420px]",
  showcaseHeader:
    "flex items-center justify-between pb-3.5 border-b border-slate-100 mb-5",
  showcaseBadge:
    "text-xs font-mono font-bold uppercase tracking-wider text-medicos-teal bg-medicos-teal/10 px-2.5 py-1 rounded-md",
  showcaseStatus:
    "flex items-center gap-2 text-xs font-mono text-slate-500",

  // Banner Nota Futura (Cierre)
  futureNoteContainer:
    "mt-6 p-4 sm:p-5 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left",
  futureNoteBadge:
    "px-3 py-1 rounded-md text-xs font-mono font-bold uppercase bg-medicos-cyan/10 text-medicos-cyan border border-medicos-cyan/20 shrink-0",
  futureNoteTitle: "text-xs sm:text-sm font-bold text-medicos-dark-blue shrink-0",
  futureNoteText: "text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl",
} as const;