// apps/web/src/portals/admin/pages/recursos/dotacion/components/DotacionHeader.tsx
import React from 'react';
import { Plus, ClipboardCheck } from 'lucide-react';

interface DotacionHeaderProps {
  onNewDotation?: () => void;
  onCloseLiquidation?: () => void;
}

export const DotacionHeader: React.FC<DotacionHeaderProps> = ({
  onNewDotation,
  onCloseLiquidation,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Dotación y Despacho a Brigadas
        </h1>
        <p className="text-sm text-slate-500">
          Asignación de kits de medicamentos por lote, instrumental médico y hardware para jornadas en campo.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCloseLiquidation}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
        >
          <ClipboardCheck className="w-4 h-4 text-slate-500" />
          <span>Registrar Liquidación</span>
        </button>

        <button
          type="button"
          onClick={onNewDotation}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Dotación / Despacho</span>
        </button>
      </div>
    </div>
  );
};