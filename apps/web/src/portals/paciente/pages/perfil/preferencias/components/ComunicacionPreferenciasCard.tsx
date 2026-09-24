// =========================================================================
// ARCHIVO: ComunicacionPreferenciasCard.tsx
// DESCRIPCIÓN: Configuración de avisos del sistema y jornadas con íconos.
// =========================================================================

import React from 'react';
import { MailCheck, ShieldCheck } from 'lucide-react';
import { PreferenciasSection } from './PreferenciasSection.js';
import { PreferenciaRow } from './PreferenciaRow.js';
import { PreferenciaToggle } from './PreferenciaToggle.js';
import type { PatientAppPreferences } from '../../../../../../modules/patients/types/patient-preferences.types.js';

interface ComunicacionPreferenciasCardProps {
  preferences: PatientAppPreferences;
  onUpdate: <K extends keyof PatientAppPreferences>(key: K, value: PatientAppPreferences[K]) => void;
}

export const ComunicacionPreferenciasCard: React.FC<ComunicacionPreferenciasCardProps> = ({
  preferences,
  onUpdate,
}) => {
  return (
    <PreferenciasSection title="Comunicación Institucional">
      <PreferenciaRow
        title="Boletines comunitarios y jornadas"
        description="Avisos sobre jornadas de salud, brigadas médicas móviles y ferias de vacunación en tu municipio."
        icon={MailCheck}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-700"
      >
        <PreferenciaToggle
          checked={preferences.comunicacionesEmail}
          onChange={(val) => onUpdate('comunicacionesEmail', val)}
          label="Alternar comunicaciones de jornadas"
        />
      </PreferenciaRow>

      <PreferenciaRow
        title="Avisos de mantenimiento del sistema"
        description="Notificaciones sobre mejoras y sincronizaciones operativas de la plataforma MedicOS."
        icon={ShieldCheck}
        iconBg="bg-teal-50"
        iconColor="text-[#105F68]"
      >
        <PreferenciaToggle
          checked={preferences.avisosSistema}
          onChange={(val) => onUpdate('avisosSistema', val)}
          label="Alternar avisos del sistema"
        />
      </PreferenciaRow>
    </PreferenciasSection>
  );
};

export default ComunicacionPreferenciasCard;