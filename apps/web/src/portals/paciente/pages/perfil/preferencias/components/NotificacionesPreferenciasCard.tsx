// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/preferencias/components/NotificacionesPreferenciasCard.tsx
// DESCRIPCIÓN: Preferencias clínicas, de tratamientos, prevención y canales con íconos iOS.
// =========================================================================

import React from 'react';
import { 
  Bell, 
  Calendar, 
  FlaskConical, 
  Stethoscope, 
  FileText, 
  Pill, 
  Clock, 
  HeartPulse, 
  Syringe, 
  Sparkles, 
  LayoutDashboard, 
  Mail 
} from 'lucide-react';
import { PreferenciasSection } from './PreferenciasSection.js';
import { PreferenciaRow } from './PreferenciaRow.js';
import { PreferenciaToggle } from './PreferenciaToggle.js';
import type { PatientAppPreferences } from '../../../../../../modules/patients/types/patient-preferences.types.js';

interface NotificacionesPreferenciasCardProps {
  preferences: PatientAppPreferences;
  onUpdate: <K extends keyof PatientAppPreferences>(key: K, value: PatientAppPreferences[K]) => void;
}

export const NotificacionesPreferenciasCard: React.FC<NotificacionesPreferenciasCardProps> = ({
  preferences,
  onUpdate,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Citas y Atención Clínica */}
      <PreferenciasSection
        title="Atención Médica y Citas"
        footerNote="Los avisos relacionados con emergencias vitales se mantendrán siempre activos por protocolo sanitario."
      >
        <PreferenciaRow
          title="Notificaciones generales"
          description="Avisos sobre el estado de tus consultas y comunicados importantes."
          icon={Bell}
          iconBg="bg-teal-50"
          iconColor="text-[#105F68]"
        >
          <PreferenciaToggle
            checked={preferences.notificacionesGenerales}
            onChange={(val) => onUpdate('notificacionesGenerales', val)}
            label="Alternar notificaciones generales"
          />
        </PreferenciaRow>

        <PreferenciaRow
          title="Recordatorios de citas"
          description="Avisos anticipados con fecha, hora y sede de tus próximas citas médicas."
          icon={Calendar}
          iconBg="bg-sky-50"
          iconColor="text-sky-600"
        >
          <PreferenciaToggle
            checked={preferences.recordatoriosCitas}
            onChange={(val) => onUpdate('recordatoriosCitas', val)}
            label="Alternar recordatorios de citas"
          />
        </PreferenciaRow>

        <PreferenciaRow
          title="Resultados disponibles"
          description="Avisos cuando tus exámenes de laboratorio o estudios de imagen estén listos."
          icon={FlaskConical}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
        >
          <PreferenciaToggle
            checked={preferences.resultadosDisponibles}
            onChange={(val) => onUpdate('resultadosDisponibles', val)}
            label="Alternar resultados disponibles"
          />
        </PreferenciaRow>

        <PreferenciaRow
          title="Mensajes de tu médico"
          description="Indicaciones clínicas o respuestas directas enviadas por tu médico tratante."
          icon={Stethoscope}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-700"
        >
          <PreferenciaToggle
            checked={preferences.mensajesMedico}
            onChange={(val) => onUpdate('mensajesMedico', val)}
            label="Alternar mensajes médicos"
          />
        </PreferenciaRow>

        <PreferenciaRow
          title="Documentos clínicos"
          description="Avisos cuando se emita una nueva constancia, carnet o resumen clínico."
          icon={FileText}
          iconBg="bg-slate-100"
          iconColor="text-slate-700"
        >
          <PreferenciaToggle
            checked={preferences.documentosDisponibles}
            onChange={(val) => onUpdate('documentosDisponibles', val)}
            label="Alternar documentos clínicos"
          />
        </PreferenciaRow>
      </PreferenciasSection>

      {/* 2. Tratamientos y Medicación */}
      <PreferenciasSection
        title="Tratamientos y Fármacos"
        footerNote="MedicOS sincroniza las tomas de medicamentos según el horario establecido en tu receta activa."
      >
        <PreferenciaRow
          title="Recordatorios de tomas de medicamentos"
          description="Alertas puntuales en cada horario según la prescripción de tu receta."
          icon={Pill}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        >
          <PreferenciaToggle
            checked={preferences.recordatoriosTomas}
            onChange={(val) => onUpdate('recordatoriosTomas', val)}
            label="Alternar recordatorios de tomas"
          />
        </PreferenciaRow>

        <PreferenciaRow
          title="Aviso de finalización de receta"
          description="Alerta preventiva cuando tu tratamiento esté próximo a finalizar para programar renovación."
          icon={Clock}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
        >
          <PreferenciaToggle
            checked={preferences.avisoFinalizacionReceta}
            onChange={(val) => onUpdate('avisoFinalizacionReceta', val)}
            label="Alternar aviso de finalización de receta"
          />
        </PreferenciaRow>
      </PreferenciasSection>

      {/* 3. Monitoreo y Salud Preventiva */}
      <PreferenciasSection
        title="Monitoreo y Salud Preventiva"
        footerNote="Las alertas de signos vitales se activan cuando un registro supera los umbrales seguros."
      >
        <PreferenciaRow
          title="Alertas de seguimiento en signos vitales"
          description="Avisos si tu presión arterial, glucosa o frecuencia cardíaca requieren revisión."
          icon={HeartPulse}
          iconBg="bg-rose-50"
          iconColor="text-rose-600"
        >
          <PreferenciaToggle
            checked={preferences.alertasSignosVitales}
            onChange={(val) => onUpdate('alertasSignosVitales', val)}
            label="Alternar alertas de signos vitales"
          />
        </PreferenciaRow>

        <PreferenciaRow
          title="Esquema Nacional de Vacunación"
          description="Recordatorios de dosis pendientes según el calendario oficial del MINSAL."
          icon={Syringe}
          iconBg="bg-teal-50"
          iconColor="text-[#166E7A]"
        >
          <PreferenciaToggle
            checked={preferences.recordatoriosVacunacion}
            onChange={(val) => onUpdate('recordatoriosVacunacion', val)}
            label="Alternar recordatorios de vacunación"
          />
        </PreferenciaRow>

        <PreferenciaRow
          title="Consejos de salud preventiva con IA"
          description="Sugerencias y artículos personalizados según tu perfil y controles médicos."
          icon={Sparkles}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        >
          <PreferenciaToggle
            checked={preferences.consejosSaludIA}
            onChange={(val) => onUpdate('consejosSaludIA', val)}
            label="Alternar consejos con IA"
          />
        </PreferenciaRow>
      </PreferenciasSection>

      {/* 4. Canales de Entrega */}
      <PreferenciasSection title="Canales de Notificación">
        <PreferenciaRow
          title="Campana dentro de MedicOS"
          description="Avisos interactivos en la barra superior de tu portal de salud."
          icon={LayoutDashboard}
          iconBg="bg-teal-50"
          iconColor="text-[#105F68]"
        >
          <PreferenciaToggle
            checked={preferences.canalInApp}
            onChange={(val) => onUpdate('canalInApp', val)}
            label="Alternar canal interno"
          />
        </PreferenciaRow>

        <PreferenciaRow
          title="Correo electrónico"
          description="Recepción de resúmenes y confirmaciones en tu bandeja de entrada."
          icon={Mail}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        >
          <PreferenciaToggle
            checked={preferences.canalEmail}
            onChange={(val) => onUpdate('canalEmail', val)}
            label="Alternar canal de correo"
          />
        </PreferenciaRow>
      </PreferenciasSection>
    </div>
  );
};

export default NotificacionesPreferenciasCard;