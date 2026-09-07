// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/expediente/diagnosticos/components/DiagnosticosError.tsx
// DESCRIPCIÓN: Estado de error con botón de reconexión.
// =========================================================================

import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface DiagnosticosErrorProps {
  message: string;
  onRetry: () => void;
}

export const DiagnosticosError: React.FC<DiagnosticosErrorProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-white border border-rose-200 rounded-3xl p-8 text-center space-y-4 shadow-2xs max-w-md mx-auto my-8">
      <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-200">
        <AlertCircle className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-extrabold text-slate-900">
          No pudimos cargar tus diagnósticos
        </h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          {message || 'Verifica la conectividad con la estación de atención o el servidor central.'}
        </p>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Intentar nuevamente</span>
      </button>
    </div>
  );
};

export default DiagnosticosError;