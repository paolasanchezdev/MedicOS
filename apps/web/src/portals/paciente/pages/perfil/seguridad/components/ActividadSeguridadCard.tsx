// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/seguridad/components/ActividadSeguridadCard.tsx
// DESCRIPCIÓN: Historial real de accesos alimentado por la tabla AuditLog de PostgreSQL.
// =========================================================================

import React from 'react';
import { Clock, ShieldCheck, KeyRound, LogOut, ShieldAlert } from 'lucide-react';
import { SeguridadSection } from './SeguridadSection.js';
import type { SecurityEvent } from '../../../../../../modules/patients/types/patient-security.types.js';

interface ActividadSeguridadCardProps {
  events: SecurityEvent[];
}

export const ActividadSeguridadCard: React.FC<ActividadSeguridadCardProps> = ({ events }) => {
  const getEventIcon = (type: SecurityEvent['type']) => {
    switch (type) {
      case 'PASSWORD_CHANGED':
        return { icon: KeyRound, color: 'text-[#105F68]', bg: 'bg-teal-50' };
      case 'SESSION_TERMINATED':
      case 'LOGOUT':
        return { icon: LogOut, color: 'text-amber-600', bg: 'bg-amber-50' };
      default:
        return { icon: ShieldCheck, color: 'text-emerald-700', bg: 'bg-emerald-50' };
    }
  };

  return (
    <SeguridadSection
      title="Actividad de Seguridad Reciente"
      footerNote="Trazabilidad protegida por el registro oficial de auditoría en la base de datos de MedicOS."
    >
      {events.length === 0 ? (
        <div className="py-6 px-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 text-slate-300" />
          <span>No hay eventos de seguridad registrados recientemente.</span>
        </div>
      ) : (
        events.map((evt) => {
          const conf = getEventIcon(evt.type);
          const Icon = conf.icon;

          return (
            <div
              key={evt.id}
              className="min-h-16 px-4 sm:px-5 py-3.5 flex items-center justify-between gap-4 bg-white"
            >
              <div className="flex items-center gap-3.5 min-w-0 pr-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${conf.bg} ${conf.color}`}
                >
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-800 tracking-tight">
                    {evt.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-normal leading-relaxed truncate">
                    {evt.description}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-300" />
                <span>{evt.timestamp}</span>
              </div>
            </div>
          );
        })
      )}
    </SeguridadSection>
  );
};

export default ActividadSeguridadCard;