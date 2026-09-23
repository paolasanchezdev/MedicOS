// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/diario-sintomas/components/HistorialSintomas.tsx
// DESCRIPCIÓN: Listado cronológico de registros de la paciente con
//              chips de intensidad neutros y estado de sincronización.
// =========================================================================

import React, { useState, useMemo } from 'react';
import { Calendar, Clock, CloudCheck, CloudOff } from 'lucide-react';
import type { SymptomDiaryEntry } from '../../../../../../modules/maternal-health/types/maternal-health.types';

interface HistorialSintomasProps {
  entries: SymptomDiaryEntry[];
}

export const HistorialSintomas: React.FC<HistorialSintomasProps> = ({ entries }) => {
  const [filterDays, setFilterDays] = useState<7 | 14 | 30>(7);

  const filtered = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - filterDays);
    const cutoffTime = cutoff.getTime();

    return entries.filter((e) => {
      const entryTime = new Date(e.recordedAt).getTime();
      return entryTime >= cutoffTime;
    });
  }, [entries, filterDays]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs select-none space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#2B7A78]" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Registros Anteriores
          </h3>
        </div>

        {/* Filtro de Tiempo */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {([7, 14, 30] as const).map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => setFilterDays(days)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                filterDays === days
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {days} días
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-6 text-slate-400 text-xs font-medium">
          No tienes registros en los últimos {filterDays} días.
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((entry) => {
            const dateObj = new Date(entry.recordedAt);
            const dateStr = dateObj.toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
            });
            const timeStr = dateObj.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={entry.id}
                className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70 hover:border-teal-200 transition space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{dateStr} • {timeStr} hrs</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200/60">
                      Registrado por ti
                    </span>
                    {entry.syncStatus === 'SYNCED' ? (
                      <span className="text-emerald-600 flex items-center gap-1 text-[10px] font-bold" title="Sincronizado">
                        <CloudCheck className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Guardado</span>
                      </span>
                    ) : (
                      <span className="text-amber-600 flex items-center gap-1 text-[10px] font-bold" title="Pendiente de sincronizar">
                        <CloudOff className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">En dispositivo</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Síntomas listados */}
                <div className="flex flex-wrap gap-1.5">
                  {entry.symptoms.map((s, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700"
                    >
                      <span>{s.name}</span>
                      <span className="text-[9.5px] font-black uppercase text-slate-500 bg-slate-100 px-1 rounded">
                        {s.intensity}
                      </span>
                    </span>
                  ))}
                </div>

                {entry.notes && (
                  <p className="text-[11.5px] text-slate-600 italic pl-2 border-l-2 border-slate-300">
                    "{entry.notes}"
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistorialSintomas;