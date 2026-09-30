// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/jornada/components/JornadaHeader.tsx
// DESCRIPCIÓN: Cabecera oficial de la Jornada Territorial del brigadista.
//              Diferencia con claridad la Jornada de Hoy respecto a la Brigada Macro.
// =========================================================================

import React from 'react';
import { ShieldCheck, RefreshCw, Calendar, MapPin, Siren, Clock } from 'lucide-react';

interface JornadaHeaderProps {
  nombreBrigada?: string;
  nombreJornada?: string;
  comunidad?: string;
  fecha?: string;
  estado?: 'PROGRAMADA' | 'EN_CURSO' | 'FINALIZADA';
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const JornadaHeader: React.FC<JornadaHeaderProps> = ({
  nombreBrigada,
  nombreJornada,
  comunidad = 'San Miguel Tepezontes, La Paz',
  fecha,
  estado = 'EN_CURSO',
  onRefresh,
  isRefreshing = false,
}) => {
  const misionNombre = nombreBrigada || nombreJornada || 'Brigada Médica Territorial';
  const fechaHoy =
    fecha ||
    (() => {
      const f = new Date().toLocaleDateString('es-SV', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return f.charAt(0).toUpperCase() + f.slice(1);
    })();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#2B7A78] via-[#236866] to-[#1B5250] p-6 sm:p-7 text-white shadow-sm border border-teal-700/50">
      {/* Resplandor y patrón decorativo */}
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block">
        <svg
          width="200"
          height="100"
          viewBox="0 0 200 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 50H50L62 15L78 85L92 35L102 60L112 50H190"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2.5">
          {/* Badges de Contexto Operativo */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-200" />
              <span>Despliegue Operativo &bull; Turno en Terreno</span>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                estado === 'EN_CURSO'
                  ? 'bg-emerald-500/25 text-emerald-100 border-emerald-400/40'
                  : estado === 'PROGRAMADA'
                  ? 'bg-amber-500/25 text-amber-100 border-amber-400/40'
                  : 'bg-white/15 text-white/80 border-white/20'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              {estado === 'EN_CURSO'
                ? 'Turno en Curso'
                : estado === 'PROGRAMADA'
                ? 'Turno Programado'
                : 'Turno Concluido'}
            </span>
          </div>

          {/* TÍTULO PRINCIPAL: Identifica explícitamente la pantalla de Jornada */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Jornada de Hoy
          </h1>

          {/* Contexto de la Misión, Ubicación y Fecha */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-xs sm:text-sm text-teal-100/90 font-medium flex-wrap">
            <div className="flex items-center gap-1.5 text-teal-100 font-semibold">
              <Siren className="w-4 h-4 text-teal-300 shrink-0" />
              <span>Misión: {misionNombre}</span>
            </div>

            <span className="text-teal-200/40 hidden sm:inline">&bull;</span>

            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-teal-200 shrink-0" />
              <span>{comunidad}</span>
            </div>

            <span className="text-teal-200/40 hidden sm:inline">&bull;</span>

            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-teal-200 shrink-0" />
              <span>{fechaHoy}</span>
            </div>
          </div>
        </div>

        {/* Botón de Actualizar */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-teal-50 text-[#1B5250] text-xs sm:text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shrink-0 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 text-[#2B7A78] ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Actualizando...' : 'Actualizar estado'}</span>
        </button>
      </div>
    </div>
  );
};

export default JornadaHeader;