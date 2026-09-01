// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/nueva/components/AtencionNavegacion.tsx
// DESCRIPCIÓN: Barra horizontal lineal optimizada para 8 pasos.
// =========================================================================

import React from 'react';
import { ArrowLeft, ArrowRight, Save, Loader2, Check } from 'lucide-react';

interface AtencionNavegacionProps {
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;
  canContinue: boolean;
  completedSteps?: number[];
  onPrevious: () => void;
  onNext: () => void;
  onGoToStep?: (step: number) => void;
  onSubmit: () => void;
}

const PASOS_CONFIG = [
  { id: 1, label: 'Paciente' },
  { id: 2, label: 'Motivo' },
  { id: 3, label: 'Valoración' },
  { id: 4, label: 'Observaciones' },
  { id: 5, label: 'Acciones' },
  { id: 6, label: 'Educación' },
  { id: 7, label: 'Seguimiento & Ref.' },
  { id: 8, label: 'Resumen' },
];

export const AtencionNavegacion: React.FC<AtencionNavegacionProps> = ({
  currentStep,
  totalSteps = 8,
  isLoading,
  canContinue,
  completedSteps = [],
  onPrevious,
  onNext,
  onGoToStep,
  onSubmit,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-2.5 shadow-sm flex items-center justify-between gap-2">
      <button
        type="button"
        onClick={onPrevious}
        disabled={currentStep === 1 || isLoading}
        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
          currentStep === 1 || isLoading ? 'opacity-40 cursor-not-allowed text-slate-400' : 'text-slate-600 hover:bg-slate-50 cursor-pointer active:scale-95'
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Anterior</span>
      </button>

      {/* Grid de 8 pasos */}
      <div className="flex flex-1 items-center justify-center overflow-x-auto scrollbar-none px-2 gap-1">
        {PASOS_CONFIG.map(({ id, label }, index) => {
          const isCompleted = completedSteps.includes(id) || id < currentStep;
          const isCurrent = id === currentStep;
          const isClickable = onGoToStep && (isCompleted || id <= currentStep);
          const showSeparator = index < PASOS_CONFIG.length - 1;

          return (
            <React.Fragment key={id}>
              <button
                type="button"
                disabled={!isClickable || isLoading}
                onClick={() => isClickable && onGoToStep && onGoToStep(id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition shrink-0 ${
                  isCurrent
                    ? 'bg-[#1d5c5d] text-white shadow-sm'
                    : isCompleted
                    ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 cursor-pointer'
                    : 'text-slate-400 opacity-60'
                } ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              >
                {isCompleted && !isCurrent ? (
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-3" />
                  </div>
                ) : (
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isCurrent ? 'bg-white/20' : 'bg-slate-200/50'}`}>
                    {id}
                  </div>
                )}
                <span className="hidden md:inline">{label}</span>
              </button>

              {showSeparator && <div className={`h-px w-2 sm:w-3 shrink-0 ${id < currentStep ? 'bg-emerald-200' : 'bg-slate-200'}`} />}
            </React.Fragment>
          );
        })}
      </div>

      <div className="shrink-0">
        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={onNext}
            disabled={!canContinue || isLoading}
            className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shadow-xs ${
              !canContinue || isLoading ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400' : 'bg-[#1d5c5d] hover:bg-[#154647] text-white cursor-pointer active:scale-95'
            }`}
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span className="hidden sm:inline">Guardar</span>
          </button>
        )}
      </div>
    </div>
  );
};