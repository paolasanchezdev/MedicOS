// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/components/PacienteSidebar.tsx
// DESCRIPCIÓN: Inyector de rutas y widgets para el Sidebar del portal Paciente.
// =========================================================================

import React from 'react';
import { NavLink } from 'react-router-dom';
import { LifeBuoy, Headphones } from 'lucide-react';
import { SidebarGlobal } from '../../../shared/components/sidebar/SidebarGlobal';
import { PACIENTE_NAVIGATION } from '../navigation/paciente.navigation';

interface PacienteSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PacienteSidebar: React.FC<PacienteSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <SidebarGlobal
      isOpen={isOpen}
      onClose={onClose}
      portalSubtitle="Portal Paciente"
      groups={PACIENTE_NAVIGATION}
      footerWidget={
        <div className="p-3.5 rounded-2xl bg-[#edf6f5]/80 border border-[#3f8880]/15 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#3f8880] text-white shadow-xs shrink-0">
              <LifeBuoy className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 leading-tight truncate">
                ¿Necesitas Ayuda?
              </h4>
              <p className="text-[10px] text-slate-500 font-medium leading-snug truncate">
                Atención y Soporte MedicOS
              </p>
            </div>
          </div>

          <NavLink
            to="/paciente/soporte"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white border border-[#3f8880]/20 text-[#3f8880] hover:bg-[#3f8880] hover:text-white text-xs font-bold transition-all shadow-2xs group"
          >
            <span>Centro de Soporte</span>
            <Headphones className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
          </NavLink>
        </div>
      }
    />
  );
};

export default PacienteSidebar;