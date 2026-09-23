// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/control-embarazo/components/ControlEmbarazoError.tsx
// DESCRIPCIÓN: Estado de error con botón de reintento.
// =========================================================================

import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ControlEmbarazoErrorProps {
  message: string;
  onRetry: () => void;
}

export const ControlEmbarazoError: React.FC<ControlEmbarazoErrorProps> = ({ message, onRetry }) => {
  return (
    <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex flex-col items-center justify-center space-y-3 text-center max-w-md mx-auto select-none">
      <AlertCircle className="w-8 h-8 text-rose-600" />
      <div>
        <p className="font-extrabold text-sm text-rose-900">Error al cargar control de embarazo</p>
        <p className="text-rose-700 mt-0.5">{message}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-rose-300 text-rose-900 rounded-xl text-xs font-bold hover:bg-rose-100/60 transition cursor-pointer shadow-2xs"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reintentar</span>
      </button>
    </div>
  );
};

export default ControlEmbarazoError;