/* ==========================================================================
   CommunityDedicationSection.styles.ts - Fondo Oscuro Imponente & Elegante
   ========================================================================== */

export const communityDedicationStyles = {
  section: "relative py-28 md:py-36 bg-gradient-to-b from-slate-900 via-[#023a37] to-[#011e1c] text-white overflow-hidden border-t border-teal-800/40",
  glowOverlay: "absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.15)_0%,transparent_65%)] pointer-events-none",
  container: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10",
  
  wrapper: "space-y-8 md:space-y-10",
  
  badge: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-950/80 border border-teal-500/40 text-teal-300 text-xs font-bold uppercase tracking-widest shadow-xl backdrop-blur-md",
  badgeDot: "w-2 h-2 rounded-full bg-teal-400 animate-pulse",

  title: "text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15] max-w-3xl mx-auto",
  titleGradient: "bg-gradient-to-r from-teal-200 via-white to-teal-300 bg-clip-text text-transparent",
  
  divider: "w-16 h-0.5 bg-gradient-to-r from-transparent via-teal-400/60 to-transparent mx-auto rounded-full my-6",

  description: "text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto",

  accentText: "text-teal-300 font-semibold underline decoration-teal-500/50 underline-offset-4",
} as const;