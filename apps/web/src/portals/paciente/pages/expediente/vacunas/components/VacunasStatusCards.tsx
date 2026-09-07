// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/expediente/vacunas/components/VacunasStatusCards.tsx
// DESCRIPCIÓN: 4 tarjetas superiores compactas de estatus inmunológico
//              (Nivel de Protección, Dosis Aplicadas, Próxima Dosis, Cartilla).
// =========================================================================

import React from 'react';
import { ShieldCheck, CheckCircle2, Clock, Smartphone, ChevronRight } from 'lucide-react';
import type { VaccinationRecord } from '../../../../../../modules/vaccinations/index.js';

interface VacunasStatusCardsProps {
  records: VaccinationRecord[];
  targetDosesCount: number;
  nextVaccineLabel: string;
  nextVaccineDate: string;
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
  onOpenCartilla: () => void;
}

export const VacunasStatusCards: React.FC<VacunasStatusCardsProps> = ({
  records,
  targetDosesCount,
  nextVaccineLabel,
  nextVaccineDate,
  selectedFilter,
  onSelectFilter,
  onOpenCartilla,
}) => {
  const completedCount = records.filter((r) => r.status === 'COMPLETED').length;
  const coveragePercentage = targetDosesCount > 0
    ? Math.min(100, Math.round((completedCount / targetDosesCount) * 100))
    : 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* TARJETA 1: NIVEL DE PROTECCIÓN */}
      <div
        onClick={() => onSelectFilter('ALL')}
        className={`group bg-white rounded-2xl border p-4 shadow-xs transition-all cursor-pointer flex flex-col justify-between select-none ${
          selectedFilter === 'ALL'
            ? 'border-[#2B7A78] ring-1 ring-[#2B7A78]/30 shadow-sm'
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78] shadow-2xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-[#2B7A78] border border-teal-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2B7A78] animate-pulse" />
              Protección Activa
            </span>
          </div>

          <div className="mt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Esquema Registrado
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <p className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                {coveragePercentage}%
              </p>
              <span className="text-xs font-semibold text-slate-500">
                ({completedCount}/{targetDosesCount} dosis)
              </span>
            </div>
          </div>

          {/* Barra de Progreso Inmunológico */}
          <div className="mt-2.5 w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/60">
            <div
              className="bg-linear-to-r from-[#2B7A78] to-teal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${coveragePercentage}%` }}
            />
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#2B7A78]">
          <span>Ver todas las dosis</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>

      {/* TARJETA 2: DOSIS COMPLETADAS */}
      <div
        onClick={() => onSelectFilter('COMPLETED')}
        className={`group bg-white rounded-2xl border p-4 shadow-xs transition-all cursor-pointer flex flex-col justify-between select-none ${
          selectedFilter === 'COMPLETED'
            ? 'border-emerald-500 ring-1 ring-emerald-500/30 shadow-sm'
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Al día
            </span>
          </div>

          <div className="mt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Dosis Verificadas
            </p>
            <p className="text-2xl font-black text-slate-900 tracking-tight mt-0.5 leading-none">
              {completedCount}
            </p>
          </div>

          <p className="text-xs text-slate-500 mt-2 font-medium">
            Inmunizaciones registradas y certificadas en expediente clínico.
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-700">
          <span>Filtrar aplicadas</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>

      {/* TARJETA 3: PRÓXIMA DOSIS SUGERIDA */}
      <div
        onClick={() => onSelectFilter('NEXT')}
        className={`group bg-white rounded-2xl border p-4 shadow-xs transition-all cursor-pointer flex flex-col justify-between select-none ${
          selectedFilter === 'NEXT'
            ? 'border-amber-500 ring-1 ring-amber-500/30 shadow-sm'
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-2xs">
              <Clock className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Siguiente Dosis
            </span>
          </div>

          <div className="mt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {nextVaccineLabel}
            </p>
            <p className="text-base font-extrabold text-slate-900 tracking-tight mt-0.5 truncate">
              {nextVaccineDate}
            </p>
          </div>

          <p className="text-xs text-slate-500 mt-1.5 font-medium leading-tight">
            Refuerzo preventivo recomendado por lineamiento nacional.
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-amber-700">
          <span>Ver recomendación</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>

      {/* TARJETA 4: CARTILLA DIGITAL OFFLINE-READY */}
      <div
        onClick={onOpenCartilla}
        className="group bg-white rounded-2xl border border-slate-200/80 hover:border-sky-300 p-4 shadow-xs hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between select-none"
      >
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shadow-2xs">
              <Smartphone className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              Offline-Ready
            </span>
          </div>

          <div className="mt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Cartilla Electrónica
            </p>
            <p className="text-base font-extrabold text-slate-900 tracking-tight mt-0.5">
              Disponible sin Internet
            </p>
          </div>

          <p className="text-xs text-slate-500 mt-1.5 font-medium leading-tight">
            Válida en brigadas de campo con sincronización automática.
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-sky-600">
          <span>Abrir pasaporte digital</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </div>
  );
};

export default VacunasStatusCards;