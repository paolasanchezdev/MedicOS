import React from 'react';
import { Link } from 'react-router-dom';
import { FileCheck2, ShieldCheck, PlusCircle, User, Calendar } from 'lucide-react';

export interface PacienteIdentificacionData {
  id?: string;
  nombreCompleto: string;
  dui?: string | null;
  fechaNacimiento?: string | null;
}

interface Props {
  paciente: PacienteIdentificacionData | null;
  usuarioSesionNombre?: string;
}

export const TarjetaBienvenidaPaciente: React.FC<Props> = ({ paciente, usuarioSesionNombre }) => {
  const nombreMostrar = paciente?.nombreCompleto || usuarioSesionNombre || 'Paciente';

  const fechaNac = paciente?.fechaNacimiento ? new Date(paciente.fechaNacimiento) : null;
  const fechaNacFormateada = fechaNac && !isNaN(fechaNac.getTime())
    ? fechaNac.toLocaleDateString('es-SV', { year: 'numeric', month: 'short', day: 'numeric' })
    : null;

  return (
    <div className="bg-medicos-teal text-white rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 border border-medicos-soft-border">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/10 text-white border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5 text-medicos-cyan" />
            Expediente Activo
          </span>
          {paciente?.dui && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-black/10 text-slate-100 border border-white/10">
              <FileCheck2 className="w-3.5 h-3.5 text-medicos-cyan" />
              DUI: {paciente.dui}
            </span>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Hola, {nombreMostrar}
          </h1>
          <p className="text-xs text-slate-200 mt-1">
            Panel de Control Clínico — Sistema Integrado de Salud MedicOS.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200 pt-1">
          {fechaNacFormateada && (
            <span className="flex items-center gap-1.5 text-slate-200">
              <Calendar className="w-3.5 h-3.5 text-medicos-cyan" />
              Fecha Nacimiento: <strong className="text-white">{fechaNacFormateada}</strong>
            </span>
          )}
          <span className="flex items-center gap-1.5 text-slate-200">
            <User className="w-3.5 h-3.5 text-medicos-cyan" />
            Acceso Autenticado
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch gap-2.5 shrink-0 border-t md:border-t-0 md:border-l border-white/15 pt-4 md:pt-0 md:pl-6">
        <Link
          to="/paciente/citas/agendar"
          className="px-4 py-2.5 rounded-xl bg-medicos-cyan hover:opacity-90 text-medicos-dark-blue text-xs font-bold transition-opacity flex items-center justify-center gap-2 shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Solicitar Cita</span>
        </Link>
        <Link
          to="/paciente/expediente"
          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-white/20"
        >
          <FileCheck2 className="w-4 h-4 text-medicos-cyan" />
          <span>Ver Expediente</span>
        </Link>
      </div>
    </div>
  );
};

export default TarjetaBienvenidaPaciente;