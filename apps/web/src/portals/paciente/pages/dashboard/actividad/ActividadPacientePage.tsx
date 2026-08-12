import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/core/context/AuthContextInstance';
import { apiClient } from '@/shared/lib/apiClient';
import { type PatientHistoryResponse, type ConsultationRecord, type VitalSignsRecord } from '@/modules/patients/types/patient.types';

import EncabezadoActividad from './components/EncabezadoActividad';
import FiltrosActividad, { type FiltrosState } from './components/FiltrosActividad';
import ActividadReciente from './components/ActividadReciente';
import { type ElementoActividad } from './components/ActividadItem';
import DetalleActividad from './components/DetalleActividad';
import EstadoActividad from './components/EstadoActividad';

const filtroInicial: FiltrosState = {
  tipo: 'todas',
  fechaDesde: '',
  fechaHasta: '',
  busqueda: '',
};

export const ActividadPacientePage: React.FC = () => {
  const { user } = useAuth();
  const [actividades, setActividades] = useState<ElementoActividad[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosState>(filtroInicial);
  const [actividadSeleccionada, setActividadSeleccionada] = useState<ElementoActividad | null>(null);
  const [reloadToken, setReloadToken] = useState<number>(0);

  const handleReintentar = useCallback(() => {
    setCargando(true);
    setError(null);
    setReloadToken((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (!user?.id) {
      return;
    }

    apiClient<PatientHistoryResponse>(`/patients/${user.id}/historial`)
      .then((res: PatientHistoryResponse) => {
        if (!isMounted) return;
        if (res.success && res.data) {
          const listaConsultas: ElementoActividad[] = (res.data.consultations || []).map((c: ConsultationRecord) => ({
            id: `consulta-${c.id}`,
            tipo: c.status === 'CANCELLED' ? 'cita' : 'consulta',
            titulo: c.diagnosisDesc ? `Consulta: ${c.diagnosisDesc}` : 'Consulta médica',
            descripcion: c.chiefComplaint || 'Atención médica registrada',
            fechaISO: c.consultationDate || c.createdAt,
            estado: c.status,
            profesional: c.doctor ? `Dr. ${c.doctor.firstName} ${c.doctor.lastName}` : undefined,
            establecimiento: c.brigade ? `${c.brigade.name} (${c.brigade.municipality})` : undefined,
            datosOriginales: c,
          }));

          const listaVitales: ElementoActividad[] = (res.data.standaloneVitalSigns || []).map((v: VitalSignsRecord) => ({
            id: `vital-${v.id}`,
            tipo: 'vitales',
            titulo: 'Registro de signos vitales',
            descripcion: `Presión: ${v.systolic}/${v.diastolic} mmHg | Pulso: ${v.heartRate} bpm | Temp: ${v.temperature}°C`,
            fechaISO: v.createdAt,
            estado: 'COMPLETADO',
            datosOriginales: v,
          }));

          const unificadas = [...listaConsultas, ...listaVitales].sort((a, b) => {
            return new Date(b.fechaISO).getTime() - new Date(a.fechaISO).getTime();
          });

          setActividades(unificadas);
          setError(null);
        } else {
          setActividades([]);
        }
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        console.error('Error al cargar la actividad del paciente:', err);
        setError('No fue posible conectar con el servidor de historial médico.');
      })
      .finally(() => {
        if (isMounted) {
          setCargando(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user, reloadToken]);

  const actividadesFiltradas = useMemo(() => {
    return actividades.filter((act) => {
      if (filtros.tipo === 'consultas' && act.tipo !== 'consulta') return false;
      if (filtros.tipo === 'citas' && act.tipo !== 'cita') return false;
      if (filtros.tipo === 'vitales' && act.tipo !== 'vitales') return false;

      if (filtros.fechaDesde) {
        const fechaAct = new Date(act.fechaISO);
        const fechaDesde = new Date(filtros.fechaDesde);
        if (fechaAct < fechaDesde) return false;
      }

      if (filtros.fechaHasta) {
        const fechaAct = new Date(act.fechaISO);
        const fechaHasta = new Date(filtros.fechaHasta);
        fechaHasta.setHours(23, 59, 59, 999);
        if (fechaAct > fechaHasta) return false;
      }

      if (filtros.busqueda.trim() !== '') {
        const q = filtros.busqueda.toLowerCase();
        const coincideTitulo = act.titulo.toLowerCase().includes(q);
        const coincideDesc = act.descripcion.toLowerCase().includes(q);
        const coincideProf = act.profesional?.toLowerCase().includes(q) ?? false;
        const coincideEst = act.establecimiento?.toLowerCase().includes(q) ?? false;

        if (!coincideTitulo && !coincideDesc && !coincideProf && !coincideEst) {
          return false;
        }
      }

      return true;
    });
  }, [actividades, filtros]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 pb-12">
      <EncabezadoActividad totalActividades={actividadesFiltradas.length} />

      <FiltrosActividad
        filtros={filtros}
        onChange={setFiltros}
        onLimpiar={() => setFiltros(filtroInicial)}
      />

      {cargando && <EstadoActividad tipo="cargando" />}

      {error && !cargando && (
        <EstadoActividad tipo="error" mensajeError={error} onReintentar={handleReintentar} />
      )}

      {!cargando && !error && actividades.length === 0 && <EstadoActividad tipo="vacio" />}

      {!cargando && !error && actividades.length > 0 && actividadesFiltradas.length === 0 && (
        <EstadoActividad tipo="sin_resultados" />
      )}

      {!cargando && !error && actividadesFiltradas.length > 0 && (
        <ActividadReciente
          actividades={actividadesFiltradas}
          onVerDetalle={(item) => setActividadSeleccionada(item)}
        />
      )}

      <DetalleActividad
        item={actividadSeleccionada}
        onCerrar={() => setActividadSeleccionada(null)}
      />
    </div>
  );
};

export default ActividadPacientePage;