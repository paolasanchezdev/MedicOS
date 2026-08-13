// =========================================================================
// ARCHIVO: apps/web/src/portals/admin/pages/dashboard/actividad/components/FiltrosActividad.tsx
// DESCRIPCIÓN: Panel de filtros combinables para la bitácora de actividad.
// =========================================================================

import React from 'react';
import { Filter, X } from 'lucide-react';
import type { AuditLogFilters } from '../../../../../../modules/admin/types/admin-dashboard.types';

interface FiltrosActividadProps {
  filters: AuditLogFilters;
  onChange: (updated: AuditLogFilters) => void;
  onReset: () => void;
}

export const FiltrosActividad: React.FC<FiltrosActividadProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 border-b border-slate-100 pb-2.5">
        <span className="flex items-center gap-1.5 text-slate-800">
          <Filter className="w-3.5 h-3.5 text-emerald-600" />
          <span>Filtros de Búsqueda</span>
        </span>
        <button
          onClick={onReset}
          className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors font-medium"
        >
          <X className="w-3 h-3" />
          <span>Limpiar filtros</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block text-slate-500 font-medium mb-1">Módulo / Entidad</label>
          <select
            value={filters.entity || ''}
            onChange={(e) => onChange({ ...filters, entity: e.target.value || undefined, page: 1 })}
            className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-2xs"
          >
            <option value="">Todas las entidades</option>
            <option value="User">Usuario (User)</option>
            <option value="Brigade">Brigada (Brigade)</option>
            <option value="Patient">Paciente (Patient)</option>
            <option value="Consultation">Consulta (Consultation)</option>
            <option value="Device">Dispositivo (Device)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-500 font-medium mb-1">Rol del Actor</label>
          <select
            value={filters.role || ''}
            onChange={(e) =>
              onChange({ ...filters, role: e.target.value || undefined, page: 1 })
            }
            className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-2xs"
          >
            <option value="">Todos los roles</option>
            <option value="ADMIN">ADMIN</option>
            <option value="DOCTOR">DOCTOR</option>
            <option value="BRIGADISTA">BRIGADISTA</option>
            <option value="AUTHORITY">AUTHORITY</option>
            <option value="PATIENT">PATIENT</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-500 font-medium mb-1">Fecha Inicial</label>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => onChange({ ...filters, startDate: e.target.value || undefined, page: 1 })}
            className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-slate-500 font-medium mb-1">Fecha Final</label>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => onChange({ ...filters, endDate: e.target.value || undefined, page: 1 })}
            className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-2xs"
          />
        </div>
      </div>
    </div>
  );
};