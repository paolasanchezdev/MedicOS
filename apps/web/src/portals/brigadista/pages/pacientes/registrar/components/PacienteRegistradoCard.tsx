// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/registrar/components/PacienteRegistradoCard.tsx
// DESCRIPCIÓN: Pantalla de confirmación de éxito con renderizado del Carnet Digital interactivo y mapeo unificado.
// =========================================================================

import React, { useMemo } from 'react';
import { CheckCircle2, UserPlus, ArrowRight, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CarnetDigitalPaciente, type PacienteCarnetData } from './CarnetDigitalPaciente';
import type { CreatedPatientResult, PatientFormState } from '../../../../../../modules/patients';

interface PacienteRegistradoCardProps {
  patient: CreatedPatientResult;
  formData: PatientFormState;
  onReset: () => void;
}

export const PacienteRegistradoCard: React.FC<PacienteRegistradoCardProps> = ({
  patient,
  formData,
  onReset,
}) => {
  const navigate = useNavigate();

  // Mapeo exhaustivo de los datos reales del registro hacia el carnet
  const carnetData = useMemo<PacienteCarnetData>(() => {
    const direccionCompleta = [formData.address, formData.municipality, formData.department]
      .filter(Boolean)
      .join(', ') || patient.address || 'San Salvador, El Salvador';

    const comunidad = formData.municipality || formData.department || 'Comunidad Central';

    const alergias = formData.allergies?.trim() || patient.clinicalRecord?.observations || 'Ninguna reportada';
    const enfermedades = formData.chronicDiseases?.trim() || 'Ninguna registrada';
    const observaciones = [
      formData.allergies ? `Alergias: ${formData.allergies}` : null,
      formData.chronicDiseases ? `Enfermedades: ${formData.chronicDiseases}` : null,
      formData.disabilities ? `Discapacidad: ${formData.disabilities}` : null,
    ].filter(Boolean).join(' | ') || patient.clinicalRecord?.observations || 'Sin observaciones.';

    return {
      id: patient.id,
      expediente: `EXP-2026-${(patient.dui || formData.dui || '0000').replace(/[^0-9]/g, '').slice(-4) || '0001'}`,
      dui: patient.dui || formData.dui || 'Sin DUI',
      nombres: patient.firstName || formData.firstName,
      apellidos: patient.lastName || formData.lastName,
      fullName: patient.fullName || `${formData.firstName} ${formData.lastName}`,
      fechaNacimiento: patient.dateOfBirth || formData.dateOfBirth,
      sexo: patient.sex || formData.sex || 'Femenino',
      tipoSangre: patient.clinicalRecord?.bloodType || formData.bloodType || 'O+',
      telefono: patient.phone || formData.phone || 'No registrado',
      direccion: direccionCompleta,
      comunidad,
      alergiasTexto: alergias,
      enfermedadesTexto: enfermedades,
      medicacionTexto: 'Ninguna activa',
      observacionesTexto: observaciones,
      contactoEmergencia: {
        nombre: patient.emergencyName || formData.emergencyName || 'No asignado',
        parentesco: patient.emergencyRelation || formData.emergencyRelation || 'Familiar',
        telefono: patient.emergencyPhone || formData.emergencyPhone || 'No registrado',
      },
      fechaCreacion: patient.createdAt || new Date().toISOString(),
      fechaExpiracion: '02/01/2030',
      qrPayload: `https://medicos.local/expediente/${patient.id}`,
    };
  }, [patient, formData]);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Banner de Éxito */}
      <div className="p-6 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-emerald-900">
              ¡Paciente Registrado Exitosamente!
            </h2>
            <p className="text-xs text-emerald-700 mt-0.5">
              Se ha creado el registro en PostgreSQL, su cuenta de usuario y su carnet digital.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold hover:bg-emerald-100/50 transition-all cursor-pointer shadow-2xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Registrar Otro</span>
          </button>
          <button
            type="button"
            onClick={() => navigate(`/brigadista/pacientes/expediente?id=${patient.id}`)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2B7A78] hover:bg-[#236866] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Ir a Expediente</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Renderizado del Carnet con Datos Reales */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
          Carnet Oficial Generado
        </p>
        <CarnetDigitalPaciente
          paciente={carnetData}
        />
      </div>
    </div>
  );
};

export default PacienteRegistradoCard;