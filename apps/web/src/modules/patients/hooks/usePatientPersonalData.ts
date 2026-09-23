// =========================================================================
// ARCHIVO: apps/web/src/modules/patients/hooks/usePatientPersonalData.ts
// DESCRIPCIÓN: Hook de dominio que orquesta datos personales y de salud
//              conectado directamente con PostgreSQL para DUI y Grupo Sanguíneo.
// =========================================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../../core/context/useAuth.js';
import { patientsService } from '../services/patients.service.js';
import { patientProfilePreferencesService } from '../services/patient-profile-preferences.service.js';
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

export type EditingSection = 'personal' | 'contact' | 'customization' | null;

interface ClinicalRecordSource {
  bloodType?: string | null;
  observations?: string | Record<string, unknown> | null;
}

const EMPTY_HEALTH_DATA: BasalHealthData = {
  bloodType: 'Sin determinar',
  bloodTypeSource: 'PATIENT',
  allergies: [],
  chronicDiseases: [],
  medicalHistory: [],
  familyHistory: [],
  habitualMedications: [],
};

function formatBloodType(bt?: string | null): string {
  if (!bt || bt === 'UNKNOWN') return 'Sin determinar';
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

function loadHealthData(patientId: string, clinicalRecord?: ClinicalRecordSource | null): BasalHealthData {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(`medicos_health_basal_${patientId}`);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<BasalHealthData>;
        if (parsed && typeof parsed === 'object') {
          return {
            bloodType: parsed.bloodType || formatBloodType(clinicalRecord?.bloodType),
            bloodTypeSource: parsed.bloodTypeSource || 'PATIENT',
            allergies: Array.isArray(parsed.allergies) ? parsed.allergies : [],
            chronicDiseases: Array.isArray(parsed.chronicDiseases) ? parsed.chronicDiseases : [],
            medicalHistory: Array.isArray(parsed.medicalHistory) ? parsed.medicalHistory : [],
            familyHistory: Array.isArray(parsed.familyHistory) ? parsed.familyHistory : [],
            habitualMedications: Array.isArray(parsed.habitualMedications) ? parsed.habitualMedications : [],
          };
        }
      }
    } catch {
      // Ignorar error de parsing
    }
  }

  if (clinicalRecord?.observations) {
    try {
      const obs = typeof clinicalRecord.observations === 'string'
        ? (JSON.parse(clinicalRecord.observations) as Record<string, unknown>)
        : (clinicalRecord.observations as Record<string, unknown>);

      if (obs && typeof obs === 'object') {
        const allergies: AllergyItem[] = [];
        if (typeof obs.allergies === 'string' && obs.allergies.trim() && !obs.allergies.includes('Ninguna')) {
          allergies.push({
            id: 'all-1',
            category: 'OTRA',
            name: obs.allergies.trim(),
            source: 'PATIENT',
          });
        }

        const chronicDiseases: ChronicDiseaseItem[] = [];
        if (typeof obs.chronicDiseases === 'string' && obs.chronicDiseases.trim() && !obs.chronicDiseases.includes('Ninguna')) {
          chronicDiseases.push({
            id: 'chr-1',
            name: obs.chronicDiseases.trim(),
            status: 'REPORTED',
          });
        }

        const habitualMedications: HabitualMedicationItem[] = [];
        if (typeof obs.medication === 'string' && obs.medication.trim() && !obs.medication.includes('Ninguna')) {
          habitualMedications.push({
            id: 'med-1',
            name: obs.medication.trim(),
            source: 'PATIENT',
          });
        }

        return {
          bloodType: formatBloodType(clinicalRecord.bloodType),
          bloodTypeSource: 'CLINICAL',
          allergies,
          chronicDiseases,
          medicalHistory: [],
          familyHistory: [],
          habitualMedications,
        };
      }
    } catch {
      // Fallback
    }
  }

  return {
    ...EMPTY_HEALTH_DATA,
    bloodType: formatBloodType(clinicalRecord?.bloodType),
  };
}

function persistHealthData(patientId: string, data: BasalHealthData): void {
  try {
    localStorage.setItem(`medicos_health_basal_${patientId}`, JSON.stringify(data));
  } catch (e) {
    console.warn('No se pudo guardar la información de salud local:', e);
  }
}

