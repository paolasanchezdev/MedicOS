 // =========================================================================
// ARCHIVO: apps/web/src/modules/qr/types/qr.types.ts
// DESCRIPCIÓN: Definiciones de tipos para el scanner transversal de MedicOS.
// =========================================================================

export type ScannerStatus = 
  | 'IDLE' 
  | 'REQUESTING_CAMERA' 
  | 'SCANNING' 
  | 'RESOLVING' 
  | 'SUCCESS' 
  | 'ERROR';

export type ScannerErrorCode = 
  | 'CAMERA_PERMISSION_DENIED'
  | 'NO_CAMERAS_FOUND'
  | 'CAMERA_BUSY'
  | 'INVALID_QR'
  | 'PATIENT_NOT_FOUND'
  | 'UNAUTHORIZED_SCAN'
  | 'NETWORK_ERROR'
  | 'UNKNOWN';

export interface EmergencyContactSummary {
  name: string;
  phone: string;
  relationship: string;
}

export interface HealthSummaryInfo {
  allergies?: string;
  chronicDiseases?: string;
  medication?: string;
  observations?: string;
}

export interface LastVitalSignsSummary {
  systolic: number;
  diastolic: number;
  heartRate: number;
  temperature: number;
  oxygenSat: number;
  createdAt: string;
}

export interface ResolvedPatientQRData {
  id: string;
  expediente: string;
  dui: string | null;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  sex: string;
  phone: string | null;
  address: string;
  bloodType: string;
  emergencyContact: EmergencyContactSummary | null;
  healthSummary: HealthSummaryInfo;
  clinicalRecordId: string | null;
  lastVitalSigns: LastVitalSignsSummary | null;
}

export interface ResolvePatientQRResponse {
  success: boolean;
  matchType: string;
  scannerRole: string;
  patient: ResolvedPatientQRData;
  error?: string;
}