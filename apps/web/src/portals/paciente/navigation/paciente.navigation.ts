import { 
  Home, 
  Activity, 
  Calendar, 
  Video, 
  FileText, 
  ShieldAlert, 
  Pill, 
  Clock, 
  TestTube2, 
  FileSearch, 
  HeartPulse, 
  Bot, 
  BookOpen, 
  Sparkles, 
  Baby, 
  FolderDown, 
  Bell, 
  MessageSquare, 
  User, 
  PhoneCall, 
  Settings, 
  Lock,
  type LucideIcon
} from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export interface NavGroup {
  groupName: string;
  items: NavItem[];
}

export const PACIENTE_NAVIGATION: NavGroup[] = [
  {
    groupName: 'Dashboard',
    items: [
      { label: 'Resumen General', path: '/paciente/dashboard/resumen', icon: Home },
      { label: 'Mi Actividad', path: '/paciente/dashboard/actividad', icon: Activity },
    ],
  },
  {
    groupName: 'Citas Médicas',
    items: [
      { label: 'Mis Citas', path: '/paciente/citas/mis-citas', icon: Calendar },
      { label: 'Agendar Cita', path: '/paciente/citas/agendar', icon: Calendar },
      { label: 'Telemedicina', path: '/paciente/citas/telemedicina', icon: Video },
    ],
  },
  {
    groupName: 'Expediente Clínico',
    items: [
      { label: 'Historial Consultas', path: '/paciente/expediente/consultas', icon: FileText },
      { label: 'Diagnósticos', path: '/paciente/expediente/diagnosticos', icon: FileText },
      { label: 'Alergias y Antecedentes', path: '/paciente/expediente/alergias-antecedentes', icon: ShieldAlert },
      { label: 'Vacunas', path: '/paciente/expediente/vacunas', icon: Activity },
    ],
  },
  {
    groupName: 'Tratamientos y Recetas',
    items: [
      { label: 'Recetas Activas', path: '/paciente/tratamientos/recetas-activas', icon: Pill },
      { label: 'Recordatorios de Tomas', path: '/paciente/tratamientos/recordatorios', icon: Clock },
      { label: 'Historial Medicamentos', path: '/paciente/tratamientos/historial-medicamentos', icon: Pill },
    ],
  },
  {
    groupName: 'Estudios y Salud',
    items: [
      { label: 'Resultados Laboratorio', path: '/paciente/estudios/resultados-laboratorio', icon: TestTube2 },
      { label: 'Estudios de Imagen', path: '/paciente/estudios/estudios-imagen', icon: FileSearch },
      { label: 'Signos Vitales', path: '/paciente/monitoreo/signos-vitales', icon: HeartPulse },
      { label: 'Estilo de Vida', path: '/paciente/monitoreo/habitos-estilo-vida', icon: Activity },
    ],
  },
  {
    groupName: 'Asistente IA & Educación',
    items: [
      { label: 'Asistente de Salud IA', path: '/paciente/educacion-ia/asistente', icon: Bot },
      { label: 'Consejos Personalizados', path: '/paciente/educacion-ia/consejos-personalizados', icon: Sparkles },
      { label: 'Artículos Educativos', path: '/paciente/educacion-ia/articulos', icon: BookOpen },
    ],
  },
  {
    groupName: 'Salud Materna',
    items: [
      { label: 'Control de Embarazo', path: '/paciente/salud-materna/control-embarazo', icon: Baby },
      { label: 'Citas Prenatales', path: '/paciente/salud-materna/citas-prenatales', icon: Calendar },
      { label: 'Diario de Síntomas', path: '/paciente/salud-materna/diario-sintomas', icon: FileText },
    ],
  },
  {
    groupName: 'Documentos & Notificaciones',
    items: [
      { label: 'Constancias Médicas', path: '/paciente/documentos/constancias', icon: FileText },
      { label: 'Descarga Expediente', path: '/paciente/documentos/descarga-expediente', icon: FolderDown },
      { label: 'Centro Notificaciones', path: '/paciente/notificaciones/centro', icon: Bell },
      { label: 'Mensajes con Médico', path: '/paciente/notificaciones/mensajes-medico', icon: MessageSquare },
    ],
  },
  {
    groupName: 'Perfil y Configuración',
    items: [
      { label: 'Datos Personales', path: '/paciente/perfil/datos-personales', icon: User },
      { label: 'Contactos Emergencia', path: '/paciente/perfil/contactos-emergencia', icon: PhoneCall },
      { label: 'Preferencias', path: '/paciente/perfil/preferencias', icon: Settings },
      { label: 'Seguridad', path: '/paciente/perfil/seguridad', icon: Lock },
    ],
  },
];