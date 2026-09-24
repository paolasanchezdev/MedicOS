// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/seguridad/components/SesionActivaItem.tsx
// DESCRIPCIÓN: Fila de dispositivo conectado con indicación de sesión actual.
// =========================================================================

import React from 'react';
import { Smartphone, Laptop, LogOut } from 'lucide-react';
import type { UserSession } from '../../../../../../modules/patients/types/patient-security.types.js';

interface SesionActivaItemProps {
  session: UserSession;
  onCloseSession: (session: UserSession) => void;
}

export const SesionActivaItem: React.FC<SesionActivaItemProps> = ({
  session,
  onCloseSession,
}) => {
  const isMobile = session.os.toLowerCase().includes('android') || session.os.toLowerCase().includes('ios');
  const Icon = isMobile ? Smartphone : Laptop;

  return (
    <div className="min-h-17 px-4 sm:px-5 py-3.5 flex items-center justify-between gap-4 transition-colors bg-white">
      <div className="flex items-center gap-3.5 min-w-0 pr-2">
        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-600">
          <Icon className="w-4.5 h-4.5 stroke-2" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-800 tracking-tight truncate">
              {session.os} · {session.browser}
            </h4>
            {session.isCurrent ? (
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                Este equipo
              </span>
            ) : null}
          </div>

          <p className="text-xs text-slate-400 font-normal mt-0.5">
            {session.location} · Última actividad: {session.lastActive}
          </p>
        </div>
      </div>

      <div className="shrink-0">
        {session.isCurrent ? (
          <span className="text-xs font-semibold text-slate-400 px-3 py-1">
            Sesión actual
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onCloseSession(session)}
            className="h-8 px-3 rounded-full bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3 h-3" />
            <span>Cerrar sesión</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SesionActivaItem;