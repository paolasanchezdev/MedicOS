// =========================================================================
// ARCHIVO: ReferenciasMetricas.tsx
// DESCRIPCIÓN: 4 paneles operativos del flujo F-01: Pendientes, Enviadas,
//              En Seguimiento y Completadas, con alerta de casos urgentes.
// =========================================================================

import React from 'react';
import { Clock, Send, Hourglass, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { ReferenciasMetricas as MetricasType } from '../../../../../../modules/references/types/reference.types';

interface ReferenciasMetricasProps {
  metricas: MetricasType;
  filtroEstado: string;
  onSelectEstado: (estado: string) => void;
}

export const ReferenciasMetricas: React.FC<ReferenciasMetricasProps> = ({
  metricas,
  filtroEstado,
  onSelectEstado,
}) => {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Pendientes */}
        <div
          onClick={() => onSelectEstado(filtroEstado === 'PENDING' ? 'TODOS' : 'PENDING')}
          className={`p-4 rounded-2xl bg-white border transition shadow-2xs cursor-pointer flex flex-col justify-between ${
            filtroEstado === 'PENDING'
              ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20'
              : 'border-[#D3E8EC] hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
              Pendientes
            </span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#1A282D] leading-none mb-1">
            {metricas.pendientes}
          </div>
          <p className="text-[11px] text-medicos-muted font-medium">
            F-01 emitidos sin envío confirmado
          </p>
        </div>

        {/* 2. Enviadas */}
        <div
          onClick={() => onSelectEstado(filtroEstado === 'SENT' ? 'TODOS' : 'SENT')}
          className={`p-4 rounded-2xl bg-white border transition shadow-2xs cursor-pointer flex flex-col justify-between ${
            filtroEstado === 'SENT'
              ? 'border-cyan-600 ring-2 ring-cyan-600/20 bg-cyan-50/20'
              : 'border-[#D3E8EC] hover:border-cyan-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-800">
              Enviadas
            </span>
            <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#1A282D] leading-none mb-1">
            {metricas.enviadas}
          </div>
          <p className="text-[11px] text-medicos-muted font-medium">
            Entregadas al paciente o centro de salud
          </p>
        </div>

        {/* 3. En Seguimiento */}
        <div
          onClick={() => onSelectEstado(filtroEstado === 'IN_FOLLOW_UP' ? 'TODOS' : 'IN_FOLLOW_UP')}
          className={`p-4 rounded-2xl bg-white border transition shadow-2xs cursor-pointer flex flex-col justify-between ${
            filtroEstado === 'IN_FOLLOW_UP'
              ? 'border-[#166E7A] ring-2 ring-[#166E7A]/20 bg-teal-50/20'
              : 'border-[#D3E8EC] hover:border-[#166E7A]/40'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#166E7A]">
              En Seguimiento
            </span>
            <div className="p-1.5 rounded-lg bg-teal-50 text-[#166E7A] border border-teal-200">
              <Hourglass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#1A282D] leading-none mb-1">
            {metricas.enSeguimiento}
          </div>
          <p className="text-[11px] text-medicos-muted font-medium">
            Esperando atención o retorno clínico
          </p>
        </div>

        {/* 4. Completadas */}
        <div
          onClick={() => onSelectEstado(filtroEstado === 'ATTENDED' ? 'TODOS' : 'ATTENDED')}
          className={`p-4 rounded-2xl bg-white border transition shadow-2xs cursor-pointer flex flex-col justify-between ${
            filtroEstado === 'ATTENDED'
              ? 'border-emerald-600 ring-2 ring-emerald-600/20 bg-emerald-50/20'
              : 'border-[#D3E8EC] hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
              Completadas
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#1A282D] leading-none mb-1">
            {metricas.completadas}
          </div>
          <p className="text-[11px] text-medicos-muted font-medium">
            Proceso de atención finalizado
          </p>
        </div>
      </div>

      {metricas.urgentes > 0 && (
        <div className="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs text-rose-800 font-bold">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Existen {metricas.urgentes} referencia{metricas.urgentes > 1 ? 's' : ''} con prioridad ALTA o URGENTE en territorio.</span>
          </div>
          <span className="text-[11px] text-rose-700 font-black uppercase tracking-wider">Requieren Monitoreo Inmediato</span>
        </div>
      )}
    </div>
  );
};