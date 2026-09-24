// =========================================================================
// ARCHIVO: PreferenciasResetModal.tsx
// DESCRIPCIÓN: Modal de confirmación para restablecer valores predeterminados.
// =========================================================================

import React from 'react';
import { RotateCcw, X, ShieldAlert } from 'lucide-react';

interface PreferenciasResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const PreferenciasResetModal: React.FC<PreferenciasResetModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-[#D3E8EC] space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EEF7F8] text-[#166E7A] border border-[#D3E8EC] flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5 stroke-[2.2]" />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-extrabold text-slate-900">
            ¿Restablecer preferencias?
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Se restaurarán los valores predeterminados de notificaciones, apariencia y accesibilidad del portal.
          </p>
          <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-xl bg-teal-50/60 border border-teal-100 text-[11.5px] text-[#1c5752] font-medium">
            <ShieldAlert className="w-4 h-4 shrink-0 text-[#166E7A]" />
            <span>Esto no afectará tu expediente clínico ni tus datos personales.</span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-[#166E7A] hover:bg-[#125861] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            Restablecer
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferenciasResetModal;