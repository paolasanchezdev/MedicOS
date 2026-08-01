import React, { useRef, useState, useEffect, useCallback } from "react";
import { impactStyles } from "../ImpactSection.styles";

interface ImpactGridProps {
  onDemo?: () => void;
}

const ITEMS = [
  {
    id: "01",
    number: "01",
    tag: "Impacto Clave • 01",
    title: "Continuidad de la atención",
    subtitle: "Historiales que trascienden visitas.",
    description:
      "Permite mantener organizada la información clínica del paciente para facilitar el seguimiento entre diferentes brigadas y futuras consultas de forma estructurada.",
    footerBrand: "Beneficio comunitario",
  },
  {
    id: "02",
    number: "02",
    tag: "Impacto Clave • 02",
    title: "Más tiempo para cuidar",
    subtitle: "Menos burocracia, más atención.",
    description:
      "La digitalización y organización de los registros ayudan a reducir tareas administrativas manuales para que el personal pueda concentrarse en la atención directa.",
    footerBrand: "Beneficio comunitario",
  },
  {
    id: "03",
    number: "03",
    tag: "Impacto Clave • 03",
    title: "Decisiones respaldadas",
    subtitle: "Datos claros en el punto de atención.",
    description:
      "Acceso rápido a antecedentes y constantes vitales para fundamentar cada diagnóstico con seguridad e información relevante.",
    footerBrand: "Calidad médica",
  },
];

export const ImpactGrid: React.FC<ImpactGridProps> = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  const scrollToSlide = useCallback((index: number, smooth = true) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const slideElement = container.children[index] as HTMLElement;
    
    if (slideElement && window.innerWidth < 1024) {
      container.scrollTo({
        left: slideElement.offsetLeft - container.offsetLeft,
        behavior: smooth ? "smooth" : "auto",
      });
    }
    setActiveIndex(index);
  }, []);

  // Temporizador de rotación automática exclusivo para escritorio (PC)
  const resetAutoplay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (isPaused || (typeof window !== "undefined" && window.innerWidth < 1024)) return;

    timerRef.current = window.setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % ITEMS.length);
    }, 4000);
  }, [isPaused]);

  useEffect(() => {
    resetAutoplay();
    const handleResize = () => resetAutoplay();
    window.addEventListener("resize", handleResize);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [resetAutoplay]);

  // Manejo de scroll para móviles y tablets
  const handleScroll = () => {
    if (!scrollRef.current || window.innerWidth >= 1024) return;
    
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      if (index !== activeIndex && index >= 0 && index < ITEMS.length) {
        setActiveIndex(index);
      }
    }, 50);
  };

  const handleDotClick = (index: number) => {
    scrollToSlide(index, true);
  };

  return (
    <div 
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      onMouseEnter={() => {
        setIsPaused(true);
        if (timerRef.current) clearInterval(timerRef.current);
      }}
      onMouseLeave={() => {
        setIsPaused(false);
      }}
    >
      {/* 
        Contenedor Principal:
        - Móvil y Tablets (< lg): Carrusel horizontal fluido de 1 tarjeta por vista.
        - Escritorio (lg+): Grid de 3 columnas con rotación animada automática y cambio de color.
      */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={`
          flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth touch-pan-x pb-4 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          lg:grid lg:grid-cols-3 lg:overflow-visible lg:snap-none lg:pb-0 lg:items-center lg:gap-6
        `}
      >
        {ITEMS.map((item, index) => {
          const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
          const isHighlighted = activeIndex === index;

          return (
            <div 
              key={item.id} 
              className={`
                snap-center shrink-0 w-full flex flex-col justify-between
                lg:w-auto lg:shrink lg:snap-none
                transition-all duration-500 ease-in-out
                ${isDesktop && isHighlighted ? "lg:scale-105 lg:z-10" : isDesktop ? "lg:scale-95 lg:opacity-85" : ""}
              `}
            >
              <div 
                className={`
                  relative h-full rounded-3xl p-7 md:p-8 flex flex-col justify-between overflow-hidden transition-all duration-500 ease-in-out
                  ${isHighlighted 
                    ? "bg-[#04635C] text-white shadow-xl shadow-teal-950/15 border border-teal-500/40" 
                    : "bg-linear-to-b from-teal-50/80 via-white/60 to-teal-100/40 backdrop-blur-md border border-teal-200/80 shadow-sm text-slate-900"
                  }
                `}
              >
                {/* Número de marca de agua */}
                <span className={`absolute top-0 right-0 p-6 font-mono text-7xl md:text-8xl font-extrabold select-none pointer-events-none transition-colors duration-500 ${
                  isHighlighted ? "text-white/10" : "text-[#024945]/10"
                }`}>
                  {item.number}
                </span>

                <div>
                  {/* Etiqueta superior */}
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-4 border transition-colors duration-500 ${
                    isHighlighted 
                      ? "bg-teal-800/80 text-teal-200 border-teal-600/50" 
                      : "bg-teal-100 text-teal-800 border-teal-200"
                  }`}>
                    {item.tag}
                  </span>

                  {/* Título principal */}
                  <h3 className={`text-2xl md:text-3xl font-extrabold tracking-tight mb-2 transition-colors duration-500 ${
                    isHighlighted ? "text-white" : "text-slate-900"
                  }`}>
                    {item.title}
                  </h3>

                  {/* Subtítulo */}
                  <p className={`text-sm md:text-base font-semibold mb-3 transition-colors duration-500 ${
                    isHighlighted ? "text-teal-200" : "text-teal-800"
                  }`}>
                    {item.subtitle}
                  </p>

                  {/* Descripción */}
                  <p className={`text-xs md:text-sm leading-relaxed font-normal transition-colors duration-500 ${
                    isHighlighted ? "text-teal-50" : "text-slate-600"
                  }`}>
                    {item.description}
                  </p>
                </div>

                {/* Pie de tarjeta */}
                <div className={`mt-6 pt-4 border-t flex items-center justify-between text-[11px] font-medium transition-colors duration-500 ${
                  isHighlighted ? "border-teal-600/40 text-teal-200" : "border-teal-100/60 text-slate-500"
                }`}>
                  <span>{item.footerBrand}</span>
                  <span className={`font-bold ${isHighlighted ? "text-white" : "text-teal-800"}`}>
                    MedicOS
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicadores de Puntos (Dots) exclusivamente para móviles y tablets (< lg) */}
      <div className="flex items-center justify-center mt-6 lg:hidden">
        <div className={impactStyles.carousel.dots.wrapper}>
          {ITEMS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Slide ${idx + 1}`}
              onClick={() => handleDotClick(idx)}
              className={`${impactStyles.carousel.dots.dot} ${
                activeIndex === idx
                  ? impactStyles.carousel.dots.active
                  : impactStyles.carousel.dots.inactive
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};