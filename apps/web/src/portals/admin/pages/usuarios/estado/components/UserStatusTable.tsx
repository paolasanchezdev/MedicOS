import React from 'react';
import { RefreshCw, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';
import type { User, UserStatus } from '../../../../../../modules/users/types/user.types';
import { UserStatusBadge } from './UserStatusBadge';

interface UserStatusTableProps {
  users: User[];
  loading: boolean;
  getFullName: (user: User) => string;
  roleLabels: Record<string, string>;
  onRequestStatusChange: (user: User, newStatus: UserStatus | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') => void;
}

export const UserStatusTable: React.FC<UserStatusTableProps> = ({
  users,
  loading,
  getFullName,
  roleLabels,
  onRequestStatusChange,
}) => {
  const getInitials = (user: User): string => {
    const first = user.firstName ? user.firstName.charAt(0) : '';
    const last = user.lastName ? user.lastName.charAt(0) : '';
    const initials = `${first}${last}`.toUpperCase();
    return initials || 'U';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Usuario</th>
              <th className="py-3 px-4">Correo Electrónico</th>
              <th className="py-3 px-4">Rol Actual</th>
              <th className="py-3 px-4">Estado Actual</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500">
                  <div className="flex justify-center items-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-(--color-medicos-primary)" />
                    <span>Cargando usuarios...</span>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500">
                  No se encontraron usuarios con los criterios seleccionados.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const currentStatus = (user.status || 'ACTIVE').toUpperCase();

                return (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Usuario con Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                          {getInitials(user)}
                        </div>
                        <span className="font-semibold text-slate-800">
                          {getFullName(user)}
                        </span>
                      </div>
                    </td>

                    {/* Correo Electrónico */}
                    <td className="py-3.5 px-4 text-slate-600 text-xs font-mono">
                      {user.email}
                    </td>

                    {/* Rol Actual */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                        {roleLabels[user.role?.toUpperCase()] || user.role}
                      </span>
                    </td>

                    {/* Estado Actual */}
                    <td className="py-3.5 px-4">
                      <UserStatusBadge status={user.status} />
                    </td>

                    {/* Acciones con Botones interactivos */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {currentStatus !== 'ACTIVE' && (
                          <button
                            type="button"
                            onClick={() => onRequestStatusChange(user, 'ACTIVE')}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Activar
                          </button>
                        )}

                        {currentStatus !== 'INACTIVE' && (
                          <button
                            type="button"
                            onClick={() => onRequestStatusChange(user, 'INACTIVE')}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            Inactivar
                          </button>
                        )}

                        {currentStatus !== 'SUSPENDED' && (
                          <button
                            type="button"
                            onClick={() => onRequestStatusChange(user, 'SUSPENDED')}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Suspender
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};