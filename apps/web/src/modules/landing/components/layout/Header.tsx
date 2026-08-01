// =========================================================================
// ARCHIVO: apps/web/src/core/components/Header.tsx
// DESCRIPCIÓN: Header con efecto Liquid Glass optimizado para fluidez en tablets y móviles.
// =========================================================================

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full pt-4 pb-3 bg-[#070814]/50 backdrop-blur-md border-b border-white/10 select-none shadow-xl">
      <div className="w-[94%] sm:w-[92%] max-w-6xl mx-auto">
        {/* Contenedor Flotante Estilo Liquid Glass */}
        <div className="relative backdrop-blur-3xl bg-slate-950/60 border border-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all duration-300">
          
          {/* Brillo superior e inferior interno para realzar el efecto cristal líquido */}
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/80 to-transparent rounded-t-full pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent rounded-b-full pointer-events-none" />

          {/* Logo y Eslogan */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <img 
              src="/logo.png" 
              alt="MedicOS" 
              className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform shrink-0" 
            />
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-black text-white tracking-tight flex items-center gap-1.5 sm:gap-2">
                MedicOS
                <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-semibold">
                  v2.0
                </span>
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-300 font-medium tracking-wide hidden xs:block">
                Tu salud, nuestra prioridad
              </span>
            </div>
          </Link>

          {/* Navegación Desktop (Ahora cambia a lg:flex para dar espacio seguro en tablets / iPads) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-semibold text-white">
            <a href="#inicio" className="text-cyan-300 hover:text-cyan-200 transition-colors drop-shadow">Inicio</a>
            <a href="#funciones" className="text-slate-100 hover:text-cyan-300 transition-colors drop-shadow">Funciones</a>
            <a href="#beneficios" className="text-slate-100 hover:text-cyan-300 transition-colors drop-shadow">Beneficios</a>
            <a href="#nosotros" className="text-slate-100 hover:text-cyan-300 transition-colors drop-shadow">Nosotros</a>
            <a href="#contacto" className="text-slate-100 hover:text-cyan-300 transition-colors drop-shadow">Contacto</a>
          </nav>

          {/* CTA Principal (Escritorio) */}
          <div className="hidden lg:flex items-center">
            <Link
              to="/login"
              className="px-5 xl:px-6 py-2.5 rounded-full bg-linear-to-r from-cyan-400 via-teal-300 to-indigo-400 text-slate-950 font-bold text-sm hover:opacity-95 shadow-[0_0_25px_rgba(99,201,214,0.6)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Iniciar sesión</span>
            </Link>
          </div>

          {/* Menú Móvil / Tablet Botón (Se muestra en pantallas menores a lg) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white hover:text-cyan-300 focus:outline-hidden cursor-pointer"
            aria-label="Abrir menú"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menú Desplegable Móvil / Tablet */}
        {isOpen && (
          <div className="lg:hidden mt-2 backdrop-blur-3xl bg-slate-950/90 border border-white/30 px-6 py-6 space-y-4 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-3 text-white font-semibold">
              <a href="#inicio" onClick={() => setIsOpen(false)} className="text-cyan-300 py-1">Inicio</a>
              <a href="#funciones" onClick={() => setIsOpen(false)} className="hover:text-cyan-300 py-1 transition-colors">Funciones</a>
              <a href="#beneficios" onClick={() => setIsOpen(false)} className="hover:text-cyan-300 py-1 transition-colors">Beneficios</a>
              <a href="#nosotros" onClick={() => setIsOpen(false)} className="hover:text-cyan-300 py-1 transition-colors">Nosotros</a>
              <a href="#contacto" onClick={() => setIsOpen(false)} className="hover:text-cyan-300 py-1 transition-colors">Contacto</a>
            </nav>
            <div className="pt-2 border-t border-white/10">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center w-full py-3 bg-linear-to-r from-cyan-400 to-teal-400 text-slate-950 font-bold rounded-full shadow-lg shadow-cyan-500/20"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};