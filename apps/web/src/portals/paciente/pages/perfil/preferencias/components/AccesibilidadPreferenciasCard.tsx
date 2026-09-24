// =========================================================================
// ARCHIVO: AccesibilidadPreferenciasCard.tsx
// DESCRIPCIÓN: Opciones de accesibilidad visual y confort motor con íconos.
// =========================================================================

import React from 'react';
import { Eye, ZapOff } from 'lucide-react';
import { PreferenciasSection } from './PreferenciasSection.js';
import { PreferenciaRow } from './PreferenciaRow.js';
import { PreferenciaToggle } from './PreferenciaToggle.js';
import type { PatientAppPreferences } from '../../../../../../modules/patients/types/patient-preferences.types.js';

interface AccesibilidadPreferenciasCardProps {
  preferences: PatientAppPreferences;
  onUpdate: <K extends keyof PatientAppPreferences>(key: K, value: PatientAppPreferences[K]) => void;
}

export const AccesibilidadPreferenciasCard: React.FC<AccesibilidadPreferenciasCardProps> = ({
  preferences,
  onUpdate,
}) => {
  return (
    <PreferenciasSection title="Accesibilidad">
      <PreferenciaRow
        title="Mayor contraste"
        description="Refuerza bordes e indicadores visuales para mejorar la visibilidad con luz solar directa."
        icon={Eye}
        iconBg="bg-sky-50"
        iconColor="text-sky-700"
      >
        <PreferenciaToggle
          checked={preferences.mayorContraste}
          onChange={(val) => onUpdate('mayorContraste', val)}
          label="Alternar mayor contraste"
        />
      </PreferenciaRow>

      <PreferenciaRow
        title="Reducir animaciones"
        description="Minimiza las transiciones y efectos de movimiento para evitar fatiga ocular."
        icon={ZapOff}
        iconBg="bg-amber-50"
        iconColor="text-amber-700"
      >
        <PreferenciaToggle
          checked={preferences.reducirAnimaciones}
          onChange={(val) => onUpdate('reducirAnimaciones', val)}
          label="Alternar reducción de animaciones"
        />
      </PreferenciaRow>
    </PreferenciasSection>
  );
};

export default AccesibilidadPreferenciasCard;