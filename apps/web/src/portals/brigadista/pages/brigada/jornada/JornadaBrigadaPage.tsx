// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/jornada/JornadaBrigadaPage.tsx
// DESCRIPCIÓN: Página orquestadora de la Jornada de Brigada conectada a la BD.
// =========================================================================

import React, { useEffect, useState, useCallback } from 'react';
import { apiClient } from '../../../../../shared/lib/apiClient';
import { JornadaHeader } from './components/JornadaHeader';
import { EstadoJornadaCard } from './components/EstadoJornadaCard';
import { MetricasJornada } from './components/MetricasJornada';
import { EquipoJornadaCard, type MiembroEquipoJornada } from './components/EquipoJornadaCard';
import { AccionesJornada } from './components/AccionesJornada';
import { ActividadJornada, type ActividadJornadaItem } from './components/ActividadJornada';
import { SincronizacionJornadaCard } from './components/SincronizacionJornadaCard';
import { CerrarJornadaDialog } from './components/CerrarJornadaDialog';
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

export const JornadaBrigadaPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [rawdata, setRawData] = useState<DashboardApiResponse['data'] | null>(null);
  const [isCerrarModalOpen, setIsCerrarModalOpen] = useState<boolean>(false);

  const fetchJornadaData = async (): Promise<DashboardApiResponse['data']> => {
    const response = await apiClient<DashboardApiResponse>('/brigades/dashboard/resumen', {
      method: 'GET',
    });
    return response.data;
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const res = await fetchJornadaData();
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
        const res = await fetchJornadaData();
        if (isSubscribed) {
          setRawData(res);
          setError(null);
        }
      } catch (err: unknown) {
        if (isSubscribed) {
          const msg = err instanceof Error ? err.message : 'No se pudo obtener información de la jornada.';
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

  const handlePausarJornada = async () => {
    try {
      await apiClient('/brigades/jornada/finalizar', { method: 'POST' });
      handleRefresh();
    } catch {
      alert('No se pudo actualizar el estado de la jornada.');
    }
  };

  const handleFinalizarJornada = async () => {
    try {
      await apiClient('/brigades/jornada/finalizar', { method: 'POST' });
      handleRefresh();
    } catch {
      alert('Error al finalizar la jornada.');
    }
  };

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-pulse max-w-[1700px] mx-auto">
        <div className="h-32 bg-medicos-soft-border/30 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="h-28 bg-medicos-soft-border/30 rounded-2xl" />
          <div className="h-28 bg-medicos-soft-border/30 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !rawdata) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center my-12 bg-medicos-surface rounded-2xl border border-medicos-soft-border shadow-xs">
        <div className="w-12 h-12 bg-medicos-canvas text-medicos-dark-blue rounded-2xl flex items-center justify-center mx-auto mb-3 border border-medicos-soft-border">
          <Database className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-medicos-dark-blue">Sin jornada activa registrada</h2>
        <p className="text-sm text-medicos-muted mt-1 mb-6">{error || 'No se encontró una sesión de trabajo activa en la estación local.'}</p>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-medicos-teal hover:bg-[#186a76] text-white text-sm font-semibold rounded-xl transition-colors shadow-xs cursor-pointer"
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

  const equipoSimulado: MiembroEquipoJornada[] = [
    { id: '1', nombre: 'Dra. María Martínez', rol: 'Médico Líder', estado: 'Activo' },
    { id: '2', nombre: 'Carlos Rivas', rol: 'Brigadista / Triage', estado: 'Activo' },
  ];

  const actividadesRecientes: ActividadJornadaItem[] = rawdata.triajesRecientes.map((t) => ({
    id: t.id,
    hora: t.fechaHora,
    descripcion: `Triage completado: ${t.paciente} (${t.detalles})`,
    tipo: 'TRIAGE',
  }));

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1700px] mx-auto animate-in fade-in duration-200">
      <JornadaHeader
        nombreBrigada={nombreBrigada}
        comunidad={comunidad}
        fecha={fechaActual}
        estado={estadoJornadaStr as 'ACTIVA' | 'EN_PAUSA' | 'FINALIZADA'}
        horaInicio={horaInicio}
        duracion={rawdata.estadoJornada.jornadaActiva ? 'En curso' : 'Finalizada'}
        onRefresh={handleRefresh}
        isRefreshing={refreshing}
      />

      <EstadoJornadaCard
        estado={estadoJornadaStr}
        horaInicio={horaInicio}
        duracion={rawdata.estadoJornada.jornadaActiva ? 'En curso' : 'Finalizada'}
        onPausar={handlePausarJornada}
        onFinalizar={() => setIsCerrarModalOpen(true)}
      />

      <MetricasJornada
        registrados={registradosTotal}
        triageRealizados={triageRealizados}
        pendientes={enEspera}
        derivados={0}
        atendidos={atendidos}
        sincronizarPendientes={enEspera}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AccionesJornada />
        <EquipoJornadaCard equipo={equipoSimulado} responsable="Dra. María Martínez" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActividadJornada actividades={actividadesRecientes} />
        <SincronizacionJornadaCard
          isOnline={true}
          pendientesCount={enEspera}
          ultimaSincro={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        />
      </div>

      <CerrarJornadaDialog
        isOpen={isCerrarModalOpen}
        onClose={() => setIsCerrarModalOpen(false)}
        onConfirm={handleFinalizarJornada}
        pendientesCount={enEspera}
        totalAtendidos={atendidos}
      />
    </div>
  );
};

export default JornadaBrigadaPage;