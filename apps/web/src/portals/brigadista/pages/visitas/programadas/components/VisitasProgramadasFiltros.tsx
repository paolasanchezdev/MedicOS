// =========================================================================
// ARCHIVO: VisitasProgramadasFiltros.tsx
// DESCRIPCIÓN: Filtros de la agenda operativa de visitas domiciliarias.
// =========================================================================

import React from 'react';
import { Search, X } from 'lucide-react';

interface VisitasProgramadasFiltrosProps {
  filtroTexto: string;
  setFiltroTexto: (val: string) => void;
  filtroEstado: string;
  setFiltroEstado: (val: string) => void;
  filtroMotivo: string;
  setFiltroMotivo: (val: string) => void;
  filtroTemporalidad: string;
  setFiltroTemporalidad: (val: string) => void;
  onLimpiar: () => void;
}

export const VisitasProgramadasFiltros: React.FC<VisitasProgramadasFiltrosProps> = ({
  filtroTexto,
  setFiltroTexto,
  filtroEstado,
  setFiltroEstado,
  filtroMotivo,
  setFiltroMotivo,
  filtroTemporalidad,
  setFiltroTemporalidad,
  onLimpiar,
}) => {
  const hayFiltros =
    filtroTexto.trim().length > 0 ||
    filtroEstado !== 'TODOS' ||
    filtroMotivo !== 'TODOS' ||
    filtroTemporalidad !== 'TODOS';

  return (
    <div className="p-3.5 rounded-2xl bg-white border border-[#D3E8EC] shadow-2xs space-y-2.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
        <div className="relative sm:col-span-2">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            placeholder="Buscar por paciente, DUI, expediente o comunidad..."
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A] text-slate-800"
          />
        </div>

        <select
          value={filtroMotivo}
          onChange={(e) => setFiltroMotivo(e.target.value)}
          className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A] text-slate-700 font-medium"
        >
          <option value="TODOS">Todos los Motivos</option>
          <option value="CONTROL_SEGUIMIENTO">Seguimiento de Paciente</option>
          <option value="MATERNO_INFANTIL">Control Materno-Infantil</option>
          <option value="SEGUIMIENTO_NUTRICIONAL">Seguimiento Nutricional</option>
          <option value="ADHERENCIA_TRATAMIENTO">Adherencia a Tratamiento</option>
          <option value="VERIFICACION_ENTORNO">Verificación de Condiciones</option>
          <option value="SEGUIMIENTO_REFERENCIA">Seguimiento de Referencia</option>
          <option value="EDUCACION_SANITARIA">Educación Sanitaria</option>
        </select>

        <div className="flex items-center gap-1.5">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="flex-1 px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A] text-slate-700 font-medium"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="SCHEDULED">Programada</option>
            <option value="IN_PROGRESS">En Curso</option>
            <option value="REPROGRAMMED">Reprogramada</option>
            <option value="NOT_LOCATED">No Localizado</option>
            <option value="COMPLETED">Completada</option>
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

      <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 text-[11px] font-bold">
        <span className="text-slate-400 mr-1 uppercase text-[10px]">Ver:</span>
        {[
          { id: 'TODOS', label: 'Todas' },
          { id: 'HOY', label: 'Hoy' },
          { id: 'PROXIMAS', label: 'Próximas' },
          { id: 'VENCIDAS', label: 'Vencidas' },
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