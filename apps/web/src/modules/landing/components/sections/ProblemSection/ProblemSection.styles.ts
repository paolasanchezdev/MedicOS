/* =========================================================================
   ARCHIVO: ProblemSection.styles.ts
   ========================================================================= */

export const ProblemSectionStyles = {
  section:
    "relative isolate w-full pt-20 pb-16 sm:pt-24 sm:pb-20 lg:py-24 bg-medicos-canvas select-none overflow-hidden scroll-mt-20 lg:scroll-mt-28",

  topTransition:
    "pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-medicos-canvas via-medicos-canvas/80 to-transparent z-10",

  container:
    "relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-center",

  /* COLUMNA IZQUIERDA */
  leftColumn:
    "flex flex-col items-center text-center lg:items-start lg:text-left gap-4 lg:gap-5 lg:col-span-5 w-full max-w-2xl lg:max-w-none mx-auto lg:mx-0",

  badge:
    "inline-flex items-center gap-2.5 rounded-full border border-medicos-teal/20 bg-medicos-surface px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-medicos-teal shadow-2xs",

  badgeDot:
    "h-2 w-2 rounded-full bg-medicos-cyan animate-pulse",

  title:
    "w-full text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.18] tracking-tight bg-linear-to-r from-medicos-teal via-medicos-dark-blue to-medicos-teal bg-clip-text text-transparent text-center lg:text-left",

  description:
    "w-full text-sm sm:text-base lg:text-lg leading-relaxed text-medicos-muted font-normal text-center lg:text-left",

  contextLine:
    "mt-1 flex items-center justify-center lg:justify-start gap-3 text-xs sm:text-sm lg:text-base font-bold text-medicos-teal w-full",

  contextLineIndicator:
    "h-0.5 w-8 sm:w-10 bg-medicos-cyan rounded-full shrink-0",

  contextLineText:
    "tracking-wide",

  closingMessage:
    "mt-1 w-full border-l-4 border-medicos-teal pl-4 text-xs sm:text-sm lg:text-base font-medium leading-relaxed text-slate-800 bg-white py-3.5 pr-3 rounded-r-2xl shadow-2xs text-left border-y border-r border-slate-200/80",

  /* COLUMNA DERECHA */
  rightColumn:
    "relative lg:col-span-7 w-full flex flex-col items-center",

  carouselWrapper:
    "relative w-full flex flex-col items-center gap-4 touch-pan-y",

  // Mantiene overlay de carrusel en < lg y lista desplegada en Desktop (>= lg)
  gridContainer:
    "grid grid-cols-1 grid-rows-1 w-full justify-items-center lg:flex lg:flex-col gap-4 lg:gap-5",

  // Ancho adaptable: max-w-md en móviles, max-w-2xl en tablets, y ancho completo en desktop
  challengeItem:
    "group relative col-start-1 row-start-1 w-full max-w-md md:max-w-2xl lg:max-w-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs hover:shadow-xl hover:border-medicos-teal/30 transition-all duration-500 ease-out box-border",

  itemContent:
    "flex min-w-0 flex-1 flex-col gap-1.5 justify-center text-left w-full",

  itemBadge:
    "text-[10px] sm:text-xs font-black uppercase tracking-widest text-medicos-teal bg-medicos-light-bg border border-medicos-teal/20 px-2.5 py-0.5 rounded-md self-start transition-colors duration-300 group-hover:border-medicos-teal/40",

  itemTitle:
    "text-base sm:text-lg lg:text-xl font-black leading-snug tracking-tight text-medicos-dark-blue group-hover:text-medicos-teal transition-colors duration-300",

  itemDescription:
    "text-xs sm:text-sm leading-relaxed text-slate-600 font-medium",

  imageWrapper:
    "relative size-20 sm:size-28 lg:size-32 shrink-0 overflow-hidden flex items-center justify-center self-end sm:self-center p-1",

  cardImage:
    "max-w-full max-h-full object-contain object-center group-hover:scale-110 transition-transform duration-500 ease-out",

  imagePlaceholder:
    "flex flex-col items-center justify-center gap-2 text-medicos-teal/40 group-hover:text-medicos-teal transition-colors duration-300 p-3 text-center",

  /* PUNTOS DE NAVEGACIÓN EN MÓVIL Y TABLET (< lg) */
  dotsContainer:
    "flex lg:hidden items-center justify-center gap-2.5 pt-4 w-full z-20",

  dot: (isActive: boolean) =>
    `h-2.5 rounded-full transition-all duration-500 ease-out cursor-pointer ${
      isActive
        ? "w-8 bg-medicos-teal shadow-xs"
        : "w-2.5 bg-slate-300 hover:bg-medicos-teal/50"
    }`,

  /* EFECTOS AMBIENTALES */
  ambientGlow:
    "pointer-events-none absolute -right-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-medicos-cyan/10 blur-3xl",

  ambientGlowSecondary:
    "pointer-events-none absolute -left-48 bottom-0 h-80 w-80 rounded-full bg-medicos-teal/5 blur-3xl",

  surfaceAccent:
    "pointer-events-none absolute right-[8%] top-[10%] h-32 w-32 rounded-full border border-medicos-soft-border/40 opacity-40",
} as const;