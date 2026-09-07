// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/citas/agendar/components/AgendarCitaHeader.tsx
// DESCRIPCIÓN: Cabecera institucional original de MedicOS con paleta #2B7A78,
//              onda médica SVG, badge de portal y tarjeta de Atención Garantizada.
// =========================================================================

import React from 'react';
import { CalendarCheck, ShieldCheck } from 'lucide-react';

export const AgendarCitaHeader: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#2B7A78] via-[#236866] to-[#1B5250] p-5 sm:p-6 text-white shadow-sm border border-teal-700/50">
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
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1.5">
          {/* Badge Contextual */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100 shadow-2xs">
            <CalendarCheck className="w-3.5 h-3.5 text-teal-200" />
            <span>Gestión de Citas &bull; Portal del Paciente</span>
          </div>

          {/* Título Principal */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            Agendar Cita Médica
          </h1>

          {/* Descripción */}
          <p className="text-xs sm:text-sm text-teal-100/90 font-medium max-w-xl">
            Selecciona a tu profesional de salud y elige un horario disponible sin filas.
          </p>
        </div>

        {/* Badge / Indicador de Garantía */}
        <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-white text-[#1B5250] text-xs sm:text-sm font-bold rounded-xl shadow-sm shrink-0">
          <ShieldCheck className="w-4 h-4 text-[#2B7A78] shrink-0" />
          <span>Atención Garantizada</span>
        </div>
      </div>
    </div>
  );
};

export default AgendarCitaHeader;