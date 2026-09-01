// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/expediente/components/ExpedientePacienteHeader.tsx
// DESCRIPCIÓN: Banner institucional de bienvenida y navegación contextual del expediente.
// =========================================================================

import React from 'react';
import { FolderHeart, ArrowLeft, Search, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExpedientePacienteHeaderProps {
  hasActivePatient: boolean;
  onClearPatient?: () => void;
}

export const ExpedientePacienteHeader: React.FC<ExpedientePacienteHeaderProps> = ({
  hasActivePatient,
  onClearPatient,
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
    <div className="space-y-4">
      {/* Botón superior de retroceso */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (hasActivePatient && onClearPatient) {
              onClearPatient();
            } else {
              navigate('/brigadista/pacientes/buscar');
            }
          }}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#1B5250] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>{hasActivePatient ? 'Cambiar de Paciente' : 'Volver a Búsqueda Nominal'}</span>
        </button>

        {hasActivePatient && (
          <button
            type="button"
            onClick={onClearPatient}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-teal-600" />
            <span>Nueva Búsqueda</span>
          </button>
        )}
      </div>

      {/* Banner Principal Idéntico a TarjetaBienvenidaAdmin */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#2B7A78] via-[#236866] to-[#1B5250] p-6 sm:p-7 text-white shadow-sm border border-teal-700/50">
        {/* Resplandor y patrón SVG de onda médica */}
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
            {/* Badge de Rol / Contexto */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100 shadow-2xs">
              <FolderHeart className="w-3.5 h-3.5 text-teal-200" />
              <span>Registro Clínico Territorial &bull; Consulta Nominal</span>
            </div>

            {/* Título */}
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Expediente del Paciente
            </h1>

            {/* Fecha */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-teal-100/90 font-medium">
              <Calendar className="w-4 h-4 text-teal-200 shrink-0" />
              <span>{fechaHoy}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};