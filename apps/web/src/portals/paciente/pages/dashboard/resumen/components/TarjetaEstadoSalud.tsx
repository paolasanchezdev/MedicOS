// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/dashboard/resumen/components/TarjetaEstadoSalud.tsx
// DESCRIPCIÓN: Tarjeta de estado de salud y controles con diseño unificado MedicOS.
// =========================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle, ChevronRight, Activity } from 'lucide-react';

export interface EstadoSaludInfo {
  alDia: boolean;
  controlesPendientes?: number;
  mensajeEvaluacion?: string;
}

interface Props {
  estado?: EstadoSaludInfo | null;
}

export const TarjetaEstadoSalud: React.FC<Props> = ({ estado }) => {
  const alDia = estado?.alDia ?? true;
  const controlesPendientes = estado?.controlesPendientes ?? 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between h-full">
      <div>
        {/* Cabecera */}
        <div className="flex items-center justify-between">
          <div
            className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-xs ${
              alDia
                ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                : 'bg-amber-50 border-amber-100 text-amber-600'
            }`}
          >
            {alDia ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              alDia
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                : 'bg-amber-50 text-amber-700 border-amber-200/60'
            }`}
          >
            {alDia && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
            {alDia ? 'Al día' : 'Evaluación pendiente'}
          </span>
        </div>

        {/* Título / Estado */}
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Estado de Salud
          </p>
          <p className="text-base font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-1.5">
            {alDia ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span>{alDia ? 'Seguimiento Médico Normal' : 'Atención Recomendada'}</span>
          </p>
          <p className="text-xs text-slate-500 font-normal leading-relaxed mt-1">
            {estado?.mensajeEvaluacion ||
              (alDia
                ? 'Tus registros médicos no indican alertas clínicas o revisiones prioritarias pendientes.'
                : 'Se sugiere agendar un control de rutina para actualizar mediciones clínicas.')}
          </p>
        </div>

        {/* Desglose de Datos */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
            <span className="font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Revisiones programadas</span>
            </span>
            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
              {controlesPendientes} {controlesPendientes === 1 ? 'pendiente' : 'pendientes'}
            </span>
          </div>

          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
            <span className="font-medium flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-slate-400" />
              <span>Vigilancia epidemiológica</span>
            </span>
            <span className="font-semibold text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-200/60">
              Verificado
            </span>
          </div>
        </div>
      </div>

      {/* Acción inferior */}
      <Link
        to="/paciente/monitoreo/signos-vitales"
        className="mt-5 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-[#2a726d] hover:text-[#23605c] transition-colors group/btn"
      >
        <span>Monitoreo y signos vitales</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
      </Link>
    </div>
  );
};

export default TarjetaEstadoSalud;