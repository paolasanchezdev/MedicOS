import React from 'react';
import { Stethoscope, Calendar, Activity, ChevronRight } from 'lucide-react';

export interface ElementoActividad {
  id: string;
  tipo: 'consulta' | 'cita' | 'vitales';
  titulo: string;
  descripcion: string;
  fechaISO: string;
  estado?: string;
  profesional?: string;
  establecimiento?: string;
  datosOriginales: unknown;
}

interface ActividadItemProps {
  item: ElementoActividad;
  onVerDetalle: (item: ElementoActividad) => void;
}

const formatearHora = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('es-SV', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  } catch {
    return '';
  }
};

const formatearFechaLabel = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    const hoy = new Date();
    if (date.toDateString() === hoy.toDateString()) {
      return 'Hoy';
    }
    return new Intl.DateTimeFormat('es-SV', {
      day: '2-digit',
      month: 'short',
    }).format(date);
  } catch {
    return isoString;
  }
};

const getIcono = (tipo: ElementoActividad['tipo']) => {
  switch (tipo) {
    case 'consulta':
      return <Stethoscope className="w-4 h-4 text-medicos-teal" />;
    case 'cita':
      return <Calendar className="w-4 h-4 text-medicos-dark-blue" />;
    case 'vitales':
      return <Activity className="w-4 h-4 text-medicos-teal" />;
    default:
      return <Activity className="w-4 h-4 text-medicos-muted" />;
  }
};

const getBadgeColor = (estado?: string) => {
  switch (estado?.toUpperCase()) {
    case 'COMPLETED':
    case 'COMPLETADA':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'IN_PROGRESS':
    case 'EN_PROGRESO':
      return 'bg-blue-50 text-blue-800 border-blue-200';
    case 'SCHEDULED':
    case 'PROGRAMADA':
      return 'bg-medicos-light-bg text-medicos-teal border-medicos-soft-border';
    case 'CANCELLED':
    case 'CANCELADA':
      return 'bg-rose-50 text-rose-800 border-rose-200';
    default:
      return 'bg-medicos-light-bg text-medicos-muted border-medicos-soft-border';
  }
};

export const ActividadItem: React.FC<ActividadItemProps> = ({ item, onVerDetalle }) => {
  return (
    <div className="group bg-medicos-surface border border-medicos-soft-border rounded-2xl p-4 sm:p-5 transition-all hover:border-medicos-teal/40 hover:shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Columna de Línea de Tiempo e Información Principal */}
      <div className="flex items-start gap-4 min-w-0">
        {/* Bloque de Fecha y Nodo de Línea de Tiempo (Inspirado en Dashboard Médico) */}
        <div className="hidden sm:flex flex-col items-center shrink-0 w-20 text-center pt-1 relative">
          <span className="text-[11px] font-bold text-medicos-dark-blue">{formatearFechaLabel(item.fechaISO)}</span>
          <span className="text-xs font-semibold text-medicos-muted">{formatearHora(item.fechaISO)}</span>
          <div className="w-2.5 h-2.5 rounded-full bg-medicos-surface border-2 border-medicos-teal mt-2 shadow-xs" />
        </div>

        {/* Icono Representativo */}
        <div className="p-3 rounded-xl bg-medicos-light-bg border border-medicos-soft-border shrink-0 mt-0.5 shadow-xs">
          {getIcono(item.tipo)}
        </div>

        {/* Contenido / Detalles */}
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-medicos-light-bg border border-medicos-soft-border text-medicos-teal">
              {item.tipo}
            </span>
            {item.estado && (
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getBadgeColor(item.estado)}`}>
                {item.estado}
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold text-medicos-dark-blue group-hover:text-medicos-teal transition-colors truncate">
            {item.titulo}
          </h3>
          <p className="text-xs text-medicos-muted line-clamp-2 font-medium">
            {item.descripcion}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-medicos-muted pt-0.5 font-medium">
            {item.profesional && <span>Prof: {item.profesional}</span>}
            {item.establecimiento && <span>Lugar: {item.establecimiento}</span>}
            <span className="sm:hidden">{formatearFechaLabel(item.fechaISO)} - {formatearHora(item.fechaISO)}</span>
          </div>
        </div>
      </div>

      {/* Botón de Acción */}
      <button
        type="button"
        onClick={() => onVerDetalle(item)}
        className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-medicos-teal hover:text-white hover:bg-medicos-teal px-4 py-2 rounded-xl bg-medicos-light-bg border border-medicos-soft-border transition-all shrink-0 self-end md:self-center shadow-xs focus:outline-none focus:ring-2 focus:ring-medicos-teal"
      >
        Ver detalle
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default ActividadItem;