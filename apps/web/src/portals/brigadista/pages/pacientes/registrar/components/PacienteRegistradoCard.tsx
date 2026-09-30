// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/registrar/components/PacienteRegistradoCard.tsx
// DESCRIPCIÓN: Pantalla de confirmación con despacho operativo dual:
//              1. Modo Jornada Médica (Pasar a Sala de Espera)
//              2. Modo Visita Domiciliaria (Atención Clínica Inmediata)
// =========================================================================

import React, { useMemo } from 'react';
import { 
  CheckCircle2, 
  UserPlus, 
  ArrowRight, 
  FileText, 
  Clock, 
  HeartPulse, 
  Home, 
  Users 
} from 'lucide-react';
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

  const nombreCompleto =
    patient.fullName ||
    `${patient.firstName || formData.firstName} ${patient.lastName || formData.lastName}`.trim();
  const duiPaciente = patient.dui || formData.dui || 'Sin DUI';

  // Mapeo exhaustivo de los datos reales del registro hacia el carnet
  const carnetData = useMemo<PacienteCarnetData>(() => {
    const direccionCompleta =
      [formData.address, formData.municipality, formData.department]
        .filter(Boolean)
        .join(', ') || patient.address || 'San Salvador, El Salvador';

    const comunidad = formData.municipality || formData.department || 'Comunidad Central';

    const alergias =
      formData.allergies?.trim() || patient.clinicalRecord?.observations || 'Ninguna reportada';
    const enfermedades = formData.chronicDiseases?.trim() || 'Ninguna registrada';
    const observaciones =
      [
        formData.allergies ? `Alergias: ${formData.allergies}` : null,
        formData.chronicDiseases ? `Enfermedades: ${formData.chronicDiseases}` : null,
        formData.disabilities ? `Discapacidad: ${formData.disabilities}` : null,
      ]
        .filter(Boolean)
        .join(' | ') || patient.clinicalRecord?.observations || 'Sin observaciones.';

    return {
      id: patient.id,
      expediente: `EXP-2026-${(patient.dui || formData.dui || '0000').replace(/[^0-9]/g, '').slice(-4) || '0001'}`,
      dui: duiPaciente,
      nombres: patient.firstName || formData.firstName,
      apellidos: patient.lastName || formData.lastName,
      fullName: nombreCompleto,
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
  }, [patient, formData, duiPaciente, nombreCompleto]);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* 1. Banner de Éxito de Creación */}
      <div className="p-5 sm:p-6 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-emerald-900">
              ¡Persona Registrada en el Padrón!
            </h2>
            <p className="text-xs text-emerald-700 mt-0.5">
              Se ha emitido el expediente institucional y carnet digital para{' '}
              <strong className="font-bold">{nombreCompleto}</strong> (DUI: {duiPaciente}).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold hover:bg-emerald-100/50 transition-all cursor-pointer shadow-2xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Registrar Familiar</span>
          </button>
          <button
            type="button"
            onClick={() => navigate(`/brigadista/pacientes/expediente?id=${patient.id}`)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Ver Expediente</span>
          </button>
        </div>
      </div>

      {/* 2. Bifurcación Operativa: ¿Qué hacer ahora según la modalidad? */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2B7A78]" />
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Siguiente Paso Operativo (Selecciona según tu modo de trabajo)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* OPCIÓN A: Modo Jornada Médica (Puesto Fijo) */}
          <div
            onClick={() => navigate('/brigadista/brigada/pacientes')}
            className="group bg-white rounded-2xl border-2 border-slate-200/80 hover:border-[#2B7A78] p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78] shadow-2xs">
                  <Users className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-100 text-teal-800 uppercase tracking-wider">
                  Modo: Puesto Fijo
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#2B7A78] transition-colors">
                  Enviar a Sala de Espera de Hoy
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Para cuando estás en la escuela o toldo comunal. El paciente pasa a sentarse en la
                  fila del turno como <strong className="text-slate-700">PENDIENTE</strong> hasta
                  ser llamado por el médico o brigadista.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2B7A78]">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Ver en la Cola de Espera</span>
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* OPCIÓN B: Modo Visita Domiciliaria (Atención Directa en Campo) */}
          <div
            onClick={() =>
              navigate(
                `/brigadista/atencion/nueva?patientId=${patient.id}&nombre=${encodeURIComponent(
                  nombreCompleto
                )}&dui=${encodeURIComponent(duiPaciente)}`
              )
            }
            className="group bg-white rounded-2xl border-2 border-[#2B7A78]/70 hover:border-[#2B7A78] p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between ring-1 ring-[#2B7A78]/20"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shadow-2xs">
                  <Home className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Modo: Visita Domiciliar
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#2B7A78] transition-colors">
                  Iniciar Atención Inmediata en Terreno
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Para cuando estás recorriendo las viviendas. Abre la ficha de toma de signos
                  vitales y consulta clínica en este instante en la puerta de la casa, pasando a{' '}
                  <strong className="text-emerald-700">EVALUADO</strong> al guardar.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span className="flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-emerald-600" />
                <span>Atender Ahora In Situ</span>
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Carnet Digital Oficial Generado */}
      <div className="space-y-2 pt-2">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
          Carnet Oficial Emitido
        </p>
        <CarnetDigitalPaciente paciente={carnetData} />
      </div>
    </div>
  );
};

export default PacienteRegistradoCard;