function mapToCompositeProfile(
  p: PatientRecord,
  prefs: ReturnType<typeof patientProfilePreferencesService.getPreferences>,
  targetUserId: string,
  targetEmail: string,
  userFirstName?: string,
  userLastName?: string,
  userPhone?: string | null
): PatientPersonalDataProfile {
  const cleanIdNumeric = p.id.replace(/\D/g, '');
  const medicosId = cleanIdNumeric.length >= 4
    ? `MED-${cleanIdNumeric.padStart(6, '0').slice(-6)}`
    : `MED-${p.id.slice(0, 6).toUpperCase()}`;

  const addressRaw = p.address && p.address !== 'No registrada' ? p.address : '';
  const parts = addressRaw.split(',').map((s) => s.trim()).filter(Boolean);
  const department = parts.length >= 3 ? parts[parts.length - 1] : parts.length === 2 ? parts[1] : '';
  const municipality = parts.length >= 2 ? parts[parts.length - 2] : parts.length === 1 ? parts[0] : '';
  const cleanAddress = parts.length >= 3 ? parts.slice(0, -2).join(', ') : addressRaw;

  const healthData = loadHealthData(p.id, p.clinicalRecord);

  const finalFirstName = p.firstName?.trim() || userFirstName?.trim() || '';
  const finalLastName = p.lastName?.trim() || userLastName?.trim() || '';
  const finalPhone = p.phone?.trim() || userPhone?.trim() || '';

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
    department: department || 'La Paz',
    municipality: municipality || 'San Miguel Tepezontes',
    district: municipality || 'San Miguel Tepezontes',
    address: cleanAddress,
    avatarUrl: prefs.avatarUrl,
    visibleInProfile: prefs.visibleInProfile,
    health: healthData,
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
      const history = await patientsService.getPatientHistory(userId);
      if (!history?.patient) {
        setError('No se encontró el registro del paciente asociado a tu cuenta.');
        setProfile(null);
        return;
      }
      const p = history.patient;
      const prefs = patientProfilePreferencesService.getPreferences(p.id);
      setProfile(mapToCompositeProfile(p, prefs, userId, userEmail, userFirstName, userLastName, userPhone));
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
        const history = await patientsService.getPatientHistory(userId);
        if (!isMounted) return;
        if (!history?.patient) {
          setError('No se encontró el registro del paciente asociado a tu cuenta.');
          setProfile(null);
          return;
        }
        const p = history.patient;
        const prefs = patientProfilePreferencesService.getPreferences(p.id);
        setProfile(mapToCompositeProfile(p, prefs, userId, userEmail, userFirstName, userLastName, userPhone));
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
      await patientsService.updateProfile({
        dateOfBirth: dto.dateOfBirth,
        sex: dto.sex,
        dui: cleanDui,
        bloodType: dto.bloodType,
        address: [profile.address, profile.municipality, profile.department].filter(Boolean).join(', '),
      });

      patientProfilePreferencesService.savePreferences(profile.id, {
        preferredName: dto.preferredName || undefined,
        civilStatus: dto.civilStatus,
        nationality: dto.nationality,
      });

      const updatedBloodType = dto.bloodType ? formatBloodType(dto.bloodType) : profile.health.bloodType;

      if (dto.bloodType) {
        persistHealthData(profile.id, {
          ...profile.health,
          bloodType: updatedBloodType,
        });
      }

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              firstName: dto.firstName,
              lastName: dto.lastName,
              fullName: `${dto.firstName} ${dto.lastName}`.trim(),
              preferredName: dto.preferredName,
              dateOfBirth: dto.dateOfBirth,
              sex: dto.sex,
              civilStatus: dto.civilStatus,
              nationality: dto.nationality,
              dui: cleanDui || 'Sin registrar',
              health: {
                ...prev.health,
                bloodType: updatedBloodType,
              },
              isProfileComplete: Boolean(cleanDui && prev.phone && prev.address),
            }
          : null
      );
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
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              phone: dto.phone,
              department: dto.department,
              municipality: dto.municipality,
              district: dto.district,
              address: dto.address,
            }
          : null
      );
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
        bloodType: dto.bloodType,
        dateOfBirth: profile.dateOfBirth,
        address: [profile.address, profile.municipality, profile.department].filter(Boolean).join(', '),
      });
      persistHealthData(profile.id, dto);
      setProfile((prev) => (prev ? { ...prev, health: dto } : null));
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
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              preferredName: dto.preferredName,
              visibleInProfile: dto.visibleInProfile,
            }
          : null
      );
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