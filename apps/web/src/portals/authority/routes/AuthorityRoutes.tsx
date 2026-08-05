// apps/web/src/portals/authority/routes/AuthorityRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthorityLayout from '../layout/AuthorityLayout';
import ResumenAutoridadPage from '../pages/dashboard/resumen/ResumenAutoridadPage';

export const AuthorityRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AuthorityLayout />}>
        {/* Renderiza el panel directamente en /autoridad */}
        <Route index element={<ResumenAutoridadPage />} />
        
        {/* Alias por si se navega a /autoridad/dashboard/resumen */}
        <Route path="dashboard/resumen" element={<ResumenAutoridadPage />} />
        
        {/* Fallback de rutas no encontradas dentro de autoridad */}
        <Route path="*" element={<Navigate to="" replace />} />
      </Route>
    </Routes>
  );
};

export default AuthorityRoutes;