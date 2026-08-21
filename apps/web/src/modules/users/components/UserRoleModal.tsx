import React, { useState } from 'react';
import type { User, UserRole } from '../types/user.types';
import type { UpdateUserRoleInput } from '../schemas/user.schemas';

interface UserRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSubmit: (payload: UpdateUserRoleInput) => Promise<boolean>;
  isSubmitting: boolean;
}

const AVAILABLE_ROLES: { value: UserRole; label: string }[] = [
  { value: 'ADMIN', label: 'Administrador (ADMIN)' },
  { value: 'DOCTOR', label: 'Médico / Doctor (DOCTOR)' },
  { value: 'BRIGADISTA', label: 'Brigadista (BRIGADISTA)' },
  { value: 'PATIENT', label: 'Paciente (PATIENT)' },
  { value: 'AUTHORITY', label: 'Autoridad de Salud (AUTHORITY)' },
];

export const UserRoleModal: React.FC<UserRoleModalProps> = ({
  isOpen,
  onClose,
  user,
  onSubmit,
  isSubmitting,
}) => {
  const [prevUserId, setPrevUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('DOCTOR');

  // Sincronización directa durante el render sin useEffect para evitar renders en cascada
  if (user && user.id !== prevUserId) {
    setPrevUserId(user.id);
    const formattedRole = user.role?.toUpperCase() as UserRole;
    const validRole = AVAILABLE_ROLES.some((r) => r.value === formattedRole)
      ? formattedRole
      : 'DOCTOR';
    setSelectedRole(validRole);
  }

  if (!isOpen || !user) return null;

  const displayName =
    user.firstName || user.lastName
      ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
      : user.name || user.email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      userId: user.id,
      role: selectedRole,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-semibold text-base text-slate-800">
            Gestionar Rol de Usuario
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-medium text-lg leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-teal-50/50 p-3.5 rounded-xl border border-teal-100/60">
            <p className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider">
              Usuario Seleccionado
            </p>
            <p className="font-medium text-slate-800 text-sm mt-0.5">{displayName}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Asignar Nuevo Rol
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white font-medium text-slate-700 shadow-xs"
            >
              {AVAILABLE_ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
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
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-xl hover:bg-teal-700 cursor-pointer disabled:opacity-50 transition-colors shadow-xs"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};