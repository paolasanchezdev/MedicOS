// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/citas-prenatales/CitasPrenatalesPage.tsx
// DESCRIPCIÓN: Orquestador de agenda obstétrica. Filtro Próximas corregido
//              para mostrar la cita agendada en la lista sin estados vacíos falsos.
// =========================================================================

import React, { useState, useMemo } from 'react';
import {
  usePatientAppointments,
  type Appointment,
  type AppointmentFilterTab,
  CancelarCitaModal,
  ReprogramarCitaModal,
} from '../../../../../modules/appointments/index.js';
import { usePregnancyControl } from '../../../../../modules/maternal-health/hooks/usePregnancyControl.js';
import {
  CitasPrenatalesHeader,
  ProximaCitaPrenatalCard,
  PreparacionCitaCard,
  CitaPrenatalCard,
  CitasPrenatalesFilters,
  CitasPrenatalesEmpty,
  CitasPrenatalesLoading,
  CitasPrenatalesError,
  DetalleCitaPrenatalModal,
  type PrenatalAppointmentItem,
} from './components/index.js';

export const CitasPrenatalesPage: React.FC = () => {
  const {
    appointments,
    loading: loadingApps,
    error: errorApps,
    refetch: refetchApps,
  } = usePatientAppointments();

  const {
    data: pregnancyData,
    loading: loadingPregnancy,
    error: errorPregnancy,
    refetch: refetchPregnancy,
  } = usePregnancyControl();

  const [currentTab, setCurrentTab] = useState<AppointmentFilterTab>('PROXIMAS');
  const [selectedForDetail, setSelectedForDetail] = useState<PrenatalAppointmentItem | null>(null);
  const [selectedForCancel, setSelectedForCancel] = useState<Appointment | null>(null);
  const [selectedForReschedule, setSelectedForReschedule] = useState<Appointment | null>(null);

  const now = useMemo(() => new Date().getTime(), []);

  // 1. Citas programadas de la agenda con filtro obstétrico estricto
  const scheduledPrenatalAppointments = useMemo<PrenatalAppointmentItem[]>(() => {
    return appointments
      .filter((app) => {
        const reason = (app.reason || '').toLowerCase();
        return (
          reason.includes('prenatal') ||
          reason.includes('embarazo') ||
          reason.includes('obstét') ||
          reason.includes('obstet') ||
          reason.includes('matern') ||
          reason.includes('parto') ||
          reason.includes('fetal') ||
          reason.includes('gestac')
        );
      })
      .map((app) => ({
        ...app,
        doctor: {
          ...app.doctor,
          specialty: app.doctor?.specialty || 'Ginecología y Obstetricia',
        },
      }));
  }, [appointments]);

  // 2. Controles prenatales atendidos del expediente
  const pastTimelineAppointments = useMemo<PrenatalAppointmentItem[]>(() => {
    if (!pregnancyData?.timeline) return [];

    return pregnancyData.timeline.map((control) => ({
      id: `control-${control.id}`,
      patientId: '',
      doctorId: '',
      appointmentDate: control.date,
      durationMinutes: 30,
      reason: control.clinicalNotes.includes('•')
        ? control.clinicalNotes.split('•')[0].trim()
        : `Control Prenatal (${control.gestationalAgeText})`,
      status: 'COMPLETED' as const,
      modality: 'PRESENTIAL' as const,
      createdAt: control.date,
      updatedAt: control.date,
      gestationalAgeText: control.gestationalAgeText,
      vitalSigns: {
        bloodPressure: control.bloodPressure,
        weightKg: control.weightKg,
        heartRate: control.heartRate,
      },
      clinicalNotes: control.clinicalNotes,
      observations: control.observations,
      doctor: {
        id: 'doc-mendoza',
        firstName: control.doctorName.replace(/^Dr\.\s*/i, ''),
        lastName: '',
        email: '',
        specialty: 'Ginecología y Obstetricia',
      },
      establishment: {
        id: 'est-minsal',
        name: 'Unidad Comunitaria de Salud Familiar',
      },
    }));
  }, [pregnancyData]);

  // 3. Consolidación sin duplicados
  const allPrenatalAppointments = useMemo<PrenatalAppointmentItem[]>(() => {
    const combined = [...scheduledPrenatalAppointments];

    pastTimelineAppointments.forEach((pastApp) => {
      const alreadyExists = combined.some((item) => {
        const itemDate = new Date(item.appointmentDate).toDateString();
        const pastDate = new Date(pastApp.appointmentDate).toDateString();
        return itemDate === pastDate;
      });

      if (!alreadyExists) {
        combined.push(pastApp);
      }
    });

    return combined.sort(
      (a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
    );
  }, [scheduledPrenatalAppointments, pastTimelineAppointments]);

  // 4. Conteos de pestañas
  const counts = useMemo(() => {
    let proximas = 0;
    let pasadas = 0;
    let canceladas = 0;

    allPrenatalAppointments.forEach((app) => {
      const appTime = new Date(app.appointmentDate).getTime();
      if (app.status === 'CANCELLED') {
        canceladas++;
      } else if (app.status === 'COMPLETED' || appTime < now) {
        pasadas++;
      } else {
        proximas++;
      }
    });

    return {
      proximas,
      pasadas,
      canceladas,
      todas: allPrenatalAppointments.length,
    };
  }, [allPrenatalAppointments, now]);

  // 5. Próxima Cita Prenatal más cercana
  const proximaCita = useMemo(() => {
    const validas = allPrenatalAppointments.filter((app) => {
      const appTime = new Date(app.appointmentDate).getTime();
      return appTime >= now && app.status !== 'CANCELLED' && app.status !== 'COMPLETED';
    });
    if (validas.length === 0) return null;

    return [...validas].sort(
      (a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
    )[0];
  }, [allPrenatalAppointments, now]);

  // 6. Semana estimada para la próxima cita
  const estimatedWeekForNext = useMemo(() => {
    if (!proximaCita || !pregnancyData?.pregnancy) return null;
    const { gestationalWeeks, gestationalDays } = pregnancyData.pregnancy;
    const diffDays = Math.max(
      0,
      Math.floor((new Date(proximaCita.appointmentDate).getTime() - now) / (1000 * 60 * 60 * 24))
    );
    const totalDays = gestationalWeeks * 7 + gestationalDays + diffDays;
    const week = Math.floor(totalDays / 7);
    const day = totalDays % 7;
    return `Semana ${week} + ${day} días`;
  }, [proximaCita, pregnancyData, now]);

  // 7. Lista filtrada para la sección inferior (sin exclusiones forzadas que vacíen la pestaña)
  const filteredList = useMemo(() => {
    return allPrenatalAppointments.filter((app) => {
      const appTime = new Date(app.appointmentDate).getTime();

      if (currentTab === 'PROXIMAS') {
        return appTime >= now && app.status !== 'CANCELLED' && app.status !== 'COMPLETED';
      }

      if (currentTab === 'PASADAS') {
        return app.status === 'COMPLETED' || (appTime < now && app.status !== 'CANCELLED');
      }

      if (currentTab === 'CANCELADAS') {
        return app.status === 'CANCELLED';
      }

      return true;
    });
  }, [allPrenatalAppointments, currentTab, now]);

  const handleRefreshAll = () => {
    refetchApps();
    refetchPregnancy();
  };

  if (loadingApps || loadingPregnancy) {
    return (
      <div className="w-full max-w-[1700px] mx-auto p-3 sm:p-4 space-y-4">
        <CitasPrenatalesHeader
          patientName={pregnancyData?.patientName}
          onRefresh={handleRefreshAll}
          isLoading={true}
          hasActivePregnancy={pregnancyData?.hasActivePregnancy}
        />
        <CitasPrenatalesLoading />
      </div>
    );
  }

  if (errorApps && errorPregnancy) {
    return (
      <div className="w-full max-w-[1700px] mx-auto p-3 sm:p-4 space-y-4">
        <CitasPrenatalesHeader
          patientName={pregnancyData?.patientName}
          onRefresh={handleRefreshAll}
          isLoading={false}
          hasActivePregnancy={pregnancyData?.hasActivePregnancy}
        />
        <CitasPrenatalesError message={errorApps || errorPregnancy} onRetry={handleRefreshAll} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1700px] mx-auto p-3 sm:p-4 space-y-4 select-none animate-in fade-in duration-200">
      {/* 1. ENCABEZADO INSTITUCIONAL VERDE */}
      <CitasPrenatalesHeader
        patientName={pregnancyData?.patientName}
        onRefresh={handleRefreshAll}
        isLoading={loadingApps || loadingPregnancy}
        hasActivePregnancy={pregnancyData?.hasActivePregnancy}
      />

      {allPrenatalAppointments.length === 0 ? (
        <CitasPrenatalesEmpty />
      ) : (
        <div className="space-y-4">
          {/* 2. TARJETA DESTACADA: PRÓXIMA CITA EN AGENDA */}
          {proximaCita && (currentTab === 'PROXIMAS' || currentTab === 'TODAS') && (
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-[#2B7A78] flex items-center gap-1.5 px-1">
                <span className="w-2 h-2 rounded-full bg-[#2B7A78]" />
                Próximo Control en Agenda
              </h2>
              <ProximaCitaPrenatalCard
                appointment={proximaCita}
                gestationalAgeText={estimatedWeekForNext}
                onViewDetail={setSelectedForDetail}
                onReschedule={setSelectedForReschedule}
                onCancel={setSelectedForCancel}
              />
            </div>
          )}

          {/* 3. GUÍA COMPACTA DE PREPARACIÓN */}
          <PreparacionCitaCard />

          {/* 4. FILTROS SEGMENTADOS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <CitasPrenatalesFilters
              currentTab={currentTab}
              onTabChange={setCurrentTab}
              counts={counts}
            />

            <span className="text-xs font-semibold text-slate-500 tabular-nums">
              Mostrando {filteredList.length} de {counts.todas} cita(s)
            </span>
          </div>

          {/* 5. LISTADO DE CITAS OBSTÉTRICAS LIGERAS */}
          <div className="space-y-2">
            {filteredList.length === 0 ? (
              <CitasPrenatalesEmpty isFiltered={true} />
            ) : (
              filteredList.map((app) => (
                <CitaPrenatalCard
                  key={app.id}
                  appointment={app}
                  onViewDetail={setSelectedForDetail}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* 6. MODAL CLÍNICO CON TODOS LOS DETALLES */}
      <DetalleCitaPrenatalModal
        appointment={selectedForDetail}
        onClose={() => setSelectedForDetail(null)}
        onReschedule={setSelectedForReschedule}
        onCancel={setSelectedForCancel}
      />

      <CancelarCitaModal
        appointment={selectedForCancel}
        onClose={() => setSelectedForCancel(null)}
        onSuccess={handleRefreshAll}
      />

      <ReprogramarCitaModal
        appointment={selectedForReschedule}
        onClose={() => setSelectedForReschedule(null)}
        onSuccess={handleRefreshAll}
      />
    </div>
  );
};

export default CitasPrenatalesPage;