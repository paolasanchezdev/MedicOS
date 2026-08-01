// apps/web/src/portals/admin/routes/AdminRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';

import DashboardLayout from '../../../layouts/DashboardLayout/DashboardLayout';
import AdminSidebar from '../layout/AdminSidebar';
import AdminHeader from '../layout/AdminHeader';

// Páginas / Módulos de Admin
import { ResumenPage } from '../pages/dashboard/resumen/ResumenPage';

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        element={
          <DashboardLayout
            sidebar={({ isCollapsed }) => <AdminSidebar isCollapsed={isCollapsed} />}
            header={<AdminHeader />}
          />
        }
      >
        {/* --- 1. DASHBOARD --- */}
        <Route path="dashboard/resumen" element={<ResumenPage />} />
        <Route path="dashboard/salud-sistema" element={<div>Salud del Sistema (En desarrollo)</div>} />

        {/* --- 2. GESTIÓN PRINCIPAL --- */}
        <Route path="gestion-principal/usuarios-roles" element={<div>Usuarios y Roles (En desarrollo)</div>} />
        <Route path="gestion-principal/brigadas-medicas" element={<div>Brigadas Médicas (En desarrollo)</div>} />
        <Route path="gestion-principal/dispositivos-nodos" element={<div>Dispositivos y Nodos (En desarrollo)</div>} />
        <Route path="gestion-principal/inventario-suministros" element={<div>Inventario y Suministros (En desarrollo)</div>} />
        <Route path="gestion-principal/catalogos-sistema" element={<div>Catálogos del Sistema (En desarrollo)</div>} />

        {/* --- 3. OPERACIONES --- */}
        <Route path="operaciones/sincronizacion" element={<div>Sincronización (En desarrollo)</div>} />
        <Route path="operaciones/seguridad" element={<div>Seguridad (En desarrollo)</div>} />
        <Route path="operaciones/auditoria" element={<div>Auditoría (En desarrollo)</div>} />

        {/* --- 4. REPORTES --- */}
        <Route path="reportes/reportes-operativos" element={<div>Reportes Operativos (En desarrollo)</div>} />
        <Route path="reportes/uso-sistema" element={<div>Uso del Sistema (En desarrollo)</div>} />

        {/* --- 5. CONFIGURACIÓN --- */}
        <Route path="configuracion/parametros-generales" element={<div>Parámetros Generales (En desarrollo)</div>} />

        {/* FALLBACK ABSOLUTO (Evita bucles infinitos) */}
        <Route path="*" element={<Navigate to="/admin/dashboard/resumen" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;