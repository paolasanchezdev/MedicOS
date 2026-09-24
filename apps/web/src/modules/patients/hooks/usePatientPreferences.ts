// =========================================================================
// ARCHIVO: apps/web/src/modules/patients/hooks/usePatientPreferences.ts
// DESCRIPCIÓN: Custom hook que ejecuta la sincronización con el DOM en cada cambio.
// =========================================================================

import { useState, useCallback, useRef, useEffect } from 'react';
import type { PatientAppPreferences } from '../types/patient-preferences.types.js';
import { DEFAULT_PATIENT_PREFERENCES } from '../types/patient-preferences.types.js';
import { patientPreferencesService } from '../services/patient-preferences.service.js';

export type SaveStatus = 'idle' | 'saving' | 'saved';

export function usePatientPreferences() {
  const [preferences, setPreferences] = useState<PatientAppPreferences>(() => {
    try {
      return patientPreferencesService.getPreferences();
    } catch {
      return DEFAULT_PATIENT_PREFERENCES;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Escuchar cambios de preferencia de color en el sistema si está en 'auto'
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      const current = patientPreferencesService.getPreferences();
      if (current.tema === 'auto') {
        patientPreferencesService.applyToDom(current);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const refetch = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      const data = patientPreferencesService.getPreferences();
      setPreferences(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar preferencias');
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePreference = useCallback(
    <K extends keyof PatientAppPreferences>(key: K, value: PatientAppPreferences[K]) => {
      setSaveStatus('saving');
      const updated = patientPreferencesService.savePreference(key, value);
      setPreferences(updated);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setSaveStatus('saved');
        timerRef.current = setTimeout(() => setSaveStatus('idle'), 2000);
      }, 250);
    },
    []
  );

  const resetPreferences = useCallback(() => {
    setSaveStatus('saving');
    const defaults = patientPreferencesService.resetPreferences();
    setPreferences(defaults);
    setIsResetModalOpen(false);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSaveStatus('saved');
      timerRef.current = setTimeout(() => setSaveStatus('idle'), 2000);
    }, 250);
  }, []);

  return {
    preferences,
    loading,
    error,
    saveStatus,
    isResetModalOpen,
    setIsResetModalOpen,
    updatePreference,
    resetPreferences,
    refetch,
  };
}