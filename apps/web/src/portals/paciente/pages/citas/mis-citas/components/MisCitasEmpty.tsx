// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/citas/mis-citas/components/MisCitasEmpty.tsx
// DESCRIPCIÓN: Estado vacío cuando el paciente no cuenta con registros de citas.
// =========================================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarX, Plus } from 'lucide-react';

export const MisCitasEmpty: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-medicos-soft-border rounded-3xl p-10 text-center space-y-4 shadow-2xs">
      <div className="w-16 h-16 bg-medicos-light-bg text-medicos-teal rounded-full flex items-center justify-center mx-auto border border-medicos-soft-border">
        <CalendarX className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-black text-medicos-dark-blue">No tienes citas programadas</h3>
        <p className="text-xs text-medicos-muted max-w-sm mx-auto">Agenda una consulta médica con nuestros especialistas para comenzar tu seguimiento territorial.</p>
      </div>
      <button
        type="button"
        onClick={() => navigate('/paciente/citas/agendar')}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-medicos-teal hover:bg-[#16646f] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Agendar cita médica</span>
      </button>
    </div>
  );
};