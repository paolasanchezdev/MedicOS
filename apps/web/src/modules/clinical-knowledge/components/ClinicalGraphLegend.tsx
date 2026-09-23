// =========================================================================
// ARCHIVO: apps/web/src/modules/clinical-knowledge/components/ClinicalGraphLegend.tsx
// DESCRIPCIÓN: Leyenda cromática institucional clara (Portal Paciente).
// =========================================================================

import React from 'react';
import type { ClinicalNodeType } from '../types/clinical-graph.types.js';

interface LegendItem {
  type: ClinicalNodeType;
  label: string;
  colorBg: string;
  colorBorder: string;
}

const LEGEND_ITEMS: LegendItem[] = [
  { type: 'PATIENT', label: 'Paciente (Núcleo)', colorBg: 'bg-[#1c5752]', colorBorder: 'border-teal-700' },
  { type: 'CONSULTATION', label: 'Consulta Médica', colorBg: 'bg-[#115e59]', colorBorder: 'border-teal-600' },
  { type: 'PRENATAL_CONTROL', label: 'Control Prenatal', colorBg: 'bg-pink-600', colorBorder: 'border-pink-400' },
  { type: 'VACCINATION', label: 'Inmunización / Vacuna', colorBg: 'bg-emerald-600', colorBorder: 'border-emerald-400' },
  { type: 'DIAGNOSIS', label: 'Diagnóstico CIE', colorBg: 'bg-amber-600', colorBorder: 'border-amber-400' },
  { type: 'ALLERGY', label: 'Alergia Crítica', colorBg: 'bg-rose-600', colorBorder: 'border-rose-400' },
  { type: 'VITAL_SIGN', label: 'Signos Vitales', colorBg: 'bg-indigo-600', colorBorder: 'border-indigo-400' },
  { type: 'LIFESTYLE_HABIT', label: 'Hábito de Vida', colorBg: 'bg-yellow-600', colorBorder: 'border-yellow-400' },
];

export const ClinicalGraphLegend: React.FC = () => {
  return (
    <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-3 backdrop-blur-md text-slate-800 select-none shadow-sm">
      <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 block mb-2">
        Tipología de Registros Clínicos
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px]">
        {LEGEND_ITEMS.map((item) => (
          <div key={item.type} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${item.colorBg} border ${item.colorBorder} shrink-0`}></span>
            <span className="text-slate-700 font-bold truncate">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClinicalGraphLegend;