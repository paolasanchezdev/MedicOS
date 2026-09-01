// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/actividad/components/ProximaActividadCard.tsx
// DESCRIPCIÓN: Próxima acción y excepciones con diseño unificado al Admin.
// =========================================================================

import React from 'react';
import {
  Clock,
  MapPin,
  Play,
  Eye,
  AlertTriangle,
  ChevronRight,
  ClipboardList,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ProximaActividadData } from '../../../../../../modules/brigades';

interface ProximaActividadCardProps {
  proximaActividad: ProximaActividadData;
  seguimientosAtrasados?: number;
  referenciasPendientes?: number;
  pendientesSync?: number;
  onVerDetalleProxima?: () => void;
}

export const ProximaActividadCard: React.FC<ProximaActividadCardProps> = ({
  proximaActividad,
  seguimientosAtrasados = 0,
  referenciasPendientes = 0,
  pendientesSync = 0,
  onVerDetalleProxima,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* 1. Tarjeta Principal: Próxima Actividad Programada */}
      <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78] shadow-xs">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Siguiente Paso
              </p>
              <h2 className="text-sm font-bold text-slate-900 mt-0.5">
                Próxima Actividad
              </h2>
            </div>
          </div>
          <span className="font-mono text-xs font-bold text-[#2B7A78] bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {proximaActividad.hora}
          </span>
        </div>

        <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-100 space-y-2 text-xs">
          <div>
            <p className="text-[10px] font-bold text-[#2B7A78] uppercase tracking-wider">
              {proximaActividad.tipo}
            </p>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">
              {proximaActividad.sujeto}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 font-medium pt-0.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{proximaActividad.territorio}</span>
          </div>

          <p className="text-slate-600 pt-2 text-[11px] leading-relaxed border-t border-slate-200/60">
            <strong className="text-slate-800">Motivo:</strong> {proximaActividad.motivo}
          </p>
        </div>

        {/* Acciones */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={onVerDetalleProxima}
            className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
          >
            <Eye className="w-3.5 h-3.5 text-[#2B7A78]" />
            <span>Ver Ficha</span>
          </button>

          <button
            type="button"
            onClick={() => navigate(proximaActividad.rutaEjecucion)}
            className="py-2.5 px-3 bg-[#2B7A78] hover:bg-[#236866] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-white stroke-none" />
            <span>Iniciar</span>
          </button>
        </div>
      </div>

      {/* 2. Bloque de Excepciones: Requieren Atención Inmediata */}
      <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Requieren Atención Inmediata
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          {/* Seguimientos */}
          <div
            onClick={() => navigate('/brigadista/seguimiento')}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-100 text-slate-700 transition-colors cursor-pointer group/item"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span className="font-medium text-slate-800 group-hover/item:text-[#2B7A78] transition-colors">
                {seguimientosAtrasados}{' '}
                {seguimientosAtrasados === 1 ? 'seguimiento atrasado' : 'seguimientos atrasados'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover/item:text-[#2B7A78] group-hover/item:translate-x-0.5 transition-all shrink-0" />
          </div>

          {/* Referencias */}
          <div
            onClick={() => navigate('/brigadista/consultas')}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-100 text-slate-700 transition-colors cursor-pointer group/item"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
              <span className="font-medium text-slate-800 group-hover/item:text-[#2B7A78] transition-colors">
                {referenciasPendientes}{' '}
                {referenciasPendientes === 1 ? 'referencia médica registrada' : 'referencias médicas registradas'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover/item:text-[#2B7A78] group-hover/item:translate-x-0.5 transition-all shrink-0" />
          </div>

          {/* Sincronización Outbox */}
          <div
            onClick={() => navigate('/brigadista/sincronizacion/estado')}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-100 text-slate-700 transition-colors cursor-pointer group/item"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              <span className="font-medium text-slate-800 group-hover/item:text-[#2B7A78] transition-colors">
                {pendientesSync}{' '}
                {pendientesSync === 1 ? 'registro Outbox local' : 'registros Outbox local'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover/item:text-[#2B7A78] group-hover/item:translate-x-0.5 transition-all shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};