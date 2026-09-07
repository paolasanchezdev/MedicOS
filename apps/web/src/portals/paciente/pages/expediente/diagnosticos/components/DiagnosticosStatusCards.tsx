// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/expediente/diagnosticos/components/DiagnosticosStatusCards.tsx
// DESCRIPCIÓN: 4 tarjetas superiores compactas basadas en el estado clínico
//              de los diagnósticos (Total, Actuales, Antecedentes, Resueltos).
// =========================================================================

import React from 'react';
import { ClipboardList, Activity, Clock, CheckCircle2 } from 'lucide-react';
import type { Diagnosis, DiagnosisFilterStatus } from '../../../../../../modules/diagnoses/index.js';

interface DiagnosticosStatusCardsProps {
  diagnoses: Diagnosis[];
  selectedStatus: DiagnosisFilterStatus;
  onSelectStatus: (status: DiagnosisFilterStatus) => void;
}

export const DiagnosticosStatusCards: React.FC<DiagnosticosStatusCardsProps> = ({
  diagnoses,
  selectedStatus,
  onSelectStatus,
}) => {
  const total = diagnoses.length;
  const activeCount = diagnoses.filter((d) => d.status === 'ACTIVE').length;
  const historicalCount = diagnoses.filter((d) => d.status === 'HISTORICAL').length;
  const resolvedCount = diagnoses.filter((d) => d.status === 'RESOLVED').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* Tarjeta 1: Total Diagnósticos */}
      <div
        onClick={() => onSelectStatus('ALL')}
        className={`group bg-white rounded-2xl border p-4 shadow-xs transition-all cursor-pointer flex flex-col justify-between select-none ${
          selectedStatus === 'ALL'
            ? 'border-[#2B7A78] ring-1 ring-[#2B7A78]/30 shadow-sm'
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78] shadow-2xs">
            <ClipboardList className="w-4 h-4" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-[#2B7A78] border border-teal-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2B7A78]" />
            Historial Clínico
          </span>
        </div>
        <div className="mt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Diagnósticos</p>
          <p className="text-2xl font-black text-slate-900 tracking-tight mt-0.5 leading-none">{total}</p>
        </div>
      </div>

      {/* Tarjeta 2: Actuales / Activos */}
      <div
        onClick={() => onSelectStatus('ACTIVE')}
        className={`group bg-white rounded-2xl border p-4 shadow-xs transition-all cursor-pointer flex flex-col justify-between select-none ${
          selectedStatus === 'ACTIVE'
            ? 'border-emerald-500 ring-1 ring-emerald-500/30 shadow-sm'
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs">
            <Activity className="w-4 h-4" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            En curso
          </span>
        </div>
        <div className="mt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Condición Activa</p>
          <p className="text-2xl font-black text-slate-900 tracking-tight mt-0.5 leading-none">{activeCount}</p>
        </div>
      </div>

      {/* Tarjeta 3: Antecedentes / Históricos */}
      <div
        onClick={() => onSelectStatus('HISTORICAL')}
        className={`group bg-white rounded-2xl border p-4 shadow-xs transition-all cursor-pointer flex flex-col justify-between select-none ${
          selectedStatus === 'HISTORICAL'
            ? 'border-purple-500 ring-1 ring-purple-500/30 shadow-sm'
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-2xs">
            <Clock className="w-4 h-4" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            Previos
          </span>
        </div>
        <div className="mt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Antecedentes</p>
          <p className="text-2xl font-black text-slate-900 tracking-tight mt-0.5 leading-none">{historicalCount}</p>
        </div>
      </div>

      {/* Tarjeta 4: Resueltos */}
      <div
        onClick={() => onSelectStatus('RESOLVED')}
        className={`group bg-white rounded-2xl border p-4 shadow-xs transition-all cursor-pointer flex flex-col justify-between select-none ${
          selectedStatus === 'RESOLVED'
            ? 'border-sky-500 ring-1 ring-sky-500/30 shadow-sm'
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shadow-2xs">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            Alta Médica
          </span>
        </div>
        <div className="mt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Resueltos</p>
          <p className="text-2xl font-black text-slate-900 tracking-tight mt-0.5 leading-none">{resolvedCount}</p>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticosStatusCards;