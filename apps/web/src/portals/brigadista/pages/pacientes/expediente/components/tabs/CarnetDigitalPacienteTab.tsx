// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/expediente/components/tabs/CarnetDigitalPacienteTab.tsx
// DESCRIPCIÓN: Pestaña que integra el Carnet Digital y la Hoja Oficial de Emisión.
// =========================================================================

import React from 'react';
import { CarnetDigitalPaciente, type PacienteCarnetData } from '../../../registrar/components/CarnetDigitalPaciente';
import type { PatientHistoryData } from '../../../../../../../modules/patients';

interface CarnetDigitalPacienteTabProps {
  historyData: PatientHistoryData;
}

export const CarnetDigitalPacienteTab: React.FC<CarnetDigitalPacienteTabProps> = ({ historyData }) => {
  const { patient } = historyData;
  const cleanDui = patient.dui ? patient.dui.replace(/[^0-9]/g, '') : '';
  const expedienteNum = cleanDui ? `EXP-2026-${cleanDui.slice(-4)}` : `EXP-${patient.id.slice(0, 8).toUpperCase()}`;

  const pacienteData: PacienteCarnetData = {
    id: patient.id,
    expediente: expedienteNum,
    dui: patient.dui,
    nombres: patient.firstName,
    apellidos: patient.lastName,
    fechaNacimiento: patient.dateOfBirth,
    sexo: patient.sex,
    tipoSangre: patient.clinicalRecord?.bloodType || 'UNKNOWN',
    telefono: patient.phone,
    direccion: patient.address,
    alergiasTexto: patient.clinicalRecord?.observations || 'Ninguna reportada',
    enfermedadesTexto: patient.clinicalRecord?.familyHistory || 'Ninguna registrada',
    contactoEmergencia: {
      nombre: patient.emergencyName,
      telefono: patient.emergencyPhone,
      parentesco: patient.emergencyRelation,
    },
    fechaCreacion: patient.createdAt,
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-sm">
      <CarnetDigitalPaciente paciente={pacienteData} />
    </div>
  );
};