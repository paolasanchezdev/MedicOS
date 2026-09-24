// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/contactos-emergencia/components/ServicioEmergenciaSOS.tsx
// DESCRIPCIÓN: Barra de emergencias limpia en blanco neutro con botones sutiles.
// =========================================================================

import React from 'react';
import { PhoneCall, Ambulance, Star } from 'lucide-react';
import type { EmergencyContact } from '../../../../../../modules/patients/types/emergency-contacts.types.js';

interface ServicioEmergenciaSOSProps {
  primaryContact: EmergencyContact | null;
}

export const ServicioEmergenciaSOS: React.FC<ServicioEmergenciaSOSProps> = ({
  primaryContact,
}) => {
  const cleanPhone = primaryContact?.primaryPhone.replace(/\s+/g, '') || '';

  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200/80 p-4 sm:px-5 sm:py-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Texto de Asistencia Rápida */}
      <div className="flex items-center gap-3">
        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 font-mono tracking-wider">
          SOS
        </span>

        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-800">
            Llamada de Asistencia Inmediata
          </h3>
          <p className="text-[11px] text-slate-400 font-normal">
            Marcación directa para situaciones de urgencia vital nacional o familiar.
          </p>
        </div>
      </div>

      {/* Botones de Marcación en Línea */}
      <div className="flex items-center gap-2 shrink-0">
        <a
          href="tel:132"
          className="h-8.5 px-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium inline-flex items-center gap-1.5 transition cursor-pointer"
        >
          <Ambulance className="w-3.5 h-3.5 text-slate-500" />
          <span>Llamar al 132 (SEM)</span>
        </a>

        {primaryContact ? (
          <a
            href={`tel:${cleanPhone}`}
            className="h-8.5 px-3.5 rounded-xl bg-[#1c5752] hover:bg-[#164743] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer"
            title={`Llamar a ${primaryContact.firstName}`}
          >
            <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
            <span>Llamar a {primaryContact.firstName}</span>
            <PhoneCall className="w-3 h-3 ml-0.5" />
          </a>
        ) : null}
      </div>
    </div>
  );
};

export default ServicioEmergenciaSOS;