// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/resumen/components/EstadoActualBrigadaCard.tsx
// DESCRIPCIÓN: Panel de monitoreo institucional de la misión macro.
//              Muestra vigencia oficial, cobertura y estado del turno de hoy.
// =========================================================================

import React from 'react';
import { Siren, Calendar, UserCheck, MapPin } from 'lucide-react';

interface EstadoActualBrigadaCardProps {
  enCurso: boolean;
  evaluacionesRealizadas: number;
  totalPacientes: number;
  fechaInicio?: string;
  fechaFin?: string | null;
  responsable?: string;
  territorio?: string;
}

export const EstadoActualBrigadaCard: React.FC<EstadoActualBrigadaCardProps> = ({
  enCurso,
  evaluacionesRealizadas,
  totalPacientes,
  fechaInicio = '22/09/2026',
  fechaFin = '16/10/2026',
  responsable = 'Coordinación Médica',
  territorio = 'San Miguel Tepezontes, La Paz',
}) => {
  const porcentaje =
    totalPacientes > 0
      ? Math.min(100, Math.round((evaluacionesRealizadas / totalPacientes) * 100))
      : 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Cabecera Institucional */}
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78] shadow-2xs">
            <Siren className="w-5 h-5" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Misión Territorial Activa
          </span>
        </div>

        {/* Título de Sección */}
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            Marco Operativo Macro
          </p>
          <h2 className="text-base font-black text-slate-900 tracking-tight mt-0.5">
            Despliegue Institucional
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operativo comunitario programado para cobertura integral en el municipio.
          </p>
        </div>

        {/* Parámetros de la Campaña */}
        <div className="pt-2 space-y-2.5 text-xs">
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-slate-700">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500 font-medium">Periodo de Operación:</span>
            </div>
            <span className="font-mono font-bold text-slate-900">
              {fechaInicio} al {fechaFin || 'Indefinido'}
            </span>
          </div>

          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-slate-700">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500 font-medium">Responsable / Líder:</span>
            </div>
            <span className="font-bold text-slate-900">{responsable}</span>
          </div>

          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-slate-700">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500 font-medium">Ámbito Geográfico:</span>
            </div>
            <span className="font-semibold text-slate-800">{territorio}</span>
          </div>

          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-teal-50/60 border border-teal-100 text-slate-700">
            <span className="text-[#2B7A78] font-bold">Estado de Jornada Hoy:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                enCurso ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {enCurso ? 'Turno en ejecución' : 'Esperando apertura'}
            </span>
          </div>
        </div>
      </div>

      {/* Cobertura Acumulada sobre el Padrón */}
      <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">
            Cobertura de Atención ({evaluacionesRealizadas} de {totalPacientes} evaluados)
          </span>
          <span className="font-mono font-extrabold text-[#2B7A78]">{porcentaje}%</span>
        </div>

        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2B7A78] rounded-full transition-all duration-500"
            style={{ width: `${porcentaje}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default EstadoActualBrigadaCard;