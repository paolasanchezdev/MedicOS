import React from 'react';
import { MapPin, Bell } from 'lucide-react';
import { useBrigade } from '@modules/brigades/hooks/useBrigade';
import { SystemStatusBadge } from './SystemStatusBadge';

export const BrigadistHeader: React.FC = () => {
  const { brigade } = useBrigade();

  const hasBrigadeInfo = Boolean(brigade.community && brigade.municipality);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 lg:px-6 py-3 w-full">
      <div className="flex items-center justify-between w-full">
        {/* Identidad del Portal */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black text-lg shadow-xs">
            M
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-none">
              MedicOS <span className="text-teal-700 font-normal">| Brigadista</span>
            </h1>
            <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
              {hasBrigadeInfo
                ? `${brigade.community}, ${brigade.municipality}`
                : 'Sin jornada activa seleccionada'}
            </p>
          </div>
        </div>

        {/* Estado del Sistema y Perfil */}
        <div className="flex items-center gap-3">
          <SystemStatusBadge />

          <button
            type="button"
            aria-label="Notificaciones"
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-600 rounded-full" />
          </button>

          <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              PR
            </div>
            <span className="text-xs font-semibold text-slate-700">Paola R.</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BrigadistHeader;