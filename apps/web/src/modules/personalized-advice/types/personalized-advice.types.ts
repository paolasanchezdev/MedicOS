// =========================================================================
// ARCHIVO: apps/web/src/modules/personalized-advice/types/personalized-advice.types.ts
// DESCRIPCIÓN: Tipos TypeScript frontend para Consejos Personalizados.
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

export interface PersonalizedAdvice {
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
  actionPayload?: {
    habitType?: string;
    defaultType?: string;
    redirect?: string;
  };
  dataSources: AdviceDataSource[];
  generatedByAI: boolean;
  createdAt: string;
}

export interface PersonalizedAdviceResponse {
  patientName: string;
  hasEnoughData: boolean;
  dailyFocus: PersonalizedAdvice | null;
  recommendations: PersonalizedAdvice[];
  evaluatedCategories: AdviceCategory[];
}