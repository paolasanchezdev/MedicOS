/* =========================================================================
   ARCHIVO:
   apps/web/src/modules/landing/components/sections/HowItWorks/HowItWorks.styles.ts
   ========================================================================= */

export const HowItWorksStyles = {
  // Sección más limpia, eliminando bordes horizontales pesados
  section:
    "relative isolate w-full bg-medicos-canvas py-16 sm:py-24 lg:py-32 select-none overflow-hidden scroll-mt-20",

  topTransition:
    "pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-medicos-canvas via-medicos-canvas/80 to-transparent z-10",

  container:
    "relative z-20 mx-auto flex w-[92%] max-w-7xl flex-col items-center gap-12 sm:gap-16 lg:gap-24",

  /* -----------------------------------------------------------------------
     1. ENCABEZADO (Jerarquía clara y directa)
     ----------------------------------------------------------------------- */
  header:
    "flex flex-col items-center text-center max-w-3xl mx-auto gap-3.5 shrink-0 px-2",

  badge:
    "inline-flex items-center gap-2 rounded-full border border-medicos-teal/20 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-medicos-teal shadow-2xs",

  badgeDot:
    "h-2 w-2 rounded-full bg-medicos-cyan animate-pulse",

  title:
    "text-2xl sm:text-4xl lg:text-5xl font-black leading-[1.15] tracking-tight bg-linear-to-r from-medicos-teal via-medicos-dark-blue to-medicos-teal bg-clip-text text-transparent",

  description:
    "text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal max-w-2xl",

  /* -----------------------------------------------------------------------
     2. ARQUITECTURA TÉCNICA (Sintetizada: Pasa de ser una caja a un strip minimalista)
     ----------------------------------------------------------------------- */
  architectureBanner:
    "w-full max-w-5xl rounded-2xl bg-white/60 border border-slate-200/70 p-3 sm:p-4 shadow-2xs backdrop-blur-md",

  bannerGrid:
    "grid grid-cols-1 md:grid-cols-3 gap-3 divide-y md:divide-y-0 md:divide-x divide-slate-200/60",

  bannerItem:
    "flex items-center gap-3.5 p-2 sm:px-4",

  bannerIconBox:
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-medicos-teal/10 text-medicos-teal",

  bannerTitle:
    "text-xs sm:text-sm font-bold text-medicos-dark-blue",

  bannerText:
    "text-[11px] sm:text-xs leading-tight text-slate-500",

  /* -----------------------------------------------------------------------
     3. LÍNEA DE TIEMPO / SECUENCIA DEL FLUJO
     ----------------------------------------------------------------------- */
  timelineWrapper:
    "relative w-full flex flex-col gap-16 sm:gap-24 lg:gap-32",

  /* Conector vertical minimalista y elegante para desktop */
  timelineCentralLine:
    "hidden md:block absolute left-1/2 top-12 bottom-12 w-0.5 -translate-x-1/2 bg-linear-to-b from-medicos-teal/30 via-medicos-cyan/50 to-medicos-teal/20 z-0",

  /* Filas de la secuencia con buen espaciado */
  timelineRow:
    "relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center",

  /* Nodo flotante moderno para el número de paso */
  timelineNode:
    "hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white border-2 border-medicos-teal shadow-md z-20 font-mono text-xs font-black text-medicos-teal",

  /* Tarjeta de Contenido: Sin bordes pesados ni doble empaquetado */
  stepCard:
    "group relative flex flex-col justify-center rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-2xs hover:shadow-xl hover:border-medicos-teal/30 transition-all duration-300",

  stepHeader:
    "flex items-center justify-between gap-3 mb-3",

  stepNumber:
    "text-xs font-mono font-bold tracking-widest text-medicos-teal bg-medicos-teal/10 px-2.5 py-1 rounded-md",

  stepBadge:
    "text-[10px] font-bold uppercase tracking-wider text-medicos-cyan bg-medicos-cyan/10 px-2.5 py-1 rounded-full",

  stepTitle:
    "text-xl sm:text-2xl font-black tracking-tight text-medicos-dark-blue group-hover:text-medicos-teal transition-colors mb-2",

  stepDescription:
    "text-sm leading-relaxed text-slate-600 font-normal mb-4",

  stepTechBox:
    "pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-medicos-teal font-medium mt-auto",

  /* Mockup / Imagen Hero (Sin marco pesado alrededor, la imagen respira libremente) */
  stepImageWrapper:
    "relative w-full h-56 sm:h-72 md:h-80 lg:h-96 rounded-3xl overflow-hidden flex items-center justify-center transition-all duration-500",

  stepImage:
    "w-full h-full object-contain object-center drop-shadow-md group-hover:scale-103 transition-transform duration-500 ease-out",

  /* -----------------------------------------------------------------------
     4. BLOQUE FINAL DE RESUMEN (Cierre Limpio)
     ----------------------------------------------------------------------- */
  syncCallout:
    "relative w-full max-w-4xl rounded-3xl border border-medicos-teal/20 bg-linear-to-r from-medicos-teal/5 via-white to-medicos-cyan/5 p-6 sm:p-10 shadow-xs overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left",

  syncContent:
    "flex flex-col gap-2 max-w-xl",

  syncTitle:
    "text-lg sm:text-2xl font-black text-medicos-dark-blue tracking-tight",

  syncDescription:
    "text-xs sm:text-sm leading-relaxed text-slate-600",

  syncStatusBadge:
    "inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold font-mono text-medicos-teal border border-medicos-teal/20 shadow-2xs shrink-0",

  /* Efectos Ambientales */
  ambientGlow:
    "pointer-events-none absolute -left-40 top-1/4 h-[30rem] w-[30rem] rounded-full bg-medicos-cyan/10 blur-3xl",

  ambientGlowSecondary:
    "pointer-events-none absolute -right-40 bottom-1/4 h-[30rem] w-[30rem] rounded-full bg-medicos-teal/10 blur-3xl",
} as const;