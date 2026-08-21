// ARCHIVO: apps/web/src/portals/admin/pages/usuarios/todos/components/UserHeaderSection.tsx
// DESCRIPCIÓN: Encabezado principal de la sección de administración de usuarios.

import React from 'react';

interface UserHeaderSectionProps {
  totalCount: number;
  onOpenCreate: () => void;
}

export const UserHeaderSection: React.FC<UserHeaderSectionProps> = ({
  totalCount,
  onOpenCreate,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Gestión de Usuarios
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Administra los accesos, credenciales y roles del personal en la plataforma MedicOS.
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100">
          Total: {totalCount} usuario{totalCount !== 1 ? 's' : ''}
        </div>

        <button
          onClick={onOpenCreate}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
        >
          <span>+</span>
          <span>Nuevo Usuario</span>
        </button>
      </div>
    </div>
  );
};