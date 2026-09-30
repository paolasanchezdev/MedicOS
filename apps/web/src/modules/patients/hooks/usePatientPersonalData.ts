// =========================================================================
// ARCHIVO: apps/web/src/modules/patients/hooks/usePatientPersonalData.ts
// DESCRIPCIÓN: Hook de dominio que orquesta datos personales y de salud
//              conectado 100% con PostgreSQL y catálogo oficial TERRITORIO_EL_SALVADOR.
//              Envía nombres y apellidos actualizados al backend y actualiza la sesión.
// =========================================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../../core/context/useAuth.js';
import { patientsService } from '../services/patients.service.js';
import { patientProfilePreferencesService } from '../services/patient-profile-preferences.service.js';
import { TERRITORIO_EL_SALVADOR } from '../../../shared/data/elSalvadorTerritory.js';
import type { PatientRecord } from '../types/patient.types.js';
import type {
  PatientPersonalDataProfile,
  BasalHealthData,
  UpdatePersonalIdentityDto,
  UpdatePersonalContactDto,
  UpdateProfileCustomizationDto,
  UpdateHealthDataDto,
  AllergyItem,
  ChronicDiseaseItem,
  HabitualMedicationItem,
} from '../types/patient-personal-data.types.js';
import type { EmergencyContact } from '../types/emergency-contacts.types.js';

export type EditingSection = 'personal' | 'contact' | 'customization' | null;

interface ExtendedPatientRecord extends PatientRecord {
  emergencyContacts?: EmergencyContact[];
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
}

type UpdateProfilePayload = Parameters<typeof patientsService.updateProfile>[0] & {
  firstName?: string;
  lastName?: string;
};

