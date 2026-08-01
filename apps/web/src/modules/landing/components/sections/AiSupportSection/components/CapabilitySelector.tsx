/* ==========================================================================
   CapabilitySelector.tsx
   ========================================================================== */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AiCapability } from "../data/aiSectionData";

interface Props {
  capabilities: AiCapability[];
  activeId: string;
  onSelect: (id: string) => void;
}

export const CapabilitySelector: React.FC<Props> = ({
  capabilities,
  activeId,
  onSelect,
}) => {
  const activeIndex = capabilities.findIndex((c) => c.id === activeId);

  /* Touch gestures para Swipe */
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const getIcon = (id: string) => {
    switch (id) {
      case "validation": return "⚡";
      case "patterns": return "📈";
      case "recommendations": return "💡";
      case "context": return "🔍";
      default: return "✨";
    }
  };

  const nextSlide = () => {
    const nextIdx = (activeIndex + 1) % capabilities.length;
    onSelect(capabilities[nextIdx].id);
  };

  const prevSlide = () => {
    const prevIdx = (activeIndex - 1 + capabilities.length) % capabilities.length;
    onSelect(capabilities[prevIdx].id);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 40) nextSlide();
    else if (distance < -40) prevSlide();
    setTouchStart(null);
    setTouchEnd(null);
  };

  const activeItem = capabilities[activeIndex] || capabilities[0];

  return (
    <>
      {/* VISTA MÓVIL (< sm): Tarjeta Única Optimizada con Animación y Controles */}
      <div className="block sm:hidden w-full">
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl border bg-white border-teal-300/80 shadow-md shadow-teal-900/5 ring-2 ring-teal-500/15 flex flex-col justify-between min-h-52"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-teal-50 text-teal-700 text-base border border-teal-200/60 shadow-2xs">
                      {getIcon(activeItem.id)}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-teal-700 uppercase bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/50">
                      Capacidad 0{activeIndex + 1}/0{capabilities.length}
                    </span>
                  </div>

                  {/* Controles de navegación táctil */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={prevSlide}
                      type="button"
                      className="h-8 w-8 rounded-lg bg-teal-50/80 text-teal-700 hover:bg-teal-100 flex items-center justify-center text-sm font-bold active:scale-95 transition-all"
                      aria-label="Anterior capacidad"
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextSlide}
                      type="button"
                      className="h-8 w-8 rounded-lg bg-teal-50/80 text-teal-700 hover:bg-teal-100 flex items-center justify-center text-sm font-bold active:scale-95 transition-all"
                      aria-label="Siguiente capacidad"
                    >
                      ›
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
                  {activeItem.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {activeItem.description}
                </p>
              </div>

              {/* Indicador de estado sincronizado */}
              <div className="mt-3 pt-2.5 border-t border-teal-900/5 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping" />
                  Simulando en vivo
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Desliza ↔</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* VISTA TABLET / DESKTOP (>= sm): Grid de 2 columnas */}
      <div className="hidden sm:grid sm:grid-cols-2 gap-3.5 lg:gap-4">
        {capabilities.map((item, index) => {
          const isActive = activeId === item.id;

          return (
            <motion.button
              key={item.id}
              type="button"
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(item.id)}
              className={`relative p-4 sm:p-5 rounded-2xl sm:rounded-3xl cursor-pointer text-left transition-all duration-300 border flex flex-col justify-between w-full h-full ${
                isActive
                  ? "bg-white border-teal-300/80 shadow-lg shadow-teal-900/5 ring-2 ring-teal-500/15"
                  : "bg-white/70 hover:bg-white/90 border-teal-100/80 hover:border-teal-200/80 shadow-2xs"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeGlow"
                  className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-teal-500/5 pointer-events-none"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-2xl bg-teal-50/80 text-teal-700 text-lg border border-teal-200/60 shadow-2xs">
                    {getIcon(item.id)}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-teal-800/50 uppercase">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight mb-1">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 font-normal">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-teal-900/5 flex items-center justify-between w-full">
                <span className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? "bg-teal-500 animate-ping" : "bg-slate-300"
                    }`}
                  />
                  {isActive ? "Simulando" : "Probar"}
                </span>
                <span className="text-teal-600 text-xs font-bold">→</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </>
  );
};

export default CapabilitySelector;