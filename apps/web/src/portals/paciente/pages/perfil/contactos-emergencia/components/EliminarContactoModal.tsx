// =========================================================================
// ARCHIVO: EliminarContactoModal.tsx
// DESCRIPCIÓN: Modal de confirmación para eliminar un contacto.
// =========================================================================

import React from 'react';
import { X } from 'lucide-react';

interface EliminarContactoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  contactName: string;
  loading: boolean;
}

export const EliminarContactoModal: React.FC<EliminarContactoModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  contactName,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-200 p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="eliminar-dialog-title"
      >
        <div className="flex items-start justify-between">
          <h2 id="eliminar-dialog-title" className="text-base font-semibold text-[#1A282D]">
            Eliminar contacto
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5 text-xs sm:text-sm text-[#52656C]">
          <p>
            ¿Quieres eliminar a <strong className="text-[#1A282D]">{contactName}</strong> de tus contactos de emergencia?
          </p>
          <p className="text-slate-400 text-xs">
            Esta acción no se puede deshacer.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="h-10 px-4 rounded-[10px] bg-slate-100 hover:bg-slate-200 text-[#1A282D] font-semibold text-xs transition cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="h-10 px-4 rounded-[10px] bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EliminarContactoModal;