function normalizarTexto(txt?: string | null): string {
  if (!txt) return '';
  return txt
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function cleanPhoneNumber(phone?: string | null): string {
  if (!phone) return '';
  const withoutCode = phone.trim().replace(/^\+?503\s*[-]?\s*/, '');
  const digits = withoutCode.replace(/\D/g, '');
  if (digits.length === 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }
  return withoutCode;
}

function formatRelationLabel(rel?: string | null): string {
  if (!rel) return 'Familiar';
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

function toPrismaBloodType(bt?: string | null): string | undefined {
  if (!bt || !bt.trim()) return undefined;
  const clean = bt.trim().toUpperCase().replace(/[\s()]/g, '_');
  const map: Record<string, string> = {
    'O+': 'O_POSITIVE',
    'O-': 'O_NEGATIVE',
    'A+': 'A_POSITIVE',
    'A-': 'A_NEGATIVE',
    'B+': 'B_POSITIVE',
    'B-': 'B_NEGATIVE',
    'AB+': 'AB_POSITIVE',
    'AB-': 'AB_NEGATIVE',
    O_POSITIVE: 'O_POSITIVE',
    O_NEGATIVE: 'O_NEGATIVE',
    A_POSITIVE: 'A_POSITIVE',
    A_NEGATIVE: 'A_NEGATIVE',
    B_POSITIVE: 'B_POSITIVE',
    B_NEGATIVE: 'B_NEGATIVE',
    AB_POSITIVE: 'AB_POSITIVE',
    AB_NEGATIVE: 'AB_NEGATIVE',
    UNKNOWN: 'UNKNOWN',
    SIN_DETERMINAR: 'UNKNOWN',
  };
  return map[clean] || 'O_POSITIVE';
}

function resolverTerritorioOficial(rawAddress?: string | null): {
  cleanAddress: string;
  municipality: string;
  department: string;
  district: string;
} {
  if (!rawAddress || !rawAddress.trim()) {
    return {
      cleanAddress: 'No registrada',
      municipality: 'San Miguel Tepezontes',
      department: 'La Paz',
      district: 'San Miguel Tepezontes',
    };
  }

  const normAddress = normalizarTexto(rawAddress);
  let matchedDistrict = '';
  let matchedMuni = '';
  let matchedDept = '';

  for (const dept of TERRITORIO_EL_SALVADOR) {
    for (const muni of dept.municipios) {
      for (const dist of muni.distritos) {
        const normDist = normalizarTexto(dist);
        if (normAddress.includes(normDist)) {
          if (dist.length > matchedDistrict.length) {
            matchedDistrict = dist;
            matchedMuni = dist;
            matchedDept = dept.nombre;
          }
        }
      }
    }
  }

  if (!matchedDept) {
    for (const dept of TERRITORIO_EL_SALVADOR) {
      const normDept = normalizarTexto(dept.nombre);
      if (normAddress.includes(normDept)) {
        matchedDept = dept.nombre;
        break;
      }
    }
  }

  const parts = rawAddress.split(',').map((s) => s.trim()).filter(Boolean);
  const addressParts: string[] = [];

  for (const part of parts) {
    const pNorm = normalizarTexto(part);
    const isDept = TERRITORIO_EL_SALVADOR.some((d) => normalizarTexto(d.nombre) === pNorm);
    const isDist = matchedDistrict && normalizarTexto(matchedDistrict) === pNorm;
    if (!isDept && !isDist) {
      addressParts.push(part);
    }
  }

  const cleanAddress = addressParts.join(', ') || parts[0] || rawAddress;

  return {
    cleanAddress,
    municipality: matchedMuni || 'San Miguel Tepezontes',
    department: matchedDept || 'La Paz',
    district: matchedDistrict || matchedMuni || 'San Miguel Tepezontes',
  };
}

function formatBloodType(bt?: string | null): string {
  if (!bt || bt === 'UNKNOWN') return 'O+';
  const map: Record<string, string> = {
    O_POSITIVE: 'O+',
    O_NEGATIVE: 'O-',
    A_POSITIVE: 'A+',
    A_NEGATIVE: 'A-',
    B_POSITIVE: 'B+',
    B_NEGATIVE: 'B-',
    AB_POSITIVE: 'AB+',
    AB_NEGATIVE: 'AB-',
  };
  return map[bt] || bt;
}

function mapToCompositeProfile(
  p: ExtendedPatientRecord,
  prefs: ReturnType<typeof patientProfilePreferencesService.getPreferences>,
  targetUserId: string,
  targetEmail: string,
  emergencyList: EmergencyContact[],
  userFirstName?: string,
  userLastName?: string,
  userPhone?: string | null
): PatientPersonalDataProfile & { emergencyContact?: Record<string, unknown>; emergencyContacts?: EmergencyContact[] } {
  const cleanIdNumeric = p.id.replace(/\D/g, '');
  const medicosId = cleanIdNumeric.length >= 4
    ? `MED-${cleanIdNumeric.padStart(6, '0').slice(-6)}`
    : `MED-${p.id.slice(0, 6).toUpperCase()}`;

  const { cleanAddress, municipality, department, district } = resolverTerritorioOficial(p.address);

  const primaryEmergency = emergencyList.find((c) => c.isPrimary && c.isActive) || emergencyList[0];
  const primaryEmergencyObj = primaryEmergency
    ? {
        name: `${primaryEmergency.firstName} ${primaryEmergency.lastName}`.trim(),
        phone: cleanPhoneNumber(primaryEmergency.primaryPhone),
        relationship: formatRelationLabel(primaryEmergency.customRelation || primaryEmergency.relationship),
      }
    : (p.emergencyName ? {
        name: p.emergencyName,
        phone: cleanPhoneNumber(p.emergencyPhone) || 'No registrado',
        relationship: formatRelationLabel(p.emergencyRelation),
      } : undefined);

  const bloodType = formatBloodType(p.clinicalRecord?.bloodType);
  const allergies: AllergyItem[] = [];
  const chronicDiseases: ChronicDiseaseItem[] = [];
  const habitualMedications: HabitualMedicationItem[] = [];

  if (p.clinicalRecord?.observations) {
    try {
      const obs = typeof p.clinicalRecord.observations === 'string'
        ? JSON.parse(p.clinicalRecord.observations)
        : p.clinicalRecord.observations;

      if (obs && typeof obs === 'object') {
        if (typeof obs.allergies === 'string' && obs.allergies.trim() && !obs.allergies.includes('Ninguna')) {
          allergies.push({ id: 'all-1', category: 'OTRA', name: obs.allergies.trim(), source: 'PATIENT' });
        }
        if (typeof obs.chronicDiseases === 'string' && obs.chronicDiseases.trim() && !obs.chronicDiseases.includes('Ninguna')) {
          chronicDiseases.push({ id: 'chr-1', name: obs.chronicDiseases.trim(), status: 'REPORTED' });
        }
        if (typeof obs.medication === 'string' && obs.medication.trim() && !obs.medication.includes('Ninguna')) {
          habitualMedications.push({ id: 'med-1', name: obs.medication.trim(), source: 'PATIENT' });
        }
      }
    } catch {
      // Ignorar fallback
    }
  }

  const healthData: BasalHealthData = {
    bloodType,
    bloodTypeSource: p.clinicalRecord?.bloodType ? 'CLINICAL' : 'PATIENT',
    allergies,
    chronicDiseases,
    medicalHistory: [],
    familyHistory: [],
    habitualMedications,
  };

  const finalFirstName = p.firstName?.trim() || userFirstName?.trim() || '';
  const finalLastName = p.lastName?.trim() || userLastName?.trim() || '';
  const finalPhone = cleanPhoneNumber(p.phone?.trim() || userPhone?.trim() || '');

  return {
    id: p.id,
    userId: targetUserId,
    medicosId,
    firstName: finalFirstName,
    lastName: finalLastName,
    fullName: `${finalFirstName} ${finalLastName}`.trim(),
    preferredName: prefs.preferredName,
    dateOfBirth: p.dateOfBirth ? p.dateOfBirth.slice(0, 10) : '',
    sex: p.sex || 'OTHER',
    civilStatus: prefs.civilStatus || 'SOLTERO',
    nationality: prefs.nationality || 'Salvadoreña',
    dui: p.dui || 'Sin registrar',
    email: targetEmail,
    phone: finalPhone,
    department,
    municipality,
    district,
    address: cleanAddress,
    avatarUrl: prefs.avatarUrl,
    visibleInProfile: prefs.visibleInProfile,
    health: healthData,
    emergencyContact: primaryEmergencyObj,
    emergencyContacts: emergencyList,
    isProfileComplete: Boolean(p.dui && finalPhone && cleanAddress),
    updatedAt: p.updatedAt || new Date().toISOString(),
  };
}

export function usePatientPersonalData() {
  const { user } = useAuth();
  const userId = user?.id;
  const userEmail = user?.email || '';
  const userFirstName = user?.firstName || '';
  const userLastName = user?.lastName || '';
  const userPhone = (user as unknown as { phone?: string | null })?.phone ?? null;

  const [profile, setProfile] = useState<PatientPersonalDataProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [editingSection, setEditingSection] = useState<EditingSection>(null);
  const [isCredentialModalOpen, setIsCredentialModalOpen] = useState<boolean>(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState<boolean>(false);

  const notifySuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const refetch = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [history, emergencyList] = await Promise.all([
        patientsService.getPatientHistory(userId),
        patientsService.getEmergencyContacts().catch(() => []),
      ]);

      if (!history?.patient) {
        setError('No se encontró el registro del paciente asociado a tu cuenta.');
        setProfile(null);
        return;
      }
      const p = history.patient as ExtendedPatientRecord;
      const prefs = patientProfilePreferencesService.getPreferences(p.id);
      setProfile(
        mapToCompositeProfile(
          p,
          prefs,
          userId,
          userEmail,
          emergencyList,
          userFirstName,
          userLastName,
          userPhone
        )
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar los datos personales';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [userId, userEmail, userFirstName, userLastName, userPhone]);

  useEffect(() => {
    let isMounted = true;
    const loadAsync = async () => {
      await Promise.resolve();
      if (!isMounted) return;
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const [history, emergencyList] = await Promise.all([
          patientsService.getPatientHistory(userId),
          patientsService.getEmergencyContacts().catch(() => []),
        ]);

        if (!isMounted) return;
        if (!history?.patient) {
          setError('No se encontró el registro del paciente asociado a tu cuenta.');
          setProfile(null);
          return;
        }
        const p = history.patient as ExtendedPatientRecord;
        const prefs = patientProfilePreferencesService.getPreferences(p.id);
        setProfile(
          mapToCompositeProfile(
            p,
            prefs,
            userId,
            userEmail,
            emergencyList,
            userFirstName,
            userLastName,
            userPhone
          )
        );
      } catch (err: unknown) {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'Error al cargar los datos personales';
        setError(msg);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void loadAsync();
    return () => {
      isMounted = false;
    };
  }, [userId, userEmail, userFirstName, userLastName, userPhone]);

  const savePersonalIdentity = async (dto: UpdatePersonalIdentityDto): Promise<boolean> => {
    if (!profile) return false;
    setSaving(true);
    setError(null);
    try {
      const cleanDui = dto.dui?.trim() || null;
      const payload: UpdateProfilePayload = {
        firstName: dto.firstName?.trim(),
        lastName: dto.lastName?.trim(),
        dateOfBirth: dto.dateOfBirth,
        sex: dto.sex,
        dui: cleanDui,
        bloodType: toPrismaBloodType(dto.bloodType),
        address: [profile.address, profile.municipality, profile.department].filter(Boolean).join(', '),
      };

      await (patientsService.updateProfile as (data: UpdateProfilePayload) => Promise<unknown>)(payload);

      patientProfilePreferencesService.savePreferences(profile.id, {
        preferredName: dto.preferredName || undefined,
        civilStatus: dto.civilStatus,
        nationality: dto.nationality,
      });

      await refetch();
      setEditingSection(null);
      notifySuccess('Información personal y documento actualizados correctamente.');
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No fue posible actualizar la información personal.';
      setError(msg);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const savePersonalContact = async (dto: UpdatePersonalContactDto): Promise<boolean> => {
    if (!profile) return false;
    setSaving(true);
    setError(null);
    try {
      const fullAddress = [dto.address, dto.municipality, dto.department].filter(Boolean).join(', ');
      await patientsService.updateProfile({
        phone: dto.phone,
        address: fullAddress,
        department: dto.department,
        municipality: dto.municipality,
        dateOfBirth: profile.dateOfBirth,
      });
      await refetch();
      setEditingSection(null);
      notifySuccess('Datos de contacto y ubicación guardados.');
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar los datos de contacto.';
      setError(msg);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveHealthData = async (dto: UpdateHealthDataDto): Promise<boolean> => {
    if (!profile) return false;
    setSaving(true);
    setError(null);
    try {
      await patientsService.updateProfile({
        bloodType: toPrismaBloodType(dto.bloodType),
        dateOfBirth: profile.dateOfBirth,
        address: [profile.address, profile.municipality, profile.department].filter(Boolean).join(', '),
      });
      await refetch();
      setIsHealthModalOpen(false);
      notifySuccess('Información de salud guardada en expediente.');
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar la información de salud.';
      setError(msg);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveCustomization = async (dto: UpdateProfileCustomizationDto): Promise<boolean> => {
    if (!profile) return false;
    try {
      patientProfilePreferencesService.savePreferences(profile.id, {
        preferredName: dto.preferredName || undefined,
        visibleInProfile: dto.visibleInProfile,
      });
      await refetch();
      setEditingSection(null);
      notifySuccess('Preferencias de presentación actualizadas.');
      return true;
    } catch {
      return false;
    }
  };

  const updateAvatar = (base64Image: string) => {
    if (!profile) return;
    patientProfilePreferencesService.saveAvatar(profile.id, base64Image);
    setProfile((prev) => (prev ? { ...prev, avatarUrl: base64Image } : null));
    setIsPhotoModalOpen(false);
    notifySuccess('Foto de perfil actualizada.');
  };

  const removeAvatar = () => {
    if (!profile) return;
    patientProfilePreferencesService.removeAvatar(profile.id);
    setProfile((prev) => (prev ? { ...prev, avatarUrl: undefined } : null));
    setIsPhotoModalOpen(false);
    notifySuccess('Foto de perfil eliminada.');
  };

  const displayName = useMemo(() => {
    if (!profile) return '';
    return profile.preferredName?.trim() || profile.fullName;
  }, [profile]);

  return {
    profile,
    displayName,
    loading,
    saving,
    error,
    successMessage,
    editingSection,
    isCredentialModalOpen,
    isPhotoModalOpen,
    isHealthModalOpen,
    setEditingSection,
    setIsCredentialModalOpen,
    setIsPhotoModalOpen,
    setIsHealthModalOpen,
    savePersonalIdentity,
    savePersonalContact,
    saveHealthData,
    saveCustomization,
    updateAvatar,
    removeAvatar,
    refetch,
  };
}