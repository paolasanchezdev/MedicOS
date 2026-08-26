// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/consultas/nueva/NuevaConsultaPage.tsx
// DESCRIPCIÓN: Orquestador médico principal con soporte de FR y CDSS offline.
// =========================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../../../shared/lib/apiClient';
import { UserPlus } from 'lucide-react';

import { NuevaConsultaHeader } from './components/NuevaConsultaHeader';
import { ColaAtencionDual, type PacienteEnAtencion, type PatientOrigin } from './components/ColaAtencionDual';
import { PacienteFichaClinica } from './components/PacienteFichaClinica';
import { FormularioConsultaClinica, type ClinicalFormState } from './components/FormularioConsultaClinica';
import type { PrescripcionItem } from './components/PrescripcionMedicamentos';

interface ApiVitalPatient {
  id: string;
  firstName: string;
  lastName: string;
  dui?: string | null;
  dateOfBirth?: string | Date;
  sex?: 'MALE' | 'FEMALE' | 'OTHER';
  clinicalRecord?: {
    bloodType?: string;
    observations?: string | null;
  } | null;
}

interface ApiVitalItem {
  id: string;
  patientId: string;
  patient?: ApiVitalPatient | null;
  createdAt: string | Date;
  systolic: number;
  diastolic: number;
  heartRate: number;
  respiratoryRate?: number | null;
  temperature: number;
  oxygenSat: number;
  weight?: number | null;
  height?: number | null;
}

interface ApiAppointmentItem {
  id: string;
  patientId: string;
  appointmentDate: string | Date;
  reason: string;
  status: string;
  patient?: ApiVitalPatient | null;
}

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
}

interface CreateConsultationPayload {
  patientId: string;
  chiefComplaint: string;
  physicalExam: string;
  diagnosisDesc: string;
  treatmentPlan: string;
  diagnosisCode?: string;
  appointmentId?: string;
  brigadeId?: string;
  followUpDate?: string;
  vitalSigns?: {
    systolic: number;
    diastolic: number;
    heartRate: number;
    respiratoryRate?: number;
    temperature: number;
    oxygenSat: number;
  };
}

