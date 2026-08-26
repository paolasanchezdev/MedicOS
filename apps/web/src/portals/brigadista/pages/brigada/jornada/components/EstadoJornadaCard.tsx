// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/jornada/components/EstadoJornadaCard.tsx
// DESCRIPCIÓN: Tarjeta de control y temporizador de la jornada en curso.
// =========================================================================

import React from 'react';
import { Activity, Play, Pause, Square, Clock } from 'lucide-react';

interface EstadoJornadaCardProps {
  estado: string;
  horaInicio: string;
  duracion: string;
  onPausar: () => void;
  onFinalizar: () => void;
}

export const EstadoJornadaCard: React.FC<EstadoJornadaCardProps> = ({
  estado,
  horaInicio,
  duracion,
  onPausar,
  onFinalizar,
}) => {
  const isActive = estado === 'ACTIVA';

  return (
    <div className="bg-medicos-surface border border-medicos-soft-border rounded-2xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-medicos-light-bg text-medicos-teal flex items-center justify-center font-bold">
            <Activity size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-medicos-dark-blue uppercase tracking-wider">Centro de Control Operativo</h2>
            <p className="text-xs text-medicos-muted flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1"><Clock size={12} className="text-medicos-teal" /> Inicio: {horaInicio}</span>
              <span>•</span>
              <span>Duración: <strong className="text-medicos-dark-blue">{duracion}</strong></span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isActive ? (
            <button
              onClick={onPausar}
              className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Pause size={14} /> Pausar Jornada
            </button>
          ) : (
            <button
              onClick={onPausar}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Play size={14} /> Reanudar Jornada
            </button>
          )}

          <button
            onClick={onFinalizar}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Square size={14} /> Finalizar Jornada
          </button>
        </div>
      </div>
    </div>
  );
};