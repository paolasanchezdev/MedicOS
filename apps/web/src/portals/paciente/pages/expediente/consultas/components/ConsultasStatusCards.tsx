// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/expediente/consultas/components/ConsultasStatusCards.tsx
// DESCRIPCIÓN: 4 tarjetas superiores de estatus alineadas con los estados válidos de Prisma.
// =========================================================================

import React from 'react';
import { ClipboardList, CheckCircle2, Clock, Activity } from 'lucide-react';
import type { Consultation } from '../../../../../../modules/consultations/index.js';

interface ConsultasStatusCardsProps {
  consultations: Consultation[];
  selectedStatusFilter: string;
  onSelectStatusFilter: (status: string) => void;
}

export const ConsultasStatusCards: React.FC<ConsultasStatusCardsProps> = ({
  consultations,
  selectedStatusFilter,
  onSelectStatusFilter,
}) => {
  const total = consultations.length;
  const completed = consultations.filter((c) => c.status === 'COMPLETED').length;
  const inProgress = consultations.filter((c) => c.status === 'IN_PROGRESS').length;
  const cancelled = consultations.filter((c) => c.status === 'CANCELLED').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* Tarjeta 1: Total Consultas */}
      <div
        onClick={() => onSelectStatusFilter('ALL')}
        className={`group bg-white rounded-2xl border p-4 shadow-xs transition-all cursor-pointer flex flex-col justify-between ${
          selectedStatusFilter === 'ALL' ? 'border-[#2B7A78] ring-1 ring-[#2B7A78]/30' : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78] shadow-2xs">
            <ClipboardList className="w-4 h-4" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-[#2B7A78] border border-teal-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2B7A78]" />
            Historial General
          </span>
        </div>
        <div className="mt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Atenciones</p>
          <p className="text-2xl font-black text-slate-900 tracking-tight mt-0.5 leading-none">{total}</p>
        </div>
      </div>

      {/* Tarjeta 2: Completadas */}
      <div
        onClick={() => onSelectStatusFilter('COMPLETED')}
        className={`group bg-white rounded-2xl border p-4 shadow-xs transition-all cursor-pointer flex flex-col justify-between ${
          selectedStatusFilter === 'COMPLETED' ? 'border-emerald-500 ring-1 ring-emerald-500/30' : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Completadas
          </span>
        </div>
        <div className="mt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Atendidas</p>
          <p className="text-2xl font-black text-slate-900 tracking-tight mt-0.5 leading-none">{completed}</p>
        </div>
      </div>

      {/* Tarjeta 3: En Curso */}
      <div
        onClick={() => onSelectStatusFilter('IN_PROGRESS')}
        className={`group bg-white rounded-2xl border p-4 shadow-xs transition-all cursor-pointer flex flex-col justify-between ${
          selectedStatusFilter === 'IN_PROGRESS' ? 'border-sky-500 ring-1 ring-sky-500/30' : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shadow-2xs">
            <Activity className="w-4 h-4" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
            En curso
          </span>
        </div>
        <div className="mt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Atención Activa</p>
          <p className="text-2xl font-black text-slate-900 tracking-tight mt-0.5 leading-none">{inProgress}</p>
        </div>
      </div>

      {/* Tarjeta 4: Canceladas */}
      <div
        onClick={() => onSelectStatusFilter('CANCELLED')}
        className={`group bg-white rounded-2xl border p-4 shadow-xs transition-all cursor-pointer flex flex-col justify-between ${
          selectedStatusFilter === 'CANCELLED' ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-2xs">
            <Clock className="w-4 h-4" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Canceladas
          </span>
        </div>
        <div className="mt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Incompletas</p>
          <p className="text-2xl font-black text-slate-900 tracking-tight mt-0.5 leading-none">{cancelled}</p>
        </div>
      </div>
    </div>
  );
};

export default ConsultasStatusCards;