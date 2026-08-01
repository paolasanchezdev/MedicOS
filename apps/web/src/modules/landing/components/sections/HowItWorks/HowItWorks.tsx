/* ==========================================================================
   HowItWorks.tsx - Rediseño con arquitectura limpia y flujo narrativo
   ========================================================================== */

import React from "react";

interface StepItem {
  step: string;
  badge: string;
  title: string;
  description: string;
  techHighlight: string;
  imageSrc: string;
}

const STEPS: StepItem[] = [
  {
    step: "01",
    badge: "DESPLIEGUE INICIAL",
    title: "La brigada llega a la comunidad",
    description:
      "El equipo médico despliega la MedicOS Station (servidor portátil en hardware local como Raspberry Pi) y enciende la red WiFi local sin depender de señal celular ni internet.",
    techHighlight: "Red Local Operativa",
    imageSrc: "/images/step-01.png",
  },
  {
    step: "02",
    badge: "CONEXIÓN LOCAL",
    title: "Sincronización instantánea en campo",
    description:
      "El personal médico y los pacientes se conectan de manera inalámbrica y segura desde cualquier dispositivo móvil o tablet sin necesidad de descargas ni datos móviles.",
    techHighlight: "Acceso Inalámbrico PWA",
    imageSrc: "/images/step-02.png",
  },
  {
    step: "03",
    badge: "ATENCIÓN ASISTIDA",
    title: "Registro clínico estructurado",
    description:
      "Se registran consultas, antecedentes y signos vitales directamente en la base de datos local cifrada, garantizando la privacidad y disponibilidad absoluta.",
    techHighlight: "Gestión DB Segura",
    imageSrc: "/images/step-03.png",
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="relative w-full py-16 sm:py-24 bg-slate-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 1. ENCABEZADO PRINCIPAL */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-teal-50 text-teal-800 border border-teal-200/60 mb-4 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            Flujo de Operación
          </span>
          
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mb-4">
            La atención continúa, incluso cuando la{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#04635C] to-teal-500">
              conexión no.
            </span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-normal">
            MedicOS conecta a brigadistas, pacientes y personal médico en un flujo diseñado para funcionar en comunidades con acceso a Internet nulo o limitado.
          </p>
        </div>

        {/* 2. BANDA DE ARQUITECTURA TÉCNICA (Sintetizada en un strip minimalista) */}
        <div className="max-w-4xl mx-auto mb-14 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="flex items-center gap-3 p-2 sm:px-4">
              <span className="text-xl p-2 rounded-xl bg-teal-50 text-teal-700">💻</span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Estación MedicOS</h4>
                <p className="text-[11px] text-slate-500 leading-tight">Servidor portátil en hardware local</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-2 sm:px-4">
              <span className="text-xl p-2 rounded-xl bg-teal-50 text-teal-700">📡</span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Red Local PWA</h4>
                <p className="text-[11px] text-slate-500 leading-tight">Sin instalación ni consumo de datos</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 sm:px-4">
              <span className="text-xl p-2 rounded-xl bg-teal-50 text-teal-700">🔒</span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Base de Datos Cifrada</h4>
                <p className="text-[11px] text-slate-500 leading-tight">Resguardo seguro antes del envío</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. SECUENCIA PASO A PASO (Conectores dinámicos) */}
        <div className="relative">
          {/* Línea conectora horizontal solo para desktop */}
          <div 
            aria-hidden="true" 
            className="hidden lg:block absolute top-10 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-teal-200 via-teal-400 to-teal-200 z-0" 
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 relative z-10">
            {STEPS.map((item, index) => (
              <div
                key={index}
                className="group relative flex flex-col justify-between bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-xl hover:border-teal-500/30 transition-all duration-300"
              >
                <div>
                  {/* Header de paso con número resaltado y badge */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="w-10 h-10 rounded-2xl bg-[#04635C] text-white font-mono font-bold flex items-center justify-center text-sm shadow-sm group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200/60">
                      {item.badge}
                    </span>
                  </div>

                  {/* Mockup / Imagen flotante (sin recuadro encajonado) */}
                  <div className="w-full h-44 mb-5 flex items-center justify-center p-2">
                    <img
                      src={item.imageSrc}
                      alt={item.title}
                      className="max-h-full max-w-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Textos descriptivos */}
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mb-2 group-hover:text-[#04635C] transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Footer técnico limpio */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-semibold text-[#04635C]">
                  <span>{item.techHighlight}</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;