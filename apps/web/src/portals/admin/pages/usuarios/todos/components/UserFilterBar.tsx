// ARCHIVO: apps/web/src/portals/admin/pages/usuarios/todos/components/UserFilterBar.tsx
// DESCRIPCIÓN: Barra de búsqueda e inputs de filtrado para la tabla de usuarios.

import React from 'react';

interface UserFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedRoleFilter: string;
  setSelectedRoleFilter: (role: string) => void;
}

export const UserFilterBar: React.FC<UserFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedRoleFilter,
  setSelectedRoleFilter,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
      <div className="relative w-full sm:w-80">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 text-xs">
          🔍
        </span>
        <input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
        />
      </div>

      <select
        value={selectedRoleFilter}
        onChange={(e) => setSelectedRoleFilter(e.target.value)}
        className="w-full sm:w-52 px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs cursor-pointer"
      >
        <option value="ALL">Todos los roles</option>
        <option value="ADMIN">Administrador (ADMIN)</option>
        <option value="DOCTOR">Doctor (DOCTOR)</option>
        <option value="BRIGADISTA">Brigadista (BRIGADISTA)</option>
        <option value="PATIENT">Paciente (PATIENT)</option>
        <option value="AUTHORITY">Autoridad (AUTHORITY)</option>
        <option value="AUTORIDADES_DE_SALUD">Autoridad de Salud</option>
      </select>
    </div>
  );
};