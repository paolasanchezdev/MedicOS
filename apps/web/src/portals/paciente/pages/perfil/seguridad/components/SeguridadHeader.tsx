// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/seguridad/components/SeguridadHeader.tsx
// DESCRIPCIÓN: Header institucional verde oficial con badge de protección de cuenta.
// =========================================================================

import React from 'react';
import { ShieldCheck, Check } from 'lucide-react';

interface SeguridadHeaderProps {
  successMessage?: string | null;
}

export const SeguridadHeader: React.FC<SeguridadHeaderProps> = ({ successMessage }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#1c5752] p-6 sm:p-7 text-white shadow-xs">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[11px] font-medium text-teal-100 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-200" />
            <span>Protección y Acceso · Portal Paciente</span>
          </div>

          <h1 className="text-2xl sm:text-[26px] font-black tracking-tight text-white">
            Seguridad de la cuenta
          </h1>
          <p className="text-xs sm:text-[13px] text-teal-100/90 font-normal leading-relaxed">
            Administra tus credenciales de acceso, revisa los dispositivos activos y supervisa la actividad reciente en MedicOS.
          </p>
        </div>

        {/* Micro-banner de éxito reactivo */}
        {successMessage ? (
          <div className="shrink-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#1c5752] text-xs font-bold shadow-xs animate-in fade-in slide-in-from-top-1">
            <Check className="w-3.5 h-3.5 stroke-3 text-emerald-700" />
            <span>{successMessage}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SeguridadHeader;