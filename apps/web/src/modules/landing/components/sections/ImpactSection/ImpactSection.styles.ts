/* ==========================================================================
   ImpactSection.styles.ts - Tokens y Clases Estilizadas (Tailwind CSS v4)
   ========================================================================== */

export const impactStyles = {
  section: "relative py-20 md:py-28 bg-slate-50/50 border-t border-slate-200/60 overflow-hidden",
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  
  header: {
    wrapper: "text-center max-w-3xl mx-auto mb-12 md:mb-16",
    badge: "inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-800 text-xs font-bold uppercase tracking-widest mb-4 shadow-2xs",
    badgeDot: "w-2 h-2 rounded-full bg-[#024945]",
    title: "text-3xl md:text-4xl lg:text-5xl font-extrabold bg-linear-to-r from-[#024945] via-teal-700 to-teal-500 bg-clip-text text-transparent tracking-tight leading-[1.15]",
    description: "mt-4 text-base md:text-lg text-slate-600 leading-relaxed font-normal",
  },

  /* CONTENEDORES Y NAVEGACIÓN DEL CARRUSEL */
  carousel: {
    viewport: "flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth touch-pan-x pb-8 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
    slide: "snap-center shrink-0 w-[85vw] sm:w-[380px] md:w-[420px] flex flex-col justify-between",
    controls: "flex items-center justify-between mt-4 px-2",
    arrows: {
      wrapper: "flex items-center gap-2",
      button: "size-10 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-teal-50 hover:border-teal-300 hover:text-[#024945] transition-all shadow-xs cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed",
    },
    dots: {
      wrapper: "flex items-center gap-2",
      dot: "h-2 rounded-full transition-all duration-300 cursor-pointer",
      active: "w-6 bg-[#024945]",
      inactive: "w-2 bg-slate-300 hover:bg-slate-400",
    }
  },

  cards: {
    featured: {
      wrapper: "relative h-full rounded-3xl bg-[#04635C] text-white p-7 md:p-8 shadow-xl shadow-teal-950/15 overflow-hidden border border-teal-500/40 transition-all duration-300 hover:shadow-2xl hover:border-teal-400 flex flex-col justify-between",
      watermarkNumber: "absolute top-0 right-0 p-6 text-white/10 font-mono text-7xl md:text-8xl font-extrabold select-none pointer-events-none",
      tag: "inline-block px-3 py-1 rounded-full bg-teal-800/80 text-teal-200 text-xs font-mono font-bold uppercase tracking-wider mb-4 border border-teal-600/50 self-start",
      title: "text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2",
      subtitle: "text-teal-200 text-sm md:text-base font-semibold mb-3",
      description: "text-teal-50 text-xs md:text-sm leading-relaxed font-normal",
    },
    secondary: {
      wrapper: "group relative h-full rounded-3xl bg-linear-to-b from-teal-50/80 via-white/60 to-teal-100/40 backdrop-blur-md border border-teal-200/80 p-6 md:p-8 shadow-sm hover:shadow-xl hover:shadow-teal-950/10 hover:bg-linear-to-b hover:from-teal-100/90 hover:via-teal-50/90 hover:to-teal-200/60 hover:border-teal-400/80 transition-all duration-300 flex flex-col justify-between",
      number: "font-mono text-2xl md:text-3xl font-extrabold text-[#024945]/30 group-hover:text-[#024945]/60 transition-colors",
      dot: "w-2 h-2 rounded-full bg-teal-500/60 group-hover:bg-[#024945] group-hover:scale-125 transition-all",
      title: "text-lg font-bold text-slate-900 mb-1 group-hover:text-[#024945] transition-colors",
      subtitle: "text-xs font-semibold text-teal-800 mb-3",
      description: "text-xs md:text-sm text-slate-600 leading-relaxed",
      footer: "mt-6 pt-4 border-t border-teal-100/60 group-hover:border-teal-300/60 flex items-center justify-between text-[11px] text-slate-500 font-medium transition-colors",
      footerBrand: "text-teal-800 font-bold",
    },
  },
};