// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/components/PacienteSidebar.tsx
// DESCRIPCIÓN: Sidebar del Paciente con filtrado condicional para Salud Materna.
// =========================================================================

import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { LifeBuoy, Headphones } from 'lucide-react';
import { SidebarGlobal } from '../../../shared/components/sidebar/SidebarGlobal';
import { PACIENTE_NAVIGATION, type NavGroup } from '../navigation/paciente.navigation';
import { useAuth } from '../../../core/context/useAuth';

interface PacienteSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const PacienteSidebar: React.FC<PacienteSidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { user } = useAuth();

  // Filtrado condicional del menú según género, embarazo o preferencias
  const dynamicGroups = useMemo(() => {
    const isFemale = user?.gender === 'FEMALE';
    const isPregnant = user?.isPregnant === true;
    const prefEnabled = user?.preferences?.showMaternalHealth === true;

    // Condición estricta: Mujer + (Embarazada OR Preferencia activada manualmente)
    const showMaternalHealth = isFemale && (isPregnant || prefEnabled);

    return PACIENTE_NAVIGATION.map((group) => {
      if (group.groupName === 'Salud Materna') {
        return showMaternalHealth ? group : null;
      }
      return group;
    }).filter(Boolean) as NavGroup[];
  }, [user]);

  return (
    <SidebarGlobal
      isOpen={isOpen}
      onClose={onClose}
      isCollapsed={isCollapsed}
      onToggleCollapse={onToggleCollapse}
      portalSubtitle="Portal Paciente"
      groups={dynamicGroups}
      footerWidget={
        <div className="p-3 rounded-2xl bg-[#edf6f5]/80 border border-[#3f8880]/15 space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-[#3f8880] text-white shadow-xs shrink-0">
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
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-white border border-[#3f8880]/20 text-[#3f8880] hover:bg-[#3f8880] hover:text-white text-xs font-bold transition-all shadow-2xs group"
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