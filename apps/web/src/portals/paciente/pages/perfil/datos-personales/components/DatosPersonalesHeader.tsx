// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/datos-personales/components/DatosPersonalesHeader.tsx
// DESCRIPCIÓN: Encabezado limpio de la sección Datos Personales.
// =========================================================================

import React from 'react';
import { UserCheck } from 'lucide-react';

export const DatosPersonalesHeader: React.FC = () => {
  return (
    <div className="select-none shrink-0 pb-1">
      <div className="flex items-center gap-2">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-[#1c5752]" />
          Datos Personales
        </h1>
        <span className="text-[11px] font-bold text-[#1c5752] bg-teal-50 border border-teal-200/80 px-2.5 py-0.5 rounded-full font-mono">
          Mi Perfil
        </span>
      </div>
      <p className="text-xs text-slate-500 font-medium mt-0.5">
        Administra la información asociada a tu perfil en MedicOS.
      </p>
    </div>
  );
};

export default DatosPersonalesHeader;