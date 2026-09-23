// =========================================================================
// ARCHIVO: apps/api/src/modules/lifestyle/lifestyle.types.ts
// DESCRIPCIÓN: Tipos y DTOs oficiales para hábitos, metas y actividades.
// =========================================================================

export type LifestyleHabitType =
  | 'WATER'
  | 'ACTIVITY'
  | 'SLEEP'
  | 'NUTRITION'
  | 'TOBACCO'
  | 'ALCOHOL'
  | 'MINDFULNESS';

export type ActivityIntensity = 'LIGHT' | 'MODERATE' | 'INTENSE';
export type GoalStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

export interface LogHabitDTO {
  habitType: LifestyleHabitType;
  value: number;
  unit: string;
  loggedDate?: string | undefined;
  notes?: string | undefined;
}

export interface RecordActivityDTO {
  activityName: string;
  durationMinutes: number;
  intensity?: ActivityIntensity | undefined;
  performedAt?: string | undefined;
  notes?: string | undefined;
}

export interface CreateGoalDTO {
  title: string;
  habitType?: LifestyleHabitType | undefined;
  targetDays: number;
  startDate?: string | undefined;
  endDate?: string | undefined;
}

export interface LifestyleHabitSummaryDTO {
  habitType: LifestyleHabitType;
  daysLoggedThisWeek: number;
  targetDaysWeekly: number;
  daysLogged: boolean[]; // 7 posiciones reales: [Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo]
  todayValue: number;
  lastUnit?: string | null | undefined;
  isLoggedToday: boolean;
}

export interface LifestyleActivityDTO {
  id: string;
  activityName: string;
  durationMinutes: number;
  intensity: ActivityIntensity;
  performedAt: string | Date;
  notes?: string | null | undefined;
}

export interface LifestyleGoalDTO {
  id: string;
  title: string;
  habitType: LifestyleHabitType;
  targetDays: number;
  currentDays: number;
  progressPercentage: number;
  status: GoalStatus;
  startDate: string | Date;
  endDate: string | Date;
}

export interface LifestyleDashboardSummaryDTO {
  activeGoal: LifestyleGoalDTO | null;
  weeklyStats: {
    activeDaysCount: number;
    totalExerciseMinutes: number;
    waterDaysLogged: number;
    waterGlassesToday: number;
    avgSleepHours: number;
    sleepHoursToday: number;
    habitsLoggedTodayCount: number;
    totalWeeklyLogsCount: number;
  };
  habits: LifestyleHabitSummaryDTO[];
  recentActivities: LifestyleActivityDTO[];
}