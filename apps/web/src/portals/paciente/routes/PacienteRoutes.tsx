import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Construction } from 'lucide-react';

import { DashboardLayout } from '../pages/dashboard/DashboardLayout';
import { ResumenPacientePage } from '../pages/dashboard/resumen/ResumenPacientePage';
import { ActividadPacientePage as ActividadPacienteView } from '../pages/dashboard/actividad/ActividadPacientePage';

// COMPONENTE TEMPORAL PARA VISTAS EN DESARROLLO
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="p-8 rounded-3xl bg-white/80 border border-medicos-soft-border/60 shadow-xs backdrop-blur-xl flex flex-col items-center justify-center text-center min-h-87.5 space-y-4 animate-in fade-in duration-300">
    <div className="w-14 h-14 rounded-2xl bg-medicos-light-bg text-medicos-teal flex items-center justify-center">
      <Construction className="w-7 h-7" />
    </div>
    <div className="space-y-1 max-w-sm">
      <h2 className="text-lg font-black text-medicos-dark-blue">{title}</h2>
      <p className="text-xs text-medicos-muted leading-relaxed">
        Esta sección está actualmente en desarrollo dentro del portal del paciente.
      </p>
    </div>
  </div>
);

// STUBS DE PÁGINAS PENDIENTES
export const MisCitasPage = () => <PlaceholderPage title="Mis Citas Programadas" />;
export const AgendarCitaPage = () => <PlaceholderPage title="Agendar Nueva Cita" />;
export const TelemedicinaPage = () => <PlaceholderPage title="Consultas de Telemedicina" />;
export const HistorialConsultasPage = () => <PlaceholderPage title="Historial de Consultas" />;
export const DiagnosticosPage = () => <PlaceholderPage title="Diagnósticos Médicos" />;
export const AlergiasAntecedentesPage = () => <PlaceholderPage title="Alergias y Antecedentes" />;
export const VacunasPage = () => <PlaceholderPage title="Esquema de Vacunación" />;
export const RecetasActivasPage = () => <PlaceholderPage title="Recetas y Medicamentos Activos" />;
export const RecordatoriosTomasPage = () => <PlaceholderPage title="Recordatorios de Toma" />;
export const HistorialMedicamentosPage = () => <PlaceholderPage title="Historial de Medicamentos" />;
export const ResultadosLaboratorioPage = () => <PlaceholderPage title="Resultados de Laboratorio" />;
export const EstudiosImagenPage = () => <PlaceholderPage title="Estudios e Imágenes Médicas" />;
export const SignosVitalesPage = () => <PlaceholderPage title="Monitoreo de Signos Vitales" />;
export const EstiloVidaPage = () => <PlaceholderPage title="Hábitos y Estilo de Vida" />;
export const AsistenteSaludIAPage = () => <PlaceholderPage title="Asistente de Salud IA" />;
export const ConsejosPersonalizadosPage = () => <PlaceholderPage title="Consejos Personalizados" />;
export const ArticulosEducativosPage = () => <PlaceholderPage title="Artículos Educativos" />;
export const ControlEmbarazoPage = () => <PlaceholderPage title="Control de Embarazo" />;
export const CitasPrenatalesPage = () => <PlaceholderPage title="Citas Prenatales" />;
export const DiarioSintomasPage = () => <PlaceholderPage title="Diario de Síntomas" />;
export const ConstanciasMedicasPage = () => <PlaceholderPage title="Constancias Médicas" />;
export const DescargaExpedientePage = () => <PlaceholderPage title="Descarga de Expediente" />;
export const CentroNotificacionesPage = () => <PlaceholderPage title="Centro de Notificaciones" />;
export const MensajesMedicoPage = () => <PlaceholderPage title="Mensajes con el Médico" />;
export const DatosPersonalesPage = () => <PlaceholderPage title="Datos Personales" />;
export const ContactosEmergenciaPage = () => <PlaceholderPage title="Contactos de Emergencia" />;
export const PreferenciasPacientePage = () => <PlaceholderPage title="Preferencias del Sistema" />;
export const SeguridadPacientePage = () => <PlaceholderPage title="Configuración de Seguridad" />;

