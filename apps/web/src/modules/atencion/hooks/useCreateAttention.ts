// =========================================================================
// ARCHIVO: apps/web/src/modules/atencion/hooks/useCreateAttention.ts
// DESCRIPCIÓN: Hook gestor de mutación, mapeo a campos SOAP y manejo offline de atención.
// =========================================================================

import { useState, useCallback } from 'react';
import { atencionService } from '../services/atencion.service';
import type {
  NuevaAtencionFormState,
  AttentionCreatedResponse,
  VitalsPayloadDTO,
  CreateAttentionPayloadDTO,
} from '../types/atencion.types';

export type SyncStatusResult = 'SYNCED' | 'PENDING_SYNC' | 'ERROR';

export function useCreateAttention() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successResponse, setSuccessResponse] = useState<AttentionCreatedResponse | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatusResult>('SYNCED');

  const createAttention = useCallback(async (
    formData: NuevaAtencionFormState,
    context?: { brigadeId?: string | null; workSessionId?: string | null; doctorId?: string }
  ): Promise<AttentionCreatedResponse | null> => {
    if (!formData.patient) {
      const msg = 'Se requiere seleccionar a una persona para registrar la atención.';
      setError(msg);
      throw new Error(msg);
    }

    setIsLoading(true);
    setError(null);

    // 1. Recopilar lista de síntomas
    const sintomasList: string[] = [];
    const { sintomas } = formData.evaluacion;
    if (sintomas.fiebre) sintomasList.push('Fiebre');
    if (sintomas.tos) sintomasList.push('Tos');
    if (sintomas.dolorCabeza) sintomasList.push('Dolor de cabeza');
    if (sintomas.dificultadRespiratoria) sintomasList.push('Dificultad respiratoria');
    if (sintomas.diarrea) sintomasList.push('Diarrea');
    if (sintomas.vomitos) sintomasList.push('Vómitos');
    if (sintomas.mareos) sintomasList.push('Mareos');
    if (sintomas.dolorAbdominal) sintomasList.push('Dolor abdominal');
    if (sintomas.dolorGeneral) sintomasList.push('Dolor corporal general');
    if (sintomas.otro && sintomas.otroDetalle.trim()) {
      sintomasList.push(`Otro: ${sintomas.otroDetalle.trim()}`);
    }

    // 2. Recopilar lista de acciones y educación
    const accionesList: string[] = [];
    const { acciones } = formData;
    if (acciones.tomaSignos) accionesList.push('Toma de signos vitales');
    if (acciones.primerosAuxilios) accionesList.push('Primeros auxilios básicos');
    if (acciones.curacionBasica) accionesList.push('Curación básica');
    if (acciones.orientacionSanitaria) accionesList.push('Orientación sanitaria comunitaria');
    if (acciones.educacionHigiene) accionesList.push('Educación en higiene y saneamiento');
    if (acciones.educacionNutricion) accionesList.push('Orientación nutricional');
    if (acciones.educacionDengue) accionesList.push('Prevención de vectores / Dengue');
    if (acciones.educacionSignosAlarma) accionesList.push('Orientación de signos de alarma');
    if (acciones.adherenciaTratamiento) accionesList.push('Verificación de adherencia terapéutica');
    if (acciones.apoyoVacunacion) accionesList.push('Apoyo en verificación de vacunación');
    if (acciones.otraAccion && acciones.otraAccionDetalle.trim()) {
      accionesList.push(`Otra acción: ${acciones.otraAccionDetalle.trim()}`);
    }

    // 3. Mapeo a campos SOAP estandarizados
    const chiefComplaint = [
      `Motivo: [${formData.motivoCategoria || 'GENERAL'}] ${formData.motivoDescripcion.trim() || 'Atención comunitaria'}`,
      sintomasList.length > 0 ? `Síntomas reportados: ${sintomasList.join(', ')}` : '',
      sintomas.evolucionDias.trim() ? `Evolución: ${sintomas.evolucionDias.trim()}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    const physicalExam = [
      formData.evaluacion.observacionesClinicas.trim()
        ? `Hallazgos de evaluación: ${formData.evaluacion.observacionesClinicas.trim()}`
        : 'Evaluación inicial comunitaria sin anomalías detectadas visualmente.',
      formData.evaluacion.condicionVivienda.trim()
        ? `Entorno/Vivienda: ${formData.evaluacion.condicionVivienda.trim()}`
        : '',
    ]
      .filter(Boolean)
      .join(' | ');

    const diagnosisDesc = `Atención Comunitaria [${formData.motivoCategoria || 'GENERAL'}]`;

    const treatmentPlan = [
      accionesList.length > 0 ? `Acciones realizadas: ${accionesList.join(', ')}` : '',
      acciones.recomendacionesGenerales.trim()
        ? `Recomendaciones brindadas: ${acciones.recomendacionesGenerales.trim()}`
        : '',
      formData.seguimiento.requiereSeguimiento
        ? `Seguimiento programado: ${formData.seguimiento.fechaSeguimiento} - ${formData.seguimiento.motivoSeguimiento}`
        : '',
      formData.seguimiento.requiereReferencia
        ? `Referencia emitida: Destino -> ${formData.seguimiento.establecimientoDestinoNombre || formData.seguimiento.establecimientoDestinoId} | Prioridad: ${formData.seguimiento.prioridadReferencia} | Motivo: ${formData.seguimiento.motivoReferencia}`
        : '',
    ]
      .filter(Boolean)
      .join(' | ');

    // 4. Mapeo condicional de signos vitales (si son válidos)
    let vitalSignsPayload: VitalsPayloadDTO | null = null;
    const { systolic, diastolic, heartRate, temperature, oxygenSat, weight, height } =
      formData.evaluacion.signosVitales;

    const sys = Number(systolic);
    const dia = Number(diastolic);
    const hr = Number(heartRate);
    const temp = Number(temperature);
    const sat = Number(oxygenSat);

    if (
      !isNaN(sys) && sys >= 40 &&
      !isNaN(dia) && dia >= 30 &&
      !isNaN(hr) && hr >= 20 &&
      !isNaN(temp) && temp >= 30 &&
      !isNaN(sat) && sat >= 40
    ) {
      vitalSignsPayload = {
        systolic: sys,
        diastolic: dia,
        heartRate: hr,
        temperature: temp,
        oxygenSat: sat,
        weight: weight.trim() && !isNaN(Number(weight)) ? Number(weight) : null,
        height: height.trim() && !isNaN(Number(height)) ? Number(height) : null,
      };
    }

    const payload: CreateAttentionPayloadDTO = {
      patientId: formData.patient.id,
      doctorId: context?.doctorId,
      brigadeId: context?.brigadeId || null,
      workSessionId: context?.workSessionId || null,
      chiefComplaint,
      physicalExam,
      diagnosisDesc,
      treatmentPlan: treatmentPlan || 'Orientación preventiva brindada.',
      followUpDate: formData.seguimiento.requiereSeguimiento && formData.seguimiento.fechaSeguimiento
        ? formData.seguimiento.fechaSeguimiento
        : null,
      vitalSigns: vitalSignsPayload,
    };

    try {
      const response = await atencionService.createAttention(payload);
      setSuccessResponse(response);
      setSyncStatus(response.syncStatus === 'PENDING' ? 'PENDING_SYNC' : 'SYNCED');
      return response;
    } catch (err) {
      const errorMessage = (err as Error).message || 'Error al registrar la atención en el servidor.';
      if (!navigator.onLine || errorMessage.includes('offline') || errorMessage.includes('Network')) {
        setSyncStatus('PENDING_SYNC');
      } else {
        setSyncStatus('ERROR');
        setError(errorMessage);
      }
      throw new Error(errorMessage, { cause: err });
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
    createAttention,
    isLoading,
    error,
    successResponse,
    syncStatus,
    reset,
  };
}