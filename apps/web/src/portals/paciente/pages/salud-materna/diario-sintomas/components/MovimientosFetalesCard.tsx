// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/diario-sintomas/components/MovimientosFetalesCard.tsx
// DESCRIPCIÓN: Tarjeta estructurada para la percepción de movimientos fetales.
// =========================================================================

import React, { useState } from 'react';
import { Baby, Plus } from 'lucide-react';
import type { FetalMovementEntry } from '../../../../../../modules/maternal-health/types/maternal-health.types.js';

interface MovimientosFetalesCardProps {
  latestMovement: FetalMovementEntry | null;
  onRecord: (count: number, notes?: string) => Promise<void>;
}

export const MovimientosFetalesCard: React.FC<MovimientosFetalesCardProps> = ({
  latestMovement,
  onRecord,
}) => {
  const [count, setCount] = useState(5);
  const [saving, setSaving] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onRecord(count);
      setShowInput(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 shadow-xs">
              <Baby className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Seguimiento Fetal
              </p>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight mt-0.5">
                Movimientos del Bebé
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowInput(!showInput)}
            className="p-2 rounded-xl bg-slate-50 hover:bg-amber-50 text-amber-800 border border-slate-200 hover:border-amber-200 transition cursor-pointer shadow-2xs"
            title="Anotar movimientos"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100">
          {!showInput ? (
            latestMovement ? (
              <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  Último reporte: <strong className="font-black text-slate-900">{latestMovement.perceivedCount} movimientos</strong>
                </span>
                <span className="text-[11px] text-slate-400 font-bold tabular-nums">
                  {new Date(latestMovement.recordedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} hrs
                </span>
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-medium py-2">
                No has registrado movimientos fetales hoy.
              </p>
            )
          ) : (
            <div className="space-y-3 pt-1 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-slate-700">Movimientos percibidos:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCount((c) => Math.max(1, c - 1))}
                    className="w-8 h-8 rounded-xl bg-slate-100 font-black text-slate-700 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-sm font-black text-slate-900 w-8 text-center tabular-nums">
                    {count}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCount((c) => c + 1)}
                    className="w-8 h-8 rounded-xl bg-slate-100 font-black text-slate-700 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInput(false)}
                  className="px-3 py-1.5 text-slate-500 font-bold hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-2xs"
                >
                  {saving ? 'Guardando...' : 'Anotar'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovimientosFetalesCard;