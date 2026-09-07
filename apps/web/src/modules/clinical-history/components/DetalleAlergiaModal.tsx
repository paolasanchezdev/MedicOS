// =========================================================================
// ARCHIVO: apps/web/src/modules/clinical-history/components/DetalleAlergiaModal.tsx
// DESCRIPCIÓN: Modal reutilizable con ficha clínica de alergia e instrucciones.
// =========================================================================

import React from 'react';
import { X, AlertTriangle, Calendar, ShieldAlert, CheckCircle2 } from 'lucide-react';
import type { AllergyItem } from '../types/clinical-history.types.js';
import { AlergiaTipoBadge } from './AlergiaTipoBadge.js';

interface DetalleAlergiaModalProps {
  allergy: AllergyItem | null;
  onClose: () => void;
}

export const DetalleAlergiaModal: React.FC<DetalleAlergiaModalProps> = ({ allergy, onClose }) => {
  if (!allergy) return null;

  const dateObj = new Date(allergy.recordedAt);
  const fechaStr = dateObj.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const severityLabels: Record<string, { text: string; color: string }> = {
    SEVERE: { text: 'Alta / Severa (Riesgo de anafilaxia)', color: 'text-rose-700 bg-rose-50 border-rose-200' },
    MODERATE: { text: 'Moderada', color: 'text-amber-700 bg-amber-50 border-amber-200' },
    MILD: { text: 'Leve', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    UNKNOWN: { text: 'No especificada', color: 'text-slate-700 bg-slate-50 border-slate-200' },
  };

  const severityInfo = severityLabels[allergy.severity] || severityLabels.UNKNOWN;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-3xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto scrollbar-none animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B7A78]">
                Expediente Clínico &bull; Alergia
              </span>
              <AlergiaTipoBadge type={allergy.type} />
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Alerta de Reacción Adversa
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sustancia Alérgena Principal */}
        <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-rose-700 text-xs font-black uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Sustancia / Agente Alérgeno</span>
          </div>
          <p className="text-lg font-black text-rose-950 tracking-tight">{allergy.substance}</p>
        </div>

        {/* Reacción y Severidad */}
        <div className="space-y-2.5 text-xs">
          <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-3.5 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Manifestación Clínica / Reacción
            </span>
            <p className="text-slate-800 font-semibold leading-relaxed">{allergy.reaction}</p>
          </div>

          <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-3.5 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Severidad Estimada
            </span>
            <span className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-bold ${severityInfo.color}`}>
              {severityInfo.text}
            </span>
          </div>

          <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-3.5 space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#2B7A78]" /> Documentado en el Sistema
            </span>
            <p className="text-slate-800 font-bold capitalize">{fechaStr}</p>
          </div>
        </div>

        {/* Recomendación Clínica */}
        <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Informa siempre a cualquier médico, enfermero o brigadista sobre esta alergia antes de que te prescriban o
            apliquen cualquier fármaco.
          </p>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer active:scale-95"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleAlergiaModal;