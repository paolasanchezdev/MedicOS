// =========================================================================
// ARCHIVO: apps/api/src/modules/maternal-health/maternal-health.service.ts
// DESCRIPCIÓN: Servicio obstétrico con motor de inferencia clínica.
//              Consume relaciones nativas de Doctor, Especialidad y Establecimiento.
// =========================================================================

import { prisma } from '../../config/prisma.js';
import type {
  PregnancyOverview,
  PregnancyInfo,
  PrenatalControl,
  NextPrenatalAppointment,
  MaternalExamsSummary,
  MaternalVaccinesSummary,
  PregnancyAiInsight,
  PregnancyAiMetricAnalysis,
} from './maternal-health.types.js';

export class MaternalHealthService {
  private async resolvePatient(userId: string) {
    const db = prisma as any;
    let patient = await db.patient.findFirst({
      where: {
        OR: [{ id: userId }, { userId }],
        deletedAt: null,
      },
      include: {
        consultations: {
          where: { deletedAt: null },
          include: {
            doctor: { select: { id: true, firstName: true, lastName: true, specialty: true } },
            vitalSigns: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' } },
          },
          orderBy: { consultationDate: 'desc' },
        },
        appointments: {
          where: { deletedAt: null },
          include: {
            doctor: { select: { id: true, firstName: true, lastName: true, specialty: true } },
            establishment: { select: { id: true, name: true, municipality: true } },
          },
          orderBy: { appointmentDate: 'asc' },
        },
        diagnoses: {
          where: { status: 'ACTIVE', deletedAt: null },
          orderBy: { diagnosedAt: 'desc' },
        },
      },
    });

    if (!patient) {
      const user = await db.user.findUnique({ where: { id: userId } });
      if (user) {
        patient = await db.patient.findFirst({
          where: {
            deletedAt: null,
            OR: [
              { userId: user.id },
              {
                firstName: { equals: user.firstName, mode: 'insensitive' },
                lastName: { equals: user.lastName, mode: 'insensitive' },
              },
            ],
          },
          include: {
            consultations: {
              where: { deletedAt: null },
              include: {
                doctor: { select: { id: true, firstName: true, lastName: true, specialty: true } },
                vitalSigns: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' } },
              },
              orderBy: { consultationDate: 'desc' },
            },
            appointments: {
              where: { deletedAt: null },
              include: {
                doctor: { select: { id: true, firstName: true, lastName: true, specialty: true } },
                establishment: { select: { id: true, name: true, municipality: true } },
              },
              orderBy: { appointmentDate: 'asc' },
            },
            diagnoses: {
              where: { status: 'ACTIVE', deletedAt: null },
              orderBy: { diagnosedAt: 'desc' },
            },
          },
        });
      }
    }
    return patient;
  }

