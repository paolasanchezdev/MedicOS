// apps/web/src/portals/admin/pages/recursos/tecnologia/components/DispositivosHeader.tsx
import React from 'react';
import { Plus, Radio } from 'lucide-react';

interface DispositivosHeaderProps {
  onNewDevice?: () => void;
  onPingAll?: () => void;
}

export const DispositivosHeader: React.FC<DispositivosHeaderProps> = ({
  onNewDevice,
  onPingAll,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Dispositivos Tecnológicos y Hardware
        </h1>
        <p className="text-sm text-slate-500">
          Monitoreo de estaciones Raspberry Pi, laptops clínicas, tablets y terminales de sincronización offline.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onPingAll}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
        >
          <Radio className="w-4 h-4 text-slate-500" />
          <span>Verificar Conectividad</span>
        </button>

        <button
          type="button"
          onClick={onNewDevice}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Dispositivo</span>
        </button>
      </div>
    </div>
  );
};