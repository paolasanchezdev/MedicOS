// =========================================================================
// ARCHIVO: apps/web/src/core/auth/hooks/useIdleTimeout.ts
// DESCRIPCIÓN: Detecta si el usuario lleva un tiempo sin interactuar con la app.
// =========================================================================

import { useEffect, useRef } from 'react';

interface UseIdleTimeoutOptions {
  timeoutMs: number;
  onIdle: () => void;
  enabled: boolean;
}

export const useIdleTimeout = ({ timeoutMs, onIdle, enabled }: UseIdleTimeoutOptions) => {
  // Usamos ReturnType<typeof setTimeout> para que funcione perfectamente en el navegador
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        onIdle();
      }, timeoutMs);
    };

    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [timeoutMs, onIdle, enabled]);
};