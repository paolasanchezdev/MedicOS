import React from 'react';
import { Search, Filter } from 'lucide-react';

interface UserStatusFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatusFilter: string;
  onStatusFilterChange: (value: string) => void;
  selectedRoleFilter: string;
  onRoleFilterChange: (value: string) => void;
}

export const UserStatusFilters: React.FC<UserStatusFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedStatusFilter,
  onStatusFilterChange,
  selectedRoleFilter,
  onRoleFilterChange,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nombre o correo..."
          className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-medicos-primary) focus:border-transparent"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedStatusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-(--color-medicos-primary)"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="ACTIVE">Solo Activos</option>
            <option value="INACTIVE">Solo Inactivos</option>
            <option value="SUSPENDED">Solo Suspendidos</option>
          </select>
        </div>

        <select
          value={selectedRoleFilter}
          onChange={(e) => onRoleFilterChange(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-(--color-medicos-primary)"
        >
          <option value="ALL">Todos los Roles</option>
          <option value="ADMIN">Administrador</option>
          <option value="AUTHORITY">Autoridad de Salud</option>
          <option value="DOCTOR">Médico</option>
          <option value="BRIGADISTA">Brigadista</option>
          <option value="PATIENT">Paciente</option>
        </select>
      </div>
    </div>
  );
};