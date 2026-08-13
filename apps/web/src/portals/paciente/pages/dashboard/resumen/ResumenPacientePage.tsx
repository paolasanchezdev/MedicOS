import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { apiClient } from '../../../../../shared/lib/apiClient';
import { useAuth } from '../../../../../core/context/AuthContextInstance';

import TarjetaBienvenidaPaciente from './components/TarjetaBienvenidaPaciente';
import TarjetaProximaCita, { type ProximaCitaData } from './components/TarjetaProximaCita';
import TarjetaResumenExpediente, { type ResumenExpedienteData } from './components/TarjetaResumenExpediente';
import TarjetaEstadoSalud, { type EstadoSaludInfo } from './components/TarjetaEstadoSalud';
import TarjetaTratamientosActivos, { type TratamientoActualData } from './components/TarjetaTratamientosActivos';
import TarjetaAccionesPendientes, { type AccionPendienteItem } from './components/TarjetaAccionesPendientes';
import AccionesRapidas from './components/AccionesRapidas';
import LineaTiempoSalud, { type EventoSaludItem } from './components/LineaTiempoSalud';

export interface PacienteResumenResponse {
  paciente: {
    id: string;
    nombreCompleto: string;
    dui?: string | null;
    fechaNacimiento?: string | null;
  } | null;
  proximaCita: ProximaCitaData | null;
  resumenExpediente: ResumenExpedienteData | null;
  estadoSalud?: EstadoSaludInfo | null;
  tratamientoActual: TratamientoActualData | null;
  accionesPendientes?: AccionPendienteItem[] | null;
  eventosSalud?: EventoSaludItem[] | null;
}

interface ApiEnvelope<T> {
  success?: boolean;
  data?: T;
}

type ApiResponse = ApiEnvelope<PacienteResumenResponse> | PacienteResumenResponse;

export const ResumenPacientePage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<PacienteResumenResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    apiClient<ApiResponse>('/patients/resumen')
      .then((res) => {
        if (isMounted) {
          const summaryData = (res as ApiEnvelope<PacienteResumenResponse>).data ?? (res as PacienteResumenResponse);
          setData(summaryData);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          console.error('Error al obtener el resumen del paciente:', err);
          setError('No fue posible conectar con el servidor de expediente clínico.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);

    apiClient<ApiResponse>('/patients/resumen')
      .then((res) => {
        const summaryData = (res as ApiEnvelope<PacienteResumenResponse>).data ?? (res as PacienteResumenResponse);
        setData(summaryData);
      })
      .catch((err: unknown) => {
        console.error('Error al reintentar resumen:', err);
        setError('No fue posible conectar con el servidor de expediente clínico.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-90 space-y-3 py-16 w-full">
        <div className="w-9 h-9 rounded-full border-2 border-[#2a726d] border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-slate-500 tracking-wide">
          Sincronizando expediente clínico...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full my-8 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="text-xs text-rose-950">
            <p className="font-bold">Error de sincronización</p>
            <p className="text-rose-800 font-medium">{error}</p>
          </div>
        </div>
        <button
          onClick={handleRetry}
          className="px-3.5 py-2 bg-rose-600 text-white hover:bg-rose-700 text-xs font-semibold rounded-xl transition-all duration-150 flex items-center gap-1.5 shrink-0 shadow-xs active:scale-[0.98]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reintentar</span>
        </button>
      </div>
    );
  }

  const usuarioSesionNombre = user ? `${user.firstName} ${user.lastName}`.trim() : undefined;

  return (
    <div className="w-full space-y-10 pb-16">
      {/* 1. BANNER DESTACADO DE BIENVENIDA */}
      <TarjetaBienvenidaPaciente
        paciente={data?.paciente || null}
        usuarioSesionNombre={usuarioSesionNombre}
      />

      {/* 2. MÓDULOS DE ATENCIÓN Y ACCESOS RÁPIDOS EN COLOR */}
      <AccionesRapidas />

      {/* 3. ESTADO CLÍNICO E INFORMACIÓN OPERATIVA INMEDIATA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        <TarjetaProximaCita cita={data?.proximaCita || null} />
        <TarjetaEstadoSalud estado={data?.estadoSalud || null} />
        <TarjetaResumenExpediente resumen={data?.resumenExpediente || null} />
      </div>

      {/* 4. SEGUIMIENTO DE TRATAMIENTOS Y TAREAS PENDIENTES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <TarjetaTratamientosActivos tratamiento={data?.tratamientoActual || null} />
        <TarjetaAccionesPendientes acciones={data?.accionesPendientes || null} />
      </div>

      {/* 5. HISTORIAL Y LÍNEA DEL TIEMPO DE SALUD */}
      <LineaTiempoSalud eventos={data?.eventosSalud || null} />
    </div>
  );
};

export default ResumenPacientePage;