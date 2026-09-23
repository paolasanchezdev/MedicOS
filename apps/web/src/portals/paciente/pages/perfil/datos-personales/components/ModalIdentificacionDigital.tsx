// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/datos-personales/components/ModalIdentificacionDigital.tsx
// DESCRIPCIÓN: Modal con la vista completa del CarnetDigitalPaciente oficial,
//              cumpliendo estrictamente con Rules of Hooks (sin early return previo).
// =========================================================================

import React, { useMemo } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { CarnetDigitalPaciente, type PacienteCarnetData } from '../../../../../../shared/components/carnet/CarnetDigitalPaciente.js';
import type { PatientPersonalDataProfile } from '../../../../../../modules/patients/types/patient-personal-data.types.js';

interface ModalIdentificacionDigitalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PatientPersonalDataProfile;
  displayName: string;
}

export const ModalIdentificacionDigital: React.FC<ModalIdentificacionDigitalProps> = ({
  isOpen,
  onClose,
  profile,
  displayName,
}) => {
  // El hook se ejecuta incondicionalmente en la cabecera del componente
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
      observacionesTexto: 'Carnet Oficial de Identificación Territorial MedicOS 2026',
    };
  }, [profile, displayName]);

  // Early return colocado de forma segura tras la ejecución de todos los hooks
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 select-none">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabecera del Modal */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1c5752]" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Mi Identificación MedicOS · Carnet Digital
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenedor del Carnet Oficial */}
        <div className="p-6 overflow-y-auto flex justify-center">
          <CarnetDigitalPaciente paciente={carnetData} only3D={true} />
        </div>
      </div>
    </div>
  );
};

export default ModalIdentificacionDigital;