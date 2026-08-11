import React from 'react';
import { PacienteLayout } from './layout/PacienteLayout';
import PacienteRoutes from './routes/PacienteRoutes';

export const PacientePanel: React.FC = () => {
  return (
    <PacienteLayout>
      <PacienteRoutes />
    </PacienteLayout>
  );
};

export default PacientePanel;