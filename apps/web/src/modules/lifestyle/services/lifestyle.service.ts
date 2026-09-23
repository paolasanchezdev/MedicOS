// =========================================================================
// ARCHIVO: apps/web/src/modules/lifestyle/services/lifestyle.service.ts
// DESCRIPCIÓN: Cliente HTTP para el autoseguimiento de hábitos y metas.
// =========================================================================

import { apiClient } from '../../../shared/lib/apiClient.js';
import type {
  LifestyleDashboardSummary,
  LifestyleActivity,
  LifestyleGoal,
  LifestyleHabitType,
  ActivityIntensity,
} from '../types/lifestyle.types.js';

class LifestyleService {
  private readonly baseUrl = '/lifestyle';

  async getSummary(): Promise<LifestyleDashboardSummary> {
    const response = await apiClient<{ success: boolean; data: LifestyleDashboardSummary }>(
      `${this.baseUrl}/summary`
    );
    return (
      response.data || {
        activeGoal: null,
        weeklyStats: {
          activeDaysCount: 0,
          totalExerciseMinutes: 0,
          waterDaysLogged: 0,
          avgSleepHours: 0,
          mindfulnessDays: 0,
          nutritionDaysLogged: 0,
        },
        habits: [],
        recentActivities: [],
      }
    );
  }

  async logHabit(habitType: LifestyleHabitType, value: number, unit: string, notes?: string): Promise<void> {
    await apiClient(`${this.baseUrl}/habits/log`, {
      method: 'POST',
      body: JSON.stringify({ habitType, value, unit, notes }),
    });
  }

  async recordActivity(
    activityName: string,
    durationMinutes: number,
    intensity: ActivityIntensity = 'MODERATE',
    notes?: string
  ): Promise<LifestyleActivity> {
    const response = await apiClient<{ success: boolean; data: LifestyleActivity }>(
      `${this.baseUrl}/activities`,
      {
        method: 'POST',
        body: JSON.stringify({ activityName, durationMinutes, intensity, notes }),
      }
    );
    return response.data;
  }

  async createGoal(title: string, targetDays: number, habitType: LifestyleHabitType = 'ACTIVITY'): Promise<LifestyleGoal> {
    const response = await apiClient<{ success: boolean; data: LifestyleGoal }>(
      `${this.baseUrl}/goals`,
      {
        method: 'POST',
        body: JSON.stringify({ title, targetDays, habitType }),
      }
    );
    return response.data;
  }
}

export const lifestyleService = new LifestyleService();