// =========================================================================
// ARCHIVO: apps/api/src/modules/ai-assistant/ai-assistant.service.ts
// DESCRIPCIÓN: Servicio de IA híbrido para MedicOS:
//              - Soporte nativo para Google Gemini (gemini-3.8-flash y gemini-3.1-pro-preview)
//              - Soporte nativo para Groq (llama-3.3-70b-versatile)
//              Detección automática de proveedor según formato de credencial.
// =========================================================================

import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';
import type {
  ClinicalContextItem,
  ChatMessageDTO,
  SendChatMessageDTO,
} from './ai-assistant.types.js';

export class AIAssistantService extends BaseService {
  // Modelos oficiales vigentes en la API de Google
  private readonly geminiModels = [
    'gemini-3.8-flash',
    'gemini-3.1-pro-preview',
    'gemini-2.5-flash',
  ];

  // Modelos oficiales vigentes en Groq
  private readonly groqModels = [
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
  ];

  private getApiKey(): string | undefined {
    const rawKey =
      process.env.GEMINI_API_KEY ||
      process.env.GROQ_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.VITE_GEMINI_API_KEY;

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
      // Manejo defensivo
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
          details: `Signos vitales registrados: Presión arterial: ${v.systolic}/${v.diastolic} mmHg. Pulso: ${v.heartRate} lpm. Temperatura: ${v.temperature || 36.5} °C. Saturación de Oxígeno (SpO2): ${v.oxygenSat || 98}%.`,
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
Tu objetivo es traducir términos clínicos a explicaciones pedagógicas, cálidas, empáticas y seguras en español.

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
        const isGroqKey = apiKey.startsWith('gsk_');
        const generatedText = isGroqKey
          ? await this.callGroqWithCascade(apiKey, systemPrompt, dto)
          : await this.callGeminiWithCascade(apiKey, systemPrompt, dto);

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
    } else {
      console.warn('⚠️ Credencial de IA no encontrada en variables de entorno.');
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

  // =========================================================================
  // MOTOR GOOGLE GEMINI (Modelos: gemini-3.8-flash, gemini-3.1-pro-preview)
  // =========================================================================

  private async callGeminiWithCascade(
    apiKey: string,
    systemPrompt: string,
    dto: SendChatMessageDTO
  ): Promise<string> {
    let lastError: Error | null = null;

    for (const model of this.geminiModels) {
      try {
        const result = await this.executeGeminiRequest(model, apiKey, systemPrompt, dto);
        return result;
      } catch (err) {
        lastError = err as Error;
        const msg = (err as Error).message || '';
        console.warn(`⚠️ Modelo Gemini ${model} no completó la consulta (${msg}). Evaluando siguiente alternativa...`);
      }
    }

    throw lastError || new Error('No fue posible obtener respuesta del motor de Gemini tras evaluar los modelos configurados.');
  }

  private async executeGeminiRequest(
    model: string,
    apiKey: string,
    systemPrompt: string,
    dto: SendChatMessageDTO
  ): Promise<string> {
    const cleanKey = apiKey.trim().replace(/^["']|["']$/g, '').trim();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(cleanKey)}`;

    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (dto.conversationHistory && dto.conversationHistory.length > 0) {
      const historyItems = dto.conversationHistory.slice(-6);
      let startedWithUser = false;

      for (const h of historyItems) {
        const role: 'user' | 'model' = h.role === 'user' ? 'user' : 'model';

        if (!startedWithUser) {
          if (role === 'user') {
            startedWithUser = true;
            contents.push({ role, parts: [{ text: h.content }] });
          }
        } else {
          const lastEntry = contents[contents.length - 1];
          const firstPart = lastEntry?.parts[0];

          if (lastEntry && lastEntry.role === role && firstPart) {
            firstPart.text += `\n\n${h.content}`;
          } else {
            contents.push({ role, parts: [{ text: h.content }] });
          }
        }
      }
    }

    const lastEntry = contents[contents.length - 1];
    const firstPart = lastEntry?.parts[0];

    if (lastEntry && lastEntry.role === 'user' && firstPart) {
      firstPart.text += `\n\n${dto.message}`;
    } else {
      contents.push({
        role: 'user',
        parts: [{ text: dto.message }],
      });
    }

    if (contents.length === 0) {
      contents.push({
        role: 'user',
        parts: [{ text: dto.message }],
      });
    }

    const body: Record<string, unknown> = {
      system_instruction: {
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
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();

      // Compatibilidad si el endpoint requiere inyección directa de system instruction en el primer mensaje
      if (res.status === 400 && (errText.includes('system_instruction') || errText.includes('systemInstruction'))) {
        const fallbackContents = JSON.parse(JSON.stringify(contents)) as typeof contents;
        if (fallbackContents[0]?.parts[0]) {
          fallbackContents[0].parts[0].text = `[INSTRUCCIÓN DEL SISTEMA]:\n${systemPrompt}\n\n[CONSULTA DEL PACIENTE]:\n${fallbackContents[0].parts[0].text}`;
        }
        const retryRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: fallbackContents,
            generationConfig: { temperature: 0.3, maxOutputTokens: 2500 },
          }),
        });
        if (retryRes.ok) {
          const retryJson = (await retryRes.json()) as any;
          const retryText = retryJson.candidates?.[0]?.content?.parts?.[0]?.text;
          if (retryText) return retryText;
        }
      }

      throw new Error(`Gemini (${model}) HTTP ${res.status}: ${errText}`);
    }

    const json = (await res.json()) as any;
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error(`Respuesta vacía recibida desde Gemini con modelo ${model}.`);
    }

    return text;
  }

  // =========================================================================
  // MOTOR GROQ (Modelos: llama-3.3-70b-versatile, llama-3.1-8b-instant)
  // =========================================================================

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
        console.warn(`⚠️ Modelo Groq ${model} no completó la consulta (${msg}). Evaluando siguiente alternativa...`);
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