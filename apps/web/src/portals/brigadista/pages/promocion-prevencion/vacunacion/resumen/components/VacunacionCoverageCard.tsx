// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/vacunacion/resumen/components/VacunacionCoverageCard.tsx
// DESCRIPCIÓN: Tarjetas de métricas de cobertura y vacunas aplicadas en la jornada.
// =========================================================================

import React from 'react';
import { Syringe, Users, MapPin, CheckCircle2 } from 'lucide-react';
import type { VaccinationSummaryDTO } from '../../../../../../../modules/vaccinations';

interface VacunacionCoverageCardProps {
  summary: VaccinationSummaryDTO | null;
}

export const VacunacionCoverageCard: React.FC<VacunacionCoverageCardProps> = ({ summary }) => {
  const totalToday = summary?.totalToday ?? 0;
  const totalPatients = summary?.totalVaccinatedPatients ?? 0;
  const activeBrigades = summary?.activeBrigadesCount ?? 1;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Dosis Aplicadas Hoy
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalToday}
            </p>
            <span className="text-xs text-slate-500 font-medium">biológicos</span>
          </div>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 shadow-2xs">
          <Syringe className="w-5 h-5 stroke-2" />
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Personas Vacunadas
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalPatients}
            </p>
            <span className="text-xs text-slate-500 font-medium">pacientes</span>
          </div>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-700 shadow-2xs">
          <Users className="w-5 h-5 stroke-2" />
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Brigada Territorial
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Jornada Activa
            </p>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">{activeBrigades} punto(s) de atención</span>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700 shadow-2xs">
          <MapPin className="w-5 h-5 stroke-2" />
        </div>
      </div>
    </div>
  );
};