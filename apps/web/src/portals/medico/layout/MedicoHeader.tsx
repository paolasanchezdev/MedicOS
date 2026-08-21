import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderGlobal, type UserProfileData } from '../../../shared/components/header/HeaderGlobal';
import { useAuth } from '../../../core/context/useAuth';

interface MedicoHeaderProps {
  onOpenSidebar: () => void;
}

export const MedicoHeader: React.FC<MedicoHeaderProps> = ({ onOpenSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const firstName = user?.firstName?.trim() || '';
  const lastName = user?.lastName?.trim() || '';
  const fullName = firstName || lastName ? `Dr. ${firstName} ${lastName}`.trim() : 'Médico de Guardia';
  const email = user?.email || '';
  const initials = firstName || lastName
    ? `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()
    : 'MD';

  const medicoUserProfile: UserProfileData = {
    fullName,
    email,
    initials,
    roleName: user?.role || 'Médico Especialista',
    showBadge: true,
    badgeText: 'Brigada Activa',
  };

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      navigate(`/medico/pacientes/buscar?q=${encodeURIComponent(query)}`);
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
      searchPlaceholder="Buscar paciente por DUI, nombre o expediente..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      onSearchSubmit={handleSearchSubmit}
      notificationsRoute="/medico/notificaciones/centro"
      userProfile={medicoUserProfile}
      onNavigateToProfile={() => navigate('/medico/perfil/datos-profesionales')}
      onNavigateToSettings={() => navigate('/medico/perfil/preferencias')}
      onNavigateToSupport={() => navigate('/medico/dashboard/actividad')}
      onLogout={handleLogout}
    />
  );
};

export default MedicoHeader;