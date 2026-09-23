// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/educacion-ia/articulos/components/ArticulosHeader.tsx
// DESCRIPCIÓN: Cabecera institucional de la Biblioteca de Salud en verde #2B7A78.
// =========================================================================

import React from 'react';
import { BookOpen, BookmarkCheck, ShieldCheck } from 'lucide-react';

interface ArticulosHeaderProps {
  savedCount: number;
  onToggleSavedView: () => void;
  showingSavedOnly: boolean;
}

export const ArticulosHeader: React.FC<ArticulosHeaderProps> = ({
  savedCount,
  onToggleSavedView,
  showingSavedOnly,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#2B7A78] via-[#236866] to-[#1B5250] p-6 text-white shadow-sm border border-teal-700/50 select-none">
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-200" />
            <span>Biblioteca Validada • Referencia MINSAL / OMS 2026</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-teal-200" />
            <span>Artículos Educativos de Salud</span>
          </h1>

          <p className="text-xs sm:text-sm text-teal-100/90 font-medium max-w-xl">
            Aprende a cuidar tu salud y la de tu familia con información técnica simplificada, herramientas prácticas y fuentes oficiales.
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleSavedView}
          className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-2xs border ${
            showingSavedOnly
              ? 'bg-white text-teal-900 border-white shadow-md'
              : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
          }`}
        >
          <BookmarkCheck className={`w-4 h-4 ${showingSavedOnly ? 'text-teal-700' : 'text-teal-200'}`} />
          <span>{showingSavedOnly ? 'Ver catálogo completo' : `Mis guardados (${savedCount})`}</span>
        </button>
      </div>
    </div>
  );
};

export default ArticulosHeader;