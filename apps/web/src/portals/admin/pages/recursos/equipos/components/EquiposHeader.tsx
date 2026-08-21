// apps/web/src/portals/admin/pages/recursos/equipos/components/EquiposHeader.tsx
import React from 'react';
import { Plus } from 'lucide-react';

interface EquiposHeaderProps {
  onNewEquipment?: () => void;
}

export const EquiposHeader: React.FC<EquiposHeaderProps> = ({ onNewEquipment }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Equipamiento e Instrumental Médico
        </h1>
        <p className="text-sm text-slate-500">
          Control individual de instrumental clínico reutilizable, números de serie y estado operativo.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onNewEquipment}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Equipo Médico</span>
        </button>
      </div>
    </div>
  );
};