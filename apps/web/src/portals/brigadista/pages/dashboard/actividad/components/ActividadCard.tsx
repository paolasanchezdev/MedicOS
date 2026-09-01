// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/actividad/components/ActividadCard.tsx
// DESCRIPCIÓN: Modal para inspección de eventos de actividad de campo.
// =========================================================================

import React from 'react';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  User,
  AlertTriangle,
  CheckCircle2,
  Send,
  ShieldCheck,
} from 'lucide-react';
import {
  TipoActividadBadge,
  EstadoActividadBadge,
} from './EstadoActividadBadge';
import type { ActividadItemOperativa } from '../../../../../../modules/brigades';

interface ActividadCardProps {
  actividad: ActividadItemOperativa | null;
  onClose: () => void;
}

export const ActividadCard: React.FC<ActividadCardProps> = ({ actividad, onClose }) => {
  if (!actividad) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden space-y-0 animate-in zoom-in-95 duration-150">
        {/* Cabecera del modal */}
        <div className="bg-slate-50/90 p-5 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#2B7A78]" />
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              Detalle de Actividad Operativa
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido del Detalle */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
          {/* Tipos y Estados */}
          <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-slate-100">
            <TipoActividadBadge tipo={actividad.tipo} />
            <EstadoActividadBadge estado={actividad.estado} />
          </div>

          {/* Título y Sujeto */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Actividad / Asunto
            </span>
            <p className="text-base font-extrabold text-slate-900 mt-0.5">
              {actividad.titulo}
            </p>
          </div>

          {/* Rejilla de Contexto */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200/60">
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                Persona / Hogar
              </span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800 mt-1">
                <User className="w-3.5 h-3.5 text-[#2B7A78]" />
                <span>{actividad.sujeto}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                Territorio / Lugar
              </span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#2B7A78]" />
                <span className="truncate">{actividad.comunidad}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                Fecha
              </span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800 mt-1">
                <Calendar className="w-3.5 h-3.5 text-[#2B7A78]" />
                <span>{actividad.fecha}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                Hora
              </span>
              <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800 mt-1">
                <Clock className="w-3.5 h-3.5 text-[#2B7A78]" />
                <span>{actividad.hora}</span>
              </div>
            </div>
          </div>

          {/* Resultados y Acciones */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Resultado y Hallazgos
            </span>
            <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl space-y-1">
              <p className="font-bold text-slate-900">{actividad.resultado}</p>
              {actividad.detalles && (
                <p className="text-slate-600 text-[11px] leading-relaxed pt-1">
                  {actividad.detalles}
                </p>
              )}
            </div>
          </div>

          {/* Acciones y Banderas de Riesgo */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
              actividad.tieneRiesgo ? 'bg-rose-50 border-rose-200 text-rose-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Riesgo Clínico: {actividad.tieneRiesgo ? 'Detectado' : 'No'}</span>
            </div>

            <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
              actividad.referenciaGenerada ? 'bg-teal-50 border-teal-200 text-[#1B5250] font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <Send className="w-4 h-4 text-[#2B7A78] shrink-0" />
              <span>Referencia: {actividad.referenciaGenerada ? 'Derivado' : 'No'}</span>
            </div>
          </div>

          {/* Sincronización */}
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-slate-600 text-[11px]">
            <span>Estado de Sincronización:</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {actividad.sincronizado ? 'Sincronizado con Estación' : 'Pendiente de sincronizar'}
            </span>
          </div>
        </div>

        {/* Pie del modal */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-200/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#2B7A78] hover:bg-[#236866] text-white font-bold rounded-xl text-xs transition-all shadow-2xs cursor-pointer"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
};