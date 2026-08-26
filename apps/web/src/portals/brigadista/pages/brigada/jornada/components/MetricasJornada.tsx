// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/jornada/components/MetricasJornada.tsx
// DESCRIPCIÓN: Métricas operativas en tiempo real de la jornada.
// =========================================================================

import React from 'react';

interface MetricasJornadaProps {
  registrados: number;
  triageRealizados?: number;
  triageados?: number;
  pendientes: number;
  derivados: number;
  atendidos: number;
  sincronizarPendientes: number;
}

export const MetricasJornada: React.FC<MetricasJornadaProps> = ({
  registrados,
  triageRealizados,
  triageados,
  pendientes,
  derivados,
  atendidos,
  sincronizarPendientes,
}) => {
  const totalTriage = triageados ?? triageRealizados ?? 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <div className="bg-medicos-surface border border-medicos-soft-border rounded-xl p-4 shadow-2xs space-y-1">
        <span className="text-[10px] font-bold text-medicos-muted uppercase tracking-wider block">Registrados</span>
        <span className="text-2xl font-black text-medicos-dark-blue">{registrados}</span>
        <span className="text-[10px] text-medicos-muted block">Padrón total</span>
      </div>

      <div className="bg-medicos-surface border border-medicos-soft-border rounded-xl p-4 shadow-2xs space-y-1">
        <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">Triageados</span>
        <span className="text-2xl font-black text-teal-900">{totalTriage}</span>
        <span className="text-[10px] text-teal-600 block">Evaluados</span>
      </div>

      <div className="bg-medicos-surface border border-medicos-soft-border rounded-xl p-4 shadow-2xs space-y-1">
        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">En Espera</span>
        <span className="text-2xl font-black text-amber-900">{pendientes}</span>
        <span className="text-[10px] text-amber-600 block">Cola actual</span>
      </div>

      <div className="bg-medicos-surface border border-medicos-soft-border rounded-xl p-4 shadow-2xs space-y-1">
        <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block">Atendidos</span>
        <span className="text-2xl font-black text-sky-900">{atendidos}</span>
        <span className="text-[10px] text-sky-600 block">Por médico</span>
      </div>

      <div className="bg-medicos-surface border border-medicos-soft-border rounded-xl p-4 shadow-2xs space-y-1">
        <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">Derivados</span>
        <span className="text-2xl font-black text-indigo-900">{derivados}</span>
        <span className="text-[10px] text-indigo-600 block">A hospital</span>
      </div>

      <div className="bg-medicos-surface border border-medicos-soft-border rounded-xl p-4 shadow-2xs space-y-1">
        <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Por Sincronizar</span>
        <span className="text-2xl font-black text-purple-900">{sincronizarPendientes}</span>
        <span className="text-[10px] text-purple-600 block">Local outbox</span>
      </div>
    </div>
  );
};