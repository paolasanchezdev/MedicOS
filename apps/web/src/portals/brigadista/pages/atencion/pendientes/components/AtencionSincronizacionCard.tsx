// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/pendientes/components/AtencionSincronizacionCard.tsx
// DESCRIPCIÓN: Tarjeta para atenciones terminadas localmente pendientes de sincronizar.
// =========================================================================

import React from 'react';
import { RotateCw, CheckCircle2, AlertTriangle, FileText, User, HardDrive } from 'lucide-react';
import type { PendingAttentionItem } from '../../../../../../modules/atencion';
import { AtencionPendienteStatusBadge } from './AtencionPendienteStatusBadge';

interface AtencionSincronizacionCardProps {
  attention: PendingAttentionItem;
  isOnline: boolean;
  isSyncing: boolean;
  onRetrySync: (id: string) => void;
  onOpenDetail: (item: PendingAttentionItem) => void;
}

function formatDate(d?: string | Date | null): string {
  if (!d) return '—';
  try {
    const dateObj = typeof d === 'string' ? new Date(d) : d;
    return dateObj.toLocaleDateString('es-SV', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(d);
  }
}

export const AtencionSincronizacionCard: React.FC<AtencionSincronizacionCardProps> = ({
  attention,
  isOnline,
  isSyncing,
  onRetrySync,
  onOpenDetail,
}) => {
  const syncDetails = attention.syncDetails || {
    savedLocallyAt: attention.updatedAt,
    lastAttemptAt: null,
    attemptCount: 0,
  };

  const isError = attention.status === 'SYNC_ERROR';

  return (
    <div className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-2xs shrink-0 ${
                isError
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-700'
                  : 'bg-teal-500/10 border-teal-500/20 text-teal-700'
              }`}
            >
              {isError ? <AlertTriangle className="w-5 h-5 stroke-2" /> : <User className="w-5 h-5 stroke-2" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight truncate">
                {attention.patient.fullName}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {attention.patient.dui ? `DUI: ${attention.patient.dui}` : 'Sin DUI registrado'}
              </p>
            </div>
          </div>

          <AtencionPendienteStatusBadge status={attention.status} isSyncing={isSyncing} />
        </div>

        <div className="mt-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-600">
            <span className="font-semibold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              Atención clínica completada
            </span>
            <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-slate-400" />
              Localmente
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-100 space-y-1 text-slate-600">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Guardada en dispositivo:</span>
              <span className="font-bold text-slate-700">{formatDate(syncDetails.savedLocallyAt)}</span>
            </div>

            {syncDetails.lastAttemptAt && (
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Último intento:</span>
                <span className="font-medium text-slate-700">{formatDate(syncDetails.lastAttemptAt)}</span>
              </div>
            )}

            {isError && syncDetails.errorMessage && (
              <p className="text-[11px] font-bold text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200/60 mt-1 leading-relaxed">
                ⚠ {syncDetails.errorMessage}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onOpenDetail(attention)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Ver detalle</span>
        </button>

        <button
          type="button"
          disabled={!isOnline || isSyncing}
          onClick={() => onRetrySync(attention.id)}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer ${
            !isOnline
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              : 'bg-teal-700 hover:bg-teal-800 text-white active:scale-98'
          }`}
          title={!isOnline ? 'Conexión requerida para sincronizar' : 'Reintentar sincronización ahora'}
        >
          <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Sincronizando...' : !isOnline ? 'Sin conexión' : 'Reintentar'}</span>
        </button>
      </div>
    </div>
  );
};