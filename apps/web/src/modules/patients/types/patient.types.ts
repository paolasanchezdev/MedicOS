export interface PatientMetric {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  status: 'normal' | 'warning' | 'critical';
  updatedAt: string;
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

export interface PatientRecord {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  dui?: string | null;
  sex: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string | null;
  address: string;
  emergencyName?: string | null;
  emergencyPhone?: string | null;
  emergencyRelation?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorSummary {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface BrigadeSummary {
  id: string;
  name: string;
  department: string;
  municipality: string;
}

export interface VitalSignsRecord {
  id: string;
  patientId: string;
  consultationId?: string | null;
  temperature: number;
  heartRate: number;
  oxygenSat: number;
  systolic: number;
  diastolic: number;
  weight?: number | null;
  height?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationRecord {
  id: string;
  patientId: string;
  doctorId: string;
  clinicalRecordId: string;
  brigadeId: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  chiefComplaint: string;
  physicalExam: string;
  diagnosisCode?: string | null;
  diagnosisDesc: string;
  treatmentPlan: string;
  consultationDate: string;
  followUpDate?: string | null;
  startedAt: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  doctor: DoctorSummary;
  brigade: BrigadeSummary;
  vitalSigns: VitalSignsRecord[];
}

export interface PatientHistoryData {
  patient: PatientRecord;
  consultations: ConsultationRecord[];
  standaloneVitalSigns: VitalSignsRecord[];
}

export interface PatientHistoryResponse {
  success: boolean;
  data: PatientHistoryData;
}

export interface PatientSummaryResponse {
  success: boolean;
  proximaCita: {
    id: string;
    date: string;
    doctorName: string;
    brigadeName: string;
    location: string;
    status: string;
    diagnosisDesc: string;
  } | null;
  ultimoRegistro: {
    systolic: number;
    diastolic: number;
    heartRate: number;
    temperature: number;
    oxygenSat: number;
    createdAt: string;
  } | null;
}