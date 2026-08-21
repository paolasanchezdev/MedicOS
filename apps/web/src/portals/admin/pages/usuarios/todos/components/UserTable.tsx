// ARCHIVO: apps/web/src/portals/admin/pages/usuarios/todos/components/UserTable.tsx
// DESCRIPCIÓN: Tabla de renderizado del listado de usuarios con acciones y badges.

import React from 'react';
import type { User } from '@/modules/users/types/user.types';

interface UserTableProps {
  users: User[];
  loading: boolean;
  getFullName: (user: User) => string;
  onOpenRoleModal: (user: User) => void;
  onOpenCredentialsModal: (user: User) => void;
  onOpenDeleteModal: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  getFullName,
  onOpenRoleModal,
  onOpenCredentialsModal,
  onOpenDeleteModal,
}) => {
  // Genera iniciales para la avatar del usuario
  const getInitials = (name: string, email: string) => {
    if (name && name !== 'Usuario sin nombre') {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    return email ? email.substring(0, 2).toUpperCase() : 'US';
  };

  // Helper para generar colores según el rol
  const getRoleBadgeStyle = (role?: string) => {
    const uppercaseRole = role?.toUpperCase();
    switch (uppercaseRole) {
      case 'ADMIN':
        return 'bg-purple-50 text-purple-700 border-purple-200/60';
      case 'DOCTOR':
        return 'bg-teal-50 text-teal-700 border-teal-200/60';
      case 'BRIGADISTA':
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
      case 'PATIENT':
        return 'bg-slate-100 text-slate-600 border-slate-200/60';
      case 'AUTHORITY':
      case 'AUTORIDADES_DE_SALUD':
        return 'bg-blue-50 text-blue-700 border-blue-200/60';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200/60';
    }
  };

  const safeUsers = Array.isArray(users) ? users : [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs font-medium">
          <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-teal-600 border-t-transparent mb-2" />
          <p>Cargando usuarios de MedicOS...</p>
        </div>
      ) : safeUsers.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-xs font-medium">
          No se encontraron usuarios que coincidan con la búsqueda.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-semibold tracking-wider uppercase text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Usuario</th>
                <th className="px-6 py-3.5">Correo Electrónico</th>
                <th className="px-6 py-3.5">Rol Actual</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {safeUsers.map((user) => {
                const name = getFullName(user);
                const initials = getInitials(name, user.email);
                const badgeClass = getRoleBadgeStyle(user.role);

                return (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[11px] shadow-2xs shrink-0">
                          {initials}
                        </div>
                        <span className="font-semibold text-slate-800">{name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-normal">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold border tracking-wide uppercase ${badgeClass}`}
                      >
                        {user.role || 'SIN ROL'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center space-x-1.5">
                        <button
                          onClick={() => onOpenRoleModal(user)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100/80 rounded-lg transition-colors cursor-pointer"
                          title="Cambiar Rol"
                        >
                          Rol
                        </button>
                        <button
                          onClick={() => onOpenCredentialsModal(user)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100/80 rounded-lg transition-colors cursor-pointer"
                          title="Editar Credenciales"
                        >
                          Credenciales
                        </button>
                        <button
                          onClick={() => onOpenDeleteModal(user)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100/80 rounded-lg transition-colors cursor-pointer"
                          title="Revocar Acceso"
                        >
                          Revocar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};