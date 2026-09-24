// =========================================================================
// ARCHIVO: apps/web/src/modules/patients/types/patient-preferences.types.ts
// DESCRIPCIÓN: Tipos estrictos para las preferencias clínicas y de uso de MedicOS.
// =========================================================================

export type AppTheme = 'auto' | 'light' | 'dark';
export type FontSize = 'small' | 'normal' | 'large';

export interface PatientAppPreferences {
  // 1. Notificaciones Clínicas y Citas
  notificacionesGenerales: boolean;
  recordatoriosCitas: boolean;
  resultadosDisponibles: boolean;
  mensajesMedico: boolean;
  documentosDisponibles: boolean;

  // 2. Tratamientos y Medicación
  recordatoriosTomas: boolean;
  avisoFinalizacionReceta: boolean;

  // 3. Monitoreo y Salud Preventiva
  alertasSignosVitales: boolean;
  recordatoriosVacunacion: boolean;
  consejosSaludIA: boolean;

  // 4. Canales de Entrega
  canalInApp: boolean;
  canalEmail: boolean;

  // 5. Apariencia y Lectura
  tema: AppTheme;
  tamanoTexto: FontSize;

  // 6. Accesibilidad
  mayorContraste: boolean;
  reducirAnimaciones: boolean;

  // 7. Comunicación Institucional
  comunicacionesEmail: boolean;
  avisosSistema: boolean;

  updatedAt: string;
}

export const DEFAULT_PATIENT_PREFERENCES: PatientAppPreferences = {
  notificacionesGenerales: true,
  recordatoriosCitas: true,
  resultadosDisponibles: true,
  mensajesMedico: true,
  documentosDisponibles: true,

  recordatoriosTomas: true,
  avisoFinalizacionReceta: true,

  alertasSignosVitales: true,
  recordatoriosVacunacion: true,
  consejosSaludIA: true,

  canalInApp: true,
  canalEmail: true,

  tema: 'light',
  tamanoTexto: 'normal',

  mayorContraste: false,
  reducirAnimaciones: false,

  comunicacionesEmail: true,
  avisosSistema: true,

  updatedAt: new Date().toISOString(),
};