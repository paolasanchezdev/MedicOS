// apps/web/src/modules/establishments/components/DeleteEstablishmentModal.tsx
import React from 'react';
import type { Establishment } from '../types/establishment.types';

export interface DeleteEstablishmentModalProps {
  establishment: Establishment;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export const DeleteEstablishmentModal: React.FC<DeleteEstablishmentModalProps> = ({
  establishment,
  onClose,
  onConfirm,
  loading = false,
}) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden p-6 space-y-4 animate-fade-in">
        <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold text-slate-900">
            ¿Desactivar establecimiento?
          </h3>
          <p className="text-xs text-slate-500">
            El establecimiento <strong className="text-slate-700">{establishment.name}</strong> ({establishment.code}) cambiará su estado a <strong className="text-rose-600">Inactivo</strong> en la red de salud.
          </p>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-lg transition-colors shadow-xs"
          >
            {loading ? 'Procesando...' : 'Confirmar Baja'}
          </button>
        </div>
      </div>
    </div>
  );
};