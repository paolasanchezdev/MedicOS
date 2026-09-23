// =========================================================================
// ARCHIVO: apps/api/src/modules/patients/patient-notifications.service.ts
// DESCRIPCIÓN: Servicio agregador transversal de eventos y avisos clínicos
//              con enlaces directos al recurso específico (Deep Linking).
// =========================================================================

import { prisma } from '../../config/prisma.js';

export type NotificationCategory =
  | 'citas'
  | 'atencion'
  | 'resultados'
  | 'medicamentos'
  | 'salud_materna'
  | 'vacunacion'
  | 'documentos'
  | 'brigadas'
  | 'mensajes'
  | 'sistema';

export interface PatientNotificationItem {
  id: string;
  type: string;
  category: NotificationCategory;
  title: string;
  description: string;
  createdAt: string;
  isRead: boolean;
  priority: 'INFO' | 'SUCCESS' | 'REMINDER' | 'WARNING' | 'IMPORTANT';
  linkUrl: string;
  actionText: string;
  metadata?: Record<string, any>;
}

const readNotificationsMap = new Map<string, Set<string>>();

export class PatientNotificationsService {
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

  async getPatientNotifications(userId?: string): Promise<PatientNotificationItem[]> {
    const patientId = await this.resolvePatientId(userId);
    const notifications: PatientNotificationItem[] = [];
    const readSet = (userId && readNotificationsMap.get(userId)) || new Set<string>();

    if (!patientId) {
      notifications.push({
        id: `sys-welcome-${userId || 'guest'}`,
        type: 'sistema',
        category: 'sistema',
        title: 'Bienvenido a MedicOS',
        description: 'Tu portal de salud territorial está activo. Aquí recibirás avisos sobre tus citas, recetas y documentos.',
        createdAt: new Date().toISOString(),
        isRead: readSet.has(`sys-welcome-${userId || 'guest'}`),
        priority: 'INFO',
        linkUrl: '/paciente/perfil/datos-personales',
        actionText: 'Completar perfil',
      });
      return notifications;
    }

    const [
      patient,
      appointments,
      consultations,
      prescriptions,
      labStudies,
      imagingStudies,
      certificates,
    ] = await Promise.all([
      prisma.patient.findUnique({
        where: { id: patientId },
        select: { id: true, firstName: true, lastName: true, createdAt: true },
      }),
      prisma.appointment.findMany({
        where: { patientId, deletedAt: null },
        include: {
          doctor: { select: { firstName: true, lastName: true } },
          establishment: { select: { name: true, municipality: true } },
        },
        orderBy: { appointmentDate: 'desc' },
        take: 8,
      }),
      prisma.consultation.findMany({
        where: { patientId, deletedAt: null },
        include: {
          doctor: { select: { firstName: true, lastName: true } },
          brigade: { select: { name: true, municipality: true } },
        },
        orderBy: { consultationDate: 'desc' },
        take: 10,
      }),
      prisma.prescription.findMany({
        where: { patientId, deletedAt: null },
        include: {
          doctor: { select: { firstName: true, lastName: true } },
          items: true,
        },
        orderBy: { issuedAt: 'desc' },
        take: 6,
      }),
      prisma.laboratoryStudy.findMany({
        where: { patientId, deletedAt: null },
        orderBy: { performedAt: 'desc' },
        take: 5,
      }),
      prisma.medicalImagingStudy.findMany({
        where: { patientId, deletedAt: null },
        orderBy: { performedAt: 'desc' },
        take: 5,
      }),
      prisma.medicalCertificate.findMany({
        where: { patientId, deletedAt: null, status: 'ACTIVE' },
        include: {
          doctor: { select: { firstName: true, lastName: true } },
        },
        orderBy: { issuedAt: 'desc' },
        take: 5,
      }),
    ]);

    // 1. Citas Médicas -> Enlace directo a la cita
    appointments.forEach((apt) => {
      const docName = apt.doctor ? `Dr(a). ${apt.doctor.firstName} ${apt.doctor.lastName}` : 'Personal Médico';
      const fecha = new Date(apt.appointmentDate).toLocaleDateString('es-SV', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      const id = `apt-${apt.id}`;

      let title = 'Cita médica confirmada';
      let priority: 'INFO' | 'IMPORTANT' | 'REMINDER' = 'IMPORTANT';
      if (apt.status === 'RESCHEDULED') {
        title = 'Cita médica reprogramada';
        priority = 'REMINDER';
      } else if (apt.status === 'CANCELLED') {
        title = 'Cita médica cancelada';
        priority = 'INFO';
      }

      notifications.push({
        id,
        type: 'cita',
        category: 'citas',
        title,
        description: `Consulta con ${docName} programada para el ${fecha}. Lugar: ${apt.establishment?.name || 'Sede Comunitaria'}.`,
        createdAt: apt.createdAt.toISOString(),
        isRead: readSet.has(id),
        priority,
        linkUrl: `/paciente/citas/mis-citas?citaId=${apt.id}`,
        actionText: 'Ver cita',
      });
    });

    // 2. Consultas Médicas, Salud Materna, Vacunación y Brigadas
    consultations.forEach((cons) => {
      const docName = cons.doctor ? `Dr(a). ${cons.doctor.firstName} ${cons.doctor.lastName}` : 'Profesional Médico';
      const rawText = `${cons.chiefComplaint || ''} ${cons.diagnosisDesc || ''}`.toLowerCase();
      const fecha = new Date(cons.consultationDate).toLocaleDateString('es-SV', {
        day: 'numeric',
        month: 'short',
      });

      if (rawText.includes('trimestre') || rawText.includes('prenatal') || rawText.includes('fetal') || rawText.includes('embarazo')) {
        const id = `mat-${cons.id}`;
        notifications.push({
          id,
          type: 'salud_materna',
          category: 'salud_materna',
          title: 'Control prenatal registrado',
          description: `Se documentó tu evaluación obstétrica del ${fecha} con ${docName}. Plan de cuidados disponible.`,
          createdAt: cons.consultationDate.toISOString(),
          isRead: readSet.has(id),
          priority: 'IMPORTANT',
          linkUrl: `/paciente/salud-materna/control-embarazo?controlId=${cons.id}`,
          actionText: 'Ver control prenatal',
        });
      } else if (rawText.includes('vacun') || rawText.includes('saramp') || rawText.includes('inmuniz')) {
        const id = `vac-${cons.id}`;
        notifications.push({
          id,
          type: 'vacuna',
          category: 'vacunacion',
          title: 'Inmunización registrada',
          description: `Se registró la aplicación de una dosis en tu esquema oficial de vacunación territorial.`,
          createdAt: cons.consultationDate.toISOString(),
          isRead: readSet.has(id),
          priority: 'INFO',
          linkUrl: `/paciente/expediente/vacunas?vacunaId=${cons.id}`,
          actionText: 'Ver vacunas',
        });
      } else {
        const id = `cons-${cons.id}`;
        notifications.push({
          id,
          type: 'atencion',
          category: 'atencion',
          title: 'Consulta médica registrada',
          description: `Atención clínica documentada por ${docName}. Los detalles de diagnóstico ya están en tu expediente.`,
          createdAt: cons.consultationDate.toISOString(),
          isRead: readSet.has(id),
          priority: 'INFO',
          linkUrl: `/paciente/expediente/consultas?consultaId=${cons.id}`,
          actionText: 'Ver consulta',
        });
      }

      // Mensaje o indicación directa del médico -> Enlace directo al hilo del médico
      if (cons.treatmentPlan && cons.treatmentPlan.trim()) {
        const id = `msg-${cons.id}`;
        const preview = cons.treatmentPlan.length > 85 ? `${cons.treatmentPlan.slice(0, 85)}…` : cons.treatmentPlan;
        notifications.push({
          id,
          type: 'mensaje',
          category: 'mensajes',
          title: `Indicación de ${docName}`,
          description: `"${preview}"`,
          createdAt: cons.consultationDate.toISOString(),
          isRead: readSet.has(id),
          priority: 'IMPORTANT',
          linkUrl: `/paciente/notificaciones/mensajes-medico?threadId=${cons.id}`,
          actionText: 'Ver mensaje',
        });
      }

      // Atención en Brigada Territorial
      if (cons.brigade) {
        const id = `brig-${cons.id}`;
        notifications.push({
          id,
          type: 'brigada',
          category: 'brigadas',
          title: 'Atención en brigada comunitaria',
          description: `Registro validado durante la jornada "${cons.brigade.name}" en ${cons.brigade.municipality}.`,
          createdAt: cons.consultationDate.toISOString(),
          isRead: readSet.has(id),
          priority: 'INFO',
          linkUrl: `/paciente/documentos/descarga-expediente?brigadaId=${cons.brigadeId}`,
          actionText: 'Ver registro territorial',
        });
      }
    });

    // 3. Recetas -> Enlace directo a la receta
    prescriptions.forEach((rx) => {
      const docName = rx.doctor ? `Dr(a). ${rx.doctor.firstName} ${rx.doctor.lastName}` : 'Médico titular';
      const itemsCount = rx.items.length;
      const id = `rx-${rx.id}`;

      notifications.push({
        id,
        type: 'receta',
        category: 'medicamentos',
        title: 'Tratamiento farmacológico prescrito',
        description: `Receta ${rx.code} emitida por ${docName} con ${itemsCount} medicamento(s) y posología.`,
        createdAt: rx.issuedAt.toISOString(),
        isRead: readSet.has(id),
        priority: 'IMPORTANT',
        linkUrl: `/paciente/tratamientos/recetas-activas?recetaId=${rx.id}`,
        actionText: 'Ver receta',
      });
    });

    // 4. Resultados de Laboratorio -> Enlace directo al estudio
    labStudies.forEach((lab) => {
      const id = `lab-${lab.id}`;
      notifications.push({
        id,
        type: 'estudio',
        category: 'resultados',
        title: 'Resultado de laboratorio disponible',
        description: `El examen "${lab.name}" se encuentra listo y consolidado para revisión en tu expediente.`,
        createdAt: lab.performedAt.toISOString(),
        isRead: readSet.has(id),
        priority: 'SUCCESS',
        linkUrl: `/paciente/estudios/resultados-laboratorio?estudioId=${lab.id}`,
        actionText: 'Ver resultado',
      });
    });

    // 5. Estudios de Imagen Médica -> Enlace directo a la imagen
    imagingStudies.forEach((img) => {
      const id = `img-${img.id}`;
      notifications.push({
        id,
        type: 'estudio',
        category: 'resultados',
        title: 'Estudio de imagen médica listo',
        description: `El informe de ${img.name} (${img.bodyRegion}) está disponible para consulta y descarga.`,
        createdAt: img.performedAt.toISOString(),
        isRead: readSet.has(id),
        priority: 'SUCCESS',
        linkUrl: `/paciente/estudios/estudios-imagen?estudioId=${img.id}`,
        actionText: 'Ver estudio',
      });
    });

    // 6. Constancias Médicas Oficiales -> Enlace directo a la constancia
    certificates.forEach((cert) => {
      const id = `cert-${cert.id}`;
      notifications.push({
        id,
        type: 'documento',
        category: 'documentos',
        title: 'Constancia médica emitida',
        description: `Constancia oficial ${cert.code} generada con validación QR criptográfica territorial.`,
        createdAt: cert.issuedAt.toISOString(),
        isRead: readSet.has(id),
        priority: 'SUCCESS',
        linkUrl: `/paciente/documentos/constancias?constanciaId=${cert.id}`,
        actionText: 'Ver constancia',
      });
    });

    // 7. Notificación de Sistema (Seguridad de Cuenta)
    if (patient) {
      const id = `sys-verified-${patient.id}`;
      notifications.push({
        id,
        type: 'sistema',
        category: 'sistema',
        title: 'Expediente clínico verificado',
        description: 'Tu expediente electrónico se encuentra respaldado y sincronizado en la Red Nacional de Salud.',
        createdAt: patient.createdAt.toISOString(),
        isRead: readSet.has(id),
        priority: 'INFO',
        linkUrl: '/paciente/perfil/seguridad',
        actionText: 'Ver seguridad',
      });
    }

    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return notifications;
  }

  async markAsRead(userId: string, notificationId: string): Promise<{ success: boolean }> {
    if (!readNotificationsMap.has(userId)) {
      readNotificationsMap.set(userId, new Set<string>());
    }
    readNotificationsMap.get(userId)!.add(notificationId);
    return { success: true };
  }

  async markAllAsRead(userId: string): Promise<{ success: boolean; count: number }> {
    const list = await this.getPatientNotifications(userId);
    if (!readNotificationsMap.has(userId)) {
      readNotificationsMap.set(userId, new Set<string>());
    }
    const set = readNotificationsMap.get(userId)!;
    list.forEach((n) => set.add(n.id));
    return { success: true, count: list.length };
  }
}

export const patientNotificationsService = new PatientNotificationsService();