// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/notificaciones/centro/components/NotificacionesFilters.tsx
// DESCRIPCIÓN: Píldoras de filtrado por categoría clínica y estado de lectura.
// =========================================================================

import React from 'react';
import { Filter } from 'lucide-react';

interface FilterTabOption {
  key: string;
  label: string;
}

const CATEGORY_TABS: FilterTabOption[] = [
  { key: 'TODAS', label: 'Todas' },
  { key: 'NO_LEIDAS', label: 'No leídas' },
  { key: 'citas', label: 'Citas' },
  { key: 'atencion', label: 'Atención Médica' },
  { key: 'medicamentos', label: 'Medicamentos' },
  { key: 'salud_materna', label: 'Salud Materna' },
  { key: 'resultados', label: 'Resultados' },
  { key: 'documentos', label: 'Documentos' },
  { key: 'mensajes', label: 'Mensajes Médicos' },
];

interface NotificacionesFiltersProps {
  activeCategory: string;
  onCategoryChange: (categoryKey: string) => void;
}

export const NotificacionesFilters: React.FC<NotificacionesFiltersProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
      <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1 hidden sm:block" />
      {CATEGORY_TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onCategoryChange(tab.key)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
            activeCategory === tab.key
              ? 'bg-[#1c5752] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default NotificacionesFilters;