// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/contactos-emergencia/components/ContactosEmergenciaInfoCard.tsx
// DESCRIPCIÓN: Nota de confidencialidad sutil sin fondos chillantes.
// =========================================================================

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const ContactosEmergenciaInfoCard: React.FC = () => {
  return (
    <div className="w-full px-2 py-1 flex items-center justify-between text-[11.5px] text-slate-400">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <p>
          <strong className="text-slate-600 font-medium">Uso confidencial:</strong> Estos datos son consultados exclusivamente por personal de salud durante una urgencia médica y no tienen acceso a tu expediente clínico.
        </p>
      </div>

      <span className="hidden sm:inline-block text-[11px] text-slate-400 font-medium">
        Expediente Protegido
      </span>
    </div>
  );
};

export default ContactosEmergenciaInfoCard;