// apps/web/src/app/router/routes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';

// Páginas Públicas
import LandingPage from '../../modules/landing/LandingPage';
import Login from '../../modules/auth/pages/Login';
import { Register } from '../../modules/auth/pages/Register';

// Componentes de Portales (Usando importaciones nombradas conforme a tus archivos)
import { AdminPanel } from '../../portals/admin/AdminPanel';
import { PatientPanel } from '../../portals/patient/PatientPanel';
import { BrigadistPanel } from '../../portals/brigadist/BrigadistPanel';
import { DoctorPanel } from '../../portals/doctor/DoctorPanel';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Portal Admin */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminPanel />
          </ProtectedRoute>
        }
      />

      {/* Portal Paciente */}
      <Route
        path="/paciente/*"
        element={
          <ProtectedRoute allowedRoles={['PATIENT', 'PACIENTE']}>
            <PatientPanel />
          </ProtectedRoute>
        }
      />

      {/* Portal Brigadista */}
      <Route
        path="/brigadista/*"
        element={
          <ProtectedRoute allowedRoles={['BRIGADIST', 'BRIGADISTA']}>
            <BrigadistPanel />
          </ProtectedRoute>
        }
      />

      {/* Portal Médico */}
      <Route
        path="/doctor/*"
        element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorPanel />
          </ProtectedRoute>
        }
      />

      {/* Portal Autoridades */}
      <Route
        path="/autoridad/*"
        element={
          <ProtectedRoute allowedRoles={['AUTHORITY', 'AUTORIDAD']}>
            <div className="p-6 font-medium text-slate-700">
              Portal Autoridad en desarrollo
            </div>
          </ProtectedRoute>
        }
      />

      {/* Fallback para URLs no encontradas */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;