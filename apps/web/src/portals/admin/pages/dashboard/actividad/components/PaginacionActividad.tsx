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
    <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 rounded-b-xl text-xs">
      <span className="text-gray-500">
        Página <span className="font-bold text-gray-900">{currentPage}</span> de{' '}
        <span className="font-bold text-gray-900">{totalPages}</span>
      </span>

      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Anterior</span>
        </button>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        >
          <span>Siguiente</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};