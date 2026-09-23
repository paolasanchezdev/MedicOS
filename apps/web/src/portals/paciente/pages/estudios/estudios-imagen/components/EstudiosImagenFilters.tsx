// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/estudios/estudios-imagen/components/EstudiosImagenFilters.tsx
// DESCRIPCIÓN: Barra compacta de búsqueda y filtros para estudios de imagen.
// =========================================================================

import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface EstudiosImagenFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  type: string;
  onTypeChange: (val: string) => void;
  sort: 'recent' | 'oldest' | 'az';
  onSortChange: (val: 'recent' | 'oldest' | 'az') => void;
}

export const EstudiosImagenFilters: React.FC<EstudiosImagenFiltersProps> = ({
  search,
  onSearchChange,
  type,
  onTypeChange,
  sort,
  onSortChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-2.5 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 select-none">
      {/* Buscador */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar estudio (ej. radiografía de tórax, ultrasonido, rodilla)..."
          className="w-full pl-9.5 pr-8 py-2 bg-slate-50/70 hover:bg-slate-100/60 focus:bg-white border border-slate-200/80 focus:border-medicos-teal rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Selectores */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-700 outline-none focus:border-medicos-teal cursor-pointer"
          >
            <option value="ALL">Todas las modalidades</option>
            <option value="XRAY">Radiografía</option>
            <option value="ULTRASOUND">Ultrasonido / Ecografía</option>
            <option value="TOMOGRAPHY">Tomografía (TAC)</option>
            <option value="RESONANCE">Resonancia Magnética</option>
            <option value="MAMMOGRAPHY">Mamografía</option>
            <option value="DENSITOMETRY">Densitometría</option>
            <option value="OTHER">Otros</option>
          </select>
        </div>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as 'recent' | 'oldest' | 'az')}
          className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-700 outline-none focus:border-medicos-teal cursor-pointer"
        >
          <option value="recent">Más recientes</option>
          <option value="oldest">Más antiguos</option>
          <option value="az">A - Z</option>
        </select>
      </div>
    </div>
  );
};

export default EstudiosImagenFilters;