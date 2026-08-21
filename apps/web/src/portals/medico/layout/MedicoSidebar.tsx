import React from 'react';
import { SidebarGlobal, type SidebarNavigationGroup } from '../../../shared/components/sidebar/SidebarGlobal';
import { MEDICO_NAVIGATION } from '../navigation/medico.navigation';
import {
  LayoutDashboard,
  Calendar,
  Activity,
  ClipboardList,
  Stethoscope,
  FilePlus2,
  History,
  FileSearch,
  HeartPulse,
  FileText,
  Eye,
  MessageSquare,
  FileSpreadsheet,
  Pill,
  Receipt,
  TestTube,
  FileBarChart,
  ImageIcon,
  ShieldAlert,
  Syringe,
  Baby,
  UserCheck,
  QrCode,
  Search,
  Users,
  BarChart2,
  Siren,
  Brain,
  Bell,
  Inbox,
  User,
  Award,
  Sliders,
  Shield,
  Clock
} from 'lucide-react';

const ITEM_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  // Secciones Principales
  'Dashboard': LayoutDashboard,
  'Consultas': Calendar,
  'Evaluación': HeartPulse,
  'Diagnósticos': Stethoscope,
  'Tratamientos': Pill,
  'Recetas': Receipt,
  'Estudios': TestTube,
  'Expediente': FileText,
  'Salud Materna': Baby,
  'Pacientes': Users,
  'Reportes': BarChart2,
  'IA Asistente': Brain,
  'Notificaciones': Bell,
  'Perfil': User,

  // Sub-elementos Dashboard
  'Resumen': LayoutDashboard,
  'Agenda Médica': Calendar,
  'Alertas Clínicas': ShieldAlert,
  'Actividad': Clock,

  // Sub-elementos Consultas
  'Nueva Consulta': FilePlus2,
  'Agenda de Consultas': Calendar,
  'Historial': History,
  'Seguimiento': Activity,

  // Sub-elementos Evaluación
  'Signos Vitales': HeartPulse,
  'Anamnesis': ClipboardList,
  'Examen Físico': Eye,
  'Observaciones Clínicas': MessageSquare,

  // Sub-elementos Diagnósticos
  'Nuevo Diagnóstico': FilePlus2,
  'Catálogo ICD': FileSpreadsheet,

  // Sub-elementos Tratamientos
  'Plan de Tratamiento': FileText,
  'Medicamentos': Pill,

  // Sub-elementos Recetas
  'Recetas Activas': Receipt,
  'Nueva Receta': FilePlus2,

  // Sub-elementos Estudios
  'Solicitar Estudio': FilePlus2,
  'Resultados de Estudios': FileBarChart,
  'Laboratorio': TestTube,
  'Imagenología': ImageIcon,

  // Sub-elementos Expediente
  'Antecedentes y Alergias': ShieldAlert,
  'Vacunas': Syringe,

  // Sub-elementos Salud Materna
  'Control de Embarazo': Baby,
  'Controles Prenatales': HeartPulse,
  'Seguimiento Materno': Activity,

  // Sub-elementos Pacientes
  'Listado de Pacientes': UserCheck,
  'Buscar Paciente': Search,
  'Lector QR': QrCode,

  // Sub-elementos Reportes
  'Reporte de Consultas': FileBarChart,
  'Reporte de Pacientes': Users,
  'Reportes Clínicos': BarChart2,
  'Reporte de Brigadas': Siren,

  // Sub-elementos IA
  'Asistente Clínico': Brain,
  'Análisis IA': FileSearch,
  'Alertas IA': ShieldAlert,
  'Historial de Análisis': History,

  // Sub-elementos Notificaciones
  'Centro de Notificaciones': Inbox,
  'Alertas': ShieldAlert,
  'Mensajes': MessageSquare,

  // Sub-elementos Perfil
  'Datos Profesionales': Award,
  'Especialidad': Stethoscope,
  'Preferencias': Sliders,
  'Seguridad': Shield,
};

interface MedicoSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MedicoSidebar: React.FC<MedicoSidebarProps> = ({ isOpen, onClose }) => {
  const medicoGroups: SidebarNavigationGroup[] = MEDICO_NAVIGATION.map((navItem) => {
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
      portalSubtitle="Portal Médico"
      groups={medicoGroups}
    />
  );
};

export default MedicoSidebar;