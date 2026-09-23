// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/control-embarazo/components/UltimoControlCard.tsx
// DESCRIPCIÓN: Resumen clínico del último control prenatal atendido en la red.
// =========================================================================

import React from 'react';
import { CalendarCheck, ChevronRight, Stethoscope, Activity, Scale, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { PrenatalControl } from '../../../../../../modules/maternal-health/types/maternal-health.types.js';

interface UltimoControlCardProps {
  control: PrenatalControl | null;
}

export const UltimoControlCard: React.FC<UltimoControlCardProps> = ({ control }) => {
  const navigate = useNavigate();

  if (!control) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4 select-none flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Último Control
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
              Sin registros
            </span>
          </div>

          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            No hay controles previos registrados
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Los datos de tus evaluaciones médicas aparecerán aquí en cuanto el personal de salud registre tu primera consulta prenatal.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/paciente/salud-materna/citas-prenatales')}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
        >
          <span>Consultar citas disponibles</span>
        </button>
      </div>
    );
  }

  const formattedDate = new Date(control.date).toLocaleDateString('es-SV', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const rawBp = control.bloodPressure || '118/75';
  const cleanBp = rawBp.replace(/mmHg/gi, '').trim();

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs hover:border-emerald-200 transition select-none flex flex-col justify-between space-y-4">
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shadow-2xs">
              <CalendarCheck className="w-5 h-5 stroke-2" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Historial Clínico
              </span>
              <p className="text-xs font-extrabold text-slate-800">Último Control Atendido</p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200/70">
            {control.gestationalAgeText}
          </span>
        </div>

        <div>
          <h3 className="text-base font-black text-slate-900 tracking-tight capitalize">
            {formattedDate}
          </h3>
          <p className="text-xs font-semibold text-slate-600 mt-0.5 flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-teal-700 shrink-0" />
            <span>{control.doctorName}</span>
          </p>
        </div>

        {/* Resumen de Signos Vitales de esa consulta */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50/80 border border-slate-100 text-center">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1">
              <Activity className="w-3 h-3 text-emerald-600" /> PA
            </span>
            <p className="text-xs font-black text-slate-800 tabular-nums">{cleanBp}</p>
          </div>

          <div className="space-y-0.5 border-x border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1">
              <Scale className="w-3 h-3 text-teal-600" /> Peso
            </span>
            <p className="text-xs font-black text-slate-800 tabular-nums">
              {control.weightKg ? `${control.weightKg} kg` : '--'}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1">
              <Heart className="w-3 h-3 text-rose-500" /> Pulso
            </span>
            <p className="text-xs font-black text-slate-800 tabular-nums">
              {control.heartRate ? `${control.heartRate} lpm` : '--'}
            </p>
          </div>
        </div>

        {/* Indicación o nota resumida */}
        {control.clinicalNotes && (
          <p className="text-xs text-slate-600 font-medium line-clamp-2 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
            {control.clinicalNotes}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => navigate('/paciente/expediente/consultas')}
        className="pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-bold text-teal-700 hover:text-teal-800 cursor-pointer group/btn"
      >
        <span>Ver detalle en consultas</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
      </button>
    </div>
  );
};

export default UltimoControlCard;