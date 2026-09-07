// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/citas/mis-citas/components/MisCitasError.tsx
// DESCRIPCIÓN: Pantalla de error ante fallos de conectividad con la API.
// =========================================================================

import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface MisCitasErrorProps {
  message: string;
  onRetry: () => void;
}

export const MisCitasError: React.FC<MisCitasErrorProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center space-y-4 shadow-2xs">
      <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-black text-rose-900">No pudimos cargar tus citas</h3>
        <p className="text-xs text-rose-700 max-w-md mx-auto">{message}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
      >
        <RefreshCcw className="w-3.5 h-3.5" />
        <span>Intentar nuevamente</span>
      </button>
    </div>
  );
};