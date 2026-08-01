/**
 * HeroWidgets.tsx
 * 
 * Tarjetas de información dinámica con diseño minimalista inspirado en Apple Health y efecto interactivo de cursor.
 */

import React, { useState } from "react";

interface HeroWidgetsProps {
  activeSlide?: number;
}

interface WidgetItem {
  icon: string;
  title: string;
  value: string;
  description: string;
  accentColor: string;
  bgAccent: string;
}

const WIDGETS_DATA: Record<number, Array<WidgetItem>> = {
  0: [
    { icon: "📍", title: "Brigadas en Terreno", value: "18 Activas", description: "Despliegue operativo en comunidades rurales de difícil acceso.", accentColor: "text-emerald-700", bgAccent: "bg-emerald-100/90 border-emerald-200" },
    { icon: "📋", title: "Fichas Capturadas", value: "320 Hoy", description: "Registros médicos locales sincronizados en dispositivos móviles.", accentColor: "text-teal-700", bgAccent: "bg-teal-100/90 border-teal-200" },
    { icon: "📶", title: "Estado de Red P2P", value: "99.8%", description: "Conectividad malla operando de forma autónoma sin internet.", accentColor: "text-cyan-700", bgAccent: "bg-cyan-100/90 border-cyan-200" }
  ],
  1: [
    { icon: "🩺", title: "Consultas Médicas", value: "48 Hoy", description: "Atenciones clínicas registradas y diagnosticadas en la jornada.", accentColor: "text-teal-700", bgAccent: "bg-teal-100/90 border-teal-200" },
    { icon: "🤖", title: "Asistencia IA Local", value: "94% Éxito", description: "Sugerencias de triaje y protocolos médicos offline activos.", accentColor: "text-indigo-700", bgAccent: "bg-indigo-100/90 border-indigo-200" },
    { icon: "💊", title: "Recetas Emitidas", value: "112 Fichas", description: "Control y dispensación farmacéutica trazada localmente.", accentColor: "text-amber-700", bgAccent: "bg-amber-100/90 border-amber-200" }
  ],
  2: [
    { icon: "👤", title: "Expediente Único", value: "Seguro", description: "Historial clínico completo cifrado directamente en el dispositivo.", accentColor: "text-blue-700", bgAccent: "bg-blue-100/90 border-blue-200" },
    { icon: "🔔", title: "Prontuario y Alertas", value: "Al Día", description: "Recordatorios de tratamientos y citas médicas programadas.", accentColor: "text-rose-700", bgAccent: "bg-rose-100/90 border-rose-200" },
    { icon: "🔒", title: "Privacidad de Datos", value: "Local Only", description: "La información médica no sale del entorno del paciente sin autorización.", accentColor: "text-emerald-700", bgAccent: "bg-emerald-100/90 border-emerald-200" }
  ],
  3: [
    { icon: "📊", title: "Mapa Epidemiológico", value: "Tiempo Real", description: "Vigilancia activa de indicadores de salud a nivel territorial.", accentColor: "text-teal-700", bgAccent: "bg-teal-100/90 border-teal-200" },
    { icon: "⚠️", title: "Alertas Tempranas", value: "0 Riesgo", description: "Monitoreo preventivo de brotes en sectores prioritarios.", accentColor: "text-amber-700", bgAccent: "bg-amber-100/90 border-amber-200" },
    { icon: "📈", title: "Reportes Automatizados", value: "Listos", description: "Consolidación de estadísticas poblacionales para toma de decisiones.", accentColor: "text-sky-700", bgAccent: "bg-sky-100/90 border-sky-200" }
  ]
};

// Componente individual para cumplir con las reglas de Hooks de React
function WidgetCard({ widget }: { widget: WidgetItem }) {
  const [coords, setCoords] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setCoords((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group rounded-3xl border border-teal-200/80 bg-linear-to-br from-teal-950/6 via-teal-900/12 to-cyan-950/6 backdrop-blur-xl px-5 py-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-36.25 max-h-36.25 relative overflow-hidden shrink-0 cursor-default"
    >
      {/* Destello de luz interactivo que sigue el cursor */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-3xl"
        style={{
          opacity: coords.opacity,
          background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(20, 184, 166, 0.18), transparent 70%)`,
        }}
      />

      <div className="flex items-center justify-between relative z-10">
        <div className={`size-10 rounded-2xl ${widget.bgAccent} flex items-center justify-center text-lg shadow-xs group-hover:scale-110 transition-transform duration-300`}>
          {widget.icon}
        </div>
        <span className={`text-xs font-black px-3 py-1 rounded-full ${widget.bgAccent} ${widget.accentColor} shadow-2xs`}>
          {widget.value}
        </span>
      </div>

      <div className="relative z-10">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider truncate">
          {widget.title}
        </h3>
        <p className="text-xs font-medium text-slate-600 mt-0.5 leading-snug line-clamp-2">
          {widget.description}
        </p>
      </div>
    </div>
  );
}

export default function HeroWidgets({ activeSlide = 0 }: HeroWidgetsProps) {
  const currentWidgets = WIDGETS_DATA[activeSlide] || WIDGETS_DATA[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-teal-950/10 pt-4 transition-all duration-300">
      {currentWidgets.map((widget, index) => (
        <WidgetCard key={`${activeSlide}-${index}`} widget={widget} />
      ))}
    </div>
  );
}