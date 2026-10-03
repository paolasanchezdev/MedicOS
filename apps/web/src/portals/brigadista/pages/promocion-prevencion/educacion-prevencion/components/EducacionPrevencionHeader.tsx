// =========================================================================
// ARCHIVO: EducacionPrevencionHeader.tsx
// DESCRIPCIÓN: Encabezado oficial con fecha dinámica de jornada y acciones directas.
// =========================================================================

import React from 'react';
import { ShieldCheck, Calendar, RefreshCw, BookOpen, Bug } from 'lucide-react';

interface EducacionPrevencionHeaderProps {
  onActualizar: () => void;
  onNuevaEducacion: () => void;
  onNuevoVector: () => void;
  loading?: boolean;
}

export const EducacionPrevencionHeader: React.FC<EducacionPrevencionHeaderProps> = ({
  onActualizar,
  onNuevaEducacion,
  onNuevoVector,
  loading = false,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#166E7A] p-4 sm:p-5 text-white shadow-md">
      {/* Gráfico decorativo de onda */}
      <div className="absolute right-0 top-0 bottom-0 w-1/4 opacity-15 pointer-events-none flex items-center justify-end pr-4">
        <svg width="200" height="60" viewBox="0 0 240 80" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M0 40 L60 40 L75 10 L95 70 L115 25 L130 55 L145 40 L240 40" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-teal-100 text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-200" />
            <span>Prevención Comunitaria y Saneamiento Ambiental • MINSAL El Salvador</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
            Educación Sanitaria y Control de Vectores
          </h1>

          <div className="flex items-center gap-1.5 text-[11px] font-medium text-teal-100/90">
            <Calendar className="w-3.5 h-3.5 text-teal-200" />
            <span>Jornada Territorial Comunitaria • 2026</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onActualizar}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold transition active:scale-95 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>

          <button
            type="button"
            onClick={onNuevaEducacion}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-teal-50 text-[#166E7A] text-xs font-black shadow-xs transition active:scale-95 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+ Actividad Educativa</span>
          </button>

          <button
            type="button"
            onClick={onNuevoVector}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#20B2AA] hover:bg-[#1CA099] text-white text-xs font-black shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Bug className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+ Control de Vectores</span>
          </button>
        </div>
      </div>
    </div>
  );
};