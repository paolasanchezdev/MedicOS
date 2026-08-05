// apps/web/src/portals/patient/layout/PatientSidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { PATIENT_NAVIGATION } from '../navigation/patient.navigation';
import { X, ShieldCheck } from 'lucide-react';

interface PatientSidebarProps {
  open: boolean;
  onClose: () => void;
}

export const PatientSidebar: React.FC<PatientSidebarProps> = ({ open, onClose }) => {
  return (
    <>
      {/* Overlay para móviles */}
      {open && (
        <div
          className="fixed inset-0 bg-medicos-dark-blue/40 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Principal */}
      <aside
        className={`fixed md:static top-0 left-0 z-50 md:z-auto h-full w-64 bg-medicos-surface border-r border-medicos-soft-border flex flex-col transition-transform duration-300 ease-in-out shadow-sm ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Cabecera Móvil */}
        <div className="p-4 border-b border-medicos-soft-border flex items-center justify-between md:hidden bg-medicos-light-bg/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-medicos-teal/10 flex items-center justify-center text-medicos-teal font-bold text-sm">
              M
            </div>
            <span className="font-semibold text-medicos-dark-blue text-sm">Portal Paciente</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-medicos-muted hover:bg-medicos-light-bg hover:text-medicos-dark-blue transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navegación por Secciones */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-5 scrollbar-none">
          {PATIENT_NAVIGATION.map((group) => (
            <div key={group.title} className="space-y-1">
              <h3 className="px-3 text-[11px] font-bold text-medicos-muted/80 uppercase tracking-wider mb-1.5">
                {group.title}
              </h3>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 group ${
                          isActive
                            ? 'bg-medicos-light-bg text-medicos-teal font-semibold shadow-2xs border border-medicos-soft-border/60'
                            : 'text-medicos-muted hover:bg-medicos-light-bg/60 hover:text-medicos-dark-blue'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                              isActive ? 'text-medicos-teal' : 'text-medicos-muted group-hover:text-medicos-teal'
                            }`}
                          />
                          <span className="truncate">{item.name}</span>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer del Sidebar */}
        <div className="p-3 border-t border-medicos-soft-border bg-medicos-canvas/60">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-medicos-light-bg/80 text-[11px] text-medicos-teal font-medium border border-medicos-soft-border/50">
            <ShieldCheck className="w-4 h-4 shrink-0 text-medicos-teal" />
            <span className="truncate">Conexión Segura MedicOS</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default PatientSidebar;