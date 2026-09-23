// =========================================================================
// ARCHIVO: ContactosEmergenciaInfoCard.tsx
// DESCRIPCIÓN: Micro-banner de privacidad sutil y compacto.
// =========================================================================

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const ContactosEmergenciaInfoCard: React.FC = () => {
  return (
    <div className="w-full rounded-xl bg-slate-50 border border-slate-200/60 px-3.5 py-2 flex items-center gap-2.5 text-xs text-slate-500">
      <ShieldCheck className="w-4 h-4 text-[#1c5752] shrink-0" />
      <span className="font-normal">
        <strong className="text-slate-700 font-semibold">Uso confidencial:</strong> Estos datos son consultados exclusivamente por personal de salud autorizado durante una urgencia médica y no tienen acceso a tu expediente clínico.
      </span>
    </div>
  );
};

export default ContactosEmergenciaInfoCard;