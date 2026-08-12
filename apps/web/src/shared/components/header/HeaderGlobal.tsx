// =========================================================================
// ARCHIVO: apps/web/src/shared/components/header/HeaderGlobal.tsx
// DESCRIPCIÓN: Header global con layout responsivo optimizado para móviles y tablets.
// =========================================================================

import React from 'react';
import { Menu } from 'lucide-react';
import { BuscadorHeader } from './BuscadorHeader';
import { NotificacionesMenu } from './NotificacionesMenu';
import { PerfilUsuarioHeader } from './PerfilUsuarioHeader';

export interface UserProfileData {
  fullName: string;
  email: string;
  initials: string;
  roleName?: string;
  showBadge?: boolean;
  badgeText?: string;
}

export interface HeaderGlobalProps {
  onOpenSidebar: () => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (query: string) => void;
  notificationsRoute?: string;
  notificationEndpoint?: string;
  userProfile: UserProfileData;
  onNavigateToProfile?: () => void;
  onNavigateToRecords?: () => void;
  onNavigateToSettings?: () => void;
  onNavigateToSupport?: () => void;
  onLogout?: () => void;
}

export const HeaderGlobal: React.FC<HeaderGlobalProps> = ({
  onOpenSidebar,
  searchPlaceholder = 'Buscar...',
  searchValue,
  onSearchChange,
  onSearchSubmit,
  notificationsRoute = '/paciente/notificaciones',
  notificationEndpoint,
  userProfile,
  onNavigateToProfile,
  onNavigateToRecords,
  onNavigateToSettings,
  onNavigateToSupport,
  onLogout,
}) => {
  return (
    <header className="h-16 sm:h-20 bg-white/95 backdrop-blur-md border-b border-slate-100 px-3 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30 transition-all gap-2 sm:gap-4">
      {/* Zona Izquierda: Disparador del Menú Móvil / Tablet */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="xl:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[#3f8880]/30"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Zona Central: Buscador Responsivo */}
      <div className="flex-1 max-w-xl mx-auto flex justify-center px-1 sm:px-2 min-w-0">
        <div className="w-full">
          <BuscadorHeader
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={onSearchChange}
            onSubmit={onSearchSubmit}
          />
        </div>
      </div>

      {/* Zona Derecha: Notificaciones y Perfil de Usuario */}
      <div className="flex items-center justify-end gap-2 sm:gap-3.5 shrink-0">
        <NotificacionesMenu
          historyRoute={notificationsRoute}
          endpoint={notificationEndpoint}
        />
        <div className="w-px h-6 bg-slate-200/80 mx-0.5 hidden xs:block" />
        <PerfilUsuarioHeader
          fullName={userProfile.fullName}
          email={userProfile.email}
          initials={userProfile.initials}
          roleName={userProfile.roleName}
          showBadge={userProfile.showBadge}
          badgeText={userProfile.badgeText}
          onNavigateToProfile={onNavigateToProfile}
          onNavigateToRecords={onNavigateToRecords}
          onNavigateToSettings={onNavigateToSettings}
          onNavigateToSupport={onNavigateToSupport}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
};

export default HeaderGlobal;