// =========================================================================
// ARCHIVO: ModalCaptarGestante.tsx
// DESCRIPCIÓN: Modal para incorporar formalmente a una gestante real al censo.
// =========================================================================

import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2 } from 'lucide-react';
import type { PatientRecord } from '../../../../../../modules/patients/types/patient.types';
import type { CaptarGestanteDto } from '../../../../../../modules/maternal-health/types/materno-infantil.types';

interface ModalCaptarGestanteProps {
  isOpen: boolean;
  onClose: () => void;
  candidatas: PatientRecord[];
  onCaptar: (dto: CaptarGestanteDto) => Promise<boolean>;
}

export const ModalCaptarGestante: React.FC<ModalCaptarGestanteProps> = ({
  isOpen,
  onClose,
  candidatas,
  onCaptar,
}) => {
  const [pacienteId, setPacienteId] = useState<string>('');
  const [semanas, setSemanas] = useState<number>(12);
  const [fpp, setFpp] = useState<string>('2026-12-15');
  const [observaciones, setObservaciones] = useState<string>('');
  const [guardando, setGuardando] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteId) return;

    setGuardando(true);
    const ok = await onCaptar({
      pacienteId,
      semanasGestacion: semanas,
      fechaProbableParto: fpp,
      observaciones: observaciones.trim() || null,
    });
    setGuardando(false);
    if (ok) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#166E7A]" />
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase">
                Captar Gestante para Seguimiento
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Inscripción comunitaria de control prenatal territorial
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Seleccionar Paciente del Padrón Comunitario
            </label>
            {candidatas.length > 0 ? (
              <select
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
              >
                <option value="">-- Selecciona una paciente --</option>
                {candidatas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} • DUI: {p.dui || 'Sin DUI'} • {p.address}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-medium">
                No hay más candidatas femeninas en edad reproductiva en el padrón local. Puedes registrar a la persona primero desde Padrón Comunitario.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Semanas de Gestación
              </label>
              <input
                type="number"
                min="1"
                max="42"
                value={semanas}
                onChange={(e) => setSemanas(parseInt(e.target.value, 10))}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Fecha Probable de Parto (FPP)
              </label>
              <input
                type="date"
                value={fpp}
                onChange={(e) => setFpp(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Observaciones de Captación o Factores de Riesgo
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={2}
              placeholder="Ej. Primer embarazo, antecedentes de anemia, control inicial..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando || !pacienteId}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#166E7A] hover:bg-[#105F68] text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{guardando ? 'Guardando...' : 'Incorporar al Censo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};