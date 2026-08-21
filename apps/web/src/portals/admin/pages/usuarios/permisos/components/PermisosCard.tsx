// ARCHIVO: apps/web/src/portals/admin/pages/usuarios/permisos/components/PermisosCard.tsx
import React from 'react';
import { ROLE_LABELS, UserRole, type UserRoleType } from '@/core/permissions/roles';

interface PermissionItem {
  name: string;
  description: string;
  roles: UserRoleType[];
}

interface PermisosCardProps {
  category: string;
  permissions: PermissionItem[];
  onTogglePermission?: (permissionName: string, role: UserRoleType) => void;
}

export const PermisosCard: React.FC<PermisosCardProps> = ({
  category,
  permissions,
}) => {
  const getRoleBadgeStyle = (role: UserRoleType) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-purple-50 text-purple-700 border-purple-200/60';
      case UserRole.DOCTOR:
        return 'bg-teal-50 text-teal-700 border-teal-200/60';
      case UserRole.BRIGADISTA:
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
      case UserRole.PACIENTE:
        return 'bg-slate-100 text-slate-600 border-slate-200/60';
      case UserRole.AUTORIDADES_DE_SALUD:
        return 'bg-blue-50 text-blue-700 border-blue-200/60';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200/60';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          {category}
        </h3>
        <span className="text-[11px] font-semibold text-slate-400 bg-slate-200/50 px-2.5 py-0.5 rounded-full">
          {permissions.length} permiso{permissions.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {permissions.map((perm, pIdx) => (
          <div
            key={pIdx}
            className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
          >
            <div className="space-y-1 max-w-2xl">
              <h4 className="text-xs font-bold text-slate-800">{perm.name}</h4>
              <p className="text-xs text-slate-500 font-normal leading-relaxed">
                {perm.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-semibold text-slate-400 mr-1">
                Roles autorizados:
              </span>
              {perm.roles.map((role) => (
                <span
                  key={role}
                  className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold border tracking-wide uppercase ${getRoleBadgeStyle(
                    role
                  )}`}
                  title={ROLE_LABELS[role]}
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};