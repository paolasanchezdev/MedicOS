// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/jornada/components/SincronizacionJornadaCard.tsx
// DESCRIPCIÓN: Estado de conexión Offline First y sincronización de estación.
// =========================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Wifi, RefreshCw } from 'lucide-react';

interface SincronizacionJornadaCardProps {
  isOnline: boolean;
  pendientesCount: number;
  ultimaSincro: string;
}

export const SincronizacionJornadaCard: React.FC<SincronizacionJornadaCardProps> = ({
  isOnline,
  pendientesCount,
  ultimaSincro,
}) => {
  return (
    <div className="bg-medicos-surface border border-medicos-soft-border rounded-2xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-medicos-dark-blue uppercase tracking-wider flex items-center gap-1.5">
          <Wifi size={16} className="text-medicos-teal" />
          <span>Estado Offline First — Estación Local</span>
        </span>
        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
          isOnline ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
        }`}>
          {isOnline ? '🟢 Estación Conectada' : '🟡 Modo Local Offline'}
        </span>
      </div>

      <div className="p-4 bg-medicos-canvas border border-medicos-soft-border rounded-xl flex items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <p className="font-bold text-medicos-dark-blue">Registros pendientes en outbox: <strong className="text-medicos-teal">{pendientesCount}</strong></p>
          <p className="text-[11px] text-medicos-muted">Última sincronización con servidor central: {ultimaSincro}</p>
        </div>
        <Link
          to="/brigadista/sincronizacion/estado"
          className="px-3.5 py-2.5 bg-medicos-teal hover:bg-[#186a76] text-white font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 shrink-0"
        >
          <RefreshCw size={13} />
          <span>Ver Sincronización</span>
        </Link>
      </div>
    </div>
  );
};