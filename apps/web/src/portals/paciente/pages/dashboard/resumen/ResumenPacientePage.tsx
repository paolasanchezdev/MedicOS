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

export const ResumenPacientePage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<PacienteResumenResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    apiClient<PacienteResumenResponse>('/patients/resumen')
      .then((res) => {
        if (isMounted) {
          setData(res);
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

    apiClient<PacienteResumenResponse>('/patients/resumen')
      .then((res) => {
        setData(res);
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
      <div className="flex flex-col items-center justify-center min-h-100 space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
        <p className="text-xs font-medium text-slate-500">Sincronizando expediente clínico...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto my-8 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="text-xs text-rose-900">
            <p className="font-bold">Error de sincronización</p>
            <p className="text-rose-700">{error}</p>
          </div>
        </div>
        <button
          onClick={handleRetry}
          className="px-3.5 py-2 bg-rose-100 hover:bg-rose-200 text-rose-900 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reintentar
        </button>
      </div>
    );
  }

  const usuarioSesionNombre = user ? `${user.firstName} ${user.lastName}`.trim() : undefined;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* 1. TARJETA DE BIENVENIDA CON FICHA CLÍNICA DE PACIENTE */}
      <TarjetaBienvenidaPaciente
        paciente={data?.paciente || null}
        usuarioSesionNombre={usuarioSesionNombre}
      />

      {/* 2. GRID CLINICO PRINCIPAL (FILA 1: ATENCIONES Y REGISTROS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        <TarjetaProximaCita cita={data?.proximaCita || null} />
        <TarjetaResumenExpediente resumen={data?.resumenExpediente || null} />
        <TarjetaEstadoSalud estado={data?.estadoSalud || null} />
      </div>

      {/* 3. GRID CLINICO SECUNDARIO (FILA 2: TRATAMIENTOS Y PENDIENTES) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <TarjetaTratamientosActivos tratamiento={data?.tratamientoActual || null} />
        <TarjetaAccionesPendientes acciones={data?.accionesPendientes || null} />
      </div>

      {/* 4. MÓDULOS DE ACCESO RÁPIDO */}
      <AccionesRapidas />

      {/* 5. LÍNEA DEL TIEMPO Y CRONOLOGÍA DE SALUD */}
      <LineaTiempoSalud eventos={data?.eventosSalud || null} />
    </div>
  );
};

export default ResumenPacientePage;