import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarPlus, FileText, Pill, Bell, ArrowRight } from 'lucide-react';

export const AccionesRapidas: React.FC = () => {
  const acciones = [
    {
      titulo: 'Programar Consulta',
      descripcion: 'Agendar cita con especialista o médico general.',
      icono: CalendarPlus,
      ruta: '/paciente/citas/agendar',
      badge: 'Citas',
    },
    {
      titulo: 'Expediente Clínico',
      descripcion: 'Consultar diagnósticos, antecedentes y evolución.',
      icono: FileText,
      ruta: '/paciente/expediente',
      badge: 'Historial',
    },
    {
      titulo: 'Recetas y Fármacos',
      descripcion: 'Revisar dosis, indicaciones y vigencia de medicamentos.',
      icono: Pill,
      ruta: '/paciente/tratamientos',
      badge: 'Farmacia',
    },
    {
      titulo: 'Avisos del Sistema',
      descripcion: 'Notificaciones sobre citas y estado de solicitudes.',
      icono: Bell,
      ruta: '/paciente/notificaciones',
      badge: 'Alertas',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-medicos-soft-border pb-2">
        <h2 className="text-xs font-bold text-medicos-muted uppercase tracking-wider">
          Módulos de Atención Rápida
        </h2>
        <span className="text-[10px] font-semibold text-medicos-muted uppercase">Accesos Directos</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {acciones.map((accion) => {
          const Icono = accion.icono;
          return (
            <Link
              key={accion.ruta}
              to={accion.ruta}
              className="bg-medicos-surface p-4 rounded-2xl border border-medicos-soft-border shadow-2xs hover:border-medicos-teal hover:shadow-xs transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-medicos-teal text-white flex items-center justify-center transition-transform group-hover:scale-105">
                  <Icono className="w-4 h-4 text-medicos-cyan" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-medicos-light-bg text-medicos-teal transition-colors">
                  {accion.badge}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-medicos-dark-blue flex items-center justify-between">
                  <span>{accion.titulo}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-medicos-teal opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-[11px] text-medicos-muted mt-1 leading-snug">
                  {accion.descripcion}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AccionesRapidas;