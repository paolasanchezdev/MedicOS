// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/resumen/components/SincronizacionBrigadaCard.tsx
// DESCRIPCIÓN: Tarjeta de estado Offline First y sincronización.
// =========================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Wifi, RefreshCw } from 'lucide-react';

interface SincronizacionBrigadaCardProps {
  isOnline: boolean;
  pendientesCount: number;
  ultimaSincro: string;
}

export const SincronizacionBrigadaCard: React.FC<SincronizacionBrigadaCardProps> = ({
  isOnline,
  pendientesCount,
  ultimaSincro,
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Wifi size={15} className="text-[#0e7490]" />
          <span>Estado de Sincronización Offline</span>
        </span>
        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
          isOnline ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
        }`}>
          {isOnline ? '🟢 Conectado' : '🟡 Modo Local'}
        </span>
      </div>

      <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <p className="font-bold text-slate-800">Registros pendientes de envío: <strong className="text-teal-700">{pendientesCount}</strong></p>
          <p className="text-[11px] text-slate-500">Última sincronización: {ultimaSincro}</p>
        </div>
        <Link
          to="/brigadista/sincronizacion/estado"
          className="px-3 py-2 bg-[#0e7490] hover:bg-[#0891b2] text-white font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1 shrink-0"
        >
          <RefreshCw size={12} />
          <span>Gestionar</span>
        </Link>
      </div>
    </div>
  );
};