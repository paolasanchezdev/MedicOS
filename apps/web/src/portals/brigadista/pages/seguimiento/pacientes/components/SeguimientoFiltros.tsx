// =========================================================================
// ARCHIVO: SeguimientoFiltros.tsx
// DESCRIPCIÓN: Barra de filtros de alta densidad para la bandeja de continuidad.
// =========================================================================

import React from 'react';
import { Search, X } from 'lucide-react';

interface SeguimientoFiltrosProps {
  filtroTexto: string;
  setFiltroTexto: (val: string) => void;
  filtroEstado: string;
  setFiltroEstado: (val: string) => void;
  filtroTipo: string;
  setFiltroTipo: (val: string) => void;
  filtroPrioridad: string;
  setFiltroPrioridad: (val: string) => void;
  filtroTemporalidad: string;
  setFiltroTemporalidad: (val: string) => void;
  onLimpiar: () => void;
}

export const SeguimientoFiltros: React.FC<SeguimientoFiltrosProps> = ({
  filtroTexto,
  setFiltroTexto,
  filtroEstado,
  setFiltroEstado,
  filtroTipo,
  setFiltroTipo,
  filtroPrioridad,
  setFiltroPrioridad,
  filtroTemporalidad,
  setFiltroTemporalidad,
  onLimpiar,
}) => {
  const hayFiltros =
    filtroTexto.trim().length > 0 ||
    filtroEstado !== 'TODOS' ||
    filtroTipo !== 'TODOS' ||
    filtroPrioridad !== 'TODOS' ||
    filtroTemporalidad !== 'TODOS';

  return (
    <div className="p-3.5 rounded-2xl bg-white border border-[#D3E8EC] shadow-2xs space-y-2.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
        {/* Búsqueda */}
        <div className="relative sm:col-span-2">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            placeholder="Buscar por paciente, DUI, expediente o motivo..."
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A] text-slate-800"
          />
        </div>

        {/* Tipo */}
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A] text-slate-700 font-medium"
        >
          <option value="TODOS">Todos los Tipos</option>
          <option value="CONTROL_MATERNO">Control Materno</option>
          <option value="CONTROL_INFANTIL">Control Infantil</option>
          <option value="SEGUIMIENTO_NUTRICIONAL">Seguimiento Nutricional</option>
          <option value="CONTROL_CLINICO">Control Clínico</option>
          <option value="VISITA_DOMICILIARIA">Visita Domiciliaria</option>
          <option value="SEGUIMIENTO_REFERENCIA">Seguimiento Referencia</option>
          <option value="TRATAMIENTO_PENDIENTE">Tratamiento Pendiente</option>
        </select>

        {/* Estado */}
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A] text-slate-700 font-medium"
        >
          <option value="TODOS">Todos los Estados</option>
          <option value="ACTIVO">Activo</option>
          <option value="EN_PROCESO">En Proceso</option>
          <option value="REPROGRAMADO">Reprogramado</option>
          <option value="NO_LOCALIZADO">No Localizado</option>
          <option value="REFERIDO">Referido</option>
          <option value="COMPLETADO">Completado</option>
        </select>

        {/* Prioridad */}
        <div className="flex items-center gap-1.5">
          <select
            value={filtroPrioridad}
            onChange={(e) => setFiltroPrioridad(e.target.value)}
            className="flex-1 px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A] text-slate-700 font-medium"
          >
            <option value="TODOS">Todas Prioridades</option>
            <option value="ALTA">Prioridad Alta</option>
            <option value="NORMAL">Prioridad Normal</option>
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

      {/* Tabs rápidos de temporalidad */}
      <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 text-[11px] font-bold">
        <span className="text-slate-400 mr-1 uppercase text-[10px]">Ver:</span>
        {[
          { id: 'TODOS', label: 'Todos' },
          { id: 'HOY', label: 'Para Hoy' },
          { id: 'VENCIDOS', label: 'Vencidos' },
          { id: 'PROXIMOS', label: 'Próximos' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFiltroTemporalidad(t.id)}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              filtroTemporalidad === t.id
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