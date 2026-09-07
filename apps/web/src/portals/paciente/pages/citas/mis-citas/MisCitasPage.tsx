// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/citas/mis-citas/MisCitasPage.tsx
// DESCRIPCIÓN: Orquestador del centro de agenda personal del paciente.
//              Sin duplicidad de tarjeta próxima, filtros corregidos y
//              consumo exclusivo de la capa de dominio sin fetch manual.
// =========================================================================

import React, { useState, useMemo } from 'react';
import {
  usePatientAppointments,
  type Appointment,
  type AppointmentFilterTab,
  DetalleCitaModal,
  CancelarCitaModal,
  ReprogramarCitaModal,
} from '../../../../../modules/appointments/index.js';
import {
  MisCitasHeader,
  CitasFilters,
  ProximaCitaCard,
  CitaCard,
  MisCitasLoading,
  MisCitasEmpty,
  MisCitasError,
} from './components/index.js';

export const MisCitasPage: React.FC = () => {
  const { appointments, loading, error, refetch } = usePatientAppointments();

  const [currentTab, setCurrentTab] = useState<AppointmentFilterTab>('PROXIMAS');

  const [selectedForDetail, setSelectedForDetail] = useState<Appointment | null>(null);
  const [selectedForCancel, setSelectedForCancel] = useState<Appointment | null>(null);
  const [selectedForReschedule, setSelectedForReschedule] = useState<Appointment | null>(null);

  // Timestamp de referencia estable por render
  const now = useMemo(() => new Date().getTime(), []);

  // Cálculo de conteos por pestaña
  const counts = useMemo(() => {
    let proximas = 0;
    let pasadas = 0;
    let canceladas = 0;

    appointments.forEach((app) => {
      const appTime = new Date(app.appointmentDate).getTime();
      if (app.status === 'CANCELLED') {
        canceladas++;
      } else if (appTime >= now && app.status !== 'COMPLETED') {
        proximas++;
      } else {
        pasadas++;
      }
    });

    return {
      proximas,
      pasadas,
      canceladas,
      todas: appointments.length,
    };
  }, [appointments, now]);

  // Cita más próxima activa
  const proximaCita = useMemo(() => {
    const validas = appointments.filter((app) => {
      const appTime = new Date(app.appointmentDate).getTime();
      return appTime >= now && app.status !== 'CANCELLED' && app.status !== 'COMPLETED';
    });
    if (validas.length === 0) return null;
    return [...validas].sort(
      (a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
    )[0];
  }, [appointments, now]);

  // Listado filtrado con exclusión de duplicado si la próxima cita está destacada arriba
  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => {
      const appTime = new Date(app.appointmentDate).getTime();

      if (currentTab === 'PROXIMAS') {
        const esProxima = appTime >= now && app.status !== 'CANCELLED' && app.status !== 'COMPLETED';
        // Si ya está destacada arriba en ProximaCitaCard, se excluye del listado inferior
        if (proximaCita && app.id === proximaCita.id) {
          return false;
        }
        return esProxima;
      }

      if (currentTab === 'PASADAS') {
        return (appTime < now || app.status === 'COMPLETED') && app.status !== 'CANCELLED';
      }

      if (currentTab === 'CANCELADAS') {
        return app.status === 'CANCELLED';
      }

      // Tab 'TODAS'
      return true;
    });
  }, [appointments, currentTab, now, proximaCita]);

  if (loading) {
    return (
      <div className="w-full max-w-[1700px] mx-auto p-3 sm:p-4 space-y-3.5">
        <MisCitasHeader />
        <MisCitasLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1700px] mx-auto p-3 sm:p-4 space-y-3.5">
        <MisCitasHeader />
        <MisCitasError message={error} onRetry={refetch} />
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="w-full max-w-[1700px] mx-auto p-3 sm:p-4 space-y-3.5">
        <MisCitasHeader />
        <MisCitasEmpty />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1700px] mx-auto p-3 sm:p-4 space-y-3.5 animate-in fade-in duration-200">
      {/* Cabecera institucional con diseño idéntico a Agendar Cita */}
      <MisCitasHeader />

      {/* Control segmentado de filtros estilo Apple iOS */}
      <CitasFilters currentTab={currentTab} onTabChange={setCurrentTab} counts={counts} />

      {/* TARJETA DESTACADA: Cita más cercana (Solo en pestaña Próximas o Todas) */}
      {(currentTab === 'PROXIMAS' || currentTab === 'TODAS') && proximaCita && (
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase tracking-wider text-[#2B7A78] flex items-center gap-1.5 px-1">
            <span className="w-2 h-2 rounded-full bg-[#2B7A78]" />
            Cita Más Próxima
          </h2>
          <ProximaCitaCard
            appointment={proximaCita}
            onViewDetail={setSelectedForDetail}
            onReschedule={setSelectedForReschedule}
            onCancel={setSelectedForCancel}
          />
        </div>
      )}

      {/* LISTADO DE CITAS FILTRADAS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
            {currentTab === 'PROXIMAS'
              ? 'Otras Citas Programadas'
              : currentTab === 'PASADAS'
              ? 'Historial de Consultas Atendidas'
              : currentTab === 'CANCELADAS'
              ? 'Citas Canceladas'
              : 'Todas las Citas Registradas'}
          </h3>
          <span className="text-[11px] font-semibold text-slate-500 tabular-nums">
            {filteredAppointments.length} cita(s)
          </span>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center text-xs text-slate-500 shadow-2xs space-y-1">
            <p className="font-semibold text-slate-700">No hay citas en esta categoría</p>
            <p className="text-[11px] text-slate-400">
              {currentTab === 'PROXIMAS' && proximaCita
                ? 'No tienes citas adicionales por el momento.'
                : 'Usa el botón superior para agendar una nueva cita médica.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredAppointments.map((app) => (
              <CitaCard key={app.id} appointment={app} onViewDetail={setSelectedForDetail} />
            ))}
          </div>
        )}
      </div>

      {/* MODALES DE DOMINIO REUTILIZABLES (modules/appointments) */}
      <DetalleCitaModal
        appointment={selectedForDetail}
        onClose={() => setSelectedForDetail(null)}
        onReschedule={setSelectedForReschedule}
        onCancel={setSelectedForCancel}
      />

      <CancelarCitaModal
        appointment={selectedForCancel}
        onClose={() => setSelectedForCancel(null)}
        onSuccess={refetch}
      />

      <ReprogramarCitaModal
        appointment={selectedForReschedule}
        onClose={() => setSelectedForReschedule(null)}
        onSuccess={refetch}
      />
    </div>
  );
};

export default MisCitasPage;