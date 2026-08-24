// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/evaluacion/signos-vitales/SignosVitalesPage.tsx
// DESCRIPCIÓN: Orquestador de Triage y Signos Vitales conectado a Neon PostgreSQL.
// =========================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { apiClient } from '../../../../../shared/lib/apiClient';
import { SignosVitalesHeader } from './components/SignosVitalesHeader';
import { SignosVitalesMetrics } from './components/SignosVitalesMetrics';
import { BuscadorPacienteTriage, type PatientSummary } from './components/BuscadorPacienteTriage';
import { FormularioSignosVitales, type VitalsFormData } from './components/FormularioSignosVitales';
import { SemaforoTriageCard, type TriageLevel } from './components/SemaforoTriageCard';
import { HistorialTriageTable, type TriageRecordItem } from './components/HistorialTriageTable';

interface ApiVitalSignPatient {
  id: string;
  firstName: string;
  lastName: string;
  dui?: string | null;
}

interface ApiVitalSignItem {
  id: string;
  patient?: ApiVitalSignPatient | null;
  createdAt: string | Date;
  systolic: number;
  diastolic: number;
  heartRate: number;
  temperature: number;
  oxygenSat: number;
  weight?: number | null;
  height?: number | null;
}

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
}

export const SignosVitalesPage: React.FC = () => {
  // 1. Paciente Seleccionado
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(null);

  // 2. Estado del Formulario
  const [formData, setFormData] = useState<VitalsFormData>({
    systolic: '',
    diastolic: '',
    heartRate: '',
    respiratoryRate: '',
    temperature: '',
    oxygenSaturation: '',
    glucose: '',
    weightKg: '',
    heightCm: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [records, setRecords] = useState<TriageRecordItem[]>([]);

  // Clasificador de Triage Clínico
  const classifyTriage = (sys: number, dia: number, hr: number, temp: number, spo2: number): TriageLevel => {
    if (spo2 > 0 && spo2 < 90) return 'CRITICO';
    if (sys >= 160 || dia >= 100) return 'CRITICO';
    if (temp >= 39.0) return 'CRITICO';
    if (hr >= 120 || (hr > 0 && hr < 45)) return 'CRITICO';

    if (spo2 >= 90 && spo2 <= 94) return 'MODERADO';
    if (sys >= 135 || dia >= 88) return 'MODERADO';
    if (temp >= 37.8) return 'MODERADO';

    return 'NORMAL';
  };

  // Función asíncrona de consulta a la API
  const fetchRecords = async (): Promise<TriageRecordItem[]> => {
    try {
      const response = await apiClient<ApiResponse<ApiVitalSignItem[]> | ApiVitalSignItem[]>(
        '/patients/vitals/today'
      );
      const raw: ApiVitalSignItem[] = Array.isArray(response) ? response : response?.data || [];

      return raw.map((item) => {
        const bmiVal =
          item.weight && item.height && item.height > 0
            ? parseFloat((item.weight / Math.pow(item.height / 100, 2)).toFixed(1))
            : 0;

        return {
          id: item.id,
          patientName: item.patient ? `${item.patient.firstName} ${item.patient.lastName}` : 'Paciente',
          dui: item.patient?.dui || 'Sin DUI',
          time: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          bloodPressure: `${item.systolic}/${item.diastolic}`,
          heartRate: item.heartRate,
          temp: item.temperature,
          spo2: item.oxygenSat,
          bmi: bmiVal,
          triageLevel: classifyTriage(item.systolic, item.diastolic, item.heartRate, item.temperature, item.oxygenSat),
          status: 'EN_ESPERA',
        };
      });
    } catch (error) {
      console.error('Error al cargar constantes vitales de hoy:', error);
      return [];
    }
  };

  // Carga inicial con bandera de desmontaje
  useEffect(() => {
    let isMounted = true;

    void (async () => {
      const data = await fetchRecords();
      if (isMounted) {
        setRecords(data);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, );

  const handleInputChange = (field: keyof VitalsFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetForm = () => {
    setFormData({
      systolic: '',
      diastolic: '',
      heartRate: '',
      respiratoryRate: '',
      temperature: '',
      oxygenSaturation: '',
      glucose: '',
      weightKg: '',
      heightCm: '',
      notes: '',
    });
  };

  // Cálculo Dinámico de IMC
  const bmiCalculation = useMemo(() => {
    const w = parseFloat(formData.weightKg);
    const h = parseFloat(formData.heightCm) / 100;
    if (!w || !h || h <= 0) {
      return { value: null, category: { label: 'Sin calcular', color: 'text-slate-500' } };
    }
    const val = parseFloat((w / (h * h)).toFixed(1));
    if (val < 18.5) return { value: val, category: { label: 'Bajo peso', color: 'text-amber-600' } };
    if (val < 25) return { value: val, category: { label: 'Peso normal', color: 'text-emerald-600' } };
    if (val < 30) return { value: val, category: { label: 'Sobrepeso', color: 'text-amber-600' } };
    return { value: val, category: { label: 'Obesidad', color: 'text-rose-600' } };
  }, [formData.weightKg, formData.heightCm]);

  // Análisis de Triage en Pantalla
  const triageAnalysis = useMemo<{ level: TriageLevel; message: string }>(() => {
    const sys = parseFloat(formData.systolic);
    const dia = parseFloat(formData.diastolic);
    const hr = parseFloat(formData.heartRate);
    const temp = parseFloat(formData.temperature);
    const spo2 = parseFloat(formData.oxygenSaturation);

    if (!sys && !hr && !temp && !spo2) {
      return { level: 'PENDIENTE', message: 'Esperando ingreso de constantes...' };
    }

    const lvl = classifyTriage(sys || 0, dia || 0, hr || 0, temp || 0, spo2 || 0);

    if (lvl === 'CRITICO') {
      return { level: 'CRITICO', message: 'Alerta Crítica: Parámetros fuera de rango seguro. Derivación inmediata.' };
    }
    if (lvl === 'MODERADO') {
      return { level: 'MODERADO', message: 'Precaución: Parámetros limítrofes. Requiere vigilancia.' };
    }
    return { level: 'NORMAL', message: 'Signos vitales estables dentro de los límites normales.' };
  }, [formData.systolic, formData.diastolic, formData.heartRate, formData.temperature, formData.oxygenSaturation]);

  // Guardar en la Base de Datos Real
  const handleSubmitTriage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      alert('Por favor selecciona un paciente primero.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        patientId: selectedPatient.id,
        systolic: parseFloat(formData.systolic),
        diastolic: parseFloat(formData.diastolic),
        heartRate: parseFloat(formData.heartRate),
        temperature: parseFloat(formData.temperature),
        oxygenSaturation: parseFloat(formData.oxygenSaturation),
        oxygenSat: parseFloat(formData.oxygenSaturation),
        weight: formData.weightKg ? parseFloat(formData.weightKg) : null,
        height: formData.heightCm ? parseFloat(formData.heightCm) : null,
      };

      await apiClient(`/patients/${selectedPatient.id}/vitals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      setSubmitSuccess(true);
      handleResetForm();
      const updatedRecords = await fetchRecords();
      setRecords(updatedRecords);

      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err: unknown) {
      console.error('Error al guardar signos vitales en el servidor:', err);
      const msg = err instanceof Error ? err.message : 'Ocurrió un error al guardar los signos vitales en Neon.';
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1700px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <SignosVitalesHeader />

      <SignosVitalesMetrics
        totalTriados={records.length}
        establesCount={records.filter((r) => r.triageLevel === 'NORMAL').length}
        observacionCount={records.filter((r) => r.triageLevel === 'MODERADO').length}
        criticosCount={records.filter((r) => r.triageLevel === 'CRITICO').length}
      />

      <BuscadorPacienteTriage
        selectedPatient={selectedPatient}
        onSelectPatient={setSelectedPatient}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <FormularioSignosVitales
            formData={formData}
            onChange={handleInputChange}
            onReset={handleResetForm}
            onSubmit={handleSubmitTriage}
            isSubmitting={isSubmitting}
            submitSuccess={submitSuccess}
            disabled={!selectedPatient}
          />
        </div>

        <div className="lg:col-span-4">
          <SemaforoTriageCard
            triageLevel={triageAnalysis.level}
            triageMessage={triageAnalysis.message}
            bloodPressure={formData.systolic && formData.diastolic ? `${formData.systolic}/${formData.diastolic}` : ''}
            spo2={formData.oxygenSaturation}
            heartRate={formData.heartRate}
            temperature={formData.temperature}
            bmiValue={bmiCalculation.value}
            bmiCategory={bmiCalculation.category}
            weightKg={formData.weightKg}
            heightCm={formData.heightCm}
          />
        </div>
      </div>

      <HistorialTriageTable records={records} />
    </div>
  );
};

export default SignosVitalesPage;