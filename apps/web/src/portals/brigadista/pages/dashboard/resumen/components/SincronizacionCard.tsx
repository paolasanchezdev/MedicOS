// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/resumen/components/SincronizacionCard.tsx
// DESCRIPCIÓN: Estado Offline First y cola Transactional Outbox de la estación.
// =========================================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, WifiOff, RefreshCw, ChevronRight } from 'lucide-react';

interface SincronizacionCardProps {
  isOnline?: boolean;
  pendientesOutbox?: number;
  ultimaSincro?: string;
}

export const SincronizacionCard: React.FC<SincronizacionCardProps> = ({
  isOnline = true,
  pendientesOutbox = 0,
  ultimaSincro = 'Al día',
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-xs">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Offline First
              </p>
              <h3 className="text-sm font-bold text-slate-900">
                Sincronización de Estación
              </h3>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              isOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                : 'bg-amber-50 text-amber-700 border-amber-200/60'
            }`}
          >
            {isOnline ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <Wifi className="w-3 h-3" />
                <span>Conectada</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <WifiOff className="w-3 h-3" />
                <span>Modo Local</span>
              </>
            )}
          </span>
        </div>

        <div className="mt-4 p-4 bg-slate-50/70 border border-slate-100 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Registros en Transactional Outbox:</span>
            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
              {pendientesOutbox}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Última sincronización con servidor:</span>
            <span className="font-semibold text-slate-700">{ultimaSincro}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate('/brigadista/sincronizacion/estado')}
        className="pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-[#2B7A78] hover:text-[#236866] transition-colors group/btn cursor-pointer"
      >
        <span>Centro de sincronización</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
      </button>
    </div>
  );
};