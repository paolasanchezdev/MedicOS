// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/seguridad/components/CerrarSesionModal.tsx
// DESCRIPCIÓN: Modal de confirmación para revocar acceso a otro dispositivo.
// =========================================================================

import React from 'react';
import { LogOut, X } from 'lucide-react';
import type { UserSession } from '../../../../../../modules/patients/types/patient-security.types.js';

interface CerrarSesionModalProps {
  session: UserSession | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const CerrarSesionModal: React.FC<CerrarSesionModalProps> = ({
  session,
  onClose,
  onConfirm,
}) => {
  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-[#D3E8EC] space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
            <LogOut className="w-5 h-5 stroke-[2.2]" />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-slate-900">
            ¿Cerrar esta sesión?
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            El dispositivo <strong>{session.os} ({session.browser})</strong> dejará de tener acceso inmediato al portal de MedicOS.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default CerrarSesionModal;