// apps/web/src/portals/admin/pages/recursos/medicamentos/components/MedicamentosHeader.tsx
import React from 'react';
import { Plus, PackagePlus } from 'lucide-react';

interface MedicamentosHeaderProps {
  onNewResource?: () => void;
  onNewStockLot?: () => void;
}

export const MedicamentosHeader: React.FC<MedicamentosHeaderProps> = ({
  onNewResource,
  onNewStockLot,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Medicamentos e Insumos Clínicos
        </h1>
        <p className="text-sm text-slate-500">
          Catálogo maestro institucional y control de lotes con trazabilidad sanitaria y vencimiento.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onNewStockLot}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
        >
          <PackagePlus className="w-4 h-4 text-slate-500" />
          <span>Ingreso de Lote</span>
        </button>

        <button
          type="button"
          onClick={onNewResource}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Medicamento / Insumo</span>
        </button>
      </div>
    </div>
  );
};