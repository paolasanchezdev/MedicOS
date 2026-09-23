// =========================================================================
// ARCHIVO: apps/web/src/modules/ai-assistant/types/ai-assistant.types.ts
// DESCRIPCIÓN: Tipos frontend actualizados con todas las dimensiones clínicas.
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
  date: string;
  details: string;
  categoryLabel?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedQuestions?: string[];
  contextType?: ClinicalContextType;
}