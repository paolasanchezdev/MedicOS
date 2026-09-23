// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/educacion-ia/consejos-personalizados/components/ConsejoDetalleModal.tsx
// DESCRIPCIÓN: Modal de transparencia auditada: "¿Por qué recibí este consejo?".
// =========================================================================

import React from 'react';
import { X, ShieldCheck, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import type { PersonalizedAdvice } from '../../../../../../modules/personalized-advice/types/personalized-advice.types.js';

interface ConsejoDetalleModalProps {
  advice: PersonalizedAdvice | null;
  onClose: () => void;
  onExecuteAction: (advice: PersonalizedAdvice) => void;
}

export const ConsejoDetalleModal: React.FC<ConsejoDetalleModalProps> = ({
  advice,
  onClose,
  onExecuteAction,
}) => {
  if (!advice) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="bg-white rounded-3xl border border-slate-100 max-w-lg w-full p-6 shadow-xl space-y-5 animate-in zoom-in-95">
        {/* Encabezado */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-extrabold">
              {advice.categoryLabel}
            </span>
            <h2 className="text-base sm:text-lg font-black text-slate-900 pt-1">
              ¿Por qué recibí este consejo?
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explicación Pedagógica */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
          <p className="font-bold text-slate-900">{advice.title}</p>
          <p>{advice.explanation}</p>
        </div>

        {/* Fuentes de Datos Auditadas */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-teal-700" />
            <span>Datos utilizados de tu expediente</span>
          </h3>

          <div className="space-y-2">
            {advice.dataSources.map((ds, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 text-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">{ds.label}</p>
                  <p className="text-[11px] text-slate-500">{ds.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Garantía de Privacidad */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-teal-50/50 p-2.5 rounded-xl border border-teal-100">
          <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
          <span>Recomendación pedagógica. No se emplean datos no autorizados ni se emiten diagnósticos médicos.</span>
        </div>

        {/* Botones */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            Cerrar
          </button>

          {advice.actionLabel && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onExecuteAction(advice);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-extrabold transition cursor-pointer shadow-xs"
            >
              <span>{advice.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsejoDetalleModal;