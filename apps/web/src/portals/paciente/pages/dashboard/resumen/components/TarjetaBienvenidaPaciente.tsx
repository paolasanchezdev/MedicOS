import React from 'react';
import { Link } from 'react-router-dom';
import { FileCheck2, ShieldCheck, PlusCircle, User, Calendar, Activity } from 'lucide-react';

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
    <div className="relative overflow-hidden bg-[#2a726d] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#23605c]">
      
      {/* Patrón decorativo sutíl en fondo */}
      <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute right-32 -bottom-12 w-36 h-36 bg-emerald-400/10 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 space-y-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/15 text-white backdrop-blur-md border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            Expediente Activo
          </span>
          {paciente?.dui && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium bg-white/10 text-emerald-100 backdrop-blur-md">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-300" />
              DUI: {paciente.dui}
            </span>
          )}
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Hola, {nombreMostrar}
          </h1>
          <p className="text-xs text-emerald-100/90 mt-1 font-medium">
            Panel de Control Clínico — Sistema Integrado de Salud MedicOS
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-100/80 pt-1 border-t border-white/10">
          {fechaNacFormateada && (
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-emerald-300" />
              Nacimiento: <strong className="text-white font-semibold">{fechaNacFormateada}</strong>
            </span>
          )}
          <span className="flex items-center gap-1.5 font-medium">
            <User className="w-3.5 h-3.5 text-emerald-300" />
            Acceso Autenticado
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Activity className="w-3.5 h-3.5 text-emerald-300" />
            Estado: Sincronizado
          </span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row items-stretch md:items-center gap-3 shrink-0 pt-2 md:pt-0">
        <Link
          to="/paciente/citas/agendar"
          className="px-5 py-3 rounded-2xl bg-white hover:bg-emerald-50 text-[#2a726d] text-xs font-bold transition-all duration-150 flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4 text-[#2a726d]" />
          <span>Solicitar Cita</span>
        </Link>
        <Link
          to="/paciente/expediente"
          className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all duration-150 flex items-center justify-center gap-2 border border-white/20 active:scale-[0.98]"
        >
          <FileCheck2 className="w-4 h-4 text-emerald-300" />
          <span>Ver Expediente</span>
        </Link>
      </div>
    </div>
  );
};

export default TarjetaBienvenidaPaciente;