// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/actividad/components/ActividadHeader.tsx
// DESCRIPCIÓN: Cabecera con banner institucional degradado Teal y onda médica.
// =========================================================================

import React from 'react';
import { ShieldCheck, RefreshCw, Calendar, MapPin, Plus, Activity } from 'lucide-react';

interface ActividadHeaderProps {
  nombreJornada?: string;
  territorio?: string;
  fecha?: string;
  jornadaActiva?: boolean;
  onNuevaActividad: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const ActividadHeader: React.FC<ActividadHeaderProps> = ({
  nombreJornada = 'Brigada Médica Territorial',
  territorio = 'San Miguel Tepezontes, La Paz',
  fecha,
  jornadaActiva = true,
  onNuevaActividad,
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
              <Activity className="w-3.5 h-3.5 text-teal-200" />
              <span>Bitácora Operativa &bull; Rol: BRIGADISTA</span>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                jornadaActiva
                  ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-400/30'
                  : 'bg-white/10 text-white/70 border border-white/20'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  jornadaActiva ? 'bg-emerald-400 animate-pulse' : 'bg-slate-300'
                }`}
              />
              {jornadaActiva ? 'Jornada en Curso' : 'Sin Turno'}
            </span>
          </div>

          {/* Título de la Sección */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Actividad Operativa de Campo
          </h1>

          {/* Ubicación y Fecha */}
          <div className="flex items-center gap-3 text-xs sm:text-sm text-teal-100/90 font-medium flex-wrap">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-200 shrink-0" />
              <span>{nombreJornada}</span>
            </div>
            <span className="text-teal-200/40">&bull;</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-teal-200 shrink-0" />
              <span>{territorio}</span>
            </div>
            <span className="text-teal-200/40">&bull;</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-teal-200 shrink-0" />
              <span>{fechaHoy}</span>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Actualizar datos locales"
            className="inline-flex items-center gap-2 p-2.5 sm:px-4 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-bold rounded-xl backdrop-blur-md transition-all duration-200 active:scale-95 disabled:opacity-70 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-teal-200 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>

          <button
            onClick={onNuevaActividad}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-teal-50 text-[#1B5250] text-xs sm:text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Registrar Actividad</span>
          </button>
        </div>
      </div>
    </div>
  );
};