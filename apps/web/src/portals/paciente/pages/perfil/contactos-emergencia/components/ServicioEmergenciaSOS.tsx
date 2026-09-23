// =========================================================================
// ARCHIVO: ServicioEmergenciaSOS.tsx
// DESCRIPCIÓN: Barra de marcación médica inmediata SOS con estilo minimalista.
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
    <div className="w-full rounded-2xl bg-white border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Indicador SOS */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-150 text-rose-600 flex items-center justify-center font-black text-[11px] shrink-0">
          SOS
        </div>
        <div>
          <h3 className="text-xs sm:text-[13px] font-bold text-slate-800">
            Llamada de Asistencia Inmediata
          </h3>
          <p className="text-[11px] text-slate-400 font-normal">
            Marcación rápida directa para situaciones de urgencia vital.
          </p>
        </div>
      </div>

      {/* Botones de Marcación Rápida */}
      <div className="flex items-center gap-2 shrink-0">
        <a
          href="tel:132"
          className="h-8 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/70 text-xs font-semibold inline-flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
        >
          <Ambulance className="w-3.5 h-3.5" />
          <span>Llamar al 132 (SEM)</span>
        </a>

        {primaryContact && (
          <a
            href={`tel:${cleanPhone}`}
            className="h-8 px-3 rounded-lg bg-teal-50 hover:bg-teal-100 text-[#1c5752] border border-teal-200/70 text-xs font-semibold inline-flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            title={`Llamar a ${primaryContact.firstName}`}
          >
            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
            <span className="truncate max-w-[130px]">Llamar a {primaryContact.firstName}</span>
            <PhoneCall className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};

export default ServicioEmergenciaSOS;