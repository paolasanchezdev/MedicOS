// apps/web/src/portals/admin/pages/brigadas/todas/components/BrigadasHeader.tsx
import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';

export interface BrigadasHeaderProps {
  onNewBrigade: () => void;
  onRefresh: () => void;
}

export const BrigadasHeader: React.FC<BrigadasHeaderProps> = ({
  onNewBrigade,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Expediciones y Brigadas Médicas</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Gestión territorial, dotación médica y despliegue operativo en campo
        </p>
      </div>
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onRefresh}
          className="p-2 text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
          title="Recargar datos de campo"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onNewBrigade}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Brigada
        </button>
      </div>
    </div>
  );
};

export default BrigadasHeader;