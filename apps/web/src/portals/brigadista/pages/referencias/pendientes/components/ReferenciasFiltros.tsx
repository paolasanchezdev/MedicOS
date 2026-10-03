// =========================================================================
// ARCHIVO: ReferenciasFiltros.tsx
// DESCRIPCIÓN: Barra de filtros para la bandeja de referencias F-01.
// =========================================================================

import React from 'react';
import { Search, X } from 'lucide-react';
import type { Establishment } from '../../../../../../modules/establishments/types/establishment.types';

interface ReferenciasFiltrosProps {
  filtroTexto: string;
  setFiltroTexto: (val: string) => void;
  filtroEstado: string;
  setFiltroEstado: (val: string) => void;
  filtroPrioridad: string;
  setFiltroPrioridad: (val: string) => void;
  filtroDestino: string;
  setFiltroDestino: (val: string) => void;
  establecimientos: Establishment[];
  onLimpiar: () => void;
}

export const ReferenciasFiltros: React.FC<ReferenciasFiltrosProps> = ({
  filtroTexto,
  setFiltroTexto,
  filtroEstado,
  setFiltroEstado,
  filtroPrioridad,
  setFiltroPrioridad,
  filtroDestino,
  setFiltroDestino,
  establecimientos,
  onLimpiar,
}) => {
  const hayFiltros =
    filtroTexto.trim().length > 0 ||
    filtroEstado !== 'TODOS' ||
    filtroPrioridad !== 'TODOS' ||
    filtroDestino !== 'TODOS';

  return (
    <div className="p-3.5 rounded-2xl bg-white border border-[#D3E8EC] shadow-2xs space-y-2.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
        <div className="relative sm:col-span-2">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            placeholder="Buscar por paciente, DUI, folio F-01, motivo o destino..."
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A] text-slate-800"
          />
        </div>

        <select
          value={filtroDestino}
          onChange={(e) => setFiltroDestino(e.target.value)}
          className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A] text-slate-700 font-medium"
        >
          <option value="TODOS">Todos los Destinos</option>
          {establecimientos.map((est) => (
            <option key={est.id} value={est.id}>
              {est.name} ({est.municipality})
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1.5">
          <select
            value={filtroPrioridad}
            onChange={(e) => setFiltroPrioridad(e.target.value)}
            className="flex-1 px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A] text-slate-700 font-medium"
          >
            <option value="TODOS">Todas las Prioridades</option>
            <option value="LOW">Normal (Baja)</option>
            <option value="MEDIUM">Prioritaria (Media)</option>
            <option value="HIGH">Alta</option>
            <option value="URGENT">Urgente</option>
          </select>

          {hayFiltros && (
            <button
              type="button"
              onClick={onLimpiar}
              title="Limpiar filtros"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 text-[11px] font-bold flex-wrap">
        <span className="text-slate-400 mr-1 uppercase text-[10px]">Estado:</span>
        {[
          { id: 'TODOS', label: 'Todas' },
          { id: 'PENDING', label: 'Pendientes' },
          { id: 'SENT', label: 'Enviadas' },
          { id: 'IN_FOLLOW_UP', label: 'En Seguimiento' },
          { id: 'ATTENDED', label: 'Completadas' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFiltroEstado(t.id)}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              filtroEstado === t.id
                ? 'bg-[#166E7A] text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
};