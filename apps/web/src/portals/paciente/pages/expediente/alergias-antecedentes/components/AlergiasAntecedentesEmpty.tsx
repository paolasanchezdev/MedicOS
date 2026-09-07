// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/expediente/alergias-antecedentes/components/AlergiasAntecedentesEmpty.tsx
// DESCRIPCIÓN: Estado cuando aún no existen registros clínicos de antecedentes.
// =========================================================================

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const AlergiasAntecedentesEmpty: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-10 text-center space-y-3 shadow-2xs max-w-lg mx-auto my-8">
      <div className="w-14 h-14 bg-teal-50 text-[#2B7A78] rounded-full flex items-center justify-center mx-auto border border-teal-100">
        <ShieldCheck className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
          Expediente Clínico en Blanco
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
          Tus antecedentes patológicos, cirugías y alergias documentadas durante tus atenciones médicas
          aparecerán aquí.
        </p>
      </div>
    </div>
  );
};

export default AlergiasAntecedentesEmpty;