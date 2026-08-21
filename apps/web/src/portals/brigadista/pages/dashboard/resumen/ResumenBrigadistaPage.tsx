// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/resumen/ResumenBrigadistaPage.tsx
// =========================================================================

import React, { useEffect, useState, useContext, useCallback } from 'react';
import { AuthContext } from '../../../../../core/context/AuthContextInstance';
import { apiClient } from '../../../../../shared/lib/apiClient';

import { TarjetaBienvenidaBrigadista } from './components/TarjetaBienvenidaBrigadista';
import { AccionesRapidas } from './components/AccionesRapidas';
import { ConsultasHoyCard } from './components/ConsultasHoyCard';
import { PacientesAtendidosCard } from './components/PacientesAtendidosCard';
import { PacientesPendientesCard } from './components/PacientesPendientesCard';
import { AlertasClinicasCard } from './components/AlertasClinicasCard';
import type { AlertaClinicaItem } from './components/AlertasClinicasCard';
import { ProximaAccionCard } from './components/ProximaAccionCard';
import type { ProximaAccionData } from './components/ProximaAccionCard';
import { UltimoPacienteCard } from './components/UltimoPacienteCard';
import type { UltimoPacienteData } from './components/UltimoPacienteCard';
import { EstadoJornadaCard } from './components/EstadoJornadaCard';
import { SincronizacionCard } from './components/SincronizacionCard';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface DashboardData {
  resumenTriajes?: {
    total: number;
    completados: number;
    pendientes: number;
    alertas: number;
    enProceso?: number;
  };
  proximoPaciente?: ProximaAccionData | null;
  alertasClinicasData?: {
    totalAlertas: number;
    altaPrioridadCount: number;
    seguimientoCount: number;
    alertas: AlertaClinicaItem[];
  };
  ultimoPaciente?: UltimoPacienteData | null;
  estadoJornada?: {
    jornadaActiva: boolean;
    nombreBrigada: string;
    ubicacion?: string;
    horaInicio?: string;
    totalPacientesAtendidos: number;
  };
  sincronizacion?: {
    isOnline: boolean;
    pendientesCount: number;
    ultimaSincroFormatted?: string;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const ResumenBrigadistaPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const [summary, setSummary] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchSummary = async (): Promise<DashboardData> => {
    const response = await apiClient<ApiResponse<DashboardData>>('/brigades/dashboard/resumen', {
      method: 'GET',
    });
    return response.data;
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const data = await fetchSummary();
      setSummary(data);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'No fue posible cargar el resumen operativo del brigadista.';
      setError(errorMessage);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const loadSummary = async () => {
      try {
        const data = await fetchSummary();
        if (isSubscribed) {
          setSummary(data);
          setError(null);
        }
      } catch (err: unknown) {
        if (isSubscribed) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : 'No fue posible cargar el resumen operativo del brigadista.';
          setError(errorMessage);
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

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6 animate-pulse max-w-[1600px] mx-auto">
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

  if (error || !summary) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center my-12 bg-white rounded-2xl border border-rose-200 shadow-sm">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Error de carga</h2>
        <p className="text-sm text-slate-600 mt-1 mb-6">
          {error || 'Información no disponible.'}
        </p>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reintentar</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6 max-w-[1600px] mx-auto">
      {/* 1. Tarjeta de Bienvenida */}
      <TarjetaBienvenidaBrigadista
        firstName={auth?.user?.firstName}
        lastName={auth?.user?.lastName}
        nombreBrigada={summary?.estadoJornada?.nombreBrigada || 'Brigada Médica'}
        ubicacion={summary?.estadoJornada?.ubicacion || 'Ubicación no especificada'}
        estadoJornada={
          summary?.estadoJornada?.jornadaActiva ? 'activa' : 'inactiva'
        }
        horaInicio={summary?.estadoJornada?.horaInicio}
        totalPacientesAtendidos={summary?.estadoJornada?.totalPacientesAtendidos ?? 0}
        totalPendientes={summary?.resumenTriajes?.pendientes ?? 0}
        onRefresh={handleRefresh}
        isRefreshing={refreshing}
      />

      {/* 2. Acciones Rápidas */}
      <AccionesRapidas
        onEscanearQR={() => {}}
        onRegistrarPaciente={() => {}}
        onBuscarPaciente={() => {}}
        onNuevaConsulta={() => {}}
        onVerMapa={() => {}}
      />

      {/* 3. Indicadores y Métricas KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ConsultasHoyCard
          totalConsultas={summary?.resumenTriajes?.total ?? 0}
          completadas={summary?.resumenTriajes?.completados ?? 0}
          pendientes={summary?.resumenTriajes?.pendientes ?? 0}
          enProceso={summary?.resumenTriajes?.enProceso ?? 0}
        />
        <PacientesAtendidosCard
          totalAtendidos={summary?.estadoJornada?.totalPacientesAtendidos ?? 0}
        />
        <PacientesPendientesCard
          totalPendientes={summary?.resumenTriajes?.pendientes ?? 0}
          evaluacionCount={summary?.resumenTriajes?.pendientes ?? 0}
          enConsultaCount={0}
          cierreCount={0}
          onVerPacientes={() => {}}
        />
        <AlertasClinicasCard
          totalAlertas={summary?.resumenTriajes?.alertas ?? 0}
          altaPrioridadCount={summary?.alertasClinicasData?.altaPrioridadCount ?? 0}
          seguimientoCount={summary?.alertasClinicasData?.seguimientoCount ?? 0}
          alertas={summary?.alertasClinicasData?.alertas ?? []}
          onVerAlertas={() => {}}
        />
      </div>

      {/* 4. Estado de Jornada (Mapa) y Sincronización */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EstadoJornadaCard
          jornadaActiva={summary?.estadoJornada?.jornadaActiva ?? false}
          nombreBrigada={summary?.estadoJornada?.nombreBrigada || 'Brigada Médica'}
          ubicacion={summary?.estadoJornada?.ubicacion}
          horaInicio={summary?.estadoJornada?.horaInicio}
          totalPacientesAtendidos={summary?.estadoJornada?.totalPacientesAtendidos ?? 0}
          onIniciarJornada={async () => {
            try {
              await apiClient('/brigades/jornada/iniciar', {
                method: 'POST',
                body: JSON.stringify({}),
              });
              await handleRefresh();
            } catch (err) {
              console.error('Error al iniciar jornada:', err);
            }
          }}
          onFinalizarJornada={async () => {
            try {
              await apiClient('/brigades/jornada/finalizar', {
                method: 'POST',
                body: JSON.stringify({}),
              });
              await handleRefresh();
            } catch (err) {
              console.error('Error al finalizar jornada:', err);
            }
          }}
        />
        <SincronizacionCard
          isOnline={summary?.sincronizacion?.isOnline ?? true}
          pendientesCount={summary?.sincronizacion?.pendientesCount ?? 0}
          ultimaSincroFormatted={summary?.sincronizacion?.ultimaSincroFormatted}
          onSincronizar={handleRefresh}
        />
      </div>

      {/* 5. Próxima Acción y Último Paciente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProximaAccionCard accion={summary?.proximoPaciente || null} />
        <UltimoPacienteCard
          paciente={summary?.ultimoPaciente || null}
          onVerExpediente={() => {}}
        />
      </div>
    </div>
  );
};

export default ResumenBrigadistaPage;