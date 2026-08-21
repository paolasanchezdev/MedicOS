import React from 'react';
import type { User } from '../types/user.types';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onConfirm: (userId: string) => Promise<boolean>;
  isSubmitting: boolean;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onConfirm,
  isSubmitting,
}) => {
  if (!isOpen || !user) return null;

  const displayName =
    user.firstName || user.lastName
      ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
      : user.name || user.email;

  const handleConfirm = async () => {
    await onConfirm(user.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
        <div className="p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-xl font-bold">
            ⚠️
          </div>

          <div>
            <h3 className="font-bold text-lg text-slate-800">
              ¿Revocar Acceso a Usuario?
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Esta acción inhabilitará la cuenta de{' '}
              <span className="font-semibold text-slate-800">{displayName}</span> ({user.email}). El usuario no podrá volver a iniciar sesión en MedicOS.
            </p>
          </div>

          <div className="flex justify-center space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 cursor-pointer disabled:opacity-50 transition-colors shadow-xs"
            >
              {isSubmitting ? 'Revocando...' : 'Sí, Revocar Acceso'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};