const formatLocalTime = (isoString?: string | Date): string => {
  if (!isoString) return '--:--';
  if (typeof isoString === 'string' && isoString.includes('T')) {
    const timePart = isoString.split('T')[1];
    if (timePart) {
      return timePart.substring(0, 5);
    }
  }
  const d = new Date(isoString);
  return isNaN(d.getTime())
    ? '--:--'
    : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

export const NuevaConsultaPage: React.FC = () => {
  const [tabActiva, setTabActiva] = useState<PatientOrigin>('CITA');
  const [pacientesTriage, setPacientesTriage] = useState<PacienteEnAtencion[]>([]);
  const [pacientesCitas, setPacientesCitas] = useState<PacienteEnAtencion[]>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<PacienteEnAtencion | null>(null);
  const [patientAllergies, setPatientAllergies] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);

  const [clinicalData, setClinicalData] = useState<ClinicalFormState>({
    chiefComplaint: '',
    physicalExam: '',
    diagnosisCode: '',
    diagnosisDesc: '',
    nonPharmPlan: '',
    warningSigns: '',
    followUpDate: '',
    systolic: '',
    diastolic: '',
    heartRate: '',
    respiratoryRate: '',
    temperature: '',
    oxygenSat: '',
  });

  const [prescriptionItems, setPrescriptionItems] = useState<PrescripcionItem[]>([]);

  const classifyTriage = (sys: number, dia: number, hr: number, temp: number, spo2: number): 'NORMAL' | 'MODERADO' | 'CRITICO' => {
    if ((spo2 > 0 && spo2 < 90) || sys >= 160 || dia >= 100 || temp >= 39.0 || hr >= 120) return 'CRITICO';
    if ((spo2 >= 90 && spo2 <= 94) || sys >= 135 || dia >= 88 || temp >= 37.8) return 'MODERADO';
    return 'NORMAL';
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const vitalsRes = await apiClient<ApiResponse<ApiVitalItem[]> | ApiVitalItem[]>('/patients/vitals/today');
      const vitalsRaw: ApiVitalItem[] = Array.isArray(vitalsRes) ? vitalsRes : vitalsRes?.data || [];

      const triageFormatted: PacienteEnAtencion[] = vitalsRaw.map((item) => {
        let age = 0;
        if (item.patient?.dateOfBirth) {
          const diff = Date.now() - new Date(item.patient.dateOfBirth).getTime();
          age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        }

        const bmi =
          item.weight && item.height && item.height > 0
            ? parseFloat((item.weight / Math.pow(item.height / 100, 2)).toFixed(1))
            : 0;

        return {
          id: item.id,
          patientId: item.patientId || item.patient?.id || '',
          origin: 'BRIGADA',
          name: item.patient ? `${item.patient.firstName} ${item.patient.lastName}` : 'Paciente Triage',
          dui: item.patient?.dui || 'Sin DUI',
          age: age > 0 ? age : 0,
          gender: item.patient?.sex === 'MALE' ? 'Masculino' : item.patient?.sex === 'FEMALE' ? 'Femenino' : 'Otro',
          bloodType: item.patient?.clinicalRecord?.bloodType?.replace('_', ' ') || 'Desconocido',
          time: formatLocalTime(item.createdAt),
          systolic: item.systolic,
          diastolic: item.diastolic,
          heartRate: item.heartRate,
          temperature: item.temperature,
          oxygenSat: item.oxygenSat,
          weight: item.weight,
          height: item.height,
          bmi,
          triageLevel: classifyTriage(item.systolic, item.diastolic, item.heartRate, item.temperature, item.oxygenSat),
        };
      });

      setPacientesTriage(triageFormatted);

      const todayStr = new Date().toISOString().split('T')[0];
      const appointmentsRes = await apiClient<ApiResponse<ApiAppointmentItem[]> | ApiAppointmentItem[]>(
        `/appointments/agenda?date=${todayStr}`
      );
      const appointmentsRaw: ApiAppointmentItem[] = Array.isArray(appointmentsRes)
        ? appointmentsRes
        : appointmentsRes?.data || [];

      const appointmentsFormatted: PacienteEnAtencion[] = appointmentsRaw
        .filter((app) => app.status !== 'COMPLETED' && app.status !== 'CANCELLED')
        .map((app) => {
          let age = 0;
          if (app.patient?.dateOfBirth) {
            const diff = Date.now() - new Date(app.patient.dateOfBirth).getTime();
            age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
          }

          return {
            id: app.id,
            patientId: app.patientId || app.patient?.id || '',
            appointmentId: app.id,
            origin: 'CITA',
            name: app.patient ? `${app.patient.firstName} ${app.patient.lastName}` : 'Paciente Cita',
            dui: app.patient?.dui || 'Sin DUI',
            age: age > 0 ? age : 0,
            gender: app.patient?.sex === 'MALE' ? 'Masculino' : app.patient?.sex === 'FEMALE' ? 'Femenino' : 'Otro',
            bloodType: app.patient?.clinicalRecord?.bloodType?.replace('_', ' ') || 'Desconocido',
            time: formatLocalTime(app.appointmentDate),
            reason: app.reason,
          };
        });

      setPacientesCitas(appointmentsFormatted);

      if (!pacienteSeleccionado) {
        if (tabActiva === 'CITA' && appointmentsFormatted.length > 0) {
          const first = appointmentsFormatted[0];
          setPacienteSeleccionado(first);
          if (first.reason) {
            setClinicalData((prev) => ({ ...prev, chiefComplaint: first.reason || '' }));
          }
        } else if (tabActiva === 'BRIGADA' && triageFormatted.length > 0) {
          setPacienteSeleccionado(triageFormatted[0]);
        }
      }
    } catch (err: unknown) {
      console.error('Error al cargar datos de consulta médica:', err);
    } finally {
      setIsLoading(false);
    }
  }, [pacienteSeleccionado, tabActiva]);

  useEffect(() => {
    let ignore = false;
    void (async () => {
      await Promise.resolve();
      if (!ignore) {
        await loadData();
      }
    })();
    return () => {
      ignore = true;
    };
  }, [loadData]);

  const handleSelectPaciente = async (paciente: PacienteEnAtencion): Promise<void> => {
    setPacienteSeleccionado(paciente);
    if (paciente.reason) {
      setClinicalData((prev) => ({ ...prev, chiefComplaint: paciente.reason || '' }));
    }

    try {
      const pRes = await apiClient<{ data?: { clinicalRecord?: { observations?: string } } }>(
        `/patients/${paciente.patientId}`
      );
      setPatientAllergies(pRes?.data?.clinicalRecord?.observations || 'Penicilina');
    } catch {
      setPatientAllergies('Penicilina');
    }
  };

  const handleClinicalChange = (field: keyof ClinicalFormState, value: string | number | '') => {
    setClinicalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddPrescription = () => {
    const newItem: PrescripcionItem = {
      id: crypto.randomUUID(),
      medicine: '',
      dose: '1 tableta',
      route: 'Vía Oral',
      frequency: 'Cada 8 horas',
      duration: 'Por 5 días',
      instructions: 'Tomar después de los alimentos.',
    };
    setPrescriptionItems((prev) => [...prev, newItem]);
  };

  const handleRemovePrescription = (id: string) => {
    setPrescriptionItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdatePrescription = (id: string, field: keyof PrescripcionItem, value: string) => {
    setPrescriptionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSaveConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteSeleccionado) {
      alert('Selecciona a un paciente para registrar la consulta.');
      return;
    }

    setIsSaving(true);

    try {
      const hasVitalsInput =
        typeof clinicalData.systolic === 'number' &&
        typeof clinicalData.diastolic === 'number' &&
        typeof clinicalData.heartRate === 'number' &&
        typeof clinicalData.temperature === 'number' &&
        typeof clinicalData.oxygenSat === 'number';

      const rxText =
        prescriptionItems.length > 0
          ? prescriptionItems
              .map(
                (p, idx) =>
                  `${idx + 1}. ${p.medicine} | Dosis: ${p.dose} | ${p.frequency} | ${p.duration}${
                    p.instructions ? ` (${p.instructions})` : ''
                  }`
              )
              .join('\n')
          : 'Sin medicamentos prescritos.';

      const fullTreatmentPlan = [
        '=== FARMACOTERAPIA / RECETA ===',
        rxText,
        '',
        '=== INDICACIONES Y CUIDADOS ===',
        clinicalData.nonPharmPlan.trim() || 'Reposo e hidratación general.',
        '',
        '=== SIGNOS DE ALARMA ===',
        clinicalData.warningSigns.trim() || 'Consultar de inmediato si los síntomas empeoran o persiste fiebre alta.',
      ].join('\n');

      const payload: CreateConsultationPayload = {
        patientId: pacienteSeleccionado.patientId,
        chiefComplaint: clinicalData.chiefComplaint,
        physicalExam: clinicalData.physicalExam,
        diagnosisDesc: clinicalData.diagnosisDesc,
        treatmentPlan: fullTreatmentPlan,
        ...(clinicalData.diagnosisCode ? { diagnosisCode: clinicalData.diagnosisCode } : {}),
        ...(clinicalData.followUpDate ? { followUpDate: clinicalData.followUpDate } : {}),
        ...(pacienteSeleccionado.origin === 'CITA' && pacienteSeleccionado.appointmentId
          ? { appointmentId: pacienteSeleccionado.appointmentId }
          : {}),
        ...(pacienteSeleccionado.origin === 'BRIGADA' && pacienteSeleccionado.brigadeId
          ? { brigadeId: pacienteSeleccionado.brigadeId }
          : {}),
        ...(hasVitalsInput
          ? {
              vitalSigns: {
                systolic: Number(clinicalData.systolic),
                diastolic: Number(clinicalData.diastolic),
                heartRate: Number(clinicalData.heartRate),
                ...(typeof clinicalData.respiratoryRate === 'number'
                  ? { respiratoryRate: Number(clinicalData.respiratoryRate) }
                  : {}),
                temperature: Number(clinicalData.temperature),
                oxygenSat: Number(clinicalData.oxygenSat),
              },
            }
          : {}),
      };

      await apiClient('/consultations', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setSuccessMessage(true);
      setClinicalData({
        chiefComplaint: '',
        physicalExam: '',
        diagnosisCode: '',
        diagnosisDesc: '',
        nonPharmPlan: '',
        warningSigns: '',
        followUpDate: '',
        systolic: '',
        diastolic: '',
        heartRate: '',
        respiratoryRate: '',
        temperature: '',
        oxygenSat: '',
      });
      setPrescriptionItems([]);

      await loadData();
      setTimeout(() => setSuccessMessage(false), 4000);
    } catch (err: unknown) {
      console.error('Error al guardar consulta médica:', err);
      const msg = err instanceof Error ? err.message : 'Error al guardar la consulta.';
      alert(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const parts = pacienteSeleccionado?.reason ? pacienteSeleccionado.reason.split('|') : [];
  const symptomsStr = parts[0]?.replace('Síntomas:', '').trim() || '';
  const patientSymptoms = symptomsStr ? symptomsStr.split(',').map((s) => s.trim()).filter(Boolean) : [];

  return (
    <div className="max-w-[1700px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <NuevaConsultaHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUMNA IZQUIERDA: COLA DE ENTRADA (TRIAGE / CITAS) */}
        <div className="lg:col-span-4">
          <ColaAtencionDual
            tabActiva={tabActiva}
            onTabChange={(tab: PatientOrigin) => {
              setTabActiva(tab);
              setPacienteSeleccionado(null);
            }}
            pacientesTriage={pacientesTriage}
            pacientesCitas={pacientesCitas}
            pacienteSeleccionadoId={pacienteSeleccionado?.patientId || null}
            onSelectPaciente={handleSelectPaciente}
            onRefresh={loadData}
            isLoading={isLoading}
          />
        </div>

        {/* COLUMNA DERECHA: FICHA DEL PACIENTE Y ESTACIÓN CLÍNICA CDSS */}
        <div className="lg:col-span-8 space-y-6">
          {pacienteSeleccionado ? (
            <>
              <PacienteFichaClinica paciente={pacienteSeleccionado} />

              <FormularioConsultaClinica
                patientSymptoms={patientSymptoms}
                patientAllergies={patientAllergies}
                data={clinicalData}
                prescriptionItems={prescriptionItems}
                origin={pacienteSeleccionado.origin}
                hasPreviousVitals={Boolean(pacienteSeleccionado.systolic)}
                onChange={handleClinicalChange}
                onAddPrescription={handleAddPrescription}
                onRemovePrescription={handleRemovePrescription}
                onUpdatePrescription={handleUpdatePrescription}
                onSubmit={handleSaveConsultation}
                isSaving={isSaving}
                successMessage={successMessage}
                disabled={!pacienteSeleccionado}
              />
            </>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-2xs space-y-3">
              <UserPlus size={36} className="mx-auto text-slate-300" />
              <h3 className="text-sm font-bold text-slate-700">Ningún paciente seleccionado</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Selecciona a un paciente de la lista de triage o de la agenda de citas para comenzar la atención clínica asistida.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NuevaConsultaPage;