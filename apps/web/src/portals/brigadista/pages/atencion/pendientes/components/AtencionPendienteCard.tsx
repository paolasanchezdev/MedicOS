// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/pendientes/components/AtencionPendienteCard.tsx
// DESCRIPCIÓN: Tarjeta para atenciones incompletas con barra de progreso y botón para reanudar.
// =========================================================================

import React from 'react';
import { ArrowRight, Clock, User, FileText, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { PendingAttentionItem } from '../../../../../../modules/atencion';
import { AtencionPendienteStatusBadge } from './AtencionPendienteStatusBadge';

interface AtencionPendienteCardProps {
  attention: PendingAttentionItem;
  onOpenDetail: (item: PendingAttentionItem) => void;
  onDeleteDraft?: (id: string) => void;
}

function formatDate(d: string | Date): string {
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

export const AtencionPendienteCard: React.FC<AtencionPendienteCardProps> = ({
  attention,
  onOpenDetail,
  onDeleteDraft,
}) => {
  const navigate = useNavigate();

  const stepInfo = attention.stepInfo || {
    currentStep: 1,
    totalSteps: 8,
    currentStepName: 'Identificación',
    missingSteps: [],
  };

  const progressPercent = Math.round((stepInfo.currentStep / stepInfo.totalSteps) * 100);

  const handleContinue = () => {
    navigate('/brigadista/atencion/nueva');
  };

  return (
    <div className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 shadow-2xs shrink-0">
              <User className="w-5 h-5 stroke-2" />
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

          <AtencionPendienteStatusBadge status={attention.status} />
        </div>

        <div className="mt-3.5 space-y-2 text-xs">
          <div className="flex items-start justify-between p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 text-slate-600 gap-2">
            <span className="font-semibold text-slate-900 line-clamp-1">
              {attention.categoryLabel || 'Atención Comunitaria'}
            </span>
            <span className="text-[11px] font-medium text-slate-400 shrink-0 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Iniciada: {formatDate(attention.startedAt)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-500 uppercase tracking-wider">
                Progreso ({stepInfo.currentStep} de {stepInfo.totalSteps} pasos)
              </span>
              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 font-extrabold">
                {progressPercent}%
              </span>
            </div>

            <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
              <div
                style={{ width: `${progressPercent}%` }}
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
              />
            </div>

            <p className="text-[11px] text-slate-500 font-medium">
              Último paso completado:{' '}
              <span className="font-bold text-slate-700">{stepInfo.currentStepName}</span>
            </p>
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
          <span>Ver resumen</span>
        </button>

        <div className="flex items-center gap-2">
          {onDeleteDraft && (
            <button
              type="button"
              onClick={() => onDeleteDraft(attention.id)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
              title="Descartar borrador"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleContinue}
            className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-[#1B5250] to-[#2B7A78] hover:from-[#15413f] hover:to-[#226361] text-white text-xs font-extrabold rounded-xl shadow-xs transition cursor-pointer active:scale-98"
          >
            <span>Continuar atención</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};