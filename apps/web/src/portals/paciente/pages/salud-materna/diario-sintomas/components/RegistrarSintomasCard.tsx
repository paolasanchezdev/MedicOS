// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/diario-sintomas/components/RegistrarSintomasCard.tsx
// DESCRIPCIÓN: Formulario interactivo sin efectos secundarios síncronos.
// =========================================================================

import React, { useState } from 'react';
import { PlusCircle, Check, X, Sparkles, SlidersHorizontal } from 'lucide-react';
import { PREDEFINED_SYMPTOMS_LIST } from '../../../../../../modules/maternal-health/services/symptom-diary.service.js';
import type {
  SymptomIntensity,
  SymptomOnset,
  SymptomItemRecord,
} from '../../../../../../modules/maternal-health/types/maternal-health.types.js';

interface RegistrarSintomasCardProps {
  onSave: (data: { symptoms: SymptomItemRecord[]; notes?: string }) => Promise<void>;
  isOpenDefault?: boolean;
}

export const RegistrarSintomasCard: React.FC<RegistrarSintomasCardProps> = ({
  onSave,
  isOpenDefault = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(isOpenDefault);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [intensity, setIntensity] = useState<SymptomIntensity>('LEVE');
  const [onset, setOnset] = useState<SymptomOnset>('HOY');
  const [worsened, setWorsened] = useState<'SI' | 'NO' | 'NO_SEGURA'>('NO');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSymptom = (name: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) return;

    setIsSubmitting(true);
    try {
      const items: SymptomItemRecord[] = selectedSymptoms.map((name) => ({
        name,
        intensity,
        onset,
        worsened,
      }));

      await onSave({
        symptoms: items,
        notes: notes.trim() || undefined,
      });

      setSelectedSymptoms([]);
      setNotes('');
      setIsExpanded(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isExpanded) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78] shadow-xs shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Nuevo Registro
              </p>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                ¿Quieres registrar nuevas molestias o síntomas?
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar síntomas</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-teal-300/80 p-6 sm:p-7 shadow-md select-none space-y-5 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78]">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Bitácora de Autorreporte
            </p>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight mt-0.5">
              Registrar cómo me siento
            </h3>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        {/* 1. Selector de Síntomas */}
        <div className="space-y-2.5">
          <label className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
            1. ¿Qué has sentido hoy? (Selecciona uno o varios)
          </label>
          <div className="flex flex-wrap gap-2">
            {PREDEFINED_SYMPTOMS_LIST.map((name) => {
              const isSelected = selectedSymptoms.includes(name);
              return (
                <button
                  type="button"
                  key={name}
                  onClick={() => toggleSymptom(name)}
                  className={`px-3 py-2 rounded-xl font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#2B7A78] text-white border-[#2B7A78] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-teal-50/50 hover:border-teal-200'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-teal-200" />}
                  <span>{name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Intensidad */}
        <div className="space-y-2.5">
          <label className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
            2. Intensidad percibida
          </label>
          <div className="grid grid-cols-3 gap-2.5 max-w-md">
            {(['LEVE', 'MODERADA', 'INTENSA'] as SymptomIntensity[]).map((level) => (
              <button
                type="button"
                key={level}
                onClick={() => setIntensity(level)}
                className={`py-2.5 px-3 rounded-xl font-extrabold border text-center transition cursor-pointer ${
                  intensity === level
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {level.charAt(0) + level.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Inicio y Evolución */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="space-y-2">
            <label className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
              3. ¿Desde cuándo lo sientes?
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { key: 'HOY', label: 'Hoy' },
                { key: 'AYER', label: 'Ayer' },
                { key: 'HACE_VARIOS_DIAS', label: 'Hace días' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.key}
                  onClick={() => setOnset(item.key as SymptomOnset)}
                  className={`py-2 px-2 rounded-lg font-bold border text-center transition cursor-pointer ${
                    onset === item.key
                      ? 'bg-teal-50 text-[#2B7A78] border-teal-300 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
              4. ¿Sientes que ha empeorado?
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { key: 'NO', label: 'No' },
                { key: 'SI', label: 'Sí' },
                { key: 'NO_SEGURA', label: 'Duda' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.key}
                  onClick={() => setWorsened(item.key as 'SI' | 'NO' | 'NO_SEGURA')}
                  className={`py-2 px-2 rounded-lg font-bold border text-center transition cursor-pointer ${
                    worsened === item.key
                      ? 'bg-teal-50 text-[#2B7A78] border-teal-300 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Notas */}
        <div className="space-y-2">
          <label className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
            5. Notas adicionales (Opcional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Ej: Apareció por la tarde al estar mucho tiempo de pie..."
            className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/30 transition"
          />
        </div>

        {/* Botones */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={selectedSymptoms.length === 0 || isSubmitting}
            className="px-5 py-2.5 bg-[#2B7A78] hover:bg-[#236866] disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar en mi diario'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrarSintomasCard;