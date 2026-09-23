// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/monitoreo/signos-vitales/components/SignosVitalesError.tsx
// DESCRIPCIÓN: Estado de error offline-ready sin referencias exclusivas a Internet.
// =========================================================================

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface SignosVitalesErrorProps {
  message: string;
  onRetry: () => void;
}

export const SignosVitalesError: React.FC<SignosVitalesErrorProps> = ({
  message,
  onRetry,
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center text-xs text-slate-500 shadow-2xs space-y-3.5 max-w-md mx-auto select-none">
      <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
        <AlertCircle className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h2 className="text-base font-black text-slate-900">
          No pudimos cargar tus signos vitales
        </h2>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          {message || 'No fue posible obtener los registros fisiológicos en este momento.'}
        </p>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-medicos-teal hover:bg-[#16646e] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reintentar</span>
        </button>
      </div>
    </div>
  );
};

export default SignosVitalesError;