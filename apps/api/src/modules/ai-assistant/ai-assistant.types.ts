// =========================================================================
// ARCHIVO: apps/api/src/modules/ai-assistant/ai-assistant.types.ts
// DESCRIPCIÓN: Tipos y contratos clínicos ampliados para el Asistente IA.
// =========================================================================

export type ClinicalContextType =
  | 'GENERAL'
  | 'DIAGNOSIS'
  | 'MEDICATION'
  | 'VITAL_SIGNS'
  | 'LAB_RESULT'
  | 'CONSULTATION'
  | 'LIFESTYLE'
  | 'IMAGING_STUDY';

export interface ClinicalContextItem {
  id: string;
  type: ClinicalContextType;
  title: string;
  subtitle: string;
  date: string | Date;
  details: string;
  categoryLabel?: string;
}

export interface ChatMessageDTO {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string | Date;
  suggestedQuestions?: string[];
  contextType?: ClinicalContextType;
}

export interface SendChatMessageDTO {
  message: string;
  contextType?: ClinicalContextType | undefined;
  contextItemId?: string | undefined;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }> | undefined;
}