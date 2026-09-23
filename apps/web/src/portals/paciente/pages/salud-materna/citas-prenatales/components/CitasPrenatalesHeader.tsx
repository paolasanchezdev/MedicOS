// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/citas-prenatales/components/CitasPrenatalesHeader.tsx
// DESCRIPCIÓN: Cabecera institucional oficial de Citas Prenatales con degradado
//              verde institucional, estética Salud Materna y acciones integradas.
// =========================================================================

import React from 'react';
import { CalendarClock, CalendarPlus, RefreshCw, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CitasPrenatalesHeaderProps {
  patientName?: string;
  onRefresh: () => void;
  isLoading?: boolean;
  hasActivePregnancy?: boolean;
}

export const CitasPrenatalesHeader: React.FC<CitasPrenatalesHeaderProps> = ({
  patientName = 'Paciente',
  onRefresh,
  isLoading = false,
  hasActivePregnancy = true,
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#2B7A78] via-[#236866] to-[#1B5250] p-6 text-white shadow-sm border border-teal-700/50 select-none">
      {/* Resplandor ambiental decorativo */}
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Bloque Informativo */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-200" />
              <span>Salud Materna • Agenda Obstétrica</span>
            </div>

            {hasActivePregnancy && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 backdrop-blur-md border border-emerald-300/30 text-xs font-bold text-emerald-100 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                <span>Embarazo en seguimiento</span>
              </div>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <CalendarClock className="w-6 h-6 sm:w-7 sm:h-7 text-teal-200" />
            <span>Citas Prenatales</span>
          </h1>

          <p className="text-xs sm:text-sm text-teal-100/90 font-medium max-w-xl">
            {hasActivePregnancy
              ? `Agenda de controles, hitos gestacionales y visitas médicas para ${patientName}.`
              : 'Consulta las fechas programadas y requisitos de cada control obstétrico.'}
          </p>
        </div>

        {/* Botonera de Acciones en la Cabecera */}
        <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 disabled:bg-white/5 border border-white/20 rounded-2xl text-xs font-bold text-white transition cursor-pointer shadow-2xs"
            title="Actualizar agenda prenatal"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-teal-200 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/paciente/citas/agendar')}
            className="inline-flex items-center gap-2 px-4.5 py-2.5 bg-white hover:bg-teal-50 text-[#1B5250] text-xs font-black rounded-2xl shadow-xs transition active:scale-95 cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4 text-[#1B5250]" />
            <span>Agendar Cita</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitasPrenatalesHeader;