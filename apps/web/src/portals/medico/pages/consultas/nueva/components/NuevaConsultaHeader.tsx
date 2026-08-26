// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/consultas/nueva/components/NuevaConsultaHeader.tsx
// DESCRIPCIÓN: Cabecera superior de la estación clínica del médico.
// =========================================================================

import React from 'react';
import { Stethoscope, ShieldCheck } from 'lucide-react';

export const NuevaConsultaHeader: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#0e7490] shrink-0">
          <Stethoscope size={22} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Estación de Consulta Médica
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
            Registro clínico integral, diagnóstico CIE-10, prescripción y plan terapéutico.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="px-3 py-1.5 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold rounded-xl flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-teal-600" />
          <span>Atención Médica Activa</span>
        </span>
      </div>
    </div>
  );
};

export default NuevaConsultaHeader;