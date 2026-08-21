import React from 'react';
import { SidebarGlobal, type SidebarNavigationGroup } from '../../../shared/components/sidebar/SidebarGlobal';
import { AUTHORITY_NAVIGATION } from '../navigation/authority.navigation';
import { 
  LayoutDashboard, 
  Activity,
  BarChart3,
  Map,
  Siren,
  Megaphone,
  Building2,
  Bot,
  FileText,
  Settings,
  ShieldAlert,
  Radio,
  TrendingUp,
  AlertTriangle,
  Users,
  HeartPulse,
  Syringe,
  Home,
  Flame,
  MapPin,
  Compass,
  CalendarCheck,
  History,
  Award,
  CheckCircle2,
  Calendar,
  LineChart,
  Hospital,
  Building,
  Boxes,
  Cpu,
  Sparkles,
  Search,
  FileSpreadsheet,
  Download,
  SlidersHorizontal,
  Lock,
  BellRing,
  Eye
} from 'lucide-react';

const ITEM_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  // Secciones Principales
  'Dashboard': LayoutDashboard,
  'Epidemiología': Activity,
  'Estadísticas Sanitarias': BarChart3,
  'Mapas e Inteligencia Territorial': Map,
  'Gestión de Brigadas': Siren,
  'Campañas de Salud': Megaphone,
  'Establecimientos de Salud': Building2,
  'Inteligencia Artificial': Bot,
  'Reportes e Informes': FileText,
  'Configuración y Auditoría': Settings,

  // Sub-elementos Dashboard
  'Resumen General': LayoutDashboard,
  'Salud del Sistema': Cpu,

  // Sub-elementos Epidemiología
  'Alertas Epidemiológicas': ShieldAlert,
  'Vigilancia Epidemiológica': Radio,
  'Brotes Detectados': AlertTriangle,
  'Tendencias y Curvas': TrendingUp,
  'Factores de Riesgo': Activity,

  // Sub-elementos Estadísticas Sanitarias
  'Enfermedades y Morbilidad': Activity,
  'Cobertura Sanitaria': BarChart3,
  'Demografía de Pacientes': Users,
  'Rendimiento de Brigadas': Siren,
  'Salud Materno-Infantil': HeartPulse,
  'Inmunización y Vacunación': Syringe,
  'Estadísticas de Comunidades': Home,

  // Sub-elementos Mapas
  'Mapa de Calor Epidemiológico': Flame,
  'Mapa de Cobertura': Map,
  'Ubicación de Brigadas': MapPin,
  'Geolocalización Comunitaria': Compass,
  'Zonas Prioritarias': AlertTriangle,

  // Sub-elementos Brigadas
  'Cobertura Terrenal': Map,
  'Brigadas Programadas': CalendarCheck,
  'Historial de Brigadas': History,
  'Resultados y Métricas': Award,

  // Sub-elementos Campañas
  'Campañas Activas': Megaphone,
  'Planificación Estratégica': Calendar,
  'Seguimiento de Avance': CheckCircle2,
  'Resultados e Impacto': LineChart,

  // Sub-elementos Establecimientos
  'Hospitales de Red': Hospital,
  'Unidades de Salud': HeartPulse,
  'Clínicas Comunitarias': Building,
  'Capacidad y Recursos': Boxes,

  // Sub-elementos IA
  'Predicciones de Brotes': Sparkles,
  'Recomendaciones IA': Bot,
  'Análisis de Tendencias IA': TrendingUp,
  'Resúmenes Automatizados': FileText,
  'Consultas Asistidas': Search,

  // Sub-elementos Reportes
  'Informes Ejecutivos': FileText,
  'Reportes Epidemiológicos': FileSpreadsheet,
  'Reportes de Brigadas': Siren,
  'Reportes Personalizados': SlidersHorizontal,
  'Centro de Exportaciones': Download,

  // Sub-elementos Configuración
  'Preferencias del Portal': SlidersHorizontal,
  'Control de Accesos': Lock,
  'Notificaciones y Alertas': BellRing,
  'Auditoría Institucional': Eye,
};

interface AuthoritySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthoritySidebar: React.FC<AuthoritySidebarProps> = ({ isOpen, onClose }) => {
  const authorityGroups: SidebarNavigationGroup[] = AUTHORITY_NAVIGATION.map((navItem) => {
    return {
      groupName: navItem.title,
      items: navItem.children
        ? navItem.children.map((child) => ({
            label: child.title,
            path: child.path,
            icon: ITEM_ICON_MAP[child.title] || ITEM_ICON_MAP[navItem.title] || Activity,
          }))
        : [
            {
              label: navItem.title,
              path: navItem.path,
              icon: ITEM_ICON_MAP[navItem.title] || Activity,
            },
          ],
    };
  });

  return (
    <SidebarGlobal
      isOpen={isOpen}
      onClose={onClose}
      portalSubtitle="Portal Autoridad de Salud"
      groups={authorityGroups}
    />
  );
};

export default AuthoritySidebar;