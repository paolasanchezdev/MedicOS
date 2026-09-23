// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/diario-sintomas/components/RegistrarSintomasModal.tsx
// DESCRIPCIÓN: Modal flotante por pasos. Paso 1: Selección de síntomas.
//              Paso 2: Configuración independiente de intensidad y inicio por síntoma.
// =========================================================================

import React, { useState } from 'react';
import { X, Check, SlidersHorizontal, ArrowRight, ArrowLeft } from 'lucide-react';
import type {
  SymptomIntensity,
  SymptomOnset,
  SymptomItemRecord,
} from '../../../../../../modules/maternal-health/types/maternal-health.types.js';

interface RegistrarSintomasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { symptoms: SymptomItemRecord[]; notes?: string }) => Promise<void>;
}

const SYMPTOM_CATEGORIES = [
  {
    category: 'Síntomas Frecuentes',
    items: ['Náuseas', 'Vómitos', 'Fatiga o cansancio', 'Mareo leve al levantarse', 'Acidez o agruras'],
  },
  {
    category: 'Dolor y Molestias',
    items: ['Dolor de cabeza leve', 'Dolor pélvico o bajovientre', 'Dolor de espalda o lumbalgia', 'Dificultad para dormir / insomnio'],
  },
  {
    category: 'Cambios Físicos',
    items: ['Hinchazón leve en pies/tobillos', 'Estreñimiento', 'Congestión nasal', 'Otro malestar leve'],
  },
];

export const RegistrarSintomasModal: React.FC<RegistrarSintomasModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  
  // Estado detallado por cada síntoma seleccionado
  const [symptomDetails, setSymptomDetails] = useState<Record<string, {
    intensity: SymptomIntensity;
    onset: SymptomOnset;
    worsened: 'SI' | 'NO' | 'NO_SEGURA';
  }>>({});

  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleSymptom = (name: string) => {
    setSelectedSymptoms((prev) => {
      if (prev.includes(name)) {
        return prev.filter((s) => s !== name);
      } else {
        return [...prev, name];
      }
    });
  };

  const handleProceedToStep2 = () => {
    // Inicializar detalles por defecto para los síntomas elegidos si no existen
    const initialDetails: typeof symptomDetails = {};
    selectedSymptoms.forEach((name) => {
      initialDetails[name] = symptomDetails[name] || {
        intensity: 'LEVE',
        onset: 'HOY',
        worsened: 'NO',
      };
    });
    setSymptomDetails(initialDetails);
    setStep(2);
  };

  const updateDetail = (name: string, field: 'intensity' | 'onset' | 'worsened', value: unknown) => {
    setSymptomDetails((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) return;

    setIsSubmitting(true);
    try {
      const items: SymptomItemRecord[] = selectedSymptoms.map((name) => ({
        name,
        intensity: symptomDetails[name]?.intensity || 'LEVE',
        onset: symptomDetails[name]?.onset || 'HOY',
        worsened: symptomDetails[name]?.worsened || 'NO',
      }));

      await onSave({
        symptoms: items,
        notes: notes.trim() || undefined,
      });

      // Reset
      setSelectedSymptoms([]);
      setSymptomDetails({});
      setNotes('');
      setStep(1);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-5">
        
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78] shadow-xs">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#2B7A78]">
                Bitácora Personal · Paso {step} de 2
              </p>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Registrar cómo me siento
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido por Pasos */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          
          {step === 1 ? (
            <div className="space-y-4 animate-in fade-in duration-150">
              <p className="text-xs font-bold text-slate-700">
                ¿Qué has sentido hoy? Selecciona uno o varios síntomas:
              </p>

              <div className="space-y-4">
                {SYMPTOM_CATEGORIES.map((cat, idx) => (
                  <div key={idx} className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      {cat.category}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {cat.items.map((name) => {
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
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={selectedSymptoms.length === 0}
                  onClick={handleProceedToStep2}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2B7A78] hover:bg-[#236866] disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold rounded-2xl shadow-xs transition cursor-pointer"
                >
                  <span>Continuar con detalles</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-150">
              <p className="text-xs font-bold text-slate-700">
                Configura la intensidad y el inicio de cada síntoma seleccionado:
              </p>

              <div className="space-y-4">
                {selectedSymptoms.map((name) => {
                  const detail = symptomDetails[name] || { intensity: 'LEVE', onset: 'HOY', worsened: 'NO' };
                  return (
                    <div key={name} className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 text-sm">{name}</span>
                        <span className="text-[10px] font-bold text-[#2B7A78] bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                          Personalizado
                        </span>
                      </div>

                      {/* Intensidad */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700 uppercase tracking-wider block text-[10px]">
                          Intensidad
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['LEVE', 'MODERADA', 'INTENSA'] as SymptomIntensity[]).map((level) => (
                            <button
                              type="button"
                              key={level}
                              onClick={() => updateDetail(name, 'intensity', level)}
                              className={`py-2 px-2 rounded-xl font-bold border text-center transition cursor-pointer text-[11px] ${
                                detail.intensity === level
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {level.charAt(0) + level.slice(1).toLowerCase()}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Desde cuándo y empeoramiento */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-700 uppercase tracking-wider block text-[10px]">
                            ¿Desde cuándo?
                          </label>
                          <div className="grid grid-cols-3 gap-1">
                            {[
                              { key: 'HOY', label: 'Hoy' },
                              { key: 'AYER', label: 'Ayer' },
                              { key: 'HACE_VARIOS_DIAS', label: 'Días' },
                            ].map((item) => (
                              <button
                                type="button"
                                key={item.key}
                                onClick={() => updateDetail(name, 'onset', item.key)}
                                className={`py-1.5 px-1 rounded-lg font-bold border text-center transition cursor-pointer text-[10px] ${
                                  detail.onset === item.key
                                    ? 'bg-teal-50 text-[#2B7A78] border-teal-300'
                                    : 'bg-white text-slate-600 border-slate-200'
                                }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-700 uppercase tracking-wider block text-[10px]">
                            ¿Ha empeorado?
                          </label>
                          <div className="grid grid-cols-3 gap-1">
                            {[
                              { key: 'NO', label: 'No' },
                              { key: 'SI', label: 'Sí' },
                              { key: 'NO_SEGURA', label: 'Duda' },
                            ].map((item) => (
                              <button
                                type="button"
                                key={item.key}
                                onClick={() => updateDetail(name, 'worsened', item.key)}
                                className={`py-1.5 px-1 rounded-lg font-bold border text-center transition cursor-pointer text-[10px] ${
                                  detail.worsened === item.key
                                    ? 'bg-teal-50 text-[#2B7A78] border-teal-300'
                                    : 'bg-white text-slate-600 border-slate-200'
                                }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Observación global */}
              <div className="space-y-1.5 pt-2">
                <label className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                  Notas adicionales (Opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Ej: Se alivió al descansar por la tarde..."
                  className="w-full px-3.5 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/30 transition"
                />
              </div>

              {/* Botonera de navegación final */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-slate-600 hover:bg-slate-100 font-bold rounded-xl transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Atrás</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#2B7A78] hover:bg-[#236866] disabled:bg-slate-200 text-white font-extrabold rounded-2xl shadow-xs transition active:scale-95 cursor-pointer"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar registro'}
                </button>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};

export default RegistrarSintomasModal;