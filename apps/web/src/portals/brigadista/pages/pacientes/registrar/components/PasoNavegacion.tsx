// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/registrar/components/PasoNavegacion.tsx
// DESCRIPCIÓN: Barra de navegación inferior entre pasos del carrusel.
// =========================================================================

import React from 'react';
import { ArrowLeft, ArrowRight, UserPlus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PasoNavegacionProps {
  currentStep: number;
  totalSteps: number;
  loading: boolean;
  canSubmit: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export const PasoNavegacion: React.FC<PasoNavegacionProps> = ({
  currentStep,
  totalSteps,
  loading,
  canSubmit,
  onPrev,
  onNext,
  onSubmit,
}) => {
  const navigate = useNavigate();
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Botón Volver / Cancelar */}
      {isFirstStep ? (
        <button
          type="button"
          onClick={() => navigate('/brigadista/pacientes/buscar')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
        >
          Cancelar Registro
        </button>
      ) : (
        <button
          type="button"
          onClick={onPrev}
          disabled={loading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Paso Anterior</span>
        </button>
      )}

      {/* Botón Siguiente / Enviar */}
      {isLastStep ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || !canSubmit}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Registrando en Base de Datos...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Finalizar y Crear Carnet</span>
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <span>Siguiente Paso</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};