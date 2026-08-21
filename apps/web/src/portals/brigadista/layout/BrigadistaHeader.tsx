// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/layout/BrigadistaHeader.tsx
// DESCRIPCIÓN: Header para el Portal Brigadista basado en el chasis HeaderGlobal.
// =========================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderGlobal, type UserProfileData } from '../../../shared/components/header/HeaderGlobal';
import { useAuth } from '../../../core/context/useAuth';

interface BrigadistaHeaderProps {
  onOpenSidebar: () => void;
}

export const BrigadistaHeader: React.FC<BrigadistaHeaderProps> = ({ onOpenSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const firstName = user?.firstName?.trim() || '';
  const lastName = user?.lastName?.trim() || '';
  const fullName = firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Brigadista';
  const email = user?.email || '';
  const initials = firstName || lastName
    ? `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()
    : 'BR';

  const brigadistaUserProfile: UserProfileData = {
    fullName,
    email,
    initials,
    roleName: user?.role || 'Brigadista de Campo',
    showBadge: true,
    badgeText: 'En Jornada',
  };

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      navigate(`/brigadista/pacientes/buscar?q=${encodeURIComponent(query)}`);
    }
  };

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
    navigate('/login');
  };

  return (
    <HeaderGlobal
      onOpenSidebar={onOpenSidebar}
      searchPlaceholder="Buscar pacientes, expedientes o registros..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      onSearchSubmit={handleSearchSubmit}
      notificationsRoute="/brigadista/notificaciones/centro"
      userProfile={brigadistaUserProfile}
      onNavigateToProfile={() => navigate('/brigadista/perfil/datos')}
      onNavigateToSettings={() => navigate('/brigadista/perfil/preferencias')}
      onNavigateToSupport={() => navigate('/brigadista/perfil/seguridad')}
      onLogout={handleLogout}
    />
  );
};

export default BrigadistaHeader;