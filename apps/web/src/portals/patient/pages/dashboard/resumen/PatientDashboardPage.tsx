// apps/web/src/portals/patient/pages/dashboard/resumen/PatientDashboardPage.tsx
import React from 'react';

export const PatientDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Resumen General</h1>
      <p className="text-slate-600">Bienvenida a tu panel de salud en MedicOS.</p>
    </div>
  );
};

export default PatientDashboardPage;