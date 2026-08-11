import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Activity } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10 animate-in fade-in duration-300">
      
      {/* HEADER DEL DASHBOARD CON TABS DE NAVEGACIÓN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Panel Principal
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Visualiza el resumen de tu expediente o el registro cronológico de tu actividad.
          </p>
        </div>

        {/* CONTROLES DE PESTAÑAS (TABS) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 border border-slate-200/80 rounded-2xl shrink-0 w-fit">
          <NavLink
            to="resumen"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-medicos-teal" />
            Resumen
          </NavLink>

          <NavLink
            to="actividad"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            <Activity className="w-3.5 h-3.5 text-sky-600" />
            Actividad
          </NavLink>
        </div>
      </div>

      {/* RENDERIZADO DE RUTAS HIJAS (RESUMEN O ACTIVIDAD) */}
      <Outlet />
    </div>
  );
};