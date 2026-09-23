// =========================================================================
// ARCHIVO: apps/web/src/modules/patients/services/patient-profile-preferences.service.ts
// DESCRIPCIÓN: Servicio de persistencia local offline-first para personalización,
//              foto de perfil y visibilidad de datos del paciente.
// =========================================================================

import type {
  CivilStatus,
  ProfileVisibilityPreferences,
} from '../types/patient-personal-data.types.js';

interface LocalProfilePreferences {
  preferredName?: string | undefined;
  avatarUrl?: string | undefined;
  civilStatus: CivilStatus;
  nationality: string;
  visibleInProfile: ProfileVisibilityPreferences;
  updatedAt: string;
}

const DEFAULT_PREFERENCES: LocalProfilePreferences = {
  civilStatus: 'SOLTERO',
  nationality: 'Salvadoreña',
  visibleInProfile: {
    showPhone: true,
    showEmail: true,
    showAddress: false,
    showDateOfBirth: true,
    showMunicipality: true,
  },
  updatedAt: new Date().toISOString(),
};

const STORAGE_PREFIX = 'medicos_patient_preferences_';

class PatientProfilePreferencesService {
  private getKey(patientId: string): string {
    return `${STORAGE_PREFIX}${patientId}`;
  }

  getPreferences(patientId: string): LocalProfilePreferences {
    try {
      const raw = localStorage.getItem(this.getKey(patientId));
      if (!raw) return { ...DEFAULT_PREFERENCES };
      const parsed = JSON.parse(raw);
      return {
        civilStatus: parsed.civilStatus || DEFAULT_PREFERENCES.civilStatus,
        nationality: parsed.nationality || DEFAULT_PREFERENCES.nationality,
        preferredName: parsed.preferredName || undefined,
        avatarUrl: parsed.avatarUrl || undefined,
        visibleInProfile: {
          ...DEFAULT_PREFERENCES.visibleInProfile,
          ...(parsed.visibleInProfile || {}),
        },
        updatedAt: parsed.updatedAt || new Date().toISOString(),
      };
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  }

  savePreferences(
    patientId: string,
    updates: Partial<LocalProfilePreferences>
  ): LocalProfilePreferences {
    try {
      const current = this.getPreferences(patientId);
      const merged: LocalProfilePreferences = {
        ...current,
        ...updates,
        visibleInProfile: {
          ...current.visibleInProfile,
          ...(updates.visibleInProfile || {}),
        },
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(this.getKey(patientId), JSON.stringify(merged));
      return merged;
    } catch {
      return { ...DEFAULT_PREFERENCES, ...updates, updatedAt: new Date().toISOString() };
    }
  }

  saveAvatar(patientId: string, base64Image: string): string {
    this.savePreferences(patientId, { avatarUrl: base64Image });
    return base64Image;
  }

  removeAvatar(patientId: string): void {
    this.savePreferences(patientId, { avatarUrl: undefined });
  }
}

export const patientProfilePreferencesService = new PatientProfilePreferencesService();