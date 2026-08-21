// ARCHIVO: apps/web/src/portals/admin/pages/usuarios/roles/components/RoleMatrixTable.tsx
// DESCRIPCIÓN: Matriz visual de permisos del sistema RBAC en MedicOS.

import React from 'react';
import { ROLE_MATRIX, UserRole } from '@/core/permissions/roles';

export const RoleMatrixTable: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-xl text-sm text-teal-900 flex items-center gap-3">
        <span className="text-teal-600 font-bold text-base">ⓘ</span>
        <span>
          <strong>Matriz de Seguridad RBAC:</strong> Define los permisos y capacidades asignadas a cada nivel jerárquico dentro de MedicOS.
        </span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4 w-1/3">Módulo / Permiso</th>
                <th className="py-3.5 px-2 text-center">ADMIN</th>
                <th className="py-3.5 px-2 text-center">DOCTOR</th>
                <th className="py-3.5 px-2 text-center">BRIGADISTA</th>
                <th className="py-3.5 px-2 text-center">AUTHORITY</th>
                <th className="py-3.5 px-2 text-center">PATIENT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {ROLE_MATRIX.map((group, gIdx) => (
                <React.Fragment key={gIdx}>
                  <tr className="bg-slate-50 font-bold text-xs uppercase tracking-wider text-slate-500">
                    <td colSpan={6} className="py-2.5 px-4 bg-slate-50/90">
                      {group.category}
                    </td>
                  </tr>
                  {group.permissions.map((perm, pIdx) => (
                    <tr key={pIdx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800">{perm.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{perm.description}</p>
                      </td>
                      {[
                        UserRole.ADMIN,
                        UserRole.DOCTOR,
                        UserRole.BRIGADISTA,
                        UserRole.AUTORIDADES_DE_SALUD,
                        UserRole.PACIENTE,
                      ].map((roleKey) => {
                        const hasPerm = perm.roles.includes(roleKey);
                        return (
                          <td key={roleKey} className="py-3 px-2 text-center align-middle">
                            {hasPerm ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs shadow-xs">
                                ✓
                              </span>
                            ) : (
                              <span className="inline-block w-2 h-2 rounded-full bg-slate-200" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};