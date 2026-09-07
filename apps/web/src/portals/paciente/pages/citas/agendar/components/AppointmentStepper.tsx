// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/citas/agendar/components/AppointmentStepper.tsx
// DESCRIPCIÓN: Stepper continuo de 2 pasos, estilizado y de baja altura.
// =========================================================================

import React from 'react';
import { Check, Stethoscope, Clock } from 'lucide-react';

interface AppointmentStepperProps {
  currentStep: 1 | 2;
  onStepClick?: (step: 1 | 2) => void;
  canNavigateToStep2: boolean;
}

export const AppointmentStepper: React.FC<AppointmentStepperProps> = ({
  currentStep,
  onStepClick,
  canNavigateToStep2,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2 shadow-2xs">
      <div className="flex items-center justify-between max-w-lg mx-auto relative">
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-0.5 bg-slate-200/80 z-0" />
        <div
          className={`absolute top-1/2 left-8 -translate-y-1/2 h-0.5 bg-[#2B7A78] transition-all duration-300 z-0 ${
            currentStep === 2 ? 'right-8' : 'right-1/2'
          }`}
        />

        {/* Paso 1: Motivo */}
        <button
          type="button"
          onClick={() => onStepClick?.(1)}
          className="relative z-10 flex items-center gap-2 bg-white px-2 py-0.5 rounded-full cursor-pointer"
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] transition-all ${
              currentStep === 2
                ? 'bg-emerald-600 text-white'
                : 'bg-[#2B7A78] text-white ring-2 ring-teal-50 shadow-2xs'
            }`}
          >
            {currentStep === 2 ? <Check className="w-3 h-3 stroke-3" /> : <Stethoscope className="w-3 h-3" />}
          </div>
          <span className="text-xs font-bold text-slate-800">1. Motivo de Consulta</span>
        </button>

        {/* Paso 2: Profesional y Horarios */}
        <button
          type="button"
          disabled={!canNavigateToStep2}
          onClick={() => canNavigateToStep2 && onStepClick?.(2)}
          className={`relative z-10 flex items-center gap-2 bg-white px-2 py-0.5 rounded-full transition-all ${
            !canNavigateToStep2 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] transition-all ${
              currentStep === 2
                ? 'bg-[#2B7A78] text-white ring-2 ring-teal-50 shadow-2xs'
                : 'bg-slate-100 text-slate-400 border border-slate-200'
            }`}
          >
            <Clock className="w-3 h-3" />
          </div>
          <span
            className={`text-xs font-bold ${
              currentStep === 2 ? 'text-slate-800' : 'text-slate-400'
            }`}
          >
            2. Profesional y Horario
          </span>
        </button>
      </div>
    </div>
  );
};

export default AppointmentStepper;