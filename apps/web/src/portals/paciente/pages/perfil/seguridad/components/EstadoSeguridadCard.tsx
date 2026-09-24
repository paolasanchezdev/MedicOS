// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/seguridad/components/EstadoSeguridadCard.tsx
// DESCRIPCIÓN: Tarjeta de estado de seguridad con datos reales de PostgreSQL.
// =========================================================================

import React from 'react';
import { KeyRound, Shield, Laptop } from 'lucide-react';
import { SeguridadSection } from './SeguridadSection.js';
import { SeguridadRow } from './SeguridadRow.js';
import type { SecurityStatus } from '../../../../../../modules/patients/types/patient-security.types.js';

interface EstadoSeguridadCardProps {
  status: SecurityStatus | null;
  onChangePasswordClick: () => void;
  onTwoFactorClick: () => void;
}

export const EstadoSeguridadCard: React.FC<EstadoSeguridadCardProps> = ({
  status,
  onChangePasswordClick,
  onTwoFactorClick,
}) => {
  return (
    <SeguridadSection title="Estado de la Cuenta">
      <SeguridadRow
        title="Contraseña"
        description="Clave de acceso confidencial a MedicOS"
        icon={KeyRound}
        iconBg="bg-teal-50"
        iconColor="text-[#105F68]"
        clickable
        onClick={onChangePasswordClick}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">
            {status?.passwordLastChanged || 'Consultando...'}
          </span>
          <span className="text-xs font-bold text-[#166E7A] bg-[#EEF7F8] px-2.5 py-1 rounded-full border border-[#D3E8EC]">
            Cambiar ›
          </span>
        </div>
      </SeguridadRow>

      <SeguridadRow
        title="Verificación en dos pasos (2FA)"
        description="Capa adicional de autenticación con dispositivo seguro"
        icon={Shield}
        iconBg="bg-amber-50"
        iconColor="text-amber-600"
        clickable
        onClick={onTwoFactorClick}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/80">
            {status?.twoFactorEnabled ? 'Activada' : 'No configurada'}
          </span>
          <span className="text-xs text-slate-400">›</span>
        </div>
      </SeguridadRow>

      <SeguridadRow
        title="Sesiones activas"
        description="Equipos con permisos de acceso concedidos"
        icon={Laptop}
        iconBg="bg-sky-50"
        iconColor="text-sky-600"
      >
        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
          {status?.activeSessionsCount || 1} dispositivo activo
        </span>
      </SeguridadRow>
    </SeguridadSection>
  );
};

export default EstadoSeguridadCard;