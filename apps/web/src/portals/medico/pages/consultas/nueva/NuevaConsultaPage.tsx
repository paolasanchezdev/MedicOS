// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/consultas/nueva/NuevaConsultaPage.tsx
// DESCRIPCIÓN: Módulo médico de atención y consultas SOAP con soporte dual (Brigada / Citas).
// =========================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../../../shared/lib/apiClient';
import { Stethoscope, Activity, UserPlus } from 'lucide-react';
import { ColaAtencionDual, type PacienteEnAtencion, type PatientOrigin } from './components/ColaAtencionDual';
import { FichaPacienteConsulta } from './components/FichaPacienteConsulta';
import { FormularioConsultaSOAP, type SoapFormData } from './components/FormularioConsultaSOAP';

interface ApiVitalPatient {
  id: string;
  firstName: string;
  lastName: string;
  dui?: string | null;
  dateOfBirth?: string | Date;
  sex?: 'MALE' | 'FEMALE' | 'OTHER';
  clinicalRecord?: {
    bloodType?: string;
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
  vitalSigns?: {
    systolic: number;
    diastolic: number;
    heartRate: number;
    temperature: number;
    oxygenSat: number;
  };
}

export const NuevaConsultaPage: React.FC = () => {
  const [tabActiva, setTabActiva] = useState<PatientOrigin>('BRIGADA');
  const [pacientesTriage, setPacientesTriage] = useState<PacienteEnAtencion[]>([]);
  const [pacientesCitas, setPacientesCitas] = useState<PacienteEnAtencion[]>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<PacienteEnAtencion | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);

  const [soapData, setSoapData] = useState<SoapFormData>({
    chiefComplaint: '',
    physicalExam: '',
    diagnosisCode: '',
    diagnosisDesc: '',
    treatmentPlan: '',
    systolic: '',
    diastolic: '',
    heartRate: '',
    temperature: '',
    oxygenSat: '',
  });

  const classifyTriage = (sys: number, dia: number, hr: number, temp: number, spo2: number): 'NORMAL' | 'MODERADO' | 'CRITICO' => {
    if (spo2 > 0 && spo2 < 90) return 'CRITICO';
    if (sys >= 160 || dia >= 100) return 'CRITICO';
    if (temp >= 39.0) return 'CRITICO';
    if (hr >= 120 || (hr > 0 && hr < 45)) return 'CRITICO';

    if (spo2 >= 90 && spo2 <= 94) return 'MODERADO';
    if (sys >= 135 || dia >= 88) return 'MODERADO';
    if (temp >= 37.8) return 'MODERADO';

    return 'NORMAL';
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Cargar pacientes de Triage en Brigada
      const vitalsRes = await apiClient<ApiResponse<ApiVitalItem[]> | ApiVitalItem[]>('/patients/vitals/today');
      const vitalsRaw: ApiVitalItem[] = Array.isArray(vitalsRes) ? vitalsRes : vitalsRes?.data || [];

      const triageFormatted: PacienteEnAtencion[] = vitalsRaw.map((item) => {
        let age = 25;
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
          time: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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

      // 2. Cargar Citas Médicas del Día
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
          let age = 30;
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
            time: new Date(app.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            reason: app.reason,
          };
        });

      setPacientesCitas(appointmentsFormatted);

      // Selección inicial
      if (!pacienteSeleccionado) {
        if (tabActiva === 'BRIGADA' && triageFormatted.length > 0) {
          setPacienteSeleccionado(triageFormatted[0]);
        } else if (tabActiva === 'CITA' && appointmentsFormatted.length > 0) {
          setPacienteSeleccionado(appointmentsFormatted[0]);
        }
      }
    } catch (err: unknown) {
      console.error('Error al cargar datos de consulta:', err);
    } finally {
      setIsLoading(false);
    }
  }, [pacienteSeleccionado, tabActiva]);

  useEffect(() => {
    let isMounted = true;
    void (async () => {
      if (isMounted) {
        await loadData();
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [loadData]);

  const handleSelectPaciente = (paciente: PacienteEnAtencion): void => {
    setPacienteSeleccionado(paciente);
    if (paciente.reason) {
      setSoapData((prev) => ({ ...prev, chiefComplaint: paciente.reason || '' }));
    }
  };

  const handleSoapChange = (field: keyof SoapFormData, value: string | number | ''): void => {
    setSoapData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveConsultation = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!pacienteSeleccionado) {
      alert('Selecciona a un paciente para registrar la consulta.');
      return;
    }

    setIsSaving(true);

    try {
      const hasVitalsInput =
        typeof soapData.systolic === 'number' &&
        typeof soapData.diastolic === 'number' &&
        typeof soapData.heartRate === 'number' &&
        typeof soapData.temperature === 'number' &&
        typeof soapData.oxygenSat === 'number';

      const payload: CreateConsultationPayload = {
        patientId: pacienteSeleccionado.patientId,
        chiefComplaint: soapData.chiefComplaint,
        physicalExam: soapData.physicalExam,
        diagnosisDesc: soapData.diagnosisDesc,
        treatmentPlan: soapData.treatmentPlan,
        ...(soapData.diagnosisCode ? { diagnosisCode: soapData.diagnosisCode } : {}),
        ...(pacienteSeleccionado.origin === 'CITA' && pacienteSeleccionado.appointmentId
          ? { appointmentId: pacienteSeleccionado.appointmentId }
          : {}),
        ...(pacienteSeleccionado.origin === 'BRIGADA' && pacienteSeleccionado.brigadeId
          ? { brigadeId: pacienteSeleccionado.brigadeId }
          : {}),
        ...(hasVitalsInput
          ? {
              vitalSigns: {
                systolic: Number(soapData.systolic),
                diastolic: Number(soapData.diastolic),
                heartRate: Number(soapData.heartRate),
                temperature: Number(soapData.temperature),
                oxygenSat: Number(soapData.oxygenSat),
              },
            }
          : {}),
      };

      await apiClient('/consultations', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setSuccessMessage(true);
      setSoapData({
        chiefComplaint: '',
        physicalExam: '',
        diagnosisCode: '',
        diagnosisDesc: '',
        treatmentPlan: '',
        systolic: '',
        diastolic: '',
        heartRate: '',
        temperature: '',
        oxygenSat: '',
      });

      // Recargar bandejas
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

  return (
    <div className="max-w-[1700px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-50 text-[#0e7490] rounded-xl border border-teal-100/80 shrink-0">
            <Stethoscope size={22} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              Consulta Médica Integral
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
              Atención clínica SOAP con soporte para Brigadas en Campo y Citas Programadas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2">
            <Activity size={14} className="text-[#0e7490]" />
            <span>Consultorio Médico Activo</span>
          </span>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUMNA IZQUIERDA: BANDEJA DUAL */}
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

        {/* COLUMNA DERECHA: FICHA Y FORMULARIO SOAP */}
        <div className="lg:col-span-8 space-y-6">
          {pacienteSeleccionado ? (
            <>
              <FichaPacienteConsulta paciente={pacienteSeleccionado} />

              <FormularioConsultaSOAP
                data={soapData}
                origin={pacienteSeleccionado.origin}
                hasPreviousVitals={Boolean(pacienteSeleccionado.systolic)}
                onChange={handleSoapChange}
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
                Selecciona a un paciente de la cola de triage o de la agenda de citas para cargar su información y comenzar la nota SOAP.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NuevaConsultaPage;