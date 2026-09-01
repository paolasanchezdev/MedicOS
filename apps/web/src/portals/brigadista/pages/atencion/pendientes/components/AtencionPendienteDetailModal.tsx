// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/pendientes/components/AtencionPendienteDetailModal.tsx
// DESCRIPCIÓN: Modal flotante para consultar datos resumidos de la atención pendiente sin salir del flujo.
// =========================================================================

import React from 'react';
import { X, User, ArrowRight, RotateCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { PendingAttentionItem } from '../../../../../../modules/atencion';
import { AtencionPendienteStatusBadge } from './AtencionPendienteStatusBadge';

interface AtencionPendienteDetailModalProps {
  attention: PendingAttentionItem | null;
  isOpen: boolean;
  isOnline: boolean;
  isSyncing: boolean;
  onClose: () => void;
  onRetrySync: (id: string) => void;
}

function formatDate(d?: string | Date | null): string {
  if (!d) return '—';
  try {
    const dateObj = typeof d === 'string' ? new Date(d) : d;
    return dateObj.toLocaleDateString('es-SV', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(d);
  }
}

export const AtencionPendienteDetailModal: React.FC<AtencionPendienteDetailModalProps> = ({
  attention,
  isOpen,
  isOnline,
  isSyncing,
  onClose,
  onRetrySync,
}) => {
  const navigate = useNavigate();

  if (!isOpen || !attention) return null;

  const isIncomplete = attention.operationalType === 'INCOMPLETE';

  const handleContinue = () => {
    onClose();
    navigate('/brigadista/atencion/nueva');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-2xl max-w-lg w-full flex flex-col justify-between overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight truncate">
                {attention.patient.fullName}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {attention.patient.dui ? `DUI: ${attention.patient.dui}` : 'Sin DUI'}
              </p>
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
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50/80 border border-slate-100">
            <span className="font-semibold text-slate-500">Estado Operativo</span>
            <AtencionPendienteStatusBadge status={attention.status} isSyncing={isSyncing} />
          </div>

          <div className="space-y-2 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Motivo / Categoría:</span>
              <span className="font-bold text-slate-800 text-right">{attention.categoryLabel}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Iniciada:</span>
              <span className="font-bold text-slate-800">{formatDate(attention.startedAt)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Última modificación:</span>
              <span className="font-bold text-slate-800">{formatDate(attention.updatedAt)}</span>
            </div>

            {isIncomplete && attention.stepInfo && (
              <div className="pt-2 border-t border-slate-100 flex justify-between">
                <span className="text-slate-400 font-medium">Progreso registrado:</span>
                <span className="font-bold text-amber-700">
                  {attention.stepInfo.currentStep} de {attention.stepInfo.totalSteps} pasos (
                  {attention.stepInfo.currentStepName})
                </span>
              </div>
            )}

            {!isIncomplete && attention.syncDetails && (
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Guardada localmente:</span>
                  <span className="font-bold text-slate-800">
                    {formatDate(attention.syncDetails.savedLocallyAt)}
                  </span>
                </div>
                {attention.syncDetails.lastAttemptAt && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Último reintento:</span>
                    <span className="font-medium text-slate-700">
                      {formatDate(attention.syncDetails.lastAttemptAt)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer text-xs"
          >
            Cerrar
          </button>

          {isIncomplete ? (
            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl transition cursor-pointer text-xs shadow-xs"
            >
              <span>Continuar atención</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={!isOnline || isSyncing}
              onClick={() => onRetrySync(attention.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 font-bold rounded-xl transition text-xs shadow-xs ${
                !isOnline
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-teal-700 hover:bg-teal-800 text-white cursor-pointer'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Sincronizando...' : 'Reintentar sincronización'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};