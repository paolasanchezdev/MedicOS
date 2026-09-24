// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/seguridad/components/SesionesActivasCard.tsx
// DESCRIPCIÓN: Lista agrupada de dispositivos con sesiones autorizadas.
// =========================================================================

import React from 'react';
import { SeguridadSection } from './SeguridadSection.js';
import { SesionActivaItem } from './SesionActivaItem.js';
import type { UserSession } from '../../../../../../modules/patients/types/patient-security.types.js';

interface SesionesActivasCardProps {
  sessions: UserSession[];
  onCloseSession: (session: UserSession) => void;
}

export const SesionesActivasCard: React.FC<SesionesActivasCardProps> = ({
  sessions,
  onCloseSession,
}) => {
  return (
    <SeguridadSection
      title="Dispositivos y Sesiones Activas"
      footerNote="Si observas un dispositivo desconocido, ciérralo de inmediato y actualiza tu contraseña de acceso."
    >
      {sessions.map((session) => (
        <SesionActivaItem
          key={session.id}
          session={session}
          onCloseSession={onCloseSession}
        />
      ))}
    </SeguridadSection>
  );
};

export default SesionesActivasCard;