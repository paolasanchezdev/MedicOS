// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/citas/agendar/components/SymptomSelector.tsx
// DESCRIPCIÓN: Selector de síntomas con iconos clínicos Lucide y notas.
// =========================================================================

import React from 'react';
import {
  Activity,
  Check,
  FileText,
  Thermometer,
  Zap,
  Wind,
  Flame,
  AlertCircle,
  Dumbbell,
  Moon,
  Bandage,
  Stethoscope,
  HeartPulse,
} from 'lucide-react';

interface SymptomSelectorProps {
  selectedSymptoms: string[];
  onToggleSymptom: (symptom: string) => void;
  additionalNotes: string;
  onNotesChange: (notes: string) => void;
}

const COMMON_SYMPTOMS = [
  { id: 'Fiebre', label: 'Fiebre o temperatura', icon: Thermometer },
  { id: 'Dolor de cabeza', label: 'Cefalea / Dolor de cabeza', icon: Zap },
  { id: 'Tos o congestión', label: 'Tos o congestión respiratoria', icon: Wind },
  { id: 'Dolor estomacal', label: 'Dolor abdominal / Estomacal', icon: Flame },
  { id: 'Náuseas o mareo', label: 'Náuseas o mareos', icon: AlertCircle },
  { id: 'Dolor muscular', label: 'Dolor muscular / Articular', icon: Dumbbell },
  { id: 'Dificultad respiratoria', label: 'Dificultad para respirar', icon: HeartPulse },
  { id: 'Fatiga extrema', label: 'Fatiga / Cansancio extremo', icon: Moon },
  { id: 'Alergia o piel', label: 'Alergia / Erupciones cutáneas', icon: Bandage },
  { id: 'Control de rutina', label: 'Chequeo general / Preventivo', icon: Stethoscope },
];

export const SymptomSelector: React.FC<SymptomSelectorProps> = ({
  selectedSymptoms,
  onToggleSymptom,
  additionalNotes,
  onNotesChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-slate-100 pb-2.5">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Activity size={15} className="text-[#0e7490]" />
          3. Síntomas Principales <span className="text-rose-600">*</span>
        </label>
        <span className="text-[11px] font-medium text-slate-500">
          Selecciona al menos 1
        </span>
      </div>

      {/* Grid de Síntomas con Iconos Clínicos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {COMMON_SYMPTOMS.map((item) => {
          const isSelected = selectedSymptoms.includes(item.id);
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggleSymptom(item.id)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 group ${
                isSelected
                  ? 'bg-teal-50/90 border-[#0e7490] text-[#0e7490] font-bold shadow-2xs'
                  : 'bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-white hover:border-slate-300 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#0e7490] text-white'
                      : 'bg-white border border-slate-200 text-slate-500 group-hover:text-[#0e7490]'
                  }`}
                >
                  <IconComponent size={14} />
                </div>
                <span className="text-xs truncate">{item.label}</span>
              </div>

              {isSelected && (
                <div className="w-4 h-4 rounded-full bg-[#0e7490] text-white flex items-center justify-center shrink-0">
                  <Check size={10} className="stroke-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Campo de Notas Adicionales (Opcional) */}
      <div className="space-y-1.5 pt-2">
        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
          <FileText size={13} className="text-slate-400" />
          Observaciones o detalles adicionales <span className="text-slate-400 font-normal normal-case">(Opcional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="Escribe aquí si tienes más detalles sobre tus molestias (ej. evolución de los síntomas, antecedentes o medicamentos que tomas)..."
          value={additionalNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden"
        />
      </div>
    </div>
  );
};