// =========================================================================
// ARCHIVO: apps/api/src/modules/personalized-advice/personalized-advice.service.ts
// DESCRIPCIÓN: Motor de autocuidado clínico basado en datos reales del expediente
//              (signos, recetas, hábitos, metas y laboratorios) sin cortes de texto.
// =========================================================================

import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';
import type {
  PersonalizedAdviceDTO,
  PersonalizedAdviceResponse,
  AdviceCategory,
} from './personalized-advice.types.js';

export class PersonalizedAdviceService extends BaseService {
  private getApiKey(): string | undefined {
    return process.env.GEMINI_API_KEY?.trim();
  }

  private async resolvePatient(userId: string) {
    const db = prisma as any;
    let patient = await db.patient.findFirst({
      where: {
        OR: [{ id: userId }, { userId }],
        deletedAt: null,
      },
      include: {
        lifestyleHabitLogs: {
          orderBy: { loggedDate: 'desc' },
          take: 30,
        },
        lifestyleActivities: {
          where: { deletedAt: null },
          orderBy: { performedAt: 'desc' },
          take: 15,
        },
        lifestyleGoals: {
          where: { status: 'IN_PROGRESS', deletedAt: null },
          take: 5,
        },
        vitalSigns: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
        diagnoses: {
          where: { status: 'ACTIVE', deletedAt: null },
          take: 5,
        },
        prescriptions: {
          where: { status: 'ACTIVE', deletedAt: null },
          include: { items: true },
          take: 3,
        },
        laboratoryStudies: {
          where: { deletedAt: null },
          include: { analytes: true },
          orderBy: { performedAt: 'desc' },
          take: 3,
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
            lifestyleHabitLogs: { orderBy: { loggedDate: 'desc' }, take: 30 },
            lifestyleActivities: { where: { deletedAt: null }, orderBy: { performedAt: 'desc' }, take: 15 },
            lifestyleGoals: { where: { status: 'IN_PROGRESS', deletedAt: null }, take: 5 },
            vitalSigns: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 3 },
            diagnoses: { where: { status: 'ACTIVE', deletedAt: null }, take: 5 },
            prescriptions: { where: { status: 'ACTIVE', deletedAt: null }, include: { items: true }, take: 3 },
            laboratoryStudies: { where: { deletedAt: null }, include: { analytes: true }, orderBy: { performedAt: 'desc' }, take: 3 },
          },
        });
      }
    }
    return patient;
  }

  async getPersonalizedAdvice(userId: string): Promise<PersonalizedAdviceResponse> {
    const patient = await this.resolvePatient(userId);
    if (!patient) {
      return {
        patientName: 'Paciente',
        hasEnoughData: false,
        dailyFocus: null,
        recommendations: [],
        evaluatedCategories: [],
      };
    }

    const patientName = patient.firstName || 'Paciente';
    const habitLogs = patient.lifestyleHabitLogs || [];
    const activities = patient.lifestyleActivities || [];
    const goals = patient.lifestyleGoals || [];
    const vitals = patient.vitalSigns || [];
    const prescriptions = patient.prescriptions || [];
    const diagnoses = patient.diagnoses || [];

    const recommendations: PersonalizedAdviceDTO[] = [];
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    // =========================================================================
    // 1. CONSEJO: ACTIVIDAD FÍSICA Y META SEMANAL REAL
    // =========================================================================
    const recentActivities = activities.filter((a: any) => new Date(a.performedAt) >= oneWeekAgo);
    const activeActivityGoal = goals.find((g: any) => g.habitType === 'ACTIVITY');
    const activityDaysCount = new Set(
      recentActivities.map((a: any) => new Date(a.performedAt).toISOString().split('T')[0])
    ).size;

    if (activeActivityGoal) {
      const targetDays = activeActivityGoal.targetDays || 4;
      const daysLeft = Math.max(0, targetDays - activityDaysCount);
      recommendations.push({
        id: 'adv-activity-goal',
        category: 'ACTIVITY',
        categoryLabel: 'Actividad Física',
        title: 'Progreso de tu meta semanal',
        summary: activityDaysCount >= targetDays
          ? `¡Excelente! Cumpliste tu objetivo semanal con ${activityDaysCount} días activos registrados.`
          : `Llevas ${activityDaysCount} de ${targetDays} días activos esta semana. Te faltan ${daysLeft} sesión(es) para tu objetivo.`,
        explanation: `Fijaste una meta de ${targetDays} días por semana. Mantener continuidad en caminatas o ejercicios moderados fortalece tu gasto cardíaco y reduce el estrés oxidativo.`,
        isDailyFocus: false,
        priority: activityDaysCount < targetDays ? 'HIGH' : 'MEDIUM',
        actionType: 'LOG_HABIT',
        actionLabel: 'Registrar sesión hoy',
        actionPayload: { habitType: 'ACTIVITY', redirect: '/paciente/monitoreo/habitos-estilo-vida' },
        dataSources: [
          { label: 'Meta de actividad física', detail: `${targetDays} días por semana`, authorized: true },
          { label: 'Sesiones registradas', detail: `${activityDaysCount} día(s) completado(s) esta semana`, authorized: true },
        ],
        generatedByAI: false,
        createdAt: new Date().toISOString(),
      });
    } else {
      recommendations.push({
        id: 'adv-activity-start',
        category: 'ACTIVITY',
        categoryLabel: 'Actividad Física',
        title: 'Activa tu plan de movimiento',
        summary: 'No tienes una meta semanal activa. Establecer 3 días de caminata favorece tu metabolismo.',
        explanation: 'Las pausas activas y caminatas continuas de 25 minutos ayudan a estabilizar los niveles de presión arterial y glucosa.',
        isDailyFocus: false,
        priority: 'MEDIUM',
        actionType: 'SET_GOAL',
        actionLabel: 'Establecer objetivo semanal',
        actionPayload: { defaultType: 'ACTIVITY', redirect: '/paciente/monitoreo/habitos-estilo-vida' },
        dataSources: [
          { label: 'Estado de objetivos', detail: 'Sin meta de actividad vigente en expediente', authorized: true },
        ],
        generatedByAI: false,
        createdAt: new Date().toISOString(),
      });
    }

    // =========================================================================
    // 2. CONSEJO: HIDRATACIÓN BASADA EN REGISTROS REALES
    // =========================================================================
    const waterLogs = habitLogs.filter((h: any) => h.habitType === 'WATER');
    const recentWaterLogs = waterLogs.filter((h: any) => new Date(h.loggedDate) >= oneWeekAgo);

    if (recentWaterLogs.length > 0) {
      const avgGlasses =
        recentWaterLogs.reduce((acc: number, curr: any) => acc + (curr.value || 0), 0) /
        recentWaterLogs.length;

      const summaryText = avgGlasses >= 6
        ? `Excelente ritmo: promedias ${avgGlasses.toFixed(1)} vasos diarios en tus ${recentWaterLogs.length} registros recientes.`
        : `Tu promedio registrado es de ${avgGlasses.toFixed(1)} vasos diarios. Procura sumar 2 vasos adicionales para alcanzar tu requerimiento hídrico.`;

      recommendations.push({
        id: 'adv-water-tracking',
        category: 'WATER',
        categoryLabel: 'Hidratación',
        title: 'Balance hídrico y consumo de agua',
        summary: summaryText,
        explanation: 'Una hidratación adecuada favorece la función de filtrado renal, optimiza el volumen plasmático y previene la fatiga diurna.',
        isDailyFocus: false,
        priority: avgGlasses < 6 ? 'HIGH' : 'LOW',
        actionType: 'LOG_HABIT',
        actionLabel: 'Registrar agua hoy',
        actionPayload: { habitType: 'WATER', redirect: '/paciente/monitoreo/habitos-estilo-vida' },
        dataSources: [
          { label: 'Bitácora de hidratación', detail: `${recentWaterLogs.length} tomas ingresadas en los últimos 7 días`, authorized: true },
        ],
        generatedByAI: false,
        createdAt: new Date().toISOString(),
      });
    } else {
      recommendations.push({
        id: 'adv-water-start',
        category: 'WATER',
        categoryLabel: 'Hidratación',
        title: 'Comienza tu registro diario de agua',
        summary: 'Aún no registras consumo de agua esta semana. Anotar tus tomas te ayuda a cumplir tu meta de 6 a 8 vasos.',
        explanation: 'Registrar cada vaso consumido visibiliza tus hábitos de hidratación y te protege contra la fatiga y cefaleas tensionales.',
        isDailyFocus: false,
        priority: 'MEDIUM',
        actionType: 'LOG_HABIT',
        actionLabel: 'Registrar primer vaso',
        actionPayload: { habitType: 'WATER', redirect: '/paciente/monitoreo/habitos-estilo-vida' },
        dataSources: [
          { label: 'Registro de hidratación', detail: 'Sin tomas registradas en la última semana', authorized: true },
        ],
        generatedByAI: false,
        createdAt: new Date().toISOString(),
      });
    }

    // =========================================================================
    // 3. CONSEJO: DESCANSO Y SUEÑO (ENFOQUE DE HOY CON TEXTO COMPLETO)
    // =========================================================================
    const sleepLogs = habitLogs.filter((h: any) => h.habitType === 'SLEEP');
    const recentSleepLogs = sleepLogs.filter((h: any) => new Date(h.loggedDate) >= oneWeekAgo);

    if (recentSleepLogs.length >= 2) {
      const avgSleep =
        recentSleepLogs.reduce((acc: number, curr: any) => acc + (curr.value || 0), 0) /
        recentSleepLogs.length;

      recommendations.push({
        id: 'adv-sleep-routine',
        category: 'SLEEP',
        categoryLabel: 'Descanso y Sueño',
        title: 'Regularidad en tus horas de sueño',
        summary: `Tus registros recientes muestran un promedio de ${avgSleep.toFixed(1)} horas por noche. Procura mantener un horario fijo para acostarte y despertar.`,
        explanation: 'Dormir entre 7 y 8 horas continuas sincroniza el reloj circadiano, disminuye la secreción nocturna de cortisol y favorece la reparación muscular.',
        isDailyFocus: true,
        priority: 'HIGH',
        actionType: 'LOG_HABIT',
        actionLabel: 'Registrar descanso',
        actionPayload: { habitType: 'SLEEP', redirect: '/paciente/monitoreo/habitos-estilo-vida' },
        dataSources: [
          { label: 'Bitácora de sueño', detail: `${recentSleepLogs.length} noches registradas recientemente`, authorized: true },
        ],
        generatedByAI: false,
        createdAt: new Date().toISOString(),
      });
    } else {
      recommendations.push({
        id: 'adv-sleep-habits',
        category: 'SLEEP',
        categoryLabel: 'Descanso y Sueño',
        title: 'Higiene del sueño reparador',
        summary: 'Desconectar pantallas 30 minutos antes de dormir y mantener una habitación fresca te ayudará a alcanzar un sueño continuo de 7 a 8 horas.',
        explanation: 'La luz azul de teléfonos y computadoras interfiere con la producción natural de melatonina, retrasando la fase de sueño profundo.',
        isDailyFocus: true,
        priority: 'MEDIUM',
        actionType: 'LOG_HABIT',
        actionLabel: 'Registrar horas de sueño',
        actionPayload: { habitType: 'SLEEP', redirect: '/paciente/monitoreo/habitos-estilo-vida' },
        dataSources: [
          { label: 'Guía de higiene del sueño', detail: 'Pauta pedagógica institucional MedicOS', authorized: true },
        ],
        generatedByAI: false,
        createdAt: new Date().toISOString(),
      });
    }

    // =========================================================================
    // 4. CONSEJO: MONITOREO DE SIGNOS VITALES FISIOLÓGICOS REALES
    // =========================================================================
    if (vitals.length >= 1) {
      const latestV = vitals[0];
      const isNormotensive = latestV.systolic <= 125 && latestV.diastolic <= 85;

      const summaryVitals = isNormotensive
        ? `Tus lecturas recientes (${latestV.systolic}/${latestV.diastolic} mmHg, pulso ${latestV.heartRate} lpm) reflejan un control cardiovascular estable. Continúa con tus hábitos de hidratación y caminata.`
        : `Tu último control registró ${latestV.systolic}/${latestV.diastolic} mmHg. Recuerda moderar el consumo de sal, mantenerte hidratado y comentarlo en tu próxima consulta.`;

      recommendations.push({
        id: 'adv-vitals-context',
        category: 'PREVENTION',
        categoryLabel: 'Signos Vitales',
        title: 'Seguimiento cardiovascular preventivo',
        summary: summaryVitals,
        explanation: 'Los signos vitales reflejan la respuesta fisiológica de tus órganos vitales. Un estilo de vida balanceado ayuda a sostener estas cifras sin sobrecargar el corazón.',
        isDailyFocus: false,
        priority: isNormotensive ? 'LOW' : 'HIGH',
        actionType: 'VIEW_VITALS',
        actionLabel: 'Ver evolución de signos',
        actionPayload: { redirect: '/paciente/monitoreo/signos-vitales' },
        dataSources: [
          { label: 'Control de signos vitales', detail: `PA ${latestV.systolic}/${latestV.diastolic} mmHg • Pulso ${latestV.heartRate} lpm del ${new Date(latestV.createdAt).toLocaleDateString('es-ES')}`, authorized: true },
        ],
        generatedByAI: false,
        createdAt: new Date().toISOString(),
      });
    }

    // =========================================================================
    // 5. CONSEJO: ADHERENCIA A FARMACOTERAPIA Y RECETAS MÉDICAS
    // =========================================================================
    if (prescriptions.length > 0 && prescriptions[0].items?.length > 0) {
      const activeRx = prescriptions[0];
      const medicineNames = activeRx.items.map((i: any) => i.medicine).slice(0, 2).join(', ');

      recommendations.push({
        id: 'adv-rx-adherence',
        category: 'PREVENTION',
        categoryLabel: 'Tratamiento Médico',
        title: 'Puntualidad en tu farmacoterapia',
        summary: `Tienes indicaciones activas para ${medicineNames}. Tomar tus dosis a los horarios fijados garantiza que el principio activo actúe correctamente en tu organismo.`,
        explanation: 'Omitir o espaciar dosis reduce la eficacia del tratamiento y puede generar oscilaciones en tus controles clínicos. Mantén siempre las pautas del médico.',
        isDailyFocus: false,
        priority: 'HIGH',
        actionType: 'VIEW_HABITS',
        actionLabel: 'Ver recetas activas',
        actionPayload: { redirect: '/paciente/recetas' },
        dataSources: [
          { label: 'Prescripción médica vigente', detail: `${activeRx.items.length} fármaco(s) prescrito(s) en tu expediente`, authorized: true },
        ],
        generatedByAI: false,
        createdAt: new Date().toISOString(),
      });
    }

    // =========================================================================
    // 6. CONSEJO: ALIMENTACIÓN CONSCIENTE Y NUTRICIÓN
    // =========================================================================
    recommendations.push({
      id: 'adv-nutrition-balance',
      category: 'NUTRITION',
      categoryLabel: 'Alimentación',
      title: 'Aporte de fibra y vegetales frescos',
      summary: 'Incluir hojas verdes y vegetales coloridos en el almuerzo y la cena mejora la digestión y previene aumentos bruscos de glucosa en sangre.',
      explanation: 'La fibra soluble retrasa la absorción de azúcares simples y contribuye a mantener una microbiota digestiva saludable y eficiente.',
      isDailyFocus: false,
      priority: 'LOW',
      actionType: 'VIEW_HABITS',
      actionLabel: 'Explorar estilo de vida',
      actionPayload: { redirect: '/paciente/monitoreo/habitos-estilo-vida' },
      dataSources: [
        { label: 'Pautas de nutrición MedicOS', detail: 'Educación alimentaria preventiva', authorized: true },
      ],
      generatedByAI: false,
      createdAt: new Date().toISOString(),
    });

    // =========================================================================
    // 7. CONSEJO: DIAGNÓSTICO O BIENESTAR COTIDIANO
    // =========================================================================
    if (diagnoses.length > 0) {
      const diagName = diagnoses[0].description || 'Condición clínica en seguimiento';
      recommendations.push({
        id: 'adv-diagnosis-followup',
        category: 'WELLNESS',
        categoryLabel: 'Seguimiento Clínico',
        title: 'Acompañamiento de tu diagnóstico',
        summary: `Tu expediente registra seguimiento por ${diagName}. Complementar tus consultas con registros de hábitos le brinda información valiosa a tu médico.`,
        explanation: 'El autocuidado coordinado con el equipo de salud permite evaluar la respuesta a los tratamientos y realizar ajustes preventivos a tiempo.',
        isDailyFocus: false,
        priority: 'MEDIUM',
        actionType: 'VIEW_HABITS',
        actionLabel: 'Ver mi expediente',
        actionPayload: { redirect: '/paciente/expediente' },
        dataSources: [
          { label: 'Diagnóstico formal', detail: `${diagName} registrado en tu historial`, authorized: true },
        ],
        generatedByAI: false,
        createdAt: new Date().toISOString(),
      });
    } else {
      recommendations.push({
        id: 'adv-wellness-breathing',
        category: 'WELLNESS',
        categoryLabel: 'Bienestar Mental',
        title: 'Pausas activas y respiración consciente',
        summary: 'Dedicar 5 minutos a respirar de forma pausada y profunda a media tarde ayuda a reducir la tensión muscular y despejar la mente.',
        explanation: 'La respiración diafragmática estimula el nervio vago y activa el sistema parasimpático, promoviendo la relajación física y mental.',
        isDailyFocus: false,
        priority: 'LOW',
        actionType: 'VIEW_HABITS',
        actionLabel: 'Registrar bienestar',
        actionPayload: { redirect: '/paciente/monitoreo/habitos-estilo-vida' },
        dataSources: [
          { label: 'Guía de autocuidado MedicOS', detail: 'Técnicas de regulación de estrés', authorized: true },
        ],
        generatedByAI: false,
        createdAt: new Date().toISOString(),
      });
    }

    // Selección de "Tu enfoque de hoy" con tipado seguro
    const dailyFocusCandidate =
      recommendations.find((r) => r.isDailyFocus) ??
      (recommendations.length > 0 ? recommendations[0] : null);

    const dailyFocusItem: PersonalizedAdviceDTO | null = dailyFocusCandidate ?? null;

    const otherRecommendations = dailyFocusItem
      ? recommendations.filter((r) => r.id !== dailyFocusItem.id)
      : recommendations;

    // Enriquecimiento con Gemini si hay un enfoque diario válido y clave activa
    const apiKey = this.getApiKey();
    if (apiKey && apiKey !== '' && dailyFocusItem) {
      try {
        const enrichedSummary = await this.enrichFocusWithGemini(apiKey, patientName, dailyFocusItem);
        if (enrichedSummary) {
          dailyFocusItem.summary = enrichedSummary;
          dailyFocusItem.generatedByAI = true;
        }
      } catch {
        // En caso de corte o falla se mantiene el resumen determinístico intacto
      }
    }

    return {
      patientName,
      hasEnoughData: true,
      dailyFocus: dailyFocusItem,
      recommendations: otherRecommendations,
      evaluatedCategories: ['ACTIVITY', 'WATER', 'SLEEP', 'NUTRITION', 'PREVENTION', 'WELLNESS'],
    };
  }

  private async enrichFocusWithGemini(
    apiKey: string,
    patientName: string,
    item: PersonalizedAdviceDTO
  ): Promise<string | null> {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent';

    const systemPrompt = `Eres el redactor pedagógico de autocuidado de MedicOS para el paciente ${patientName}.
Tu función es redactar una recomendación breve de autocuidado de MÁXIMO 25 palabras.
REGLAS OBLIGATORIAS:
1. La respuesta DEBE SER UNA SOLA FRASE COMPLETA que termine estrictamente con punto final (.).
2. NUNCA cortes la frase ni dejes ideas inconclusas.
3. No uses hashtags ni formato markdown.
Consejo base: ${item.title} - ${item.explanation}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: 'Redacta la frase completa terminada en punto' }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!res.ok) return null;
    const json = (await res.json()) as any;
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    // Verificación estricta: si no termina con signo de puntuación, se descarta para evitar textos cortados
    if (text && (text.endsWith('.') || text.endsWith('!') || text.endsWith('?')) && text.length > 20) {
      return text;
    }
    return null;
  }
}

export const personalizedAdviceService = new PersonalizedAdviceService();