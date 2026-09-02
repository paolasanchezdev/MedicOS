// =========================================================================
// ARCHIVO: apps/web/src/shared/components/carnet/OnboardingCarnetPreview.tsx
// DESCRIPCIÓN: Adaptador global del carnet original con hideControls={true}
//              para renderizar limpio en el onboarding sin botones flotantes.
// =========================================================================

import React from 'react';
import { CarnetDigitalPaciente } from './CarnetDigitalPaciente';
import type { OnboardingFormData } from '../../../modules/patients';

interface OnboardingCarnetPreviewProps {
  formData: OnboardingFormData;
  fullName: string;
}

export const OnboardingCarnetPreview: React.FC<OnboardingCarnetPreviewProps> = ({
  formData,
  fullName,
}) => {
  const [nombres, ...resto] = fullName.split(' ');
  const apellidos = resto.join(' ') || 'Paciente';

  const datosAdaptados = {
    expediente: formData.dui ? `EXP-2026-${formData.dui.slice(-4)}` : 'EXP-2026-NUEVO',
    dui: formData.dui || '00000000-0',
    nombres: nombres || 'Paciente',
    apellidos: apellidos,
    fechaNacimiento: formData.dateOfBirth || '2000-01-01',
    sexo: formData.sex,
    tipoSangre: formData.bloodType,
    telefono: formData.phone || 'No registrado',
    direccion: formData.address || `${formData.municipality}, ${formData.department}`,
    distrito: formData.municipality,
    alergiasTexto: formData.allergies || 'Ninguna reportada',
    contactoEmergencia: {
      nombre: formData.emergencyName || 'No asignado',
      parentesco: formData.emergencyRelation || 'Familiar',
      telefono: formData.emergencyPhone || 'No registrado',
    },
  };

  return (
    <div className="w-full">
      <CarnetDigitalPaciente paciente={datosAdaptados} hideControls={true} />
    </div>
  );
};