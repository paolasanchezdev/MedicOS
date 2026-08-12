// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/components/PacienteHeader.tsx
// DESCRIPCIÓN: Header del paciente configurado con rutas del portal.
// =========================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderGlobal } from '../../../shared/components/header/HeaderGlobal';
import { useAuth } from '../../../core/context/AuthContextInstance';

export interface PacienteHeaderProps {
  onOpenSidebar: () => void;
}

export const PacienteHeader: React.FC<PacienteHeaderProps> = ({
  onOpenSidebar,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const firstName = user?.firstName?.trim() || '';
  const lastName = user?.lastName?.trim() || '';
  const fullName =
    firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Paciente';
  const email = user?.email || '';
  const initials =
    firstName || lastName
      ? `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()
      : 'P';

  const handleSearchSubmit = (query: string) => {
    navigate(`/paciente/expediente?q=${encodeURIComponent(query)}`);
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
      searchPlaceholder="Buscar en expediente, citas, recetas..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      onSearchSubmit={handleSearchSubmit}
      notificationsRoute="/paciente/notificaciones"
      userProfile={{
        fullName,
        email,
        initials,
        roleName: 'Paciente',
        showBadge: true,
        badgeText: 'Expediente Encriptado',
      }}
      onNavigateToProfile={() => navigate('/paciente/perfil')}
      onNavigateToRecords={() => navigate('/paciente/expediente')}
      onNavigateToSettings={() => navigate('/paciente/configuracion')}
      onNavigateToSupport={() => navigate('/paciente/soporte')}
      onLogout={handleLogout}
    />
  );
};

export default PacienteHeader;