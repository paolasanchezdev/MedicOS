// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/diario-sintomas/components/EstadoActualCard.tsx
// DESCRIPCIÓN: Tarjeta de estado actual compacta, densa y rica en información.
// =========================================================================

import React from 'react';
import { CheckCircle2, AlertCircle, Plus, ChevronRight, Clock, Calendar } from 'lucide-react';
import type { SymptomDiaryEntry } from '../../../../../../modules/maternal-health/types/maternal-health.types.js';

interface EstadoActualCardProps {
  todayEntry: SymptomDiaryEntry | null;
  onOpenRegister: () => void;
  onViewHistory: () => void;
}

export const EstadoActualCard: React.FC<EstadoActualCardProps> = ({
  todayEntry,
  onOpenRegister,
  onViewHistory,
}) => {
  if (!todayEntry) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-xs shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                Pendiente de hoy
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight mt-1">
              Sin registro para hoy
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Aún no has anotado cómo te sientes en la jornada de hoy.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenRegister}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar síntomas</span>
        </button>
      </div>
    );
  }

  const timeStr = new Date(todayEntry.recordedAt).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm transition-all select-none space-y-4">
      {/* Cabecera de la Tarjeta */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78] shadow-xs shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#2B7A78] bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                Registrado hoy
              </span>
              <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{timeStr} hrs</span>
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight mt-0.5">
              Resumen de molestias de hoy ({todayEntry.symptoms.length})
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenRegister}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition cursor-pointer"
          >
            Agregar otro
          </button>
          <button
            type="button"
            onClick={onViewHistory}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            <span>Historial</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cuadrícula compacta de síntomas registrados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {todayEntry.symptoms.map((s, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 flex flex-col justify-between space-y-1.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-extrabold text-slate-900 text-xs truncate">{s.name}</span>
              <span className="text-[9.5px] font-black uppercase px-2 py-0.5 rounded bg-white border border-slate-200 text-[#2B7A78] shrink-0">
                {s.intensity}
              </span>
            </div>

            <div className="flex items-center justify-between text-[10.5px] text-slate-500 pt-1 border-t border-slate-200/50">
              <span className="flex items-center gap-1 font-semibold">
                <Calendar className="w-3 h-3 text-slate-400" />
                Inicio: {s.onset === 'HOY' ? 'Hoy' : s.onset === 'AYER' ? 'Ayer' : 'Hace días'}
              </span>
              {s.worsened === 'SI' && (
                <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">Empeoró</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {todayEntry.notes && (
        <p className="text-xs text-slate-600 italic bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
          <strong className="font-bold text-slate-700 not-italic">Nota:</strong> "{todayEntry.notes}"
        </p>
      )}
    </div>
  );
};

export default EstadoActualCard;