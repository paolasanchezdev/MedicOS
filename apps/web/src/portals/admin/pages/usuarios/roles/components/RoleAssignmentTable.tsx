// ARCHIVO: apps/web/src/portals/admin/pages/usuarios/roles/components/RoleAssignmentTable.tsx
// DESCRIPCIÓN: Tabla interactiva para filtrado y asignación directa de roles a usuarios.

import React from 'react';
import type { User } from '@/modules/users/types/user.types';
import { UserRole, type UserRoleType } from '@/core/permissions/roles';

interface RoleAssignmentTableProps {
  users: User[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  onSelectRoleChange: (user: User, newRole: UserRoleType) => void;
}

export const RoleAssignmentTable: React.FC<RoleAssignmentTableProps> = ({
  users,
  isLoading,
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  onSelectRoleChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Buscar usuario por nombre o correo electrónico..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm placeholder:text-slate-400 text-slate-800"
          />
        </div>
        <div className="w-full sm:w-56">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white text-slate-700 shadow-sm cursor-pointer"
          >
            <option value="ALL">Todos los roles</option>
            <option value={UserRole.ADMIN}>ADMIN (Administrador)</option>
            <option value={UserRole.DOCTOR}>DOCTOR (Médico)</option>
            <option value={UserRole.BRIGADISTA}>BRIGADISTA (Territorial)</option>
            <option value={UserRole.AUTORIDADES_DE_SALUD}>AUTHORITY (Autoridad)</option>
            <option value={UserRole.PACIENTE}>PATIENT (Paciente)</option>
          </select>
        </div>
      </div>

      {/* Contenedor de Tabla */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-teal-600 border-t-transparent mb-2" />
            <p>Cargando directorio de usuarios...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No se encontraron usuarios coincidentes.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">Usuario</th>
                  <th className="py-3 px-4">Correo Electrónico</th>
                  <th className="py-3 px-4">Teléfono</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Rol Asignado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3.5 px-4 text-slate-500">{u.phone || 'N/A'}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : u.status === 'SUSPENDED'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {u.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => onSelectRoleChange(u, e.target.value as UserRoleType)}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm cursor-pointer hover:border-slate-300 transition-colors"
                      >
                        <option value={UserRole.ADMIN}>ADMIN</option>
                        <option value={UserRole.DOCTOR}>DOCTOR</option>
                        <option value={UserRole.BRIGADISTA}>BRIGADISTA</option>
                        <option value={UserRole.AUTORIDADES_DE_SALUD}>AUTHORITY</option>
                        <option value={UserRole.PACIENTE}>PATIENT</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};