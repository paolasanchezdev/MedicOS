// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/dashboard/actividad/components/PaginacionActividad.tsx
// DESCRIPCIÓN: Paginador para la tabla de actividad del médico.
// =========================================================================

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginacionActividadProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginacionActividad: React.FC<PaginacionActividadProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="p-4 border-t border-slate-200/80 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
      <span>
        Página <strong className="text-slate-800 font-bold">{currentPage}</strong> de{' '}
        <strong className="text-slate-800 font-bold">{totalPages}</strong>
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-40 transition-colors"
          title="Página anterior"
        >
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        </button>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-40 transition-colors"
          title="Página siguiente"
        >
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>
      </div>
    </div>
  );
};