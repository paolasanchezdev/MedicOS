// =========================================================================
// ARCHIVO: apps/api/src/modules/personalized-advice/personalized-advice.types.ts
// DESCRIPCIÓN: Tipos y contratos para el motor de consejos personalizados.
// =========================================================================

export type AdviceCategory =
  | 'WATER'
  | 'ACTIVITY'
  | 'SLEEP'
  | 'NUTRITION'
  | 'WELLNESS'
  | 'PREVENTION';

export type AdviceActionType =
  | 'LOG_HABIT'
  | 'SET_GOAL'
  | 'VIEW_VITALS'
  | 'VIEW_HABITS'
  | 'NONE';

export interface AdviceDataSource {
  label: string;
  detail: string;
  authorized: boolean;
}

export interface PersonalizedAdviceDTO {
  id: string;
  category: AdviceCategory;
  categoryLabel: string;
  title: string;
  summary: string;
  explanation: string;
  isDailyFocus: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  actionType: AdviceActionType;
  actionLabel?: string;
  actionPayload?: Record<string, any>;
  dataSources: AdviceDataSource[];
  generatedByAI: boolean;
  createdAt: string;
}

export interface PersonalizedAdviceResponse {
  patientName: string;
  hasEnoughData: boolean;
  dailyFocus: PersonalizedAdviceDTO | null;
  recommendations: PersonalizedAdviceDTO[];
  evaluatedCategories: AdviceCategory[];
}

export interface AdviceActionDTO {
  adviceId: string;
  action: 'DISMISS' | 'APPLY' | 'VIEW_DETAILS';
}