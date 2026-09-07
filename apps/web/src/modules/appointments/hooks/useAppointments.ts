// =========================================================================
// ARCHIVO: apps/web/src/modules/appointments/hooks/useAppointments.ts
// DESCRIPCIÓN: Hooks personalizados optimizados, incluyendo soporte para pacientes y reprogramación.
// =========================================================================

import { useState, useEffect, useCallback } from 'react';
import { appointmentsService } from '../services/appointments.service.js';
import type { 
  Appointment, 
  AvailableSlot, 
  CreateAppointmentPayload, 
  DoctorSummary, 
  RescheduleAppointmentPayload 
} from '../types/appointment.types.js';

export function useAvailableDoctors() {
  const [doctors, setDoctors] = useState<DoctorSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await appointmentsService.getAvailableDoctors();
      setDoctors(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar médicos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    appointmentsService.getAvailableDoctors()
      .then((data) => {
        if (isMounted) {
          setDoctors(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error al cargar médicos');
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { doctors, loading, error, refetch: fetchDoctors };
}

export function useAvailableSlots(doctorId?: string, date?: string) {
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = useCallback(async () => {
    if (!doctorId || !date) {
      setSlots([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await appointmentsService.getAvailableSlots(doctorId, date);
      setSlots(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar horarios disponibles');
    } finally {
      setLoading(false);
    }
  }, [doctorId, date]);

  useEffect(() => {
    if (!doctorId || !date) {
      return;
    }
    let isMounted = true;
    
    queueMicrotask(() => {
      if (isMounted) setLoading(true);
    });

    appointmentsService.getAvailableSlots(doctorId, date)
      .then((data) => {
        if (isMounted) {
          setSlots(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error al cargar horarios disponibles');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [doctorId, date]);

  const effectiveSlots = !doctorId || !date ? [] : slots;

  return { slots: effectiveSlots, loading, error, refetch: fetchSlots };
}

export function useMyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await appointmentsService.getMyAppointments();
      setAppointments(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar tus citas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    appointmentsService.getMyAppointments()
      .then((data) => {
        if (isMounted) {
          setAppointments(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error al cargar tus citas');
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { appointments, loading, error, refetch: fetchAppointments };
}

// Alias requerido por MisCitasPage
export { useMyAppointments as usePatientAppointments };

export function useCreateAppointment() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createAppointment = async (payload: CreateAppointmentPayload): Promise<Appointment> => {
    try {
      setLoading(true);
      setError(null);
      const newAppointment = await appointmentsService.createAppointment(payload);
      return newAppointment;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al crear la cita';
      setError(msg);
      throw new Error(msg, { cause: err });
    } finally {
      setLoading(false);
    }
  };

  return { createAppointment, loading, error };
}

export function useCancelAppointment() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cancelAppointment = async (id: string): Promise<Appointment> => {
    try {
      setLoading(true);
      setError(null);
      const updated = await appointmentsService.cancelAppointment(id);
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cancelar la cita';
      setError(msg);
      throw new Error(msg, { cause: err });
    } finally {
      setLoading(false);
    }
  };

  return { cancelAppointment, loading, error };
}

export function useRescheduleAppointment() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const rescheduleAppointment = async (id: string, payload: RescheduleAppointmentPayload): Promise<Appointment> => {
    try {
      setLoading(true);
      setError(null);
      const updated = await appointmentsService.rescheduleAppointment(id, payload);
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al reprogramar la cita';
      setError(msg);
      throw new Error(msg, { cause: err });
    } finally {
      setLoading(false);
    }
  };

  return { rescheduleAppointment, loading, error };
}