/**
 * Hero.tsx
 */

import HeroBackground from "./HeroBackground";
import HeroDashboardPreview from "./HeroDashboardPreview";
import HeroWidgets from "./HeroWidgets";
import { useHeroInteractions } from "./useHeroInteractions";

export interface HeroProps {
  onDemo?: () => void;
  onExplore?: () => void;
}

export default function Hero({ onDemo, onExplore }: HeroProps) {
  const {
    containerRef,
    mousePos,
    activeSlide,
    goToSlide,
    isPaused,
    pauseHero,
    resumeHero,
    handleMouseMove,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
  } = useHeroInteractions();

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative overflow-hidden w-full bg-linear-to-b from-cyan-50/90 via-teal-50/40 to-white pt-24 sm:pt-28 md:pt-32 pb-10 touch-pan-y"
    >
      
      {/* Fondo interactivo con red de nodos y blobs */}
      <HeroBackground mousePos={mousePos} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8 sm:gap-10">
        
        {/* SECCIÓN SUPERIOR: TEXTO + VISTA PREVIA */}
        <div className="flex flex-col xl:grid xl:grid-cols-12 gap-8 xl:gap-10 items-center z-10">

          {/* COLUMNA IZQUIERDA: TEXTO PRINCIPAL */}
          <div className="w-full xl:col-span-5 flex flex-col items-center xl:items-start text-center xl:text-left gap-4 sm:gap-5 text-slate-800">
            
            <div className="inline-flex items-center gap-2 self-center xl:self-start rounded-full border border-teal-600/20 bg-teal-50/90 backdrop-blur-xs px-3.5 py-1 text-[11px] sm:text-xs font-extrabold text-teal-800 shadow-2xs">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>MONITOREO CENTRAL OFFLINE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black tracking-tight text-slate-900 leading-[1.1] text-balance">
              Métricas de salud. <br />
              <span className="text-teal-600">Visualización clara.</span>
            </h1>

            <p className="text-xs sm:text-base font-medium text-slate-600 leading-relaxed max-w-xl text-pretty">
              Tableros consolidados con estadísticas epidemiológicas y cobertura poblacional en tiempo real. Diseñado para operar de forma autónoma sin requerir internet.
            </p>

            <div className="flex flex-col sm:flex-row justify-center xl:justify-start items-center gap-3 pt-2 w-full sm:w-auto">
              <button 
                type="button"
                onClick={onDemo}
                className="w-full sm:w-auto rounded-full bg-teal-600 px-6 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-teal-600/25 hover:bg-teal-700 active:scale-[0.98] transition-all cursor-pointer text-center"
              >
                Ver demostración
              </button>
              <button 
                type="button"
                onClick={onExplore}
                className="w-full sm:w-auto rounded-full border border-slate-300/80 bg-white/90 backdrop-blur-md px-6 py-3.5 text-xs sm:text-sm font-extrabold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer shadow-2xs text-center"
              >
                Conocer plataforma
              </button>
            </div>

          </div>

          {/* COLUMNA DERECHA: VISTA PREVIA DEL DASHBOARD */}
          <div 
            className="w-full xl:col-span-7 flex justify-center origin-center"
            onMouseEnter={pauseHero}
            onMouseLeave={resumeHero}
          >
            <HeroDashboardPreview 
              activeSlide={activeSlide}
              onSelectSlide={goToSlide}
              isPaused={isPaused}
            />
          </div>

        </div>

        {/* SECCIÓN INFERIOR: WIDGETS + BANNER */}
        <div className="w-full flex flex-col gap-5 z-10">
          <HeroWidgets activeSlide={activeSlide} />

          {/* Banner inferior institucional */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-linear-to-r from-teal-950 via-slate-900 to-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:px-6 sm:py-4 text-white shadow-xl gap-4 border border-teal-500/20 text-center sm:text-left">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-xs sm:text-sm lg:text-base font-black tracking-tight text-white">
                Y mucho más por descubrir en cada rol...
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-300 font-medium">
                Explora reportes avanzados, alertas predictivas y la suite completa sin conexión.
              </p>
            </div>
            <button 
              type="button"
              onClick={onDemo}
              className="w-full sm:w-auto shrink-0 rounded-full bg-white text-slate-900 px-6 py-2.5 text-xs font-black hover:bg-teal-50 active:scale-[0.98] transition-all cursor-pointer shadow-md"
            >
              Explorar suite completa
            </button>
          </div>
        </div>

      </div>

    </section>
  );
}