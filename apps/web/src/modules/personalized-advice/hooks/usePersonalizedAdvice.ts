// =========================================================================
// ARCHIVO: apps/web/src/modules/personalized-advice/hooks/usePersonalizedAdvice.ts
// DESCRIPCIÓN: Hook reactivo para cargar, filtrar y gestionar consejos sin
//              cascadas de renders ni advertencias de ESLint.
// =========================================================================

import { useState, useEffect, useCallback } from 'react';
import { personalizedAdviceService } from '../services/personalized-advice.service.js';
import type {
  PersonalizedAdvice,
  AdviceCategory,
} from '../types/personalized-advice.types.js';

export function usePersonalizedAdvice() {
  const [patientName, setPatientName] = useState<string>('Paciente');
  const [hasEnoughData, setHasEnoughData] = useState<boolean>(true);
  const [dailyFocus, setDailyFocus] = useState<PersonalizedAdvice | null>(null);
  const [recommendations, setRecommendations] = useState<PersonalizedAdvice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'ALL' | AdviceCategory>('ALL');

  const executeFetch = useCallback(async () => {
    try {
      const data = await personalizedAdviceService.fetchAdvice();
      setPatientName(data.patientName || 'Paciente');
      setHasEnoughData(data.hasEnoughData);
      setDailyFocus(data.dailyFocus);
      setRecommendations(data.recommendations || []);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'No fue posible cargar tus recomendaciones';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      try {
        const data = await personalizedAdviceService.fetchAdvice();
        if (!isMounted) return;
        setPatientName(data.patientName || 'Paciente');
        setHasEnoughData(data.hasEnoughData);
        setDailyFocus(data.dailyFocus);
        setRecommendations(data.recommendations || []);
        setError(null);
      } catch (err: unknown) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : 'No fue posible cargar tus recomendaciones';
        setError(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const reload = useCallback(async () => {
    setIsLoading(true);
    await executeFetch();
  }, [executeFetch]);

  const dismissAdvice = (adviceId: string) => {
    setRecommendations((prev) => prev.filter((item) => item.id !== adviceId));
    if (dailyFocus?.id === adviceId) {
      setDailyFocus(null);
    }
    void personalizedAdviceService.sendAdviceFeedback(adviceId, 'DISMISS');
  };

  const filteredRecommendations =
    activeCategory === 'ALL'
      ? recommendations
      : recommendations.filter((r) => r.category === activeCategory);

  return {
    patientName,
    hasEnoughData,
    dailyFocus,
    recommendations: filteredRecommendations,
    totalCount: recommendations.length + (dailyFocus ? 1 : 0),
    isLoading,
    error,
    activeCategory,
    setActiveCategory,
    reload,
    dismissAdvice,
  };
}