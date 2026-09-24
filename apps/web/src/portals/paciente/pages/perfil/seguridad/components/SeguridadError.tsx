// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/seguridad/components/SeguridadError.tsx
// DESCRIPCIÓN: Estado de error con botón de reintento.
// =========================================================================

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface SeguridadErrorProps {
  onRetry: () => void;
}

export const SeguridadError: React.FC<SeguridadErrorProps> = ({ onRetry }) => {
  return (
    <div className="rounded-2xl bg-white border border-rose-200 p-8 text-center space-y-3">
      <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-1 max-w-sm mx-auto">
        <h3 className="text-sm font-bold text-slate-900">
          No se pudieron cargar los datos de seguridad
        </h3>
        <p className="text-xs text-slate-500">
          Ocurrió un problema al consultar la información de acceso. Intenta nuevamente.
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="px-4 py-2 rounded-xl bg-[#166E7A] text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Reintentar</span>
      </button>
    </div>
  );
};

export default SeguridadError;