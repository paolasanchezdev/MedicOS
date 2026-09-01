// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/actividad/components/ActividadTabla.tsx
// DESCRIPCIÓN: Vista tabular completa de actividades con estilo y encabezados Admin.
// =========================================================================

import React, { useState } from 'react';
import { Eye, MapPin, User, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  TipoActividadBadge,
  EstadoActividadBadge,
} from './EstadoActividadBadge';
import type { ActividadItemOperativa } from '../../../../../../modules/brigades';

interface ActividadTablaProps {
  actividades: ActividadItemOperativa[];
  onSeleccionarActividad: (actividad: ActividadItemOperativa) => void;
}

const ITEMS_PER_PAGE = 8;

export const ActividadTabla: React.FC<ActividadTablaProps> = ({
  actividades,
  onSeleccionarActividad,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.max(1, Math.ceil(actividades.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = actividades.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
          Todas las Actividades Registradas
        </h2>
        <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
          {actividades.length} {actividades.length === 1 ? 'Registro' : 'Registros'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-4 px-5">Hora / Fecha</th>
              <th className="py-4 px-5">Tipo de Actividad</th>
              <th className="py-4 px-5">Persona / Hogar</th>
              <th className="py-4 px-5">Comunidad / Territorio</th>
              <th className="py-4 px-5">Resultado</th>
              <th className="py-4 px-5">Estado</th>
              <th className="py-4 px-5 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 italic">
                  No se encontraron actividades registradas con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              currentItems.map((act) => (
                <tr
                  key={act.id}
                  onClick={() => onSeleccionarActividad(act)}
                  className="hover:bg-slate-50/80 transition-colors duration-150 cursor-pointer group/row"
                >
                  <td className="py-4 px-5 whitespace-nowrap">
                    <span className="font-mono font-bold text-[#2B7A78] block">
                      {act.hora}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {act.fecha}
                    </span>
                  </td>

                  <td className="py-4 px-5">
                    <TipoActividadBadge tipo={act.tipo} size="sm" />
                  </td>

                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-slate-900 leading-tight">
                        {act.sujeto}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-5 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#2B7A78] shrink-0" />
                      <span className="truncate">{act.comunidad}</span>
                    </div>
                  </td>

                  <td className="py-4 px-5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-slate-800 truncate">
                        {act.resultado}
                      </span>
                      {act.tieneRiesgo && (
                        <span title="Riesgo Detectado">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-5">
                    <EstadoActividadBadge estado={act.estado} size="sm" />
                  </td>

                  <td className="py-4 px-5 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSeleccionarActividad(act);
                      }}
                      className="p-2 text-slate-400 hover:text-[#2B7A78] hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                      title="Ver detalle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Mostrando {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, actividades.length)} de {actividades.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-slate-800">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};