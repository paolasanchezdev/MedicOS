// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/vacunacion/resumen/components/VacunacionSincronizacionCard.tsx
// DESCRIPCIÓN: Tarjeta de estado de sincronización outbox estilo TarjetaSincronizacion de Admin.
// =========================================================================

import React from 'react';
import { RotateCw, CheckCircle2, AlertCircle, Wifi, CloudSync } from 'lucide-react';
import type { PendingVaccinationItem } from '../../../../../../../modules/vaccinations';

interface VacunacionSincronizacionCardProps {
  pendingQueue: PendingVaccinationItem[];
  onRetrySync: (id: string) => void;
  onDeletePending: (id: string) => void;
}

export const VacunacionSincronizacionCard: React.FC<VacunacionSincronizacionCardProps> = ({
  pendingQueue,
  onRetrySync,
}) => {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div>
        {/* Cabecera */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 shadow-2xs">
              <CloudSync className="w-4 h-4 stroke-2" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Sincronización Offline (Outbox)
              </h3>
              <p className="text-[11px] text-slate-400">
                Cola transaccional en almacenamiento local
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  : 'bg-rose-50 text-rose-700 border border-rose-200/60'
              }`}
            >
              <Wifi className="w-3 h-3" />
              {isOnline ? 'En línea' : 'Sin conexión'}
            </span>
          </div>
        </div>

        {/* Métricas de Sincronización */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Registros Locales
            </span>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">
              {pendingQueue.length}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Estado de Cola
            </span>
            <p className="text-xs font-extrabold text-teal-800 mt-1 flex items-center gap-1">
              {pendingQueue.length === 0 ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Sincronizado
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Pendiente de envío
                </>
              )}
            </p>
          </div>
        </div>

        {/* Lista de Registros Pendientes */}
        <div className="mt-4 space-y-2 max-h-52 overflow-y-auto">
          {pendingQueue.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              No hay biológicos pendientes de sincronizar con el servidor central.
            </div>
          ) : (
            pendingQueue.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60 text-xs"
              >
                <div className="min-w-0 pr-2">
                  <p className="font-extrabold text-slate-900 truncate">
                    {item.patient.fullName}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {item.vaccineName} &bull; Dosis {item.doseNumber} (Lote: {item.lotNumber})
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onRetrySync(item.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition cursor-pointer shrink-0"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Sincronizar</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="text-[11px] text-slate-400">
          Almacenamiento: IndexedDB / LocalStorage
        </span>
        <span className="font-bold text-teal-800">
          {pendingQueue.length === 0 ? 'Sin datos pendientes' : `${pendingQueue.length} por transmitir`}
        </span>
      </div>
    </div>
  );
};