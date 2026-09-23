// =========================================================================
// ARCHIVO: apps/api/src/modules/ai-assistant/ai-assistant.service.ts
// DESCRIPCIÓN: Servicio de IA con recolección clínica completa del paciente:
//              diagnósticos, síntomas, hábitos de vida, recetas y signos.
// =========================================================================

import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';
import type {
  ClinicalContextItem,
  ChatMessageDTO,
  SendChatMessageDTO,
} from './ai-assistant.types.js';

export class AIAssistantService extends BaseService {
  private readonly fallbackModels = [
    'gemini-3.6-flash',
    'gemini-flash-latest',
  ];

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
        });
      }
    }
    return patient;
  }

  async getAvailableClinicalContexts(userId: string): Promise<ClinicalContextItem[]> {
    const patient = await this.resolvePatient(userId);
    if (!patient) return [];

    const db = prisma as any;
    const contexts: ClinicalContextItem[] = [];

    // 1. Diagnósticos registrados en expediente
    try {
      const diagnoses = await db.diagnosis.findMany({
        where: { patientId: patient.id, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
      diagnoses.forEach((d: any) => {
        const title = d.conditionName || d.name || d.description || 'Diagnóstico Clínico';
        const codeStr = d.code ? ` (CIE: ${d.code})` : '';
        const statusStr = d.status ? `Estado: ${d.status}.` : '';
        contexts.push({
          id: d.id,
          type: 'DIAGNOSIS',
          title: `${title}${codeStr}`,
          subtitle: `Diagnóstico • ${new Date(d.createdAt).toLocaleDateString('es-ES')}`,
          date: d.createdAt,
          categoryLabel: 'Diagnósticos',
          details: `Condición médica diagnosticada: ${title}. ${statusStr} Notas médicas: ${d.notes || 'Control en seguimiento'}.`,
        });
      });
    } catch {
      // Manejo defensivo ante variaciones de modelo
    }

    // 2. Medicamentos y Recetas Activas
    try {
      const rxs = await db.prescriptionItem.findMany({
        where: { prescription: { patientId: patient.id, deletedAt: null } },
        include: { prescription: true },
        orderBy: { startDate: 'desc' },
        take: 5,
      });
      rxs.forEach((rx: any) => {
        contexts.push({
          id: rx.id,
          type: 'MEDICATION',
          title: `${rx.medicine} ${rx.dosage}`,
          subtitle: `Frecuencia: ${rx.frequency}`,
          date: rx.startDate || rx.createdAt,
          categoryLabel: 'Medicamentos',
          details: `Fármaco prescrito: ${rx.medicine} ${rx.dosage}. Vía: ${rx.route || 'Oral'}. Frecuencia: ${rx.frequency}. Duración: ${rx.duration || 'Según evolución'}. Instrucciones de toma: ${rx.instructions || 'Tomar según prescripción médica'}.`,
        });
      });
    } catch {
      // Manejo defensivo
    }

    // 3. Signos Vitales Fisiológicos Recientes
    try {
      const vitals = await db.vitalSigns.findMany({
        where: { patientId: patient.id, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 3,
      });
      vitals.forEach((v: any) => {
        contexts.push({
          id: v.id,
          type: 'VITAL_SIGNS',
          title: `PA ${v.systolic}/${v.diastolic} mmHg • Pulso ${v.heartRate} lpm`,
          subtitle: `Control Vital • ${new Date(v.createdAt).toLocaleDateString('es-ES')}`,
          date: v.createdAt,
          categoryLabel: 'Signos Vitales',
          details: `Signos vitales registrados: Presión arterial: ${v.systolic}/${v.diastolic} mmHg. Pulso/Frecuencia cardíaca: ${v.heartRate} lpm. Temperatura: ${v.temperature || 36.5} °C. Saturación de Oxígeno (SpO2): ${v.oxygenSat || 98}%.`,
        });
      });
    } catch {
      // Manejo defensivo
    }

    // 4. Resultados de Laboratorio
    try {
      const labs = await db.laboratoryStudy.findMany({
        where: { patientId: patient.id, deletedAt: null },
        include: { analytes: true },
        orderBy: { performedAt: 'desc' },
        take: 4,
      });
      labs.forEach((l: any) => {
        const summary = l.analytes && l.analytes.length > 0
          ? l.analytes.map((a: any) => `${a.name}: ${a.value} ${a.unit}`).join(', ')
          : 'Resultados registrados';
        contexts.push({
          id: l.id,
          type: 'LAB_RESULT',
          title: l.name,
          subtitle: `Laboratorio • ${new Date(l.performedAt).toLocaleDateString('es-ES')}`,
          date: l.performedAt,
          categoryLabel: 'Laboratorio',
          details: `Estudio de laboratorio: ${l.name}. Parámetros y analitos: ${summary}. Establecimiento: ${l.establishmentName || 'Centro asistencial'}.`,
        });
      });
    } catch {
      // Manejo defensivo
    }

    // 5. Consultas y Síntomas Registrados
    try {
      const consultations = await db.consultation.findMany({
        where: { patientId: patient.id, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 4,
      });
      consultations.forEach((c: any) => {
        const reasonStr = c.reason || c.chiefComplaint || 'Consulta Médica';
        const symptomsStr = c.symptoms || c.subjectiveNotes || 'Síntomas habituales de valoración';
        contexts.push({
          id: c.id,
          type: 'CONSULTATION',
          title: `Motivo: ${reasonStr}`,
          subtitle: `Consulta Clínica • ${new Date(c.createdAt).toLocaleDateString('es-ES')}`,
          date: c.createdAt,
          categoryLabel: 'Consultas y Síntomas',
          details: `Motivo principal de consulta: ${reasonStr}. Síntomas y cuadro manifestado: ${symptomsStr}. Plan indicado por el médico: ${c.treatmentPlan || 'En seguimiento clínico'}.`,
        });
      });
    } catch {
      // Manejo defensivo
    }

    // 6. Hábitos de Salud y Estilo de Vida
    try {
      if (db.lifestyleHabit) {
        const habits = await db.lifestyleHabit.findMany({
          where: { patientId: patient.id, deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 4,
        });
        habits.forEach((h: any) => {
          contexts.push({
            id: h.id,
            type: 'LIFESTYLE',
            title: `${h.name || h.habitType}: ${h.targetValue || ''} ${h.unit || ''}`.trim(),
            subtitle: `Hábito de Vida • Meta ${h.frequency || 'diaria'}`,
            date: h.createdAt,
            categoryLabel: 'Estilo de Vida',
            details: `Hábito y autocuidado del paciente: ${h.name || h.habitType}. Meta establecida: ${h.targetValue || ''} ${h.unit || ''}. Frecuencia: ${h.frequency || 'Diaria'}.`,
          });
        });
      }
    } catch {
      // Manejo defensivo
    }

    return contexts;
  }

  async processUserMessage(userId: string, dto: SendChatMessageDTO): Promise<ChatMessageDTO> {
    const patient = await this.resolvePatient(userId);
    const patientName = patient ? patient.firstName : 'Paciente';
    const apiKey = this.getApiKey();

    let specificContextText = '';
    if (dto.contextItemId) {
      const contexts = await this.getAvailableClinicalContexts(userId);
      const found = contexts.find((c) => c.id === dto.contextItemId);
      if (found) {
        specificContextText = `CONTEXTO CLÍNICO AUTORIZADO POR EL PACIENTE:
Categoría: ${found.type}
Registro: ${found.title}
Detalles del expediente: ${found.details}
Fecha: ${new Date(found.date).toLocaleDateString('es-ES')}`;
      }
    }

    const systemPrompt = `Eres el Asistente Educativo de Salud de MedicOS para el paciente ${patientName}.
Tu objetivo es traducir términos clínicos a explicaciones pedagógicas, cálidas, empáticas y seguras.

REGLAS DE FORMATO Y ESTILO:
1. Responde de forma CONCISA: entre 120 y 180 palabras en total.
2. NUNCA cortes ideas ni dejes oraciones incompletas: concluye siempre cada frase con su respectivo punto o signo de cierre.
3. NUNCA uses símbolos numerales (#, ##, ###) ni líneas de guiones (---). Usa negrita (**texto**) para destacar términos clave.
4. Concluye siempre con 2 a 3 preguntas cortas para dialogar con el médico en la próxima consulta (usando viñetas "• ").

REGLAS CLÍNICAS INQUEBRANTABLES:
1. NUNCA diagnostiques ni asegures que un valor confirma una patología.
2. NUNCA recetes, ajustes dosis ni sugieras suspender fármacos prescritos.
3. Explica la función biológica de medicamentos, órganos, parámetros y metas de hábitos saludables de forma educativa.
4. Si el paciente pregunta por datos no autorizados en el contexto, invítalo cordialmente a seleccionarlos en la barra superior.
5. Ante síntomas de alarma (dolor torácico opresivo, disnea súbita o pérdida de consciencia), indica buscar atención médica de urgencia de inmediato.

${specificContextText}`;

    if (apiKey && apiKey !== '') {
      try {
        const generatedText = await this.callGeminiWithCascade(apiKey, systemPrompt, dto);
        return {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: generatedText,
          timestamp: new Date().toISOString(),
          contextType: dto.contextType || 'GENERAL',
          suggestedQuestions: [
            '¿Qué preguntas debo hacerle a mi médico sobre esto?',
            '¿Qué hábitos de autocuidado apoyan este resultado?',
            '¿Cada cuánto tiempo se suele revisar este parámetro?',
          ],
        };
      } catch (error) {
        console.error('❌ Error en llamada al motor de IA:', error);
      }
    }

    const fallbackResponse = this.generateEducationalFallback(dto.message, patientName);
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: fallbackResponse,
      timestamp: new Date().toISOString(),
      contextType: dto.contextType || 'GENERAL',
      suggestedQuestions: [
        '¿Qué preguntas puedo llevar anotadas para mi médico?',
        '¿Cómo puedo mejorar mis hábitos de hidratación y descanso?',
      ],
    };
  }

  private async callGeminiWithCascade(
    apiKey: string,
    systemPrompt: string,
    dto: SendChatMessageDTO
  ): Promise<string> {
    let lastError: Error | null = null;

    for (const model of this.fallbackModels) {
      try {
        const result = await this.executeGeminiRequest(model, apiKey, systemPrompt, dto);
        return result;
      } catch (err) {
        lastError = err as Error;
        const msg = (err as Error).message || '';
        if (msg.includes('503') || msg.includes('429') || msg.includes('404')) {
          console.warn(`⚠️ Modelo ${model} no disponible (${msg}). Probando siguiente alternativa...`);
          continue;
        }
        throw err;
      }
    }

    throw lastError || new Error('No fue posible obtener respuesta del motor de IA');
  }

  private async executeGeminiRequest(
    model: string,
    apiKey: string,
    systemPrompt: string,
    dto: SendChatMessageDTO
  ): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const contents: any[] = [];
    if (dto.conversationHistory && dto.conversationHistory.length > 0) {
      dto.conversationHistory.slice(-4).forEach((h) => {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }],
        });
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: dto.message }],
    });

    const body = {
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2500,
      },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`AI Engine ${model} HTTP ${res.status}: ${errText}`);
    }

    const json = (await res.json()) as any;
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error(`Respuesta vacía o bloqueada en modelo ${model}`);
    return text;
  }

  private generateEducationalFallback(question: string, patientName: string): string {
    const q = question.toLowerCase();

    if (q.includes('hemoglobina') || q.includes('anemia')) {
      return `Hola ${patientName}. La hemoglobina es la proteína encargada de transportar oxígeno en la sangre. 

Para interpretar tu resultado específico, tu médico valorará cómo te sientes en conjunto con tu nutrición.

Preguntas útiles para tu consulta médica:
• ¿Mi nivel de hemoglobina se encuentra dentro de lo esperado para mi rutina?
• ¿Es necesario ajustar mi plan nutricional?`;
    }

    if (q.includes('azucar') || q.includes('azúcar') || q.includes('glucosa')) {
      return `Hola ${patientName}. El azúcar o glucosa en sangre representa la principal fuente de energía para las células del cuerpo, regulada por la insulina producida en el páncreas.

Mantener niveles controlados favorece la salud metabólica, renal y visual.

Preguntas recomendadas para tu médico:
• ¿Cuáles son mis rangos óptimos de glucosa en ayunas?
• ¿Qué pautas de alimentación y actividad física son recomendables para mí?`;
    }

    if (q.includes('presion') || q.includes('presión') || q.includes('arterial') || q.includes('signos vitales')) {
      return `Hola ${patientName}. La presión arterial mide la tensión que ejerce la sangre sobre las arterias. Valores estables protegen tu sistema cardiovascular y renal.

Si deseas que analicemos tus cifras exactas registradas en MedicOS, selecciona el botón correspondiente en la parte superior para autorizar el dato.

Preguntas recomendadas para tu médico:
• ¿Mis lecturas recientes reflejan un adecuado control?
• ¿Qué pautas de descanso e hidratación me recomienda seguir?`;
    }

    return `Hola ${patientName}. Como tu asistente educativo de MedicOS, puedo orientarte sobre qué representan tus diagnósticos, medicamentos prescritos, signos vitales y hábitos de salud.

Recuerda que esta orientación es pedagógica y busca darte seguridad para conversar con tu equipo de salud. ¿Sobre qué aspecto de tu expediente te gustaría aprender hoy?`;
  }
}

export const aiAssistantService = new AIAssistantService();