// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/vacunacion/resumen/components/VacunacionPendientesCard.tsx
// DESCRIPCIÓN: Tarjeta de atenciones offline pendientes de sincronización y alertas de refuerzo.
// =========================================================================

import React from 'react';
import { RotateCw, HardDrive, CheckCircle2, AlertCircle } from 'lucide-react';
import type { PendingVaccinationItem } from '../../../../../../../modules/vaccinations';

interface VacunacionPendientesCardProps {
  pendingQueue: PendingVaccinationItem[];
  onRetrySync: (id: string) => void;
  onDeletePending: (id: string) => void;
}

export const VacunacionPendientesCard: React.FC<VacunacionPendientesCardProps> = ({
  pendingQueue,
  onRetrySync,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-teal-700" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Sincronización Local ({pendingQueue.length})
          </h3>
        </div>
        {pendingQueue.length === 0 ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            Al día
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3" />
            Pendiente de envío
          </span>
        )}
      </div>

      {pendingQueue.length === 0 ? (
        <p className="text-xs text-slate-400 font-medium py-3 text-center">
          Todos los registros de vacunación están sincronizados con el servidor central.
        </p>
      ) : (
        <div className="space-y-2 max-h-56 overflow-y-auto">
          {pendingQueue.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 text-xs"
            >
              <div>
                <p className="font-extrabold text-slate-900">{item.patient.fullName}</p>
                <p className="text-[11px] text-slate-500">
                  {item.vaccineName} &bull; Dosis {item.doseNumber} (Lote: {item.lotNumber})
                </p>
              </div>

              <button
                type="button"
                onClick={() => onRetrySync(item.id)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
              >
                <RotateCw className="w-3 h-3" />
                <span>Sincronizar</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};