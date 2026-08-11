import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCircle, ArrowUpRight, ClipboardList } from 'lucide-react';

export interface AccionPendienteItem {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'CITA_CONFIRMACION' | 'FORMULARIO_PREVIO' | 'RESULTADOS_LAB' | 'ACTUALIZACION_DATOS';
  ruta?: string;
}

interface Props {
  acciones?: AccionPendienteItem[] | null;
}

export const TarjetaAccionesPendientes: React.FC<Props> = ({ acciones }) => {
  const tienePendientes = acciones && acciones.length > 0;

  return (
    <div className="bg-medicos-surface rounded-2xl border border-medicos-soft-border p-5 shadow-xs flex flex-col justify-between h-full space-y-4">
      <div className="flex items-center justify-between border-b border-medicos-soft-border pb-3">
        <span className="text-xs font-bold text-medicos-dark-blue uppercase tracking-wider flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-medicos-teal" /> Avisos y Tareas Pendientes
        </span>
        <span
          className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${
            tienePendientes
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-medicos-light-bg text-medicos-teal border-medicos-soft-border'
          }`}
        >
          {tienePendientes ? `${acciones.length} PENDIENTES` : 'AL DÍA'}
        </span>
      </div>

      <div className="space-y-2">
        {tienePendientes ? (
          acciones.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-medicos-light-bg border border-medicos-soft-border hover:border-medicos-teal transition-all flex items-start justify-between gap-3"
            >
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-medicos-dark-blue">{item.titulo}</p>
                <p className="text-[11px] text-medicos-muted leading-snug">{item.descripcion}</p>
              </div>
              {item.ruta && (
                <Link
                  to={item.ruta}
                  className="p-1.5 rounded-lg bg-medicos-surface border border-medicos-soft-border text-medicos-teal hover:bg-medicos-teal hover:text-white transition-colors shrink-0"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          ))
        ) : (
          <div className="py-5 text-center space-y-2">
            <div className="w-9 h-9 rounded-full bg-medicos-light-bg text-medicos-teal flex items-center justify-center mx-auto">
              <CheckCircle className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-medicos-dark-blue">No tienes trámites o pendientes</p>
            <p className="text-[11px] text-medicos-muted max-w-xs mx-auto">
              Has completado la confirmación de citas, encuestas previas e información de perfil.
            </p>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-medicos-soft-border flex items-center justify-between">
        <span className="text-[11px] text-medicos-muted flex items-center gap-1">
          <ClipboardList className="w-3.5 h-3.5 text-medicos-teal" /> Notificaciones operativas
        </span>
        <Link
          to="/paciente/notificaciones"
          className="text-xs font-semibold text-medicos-teal hover:underline"
        >
          Ver centro de avisos
        </Link>
      </div>
    </div>
  );
};

export default TarjetaAccionesPendientes;