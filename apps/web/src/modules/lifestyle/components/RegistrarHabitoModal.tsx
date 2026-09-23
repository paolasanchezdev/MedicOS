// =========================================================================
// ARCHIVO: apps/web/src/modules/lifestyle/components/RegistrarHabitoModal.tsx
// DESCRIPCIÓN: Modal para registrar cumplimiento de agua, sueño o bienestar.
// =========================================================================

import React, { useState } from 'react';
import { X, Droplet, Moon, Apple, Smile, Loader2 } from 'lucide-react';
import type { LifestyleHabitType } from '../types/lifestyle.types.js';

interface RegistrarHabitoModalProps {
  habitType: LifestyleHabitType | null;
  onClose: () => void;
  onSubmit: (habitType: LifestyleHabitType, value: number, unit: string, notes?: string) => Promise<void>;
}

export const RegistrarHabitoModal: React.FC<RegistrarHabitoModalProps> = ({
  habitType,
  onClose,
  onSubmit,
}) => {
  if (!habitType) return null;

  const getConfig = () => {
    switch (habitType) {
      case 'WATER':
        return { title: 'Consumo de Agua', icon: Droplet, defaultVal: 8, unit: 'vasos', step: 1, label: 'Vasos consumidos hoy' };
      case 'SLEEP':
        return { title: 'Horas de Sueño', icon: Moon, defaultVal: 7.5, unit: 'horas', step: 0.5, label: 'Horas descansadas anoche' };
      case 'NUTRITION':
        return { title: 'Alimentación Saludable', icon: Apple, defaultVal: 1, unit: 'puntos', step: 1, label: 'Comidas equilibradas (1 a 5)' };
      case 'MINDFULNESS':
        return { title: 'Bienestar y Pausa Activa', icon: Smile, defaultVal: 15, unit: 'minutos', step: 5, label: 'Minutos dedicados a relajación' };
      default:
        return { title: 'Registro de Hábito', icon: Droplet, defaultVal: 1, unit: 'sesión', step: 1, label: 'Valor' };
    }
  };

  const config = getConfig();
  const IconComponent = config.icon;
  const [val, setVal] = useState(config.defaultVal);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(habitType, Number(val), config.unit, notes.trim() || undefined);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-sm overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-linear-to-r from-[#20343A] to-[#1E7F8C] text-white p-5 flex items-start justify-between">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 text-[10.5px] font-bold text-teal-100">
              <IconComponent className="w-3 h-3" />
              Seguimiento Diario
            </span>
            <h2 className="text-lg font-black text-white leading-tight">{config.title}</h2>
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
              {config.label}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step={config.step}
                min="0"
                value={val}
                onChange={(e) => setVal(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-lg text-slate-900 outline-none focus:border-[#1E7F8C]"
              />
              <span className="text-xs font-bold text-slate-500 uppercase">{config.unit}</span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
              Nota adicional (opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Hidratación constante durante la jornada"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-[#1E7F8C]"
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
              className="px-4 py-2 bg-[#1E7F8C] hover:bg-[#16646e] text-white font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:bg-slate-300"
            >
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>Registrar hoy</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarHabitoModal;