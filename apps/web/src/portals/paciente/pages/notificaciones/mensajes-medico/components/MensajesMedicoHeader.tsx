// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/notificaciones/mensajes-medico/components/MensajesMedicoHeader.tsx
// DESCRIPCIÓN: Cabecera institucional MedicOS (#1c5752) con la misma estructura,
//              proporciones y jerarquía que Constancias Médicas Oficiales.
// =========================================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  ShieldCheck,
  Bell,
} from 'lucide-react';

export const MensajesMedicoHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#1c5752] rounded-3xl border border-[#164743] p-6 sm:p-7 shadow-xs text-white select-none shrink-0 relative overflow-hidden">
      {/* Pastilla Superior Institucional */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-teal-200 text-xs font-semibold mb-3">
        <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
        <span>Canal Oficial de Seguimiento · Red de Atención Médica MedicOS 2026</span>
      </div>

      {/* Fila Principal: Título, Descripción y Botón Lateral */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <MessageSquare className="w-7 h-7 sm:w-8 text-teal-200 shrink-0" />
            <span>Mensajes con el Médico</span>
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 font-medium mt-1.5 max-w-2xl leading-relaxed">
            Consulta y da seguimiento a tus indicaciones médicas con los profesionales de salud a partir de tus atenciones clínicas y brigadas territoriales registradas.
          </p>
        </div>

        {/* Botón Lateral Translúcido */}
        <button
          type="button"
          onClick={() => navigate('/paciente/notificaciones/centro')}
          className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition flex items-center gap-2 self-start md:self-auto cursor-pointer shadow-xs active:scale-95 shrink-0"
        >
          <Bell className="w-4 h-4 text-teal-200" />
          <span>Centro de Notificaciones</span>
        </button>
      </div>
    </div>
  );
};

export default MensajesMedicoHeader;