// ARCHIVO: apps/web/src/portals/admin/pages/usuarios/roles/components/ConfirmRoleModal.tsx
// DESCRIPCIÓN: Modal de confirmación para actualizar el rol de un usuario.

import React from 'react';
import type { User } from '@/modules/users/types/user.types';
import { ROLE_LABELS, type UserRoleType } from '@/core/permissions/roles';

interface ConfirmRoleModalProps {
  user: User;
  newRole: UserRoleType;
  isUpdating: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmRoleModal: React.FC<ConfirmRoleModalProps> = ({
  user,
  newRole,
  isUpdating,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-100">
        <div className="flex items-center space-x-3 text-teal-700">
          <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center font-bold text-lg">
            🔒
          </div>
          <h3 className="text-lg font-bold text-slate-900">Confirmar cambio de rol</h3>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          ¿Estás seguro de reasignar el perfil de acceso de{' '}
          <strong className="text-slate-800">
            {user.firstName} {user.lastName}
          </strong>{' '}
          al rol{' '}
          <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
            {ROLE_LABELS[newRole]}
          </span>
          ? Esto modificará de inmediato sus permisos en la plataforma.
        </p>

        <div className="flex justify-end space-x-3 pt-3">
          <button
            onClick={onCancel}
            disabled={isUpdating}
            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isUpdating}
            className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isUpdating ? 'Actualizando...' : 'Confirmar Cambio'}
          </button>
        </div>
      </div>
    </div>
  );
};