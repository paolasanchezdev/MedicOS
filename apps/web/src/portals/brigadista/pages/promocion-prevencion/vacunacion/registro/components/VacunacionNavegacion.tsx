// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/vacunacion/registro/components/VacunacionNavegacion.tsx
// DESCRIPCIÓN: Botonera inferior de control para avanzar, retroceder y guardar.
// =========================================================================

import React from 'react';
import { ArrowLeft, ArrowRight, RotateCw, CheckCircle2 } from 'lucide-react';

export interface VacunacionNavegacionProps {
  currentStep: number;
  totalSteps?: number;
  stepTitle?: string;
  canAdvance: boolean;
  isLoading: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export const VacunacionNavegacion: React.FC<VacunacionNavegacionProps> = ({
  currentStep,
  totalSteps = 4,
  stepTitle = '',
  canAdvance,
  isLoading,
  onPrev,
  onNext,
  onSubmit,
}) => {
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-sm flex items-center justify-between gap-3">
      {/* Botón Anterior */}
      <button
        type="button"
        onClick={onPrev}
        disabled={currentStep === 1 || isLoading}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Anterior</span>
      </button>

      {/* Indicador Central de Paso */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-extrabold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/70">
          Paso {currentStep} de {totalSteps}
        </span>
        {stepTitle && (
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
            &bull; {stepTitle}
          </span>
        )}
      </div>

      {/* Botón Siguiente / Guardar */}
      {isLastStep ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canAdvance || isLoading}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-[#2B7A78] to-[#1B5250] hover:from-[#236866] hover:to-[#15413f] text-white text-xs font-extrabold rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
              <span>Guardando en BD...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar y Guardar Vacuna</span>
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={!canAdvance || isLoading}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>Siguiente</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default VacunacionNavegacion;