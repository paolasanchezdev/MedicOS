// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/pacientes/components/PacientesBrigadaHeader.tsx
// DESCRIPCIÓN: Cabecera contextual e institucional del padrón de pacientes.
// =========================================================================

import React from 'react';
import { Users, RefreshCw, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PacientesBrigadaHeaderProps {
  nombreBrigada?: string;
  comunidad?: string;
  fecha?: string;
  enCurso?: boolean;
  totalPacientes?: number;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const PacientesBrigadaHeader: React.FC<PacientesBrigadaHeaderProps> = ({
  nombreBrigada = 'Brigada Médica Territorial',
  comunidad = 'San Miguel Tepezontes, La Paz',
  fecha = 'Jueves, 27 de agosto de 2026',
  enCurso = true,
  totalPacientes = 0,
  onRefresh,
  isRefreshing = false,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Botón de retorno a Resumen de Brigada */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/brigadista/brigada/resumen')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#2B7A78] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Resumen de Brigada</span>
        </button>
      </div>

      {/* Banner Institucional Oficial */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#2B7A78] via-[#236866] to-[#1B5250] p-6 sm:p-7 text-white shadow-sm border border-teal-700/50">
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
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-100 shadow-2xs">
                <Users className="w-3.5 h-3.5 text-teal-200" />
                <span>Padrón de Pacientes &bull; {totalPacientes} vinculados</span>
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
                {enCurso ? 'Jornada en Curso' : 'Finalizada'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Pacientes de la Brigada
            </h1>

            <div className="flex items-center gap-3 text-xs sm:text-sm text-teal-100/90 font-medium flex-wrap">
              <span className="font-bold text-white">{nombreBrigada}</span>
              <span className="text-teal-200/40">&bull;</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-200 shrink-0" />
                <span>{comunidad}</span>
              </div>
              <span className="text-teal-200/40">&bull;</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-200 shrink-0" />
                <span>{fecha}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-teal-50 text-[#1B5250] text-xs sm:text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-[#2B7A78] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Actualizando...' : 'Actualizar padrón'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};