// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/jornada/components/RegistrarActividadModal.tsx
// DESCRIPCIÓN: Modal rápido para registrar actividades operativas en la jornada.
// =========================================================================

import React, { useState } from 'react';
import { X, Plus, ShieldCheck } from 'lucide-react';

interface RegistrarActividadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistrado: () => void;
}

export const RegistrarActividadModal: React.FC<RegistrarActividadModalProps> = ({
  isOpen,
  onClose,
  onRegistrado,
}) => {
  const [tipo, setTipo] = useState<string>('VISITA');
  const [lugar, setLugar] = useState<string>('');
  const [observacion, setObservacion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onRegistrado();
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden space-y-0 animate-in zoom-in-95 duration-150">
        <div className="bg-slate-50/90 p-5 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#2B7A78]" />
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              Registrar Actividad de Campo
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Tipo de Actividad
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full bg-white border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78] transition-all cursor-pointer"
            >
              <option value="VISITA">Visita Domiciliaria / Censo</option>
              <option value="EVALUACION">Evaluación de Signos Vitales (Triage)</option>
              <option value="EDUCACION">Educación en Salud Comunitaria</option>
              <option value="OTRA">Promoción / Actividad Preventiva</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Lugar / Sector (Opcional)
            </label>
            <input
              type="text"
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
              placeholder="Ej. Sector 2, Casa Comunal, Barrio El Calvario"
              className="w-full bg-white border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Observaciones / Hallazgos
            </label>
            <textarea
              rows={3}
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              placeholder="Describe brevemente la actividad ejecutada..."
              className="w-full bg-white border border-slate-200/80 rounded-xl p-3 text-xs font-medium text-slate-800 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78] transition-all resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-bold transition-all cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{loading ? 'Guardando...' : 'Registrar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};