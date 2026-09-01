// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/registrar/components/PasoIndicador.tsx
// DESCRIPCIÓN: Indicador horizontal de progreso por pasos (Stepper / Carrusel).
// =========================================================================

import React from 'react';
import { User, Lock, Phone, Heart, ShieldCheck, Check } from 'lucide-react';

interface StepItem {
  number: number;
  title: string;
  shortTitle: string;
  icon: React.ElementType;
}

const STEPS: StepItem[] = [
  { number: 1, title: 'Identificación', shortTitle: 'Identidad', icon: User },
  { number: 2, title: 'Cuenta MedicOS', shortTitle: 'Cuenta', icon: Lock },
  { number: 3, title: 'Contacto y Ubicación', shortTitle: 'Contacto', icon: Phone },
  { number: 4, title: 'Información Médica', shortTitle: 'Médica', icon: Heart },
  { number: 5, title: 'Emergencia y Cierre', shortTitle: 'Cierre', icon: ShieldCheck },
];

interface PasoIndicadorProps {
  currentStep: number;
  onSelectStep: (stepNumber: number) => void;
}

export const PasoIndicador: React.FC<PasoIndicadorProps> = ({ currentStep, onSelectStep }) => {
  const progressPercent = Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Barra de progreso superior */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <span className="text-[#2B7A78] uppercase tracking-wider">
          Paso {currentStep} de {STEPS.length}: {STEPS[currentStep - 1].title}
        </span>
        <span className="font-mono text-slate-600">{progressPercent}% completado</span>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-linear-to-r from-[#2B7A78] to-[#3aafa9] h-full transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Botones de pasos interactivos */}
      <div className="grid grid-cols-5 gap-2 pt-1">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <button
              key={step.number}
              type="button"
              onClick={() => {
                if (step.number < currentStep) {
                  onSelectStep(step.number);
                }
              }}
              disabled={step.number > currentStep}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-2 rounded-xl border transition-all text-left select-none ${
                isCurrent
                  ? 'bg-teal-50/80 border-[#2B7A78] text-[#1B5250] shadow-2xs'
                  : isCompleted
                  ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer'
                  : 'bg-slate-50/50 border-slate-100 text-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  isCurrent
                    ? 'bg-[#2B7A78] text-white'
                    : isCompleted
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-3" /> : <Icon className="w-3.5 h-3.5" />}
              </div>

              <div className="hidden md:block overflow-hidden">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 leading-tight">
                  Paso {step.number}
                </p>
                <p
                  className={`text-xs font-extrabold truncate ${
                    isCurrent ? 'text-[#1B5250]' : 'text-slate-700'
                  }`}
                >
                  {step.shortTitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};