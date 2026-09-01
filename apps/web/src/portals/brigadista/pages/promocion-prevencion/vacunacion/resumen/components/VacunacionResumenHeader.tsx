// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/vacunacion/resumen/components/VacunacionResumenHeader.tsx
// DESCRIPCIÓN: Banner institucional de vacunación con estética glassmorphism, onda ECG y botones de acción.
// =========================================================================

import React from 'react';
import { ShieldCheck, Calendar, Plus, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface VacunacionResumenHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const VacunacionResumenHeader: React.FC<VacunacionResumenHeaderProps> = ({
  onRefresh,
  isRefreshing,
}) => {
  const navigate = useNavigate();

  const fechaHoyRaw = new Date().toLocaleDateString('es-SV', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const fechaHoy = fechaHoyRaw.charAt(0).toUpperCase() + fechaHoyRaw.slice(1);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#2B7A78] via-[#236866] to-[#1B5250] p-6 sm:p-7 text-white shadow-sm border border-teal-700/50">
      {/* Resplandor y patrón decorativo de onda médica */}
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
          {/* Badge Oficial */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-200" />
            <span>Esquema Nacional de Vacunación &bull; MINSAL El Salvador</span>
          </div>

          {/* Título */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Control e Inmunización Territorial
          </h1>

          {/* Fecha */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-teal-100/90 font-medium">
            <Calendar className="w-4 h-4 text-teal-200 shrink-0" />
            <span>{fechaHoy}</span>
          </div>
        </div>

        {/* Acciones del Banner */}
        <div className="flex items-center gap-2.5 self-stretch sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold rounded-xl backdrop-blur-md transition-all duration-200 active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-teal-200 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Actualizando...' : 'Actualizar'}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/brigadista/promocion-prevencion/vacunacion/registro')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-teal-50 text-[#1B5250] text-xs sm:text-sm font-extrabold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#2B7A78]" />
            <span>Aplicar Vacuna</span>
          </button>
        </div>
      </div>
    </div>
  );
};