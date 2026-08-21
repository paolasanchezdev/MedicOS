// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/dashboard/resumen/ResumenMedicoPage.tsx
// DESCRIPCIÓN: Vista principal del Dashboard del Médico centrada en la atención clínica.
// =========================================================================

import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

import { AuthContext } from '../../../../../core/context/AuthContextInstance';
import { apiClient } from '../../../../../shared/lib/apiClient';

import { TarjetaBienvenidaMedico } from './components/TarjetaBienvenidaMedico';
import { ResumenConsultasCard } from './components/ResumenConsultasCard';
import { AccionesRapidas } from './components/AccionesRapidas';

import { AgendaProximaCard } from './components/AgendaProximaCard';
import { PacientesPendientesCard } from './components/PacientesPendientesCard';
import { ConsultasRecientesCard } from './components/ConsultasRecientesCard';
import { AlertasClinicasCard } from './components/AlertasClinicasCard';
import { SeguimientosPendientesCard } from './components/SeguimientosPendientesCard';

// --- Interfaces para cada sección del Dashboard ---
export interface MedicoInfoData {
  firstName?: string;
  lastName?: string;
  specialty?: string;
  medicalLicense?: string;
}

export interface ResumenConsultasData {
  total: number;
  atendidas: number;
  pendientes: number;
  canceladas: number;
}

export interface AgendaProximaData {
  proxima: {
    id: string;
    hora: string;
    paciente: string;
    tipo: string;
    motivo: string;
  } | null;
  siguientes: Array<{
    hora: string;
    paciente: string;
  }>;
}

export interface PacientePendienteData {
  id: string;
  nombre: string;
  tipo: string;
  detalle: string;
  hora: string;
}

export interface ConsultaRecienteData {
  id: string;
  paciente: string;
  fecha: string;
  hora: string;
  lugar: string;
  tipo: string;
  estado: string;
}

export interface AlertaClinicaData {
  id: string;
  prioridad: 'alta' | 'media' | 'baja';
  titulo: string;
  paciente: string;
  tiempo: string;
}

export interface SeguimientoPendienteData {
  id: string;
  paciente: string;
  motivo: string;
  vencimiento: string;
}

export interface ResumenMedicoDashboard {
  medico?: MedicoInfoData;
  resumenConsultas?: ResumenConsultasData;
  agendaProxima?: AgendaProximaData;
  pacientesPendientes?: PacientePendienteData[];
  consultasRecientes?: ConsultaRecienteData[];
  alertasClinicas?: AlertaClinicaData[];
  seguimientosPendientes?: SeguimientoPendienteData[];
}

export const ResumenMedicoPage: React.FC = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [data, setData] = useState<ResumenMedicoDashboard | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchResumen = async (): Promise<ResumenMedicoDashboard> => {
    return apiClient<ResumenMedicoDashboard>('/medico/dashboard/resumen', {
      method: 'GET',
    });
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);

    try {
      const res = await fetchResumen();
      setData(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al conectar con el servidor';
      console.error('Error cargando el resumen del dashboard:', err);
      setError(msg);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const loadSummary = async () => {
      try {
        const res = await fetchResumen();
        if (isSubscribed) {
          setData(res);
          setError(null);
        }
      } catch (err: unknown) {
        if (isSubscribed) {
          const msg = err instanceof Error ? err.message : 'Error al conectar con el servidor';
          console.error('Error cargando el resumen del dashboard:', err);
          setError(msg);
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    loadSummary();

    return () => {
      isSubscribed = false;
    };
  }, []);

  const handleVerDetalleConsultas = (tipo: 'TOTAL' | 'ATENDIDAS' | 'PENDIENTES' | 'CANCELADAS') => {
    switch (tipo) {
      case 'TOTAL':
        navigate('/medico/consultas/agenda');
        break;
      case 'ATENDIDAS':
        navigate('/medico/consultas/historial');
        break;
      case 'PENDIENTES':
        navigate('/medico/pacientes/listado');
        break;
      case 'CANCELADAS':
        navigate('/medico/consultas/historial');
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
        <p className="text-sm font-medium text-slate-600">
          Cargando métricas y estación clínica en tiempo real...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white border border-rose-200 rounded-2xl shadow-sm text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Error de carga</h2>
        <p className="text-sm text-slate-600">{error || 'Información no disponible.'}</p>
        <button
          type="button"
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reintentar conexión</span>
        </button>
      </div>
    );
  }

  // Datos de usuario desde AuthContext con fallback a la respuesta de la API
  const user = auth?.user;
  const medicoFirstName = user?.firstName || data.medico?.firstName;
  const medicoLastName = user?.lastName || data.medico?.lastName;

  // Se extraen de las propiedades extendidas del usuario o del objeto entregado por la API
  const medicoSpecialty = (user as { specialty?: string; especialidad?: string })?.specialty || (user as { especialidad?: string })?.especialidad || data.medico?.specialty;
  const medicoLicense = (user as { medicalLicense?: string; numeroJunta?: string; jvpm?: string })?.medicalLicense || (user as { numeroJunta?: string })?.numeroJunta || (user as { jvpm?: string })?.jvpm || data.medico?.medicalLicense;

  return (
    <div className="p-6 space-y-6 max-w-[1700px] mx-auto">
      {/* 1. Tarjeta de Bienvenida Clínica */}
      <TarjetaBienvenidaMedico
        firstName={medicoFirstName}
        lastName={medicoLastName}
        specialty={medicoSpecialty}
        medicalLicense={medicoLicense}
        patientsWaitingCount={data.resumenConsultas?.pendientes ?? 0}
        patientsAttendedCount={data.resumenConsultas?.atendidas ?? 0}
        onRefresh={handleRefresh}
        isRefreshing={refreshing}
      />

      {/* 2. Acciones Rápidas Médicas */}
      <AccionesRapidas />

      {/* 3. Tarjetas KPI de Consultas y Pacientes */}
      <ResumenConsultasCard
        data={data.resumenConsultas}
        onVerDetalle={handleVerDetalleConsultas}
      />

      {/* 4. Bloque Central Operativo Médico */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AgendaProximaCard data={data.agendaProxima} />
        <AlertasClinicasCard data={data.alertasClinicas} />
        <PacientesPendientesCard data={data.pacientesPendientes} />
        <SeguimientosPendientesCard data={data.seguimientosPendientes} />
      </div>

      {/* 5. Consultas Finalizadas Recientemente */}
      <ConsultasRecientesCard data={data.consultasRecientes} />
    </div>
  );
};