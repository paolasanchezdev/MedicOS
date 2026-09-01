// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/resumen/components/ResumenBrigadaHeader.tsx
// DESCRIPCIÓN: Cabecera institucional de la brigada con diseño oficial Admin y enfoque territorial.
// =========================================================================

import React from 'react';
import { ShieldCheck, RefreshCw, Calendar, MapPin } from 'lucide-react';

interface ResumenBrigadaHeaderProps {
  nombreBrigada?: string;
  comunidad?: string;
  fecha?: string;
  enCurso?: boolean;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const ResumenBrigadaHeader: React.FC<ResumenBrigadaHeaderProps> = ({
  nombreBrigada = 'Brigada Comunitaria #12',
  comunidad = 'Comunidad El Centro, San Miguel Tepezontes',
  fecha,
  enCurso = true,
  onRefresh,
  isRefreshing = false,
}) => {
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
      {/* Resplandor y patrón decorativo de fondo tipo onda médica */}
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

      {/* Contenido Principal */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          {/* Badges de Contexto y Estado */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-200" />
              <span>Resumen de Brigada &bull; Control Territorial</span>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                enCurso
                  ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-400/30'
                  : 'bg-white/10 text-white/70 border border-white/20'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  enCurso ? 'bg-emerald-400 animate-pulse' : 'bg-slate-300'
                }`}
              />
              {enCurso ? 'En Curso' : 'Finalizada'}
            </span>
          </div>

          {/* Título de la Brigada */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {nombreBrigada}
          </h1>

          {/* Ubicación y Fecha */}
          <div className="flex items-center gap-3 text-xs sm:text-sm text-teal-100/90 font-medium flex-wrap">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-teal-200 shrink-0" />
              <span>{comunidad}</span>
            </div>
            <span className="text-teal-200/40">&bull;</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-teal-200 shrink-0" />
              <span>{fechaHoy}</span>
            </div>
          </div>
        </div>

        {/* Botón de Actualizar */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-teal-50 text-[#1B5250] text-xs sm:text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shrink-0 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 text-[#2B7A78] ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Actualizando...' : 'Actualizar métricas'}</span>
        </button>
      </div>
    </div>
  );
};