export const PacienteRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<DashboardLayout />}>
        <Route index element={<Navigate to="resumen" replace />} />
        <Route path="resumen" element={<ResumenPacientePage />} />
        <Route path="actividad" element={<ActividadPacienteView />} />
      </Route>

      <Route path="citas">
        <Route index element={<Navigate to="mis-citas" replace />} />
        <Route path="mis-citas" element={<MisCitasPage />} />
        <Route path="agendar" element={<AgendarCitaPage />} />
        <Route path="telemedicina" element={<TelemedicinaPage />} />
      </Route>

      <Route path="expediente">
        <Route index element={<Navigate to="consultas" replace />} />
        <Route path="consultas" element={<HistorialConsultasPage />} />
        <Route path="diagnosticos" element={<DiagnosticosPage />} />
        <Route path="alergias-antecedentes" element={<AlergiasAntecedentesPage />} />
        <Route path="vacunas" element={<VacunasPage />} />
      </Route>

      <Route path="tratamientos">
        <Route index element={<Navigate to="recetas-activas" replace />} />
        <Route path="recetas-activas" element={<RecetasActivasPage />} />
        <Route path="recordatorios" element={<RecordatoriosTomasPage />} />
        <Route path="historial-medicamentos" element={<HistorialMedicamentosPage />} />
      </Route>

      <Route path="estudios">
        <Route index element={<Navigate to="resultados-laboratorio" replace />} />
        <Route path="resultados-laboratorio" element={<ResultadosLaboratorioPage />} />
        <Route path="estudios-imagen" element={<EstudiosImagenPage />} />
      </Route>

      <Route path="monitoreo">
        <Route index element={<Navigate to="signos-vitales" replace />} />
        <Route path="signos-vitales" element={<SignosVitalesPage />} />
        <Route path="habitos-estilo-vida" element={<EstiloVidaPage />} />
      </Route>

      <Route path="educacion-ia">
        <Route index element={<Navigate to="asistente" replace />} />
        <Route path="asistente" element={<AsistenteSaludIAPage />} />
        <Route path="consejos-personalizados" element={<ConsejosPersonalizadosPage />} />
        <Route path="articulos" element={<ArticulosEducativosPage />} />
      </Route>

      <Route path="salud-materna">
        <Route index element={<Navigate to="control-embarazo" replace />} />
        <Route path="control-embarazo" element={<ControlEmbarazoPage />} />
        <Route path="citas-prenatales" element={<CitasPrenatalesPage />} />
        <Route path="diario-sintomas" element={<DiarioSintomasPage />} />
      </Route>

      <Route path="documentos">
        <Route index element={<Navigate to="constancias" replace />} />
        <Route path="constancias" element={<ConstanciasMedicasPage />} />
        <Route path="descarga-expediente" element={<DescargaExpedientePage />} />
      </Route>

      <Route path="notificaciones">
        <Route index element={<Navigate to="centro" replace />} />
        <Route path="centro" element={<CentroNotificacionesPage />} />
        <Route path="mensajes-medico" element={<MensajesMedicoPage />} />
      </Route>

      <Route path="perfil">
        <Route index element={<Navigate to="datos-personales" replace />} />
        <Route path="datos-personales" element={<DatosPersonalesPage />} />
        <Route path="contactos-emergencia" element={<ContactosEmergenciaPage />} />
        <Route path="preferencias" element={<PreferenciasPacientePage />} />
        <Route path="seguridad" element={<SeguridadPacientePage />} />
      </Route>

      <Route path="*" element={<Navigate to="dashboard/resumen" replace />} />
    </Routes>
  );
};

export default PacienteRoutes;