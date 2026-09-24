// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/routes/PacienteRoutes.tsx
// DESCRIPCIÓN: Enrutador del Portal Paciente con Centro de Notificaciones,
//              Mensajes con el Médico, Datos Personales, Contactos de Emergencia,
//              Preferencias y Seguridad oficial del sistema.
// =========================================================================

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Construction } from 'lucide-react';

import { DashboardLayout } from '../pages/dashboard/DashboardLayout.js';
import { ResumenPacientePage } from '../pages/dashboard/resumen/ResumenPacientePage.js';
import { ActividadPacientePage as ActividadPacienteView } from '../pages/dashboard/actividad/ActividadPacientePage.js';

// PÁGINAS REALES IMPLEMENTADAS
import { AgendarCitaPage } from '../pages/citas/agendar/AgendarCitaPage.js';
import { MisCitasPage } from '../pages/citas/mis-citas/MisCitasPage.js';
import { HistorialConsultasPage } from '../pages/expediente/consultas/HistorialConsultasPage.js';
import { DiagnosticosPage } from '../pages/expediente/diagnosticos/DiagnosticosPage.js';
import { AlergiasAntecedentesPage } from '../pages/expediente/alergias-antecedentes/AlergiasAntecedentesPage.js';
import { VacunasPage } from '../pages/expediente/vacunas/VacunasPage.js';
import { RecetasActivasPage } from '../pages/tratamientos/recetas-activas/RecetasActivasPage.js';
import { RecordatoriosTomasPage } from '../pages/tratamientos/recordatorios/RecordatoriosTomasPage.js';
import { HistorialMedicamentosPage } from '../pages/tratamientos/historial-medicamentos/HistorialMedicamentosPage.js';
import { ResultadosLaboratorioPage } from '../pages/estudios/resultados-laboratorio/ResultadosLaboratorioPage.js';
import { EstudiosImagenPage } from '../pages/estudios/estudios-imagen/EstudiosImagenPage.js';
import { SignosVitalesPage } from '../pages/monitoreo/signos-vitales/SignosVitalesPage.js';
import { EstiloVidaPage } from '../pages/monitoreo/habitos-estilo-vida/EstiloVidaPage.js';
import { AsistenteSaludIAPage } from '../pages/educacion-ia/asistente/AsistenteSaludIAPage.js';
import { ConsejosPersonalizadosPage } from '../pages/educacion-ia/consejos-personalizados/ConsejosPersonalizadosPage.js';
import { ArticulosEducativosPage } from '../pages/educacion-ia/articulos/ArticulosEducativosPage.js';
import { ControlEmbarazoPage } from '../pages/salud-materna/control-embarazo/ControlEmbarazoPage.js';
import { CitasPrenatalesPage } from '../pages/salud-materna/citas-prenatales/CitasPrenatalesPage.js';
import { DiarioSintomasPage } from '../pages/salud-materna/diario-sintomas/DiarioSintomasPage.js';
import { ConstanciasMedicasPage } from '../pages/documentos/constancias/ConstanciasMedicasPage.js';
import { DescargaExpedientePage } from '../pages/documentos/descarga-expediente/DescargaExpedientePage.js';

// PÁGINAS OFICIALES DE NOTIFICACIONES
import { CentroNotificacionesPage } from '../pages/notificaciones/centro/CentroNotificacionesPage.js';
import { MensajesMedicoPage } from '../pages/notificaciones/mensajes-medico/MensajesMedicoPage.js';

// PÁGINAS OFICIALES DE PERFIL Y SEGURIDAD
import { DatosPersonalesPage } from '../pages/perfil/datos-personales/DatosPersonalesPage.js';
import { ContactosEmergenciaPage } from '../pages/perfil/contactos-emergencia/ContactosEmergenciaPage.js';
import { PreferenciasPacientePage } from '../pages/perfil/preferencias/PreferenciasPacientePage.js';
import { SeguridadPacientePage } from '../pages/perfil/seguridad/SeguridadPacientePage.js';

// COMPONENTE TEMPORAL PARA VISTAS EN DESARROLLO PENDIENTES
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="p-8 rounded-3xl bg-white/80 border border-slate-200/60 shadow-xs backdrop-blur-xl flex flex-col items-center justify-center text-center min-h-87.5 space-y-4 animate-in fade-in duration-300">
    <div className="w-14 h-14 rounded-2xl bg-teal-50 text-medicos-teal flex items-center justify-center">
      <Construction className="w-7 h-7" />
    </div>
    <div className="space-y-1 max-w-sm">
      <h2 className="text-lg font-black text-slate-900">{title}</h2>
      <p className="text-xs text-slate-500 leading-relaxed">
        Esta sección está actualmente en desarrollo dentro del portal del paciente.
      </p>
    </div>
  </div>
);

// STUBS DE PÁGINAS PENDIENTES RESTANTES
export const TelemedicinaPage = () => <PlaceholderPage title="Consultas de Telemedicina" />;

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