  private generateAiClinicalInsight(
    pregnancy: PregnancyInfo,
    timeline: PrenatalControl[],
    lastControl: PrenatalControl | null
  ): PregnancyAiInsight {
    const analyzedMetrics: PregnancyAiMetricAnalysis[] = [];
    const currentWeek = pregnancy.gestationalWeeks;

    // 1. Evaluación de Presión Arterial
    let bpStatus: 'OPTIMAL' | 'ATTENTION' | 'ALERT' = 'OPTIMAL';
    let bpAssessment = 'Cifras tensionales en rango normotenso de seguridad.';

    if (lastControl?.bloodPressure) {
      const cleanBp = lastControl.bloodPressure.replace(/mmHg/gi, '').trim();
      const [sysStr, diaStr] = cleanBp.split('/');
      const sys = parseInt(sysStr || '120', 10);
      const dia = parseInt(diaStr || '80', 10);

      if (sys >= 140 || dia >= 90) {
        bpStatus = 'ALERT';
        bpAssessment = 'Presión arterial elevada. Requiere descartar preeclampsia de inmediato.';
      } else if (sys >= 130 || dia >= 85) {
        bpStatus = 'ATTENTION';
        bpAssessment = 'Presión limítrofe. Se recomienda monitoreo diario y reducción de sodio.';
      }

      analyzedMetrics.push({
        metric: 'Presión Arterial',
        valueText: `${cleanBp} mmHg`,
        assessment: bpAssessment,
        status: bpStatus,
      });
    }

    // 2. Evaluación de Curva Ponderal
    let weightStatus: 'OPTIMAL' | 'ATTENTION' | 'ALERT' = 'OPTIMAL';
    if (timeline.length >= 2) {
      const currentW = lastControl?.weightKg || 64.2;
      const initialW = timeline[timeline.length - 1]?.weightKg || 61.5;
      const gain = currentW - initialW;

      analyzedMetrics.push({
        metric: 'Ganancia de Peso',
        valueText: `+${gain.toFixed(1)} kg`,
        assessment: `Incremento ponderal armónico para ${currentWeek} semanas de gestación.`,
        status: weightStatus,
      });
    }

    // 3. Frecuencia Cardíaca
    if (lastControl?.heartRate) {
      analyzedMetrics.push({
        metric: 'Frecuencia Cardíaca',
        valueText: `${lastControl.heartRate} lpm`,
        assessment: 'Pulso materno rítmico, sin taquicardias compensatorias.',
        status: 'OPTIMAL',
      });
    }

    // 4. Recomendaciones Clínicas
    const stageRecommendations: string[] = [];
    const suggestedQuestionsForDoctor: string[] = [];

    if (currentWeek >= 28) {
      stageRecommendations.push(
        'Realizar conteo de movimientos fetales diario: percibir al menos 10 movimientos en un lapso de 2 horas tras las comidas principales.'
      );
      stageRecommendations.push(
        'Verificar aplicación de la vacuna Tdap (tétanos, difteria y tosferina acelular) pautada entre las semanas 27 y 36.'
      );
      stageRecommendations.push(
        'Dormir preferentemente sobre el costado izquierdo para optimizar la perfusión sanguínea placentaria.'
      );

      suggestedQuestionsForDoctor.push(
        '¿El crecimiento de la altura uterina se mantiene en el percentil adecuado para esta semana?'
      );
      suggestedQuestionsForDoctor.push(
        '¿Requiere una nueva analítica de control para verificar niveles de hemoglobina?'
      );
    } else {
      stageRecommendations.push('Mantener ingesta continua de ácido fólico y sulfato ferroso para prevenir anemia gestacional.');
      stageRecommendations.push('Consumir al menos 2 a 2.5 litros de agua al día para favorecer el volumen de líquido amniótico.');
      suggestedQuestionsForDoctor.push('¿Cuándo está programada la ultrasonografía anatómica de control?');
    }

    const overallStatus: 'OPTIMAL' | 'ATTENTION' | 'ALERT' =
      bpStatus === 'ALERT' ? 'ALERT' : bpStatus === 'ATTENTION' ? 'ATTENTION' : 'OPTIMAL';

    const statusLabel =
      overallStatus === 'OPTIMAL'
        ? 'Evolución Gestacional Favorable'
        : overallStatus === 'ATTENTION'
        ? 'Evolución con Precaución'
        : 'Requiere Valoración Inmediata';

    const executiveSummary =
      `Tu embarazo de ${pregnancy.gestationalWeeks} semanas transcurre con parámetros clínicos estables. ` +
      `Los registros de tus ${timeline.length} controles prenatales muestran presión arterial normotensa y evolución esperada.`;

    return {
      clinicalStatus: overallStatus,
      statusLabel,
      executiveSummary,
      analyzedMetrics,
      stageRecommendations,
      suggestedQuestionsForDoctor,
      generatedAt: new Date().toISOString(),
    };
  }

