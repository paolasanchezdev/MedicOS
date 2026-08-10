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