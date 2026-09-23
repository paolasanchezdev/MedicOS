// =========================================================================
// ARCHIVO: apps/api/src/modules/clinical-messages/clinical-messages.service.ts
// DESCRIPCIÓN: Servicio de mensajería clínica con soporte para ordenamiento tipo
//              WhatsApp, edición y eliminación de mensajes por el paciente.
// =========================================================================

import { prisma } from '../../config/prisma.js';

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

const doctorAvailabilityStore = new Map<string, { status: DoctorAvailability; updatedAt: string }>();
const threadMessagesStore = new Map<string, ClinicalMessageItem[]>();

export class ClinicalMessagesService {
  private async resolvePatientId(identifier?: string): Promise<string | null> {
    if (!identifier) return null;

    const patientById = await prisma.patient.findFirst({
      where: { id: identifier, deletedAt: null },
    });
    if (patientById) return patientById.id;

    const patientByUserId = await prisma.patient.findFirst({
      where: { userId: identifier, deletedAt: null },
    });
    if (patientByUserId) return patientByUserId.id;

    const user = await prisma.user.findFirst({
      where: { id: identifier, deletedAt: null },
    });
    if (!user) return null;

    if (user.phone) {
      const cleanPhone = user.phone.replace(/\D/g, '');
      if (cleanPhone.length >= 8) {
        const patientByPhone = await prisma.patient.findFirst({
          where: { phone: { contains: cleanPhone }, deletedAt: null },
        });
        if (patientByPhone) {
          await prisma.patient.update({
            where: { id: patientByPhone.id },
            data: { userId: user.id },
          });
          return patientByPhone.id;
        }
      }
    }
    return null;
  }

  getDoctorAvailability(doctorId: string): DoctorAvailability {
    const customStatus = doctorAvailabilityStore.get(doctorId);
    if (customStatus) {
      return customStatus.status;
    }
    return 'DISPONIBLE';
  }

  updateDoctorAvailability(doctorId: string, status: DoctorAvailability): { doctorId: string; status: DoctorAvailability } {
    doctorAvailabilityStore.set(doctorId, {
      status,
      updatedAt: new Date().toISOString(),
    });
    return { doctorId, status };
  }

  async getPatientConversations(userId?: string): Promise<ClinicalConversationThread[]> {
    const patientId = await this.resolvePatientId(userId);
    if (!patientId) return [];

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      select: { id: true, firstName: true, lastName: true },
    });
    const patientFullName = patient ? `${patient.firstName} ${patient.lastName}`.trim() : 'Paciente';

    const consultations = await prisma.consultation.findMany({
      where: { patientId, deletedAt: null },
      include: {
        doctor: { select: { id: true, firstName: true, lastName: true, specialty: true } },
        brigade: { select: { name: true, municipality: true } },
      },
      orderBy: { consultationDate: 'desc' },
    });

    const threads: ClinicalConversationThread[] = [];

    const doctorsMap = new Map<string, typeof consultations[0]>();
    for (const c of consultations) {
      if (c.doctor && !doctorsMap.has(c.doctor.id)) {
        doctorsMap.set(c.doctor.id, c);
      }
    }

    for (const [docId, c] of doctorsMap.entries()) {
      const threadId = `th-${patientId}-${docId}`;
      const docName = `Dr(a). ${c.doctor.firstName} ${c.doctor.lastName}`.trim();
      const docSpecialty = c.doctor.specialty || 'Medicina General y Comunitaria';
      const establishment = c.brigade?.name || 'Sede Territorial MedicOS';

      if (!threadMessagesStore.has(threadId)) {
        threadMessagesStore.set(threadId, []);
      }

      const messages = threadMessagesStore.get(threadId) || [];
      const lastMsg: ClinicalMessageItem | undefined = messages.length > 0 ? messages[messages.length - 1] : undefined;
      const treatmentPlanClean = c.treatmentPlan && c.treatmentPlan.trim() ? c.treatmentPlan.trim() : undefined;

      threads.push({
        id: threadId,
        doctorId: docId,
        doctorName: docName,
        doctorSpecialty: docSpecialty,
        doctorAvailability: this.getDoctorAvailability(docId),
        patientId,
        patientName: patientFullName,
        relatedContext: {
          type: 'CONSULTA',
          code: `CONS-${c.id.substring(0, 6).toUpperCase()}`,
          date: c.consultationDate.toISOString(),
          diagnosisSummary: c.diagnosisDesc || c.chiefComplaint || 'Consulta Médica General',
          treatmentPlan: treatmentPlanClean,
          establishmentName: establishment,
        },
        lastMessage: lastMsg,
        unreadCount: 0,
        status: 'OPEN',
        createdAt: c.consultationDate.toISOString(),
      });
    }

    // Ordenar como WhatsApp: la conversación con el mensaje más reciente siempre arriba
    threads.sort((a, b) => {
      const timeA = new Date(a.lastMessage?.createdAt || a.relatedContext.date).getTime();
      const timeB = new Date(b.lastMessage?.createdAt || b.relatedContext.date).getTime();
      return timeB - timeA;
    });

    return threads;
  }

  async getConversationMessages(threadId: string): Promise<ClinicalMessageItem[]> {
    return threadMessagesStore.get(threadId) || [];
  }

  async postMessage(
    threadId: string,
    senderId: string,
    senderRole: 'PATIENT' | 'DOCTOR',
    senderName: string,
    type: ClinicalMessageType,
    content: string,
    payload?: ClinicalMessagePayload | undefined
  ): Promise<ClinicalMessageItem> {
    const list = threadMessagesStore.get(threadId) || [];
    const newMessage: ClinicalMessageItem = {
      id: `cmsg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      conversationId: threadId,
      senderId,
      senderRole,
      senderName,
      type,
      content,
      payload,
      status: 'DELIVERED',
      createdAt: new Date().toISOString(),
    };

    list.push(newMessage);
    threadMessagesStore.set(threadId, list);
    return newMessage;
  }

  async editMessage(threadId: string, messageId: string, newContent: string): Promise<ClinicalMessageItem | null> {
    const list = threadMessagesStore.get(threadId) || [];
    const index = list.findIndex((m) => m.id === messageId);
    if (index === -1) return null;

    const current = list[index];
    if (!current) return null;

    const updated: ClinicalMessageItem = {
      ...current,
      content: newContent,
      isEdited: true,
    };
    list[index] = updated;
    threadMessagesStore.set(threadId, list);
    return updated;
  }

  async deleteMessage(threadId: string, messageId: string): Promise<boolean> {
    const list = threadMessagesStore.get(threadId) || [];
    const filtered = list.filter((m) => m.id !== messageId);
    if (filtered.length === list.length) return false;

    threadMessagesStore.set(threadId, filtered);
    return true;
  }
}

export const clinicalMessagesService = new ClinicalMessagesService();