// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/datos-personales/components/IdentificacionMedicOSCard.tsx
// DESCRIPCIÓN: Contenedor que renderiza directamente el componente oficial
//              CarnetDigitalPaciente (idéntico a la primera imagen con Giro 3D).
// =========================================================================

import React, { useMemo } from 'react';
import { IdCard } from 'lucide-react';
import { 
  CarnetDigitalPaciente, 
  type PacienteCarnetData 
} from '../../../../../../shared/components/carnet/CarnetDigitalPaciente.js';
import type { PatientPersonalDataProfile } from '../../../../../../modules/patients/types/patient-personal-data.types.js';

interface IdentificacionMedicOSCardProps {
  profile: PatientPersonalDataProfile;
  onOpenIdentificacionModal?: () => void;
}

export const IdentificacionMedicOSCard: React.FC<IdentificacionMedicOSCardProps> = ({
  profile,
}) => {
  // Mapeo transparente del perfil hacia el formato oficial de CarnetDigitalPaciente
  const carnetData = useMemo<PacienteCarnetData>(() => {
    const alergiasStr = profile.health?.allergies?.length
      ? profile.health.allergies.map((a) => a.name).join(', ')
      : 'Ninguna';

    const enfermedadesStr = profile.health?.chronicDiseases?.length
      ? profile.health.chronicDiseases.map((c) => c.name).join(', ')
      : 'Ninguna';

    const medicacionStr = profile.health?.habitualMedications?.length
      ? profile.health.habitualMedications.map((m) => m.name).join(', ')
      : 'Ninguna';

    return {
      id: profile.id,
      expediente: profile.medicosId,
      dui: profile.dui && profile.dui !== 'Sin registrar' ? profile.dui : null,
      nombres: profile.firstName,
      apellidos: profile.lastName,
      fullName: profile.fullName,
      fechaNacimiento: profile.dateOfBirth,
      sexo: profile.sex,
      tipoSangre: profile.health?.bloodType,
      fotoUrl: profile.avatarUrl,
      telefono: profile.phone,
      direccion: profile.address,
      distrito: profile.district || profile.municipality,
      municipio: profile.municipality,
      department: profile.department,
      alergiasTexto: alergiasStr,
      enfermedadesTexto: enfermedadesStr,
      medicacionTexto: medicacionStr,
    };
  }, [profile]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5 sm:p-7 select-none flex flex-col items-center">
      {/* Cabecera de la Sección */}
      <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#1c5752] border border-teal-200/70 flex items-center justify-center">
            <IdCard className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              Credencial Digital MedicOS
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Documento oficial nominal para atención en la Red de Salud.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          ✓ Activo en Red
        </span>
      </div>

      {/* Renderizado directo del Carnet Oficial (Modo 3D interactivo con controles) */}
      <div className="w-full flex justify-center py-1">
        <CarnetDigitalPaciente
          paciente={carnetData}
          only3D={true}
        />
      </div>
    </div>
  );
};

export default IdentificacionMedicOSCard;