import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderGlobal, type UserProfileData } from '../../../shared/components/header/HeaderGlobal';
import { useAuth } from '../../../core/context/useAuth';

interface AdminHeaderProps {
  onOpenSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onOpenSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const firstName = user?.firstName?.trim() || '';
  const lastName = user?.lastName?.trim() || '';
  const fullName = firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Administrador';
  const email = user?.email || '';
  const initials = firstName || lastName
    ? `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()
    : 'AD';

  const adminUserProfile: UserProfileData = {
    fullName,
    email,
    initials,
    roleName: user?.role || 'Administrador General',
    showBadge: true,
    badgeText: 'Sistema Operativo',
  };

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      navigate(`/admin/dashboard?q=${encodeURIComponent(query)}`);
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
      searchPlaceholder="Buscar en el portal administrador..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      onSearchSubmit={handleSearchSubmit}
      notificationsRoute="/admin/notificaciones"
      userProfile={adminUserProfile}
      onNavigateToProfile={() => navigate('/admin/configuracion')}
      onNavigateToSettings={() => navigate('/admin/configuracion')}
      onNavigateToSupport={() => navigate('/admin/sistema/actividad')}
      onLogout={handleLogout}
    />
  );
};

export default AdminHeader;