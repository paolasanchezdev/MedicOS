// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/historial/components/HistorialAtencionesTabla.tsx
// DESCRIPCIÓN: Contenedor responsivo de atenciones con separación de vista
//              tabla (escritorio) y vista tarjetas (móvil) con paginación.
// =========================================================================

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AttentionHistoryItem } from '../../../../../../modules/atencion';
import { HistorialAtencionRow, HistorialAtencionCard } from './HistorialAtencionRow';

interface HistorialAtencionesTablaProps {
  items: AttentionHistoryItem[];
  total: number;
  currentPage: number;
  limit: number;
  onPageChange: (page: number) => void;
  onSelectAttention: (item: AttentionHistoryItem) => void;
}

export const HistorialAtencionesTabla: React.FC<HistorialAtencionesTablaProps> = ({
  items,
  total,
  currentPage,
  limit,
  onPageChange,
  onSelectAttention,
}) => {
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden space-y-4">
      {/* 1. Vista Tabla para Pantallas Medianas y Grandes (md en adelante) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Paciente</th>
              <th className="py-3.5 px-4">Fecha / Hora</th>
              <th className="py-3.5 px-4">Motivo</th>
              <th className="py-3.5 px-4">Jornada</th>
              <th className="py-3.5 px-4">Estado</th>
              <th className="py-3.5 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {items.map((attention) => (
              <HistorialAtencionRow
                key={attention.id}
                attention={attention}
                onSelect={onSelectAttention}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* 2. Vista Tarjetas para Móviles (md:hidden) */}
      <div className="md:hidden p-4 space-y-3">
        {items.map((attention) => (
          <HistorialAtencionCard
            key={attention.id}
            attention={attention}
            onSelect={onSelectAttention}
          />
        ))}
      </div>

      {/* 3. Paginación Inferior Compartida */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>
            Mostrando página {currentPage} de {totalPages} ({total} atenciones)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-bold text-slate-800 bg-slate-100 rounded-lg">
              {currentPage}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};