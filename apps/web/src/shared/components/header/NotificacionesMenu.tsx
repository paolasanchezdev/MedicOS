// =========================================================================
// ARCHIVO: apps/web/src/shared/components/header/NotificacionesMenu.tsx
// DESCRIPCIÓN: Menú desplegable de notificaciones alineado a la derecha del icono para evitar colisión con Sidebar.
// =========================================================================

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Calendar, FileText, Pill, Loader2 } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';

export interface NotificationRecord {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  isRead: boolean;
  type: 'cita' | 'receta' | 'estudio' | 'general' | string;
  linkUrl?: string;
}

export interface NotificacionesMenuProps {
  historyRoute?: string;
  endpoint?: string;
}

export const NotificacionesMenu: React.FC<NotificacionesMenuProps> = ({
  historyRoute = '/paciente/notificaciones',
  endpoint,
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const loadNotifications = async () => {
      if (!endpoint) {
        if (isMounted) {
          setNotifications([]);
        }
        return;
      }

      setLoading(true);
      try {
        const data = await apiClient<NotificationRecord[]>(endpoint);
        if (isMounted && Array.isArray(data)) {
          setNotifications(data);
        } else if (isMounted) {
          setNotifications([]);
        }
      } catch {
        if (isMounted) {
          setNotifications([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, [endpoint]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = async () => {
    if (endpoint) {
      try {
        await apiClient(`${endpoint}/read-all`, { method: 'PATCH' });
      } catch {
        // Fallback gráfico
      }
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = async (item: NotificationRecord) => {
    if (!item.isRead) {
      if (endpoint) {
        try {
          await apiClient(`${endpoint}/${item.id}/read`, { method: 'PATCH' });
        } catch {
          // Fallback gráfico
        }
      }
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
      );
    }
    setIsOpen(false);
    if (item.linkUrl) {
      navigate(item.linkUrl);
    }
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'cita':
        return <Calendar className="w-4 h-4 text-[#3f8880]" />;
      case 'receta':
        return <Pill className="w-4 h-4 text-emerald-600" />;
      case 'estudio':
        return <FileText className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('es-SV', {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'short',
      }).format(date);
    } catch {
      return isoString;
    }
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative p-2 sm:p-2.5 rounded-xl transition-all border ${
          isOpen
            ? 'bg-[#edf6f5] text-[#3f8880] border-[#3f8880]/30'
            : 'text-slate-600 hover:bg-slate-50 border-slate-200/60'
        }`}
        aria-label="Notificaciones"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3f8880] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#3f8880]" />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed left-4 right-4 top-17 sm:absolute sm:top-full sm:left-0 sm:right-auto sm:mt-3 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-900">Notificaciones</h3>
              {unreadCount > 0 && (
                <span className="bg-[#edf6f5] text-[#3f8880] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {unreadCount} nuevas
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="text-[11px] font-bold text-[#3f8880] hover:underline flex items-center gap-1 focus:outline-none"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Marcar leídas
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
            {loading ? (
              <div className="p-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin text-[#3f8880]" />
                Cargando notificaciones...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No tienes notificaciones en este momento.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 flex items-start gap-3 hover:bg-slate-50/80 transition-colors cursor-pointer ${
                    !item.isRead ? 'bg-[#edf6f5]/30' : ''
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                    {renderIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p
                        className={`text-xs truncate ${
                          !item.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'
                        }`}
                      >
                        {item.title}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {formatTime(item.createdAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#3f8880] shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>

          <div className="pt-2 px-4 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(historyRoute);
              }}
              className="text-xs font-bold text-slate-600 hover:text-[#3f8880] transition-colors focus:outline-none"
            >
              Ver todo el historial
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificacionesMenu;