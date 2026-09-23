// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/diario-sintomas/components/RegistroSignosCasaCard.tsx
// DESCRIPCIÓN: Tarjeta de mediciones domiciliarias limpia y estructurada.
// =========================================================================

import React, { useState } from 'react';
import { Home, Plus, Activity, Scale, Clock } from 'lucide-react';
import type { HomeMeasurementEntry } from '../../../../../../modules/maternal-health/types/maternal-health.types.js';

interface RegistroSignosCasaCardProps {
  latestMeasurement: HomeMeasurementEntry | null;
  onSave: (data: { weightKg?: number | null; systolic?: number | null; diastolic?: number | null; pulse?: number | null }) => Promise<void>;
}

export const RegistroSignosCasaCard: React.FC<RegistroSignosCasaCardProps> = ({
  latestMeasurement,
  onSave,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [weight, setWeight] = useState(latestMeasurement?.weightKg?.toString() || '');
  const [systolic, setSystolic] = useState(latestMeasurement?.systolic?.toString() || '');
  const [diastolic, setDiastolic] = useState(latestMeasurement?.diastolic?.toString() || '');
  const [pulse, setPulse] = useState(latestMeasurement?.pulse?.toString() || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        weightKg: weight ? parseFloat(weight) : null,
        systolic: systolic ? parseInt(systolic, 10) : null,
        diastolic: diastolic ? parseInt(diastolic, 10) : null,
        pulse: pulse ? parseInt(pulse, 10) : null,
      });
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78] shadow-xs">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Autorreporte Domiciliario
                </p>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight mt-0.5">
                  Mediciones en Casa
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="p-2 rounded-xl bg-slate-50 hover:bg-teal-50 text-[#2B7A78] border border-slate-200 hover:border-teal-200 transition cursor-pointer shadow-2xs"
              title="Añadir medición"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            {latestMeasurement ? (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-500 flex items-center gap-1.5 uppercase text-[10px]">
                    <Scale className="w-3.5 h-3.5 text-[#2B7A78]" />
                    Peso en casa
                  </span>
                  <span className="text-base font-black text-slate-900 block mt-1 tabular-nums">
                    {latestMeasurement.weightKg ? `${latestMeasurement.weightKg} kg` : 'Sin dato'}
                  </span>
                </div>

                <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-500 flex items-center gap-1.5 uppercase text-[10px]">
                    <Activity className="w-3.5 h-3.5 text-teal-600" />
                    Presión arterial
                  </span>
                  <span className="text-base font-black text-slate-900 block mt-1 tabular-nums">
                    {latestMeasurement.systolic && latestMeasurement.diastolic
                      ? `${latestMeasurement.systolic}/${latestMeasurement.diastolic} mmHg`
                      : 'Sin dato'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-medium py-2">
                No has registrado mediciones recientes en casa.
              </p>
            )}
          </div>
        </div>

        {latestMeasurement && (
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Última toma: {new Date(latestMeasurement.recordedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
          </div>
        )}
      </div>

      {/* Modal de Registro */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-black text-slate-900">Anotar Medición en Casa</h4>
                <span className="text-[10px] text-slate-400 font-semibold">Tus propios datos de báscula o tensiómetro</span>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ej: 64.2"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sistólica (Alta)</label>
                  <input
                    type="number"
                    placeholder="Ej: 115"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/30"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Diastólica (Baja)</label>
                  <input
                    type="number"
                    placeholder="Ej: 75"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/30"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Pulso (lpm - opcional)</label>
                <input
                  type="number"
                  placeholder="Ej: 78"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/30"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4.5 py-2 bg-[#2B7A78] hover:bg-[#236866] text-white font-bold rounded-xl shadow-xs"
                >
                  {saving ? 'Guardando...' : 'Guardar medición'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default RegistroSignosCasaCard;