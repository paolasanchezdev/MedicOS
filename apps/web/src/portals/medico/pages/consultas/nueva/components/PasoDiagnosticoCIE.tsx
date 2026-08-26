// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/consultas/nueva/components/PasoDiagnosticoCIE.tsx
// DESCRIPCIÓN: Paso 2 - Impresión diagnóstica estructurada con catálogo CIE-10.
// =========================================================================

import React from 'react';
import { Activity } from 'lucide-react';
import type { ClinicalFormState } from './FormularioConsultaClinica';

interface PasoDiagnosticoCIEProps {
  data: ClinicalFormState;
  onChange: (field: keyof ClinicalFormState, value: string) => void;
  disabled: boolean;
}

const COMMON_DIAGNOSES = [
  { code: 'J00', label: 'Rinofaringitis aguda (Resfriado común)' },
  { code: 'J02.9', label: 'Faringitis aguda no especificada' },
  { code: 'K29.7', label: 'Gastritis no especificada' },
  { code: 'K52.9', label: 'Gastroenteritis aguda no infecciosa' },
  { code: 'I10', label: 'Hipertensión esencial (primaria)' },
  { code: 'E11.9', label: 'Diabetes mellitus tipo 2 sin complicaciones' },
  { code: 'M54.5', label: 'Lumbago no especificado / Dolor lumbar' },
  { code: 'R51', label: 'Cefalea / Dolor de cabeza tensional' },
];

export const PasoDiagnosticoCIE: React.FC<PasoDiagnosticoCIEProps> = ({
  data,
  onChange,
  disabled,
}) => {
  return (
    <div className="space-y-5 animate-in fade-in zoom-in-98 duration-150">
      <div className="border-b border-slate-100 pb-2.5">
        <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Activity size={15} className="text-[#0e7490]" />
          Impresión Diagnóstica (CIE-10 / ICD-10) <span className="text-rose-600">*</span>
        </label>
        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
          Selecciona una patología común o introduce manualmente el código y la descripción.
        </p>
      </div>

      {/* Catálogo Rápido */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase text-slate-400">Diagnósticos Comunes:</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {COMMON_DIAGNOSES.map((d) => {
            const isSelected = data.diagnosisCode === d.code;
            return (
              <button
                key={d.code}
                type="button"
                disabled={disabled}
                onClick={() => {
                  onChange('diagnosisCode', d.code);
                  onChange('diagnosisDesc', d.label);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-teal-50 border-[#0e7490] text-[#0e7490] font-bold shadow-2xs'
                    : 'bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-xs truncate">{d.label}</span>
                <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold text-slate-600 shrink-0">
                  {d.code}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Formulario Manual */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
        <div className="sm:col-span-3 space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase block">Código CIE-10</label>
          <input
            type="text"
            disabled={disabled}
            placeholder="J00"
            value={data.diagnosisCode}
            onChange={(e) => onChange('diagnosisCode', e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:border-teal-600 uppercase"
          />
        </div>

        <div className="sm:col-span-9 space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase block">
            Descripción del Diagnóstico <span className="text-rose-600">*</span>
          </label>
          <input
            type="text"
            required
            disabled={disabled}
            placeholder="Rinofaringitis aguda (Resfriado común)"
            value={data.diagnosisDesc}
            onChange={(e) => onChange('diagnosisDesc', e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:border-teal-600"
          />
        </div>
      </div>
    </div>
  );
};