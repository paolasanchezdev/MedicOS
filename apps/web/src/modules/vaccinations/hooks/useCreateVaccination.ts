// =========================================================================
// ARCHIVO: apps/web/src/modules/vaccinations/hooks/useCreateVaccination.ts
// DESCRIPCIÓN: Hook gestor para la creación de registros de vacunación con soporte offline-first.
// =========================================================================

import { useState, useCallback } from 'react';
import { vaccinationsService } from '../services/vaccinations.service';
import type {
  CreateVaccinationPayloadDTO,
  VaccinationRecord,
  VaccinationSyncStatus,
  NuevaVacunacionFormState,
} from '../types/vaccination.types';

export function useCreateVaccination() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successResponse, setSuccessResponse] = useState<VaccinationRecord | null>(null);
  const [syncStatus, setSyncStatus] = useState<VaccinationSyncStatus>('SYNCED');

  const createVaccination = useCallback(async (
    formData: NuevaVacunacionFormState,
    context?: { brigadeId?: string | null; doctorId?: string }
  ): Promise<VaccinationRecord | null> => {
    if (!formData.patient) {
      const msg = 'Se requiere seleccionar a una persona para registrar la vacuna.';
      setError(msg);
      throw new Error(msg);
    }

    if (!formData.selectedVaccine) {
      const msg = 'Se requiere seleccionar un biológico del catálogo oficial.';
      setError(msg);
      throw new Error(msg);
    }

    if (!formData.lotNumber.trim()) {
      const msg = 'El número de lote del biológico es obligatorio.';
      setError(msg);
      throw new Error(msg);
    }

    setIsLoading(true);
    setError(null);

    const administeredDateTime = formData.administeredDate
      ? `${formData.administeredDate}T${formData.administeredTime || '08:00'}:00.000Z`
      : new Date().toISOString();

    const payload: CreateVaccinationPayloadDTO = {
      patientId: formData.patient.id,
      vaccineCode: formData.selectedVaccine.code,
      vaccineName: formData.selectedVaccine.name,
      doseNumber: formData.doseNumber || formData.selectedVaccine.doseNumber || 1,
      totalDoses: formData.selectedVaccine.totalDoses || 1,
      lotNumber: formData.lotNumber.trim().toUpperCase(),
      expirationDate: formData.expirationDate,
      administrationRoute: formData.administrationRoute || formData.selectedVaccine.route,
      anatomicalSite: formData.anatomicalSite || formData.selectedVaccine.anatomicalSiteDefault,
      administeredAt: administeredDateTime,
      notes: formData.observations.trim() || null,
      adverseReactions: formData.adverseReactions.trim() || null,
      brigadeId: context?.brigadeId || null,
      doctorId: context?.doctorId || null,
      originDeviceId: 'WEB_PORTAL',
    };

    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

    if (!isOnline) {
      const fullName = `${formData.patient.firstName} ${formData.patient.lastName}`.trim();
      vaccinationsService.saveToOfflineQueue(payload, fullName, formData.patient.dui);
      setSyncStatus('PENDING_SYNC');
      setIsLoading(false);
      return null;
    }

    try {
      const record = await vaccinationsService.createVaccination(payload);
      setSuccessResponse(record);
      setSyncStatus('SYNCED');
      return record;
    } catch (err) {
      const errorMsg = (err as Error).message || 'Error al conectar con el servidor central.';
      const fullName = `${formData.patient.firstName} ${formData.patient.lastName}`.trim();
      vaccinationsService.saveToOfflineQueue(payload, fullName, formData.patient.dui);
      setSyncStatus('PENDING_SYNC');
      setError(`Guardado localmente. Se sincronizará al recuperar conexión. (${errorMsg})`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setSuccessResponse(null);
    setSyncStatus('SYNCED');
  }, []);

  return {
    createVaccination,
    isLoading,
    error,
    successResponse,
    syncStatus,
    reset,
  };
}