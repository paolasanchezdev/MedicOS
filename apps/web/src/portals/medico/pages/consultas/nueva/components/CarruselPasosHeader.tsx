// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/consultas/nueva/components/CarruselPasosHeader.tsx
// DESCRIPCIÓN: Barra indicadora de pasos interactiva con estado de progreso e iconos clínicos.
// =========================================================================

import React from 'react';
import { Stethoscope, Activity, Pill, ClipboardCheck, Check } from 'lucide-react';

interface CarruselPasosHeaderProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  maxAccessibleStep: number;
}

const STEPS = [
  { id: 1, title: 'Anamnesis & Examen', icon: Stethoscope },
  { id: 2, title: 'Diagnóstico CIE-10', icon: Activity },
  { id: 3, title: 'Prescripción / Receta', icon: Pill },
  { id: 4, title: 'Plan & Cierre', icon: ClipboardCheck },
];

export const CarruselPasosHeader: React.FC<CarruselPasosHeaderProps> = ({
  currentStep,
  onSelectStep,
  maxAccessibleStep,
}) => {
  return (
    <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-2 sm:p-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {STEPS.map((step) => {
          const isCurrent = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isAccessible = step.id <= maxAccessibleStep;
          const IconComponent = step.icon;

          return (
            <button
              key={step.id}
              type="button"
              disabled={!isAccessible}
              onClick={() => onSelectStep(step.id)}
              className={`p-2.5 rounded-xl text-left transition-all flex items-center gap-2.5 cursor-pointer disabled:cursor-not-allowed ${
                isCurrent
                  ? 'bg-[#0e7490] text-white shadow-xs'
                  : isCompleted
                  ? 'bg-teal-50 border border-teal-200 text-[#0e7490]'
                  : 'bg-white border border-slate-200/80 text-slate-500 opacity-70'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black ${
                  isCurrent
                    ? 'bg-white/20 text-white'
                    : isCompleted
                    ? 'bg-[#0e7490] text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {isCompleted ? (
                  <Check size={14} className="stroke-3" />
                ) : (
                  <IconComponent size={14} />
                )}
              </div>

              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 block truncate">
                  Paso {step.id}
                </span>
                <span className="text-xs font-bold truncate block">{step.title}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};