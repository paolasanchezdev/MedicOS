/* =========================================================================
   ARCHIVO:
   apps/web/src/modules/landing/components/sections/SolutionSection/SolutionSection.styles.ts
   ========================================================================= */

export const SolutionSectionStyles = {
  // Con scroll-mt para navegación fluida desde el menú y padding simétrico
  section:
    "relative isolate w-full bg-medicos-light-bg/80 py-12 sm:py-16 lg:py-24 select-none border-y border-medicos-soft-border/60 overflow-hidden scroll-mt-20 lg:scroll-mt-28",

  topTransition:
    "pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-medicos-canvas to-transparent z-10",

  // Layout responsivo estandarizado con max-w-7xl y padding uniforme
  container:
    "relative z-20 mx-auto flex w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex-col items-center gap-8 md:gap-10",

  /* -----------------------------------------------------------------------
     1. ENCABEZADO NARRATIVO
     ----------------------------------------------------------------------- */
  header:
    "flex flex-col items-center text-center max-w-3xl mx-auto gap-2.5 shrink-0 px-2",

  badge:
    "inline-flex items-center gap-2.5 rounded-full border border-medicos-teal/30 bg-medicos-surface px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-medicos-teal shadow-2xs",

  badgeDot:
    "h-2 w-2 rounded-full bg-medicos-cyan animate-pulse",

  title:
    "text-2xl sm:text-3xl lg:text-[2.25rem] font-extrabold leading-[1.18] tracking-tight bg-linear-to-r from-medicos-teal via-medicos-dark-blue to-medicos-teal bg-clip-text text-transparent",

  description:
    "text-xs sm:text-sm lg:text-base leading-relaxed text-slate-600 font-medium max-w-2xl px-2",

  /* -----------------------------------------------------------------------
     2. DIAGRAMA DE ARQUITECTURA (NODO Y CONECTOR)
     ----------------------------------------------------------------------- */
  architectureHub:
    "relative w-full flex flex-col items-center gap-6 md:gap-8 shrink-0 px-2",

  stationCard:
    "relative z-20 flex items-center justify-between gap-3 sm:gap-4 rounded-2xl border-2 border-medicos-teal/40 bg-medicos-surface px-4 sm:px-6 py-3 shadow-md max-w-md w-full hover:border-medicos-teal hover:shadow-lg transition-all duration-300",

  stationStatus:
    "flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-medicos-teal rounded-full bg-medicos-light-bg px-2.5 sm:px-3 py-0.5 border border-medicos-teal/20 shrink-0",

  stationPulse:
    "relative flex h-3 w-3 items-center justify-center",

  stationPulsePing:
    "absolute inline-flex h-full w-full animate-ping rounded-full bg-medicos-cyan opacity-75",

  stationPulseDot:
    "relative inline-flex h-2 w-2 rounded-full bg-medicos-teal",

  stationTitle:
    "text-xs sm:text-base font-extrabold tracking-tight text-medicos-dark-blue truncate",

  stationSub:
    "text-[10px] sm:text-[11px] font-mono text-medicos-muted truncate",

  flowConnector:
    "relative flex flex-col items-center justify-center -my-3 z-10",

  flowLine:
    "h-6 w-0.5 bg-linear-to-b from-medicos-teal/60 via-medicos-cyan to-medicos-teal/30",

  flowBadge:
    "text-[9px] font-mono font-bold uppercase tracking-widest text-medicos-teal bg-medicos-surface px-2.5 py-0.5 rounded-full border border-medicos-teal/20 shadow-2xs -my-1 z-20",

  /* -----------------------------------------------------------------------
     3. TARJETAS DE ACTORES Y CARRUSEL MÓVIL
     ----------------------------------------------------------------------- */
  actorsGrid:
    "hidden md:grid md:grid-cols-3 gap-4 lg:gap-6 w-full z-10",

  carouselWrapper:
    "block md:hidden w-full relative z-10",

  carouselCardContainer:
    "w-full transition-all duration-300 ease-in-out min-h-[320px]",

  carouselControls:
    "flex items-center justify-between w-full mt-4 px-2",

  carouselDots:
    "flex items-center justify-center gap-2",

  carouselDot:
    "h-2.5 rounded-full transition-all duration-300 cursor-pointer",

  carouselDotActive:
    "w-7 bg-medicos-teal shadow-2xs",

  carouselDotInactive:
    "w-2.5 bg-medicos-teal/20 hover:bg-medicos-teal/40",

  carouselBtn:
    "flex h-9 w-9 items-center justify-center rounded-xl border border-medicos-soft-border bg-medicos-surface text-medicos-teal shadow-xs active:scale-95 hover:bg-medicos-light-bg transition-all disabled:opacity-30",

  actorCard:
    "group relative flex flex-col justify-between h-full rounded-2xl sm:rounded-3xl border border-medicos-soft-border bg-medicos-surface p-5 lg:p-6 shadow-2xs hover:shadow-xl hover:border-medicos-teal/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden",

  actorHeader:
    "flex items-center justify-between gap-3 mb-2",

  actorRoleBadge:
    "inline-flex items-center rounded-xl bg-medicos-light-bg px-3 py-1 text-xs font-bold font-mono uppercase tracking-wider text-medicos-teal group-hover:bg-medicos-teal group-hover:text-white transition-colors duration-300",

  actorTag:
    "text-[10px] font-bold uppercase tracking-widest text-medicos-cyan block mb-1",

  actorTitle:
    "text-base sm:text-lg lg:text-xl font-bold tracking-tight text-medicos-dark-blue group-hover:text-medicos-teal transition-colors mb-1.5",

  actorDescription:
    "text-xs sm:text-sm leading-relaxed text-slate-600 font-medium",

  imageWrapper:
    "relative w-full h-32 sm:h-36 lg:h-40 mt-3 shrink-0 overflow-hidden flex items-center justify-center p-1",

  cardImage:
    "w-full h-full object-contain object-center group-hover:scale-108 transition-transform duration-500 ease-out",

  /* -----------------------------------------------------------------------
     4. BARRA INFERIOR DE SINCRONIZACIÓN
     ----------------------------------------------------------------------- */
  syncBar:
    "relative z-20 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-medicos-teal/20 bg-medicos-surface p-4 sm:px-6 shadow-2xs hover:border-medicos-teal/40 transition-colors shrink-0 w-full",

  syncLeft:
    "flex items-center gap-3 text-xs sm:text-sm font-medium text-medicos-teal",

  syncIcon:
    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-medicos-light-bg text-medicos-teal border border-medicos-soft-border shadow-2xs",

  syncText:
    "leading-snug text-slate-700 text-xs sm:text-sm text-center sm:text-left",

  syncHighlight:
    "font-bold text-medicos-teal",

  syncBadge:
    "inline-flex items-center gap-2 shrink-0 rounded-full bg-medicos-light-bg px-3 py-1 text-[11px] font-bold text-medicos-teal border border-medicos-teal/20",

  ambientGlow:
    "pointer-events-none absolute -left-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-medicos-cyan/15 blur-3xl",

  ambientGlowSecondary:
    "pointer-events-none absolute -right-48 top-0 h-80 w-80 rounded-full bg-medicos-teal/10 blur-3xl",
} as const;