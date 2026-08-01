/**
 * HeroDashboardPreview.tsx
 * 
 * Vista previa pura (Presentacional):
 * - Controlada por `useHeroInteractions`.
 * - Cero saltos de altura (h-105 sm:h-110 en Tailwind v4).
 * - Transición suave estilo Apple (Cross-fade en posición absoluta).
 */

import AuthorityPanel from "./panels/AuthorityPanel";
import BrigadistaPanel from "./panels/BrigadistaPanel";
import DoctorPanel from "./panels/DoctorPanel";
import PatientPanel from "./panels/PatientPanel";

export interface HeroDashboardPreviewProps {
  activeSlide?: number;
  onSelectSlide?: (index: number) => void;
  isPaused?: boolean;
}

const ROLES = [
  { id: "brigadista", title: "Brigadista", component: BrigadistaPanel },
  { id: "doctor", title: "Doctor", component: DoctorPanel },
  { id: "patient", title: "Paciente", component: PatientPanel },
  { id: "authority", title: "Autoridades", component: AuthorityPanel },
];

const SUB_SECTIONS: Record<number, Array<{ title: string; icon: string; desc: string }>> = {
  0: [
    { title: "Control Territorial", icon: "🗺️", desc: "Zonas asignadas" },
    { title: "Fichas Rápidas", icon: "📝", desc: "Captura offline" },
    { title: "Sincronización P2P", icon: "📡", desc: "Malla local activa" },
  ],
  1: [
    { title: "Estación Clínica", icon: "🩺", desc: "Triaje y signos" },
    { title: "Sugerencia IA", icon: "🤖", desc: "Diagnóstico local" },
    { title: "Recetario", icon: "💊", desc: "Dispensación" },
  ],
  2: [
    { title: "Mi Expediente", icon: "👤", desc: "Historial cifrado" },
    { title: "Prontuario", icon: "🔔", desc: "Citas y alertas" },
    { title: "Código QR", icon: "📱", desc: "Acceso seguro" },
  ],
  3: [
    { title: "Mapa de Salud", icon: "📊", desc: "Vigilancia activa" },
    { title: "Alertas Tempranas", icon: "⚠️", desc: "Control de brotes" },
    { title: "Reportes", icon: "📈", desc: "Estadísticas" },
  ],
};

export default function HeroDashboardPreview({
  activeSlide = 0,
  onSelectSlide,
  isPaused = false,
}: HeroDashboardPreviewProps) {
  const currentSubSections = SUB_SECTIONS[activeSlide] || SUB_SECTIONS[0];

  return (
    <div className="w-full max-w-4xl rounded-2xl sm:rounded-[2.5rem] border border-slate-200/80 bg-white/90 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl overflow-hidden flex flex-col p-3 sm:p-4 md:p-5 antialiased select-none">
      
      {/* Barra superior estilo OS */}
      <div className="flex flex-wrap sm:flex-nowrap shrink-0 items-center justify-between pb-3 border-b border-slate-100 gap-2">
        
        {/* Título y Semáforo OS */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 pl-0.5">
            <span className="size-2 sm:size-2.5 rounded-full bg-rose-400 inline-block" />
            <span className="size-2 sm:size-2.5 rounded-full bg-amber-400 inline-block" />
            <span className="size-2 sm:size-2.5 rounded-full bg-emerald-400 inline-block" />
          </div>
          <span className="text-[11px] sm:text-xs font-black tracking-wider text-slate-800 uppercase ml-0.5 sm:ml-1">
            MedicOS
          </span>
        </div>

        {/* Selector de Roles Principales */}
        <div className="grid grid-cols-4 sm:flex items-center bg-slate-100/90 p-1 rounded-xl sm:rounded-2xl border border-slate-200/60 w-full sm:w-auto gap-0.5">
          {ROLES.map((role, index) => {
            const isActive = activeSlide === index;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => onSelectSlide?.(index)}
                className={`
                  rounded-lg sm:rounded-xl px-1 sm:px-3 py-1.5 text-[9px] min-[380px]:text-[10px] sm:text-xs font-bold tracking-tight transition-all duration-300 cursor-pointer text-center truncate
                  ${
                    isActive
                      ? "bg-teal-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  }
                `}
              >
                {role.title}
              </button>
            );
          })}
        </div>

        {/* Badge Estado En Línea */}
        <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full shrink-0">
          <span className={`size-2 rounded-full bg-teal-500 ${isPaused ? "" : "animate-pulse"}`} />
          <span>{isPaused ? "Pausado" : "En línea"}</span>
        </div>
      </div>

      {/* CUERPO PRINCIPAL */}
      <div className="flex pt-3 gap-3 items-stretch">
        
        {/* Barra lateral izquierda */}
        <div className="hidden lg:flex flex-col w-44 xl:w-48 shrink-0 bg-slate-50/80 rounded-2xl border border-slate-200/60 p-3 gap-2 h-105 sm:h-110 justify-between">
          <div>
            <div className="text-[10px] font-black tracking-widest text-slate-400 px-2 py-0.5 uppercase">
              Secciones
            </div>

            <div className="flex flex-col gap-1.5 mt-1">
              {currentSubSections.map((sub, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-white border border-slate-200/60 shadow-2xs text-slate-700 transition-all duration-300"
                >
                  <span className="text-sm">{sub.icon}</span>
                  <div className="flex flex-col truncate">
                    <span className="text-[11px] font-black tracking-tight text-slate-900 truncate">{sub.title}</span>
                    <span className="text-[9px] font-medium text-slate-400 truncate">{sub.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CONTENEDOR DE PANELES (POSICIÓN ABSOLUTA + TRANSICIÓN DE OPACIDAD) */}
        <div className="relative flex-1 rounded-xl sm:rounded-2xl bg-slate-50/50 border border-slate-200/60 shadow-inner h-105 sm:h-110 overflow-hidden">
          {ROLES.map((role, index) => {
            const isActive = activeSlide === index;
            const Component = role.component;

            return (
              <div
                key={role.id}
                className={`
                  absolute inset-3 sm:inset-4 flex flex-col justify-between transition-all duration-500 ease-in-out
                  ${
                    isActive
                      ? "opacity-100 scale-100 pointer-events-auto z-10"
                      : "opacity-0 scale-95 pointer-events-none z-0"
                  }
                `}
              >
                <Component />
              </div>
            );
          })}
        </div>

      </div>

      {/* Paginador inferior */}
      <div className="flex shrink-0 items-center justify-center gap-1.5 pt-3">
        {ROLES.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelectSlide?.(index)}
            aria-label={`Ir al rol ${index + 1}`}
            className={`
              h-1.5 rounded-full transition-all duration-300 cursor-pointer
              ${
                activeSlide === index
                  ? "w-6 bg-teal-600"
                  : "w-1.5 bg-slate-300 hover:bg-slate-400"
              }
            `}
          />
        ))}
      </div>

    </div>
  );
}