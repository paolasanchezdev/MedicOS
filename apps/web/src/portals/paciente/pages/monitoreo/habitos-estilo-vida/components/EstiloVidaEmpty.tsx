// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/monitoreo/habitos-estilo-vida/components/EstiloVidaEmpty.tsx
// DESCRIPCIÓN: Estado vacío para el módulo de hábitos y estilo de vida.
// =========================================================================

import React from 'react';
import { HeartPulse } from 'lucide-react';

export const EstiloVidaEmpty: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center text-xs text-slate-500 shadow-2xs space-y-3.5 max-w-xl mx-auto select-none">
      <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-medicos-teal flex items-center justify-center mx-auto shadow-2xs">
        <HeartPulse className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h2 className="text-base font-black text-slate-900">
          Comienza tu autoseguimiento de hábitos
        </h2>
        <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
          Registra tus horas de sueño, hidratación o actividades físicas diarias para construir tu registro preventivo de autocuidado.
        </p>
      </div>
    </div>
  );
};

export default EstiloVidaEmpty;