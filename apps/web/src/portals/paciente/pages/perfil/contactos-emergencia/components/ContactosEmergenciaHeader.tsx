// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/contactos-emergencia/components/ContactosEmergenciaHeader.tsx
// DESCRIPCIÓN: Header institucional verde oficial de MedicOS.
// =========================================================================

import React from 'react';
import { Plus, Shield } from 'lucide-react';

interface ContactosEmergenciaHeaderProps {
  onAddContact: () => void;
}

export const ContactosEmergenciaHeader: React.FC<ContactosEmergenciaHeaderProps> = ({
  onAddContact,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#1c5752] p-6 sm:p-7 text-white shadow-xs">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[11px] font-medium text-teal-100 border border-white/10">
            <Shield className="w-3.5 h-3.5 text-teal-200" />
            <span>Directorio Oficial · Portal Paciente</span>
          </div>

          <h1 className="text-2xl sm:text-[26px] font-black tracking-tight text-white">
            Contactos de emergencia
          </h1>
          <p className="text-xs sm:text-[13px] text-teal-100/90 font-normal leading-relaxed">
            Mantén actualizadas las personas que pueden ser contactadas cuando sea necesario durante tu atención médica.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddContact}
          className="h-10 px-4 rounded-xl bg-white hover:bg-teal-50 text-[#1c5752] text-xs font-bold inline-flex items-center justify-center gap-2 shadow-sm transition active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-3" />
          <span>Agregar contacto</span>
        </button>
      </div>
    </div>
  );
};

export default ContactosEmergenciaHeader;