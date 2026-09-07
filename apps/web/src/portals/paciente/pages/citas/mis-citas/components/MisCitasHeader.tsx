// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/citas/mis-citas/components/MisCitasHeader.tsx
// DESCRIPCIÓN: Cabecera institucional de Mis Citas con paleta MedicOS (#2B7A78),
//              onda médica vectorial y botón de acción principal de alto contraste.
// =========================================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, Wifi } from 'lucide-react';

interface MisCitasHeaderProps {
  isOffline?: boolean;
}

export const MisCitasHeader: React.FC<MisCitasHeaderProps> = ({ isOffline = false }) => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#2B7A78] via-[#236866] to-[#1B5250] p-5 sm:p-6 text-white shadow-sm border border-teal-700/50">
      {/* Resplandor y patrón decorativo de onda médica */}
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-36 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block">
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
            <Calendar className="w-3.5 h-3.5 text-teal-200" />
            <span>Agenda Personal &bull; Portal del Paciente</span>
          </div>

          {/* Título Principal */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            Mis Citas Médicas
          </h1>

          {/* Descripción */}
          <p className="text-xs sm:text-sm text-teal-100/90 font-medium max-w-xl">
            Consulta, reprograma o administra tus próximas consultas y el historial de atención.
          </p>
        </div>

        {/* Acciones del Encabezado */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          {isOffline && (
            <div className="flex items-center gap-1.5 px-3 py-2 bg-white/10 backdrop-blur-md border border-amber-300/40 rounded-xl text-amber-200 text-xs font-semibold shadow-2xs">
              <Wifi className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Modo Local</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => navigate('/paciente/citas/agendar')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-teal-50 text-[#1B5250] text-xs sm:text-sm font-bold rounded-xl shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#2B7A78] stroke-[2.5]" />
            <span>Agendar Cita</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MisCitasHeader;