// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/consultas/nueva/components/PasoPlanCierre.tsx
// DESCRIPCIÓN: Paso 4 - Cuidados no farmacológicos, signos de alarma, fecha de control y resumen.
// =========================================================================

import React from 'react';
import { ClipboardCheck, AlertTriangle, CalendarPlus, CheckCircle2 } from 'lucide-react';
import type { ClinicalFormState } from './FormularioConsultaClinica';
import type { PrescripcionItem } from './PrescripcionMedicamentos';

export interface PasoPlanCierreProps {
  data: ClinicalFormState;
  prescriptionItems: PrescripcionItem[];
  onChange: (field: keyof ClinicalFormState, value: string) => void;
  disabled: boolean;
}

export const PasoPlanCierre: React.FC<PasoPlanCierreProps> = ({
  data,
  prescriptionItems,
  onChange,
  disabled,
}) => {
  return (
    <div className="space-y-5 animate-in fade-in zoom-in-98 duration-150">
      <div className="border-b border-slate-100 pb-2.5">
        <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <ClipboardCheck size={15} className="text-[#0e7490]" />
          Plan de Manejo Terapéutico y Cierre de Consulta
        </label>
        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
          Define las pautas de autocuidado, advertencias críticas y cita de control.
        </p>
      </div>

      {/* Resumen Compacto de la Consulta */}
      <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-500 uppercase text-[10px]">Diagnóstico Asignado:</span>
          <span className="font-extrabold text-slate-900">
            {data.diagnosisDesc || 'Sin diagnóstico asignado'} {data.diagnosisCode ? `(${data.diagnosisCode})` : ''}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
          <span className="font-bold text-slate-500 uppercase text-[10px]">Medicamentos Prescritos:</span>
          <span className="font-bold text-teal-800">
            {prescriptionItems.length > 0
              ? `${prescriptionItems.length} fármaco(s) en receta`
              : 'Sin medicamentos (Manejo sintomático)'}
          </span>
        </div>
      </div>

      {/* Indicaciones y Signos de Alarma */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-600 uppercase block">
            Cuidados No Farmacológicos
          </label>
          <textarea
            rows={3}
            disabled={disabled}
            placeholder="Ej. Reposo relativo, hidratación abundante, dieta fraccionada..."
            value={data.nonPharmPlan}
            onChange={(e) => onChange('nonPharmPlan', e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-teal-600"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-600 uppercase flex items-center gap-1">
            <AlertTriangle size={12} className="text-amber-600" />
            Signos de Alarma
          </label>
          <textarea
            rows={3}
            disabled={disabled}
            placeholder="Ej. Consultar de inmediato ante fiebre > 38.5°C persistente o dificultad para respirar..."
            value={data.warningSigns}
            onChange={(e) => onChange('warningSigns', e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-teal-600"
          />
        </div>
      </div>

      {/* Fecha de Próximo Control */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase">
          <CalendarPlus size={14} className="text-[#0e7490]" />
          Cita de Control / Seguimiento (Opcional):
        </label>
        <input
          type="date"
          disabled={disabled}
          value={data.followUpDate}
          onChange={(e) => onChange('followUpDate', e.target.value)}
          className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-teal-600 w-full sm:max-w-xs"
        />
      </div>

      <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-xl flex items-center gap-2 text-teal-900 text-xs font-medium">
        <CheckCircle2 size={16} className="text-[#0e7490] shrink-0" />
        <span>Al guardar, el turno finalizará y la receta estará disponible en la farmacia de la brigada y en el portal del paciente.</span>
      </div>
    </div>
  );
};

export default PasoPlanCierre;