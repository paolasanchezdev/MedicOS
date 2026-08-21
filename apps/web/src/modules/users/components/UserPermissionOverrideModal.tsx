// ARCHIVO: apps/web/src/portals/admin/pages/usuar
import React, { useState } from 'react';
import { ROLE_MATRIX, ROLE_LABELS, type UserRoleType } from '@/core/permissions/roles';

interface UserPermissionOverrideModalProps {
  userName: string;
  userEmail: string;
  baseRole: UserRoleType;
  isOpen: boolean;
  onClose: () => void;
  onSave: (overrides: Record<string, boolean>) => void;
}

export const UserPermissionOverrideModal: React.FC<UserPermissionOverrideModalProps> = ({
  userName,
  userEmail,
  baseRole,
  isOpen,
  onClose,
  onSave,
}) => {
  // Estado local para los overrides personalizados del usuario (permisoId -> true/false/undefined)
  const [overrides, setOverrides] = useState<Record<string, boolean>>({
    'view_epidemiology_dashboard': true, // Ejemplo: Se le dio acceso extra a este doctor
  });

  if (!isOpen) return null;

  const handleToggle = (permissionId: string, defaultHasAccess: boolean) => {
    setOverrides((prev) => {
      const currentVal = prev[permissionId] ?? defaultHasAccess;
      return {
        ...prev,
        [permissionId]: !currentVal,
      };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Cabecera del Modal */}
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Permisos Personalizados: {userName}
            </h2>
            <p className="text-[11px] text-slate-500">
              {userEmail} • Rol Base: <span className="font-semibold text-teal-700">{ROLE_LABELS[baseRole]}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Cuerpo con la Matriz y Switches */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 divide-y divide-slate-100">
          <div className="text-xs text-slate-600 bg-amber-50 border border-amber-200/60 p-3.5 rounded-xl">
            💡 <strong>Nota de Seguridad:</strong> Los permisos marcados con verde provienen del rol base del usuario. Puedes activar o desactivar capacidades específicas para este usuario sin modificar al resto del equipo.
          </div>

          {ROLE_MATRIX.map((group, gIdx) => (
            <div key={gIdx} className="pt-4 first:pt-0 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {group.category}
              </h3>

              <div className="grid grid-cols-1 gap-2.5">
                {group.permissions.map((perm, pIdx) => {
                  const permKey = perm.name.toLowerCase().replace(/\s+/g, '_');
                  const roleHasAccess = perm.roles.includes(baseRole);
                  const isOverridden = overrides[permKey] !== undefined;
                  const finalAccess = isOverridden ? overrides[permKey] : roleHasAccess;

                  return (
                    <div
                      key={pIdx}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/60 bg-slate-50/40 hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="space-y-0.5 pr-4">
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          {perm.name}
                          {isOverridden && (
                            <span className="text-[9px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                              Personalizado (Excepción)
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-normal">
                          {perm.description}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[11px] font-bold ${finalAccess ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {finalAccess ? 'Permitido' : 'Denegado'}
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => handleToggle(permKey, roleHasAccess)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            finalAccess ? 'bg-teal-600' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                              finalAccess ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer del Modal */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onSave(overrides);
              onClose();
            }}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            Guardar Excepciones
          </button>
        </div>

      </div>
    </div>
  );
};