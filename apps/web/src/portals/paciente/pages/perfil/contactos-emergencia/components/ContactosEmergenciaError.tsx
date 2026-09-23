// =========================================================================
// ARCHIVO: ContactosEmergenciaError.tsx
// DESCRIPCIÓN: Manejo de error claro y directo sin detalles técnicos.
// =========================================================================

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ContactosEmergenciaErrorProps {
  onRetry: () => void;
}

export const ContactosEmergenciaError: React.FC<ContactosEmergenciaErrorProps> = ({ onRetry }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center flex flex-col items-center justify-center space-y-3">
      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
        <AlertCircle className="w-5 h-5" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-semibold text-[#1A282D]">
          No pudimos cargar tus contactos
        </h3>
        <p className="text-xs sm:text-sm text-[#52656C]">
          Ocurrió un problema al obtener la información. Intenta nuevamente.
        </p>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="h-10 px-4 rounded-[10px] bg-slate-100 hover:bg-slate-200 text-[#1A282D] text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
      >
        <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
        <span>Reintentar</span>
      </button>
    </div>
  );
};

export default ContactosEmergenciaError;