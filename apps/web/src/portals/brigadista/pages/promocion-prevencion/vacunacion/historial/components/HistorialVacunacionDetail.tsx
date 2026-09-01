// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/vacunacion/historial/components/HistorialVacunacionDetail.tsx
// DESCRIPCIÓN: Modal flotante de detalle de la vacuna aplicada.
// =========================================================================

import React from 'react';
import { X, Syringe } from 'lucide-react';
import type { VaccinationRecord } from '../../../../../../../modules/vaccinations';

export interface HistorialVacunacionDetailProps {
  record: VaccinationRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatDate(d: string): string {
  try {
    return new Date(d).toLocaleDateString('es-SV', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return d;
  }
}

export const HistorialVacunacionDetail: React.FC<HistorialVacunacionDetailProps> = ({
  record,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !record) return null;

  const patientName =
    `${record.patient?.firstName || ''} ${record.patient?.lastName || ''}`.trim() ||
    'Persona Atendida';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-2xl max-w-lg w-full flex flex-col justify-between overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 shrink-0">
              <Syringe className="w-6 h-6 stroke-2" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-md uppercase tracking-wider">
                Registro de Inmunización
              </span>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight mt-1 truncate">
                {patientName}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3.5 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Biológico:</span>
              <span className="font-extrabold text-slate-900">{record.vaccineName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Dosis:</span>
              <span className="font-bold text-teal-800">
                Dosis {record.doseNumber} de {record.totalDoses}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Lote:</span>
              <span className="font-mono font-bold text-slate-800">{record.lotNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Fecha de Aplicación:</span>
              <span className="font-bold text-slate-800">{formatDate(record.administeredAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Vía y Sitio:</span>
              <span className="text-slate-700">
                {record.administrationRoute} ({record.anatomicalSite})
              </span>
            </div>
          </div>

          {record.adverseReactions && (
            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl space-y-1">
              <span className="font-bold text-amber-900 block">
                Reacción Inmediata Reportada:
              </span>
              <p className="text-amber-800">{record.adverseReactions}</p>
            </div>
          )}

          {record.notes && (
            <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1">
              <span className="font-bold text-slate-700 block">Notas / Consejería:</span>
              <p className="text-slate-600">{record.notes}</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};