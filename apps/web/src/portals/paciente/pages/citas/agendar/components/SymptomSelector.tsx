// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/citas/agendar/components/SymptomSelector.tsx
// DESCRIPCIÓN: Selector de síntomas con iconos clínicos Lucide y notas clínicas,
//              alineado con la paleta canónica (#2B7A78) y UI de MedicOS.
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
      {/* Cabecera del Paso */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/80 pb-3">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#2B7A78]" />
            3. Síntomas Principales <span className="text-rose-500">*</span>
          </label>
          <p className="text-xs text-slate-500 mt-0.5">
            Indica el motivo o los síntomas por los que solicitas la atención médica.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80 self-start sm:self-auto">
          {selectedSymptoms.length > 0 ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{selectedSymptoms.length} seleccionados</span>
            </>
          ) : (
            <span>Selecciona al menos 1</span>
          )}
        </span>
      </div>

      {/* Grid de Síntomas con Iconos Clínicos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {COMMON_SYMPTOMS.map((item) => {
          const isSelected = selectedSymptoms.includes(item.id);
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggleSymptom(item.id)}
              className={`p-3 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 group ${
                isSelected
                  ? 'bg-teal-50/40 border-[#2B7A78] ring-1 ring-[#2B7A78]/20 shadow-xs'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#2B7A78] text-white shadow-2xs'
                      : 'bg-teal-50/60 border border-teal-100 text-[#2B7A78] group-hover:bg-teal-100/60'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
                <span
                  className={`text-xs truncate transition-colors ${
                    isSelected ? 'font-bold text-[#2B7A78]' : 'font-medium text-slate-700'
                  }`}
                >
                  {item.label}
                </span>
              </div>

              {isSelected && (
                <div className="w-4 h-4 rounded-full bg-[#2B7A78] text-white flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Campo de Observaciones Adicionales */}
      <div className="space-y-2 pt-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          Observaciones o detalles adicionales <span className="text-slate-400 font-normal normal-case">(Opcional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="Escribe aquí si tienes más detalles sobre tus molestias (ej. días de evolución, antecedentes o medicamentos que tomas actualmente)..."
          value={additionalNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="w-full p-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-[#2B7A78] rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-150 resize-y"
        />
      </div>
    </div>
  );
};

export default SymptomSelector;