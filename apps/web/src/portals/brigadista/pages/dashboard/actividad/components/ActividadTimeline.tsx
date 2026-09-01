// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/actividad/components/ActividadTimeline.tsx
// DESCRIPCIÓN: Lista balanceada de eventos del turno con estilo Admin.
// =========================================================================

import React from 'react';
import {
  Clock,
  MapPin,
  User,
  ChevronRight,
  Activity,
  AlertTriangle,
  Home,
  HeartPulse,
  Send,
  Users,
  BookOpen,
  ArrowDown,
} from 'lucide-react';
import type { ActividadItemOperativa, TipoActividadOperativa } from '../../../../../../modules/brigades';

interface ActividadTimelineProps {
  actividades: ActividadItemOperativa[];
  onSeleccionarActividad: (actividad: ActividadItemOperativa) => void;
  onVerTodas?: () => void;
}

const getIconoTipo = (tipo: TipoActividadOperativa) => {
  switch (tipo) {
    case 'VISITA_DOMICILIARIA':
      return <Home className="w-4 h-4 text-blue-600" />;
    case 'EVALUACION_SIGNOS':
      return <HeartPulse className="w-4 h-4 text-[#2B7A78]" />;
    case 'REFERENCIA':
      return <Send className="w-4 h-4 text-purple-600" />;
    case 'EDUCACION_COMUNITARIA':
      return <BookOpen className="w-4 h-4 text-indigo-600" />;
    default:
      return <Users className="w-4 h-4 text-slate-600" />;
  }
};

const MAX_EVENTOS_RECIENTES = 6;

export const ActividadTimeline: React.FC<ActividadTimelineProps> = ({
  actividades,
  onSeleccionarActividad,
  onVerTodas,
}) => {
  if (actividades.length === 0) {
    return (
      <div className="group bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm text-center space-y-2 h-full flex flex-col items-center justify-center">
        <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center border border-slate-100">
          <Activity className="w-6 h-6" />
        </div>
        <p className="text-xs font-bold text-slate-800">Sin actividades registradas</p>
        <p className="text-[11px] text-slate-500">
          No hay eventos que coincidan con los filtros de tiempo o búsqueda seleccionados.
        </p>
      </div>
    );
  }

  const eventosVisibles = actividades.slice(0, MAX_EVENTOS_RECIENTES);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden flex flex-col justify-between h-full">
      <div>
        {/* Encabezado */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#2B7A78]" />
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
              Últimos Movimientos del Turno
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-slate-600 bg-slate-50 px-2.5 py-0.5 rounded-lg border border-slate-200/60">
            {eventosVisibles.length} de {actividades.length}
          </span>
        </div>

        {/* Lista de Registros */}
        <div className="divide-y divide-slate-100">
          {eventosVisibles.map((act) => (
            <div
              key={act.id}
              onClick={() => onSeleccionarActividad(act)}
              className="p-3.5 hover:bg-slate-50/80 transition-colors duration-150 cursor-pointer flex items-center justify-between gap-3 group/item"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex flex-col items-center shrink-0 w-11">
                  <span className="font-mono text-xs font-bold text-[#2B7A78]">
                    {act.hora}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {act.fecha.split('/')[0]}/{act.fecha.split('/')[1]}
                  </span>
                </div>

                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-2xs group-hover/item:border-slate-200">
                  {getIconoTipo(act.tipo)}
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xs font-bold text-slate-900 group-hover/item:text-[#2B7A78] transition-colors truncate">
                      {act.titulo}
                    </h3>

                    {act.tieneRiesgo && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200/70">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        Riesgo
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 truncate">
                    <span className="flex items-center gap-1 font-medium text-slate-700 truncate">
                      <User className="w-3 h-3 text-slate-400 shrink-0" />
                      {act.sujeto}
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="flex items-center gap-1 truncate text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {act.comunidad}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60">
                  {act.estado === 'COMPLETADA' ? 'Completado' : act.estado === 'EN_CURSO' ? 'En Curso' : 'Pendiente'}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover/item:text-[#2B7A78] group-hover/item:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {actividades.length > MAX_EVENTOS_RECIENTES && (
        <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-center">
          <button
            type="button"
            onClick={onVerTodas}
            className="text-xs font-bold text-[#2B7A78] hover:text-[#1B5250] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Ver historial completo en la tabla ({actividades.length} registros)</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};