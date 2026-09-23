// =========================================================================
// ARCHIVO: apps/web/src/modules/clinical-messages/types/clinical-messages.types.ts
// DESCRIPCIÓN: Tipos estrictos para el canal de mensajería clínica paciente <-> médico.
// =========================================================================

export type DoctorAvailability = 'DISPONIBLE' | 'EN_CONSULTA' | 'OCUPADO' | 'DESCONECTADO';

export type ClinicalMessageType =
  | 'TEXT'
  | 'CLINICAL_SYMPTOM'
  | 'CLINICAL_LAB'
  | 'CLINICAL_RX'
  | 'SYSTEM_NOTICE';

export type MessageDeliveryStatus = 'SENT' | 'DELIVERED' | 'READ';

export interface ClinicalMessagePayload {
  symptoms?: Array<{ name: string; intensity: string; onset: string }> | undefined;
  isWarningSign?: boolean | undefined;
  warningSignTitle?: string | undefined;
  labStudyId?: string | undefined;
  labStudyCode?: string | undefined;
  labStudyName?: string | undefined;
  labAnalytesSummary?: string | undefined;
  notes?: string | undefined;
}

export interface ClinicalMessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: 'PATIENT' | 'DOCTOR' | 'SYSTEM';
  senderName: string;
  type: ClinicalMessageType;
  content: string;
  payload?: ClinicalMessagePayload | undefined;
  status: MessageDeliveryStatus;
  isEdited?: boolean | undefined;
  createdAt: string;
}

export interface ClinicalConversationThread {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvailability: DoctorAvailability;
  patientId: string;
  patientName: string;
  relatedContext: {
    type: 'CONSULTA' | 'CITA';
    code: string;
    date: string;
    diagnosisSummary: string;
    treatmentPlan?: string | undefined;
    establishmentName: string;
  };
  lastMessage?: ClinicalMessageItem | undefined;
  unreadCount: number;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
}