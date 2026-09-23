// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/tratamientos/recetas-activas/components/RecetaActivaCard.tsx
// DESCRIPCIÓN: Tarjeta de receta con agrupación ordenada de fármacos activos.
// =========================================================================

import React from 'react';
import { Pill, Clock, Calendar, ArrowRight, User } from 'lucide-react';
import type { PrescriptionRecord } from '../../../../../../modules/prescriptions/index.js';
import { RecetaEstadoBadge } from '../../../../../../modules/prescriptions/index.js';

interface RecetaActivaCardProps {
  prescription: PrescriptionRecord;
  onOpenDetail: (rx: PrescriptionRecord) => void;
}

export const RecetaActivaCard: React.FC<RecetaActivaCardProps> = ({
  prescription,
  onOpenDetail,
}) => {
  const fechaPrescrita = new Date(prescription.issuedAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all duration-150 hover:border-teal-300">
      {/* Cabecera de Receta */}
      <div className="p-3.5 sm:p-4 bg-slate-50/70 border-b border-slate-200/70 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black tracking-wider text-slate-800 uppercase">
            Receta #{prescription.code}
          </span>
          <RecetaEstadoBadge status={prescription.status} />
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
          <span>Prescrita: <strong className="text-slate-700 font-semibold">{fechaPrescrita}</strong></span>
          {prescription.doctor && (
            <span className="hidden sm:inline-flex items-center gap-1">
              <User className="w-3 h-3 text-slate-400" />
              <span>Dr(a). {prescription.doctor.lastName}</span>
            </span>
          )}
        </div>
      </div>

      {/* Lista de Fármacos de la Receta */}
      <div className="p-4 sm:p-5 space-y-3">
        {prescription.items.map((med) => {
          const inicioStr = new Date(med.startDate).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });
          const finStr = new Date(med.endDate).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });

          return (
            <div
              key={med.id}
              className="bg-slate-50/60 border border-slate-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-teal-50 text-medicos-teal flex items-center justify-center shrink-0">
                    <Pill className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 leading-none">
                    {med.medicine}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-teal-50 text-medicos-teal border border-teal-200/70">
                    {med.dosage}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium pt-1">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {med.frequency}
                  </span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {med.duration}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 pt-0.5 flex items-center gap-3">
                  <span>Inicio: <strong className="text-slate-600">{inicioStr}</strong></span>
                  <span>Finaliza: <strong className="text-slate-600">{finStr}</strong></span>
                </div>
              </div>

              <div className="shrink-0 self-end sm:self-center">
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-medicos-teal bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/60">
                  {med.isExpired ? 'Completado' : `${med.daysRemaining} días restantes`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pie de Receta */}
      <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-end">
        <button
          type="button"
          onClick={() => onOpenDetail(prescription)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-medicos-teal hover:text-[#16646e] transition cursor-pointer select-none"
        >
          <span>Ver receta completa</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default RecetaActivaCard;