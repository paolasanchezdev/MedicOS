// =========================================================================
// ARCHIVO: ContactosEmergenciaEmpty.tsx
// DESCRIPCIÓN: Estado vacío amigable y limpio.
// =========================================================================

import React from 'react';
import { Users, Plus } from 'lucide-react';

interface ContactosEmergenciaEmptyProps {
  onAddContact: () => void;
}

export const ContactosEmergenciaEmpty: React.FC<ContactosEmergenciaEmptyProps> = ({
  onAddContact,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3.5">
      <div className="w-12 h-12 rounded-full bg-[#EEF7F8] text-[#166E7A] flex items-center justify-center">
        <Users className="w-6 h-6 stroke-[1.8]" />
      </div>

      <div className="space-y-1 max-w-sm">
        <h3 className="text-base font-semibold text-[#1A282D]">
          No tienes contactos de emergencia
        </h3>
        <p className="text-xs sm:text-sm text-[#52656C] leading-relaxed font-normal">
          Agrega una persona de confianza para mantener actualizada esta información.
        </p>
      </div>

      <button
        type="button"
        onClick={onAddContact}
        className="h-10 px-4 rounded-[10px] bg-[#166E7A] hover:bg-[#125862] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>Agregar contacto</span>
      </button>
    </div>
  );
};

export default ContactosEmergenciaEmpty;