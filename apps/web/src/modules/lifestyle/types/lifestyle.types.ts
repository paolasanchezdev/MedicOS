// =========================================================================
// ARCHIVO: apps/web/src/modules/lifestyle/types/lifestyle.types.ts
// DESCRIPCIÓN: Tipos TypeScript frontend para hábitos, metas y actividades.
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

export interface LifestyleHabitSummary {
  habitType: LifestyleHabitType;
  daysLoggedThisWeek: number;
  targetDaysWeekly: number;
  daysLogged: boolean[];
  todayValue: number;
  lastUnit?: string | null;
  isLoggedToday: boolean;
}

export interface LifestyleActivity {
  id: string;
  activityName: string;
  durationMinutes: number;
  intensity: ActivityIntensity;
  performedAt: string;
  notes?: string | null;
}

export interface LifestyleGoal {
  id: string;
  title: string;
  habitType: LifestyleHabitType;
  targetDays: number;
  currentDays: number;
  progressPercentage: number;
  status: GoalStatus;
  startDate: string;
  endDate: string;
}

export interface LifestyleDashboardSummary {
  activeGoal: LifestyleGoal | null;
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
  habits: LifestyleHabitSummary[];
  recentActivities: LifestyleActivity[];
}