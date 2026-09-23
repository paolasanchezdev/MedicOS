// =========================================================================
// ARCHIVO: apps/web/src/modules/lifestyle/hooks/useLifestyleData.ts
// DESCRIPCIÓN: Hook gestor de autoseguimiento, hábitos diarios y metas.
// =========================================================================

import { useState, useEffect, useCallback } from 'react';
import { lifestyleService } from '../services/lifestyle.service.js';
import type {
  LifestyleDashboardSummary,
  LifestyleHabitType,
  ActivityIntensity,
} from '../types/lifestyle.types.js';

export function useLifestyleData() {
  const [data, setData] = useState<LifestyleDashboardSummary>({
    activeGoal: null,
    weeklyStats: {
      activeDaysCount: 0,
      totalExerciseMinutes: 0,
      waterDaysLogged: 0,
      waterGlassesToday: 0,
      avgSleepHours: 0,
      sleepHoursToday: 0,
      habitsLoggedTodayCount: 0,
      totalWeeklyLogsCount: 0,
    },
    habits: [],
    recentActivities: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    let isSubscribed = true;

    const fetchSummary = async () => {
      try {
        const res = await lifestyleService.getSummary();
        if (isSubscribed) {
          setData(res);
          setError(null);
        }
      } catch (err) {
        if (isSubscribed) {
          setError((err as Error).message || 'No fue posible obtener tus hábitos.');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    void fetchSummary();

    return () => {
      isSubscribed = false;
    };
  }, [refreshTrigger]);

  const refetch = useCallback(() => {
    setLoading(true);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const logHabit = useCallback(
    async (habitType: LifestyleHabitType, value: number, unit: string, notes?: string) => {
      await lifestyleService.logHabit(habitType, value, unit, notes);
      setRefreshTrigger((prev) => prev + 1);
    },
    []
  );

  const recordActivity = useCallback(
    async (activityName: string, durationMinutes: number, intensity: ActivityIntensity, notes?: string) => {
      const res = await lifestyleService.recordActivity(activityName, durationMinutes, intensity, notes);
      setRefreshTrigger((prev) => prev + 1);
      return res;
    },
    []
  );

  const createGoal = useCallback(
    async (title: string, targetDays: number, habitType?: LifestyleHabitType) => {
      const res = await lifestyleService.createGoal(title, targetDays, habitType);
      setRefreshTrigger((prev) => prev + 1);
      return res;
    },
    []
  );

  return {
    ...data,
    loading,
    error,
    refetch,
    logHabit,
    recordActivity,
    createGoal,
  };
}