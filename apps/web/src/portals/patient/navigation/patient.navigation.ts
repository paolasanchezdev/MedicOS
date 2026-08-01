// apps/web/src/portals/patient/navigation/patient.navigation.ts
import { 
  LayoutDashboard, 
  MessageSquare, 
  BookOpen, 
  Sparkles, 
  Lightbulb, 
  Stethoscope, 
  ClipboardList, 
  History, 
  FileCheck, 
  Calendar, 
  Receipt, 
  Clock, 
  Users, 
  ShieldAlert, 
  UserCheck, 
  Send, 
  Inbox, 
  User, 
  Phone, 
  Smartphone, 
  Siren, 
  Sliders, 
  Lock, 
  Shield, 
  CreditCard, 
  QrCode, 
  HeartPulse, 
  AlertCircle, 
  FileText, 
  Baby, 
  Activity, 
  Pill, 
  Syringe 
} from 'lucide-react';

export const PATIENT_NAVIGATION = [
  {
    title: 'DASHBOARD',
    items: [
      { name: 'Resumen', path: '/paciente/dashboard/resumen', icon: LayoutDashboard },
    ],
  },
  {
    title: 'ASISTENTE IA',
    items: [
      { name: 'Chat', path: '/paciente/asistente-ia/chat', icon: MessageSquare },
      { name: 'Educación', path: '/paciente/asistente-ia/educacion', icon: BookOpen },
      { name: 'Evaluación Rápida', path: '/paciente/asistente-ia/evaluacion-rapida', icon: Sparkles },
      { name: 'Recomendaciones', path: '/paciente/asistente-ia/recomendaciones', icon: Lightbulb },
      { name: 'Síntomas', path: '/paciente/asistente-ia/sintomas', icon: Stethoscope },
    ],
  },
  {
    title: 'CONSULTAS',
    items: [
      { name: 'Diagnósticos', path: '/paciente/consultas/diagnosticos', icon: ClipboardList },
      { name: 'Historial', path: '/paciente/consultas/historial', icon: History },
      { name: 'Órdenes Médicas', path: '/paciente/consultas/ordenes-medicas', icon: FileCheck },
      { name: 'Próximas Citas', path: '/paciente/consultas/proximas', icon: Calendar },
      { name: 'Recetas', path: '/paciente/consultas/recetas', icon: Receipt },
      { name: 'Seguimientos', path: '/paciente/consultas/seguimientos', icon: Clock },
    ],
  },
  {
    title: 'FAMILIA',
    items: [
      { name: 'Autorizaciones', path: '/paciente/familia/autorizaciones', icon: ShieldAlert },
      { name: 'Miembros', path: '/paciente/familia/miembros', icon: Users },
      { name: 'Pacientes a Cargo', path: '/paciente/familia/pacientes-a-cargo', icon: UserCheck },
      { name: 'Solicitudes', path: '/paciente/familia/solicitudes', icon: Send },
    ],
  },
  {
    title: 'NOTIFICACIONES',
    items: [
      { name: 'Bandeja', path: '/paciente/notificaciones/bandeja', icon: Inbox },
    ],
  },
  {
    title: 'PERFIL',
    items: [
      { name: 'Contactos', path: '/paciente/perfil/contactos', icon: Phone },
      { name: 'Datos Personales', path: '/paciente/perfil/datos-personales', icon: User },
      { name: 'Dispositivos', path: '/paciente/perfil/dispositivos', icon: Smartphone },
      { name: 'Emergencias', path: '/paciente/perfil/emergencias', icon: Siren },
      { name: 'Preferencias', path: '/paciente/perfil/preferencias', icon: Sliders },
      { name: 'Privacidad', path: '/paciente/perfil/privacidad', icon: Lock },
      { name: 'Seguridad', path: '/paciente/perfil/seguridad', icon: Shield },
      { name: 'Seguro Médico', path: '/paciente/perfil/seguro-medico', icon: CreditCard },
    ],
  },
  {
    title: 'QR',
    items: [
      { name: 'Credencial QR', path: '/paciente/qr/credencial', icon: QrCode },
    ],
  },
  {
    title: 'SALUD',
    items: [
      { name: 'Alergias', path: '/paciente/salud/alergias', icon: AlertCircle },
      { name: 'Documentos', path: '/paciente/salud/documentos', icon: FileText },
      { name: 'Embarazo', path: '/paciente/salud/embarazo', icon: Baby },
      { name: 'Enfermedades Crónicas', path: '/paciente/salud/enfermedades-cronicas', icon: HeartPulse },
      { name: 'Medicamentos', path: '/paciente/salud/medicamentos', icon: Pill },
      { name: 'Resumen de Salud', path: '/paciente/salud/resumen', icon: Activity },
      { name: 'Signos Vitales', path: '/paciente/salud/signos-vitales', icon: Activity },
      { name: 'Vacunas', path: '/paciente/salud/vacunas', icon: Syringe },
    ],
  },
];