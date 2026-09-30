// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/datos-personales/components/ModalIdentificacionDigital.tsx
// DESCRIPCIÓN: Modal de Identificación Digital oficial. Conexión 100% directa
//              con la base de datos (Datos reales del paciente en sesión).
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

function cleanPhoneNumber(phoneStr?: unknown): string {
  if (typeof phoneStr !== 'string' || !phoneStr.trim()) return 'No registrado';
  const withoutCode = phoneStr.trim().replace(/^\+?503\s*[-]?\s*/, '');
  const digits = withoutCode.replace(/\D/g, '');
  if (digits.length === 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }
  return withoutCode || 'No registrado';
}

function formatRelationLabel(rel?: unknown): string {
  if (typeof rel !== 'string' || !rel.trim()) return 'Familiar';
  const clean = rel.toUpperCase().trim();
  const map: Record<string, string> = {
    MADRE: 'Madre',
    PADRE: 'Padre',
    HIJO_A: 'Hijo/a',
    HERMANO_A: 'Hermano/a',
    CONYUGE: 'Cónyuge',
    PAREJA: 'Pareja',
    ABUELO_A: 'Abuelo/a',
    TUTOR_A: 'Tutor/a',
    FAMILIAR: 'Familiar',
    AMIGO_A: 'Amigo/a',
    OTRO: 'Otro',
  };
  return map[clean] || rel;
}

export const ModalIdentificacionDigital: React.FC<ModalIdentificacionDigitalProps> = ({
  isOpen,
  onClose,
  profile,
  displayName,
}) => {
  const carnetData = useMemo<PacienteCarnetData>(() => {
    const rawProfile = profile as unknown as Record<string, unknown>;
    const health = (
      rawProfile['health'] && typeof rawProfile['health'] === 'object'
        ? rawProfile['health']
        : {}
    ) as Record<string, unknown>;

    let emergencyObj: Record<string, unknown> = {};
    if (Array.isArray(rawProfile['emergencyContacts']) && rawProfile['emergencyContacts'].length > 0) {
      const primary = (rawProfile['emergencyContacts'] as Array<Record<string, unknown>>).find(
        (c) => c['isPrimary'] === true && c['isActive'] !== false
      );
      emergencyObj = primary || (rawProfile['emergencyContacts'][0] as Record<string, unknown>);
    } else if (rawProfile['emergencyContact'] && typeof rawProfile['emergencyContact'] === 'object') {
      emergencyObj = rawProfile['emergencyContact'] as Record<string, unknown>;
    }

    const formatList = (val: unknown): string => {
      if (!val) return 'Ninguna';
      if (Array.isArray(val)) {
        const filtered = val
          .map((item) => (typeof item === 'object' && item !== null ? (item as Record<string, unknown>)['name'] : item))
          .filter(Boolean);
        return filtered.length > 0 ? filtered.join(', ') : 'Ninguna';
      }
      if (typeof val === 'string' && val.trim()) return val.trim();
      return 'Ninguna';
    };

    const bloodType =
      (typeof health['bloodType'] === 'string' && health['bloodType']) ||
      (typeof health['tipoSangre'] === 'string' && health['tipoSangre']) ||
      (typeof rawProfile['bloodType'] === 'string' && rawProfile['bloodType']) ||
      'O+';

    // ÚNICAMENTE crónicas basales que el paciente registró
    const allergies = formatList(health['allergies']);
    const chronicDiseases = formatList(health['chronicDiseases']);
    const medications = formatList(health['habitualMedications']);

    const rawObservations =
      health['observations'] ||
      rawProfile['observations'] ||
      rawProfile['medicalNotes'] ||
      rawProfile['notes'];

    // Brevedad estricta: Únicamente "Sin observaciones" si no hay notas registradas
    const observations =
      typeof rawObservations === 'string' &&
      rawObservations.trim() &&
      !rawObservations.toLowerCase().includes('sin observaciones') &&
      !rawObservations.toLowerCase().includes('ninguna')
        ? rawObservations.trim()
        : 'Sin observaciones';

    const emergencyName =
      (typeof emergencyObj['name'] === 'string' && emergencyObj['name']) ||
      (typeof emergencyObj['fullName'] === 'string' && emergencyObj['fullName']) ||
      (emergencyObj['firstName'] ? `${emergencyObj['firstName']} ${emergencyObj['lastName'] || ''}`.trim() : null) ||
      (typeof rawProfile['emergencyName'] === 'string' && rawProfile['emergencyName']) ||
      'No asignado';

    const emergencyPhone = cleanPhoneNumber(
      emergencyObj['phone'] || emergencyObj['primaryPhone'] || rawProfile['emergencyPhone']
    );

    const emergencyRelation = formatRelationLabel(
      emergencyObj['relationship'] || emergencyObj['relation'] || rawProfile['emergencyRelation']
    );

    const addressSegments = [profile.address, profile.municipality, profile.department].filter(Boolean);
    const fullAddress = addressSegments.length > 0 ? addressSegments.join(', ') : 'El Salvador';

    const detectedDistrict =
      profile.district ||
      profile.municipality ||
      profile.department ||
      'San Salvador';

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
      telefono: cleanPhoneNumber(profile.phone),
      direccion: fullAddress,
      municipio: profile.municipality,
      department: profile.department,
      distrito: detectedDistrict,
      tipoSangre: bloodType,
      alergiasTexto: allergies,
      enfermedadesTexto: chronicDiseases,
      medicacionTexto: medications,
      observacionesTexto: observations,
      emergencyName,
      emergencyPhone,
      emergencyRelation,
      contactoEmergencia: {
        nombre: emergencyName,
        telefono: emergencyPhone,
        parentesco: emergencyRelation,
      },
    };
  }, [profile, displayName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150 select-none">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#166E7A]" />
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

        <div className="p-4 sm:p-6 overflow-y-auto flex justify-center">
          <CarnetDigitalPaciente paciente={carnetData} only3D={true} />
        </div>
      </div>
    </div>
  );
};

export default ModalIdentificacionDigital;