// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/datos-personales/components/CarnetOficialCard.tsx
// DESCRIPCIÓN: Contenedor que renderiza el componente oficial CarnetDigitalPaciente
//              con giro 3D interactivo, escaneo QR y descarga/impresión.
// =========================================================================

import React, { useMemo } from 'react';
import { CarnetDigitalPaciente, type PacienteCarnetData } from '../../../../../../shared/components/carnet/CarnetDigitalPaciente.js';
import type { PatientPersonalDataProfile } from '../../../../../../modules/patients/types/patient-personal-data.types.js';

interface CarnetOficialCardProps {
  profile: PatientPersonalDataProfile;
  displayName: string;
}

export const CarnetOficialCard: React.FC<CarnetOficialCardProps> = ({ profile, displayName }) => {
  // Mapeo riguroso de las propiedades al contrato del carnet oficial
  const carnetData = useMemo<PacienteCarnetData>(() => {
    return {
      id: profile.id,
      expediente: profile.medicosId,
      dui: profile.dui,
      nombres: profile.firstName,
      apellidos: profile.lastName,
      fullName: displayName,
      fechaNacimiento: profile.dateOfBirth,
      sexo: profile.sex,
      fotoUrl: profile.avatarUrl,
      telefono: profile.phone,
      direccion: profile.address,
      municipio: profile.municipality,
      department: profile.department,
      distrito: profile.district || profile.municipality,
      tipoSangre: 'O+',
      alergiasTexto: 'Ninguna',
      enfermedadesTexto: 'Ninguna',
      medicacionTexto: 'Ninguna',
      observacionesTexto: 'Carnet Oficial de Identificación MedicOS 2026',
    };
  }, [profile, displayName]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 select-none flex flex-col items-center">
      <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div>
          <h3 className="text-sm font-black text-slate-900 tracking-tight">
            Credencial Oficial MedicOS
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">
            Carnet territorial con código QR y certificación digital oficial.
          </p>
        </div>

        <span className="text-[10.5px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-[#1c5752] border border-teal-200">
          Válido en Brigadas
        </span>
      </div>

      {/* Renderizado del Carnet Oficial 3D */}
      <div className="w-full flex justify-center py-1">
        <CarnetDigitalPaciente paciente={carnetData} only3D={true} />
      </div>
    </div>
  );
};

export default CarnetOficialCard;