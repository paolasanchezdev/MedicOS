// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/documentos/constancias/components/ConstanciasError.tsx
// DESCRIPCIÓN: Componente para manejo de errores de carga.
// =========================================================================

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ConstanciasErrorProps {
  message: string;
  onRetry: () => void;
}

export const ConstanciasError: React.FC<ConstanciasErrorProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-white rounded-3xl border border-rose-200 p-8 text-center space-y-3 select-none">
      <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-1 max-w-sm mx-auto">
        <h3 className="text-sm font-black text-slate-900">No pudimos cargar tus constancias</h3>
        <p className="text-xs text-slate-500 font-medium">{message}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer mx-auto"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Intentar nuevamente</span>
      </button>
    </div>
  );
};

export default ConstanciasError;