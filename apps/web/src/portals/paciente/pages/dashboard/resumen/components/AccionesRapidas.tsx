import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, FileText, Pill, FlaskConical, ArrowRight } from 'lucide-react';

export const AccionesRapidas: React.FC = () => {
  const acciones = [
    {
      titulo: 'Registrar Signos Vitales',
      descripcion: 'Presión, glucosa, oxigenación o peso.',
      icono: HeartPulse,
      ruta: '/paciente/signos-vitales',
      badge: 'Monitoreo',
      bgClass: 'bg-rose-50/80 hover:bg-rose-100/70 border-rose-200/80',
      iconBg: 'bg-rose-500 text-white shadow-xs',
      badgeClass: 'bg-rose-100 text-rose-700 border-rose-200',
      accentColor: 'text-rose-600',
    },
    {
      titulo: 'Expediente Clínico',
      descripcion: 'Diagnósticos, antecedentes y evolución.',
      icono: FileText,
      ruta: '/paciente/expediente',
      badge: 'Historial',
      bgClass: 'bg-teal-50/80 hover:bg-teal-100/70 border-teal-200/80',
      iconBg: 'bg-[#2a726d] text-white shadow-xs',
      badgeClass: 'bg-teal-100 text-[#2a726d] border-teal-200',
      accentColor: 'text-[#2a726d]',
    },
    {
      titulo: 'Recetas y Fármacos',
      descripcion: 'Dosis, indicaciones y vigencia.',
      icono: Pill,
      ruta: '/paciente/tratamientos',
      badge: 'Farmacia',
      bgClass: 'bg-amber-50/80 hover:bg-amber-100/70 border-amber-200/80',
      iconBg: 'bg-amber-500 text-white shadow-xs',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      accentColor: 'text-amber-600',
    },
    {
      titulo: 'Resultados Laboratorio',
      descripcion: 'Informes de exámenes y análisis.',
      icono: FlaskConical,
      ruta: '/paciente/resultados',
      badge: 'Exámenes',
      bgClass: 'bg-indigo-50/80 hover:bg-indigo-100/70 border-indigo-200/80',
      iconBg: 'bg-indigo-600 text-white shadow-xs',
      badgeClass: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      accentColor: 'text-indigo-600',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <span>Módulos de Atención Rápida</span>
        </h2>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
          Accesos Directos
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {acciones.map((accion) => {
          const Icono = accion.icono;
          return (
            <Link
              key={accion.ruta}
              to={accion.ruta}
              className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between group space-y-4 shadow-2xs hover:shadow-xs active:scale-[0.99] ${accion.bgClass}`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${accion.iconBg}`}>
                  <Icono className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${accion.badgeClass}`}>
                  {accion.badge}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>{accion.titulo}</span>
                  <ArrowRight className={`w-4 h-4 ${accion.accentColor} opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200`} />
                </h3>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug font-medium">
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