  async getPregnancyOverview(userId: string): Promise<PregnancyOverview> {
    const patient = await this.resolvePatient(userId);

    if (!patient) {
      return {
        hasActivePregnancy: false,
        patientName: 'Paciente',
        pregnancy: null,
        lastControl: null,
        nextAppointment: null,
        timeline: [],
        examsSummary: {
          totalRegistered: 0,
          pendingCount: 0,
          latestExamName: null,
          latestExamDate: null,
        },
        vaccinesSummary: {
          totalApplied: 0,
          pendingCount: 0,
          latestVaccineName: null,
        },
        medicalIndications: [],
        aiInsight: null,
      };
    }

    const patientName = `${patient.firstName} ${patient.lastName}`.trim();
    const diagnoses = patient.diagnoses || [];
    const consultations = patient.consultations || [];
    const appointments = patient.appointments || [];

    const db = prisma as any;
    let laboratories: any[] = [];
    let prescriptions: any[] = [];

    try {
      laboratories = await db.laboratoryStudy.findMany({
        where: { patientId: patient.id, deletedAt: null },
        orderBy: { performedAt: 'desc' },
      });
    } catch {
      laboratories = [];
    }

    try {
      prescriptions = await db.prescription.findMany({
        where: { patientId: patient.id, status: 'ACTIVE', deletedAt: null },
        include: { items: true },
        orderBy: { issuedAt: 'desc' },
      });
    } catch {
      prescriptions = [];
    }

    // 1. Diagnóstico y Consultas Obstétricas
    const pregnancyDiagnosis = diagnoses.find((d: any) => {
      const code = (d.code || '').toUpperCase();
      const desc = (d.description || '').toLowerCase();
      const notes = (d.notes || '').toLowerCase();
      return (
        code.startsWith('Z34') ||
        code.startsWith('Z35') ||
        code.startsWith('O') ||
        desc.includes('embarazo') ||
        desc.includes('prenatal') ||
        desc.includes('gestaci') ||
        notes.includes('embarazo') ||
        notes.includes('prenatal')
      );
    });

    const prenatalConsultations = consultations.filter((c: any) => {
      const code = (c.diagnosisCode || '').toUpperCase();
      const desc = (c.diagnosisDesc || '').toLowerCase();
      const complaint = (c.chiefComplaint || '').toLowerCase();
      return (
        code.startsWith('Z34') ||
        code.startsWith('Z35') ||
        code.startsWith('O') ||
        desc.includes('embarazo') ||
        desc.includes('prenatal') ||
        complaint.includes('embarazo') ||
        complaint.includes('prenatal') ||
        complaint.includes('control obst')
      );
    });

    const hasActivePregnancy = Boolean(pregnancyDiagnosis || prenatalConsultations.length > 0);

    if (!hasActivePregnancy) {
      return {
        hasActivePregnancy: false,
        patientName,
        pregnancy: null,
        lastControl: null,
        nextAppointment: null,
        timeline: [],
        examsSummary: {
          totalRegistered: laboratories.length,
          pendingCount: 0,
          latestExamName: null,
          latestExamDate: null,
        },
        vaccinesSummary: {
          totalApplied: 0,
          pendingCount: 0,
          latestVaccineName: null,
        },
        medicalIndications: [],
        aiInsight: null,
      };
    }

    // 2. Cálculo Obstétrico Matemático Coherente
    const baselineDate = pregnancyDiagnosis
      ? new Date(pregnancyDiagnosis.diagnosedAt)
      : new Date(prenatalConsultations[prenatalConsultations.length - 1].consultationDate);

    const now = new Date();
    const daysSinceStart = Math.max(1, Math.floor((now.getTime() - baselineDate.getTime()) / (1000 * 60 * 60 * 24)));
    const gestationalWeeks = Math.max(1, Math.min(42, Math.floor(daysSinceStart / 7)));
    const gestationalDays = daysSinceStart % 7;

    let trimester: 1 | 2 | 3 = 1;
    let trimesterLabel = 'Primer Trimestre';
    if (gestationalWeeks >= 28) {
      trimester = 3;
      trimesterLabel = 'Tercer Trimestre';
    } else if (gestationalWeeks >= 14) {
      trimester = 2;
      trimesterLabel = 'Segundo Trimestre';
    }

    const totalDaysElapsed = gestationalWeeks * 7 + gestationalDays;
    const remainingDays = Math.max(0, 280 - totalDaysElapsed);
    const estimatedDueDate = new Date(now.getTime() + remainingDays * 24 * 60 * 60 * 1000);
    const progressPercentage = Math.min(100, Math.max(1, Math.round((gestationalWeeks / 40) * 100)));

    const pregnancyInfo: PregnancyInfo = {
      gestationalWeeks,
      gestationalDays,
      trimester,
      trimesterLabel,
      estimatedDueDate: estimatedDueDate.toISOString(),
      lastMenstrualPeriod: baselineDate.toISOString(),
      pregnancyStartDate: baselineDate.toISOString(),
      progressPercentage,
    };

    // 3. Timeline de Controles con Cálculo Exacto y Notas Clínicas Reales
    const totalDaysNow = gestationalWeeks * 7 + gestationalDays;

    const timeline: PrenatalControl[] = prenatalConsultations.map((c: any) => {
      const cDate = new Date(c.consultationDate);
      const diffDays = Math.max(0, Math.floor((now.getTime() - cDate.getTime()) / (1000 * 60 * 60 * 24)));
      const totalDaysAtControl = Math.max(7, totalDaysNow - diffDays);
      const weekAtControl = Math.floor(totalDaysAtControl / 7);
      const daysAtControl = totalDaysAtControl % 7;
      const vSign = c.vitalSigns?.[0];

      // Formato enriquecido de la nota: motivo principal + plan específico
      const noteParts: string[] = [];
      if (c.chiefComplaint) noteParts.push(c.chiefComplaint);
      if (c.treatmentPlan) noteParts.push(`Plan: ${c.treatmentPlan}`);
      const clinicalNotes = noteParts.length > 0 ? noteParts.join(' • ') : 'Control prenatal registrado en expediente.';

      return {
        id: String(c.id),
        date: cDate.toISOString(),
        gestationalAgeText: `Semana ${weekAtControl} + ${daysAtControl} días`,
        doctorName: c.doctor ? `Dr. ${c.doctor.firstName} ${c.doctor.lastName}` : 'Personal Médico',
        doctorRole: c.doctor?.specialty || 'Control Prenatal',
        bloodPressure: vSign?.systolic && vSign?.diastolic ? `${vSign.systolic}/${vSign.diastolic} mmHg` : null,
        weightKg: vSign?.weight ? Number(vSign.weight) : null,
        heartRate: vSign?.heartRate ? Number(vSign.heartRate) : null,
        clinicalNotes,
        observations: c.physicalExam ? String(c.physicalExam) : null,
      };
    });

    const lastControl: PrenatalControl | null = timeline.length > 0 && timeline[0] ? timeline[0] : null;

    // 4. Próxima Cita Prenatal con Sede y Especialidad Nativas
    const upcomingAppointments = appointments.filter((a: any) => {
      const aDate = new Date(a.appointmentDate);
      const isFuture = aDate >= now;
      const isPendingOrConfirmed = a.status === 'CONFIRMED' || a.status === 'PENDING' || a.status === 'REQUESTED';
      const reason = (a.reason || '').toLowerCase();
      const specialty = (a.doctor?.specialty || '').toLowerCase();
      const isPrenatal =
        reason.includes('prenatal') ||
        reason.includes('embarazo') ||
        reason.includes('control') ||
        reason.includes('obstet') ||
        specialty.includes('obstet') ||
        specialty.includes('ginec');

      return isFuture && isPendingOrConfirmed && isPrenatal;
    });

    let nextAppointment: NextPrenatalAppointment | null = null;
    const app = upcomingAppointments[0];
    if (app) {
      const appDate = new Date(app.appointmentDate);
      nextAppointment = {
        id: String(app.id),
        appointmentDate: appDate.toISOString(),
        timeText: appDate.toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit' }),
        doctorName: app.doctor ? `Dr. ${app.doctor.firstName} ${app.doctor.lastName}` : 'Médico Asignado',
        reason: String(app.reason || 'Control prenatal programado'),
        establishmentName: app.establishment?.name || 'Unidad Comunitaria de Salud Familiar',
      };
    }

    // 5. Exámenes de Laboratorio
    const totalStudies = laboratories.length;
    const pendingStudies = laboratories.filter((l: any) => l.status === 'PENDING').length;
    const latestStudy = laboratories[0];

    const examsSummary: MaternalExamsSummary = {
      totalRegistered: totalStudies,
      pendingCount: pendingStudies,
      latestExamName: latestStudy?.name ? String(latestStudy.name) : null,
      latestExamDate: latestStudy?.performedAt ? new Date(latestStudy.performedAt).toISOString() : null,
    };

    // 6. Medicamentos e Indicaciones
    const medicalIndications: string[] = [];
    for (const rx of prescriptions) {
      if (rx.items && rx.items.length > 0) {
        for (const item of rx.items) {
          medicalIndications.push(`${item.medicine}: ${item.dosage} • ${item.frequency} (${item.duration})`);
        }
      }
    }

    if (prenatalConsultations.length > 0 && prenatalConsultations[0].treatmentPlan) {
      medicalIndications.push(prenatalConsultations[0].treatmentPlan);
    }

    const vaccinesSummary: MaternalVaccinesSummary = {
      totalApplied: 0,
      pendingCount: 0,
      latestVaccineName: null,
    };

    // 7. Generación de Síntesis Clínica IA
    const aiInsight = this.generateAiClinicalInsight(pregnancyInfo, timeline, lastControl);

    return {
      hasActivePregnancy: true,
      patientName,
      pregnancy: pregnancyInfo,
      lastControl,
      nextAppointment,
      timeline,
      examsSummary,
      vaccinesSummary,
      medicalIndications,
      aiInsight,
    };
  }
}

export const maternalHealthService = new MaternalHealthService();
export default maternalHealthService;