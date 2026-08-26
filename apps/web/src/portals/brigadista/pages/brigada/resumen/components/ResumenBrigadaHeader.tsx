// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/resumen/components/ResumenBrigadaHeader.tsx
// DESCRIPCIÓN: Encabezado ejecutivo optimizado con clases semánticas de Tailwind del Design System.
// =========================================================================

import React from 'react';
import { Calendar, Clock, MapPin, RefreshCw, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ResumenBrigadaHeaderProps {
  nombreBrigada: string;
  comunidad: string;
  fecha: string;
  estado: 'ACTIVA' | 'EN_PAUSA' | 'FINALIZADA';
  horaInicio: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const ResumenBrigadaHeader: React.FC<ResumenBrigadaHeaderProps> = ({
  nombreBrigada,
  comunidad,
  fecha,
  estado,
  horaInicio,
  onRefresh,
  isRefreshing,
}) => {
  const estadoConfig = {
    ACTIVA: {
      label: 'Jornada Activa',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      dotClass: 'bg-emerald-500 animate-pulse',
    },
    EN_PAUSA: {
      label: 'Jornada en Pausa',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/80',
      dotClass: 'bg-amber-500',
    },
    FINALIZADA: {
      label: 'Jornada Finalizada',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200/80',
      dotClass: 'bg-slate-400',
    },
  };

  const currentStatus = estadoConfig[estado] || estadoConfig.ACTIVA;

  return (
    <div className="bg-medicos-surface border border-medicos-soft-border rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      {/* Barra lateral institucional */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-medicos-teal" />

      <div className="space-y-3 pl-2 sm:pl-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className={`px-3 py-1 border text-xs font-semibold rounded-lg flex items-center gap-1.5 ${currentStatus.badgeClass}`}>
            <span className={`w-2 h-2 rounded-full ${currentStatus.dotClass}`} />
            {currentStatus.label}
          </span>
          <span className="text-xs font-medium text-medicos-muted bg-medicos-canvas border border-medicos-soft-border/60 px-3 py-1 rounded-lg flex items-center gap-1.5">
            <Calendar size={13} className="text-medicos-teal" /> {fecha}
          </span>
          <span className="text-xs font-medium text-medicos-muted bg-medicos-canvas border border-medicos-soft-border/60 px-3 py-1 rounded-lg flex items-center gap-1.5">
            <Clock size={13} className="text-medicos-teal" /> Inicio: {horaInicio}
          </span>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-medicos-dark-blue tracking-tight">
            {nombreBrigada}
          </h1>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-medicos-muted font-medium">
            <MapPin size={15} className="text-medicos-teal shrink-0" />
            <span>Localidad / Comunidad: <strong className="text-medicos-dark-blue font-semibold">{comunidad}</strong></span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap shrink-0">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="px-4 py-2.5 bg-medicos-surface border border-medicos-soft-border hover:bg-medicos-canvas text-medicos-dark-blue font-semibold text-xs rounded-xl transition-all shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-medicos-teal' : 'text-medicos-muted'} />
          <span>Actualizar</span>
        </button>

        <Link
          to="/brigadista/brigada/jornada"
          className="px-4 py-2.5 bg-medicos-teal hover:bg-[#186a76] text-white font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <span>Ver Jornada Activa</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};