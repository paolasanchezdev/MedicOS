// =========================================================================
// ARCHIVO: apps/web/src/modules/patients/hooks/usePatientSecurity.ts
// DESCRIPCIÓN: Custom hook que carga y actualiza datos reales de PostgreSQL
//              sin disparar re-renderizados sincrónicos en efectos.
// =========================================================================

import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  SecurityStatus,
  UserSession,
  SecurityEvent,
} from '../types/patient-security.types.js';
import { patientSecurityService } from '../services/patient-security.service.js';

export function usePatientSecurity() {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [events, setEvents] = useState<SecurityEvent[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modales
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [is2FaModalOpen, setIs2FaModalOpen] = useState(false);
  const [sessionToClose, setSessionToClose] = useState<UserSession | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSuccessBanner = (message: string) => {
    setActionSuccess(message);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setActionSuccess(null);
    }, 3500);
  };

  // Carga asíncrona de datos para reintentos o refrescos manuales
  const reloadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientSecurityService.getSecurityData();
      setSecurityStatus(data.status);
      setSessions(data.sessions);
      setEvents(data.events);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al consultar seguridad en el servidor.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial en el montaje: sin invocar setState sincrónicamente en el cuerpo del efecto
  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      try {
        const data = await patientSecurityService.getSecurityData();
        if (!isMounted) return;
        setSecurityStatus(data.status);
        setSessions(data.sessions);
        setEvents(data.events);
      } catch (err: unknown) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Error al consultar seguridad en el servidor.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchInitialData();

    return () => {
      isMounted = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleChangePassword = async (curr: string, next: string): Promise<boolean> => {
    try {
      setError(null);
      await patientSecurityService.changePassword(curr, next);
      setIsPasswordModalOpen(false);
      showSuccessBanner('Contraseña actualizada en la base de datos.');
      await reloadData();
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar la contraseña.');
      return false;
    }
  };

  const handleCloseSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setSessionToClose(null);
    showSuccessBanner('Sesión remota finalizada con éxito.');
  };

  return {
    securityStatus,
    sessions,
    events,
    loading,
    error,
    actionSuccess,
    isPasswordModalOpen,
    is2FaModalOpen,
    sessionToClose,
    setIsPasswordModalOpen,
    setIs2FaModalOpen,
    setSessionToClose,
    handleChangePassword,
    handleCloseSession,
    reloadData,
  };
}