// apps/web/src/portals/patient/routes/PatientRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PatientLayout } from '../layout/PatientLayout';
import { PatientDashboardPage } from '../pages/dashboard/resumen/PatientDashboardPage';

// Componente provisional para pantallas en desarrollo
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-medicos-dark-blue mb-1">{title}</h1>
      <p className="text-medicos-muted text-sm">(En desarrollo)</p>
    </div>
  );
};

export const PatientRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<PatientLayout />}>
        {/* Redirección por defecto */}
        <Route index element={<Navigate to="dashboard/resumen" replace />} />

        {/* 1. Dashboard Principal */}
        <Route path="dashboard/resumen" element={<PatientDashboardPage />} />

        {/* 2. Mi Salud y Expediente Clínico */}
        <Route path="salud/resumen" element={<PlaceholderPage title="Resumen General de Salud" />} />
        <Route path="salud/signos-vitales" element={<PlaceholderPage title="Signos Vitales" />} />
        <Route path="salud/medicamentos" element={<PlaceholderPage title="Medicamentos Activos" />} />
        <Route path="salud/alergias" element={<PlaceholderPage title="Alergias y Reacciones" />} />
        <Route path="salud/enfermedades-cronicas" element={<PlaceholderPage title="Enfermedades Crónicas" />} />
        <Route path="salud/vacunas" element={<PlaceholderPage title="Historial de Vacunación" />} />
        <Route path="salud/embarazo" element={<PlaceholderPage title="Control de Embarazo" />} />
        <Route path="salud/documentos" element={<PlaceholderPage title="Documentos Médicos" />} />

        {/* 3. Consultas y Atención Médica */}
        <Route path="consultas/proximas" element={<PlaceholderPage title="Próximas Citas" />} />
        <Route path="consultas/historial" element={<PlaceholderPage title="Historial de Consultas" />} />
        <Route path="consultas/diagnosticos" element={<PlaceholderPage title="Diagnósticos Médicos" />} />
        <Route path="consultas/recetas" element={<PlaceholderPage title="Recetas Médicas" />} />
        <Route path="consultas/ordenes-medicas" element={<PlaceholderPage title="Órdenes Médicas" />} />
        <Route path="consultas/seguimientos" element={<PlaceholderPage title="Seguimientos Médicos" />} />

        {/* 4. Asistente IA */}
        <Route path="asistente-ia/chat" element={<PlaceholderPage title="Chat con Asistente IA" />} />
        <Route path="asistente-ia/evaluacion-rapida" element={<PlaceholderPage title="Evaluación Rápida de Síntomas" />} />
        <Route path="asistente-ia/sintomas" element={<PlaceholderPage title="Registro de Síntomas" />} />
        <Route path="asistente-ia/recomendaciones" element={<PlaceholderPage title="Recomendaciones Personalizadas" />} />
        <Route path="asistente-ia/educacion" element={<PlaceholderPage title="Educación en Salud" />} />

        {/* 5. Gestión Familiar */}
        <Route path="familia/pacientes-a-cargo" element={<PlaceholderPage title="Pacientes a Cargo" />} />
        <Route path="familia/miembros" element={<PlaceholderPage title="Miembros de la Familia" />} />
        <Route path="familia/autorizaciones" element={<PlaceholderPage title="Autorizaciones Familiares" />} />
        <Route path="familia/solicitudes" element={<PlaceholderPage title="Solicitudes Pendientes" />} />

        {/* 6. Credencial QR e Identificación */}
        <Route path="qr/credencial" element={<PlaceholderPage title="Credencial QR Digital" />} />

        {/* 7. Notificaciones */}
        <Route path="notificaciones/bandeja" element={<PlaceholderPage title="Bandeja de Notificaciones" />} />

        {/* 8. Perfil y Configuración de Cuenta */}
        <Route path="perfil/datos-personales" element={<PlaceholderPage title="Datos Personales" />} />
        <Route path="perfil/emergencias" element={<PlaceholderPage title="Información de Emergencia" />} />
        <Route path="perfil/contactos" element={<PlaceholderPage title="Contactos de Emergencia" />} />
        <Route path="perfil/seguro-medico" element={<PlaceholderPage title="Seguro Médico" />} />
        <Route path="perfil/dispositivos" element={<PlaceholderPage title="Dispositivos Vinculados" />} />
        <Route path="perfil/seguridad" element={<PlaceholderPage title="Seguridad de la Cuenta" />} />
        <Route path="perfil/privacidad" element={<PlaceholderPage title="Privacidad y Datos" />} />
        <Route path="perfil/preferencias" element={<PlaceholderPage title="Preferencias del Sistema" />} />
      </Route>

      {/* Fallback general */}
      <Route path="*" element={<Navigate to="dashboard/resumen" replace />} />
    </Routes>
  );
};

export default PatientRoutes;