// apps/web/src/modules/brigades/components/DeleteBrigadeModal.tsx
import React, { useState } from 'react';
import { AlertTriangle, Trash2, ShieldAlert } from 'lucide-react';
import type { BrigadeItem } from '../types/brigade.types';

export interface DeleteBrigadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  brigade: BrigadeItem | null;
}

export const DeleteBrigadeModal: React.FC<DeleteBrigadeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  brigade,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !brigade) return null;

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await onConfirm();
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al dar de baja la brigada');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="text-center">
            <h3 className="text-base font-bold text-slate-800">
              ¿Dar de baja esta brigada médica?
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Se anulará la expedición <strong className="text-slate-700">{brigade.name}</strong> en {brigade.municipality}, {brigade.department}.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isSubmitting ? 'Cancelando...' : 'Confirmar Baja'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};