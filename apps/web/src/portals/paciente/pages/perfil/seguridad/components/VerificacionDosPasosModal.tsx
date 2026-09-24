// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/seguridad/components/VerificacionDosPasosModal.tsx
// DESCRIPCIÓN: Modal informativo oficial sobre el despliegue controlado de 2FA.
// =========================================================================

import React from 'react';
import { Shield, X, CheckCircle2 } from 'lucide-react';

interface VerificacionDosPasosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VerificacionDosPasosModal: React.FC<VerificacionDosPasosModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-[#D3E8EC] space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EEF7F8] text-[#166E7A] border border-[#D3E8EC] flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 stroke-[2.2]" />
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
            Verificación en dos pasos (2FA)
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            La verificación en dos pasos añade un código de seguridad temporal para autorizar inicios de sesión en dispositivos nuevos.
          </p>

          <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-[#166E7A] shrink-0" />
              <span>Protección contra accesos no autorizados.</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-[#166E7A] shrink-0" />
              <span>Validación mediante código numérico oficial.</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-snug pt-1">
            Esta función se habilitará progresivamente conforme a las normativas de identidad digital del sistema de salud.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#166E7A] hover:bg-[#125861] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificacionDosPasosModal;