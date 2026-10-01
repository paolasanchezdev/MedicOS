// =========================================================================
// ARCHIVO: apps/api/src/modules/ai-assistant/ai-assistant.service.ts
// DESCRIPCIÓN: Servicio de IA conectado a Groq con modelos actualizados
//              (Llama 3.1 8B Instant y Llama 3.3 70B Versatile), garantizando
//              respuestas dinámicas, gratuitas y sin errores de deprecación.
// =========================================================================

import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';
import type {
  ClinicalContextItem,
  ChatMessageDTO,
  SendChatMessageDTO,
} from './ai-assistant.types.js';

export class AIAssistantService extends BaseService {
  // Modelos activos y soportados en la API de Groq
  private readonly groqModels = [
    'llama-3.1-8b-instant',
    'llama-3.3-70b-versatile',
    'gemma2-9b-it',
  ];

  private getApiKey(): string | undefined {
    const rawKey =
      process.env.GROQ_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY;

    if (!rawKey) return undefined;
    return rawKey.trim().replace(/^["']|["']$/g, '').trim();
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

    try {
      const diagnoses = await db.diagnosis.findMany({
        where: { patientId: patient.id, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
      diagnoses.forEach((d: any) => {
        const title = d.conditionName || d.name || d.description || 'Diagnóstico Clínico';
        contexts.push({
          id: d.id,
          type: 'DIAGNOSIS',
          title: title,
          subtitle: `Diagnóstico • ${new Date(d.createdAt).toLocaleDateString('es-ES')}`,
          date: d.createdAt,
          categoryLabel: 'Diagnósticos',
          details: `Condición médica: ${title}. Notas: ${d.notes || 'Control en seguimiento'}.`,
        });
      });
    } catch {
      // Manejo defensivo
    }

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
          details: `Fármaco: ${rx.medicine} ${rx.dosage}. Frecuencia: ${rx.frequency}. Instrucciones: ${rx.instructions || 'Tomar según prescripción'}.`,
        });
      });
    } catch {
      // Manejo defensivo
    }

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
          details: `Presión arterial: ${v.systolic}/${v.diastolic} mmHg. Pulso: ${v.heartRate} lpm. Temperatura: ${v.temperature || 36.5} °C.`,
        });
      });
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
        specificContextText = `CONTEXTO CLÍNICO AUTORIZADO:\nCategoría: ${found.type}\nRegistro: ${found.title}\nDetalles: ${found.details}`;
      }
    }

    const systemPrompt = `Eres el Asistente Educativo de Salud de MedicOS para el paciente ${patientName}.
Traduces términos clínicos a explicaciones pedagógicas, cálidas, empáticas y seguras en español.

REGLAS DE FORMATO:
1. Responde de forma CONCISA: entre 120 y 180 palabras en total.
2. NUNCA dejes oraciones incompletas; finaliza cada frase con su respectivo punto.
3. Usa negrita (**texto**) para destacar términos clave. NUNCA uses numerales (#).
4. Concluye con 2 a 3 preguntas cortas para dialogar con el médico en la próxima consulta (con viñetas "• ").

REGLAS CLÍNICAS INQUEBRANTABLES:
1. NUNCA diagnostiques ni recetes medicamentos.
2. Explica la función biológica de órganos, parámetros y hábitos de forma educativa.
3. Ante síntomas de alarma (dolor torácico opresivo, disnea súbita o pérdida de consciencia), indica buscar urgencias de inmediato.

${specificContextText}`;

    if (apiKey && apiKey !== '') {
      try {
        const generatedText = await this.callGroqWithCascade(apiKey, systemPrompt, dto);
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
        console.error('❌ Error en llamada al motor de Groq:', error);
      }
    } else {
      console.warn('⚠️ GROQ_API_KEY no encontrada en variables de entorno.');
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

  private async callGroqWithCascade(
    apiKey: string,
    systemPrompt: string,
    dto: SendChatMessageDTO
  ): Promise<string> {
    let lastError: Error | null = null;

    for (const model of this.groqModels) {
      try {
        const result = await this.executeGroqRequest(model, apiKey, systemPrompt, dto);
        return result;
      } catch (err) {
        lastError = err as Error;
        const msg = (err as Error).message || '';
        console.warn(`⚠️ Modelo ${model} no completó la consulta (${msg}). Evaluando siguiente alternativa...`);
      }
    }

    throw lastError || new Error('No fue posible obtener respuesta del motor de Groq tras evaluar los modelos configurados.');
  }

  private async executeGroqRequest(
    model: string,
    apiKey: string,
    systemPrompt: string,
    dto: SendChatMessageDTO
  ): Promise<string> {
    const url = 'https://api.groq.com/openai/v1/chat/completions';

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
    ];

    if (dto.conversationHistory && dto.conversationHistory.length > 0) {
      const historyItems = dto.conversationHistory.slice(-6);
      for (const h of historyItems) {
        messages.push({
          role: h.role === 'user' ? 'user' : 'assistant',
          content: h.content,
        });
      }
    }

    messages.push({ role: 'user', content: dto.message });

    const body = {
      model,
      messages,
      temperature: 0.3,
      max_tokens: 1500,
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Groq API (${model}) HTTP ${res.status}: ${errText}`);
    }

    const json = (await res.json()) as any;
    const text = json.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error(`Respuesta vacía recibida desde Groq API con modelo ${model}.`);
    }

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
      return `Hola ${patientName}. El azúcar o glucosa en sangre representa la principal fuente de energía para las células del cuerpo.

Mantener niveles controlados favorece la salud metabólica, renal y visual.

Preguntas recomendadas para tu médico:
• ¿Cuáles son mis rangos óptimos de glucosa en ayunas?
• ¿Qué pautas de alimentación y actividad física son recomendables para mí?`;
    }

    return `Hola ${patientName}. Como tu asistente educativo de MedicOS, puedo orientarte sobre qué representan tus diagnósticos, medicamentos prescritos, signos vitales y hábitos de salud.

Recuerda que esta orientación es pedagógica y busca darte seguridad para conversar con tu equipo de salud. ¿Sobre qué aspecto de tu expediente te gustaría aprender hoy?`;
  }
}

export const aiAssistantService = new AIAssistantService();