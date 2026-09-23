// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/documentos/constancias/components/ConstanciasFilters.tsx
// DESCRIPCIÓN: Barra de búsqueda, filtros por tipo y selector de vista (Grid/Tabla).
// =========================================================================

import React from 'react';
import { Search, LayoutGrid, TableProperties } from 'lucide-react';

interface ConstanciasFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
}

export const ConstanciasFilters: React.FC<ConstanciasFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  viewMode,
  onViewModeChange,
}) => {
  const filterOptions = [
    { key: 'ALL', label: 'Todos los Documentos' },
    { key: 'MEDICAL_ATTENTION', label: 'Atención Médica' },
    { key: 'PRENATAL_CONTROL', label: 'Control Prenatal' },
    { key: 'CONSULTATION', label: 'Consulta' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3 select-none">
      
      {/* Buscador de documentos */}
      <div className="relative w-full md:w-88">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por folio (ej. CM-2026), médico o centro..."
          className="w-full pl-10 pr-4 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/30 transition"
        />
      </div>

      {/* Filtros por tipo y conmutador de vista */}
      <div className="flex items-center justify-between w-full md:w-auto gap-3">
        
        {/* Pills de categorías */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {filterOptions.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTypeChange(tab.key)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer shrink-0 ${
                selectedType === tab.key
                  ? 'bg-[#2B7A78] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conmutador Grid / Tabla */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/70 shrink-0">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            title="Vista de Fichas de Documento"
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-[#2B7A78] shadow-xs'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            title="Vista de Libro de Folios"
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-[#2B7A78] shadow-xs'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <TableProperties className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};

export default ConstanciasFilters;