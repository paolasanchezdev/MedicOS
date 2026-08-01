// apps/web/src/portals/patient/routes/PatientRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PatientLayout } from '../layout/PatientLayout';
import { PatientDashboardPage } from '../pages/dashboard/resumen/PatientDashboardPage';

export const PatientRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<PatientLayout />}>
        {/* Redirección por defecto */}
        <Route index element={<Navigate to="dashboard/resumen" replace />} />

        {/* 1. Dashboard */}
        <Route path="dashboard/resumen" element={<PatientDashboardPage />} />

        {/* 2. Asistente IA */}
        <Route path="asistente-ia/*" element={<PatientDashboardPage />} />

        {/* 3. Consultas */}
        <Route path="consultas/*" element={<PatientDashboardPage />} />

        {/* 4. Familia */}
        <Route path="familia/*" element={<PatientDashboardPage />} />

        {/* 5. Notificaciones */}
        <Route path="notificaciones/*" element={<PatientDashboardPage />} />

        {/* 6. Perfil */}
        <Route path="perfil/*" element={<PatientDashboardPage />} />

        {/* 7. QR */}
        <Route path="qr/*" element={<PatientDashboardPage />} />

        {/* 8. Salud */}
        <Route path="salud/*" element={<PatientDashboardPage />} />
      </Route>

      {/* Fallback general */}
      <Route path="*" element={<Navigate to="dashboard/resumen" replace />} />
    </Routes>
  );
};

export default PatientRoutes;