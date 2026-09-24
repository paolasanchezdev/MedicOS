// =========================================================================
// ARCHIVO: AparienciaPreferenciasCard.tsx
// DESCRIPCIÓN: Configuración de escala tipográfica con ícono visual.
// =========================================================================

import React from 'react';
import { Type } from 'lucide-react';
import { PreferenciasSection } from './PreferenciasSection.js';
import { PreferenciaRow } from './PreferenciaRow.js';
import { PreferenciaSelect, type SelectOption } from './PreferenciaSelect.js';
import type {
  PatientAppPreferences,
  FontSize,
} from '../../../../../../modules/patients/types/patient-preferences.types.js';

interface AparienciaPreferenciasCardProps {
  preferences: PatientAppPreferences;
  onUpdate: <K extends keyof PatientAppPreferences>(key: K, value: PatientAppPreferences[K]) => void;
}

const FONT_OPTIONS: SelectOption<FontSize>[] = [
  { value: 'small', label: 'Compacto' },
  { value: 'normal', label: 'Normal' },
  { value: 'large', label: 'Amplio' },
];

export const AparienciaPreferenciasCard: React.FC<AparienciaPreferenciasCardProps> = ({
  preferences,
  onUpdate,
}) => {
  return (
    <PreferenciasSection
      title="Lectura y Visualización"
      footerNote="MedicOS utiliza la paleta clínica oficial para garantizar descanso visual y legibilidad óptima."
    >
      <PreferenciaRow
        title="Tamaño del texto"
        description="Ajusta la escala tipográfica para facilitar la lectura de recetas, dosis y diagnósticos."
        icon={Type}
        iconBg="bg-teal-50"
        iconColor="text-[#105F68]"
      >
        <PreferenciaSelect
          value={preferences.tamanoTexto}
          options={FONT_OPTIONS}
          onChange={(val) => onUpdate('tamanoTexto', val)}
        />
      </PreferenciaRow>
    </PreferenciasSection>
  );
};

export default AparienciaPreferenciasCard;