// =========================================================================
// ARCHIVO: ContactosEmergenciaHeader.tsx
// DESCRIPCIÓN: Header en banner verde con badge superior y botón blanco,
//              idéntico al del Dashboard Oficial de MedicOS.
// =========================================================================

import React from 'react';
import { Shield, Plus } from 'lucide-react';

interface ContactosEmergenciaHeaderProps {
  onAddContact: () => void;
}

export const ContactosEmergenciaHeader: React.FC<ContactosEmergenciaHeaderProps> = ({
  onAddContact,
}) => {
  return (
    <div className="w-full rounded-2xl bg-[#1c5752] text-white p-6 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#164743]">
      {/* Fondo con trazo médico sutil */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative z-10 space-y-1.5">
        {/* Badge superior traslúcido */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-100 text-xs font-semibold border border-white/10 backdrop-blur-xs">
          <Shield className="w-3.5 h-3.5 text-teal-300" />
          <span>Directorio Oficial · Portal Paciente</span>
        </span>

        <div className="flex items-center gap-2.5 pt-1">
          <h1 className="text-2xl sm:text-[26px] font-extrabold tracking-tight text-white">
            Contactos de emergencia
          </h1>
        </div>

        <p className="text-xs sm:text-sm text-teal-100/80 max-w-xl font-normal leading-relaxed">
          Mantén actualizadas las personas que pueden ser contactadas cuando sea necesario durante tu atención médica.
        </p>
      </div>

      {/* Botón de acción blanco a la derecha */}
      <div className="relative z-10 shrink-0">
        <button
          type="button"
          onClick={onAddContact}
          className="h-10 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          aria-label="Agregar contacto de emergencia"
        >
          <Plus className="w-4 h-4 text-[#1c5752] stroke-[2.5]" />
          <span>Agregar contacto</span>
        </button>
      </div>
    </div>
  );
};

export default ContactosEmergenciaHeader;