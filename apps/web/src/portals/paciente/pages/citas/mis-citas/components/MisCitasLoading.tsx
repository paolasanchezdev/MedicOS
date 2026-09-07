// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/citas/mis-citas/components/MisCitasLoading.tsx
// DESCRIPCIÓN: Esqueleto de carga optimizado para el centro de agenda.
// =========================================================================

import React from 'react';
import { Loader2 } from 'lucide-react';

export const MisCitasLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-3 bg-white border border-medicos-soft-border rounded-3xl shadow-2xs">
      <Loader2 className="w-8 h-8 text-medicos-teal animate-spin" />
      <p className="text-xs font-bold text-medicos-dark-blue">Cargando tus citas médicas...</p>
    </div>
  );
};