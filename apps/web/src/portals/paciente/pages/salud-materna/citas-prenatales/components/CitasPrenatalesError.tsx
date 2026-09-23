// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/citas-prenatales/components/CitasPrenatalesError.tsx
// DESCRIPCIÓN: Estado de error con reintento offline-first.
// =========================================================================

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface CitasPrenatalesErrorProps {
  message?: string;
  onRetry: () => void;
}

export const CitasPrenatalesError: React.FC<CitasPrenatalesErrorProps> = ({
  message,
  onRetry,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-rose-200/80 p-8 text-center select-none shadow-sm space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto shadow-xs">
        <AlertCircle className="w-6 h-6 stroke-2" />
      </div>

      <div className="space-y-1 max-w-md mx-auto">
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
          No pudimos sincronizar tus citas prenatales
        </h3>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          {message || 'Ocurrió un inconveniente al cargar las citas obstétricas. Si estás sin conexión, tus datos locales permanecen protegidos.'}
        </p>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Reintentar Conexión</span>
      </button>
    </div>
  );
};

export default CitasPrenatalesError;