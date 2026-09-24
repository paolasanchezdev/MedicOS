// =========================================================================
// ARCHIVO: apps/web/src/modules/patients/services/patient-preferences.service.ts
// DESCRIPCIÓN: Servicio de preferencias limpio. Aplica escala tipográfica
//              y accesibilidad sin alterar la paleta clínica oficial de MedicOS.
// =========================================================================

import type { PatientAppPreferences } from '../types/patient-preferences.types.js';
import { DEFAULT_PATIENT_PREFERENCES } from '../types/patient-preferences.types.js';

const STORAGE_KEY = 'medicos_patient_app_preferences';
const STYLE_TAG_ID = 'medicos-preferences-runtime-styles';

class PatientPreferencesService {
  /**
   * Obtiene las preferencias almacenadas y aplica los ajustes visuales seguros.
   */
  getPreferences(): PatientAppPreferences {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const defaults = { ...DEFAULT_PATIENT_PREFERENCES };
        this.applyToDom(defaults);
        return defaults;
      }
      const parsed = JSON.parse(raw);
      const preferences: PatientAppPreferences = {
        ...DEFAULT_PATIENT_PREFERENCES,
        ...parsed,
        tema: 'light', // Forzado a modo claro clínico para evitar rupturas de interfaz
      };
      this.applyToDom(preferences);
      return preferences;
    } catch {
      this.applyToDom(DEFAULT_PATIENT_PREFERENCES);
      return { ...DEFAULT_PATIENT_PREFERENCES };
    }
  }

  /**
   * Guarda una preferencia y actualiza el entorno en tiempo real.
   */
  savePreference<K extends keyof PatientAppPreferences>(
    key: K,
    value: PatientAppPreferences[K]
  ): PatientAppPreferences {
    const current = this.getPreferences();
    const updated: PatientAppPreferences = {
      ...current,
      [key]: value,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Manejo silencioso en entornos restringidos
    }

    this.applyToDom(updated);
    return updated;
  }

  /**
   * Restablece las preferencias a sus valores predeterminados.
   */
  resetPreferences(): PatientAppPreferences {
    const defaults: PatientAppPreferences = {
      ...DEFAULT_PATIENT_PREFERENCES,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    } catch {
      // Manejo silencioso
    }
    this.applyToDom(defaults);
    return defaults;
  }

  /**
   * Aplica ajustes no destructivos en el DOM (escala de fuente, reducción de movimiento).
   */
  applyToDom(prefs: PatientAppPreferences): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // 1. Limpieza garantizada de cualquier rastro del modo oscuro roto
    root.classList.remove('dark');
    const existingStyle = document.getElementById(STYLE_TAG_ID);
    if (existingStyle) {
      existingStyle.remove();
    }

    // 2. Escala tipográfica global (limpia y segura)
    if (prefs.tamanoTexto === 'small') {
      root.style.fontSize = '14.5px';
    } else if (prefs.tamanoTexto === 'large') {
      root.style.fontSize = '17.5px';
    } else {
      root.style.fontSize = '16px';
    }

    // 3. Reducción de animaciones (accesibilidad nativa)
    if (prefs.reducirAnimaciones) {
      root.classList.add('reduce-motion');
      let styleTag = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = STYLE_TAG_ID;
        document.head.appendChild(styleTag);
      }
      styleTag.textContent = `
        .reduce-motion *, .reduce-motion *::before, .reduce-motion *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
        }
      `;
    } else {
      root.classList.remove('reduce-motion');
    }
  }
}

export const patientPreferencesService = new PatientPreferencesService();