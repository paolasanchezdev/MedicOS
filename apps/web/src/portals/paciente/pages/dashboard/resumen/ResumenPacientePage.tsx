// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/dashboard/resumen/ResumenPacientePage.tsx
// DESCRIPCIÓN: Página principal del portal paciente con medidas y márgenes exactos del Admin.
// =========================================================================

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
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-pulse max-w-[1700px] mx-auto">
        <div className="h-32 bg-slate-200 rounded-2xl" />
        <div className="h-24 bg-slate-200 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-44 bg-slate-200 rounded-2xl" />
          <div className="h-44 bg-slate-200 rounded-2xl" />
          <div className="h-44 bg-slate-200 rounded-2xl" />
          <div className="h-44 bg-slate-200 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 bg-slate-200 rounded-2xl" />
          <div className="h-72 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center my-12 bg-white rounded-2xl border border-rose-200 shadow-sm">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Error de carga</h2>
        <p className="text-sm text-slate-600 mt-1 mb-6">{error}</p>
        <button
          onClick={handleRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-xs cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reintentar</span>
        </button>
      </div>
    );
  }

  const usuarioSesionNombre = user ? `${user.firstName} ${user.lastName}`.trim() : undefined;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1700px] mx-auto">
      {/* 1. Bienvenida Institucional */}
      <TarjetaBienvenidaPaciente
        paciente={data?.paciente || null}
        usuarioSesionNombre={usuarioSesionNombre}
      />

      {/* 2. Acciones Rápidas */}
      <AccionesRapidas />

      {/* 3. Métricas y Estado Clínico */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <TarjetaProximaCita cita={data?.proximaCita || null} />
        <TarjetaEstadoSalud estado={data?.estadoSalud || null} />
        <TarjetaResumenExpediente resumen={data?.resumenExpediente || null} />
        <TarjetaTratamientosActivos tratamiento={data?.tratamientoActual || null} />
      </div>

      {/* 4. Historial y Tareas Pendientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <LineaTiempoSalud eventos={data?.eventosSalud || null} />
        <TarjetaAccionesPendientes acciones={data?.accionesPendientes || null} />
      </div>
    </div>
  );
};

export default ResumenPacientePage;