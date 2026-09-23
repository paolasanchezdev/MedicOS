// =========================================================================
// ARCHIVO: apps/web/src/modules/lifestyle/components/RegistrarActividadModal.tsx
// DESCRIPCIÓN: Modal para registrar actividades de salud coherentes y orientadas.
// =========================================================================

import React, { useState } from 'react';
import { X, Footprints, Clock, Flame, Loader2 } from 'lucide-react';
import type { ActivityIntensity } from '../types/lifestyle.types.js';

interface RegistrarActividadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, duration: number, intensity: ActivityIntensity, notes?: string) => Promise<void>;
}

const clinicallySoundActivities = [
  { name: 'Caminata a paso ligero', benefit: 'Estimula el retorno venoso y control glucémico' },
  { name: 'Fuerza y movilidad en casa', benefit: 'Preserva masa muscular y estabilidad postural' },
  { name: 'Bicicleta estática o paseo', benefit: 'Resistencia aeróbica sin impacto articular' },
  { name: 'Pausa activa y respiración', benefit: 'Disminuye la tensión vascular y cortisol' },
  { name: 'Natación / Ejercicio acuático', benefit: 'Acondicionamiento total de bajo impacto' },
  { name: 'Trote / Carrera aeróbica', benefit: 'Capacidad cardiorrespiratoria progresiva' },
];

export const RegistrarActividadModal: React.FC<RegistrarActividadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [selectedPreset, setSelectedPreset] = useState(clinicallySoundActivities[0]!.name);
  const [customName, setCustomName] = useState('');
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState<ActivityIntensity>('MODERATE');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = customName.trim() ? customName.trim() : selectedPreset;
    if (!finalName || duration <= 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(finalName, duration, intensity, notes.trim() || undefined);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-linear-to-r from-medicos-dark-blue to-medicos-teal text-white p-5 flex items-start justify-between">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 text-[10.5px] font-bold text-teal-100">
              <Footprints className="w-3 h-3" />
              Actividad Física de Salud
            </span>
            <h2 className="text-lg font-black text-white leading-tight">Registrar Actividad</h2>
            <p className="text-xs text-teal-100">Guarda minutos activos coherentes con tu bienestar</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-teal-100 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
              Selecciona una actividad de salud
            </label>
            <div className="space-y-1.5 mb-2.5 max-h-40 overflow-y-auto pr-1">
              {clinicallySoundActivities.map((act) => (
                <button
                  type="button"
                  key={act.name}
                  onClick={() => {
                    setSelectedPreset(act.name);
                    setCustomName('');
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition cursor-pointer flex flex-col ${
                    selectedPreset === act.name && !customName
                      ? 'border-medicos-teal bg-teal-50/70 text-medicos-teal'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span className="font-bold text-xs">{act.name}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{act.benefit}</span>
                </button>
              ))}
            </div>

            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="O escribe otra actividad física..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-medicos-teal"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                Duración (minutos)
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="5"
                  max="360"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  required
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-medicos-teal"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                Intensidad
              </label>
              <select
                value={intensity}
                onChange={(e) => setIntensity(e.target.value as ActivityIntensity)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-medicos-teal cursor-pointer"
              >
                <option value="LIGHT">Suave / Ligera</option>
                <option value="MODERATE">Moderada</option>
                <option value="INTENSE">Vigorosa / Intensa</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
              Sensación u observaciones (opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Buena tolerancia cardiovascular, sin fatiga"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-medicos-teal"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-medicos-teal hover:bg-[#16646e] text-white font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:bg-slate-300"
            >
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Flame className="w-3.5 h-3.5" />}
              <span>Guardar en expediente</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarActividadModal;