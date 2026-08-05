// apps/web/src/portals/patient/navigation/patient.navigation.ts
import {
  LayoutDashboard, HeartPulse, Activity, Pill, ShieldAlert, FileText,
  Syringe, Baby, FolderOpen, CalendarCheck, History, Stethoscope,
  FileSpreadsheet, ClipboardList, Sparkles, Brain, MessageSquare,
  Lightbulb, GraduationCap, Users, UserPlus, ShieldCheck, Clock,
  QrCode, Bell, User, PhoneCall, Shield, Smartphone, Lock, EyeOff, Sliders
} from 'lucide-react';

export const PATIENT_NAVIGATION = [
  {
    title: 'DASHBOARD',
    items: [
      { name: 'Resumen General', path: '/paciente/dashboard/resumen', icon: LayoutDashboard },
    ],
  },
  {
    title: 'MI SALUD Y EXPEDIENTE',
    items: [
      { name: 'Resumen de Salud', path: '/paciente/salud/resumen', icon: HeartPulse },
      { name: 'Signos Vitales', path: '/paciente/salud/signos-vitales', icon: Activity },
      { name: 'Medicamentos Activos', path: '/paciente/salud/medicamentos', icon: Pill },
      { name: 'Alergias y Reacciones', path: '/paciente/salud/alergias', icon: ShieldAlert },
      { name: 'Enfermedades Crónicas', path: '/paciente/salud/enfermedades-cronicas', icon: FileText },
      { name: 'Historial de Vacunación', path: '/paciente/salud/vacunas', icon: Syringe },
      { name: 'Control de Embarazo', path: '/paciente/salud/embarazo', icon: Baby },
      { name: 'Documentos Médicos', path: '/paciente/salud/documentos', icon: FolderOpen },
    ],
  },
  {
    title: 'CONSULTAS Y ATENCIÓN',
    items: [
      { name: 'Próximas Citas', path: '/paciente/consultas/proximas', icon: CalendarCheck },
      { name: 'Historial de Consultas', path: '/paciente/consultas/historial', icon: History },
      { name: 'Diagnósticos Médicos', path: '/paciente/consultas/diagnosticos', icon: Stethoscope },
      { name: 'Recetas Médicas', path: '/paciente/consultas/recetas', icon: FileSpreadsheet },
      { name: 'Órdenes Médicas', path: '/paciente/consultas/ordenes-medicas', icon: ClipboardList },
      { name: 'Seguimientos Médicos', path: '/paciente/consultas/seguimientos', icon: Clock },
    ],
  },
  {
    title: 'ASISTENTE IA',
    items: [
      { name: 'Chat con IA', path: '/paciente/asistente-ia/chat', icon: Sparkles },
      { name: 'Evaluación Rápida', path: '/paciente/asistente-ia/evaluacion-rapida', icon: Brain },
      { name: 'Registro de Síntomas', path: '/paciente/asistente-ia/sintomas', icon: MessageSquare },
      { name: 'Recomendaciones', path: '/paciente/asistente-ia/recomendaciones', icon: Lightbulb },
      { name: 'Educación en Salud', path: '/paciente/asistente-ia/educacion', icon: GraduationCap },
    ],
  },
  {
    title: 'GESTIÓN FAMILIAR',
    items: [
      { name: 'Pacientes a Cargo', path: '/paciente/familia/pacientes-a-cargo', icon: Users },
      { name: 'Miembros de Familia', path: '/paciente/familia/miembros', icon: Users },
      { name: 'Autorizaciones', path: '/paciente/familia/autorizaciones', icon: ShieldCheck },
      { name: 'Solicitudes Pendientes', path: '/paciente/familia/solicitudes', icon: UserPlus },
    ],
  },
  {
    title: 'IDENTIFICACIÓN',
    items: [
      { name: 'Credencial QR Digital', path: '/paciente/qr/credencial', icon: QrCode },
    ],
  },
  {
    title: 'NOTIFICACIONES',
    items: [
      { name: 'Bandeja de Entrada', path: '/paciente/notificaciones/bandeja', icon: Bell },
    ],
  },
  {
    title: 'PERFIL Y AJUSTES',
    items: [
      { name: 'Datos Personales', path: '/paciente/perfil/datos-personales', icon: User },
      { name: 'Información de Emergencia', path: '/paciente/perfil/emergencias', icon: ShieldAlert },
      { name: 'Contactos de Emergencia', path: '/paciente/perfil/contactos', icon: PhoneCall },
      { name: 'Seguro Médico', path: '/paciente/perfil/seguro-medico', icon: Shield },
      { name: 'Dispositivos Vinculados', path: '/paciente/perfil/dispositivos', icon: Smartphone },
      { name: 'Seguridad de Cuenta', path: '/paciente/perfil/seguridad', icon: Lock },
      { name: 'Privacidad y Datos', path: '/paciente/perfil/privacidad', icon: EyeOff },
      { name: 'Preferencias del Sistema', path: '/paciente/perfil/preferencias', icon: Sliders },
    ],
  },
];