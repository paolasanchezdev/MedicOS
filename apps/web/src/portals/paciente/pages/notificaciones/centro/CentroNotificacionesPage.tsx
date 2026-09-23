// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/notificaciones/centro/CentroNotificacionesPage.tsx
// DESCRIPCIÓN: Compositor central del Centro de Notificaciones del Paciente.
// =========================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../../../shared/lib/apiClient';
import {
  NotificacionesHeader,
  NotificacionesFilters,
  NotificacionesGroup,
  NotificacionesEmpty,
  NotificacionesLoading,
  type NotificationCardData,
} from './components/index.js';

const computeTimeAgo = (isoString: string, nowTimestamp: number): string => {
  try {
    const diffMs = nowTimestamp - new Date(isoString).getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 1) return 'Hace un momento';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;

    return new Date(isoString).toLocaleDateString('es-SV', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return isoString;
  }
};

export const CentroNotificacionesPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('TODAS');

  useEffect(() => {
    let isMounted = true;

    apiClient<NotificationCardData[]>('/patients/notifications')
      .then((res) => {
        if (!isMounted) return;
        const now = Date.now();
        const list = Array.isArray(res) ? res : [];
        const enriched = list.map((item) => ({
          ...item,
          timeAgo: computeTimeAgo(item.createdAt, now),
        }));
        setNotifications(enriched);
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setNotifications([]);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleManualRefresh = async () => {
    setLoading(true);
    try {
      const res = await apiClient<NotificationCardData[]>('/patients/notifications');
      const now = Date.now();
      const list = Array.isArray(res) ? res : [];
      const enriched = list.map((item) => ({
        ...item,
        timeAgo: computeTimeAgo(item.createdAt, now),
      }));
      setNotifications(enriched);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await apiClient(`/patients/notifications/${id}/read`, { method: 'PATCH' });
    } catch {
      // Fallback optimista
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await apiClient('/patients/notifications/read-all', { method: 'PATCH' });
    } catch {
      // Fallback optimista
    }
  };

  const handleActionClick = (item: NotificationCardData) => {
    if (!item.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
      );
      apiClient(`/patients/notifications/${item.id}/read`, { method: 'PATCH' }).catch(() => {});
    }
    if (item.linkUrl) {
      navigate(item.linkUrl);
    }
  };

  const filteredNotifications = useMemo(() => {
    if (activeCategory === 'TODAS') return notifications;
    if (activeCategory === 'NO_LEIDAS') return notifications.filter((n) => !n.isRead);
    return notifications.filter((n) => n.category === activeCategory);
  }, [notifications, activeCategory]);

  const groupedNotifications = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const groups: { label: string; items: NotificationCardData[] }[] = [
      { label: 'Hoy', items: [] },
      { label: 'Esta semana', items: [] },
      { label: 'Anteriores', items: [] },
    ];

    filteredNotifications.forEach((n) => {
      const itemDate = new Date(n.createdAt);
      if (itemDate >= today) {
        groups[0].items.push(n);
      } else if (itemDate >= sevenDaysAgo) {
        groups[1].items.push(n);
      } else {
        groups[2].items.push(n);
      }
    });

    return groups.filter((g) => g.items.length > 0);
  }, [filteredNotifications]);

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200">
      <NotificacionesHeader
        unreadCount={unreadCount}
        loading={loading}
        onMarkAllAsRead={handleMarkAllAsRead}
        onRefresh={handleManualRefresh}
      />

      <NotificacionesFilters
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {loading ? (
        <NotificacionesLoading />
      ) : groupedNotifications.length === 0 ? (
        <NotificacionesEmpty isUnreadFilter={activeCategory === 'NO_LEIDAS'} />
      ) : (
        <div className="space-y-6">
          {groupedNotifications.map((group) => (
            <NotificacionesGroup
              key={group.label}
              label={group.label}
              items={group.items}
              onActionClick={handleActionClick}
              onMarkAsRead={handleMarkAsRead}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CentroNotificacionesPage;