// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/pacientes/components/PacientesBrigadaFiltros.tsx
// DESCRIPCIÓN: Búsqueda y filtrado por pestañas en el contexto de la brigada.
// =========================================================================

import React from 'react';
import { Search, X } from 'lucide-react';

export type FiltroEstadoPaciente = 'TODOS' | 'PENDIENTES' | 'EVALUADOS' | 'SEGUIMIENTO' | 'REFERIDOS';

interface PacientesBrigadaFiltrosProps {
  busqueda: string;
  setBusqueda: (val: string) => void;
  filtroEstado: FiltroEstadoPaciente;
  setFiltroEstado: (val: FiltroEstadoPaciente) => void;
  onLimpiar: () => void;
}

export const PacientesBrigadaFiltros: React.FC<PacientesBrigadaFiltrosProps> = ({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  onLimpiar,
}) => {
  const tieneFiltros = Boolean(busqueda || filtroEstado !== 'TODOS');

  const pestañas: { id: FiltroEstadoPaciente; label: string }[] = [
    { id: 'TODOS', label: 'Todos' },
    { id: 'PENDIENTES', label: 'Pendientes' },
    { id: 'EVALUADOS', label: 'Evaluados' },
    { id: 'SEGUIMIENTO', label: 'Seguimiento' },
    { id: 'REFERIDOS', label: 'Referidos' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Input de Búsqueda contextual */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar paciente dentro de esta brigada por nombre o DUI..."
            className="w-full bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200/80 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78] transition-all"
          />
        </div>

        {/* Botón de limpiar si hay filtros */}
        {tieneFiltros && (
          <button
            type="button"
            onClick={onLimpiar}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all cursor-pointer shrink-0 self-start md:self-center"
          >
            <X className="w-3.5 h-3.5" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {/* Pestañas de Estado Operacional */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-100 scrollbar-none">
        {pestañas.map((p) => {
          const activo = filtroEstado === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setFiltroEstado(p.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activo
                  ? 'bg-[#2B7A78] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};