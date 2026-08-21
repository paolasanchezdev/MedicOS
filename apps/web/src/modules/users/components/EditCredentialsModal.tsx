// ARCHIVO: apps/web/src/modules/users/components/EditCredentialsModal.tsx
// DESCRIPCIÓN: Modal para la actualización de credenciales/contraseñas de usuario.

import React, { useState } from 'react';
import type { User } from '../types/user.types';
import type { UpdateCredentialsInput } from '../schemas/user.schemas';

interface EditCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSubmit: (payload: UpdateCredentialsInput) => Promise<boolean>;
  isSubmitting: boolean;
}

export const EditCredentialsModal: React.FC<EditCredentialsModalProps> = ({
  isOpen,
  onClose,
  user,
  onSubmit,
  isSubmitting,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const displayName =
    user.firstName || user.lastName
      ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
      : user.name || user.email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('La contraseña debe contener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas ingresadas no coinciden.');
      return;
    }

    const success = await onSubmit({
      userId: user.id,
      password,
    });

    if (success) {
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-semibold text-base text-slate-800">
              Editar Credenciales
            </h3>
            <p className="text-xs text-slate-500">
              Restablecer contraseña de acceso.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-medium text-lg leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/60">
            <p className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
              Usuario Afectado
            </p>
            <p className="font-semibold text-slate-800 text-sm mt-0.5">{displayName}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nueva Contraseña
            </label>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              required
              placeholder="Ingresa la nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              required
              placeholder="Repite la contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 rounded-xl hover:bg-amber-700 cursor-pointer disabled:opacity-50 transition-colors shadow-xs"
            >
              {isSubmitting ? 'Actualizando...' : 'Actualizar Contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};