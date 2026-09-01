// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/jornada/components/JornadaActividadesTimeline.tsx
// DESCRIPCIÓN: Timeline con datos 100% reales de eventos clínicos y operativos.
// =========================================================================

import React from 'react';
import { Clock, Plus, Home, HeartPulse, Send, Users, Activity, MapPin, User, ShieldCheck } from 'lucide-react';
import type { JornadaActividadItem } from '../../../../../../modules/brigades';

interface JornadaActividadesTimelineProps {
  actividades: JornadaActividadItem[];
  onRegistrarActividad: () => void;
  enCurso: boolean;
}

const getIconoActividad = (tipo: string) => {
  switch (tipo) {
    case 'VISITA':
      return <Home className="w-4 h-4 text-blue-600" />;
    case 'EVALUACION':
      return <HeartPulse className="w-4 h-4 text-[#2B7A78]" />;
    case 'CONSULTA':
      return <Send className="w-4 h-4 text-purple-600" />;
    case 'SESION':
      return <ShieldCheck className="w-4 h-4 text-teal-600" />;
    default:
      return <Users className="w-4 h-4 text-slate-600" />;
  }
};

export const JornadaActividadesTimeline: React.FC<JornadaActividadesTimelineProps> = ({
  actividades,
  onRegistrarActividad,
  enCurso,
}) => {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden">
      {/* Encabezado */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#2B7A78]" />
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
            Actividades de la Jornada
          </h2>
          <span className="text-[11px] font-semibold text-slate-600 bg-slate-50 px-2.5 py-0.5 rounded-lg border border-slate-200/60 ml-1">
            {actividades.length} {actividades.length === 1 ? 'Evento' : 'Eventos'}
          </span>
        </div>

        <button
          type="button"
          disabled={!enCurso}
          onClick={onRegistrarActividad}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#2B7A78] hover:bg-[#236866] text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Registrar Actividad</span>
        </button>
      </div>

      {/* Lista de Registros */}
      {actividades.length === 0 ? (
        <div className="p-12 text-center space-y-2">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto border border-slate-100">
            <Activity className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-800">Sin actividades registradas en esta jornada</p>
          <p className="text-[11px] text-slate-500">
            No se han registrado visitas, tomas de signos vitales o aperturas de sesión en la base de datos.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {actividades.map((act) => (
            <div
              key={act.id}
              className="p-4 hover:bg-slate-50/70 transition-colors duration-150 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="flex flex-col items-center shrink-0 w-12">
                  <span className="font-mono text-xs font-bold text-[#2B7A78]">
                    {act.hora}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {act.fecha ? `${act.fecha.split('/')[0]}/${act.fecha.split('/')[1]}` : ''}
                  </span>
                </div>

                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-2xs">
                  {getIconoActividad(act.tipo)}
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <h3 className="text-xs font-bold text-slate-900 truncate">
                    {act.titulo}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1 truncate text-slate-600">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {act.lugar}
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="flex items-center gap-1 truncate text-slate-600">
                      <User className="w-3 h-3 text-slate-400 shrink-0" />
                      {act.responsable}
                    </span>
                  </div>
                </div>
              </div>

              <span
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border shrink-0 ${
                  act.estado === 'EN_CURSO'
                    ? 'bg-teal-50 text-teal-700 border-teal-200/60'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                }`}
              >
                {act.estado === 'EN_CURSO' ? 'En Curso' : 'Completada'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};