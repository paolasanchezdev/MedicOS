import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderGlobal, type UserProfileData } from '../../../shared/components/header/HeaderGlobal';
import { useAuth } from '../../../core/context/useAuth';

interface AuthorityHeaderProps {
  onOpenSidebar: () => void;
}

export const AuthorityHeader: React.FC<AuthorityHeaderProps> = ({ onOpenSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const firstName = user?.firstName?.trim() || '';
  const lastName = user?.lastName?.trim() || '';
  const fullName = firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Autoridad Sanitarias';
  const email = user?.email || '';
  const initials = firstName || lastName
    ? `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()
    : 'AS';

  const authorityUserProfile: UserProfileData = {
    fullName,
    email,
    initials,
    roleName: user?.role || 'Autoridad Sanitarias',
    showBadge: true,
    badgeText: 'Red Nacional Activa',
  };

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      navigate(`/authority/dashboard/resumen?q=${encodeURIComponent(query)}`);
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
      searchPlaceholder="Buscar brote, municipio o brigada..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      onSearchSubmit={handleSearchSubmit}
      notificationsRoute="/authority/epidemiologia/alertas"
      userProfile={authorityUserProfile}
      onNavigateToProfile={() => navigate('/authority/configuracion/preferencias')}
      onNavigateToSettings={() => navigate('/authority/configuracion/preferencias')}
      onNavigateToSupport={() => navigate('/authority/dashboard/salud-sistema')}
      onLogout={handleLogout}
    />
  );
};

export default AuthorityHeader;