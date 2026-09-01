// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/vacunacion/registro/components/VacunacionPasosBar.tsx
// DESCRIPCIÓN: Barra unificada de Pasos y Navegación (Anterior / Siguiente / Guardar)
//              ubicada directamente debajo del Header, eliminando la barra inferior.
// =========================================================================

import React from 'react';
import {
  Check,
  User,
  Syringe,
  Layers,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  CheckCircle2,
} from 'lucide-react';

export interface VacunacionPasosBarProps {
  currentStep: number;
  totalSteps?: number;
  canAdvance: boolean;
  isLoading: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

interface StepDef {
  number: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepDef[] = [
  {
    number: 1,
    title: 'Paciente y Vacuna',
    subtitle: 'Padrón y Biológico',
    icon: Syringe,
  },
  {
    number: 2,
    title: 'Lote y Aplicación',
    subtitle: 'Vía, Sitio y Lote',
    icon: Layers,
  },
  {
    number: 3,
    title: 'Reacciones y Notas',
    subtitle: 'ESAVI y Consejería',
    icon: User,
  },
  {
    number: 4,
    title: 'Confirmación',
    subtitle: 'Guardado Oficial',
    icon: ShieldCheck,
  },
];

export const VacunacionPasosBar: React.FC<VacunacionPasosBarProps> = ({
  currentStep,
  totalSteps = 4,
  canAdvance,
  isLoading,
  onPrev,
  onNext,
  onSubmit,
}) => {
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-2 sm:p-2.5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-2.5 shrink-0">
      {/* Botón Anterior */}
      <button
        type="button"
        onClick={onPrev}
        disabled={currentStep === 1 || isLoading}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shrink-0 w-full md:w-auto justify-center"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Anterior</span>
      </button>

      {/* Grid Central con los 4 Pasos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 flex-1 w-full">
        {STEPS.map((step) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <div
              key={step.number}
              className={`p-2 rounded-xl border transition-all flex items-center gap-2 ${
                isCurrent
                  ? 'bg-teal-50/90 border-teal-600 shadow-2xs ring-1 ring-teal-500/20'
                  : isCompleted
                  ? 'bg-slate-50/90 border-slate-200/90 text-slate-800'
                  : 'bg-slate-50/40 border-slate-200/50 text-slate-400'
              }`}
            >
              {/* Indicador Numérico o Check */}
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                  isCurrent
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5 stroke-3" /> : step.number}
              </div>

              {/* Textos del Paso */}
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[8px] font-bold uppercase tracking-wider leading-none ${
                    isCurrent ? 'text-teal-800' : isCompleted ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  Paso {step.number} de {totalSteps}
                </p>
                <h4
                  className={`text-[11px] font-extrabold truncate mt-0.5 leading-tight ${
                    isCurrent ? 'text-slate-950' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {step.title}
                </h4>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón Siguiente / Guardar */}
      <div className="shrink-0 w-full md:w-auto">
        {isLastStep ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canAdvance || isLoading}
            className="inline-flex items-center justify-center gap-1.5 px-4.5 py-2 bg-linear-to-r from-[#2B7A78] to-[#1B5250] hover:from-[#236866] hover:to-[#15413f] text-white text-xs font-extrabold rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full md:w-auto"
          >
            {isLoading ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirmar y Guardar</span>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={!canAdvance || isLoading}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full md:w-auto"
          >
            <span>Siguiente</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default VacunacionPasosBar;