// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/diario-sintomas/components/DiarioSintomasHeader.tsx
// DESCRIPCIÓN: Cabecera institucional con gradiente verde MedicOS y estado de autoseguimiento.
// =========================================================================

import React from 'react';
import { HeartPulse, BookHeart, RefreshCw, Sparkles } from 'lucide-react';

interface DiarioSintomasHeaderProps {
  lastUpdatedText?: string;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const DiarioSintomasHeader: React.FC<DiarioSintomasHeaderProps> = ({
  lastUpdatedText,
  onRefresh,
  isLoading = false,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#2B7A78] via-[#236866] to-[#1B5250] p-6 text-white shadow-sm border border-teal-700/50 select-none">
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100 shadow-2xs">
              <BookHeart className="w-3.5 h-3.5 text-teal-200" />
              <span>Salud Materna • Autoseguimiento</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 backdrop-blur-md border border-emerald-300/30 text-xs font-bold text-emerald-100 shadow-2xs">
              <Sparkles className="w-3 h-3 text-emerald-300" />
              <span>Bitácora Diaria</span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <HeartPulse className="w-6 h-6 sm:w-7 sm:h-7 text-teal-200" />
            <span>Diario de Síntomas</span>
          </h1>

          <p className="text-xs sm:text-sm text-teal-100/90 font-medium max-w-xl">
            Registra cómo te has sentido y los cambios que has notado durante tu embarazo para compartirlos con tu médico.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center shrink-0">
          {lastUpdatedText && (
            <span className="hidden sm:inline-block text-[11px] font-semibold text-teal-100/80 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              {lastUpdatedText}
            </span>
          )}

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 disabled:bg-white/5 border border-white/20 rounded-2xl text-xs font-bold text-white transition cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-teal-200 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiarioSintomasHeader;