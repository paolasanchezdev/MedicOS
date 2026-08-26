// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/resumen/ResumenBrigadaPage.tsx
// DESCRIPCIÓN: Página ejecutiva de Resumen de Brigada con estilo visual Admin y datos de BD.
// =========================================================================

import React, { useEffect, useState, useCallback } from 'react';
import { apiClient } from '../../../../../shared/lib/apiClient';
import { ResumenBrigadaHeader } from './components/ResumenBrigadaHeader';
import { EstadoJornadaCard } from './components/EstadoJornadaCard';
import { ResumenPacientesCard } from './components/ResumenPacientesCard';
import { TriageResumenCard } from './components/TriageResumenCard';
import { PacientesPendientesCard } from './components/PacientesPendientesCard';
import type { PacientePendienteItem } from './components/PacientesPendientesCard';
import { DerivacionesCard } from './components/DerivacionesCard';
import { SincronizacionBrigadaCard } from './components/SincronizacionBrigadaCard';
import { AccionesRapidasBrigada } from './components/AccionesRapidasBrigada';
import { ActividadRecienteBrigada } from './components/ActividadRecienteBrigada';
import type { ActividadItem } from './components/ActividadRecienteBrigada';
import { RefreshCw, Database } from 'lucide-react';

interface DashboardApiResponse {
  success: boolean;
  data: {
    resumenTriajes: {
      total: number;
      completados: number;
      pendientes: number;
      alertas: number;
    };
    estadoJornada: {
      jornadaActiva: boolean;
      nombreBrigada: string;
      ubicacion?: string;
      horaInicio?: string;
      totalPacientesAtendidos: number;
    };
    alertasClinicasData: {
      totalAlertas: number;
      altaPrioridadCount: number;
      alertas: Array<{
        id: string;
        titulo: string;
        paciente: string;
        tiempo: string;
      }>;
    };
    pacientesEnEspera: Array<{
      id: string;
      nombre: string;
      hora: string;
    }>;
    triajesRecientes: Array<{
      id: string;
      paciente: string;
      fechaHora: string;
      detalles: string;
    }>;
  };
}

export const ResumenBrigadaPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [rawdata, setRawData] = useState<DashboardApiResponse['data'] | null>(null);

  const fetchBrigadaResumen = async (): Promise<DashboardApiResponse['data']> => {
    const response = await apiClient<DashboardApiResponse>('/brigades/dashboard/resumen', {
      method: 'GET',
    });
    return response.data;
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const res = await fetchBrigadaResumen();
      setRawData(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al conectar con la base de datos de la estación.';
      setError(msg);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    const load = async () => {
      try {
        const res = await fetchBrigadaResumen();
        if (isSubscribed) {
          setRawData(res);
          setError(null);
        }
      } catch (err: unknown) {
        if (isSubscribed) {
          const msg = err instanceof Error ? err.message : 'No se pudo obtener información de la brigada desde el servidor local.';
          setError(msg);
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      isSubscribed = false;
    };
  }, []);

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
      </div>
    );
  }

  if (error || !rawdata) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center my-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-slate-200">
          <Database className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Sin conexión con la Base de Datos</h2>
        <p className="text-sm text-slate-600 mt-1 mb-6">
          {error || 'No se encontró una sesión o brigada activa registrada en la estación local.'}
        </p>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-xs cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Reintentar Conexión</span>
        </button>
      </div>
    );
  }

  const nombreBrigada = rawdata.estadoJornada.nombreBrigada;
  const comunidad = rawdata.estadoJornada.ubicacion || 'Comunidad en terreno';
  const fechaActual = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  const estadoJornadaStr = rawdata.estadoJornada.jornadaActiva ? 'ACTIVA' : 'FINALIZADA';
  const horaInicio = rawdata.estadoJornada.horaInicio || '--:--';

  const registradosTotal = rawdata.resumenTriajes.total + rawdata.resumenTriajes.pendientes;
  const triageRealizados = rawdata.resumenTriajes.total;
  const enEspera = rawdata.resumenTriajes.pendientes;
  const atendidos = rawdata.resumenTriajes.completados;
  const derivados = 0;

  const triageRojo = rawdata.alertasClinicasData.altaPrioridadCount;
  const triageAmarillo = rawdata.resumenTriajes.alertas - triageRojo > 0 ? rawdata.resumenTriajes.alertas - triageRojo : 0;
  const triageVerde = Math.max(0, triageRealizados - triageRojo - triageAmarillo);

  const pacientesPendientes: PacientePendienteItem[] = rawdata.pacientesEnEspera.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    estado: 'Pendiente de triage',
    prioridad: 'AMARILLO',
    tiempoEspera: p.hora,
  }));

  const actividadesRecientes: ActividadItem[] = rawdata.triajesRecientes.map((t) => ({
    id: t.id,
    hora: t.fechaHora,
    descripcion: `Triage completado: ${t.paciente} (${t.detalles})`,
    tipo: 'TRIAGE',
  }));

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1700px] mx-auto animate-in fade-in duration-200">
      <ResumenBrigadaHeader
        nombreBrigada={nombreBrigada}
        comunidad={comunidad}
        fecha={fechaActual}
        estado={estadoJornadaStr as 'ACTIVA' | 'EN_PAUSA' | 'FINALIZADA'}
        horaInicio={horaInicio}
        onRefresh={handleRefresh}
        isRefreshing={refreshing}
      />

      <EstadoJornadaCard
        estado={estadoJornadaStr}
        horaInicio={horaInicio}
        duracion={rawdata.estadoJornada.jornadaActiva ? 'En curso' : 'Cerrada'}
        ultimaActividad={rawdata.triajesRecientes[0]?.detalles || 'Sin actividad reciente'}
      />

      <ResumenPacientesCard
        registrados={registradosTotal}
        triageRealizados={triageRealizados}
        enEspera={enEspera}
        atendidos={atendidos}
        derivados={derivados}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TriageResumenCard
          rojo={triageRojo}
          amarillo={triageAmarillo}
          verde={triageVerde}
        />
        <PacientesPendientesCard pacientes={pacientesPendientes} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DerivacionesCard
          total={derivados}
          pendientes={0}
          atendidas={0}
        />
        <SincronizacionBrigadaCard
          isOnline={true}
          pendientesCount={enEspera}
          ultimaSincro={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        />
      </div>

      <AccionesRapidasBrigada />

      <ActividadRecienteBrigada actividades={actividadesRecientes} />
    </div>
  );
};

export default ResumenBrigadaPage;