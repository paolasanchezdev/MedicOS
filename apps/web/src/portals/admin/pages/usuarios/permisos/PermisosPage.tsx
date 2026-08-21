// ARCHIVO: apps/web/src/portals/admin/pages/usuarios/permisos/PermisosPage.tsx
import React, { useState } from 'react';
import { ROLE_LABELS, ROLE_MATRIX, UserRole, type UserRoleType } from '@/core/permissions/roles';
import { UserPermissionOverrideModal } from '@/modules/users/components/UserPermissionOverrideModal';

interface UserAuditItem {
  id: string;
  name: string;
  email: string;
  role: UserRoleType;
  department: string;
}

const MOCK_USERS_AUDIT: UserAuditItem[] = [
  { id: '1', name: 'Dra. María Zelaya', email: 'maria.zelaya@medicos.sv', role: UserRole.DOCTOR, department: 'Medicina General' },
  { id: '2', name: 'Carlos Mendoza', email: 'carlos.mendoza@medicos.sv', role: UserRole.BRIGADISTA, department: 'Despliegue Territorial' },
  { id: '3', name: 'Lic. Ana Pineda', email: 'ana.pineda@minsal.gob.sv', role: UserRole.AUTORIDADES_DE_SALUD, department: 'MINSAL' },
  { id: '4', name: 'Administrador Central', email: 'admin@medicos.sv', role: UserRole.ADMIN, department: 'Tecnología y Sistemas' },
];

export const PermisosPage: React.FC = () => {
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>(MOCK_USERS_AUDIT[0].email);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentUser = MOCK_USERS_AUDIT.find((u) => u.email === selectedUserEmail) || MOCK_USERS_AUDIT[0];

  const handleSaveOverrides = (overrides: Record<string, boolean>) => {
    console.log('Guardando excepciones de permisos para:', currentUser.email, overrides);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Auditoría y Excepciones de Permisos
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervisa los accesos del personal y otorga permisos excepcionales por cuenta de usuario.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          ⚙️ Personalizar Accesos de este Usuario
        </button>
      </div>

      {/* Selector de Usuario */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-96">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Seleccionar Usuario a Auditar
          </label>
          <select
            value={selectedUserEmail}
            onChange={(e) => setSelectedUserEmail(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
          >
            {MOCK_USERS_AUDIT.map((u) => (
              <option key={u.id} value={u.email}>
                {u.name} — [{ROLE_LABELS[u.role]}]
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 bg-teal-50/60 border border-teal-100 px-4 py-3 rounded-xl w-full md:w-auto">
          <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">{currentUser.name}</div>
            <div className="text-[11px] text-teal-700 font-medium">
              Rol Base: <span className="font-bold">{ROLE_LABELS[currentUser.role]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Buscador de permisos */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <input
          type="text"
          placeholder="Buscar permisos en la cuenta..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
        />
      </div>

      {/* Listado de Permisos del Usuario */}
      <div className="space-y-4">
        {ROLE_MATRIX.map((group, idx) => {
          const validPermissions = group.permissions.filter((p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (validPermissions.length === 0) return null;

          return (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {group.category}
                </h3>
              </div>
              <div className="divide-y divide-slate-100">
                {validPermissions.map((perm, pIdx) => {
                  const hasAccess = perm.roles.includes(currentUser.role);
                  return (
                    <div key={pIdx} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/40">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-800">{perm.name}</div>
                        <div className="text-[11px] text-slate-500">{perm.description}</div>
                      </div>
                      <div>
                        {hasAccess ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            ✓ Permitido por Rol
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-400 border border-slate-200">
                            ✕ Denegado
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Excepciones ubicado en modules/users/components */}
      <UserPermissionOverrideModal
        userName={currentUser.name}
        userEmail={currentUser.email}
        baseRole={currentUser.role}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveOverrides}
      />
    </div>
  );
};