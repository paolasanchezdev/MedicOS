// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/dashboard/actividad/components/ActividadItem.tsx
// DESCRIPCIÓN: Tarjeta de registro de actividad médica con estética unificada MedicOS.
// =========================================================================

import React from 'react';
import {
  Stethoscope,
  Calendar,
  Activity,
  ChevronRight,
  User,
  MapPin,
  Clock,
} from 'lucide-react';

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
      hour12: true,
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
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return isoString;
  }
};

const getTipoConfig = (tipo: ElementoActividad['tipo']) => {
  switch (tipo) {
    case 'consulta':
      return {
        icono: Stethoscope,
        label: 'Consulta Médica',
        iconBg: 'bg-teal-50 border-teal-100 text-[#2a726d]',
        badgeBg: 'bg-teal-50 text-teal-800 border-teal-200/60',
      };
    case 'vitales':
      return {
        icono: Activity,
        label: 'Signos Vitales',
        iconBg: 'bg-rose-50 border-rose-100 text-rose-600',
        badgeBg: 'bg-rose-50 text-rose-800 border-rose-200/60',
      };
    case 'cita':
      return {
        icono: Calendar,
        label: 'Cita / Seguimiento',
        iconBg: 'bg-indigo-50 border-indigo-100 text-indigo-600',
        badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200/60',
      };
    default:
      return {
        icono: Activity,
        label: 'Registro',
        iconBg: 'bg-slate-100 border-slate-200/70 text-slate-600',
        badgeBg: 'bg-slate-100 text-slate-700 border-slate-200/60',
      };
  }
};

const getBadgeColor = (estado?: string) => {
  switch (estado?.toUpperCase()) {
    case 'COMPLETED':
    case 'COMPLETADA':
    case 'COMPLETADO':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
    case 'IN_PROGRESS':
    case 'EN_PROGRESO':
      return 'bg-blue-50 text-blue-700 border-blue-200/60';
    case 'SCHEDULED':
    case 'PROGRAMADA':
    case 'PROGRAMADO':
      return 'bg-teal-50 text-[#2a726d] border-teal-200/60';
    case 'CANCELLED':
    case 'CANCELADA':
    case 'CANCELADO':
      return 'bg-rose-50 text-rose-700 border-rose-200/60';
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200/60';
  }
};

export const ActividadItem: React.FC<ActividadItemProps> = ({ item, onVerDetalle }) => {
  const tipoConfig = getTipoConfig(item.tipo);
  const IconComponent = tipoConfig.icono;
  const horaTexto = formatearHora(item.fechaISO);
  const fechaTexto = formatearFechaLabel(item.fechaISO);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Información Principal e Icono */}
      <div className="flex items-start gap-3.5 min-w-0">
        {/* Icono temático */}
        <div
          className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs transition-transform duration-200 group-hover:scale-105 ${tipoConfig.iconBg}`}
        >
          <IconComponent className="w-5 h-5 stroke-[2.2]" />
        </div>

        {/* Detalles Clínicos */}
        <div className="min-w-0 space-y-1 flex-1">
          {/* Badges de Tipo y Estado */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tipoConfig.badgeBg}`}
            >
              {tipoConfig.label}
            </span>

            {item.estado && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeColor(
                  item.estado
                )}`}
              >
                {item.estado}
              </span>
            )}
          </div>

          {/* Título */}
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#2a726d] transition-colors truncate">
            {item.titulo}
          </h3>

          {/* Descripción / Hallazgo */}
          <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
            {item.descripcion}
          </p>

          {/* Metadatos (Profesional, Sede, Horario) */}
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[11px] text-slate-400 pt-1 font-medium">
            {item.profesional && (
              <span className="flex items-center gap-1 text-slate-600 truncate">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{item.profesional}</span>
              </span>
            )}

            {item.establecimiento && (
              <span className="flex items-center gap-1 text-slate-500 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{item.establecimiento}</span>
              </span>
            )}

            <span className="flex items-center gap-1 text-slate-500 shrink-0">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{fechaTexto} {horaTexto ? `• ${horaTexto}` : ''}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Botón de Acción */}
      <button
        type="button"
        onClick={() => onVerDetalle(item)}
        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100/80 active:bg-slate-200/60 border border-slate-200/60 hover:border-slate-300 text-xs font-semibold text-slate-700 hover:text-[#2a726d] transition-all shrink-0 self-end sm:self-center shadow-2xs group/btn cursor-pointer active:scale-95"
      >
        <span>Ver detalle</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-[#2a726d] group-hover/btn:translate-x-0.5 transition-all" />
      </button>
    </div>
  );
};

export default ActividadItem;