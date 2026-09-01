// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/pendientes/components/AtencionesPendientesHeader.tsx
// DESCRIPCIÓN: Cabecera con título contextual, fecha de jornada y estado de conectividad en tiempo real.
// =========================================================================

import React from 'react';
import { Calendar, Wifi, WifiOff } from 'lucide-react';

interface AtencionesPendientesHeaderProps {
  isOnline: boolean;
}

export const AtencionesPendientesHeader: React.FC<AtencionesPendientesHeaderProps> = ({ isOnline }) => {
  const todayFormatted = new Date().toLocaleDateString('es-SV', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#1B5250] to-[#2B7A78] p-6 sm:p-8 text-white shadow-md">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase bg-white/10 text-teal-100 border border-white/15 backdrop-blur-md">
              Bandeja Operativa en Terreno
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Atenciones Pendientes
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 font-medium mt-1 max-w-xl leading-relaxed">
            Continúa registros clínicos incompletos y gestiona la sincronización con el servidor central.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-center flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold backdrop-blur-md">
            <Calendar className="w-3.5 h-3.5 text-teal-200" />
            <span>{todayFormatted}</span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border backdrop-blur-md shadow-2xs ${
              isOnline
                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-100'
                : 'bg-rose-500/20 border-rose-400/40 text-rose-100 animate-pulse'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-300" />
                <span>Conectado</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-rose-300" />
                <span>Sin conexión</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};