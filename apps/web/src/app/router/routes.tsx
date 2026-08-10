import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';

// Páginas Públicas
import LandingPage from '../../modules/landing/LandingPage';
import Login from '../../modules/auth/pages/Login';
import { Register } from '../../modules/auth/pages/Register';

// Componentes de Portales
import { AdminPanel } from '../../portals/admin/AdminPanel';
import { PacientePanel } from '../../portals/paciente/PacientePanel';
import { MedicoPanel } from '../../portals/medico/MedicoPanel';
import { AuthorityPanel } from '../../portals/authority/AuthorityPanel';

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
            <PacientePanel />
          </ProtectedRoute>
        }
      />

      {/* Portal Brigadista */}
      <Route
        path="/brigadista/*"
        element={
          <ProtectedRoute allowedRoles={['BRIGADIST', 'BRIGADISTA']}>
            <Navigate to="/paciente/dashboard/resumen" replace />
          </ProtectedRoute>
        }
      />

      {/* Portal Médico */}
      <Route
        path="/doctor/*"
        element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <MedicoPanel />
          </ProtectedRoute>
        }
      />

      {/* Portal Autoridades */}
      <Route
        path="/autoridad/*"
        element={
          <ProtectedRoute allowedRoles={['AUTHORITY', 'AUTORIDAD']}>
            <AuthorityPanel />
          </ProtectedRoute>
        }
      />

      {/* Fallback para URLs no encontradas */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;