/**
 * PatientPanel.tsx
 *
 * Vista previa del portal paciente de MedicOS.
 * Diseñado con bloques horizontales y grilla adaptativa para
 * garantizar legibilidad en móviles, tablets y escritorio.
 */

export default function PatientPanel() {
  return (
    <div className="relative w-full h-full flex flex-col justify-between gap-2 text-slate-800 antialiased select-none">
      
      {/* HEADER DEL PANEL */}
      <div className="flex items-center justify-between shrink-0 border-b border-slate-100 pb-1.5">
        <div className="min-w-0 pr-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-teal-700 block leading-none truncate">
            Portal Paciente
          </span>
          <h3 className="text-xs sm:text-sm font-black tracking-tight text-slate-900 leading-tight truncate mt-0.5">
            Mi Salud Digital
          </h3>
        </div>

        {/* Badge Seguridad */}
        <div className="inline-flex items-center gap-1 rounded-full border border-teal-600/20 bg-teal-50 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-teal-800 shrink-0">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Protegido</span>
        </div>
      </div>

      {/* BLOQUE SUPERIOR: HEALTH PASS (Tarjeta Wallet) */}
      <div className="shrink-0 rounded-xl border border-teal-600/20 bg-linear-to-br from-teal-800 via-teal-900 to-slate-900 p-2.5 text-white shadow-xs">
        <div className="flex items-center justify-between gap-2">
          
          {/* Info Paciente */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 border border-white/20 font-black text-xs text-white shadow-xs">
              MG
            </div>
            <div className="min-w-0 truncate">
              <div className="flex items-center gap-1.5 truncate">
                <h4 className="text-xs sm:text-sm font-black text-white tracking-tight truncate">
                  María González
                </h4>
                <span className="text-[9px] font-extrabold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-1 py-0.2 rounded shrink-0">
                  ● O+
                </span>
              </div>
              <p className="text-[10px] font-semibold text-teal-200/80 truncate mt-0.5">
                Exp. #MED-8921-X
              </p>
            </div>
          </div>

          {/* Badge QR Wallet */}
          <div className="flex items-center gap-1.5 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15 px-2 py-1 shrink-0">
            <div className="size-4.5 bg-white rounded-xs p-0.5 grid grid-cols-2 gap-0.5 shrink-0">
              <div className="bg-slate-900 rounded-xs" />
              <div className="bg-slate-900 rounded-xs" />
              <div className="bg-slate-900 rounded-xs" />
              <div className="bg-teal-500 rounded-xs" />
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-[8px] font-bold uppercase tracking-wider text-teal-200 block leading-none">
                Pase Digital
              </span>
              <span className="text-[10px] font-black text-white leading-none">
                QR Activo
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* BLOQUE CENTRAL: RESUMEN Y MÉTRICAS (Grilla 2x2) */}
      <div className="flex-1 flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs gap-1.5 min-h-0">
        <div className="flex items-center justify-between shrink-0">
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
            Resumen Clínico
          </span>
          <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded shrink-0">
            Al día
          </span>
        </div>

        {/* Grilla 2x2 de métricas */}
        <div className="grid grid-cols-2 gap-1.5 flex-1 min-h-0 items-stretch">
          <HealthItem title="Consulta" value="12 Jun" subtext="Dr. Ramírez" />
          <HealthItem title="Fármacos" value="2 Activos" subtext="8AM / 8PM" highlight />
          <HealthItem title="Labs" value="Disponible" subtext="Ver PDF →" />
          <HealthItem title="Próx. cita" value="28 Jul" subtext="10:00 AM" />
        </div>
      </div>

      {/* FOOTER: BANNER RECOMENDACIÓN IA */}
      <div className="shrink-0 rounded-xl border border-slate-200/80 bg-slate-50 p-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-teal-600 text-white font-black text-[10px]">
            ✦
          </span>
          <div className="min-w-0 truncate">
            <span className="text-[8px] font-bold uppercase text-slate-400 block leading-none">
              Recomendación IA
            </span>
            <p className="text-[10px] font-black text-slate-800 truncate mt-0.5">
              Mantener hidratación adecuada hoy
            </p>
          </div>
        </div>
        <button 
          type="button" 
          className="text-[10px] font-black text-teal-700 hover:text-teal-800 active:scale-[0.98] px-2.5 py-1 rounded-md bg-teal-50 hover:bg-teal-100 border border-teal-200/60 shrink-0 transition-all cursor-pointer"
        >
          Ver
        </button>
      </div>

    </div>
  );
}

{/* COMPONENTE: TARJETA DE SALUD */}
function HealthItem({
  title,
  value,
  subtext,
  highlight = false,
}: {
  title: string;
  value: string;
  subtext?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-lg p-2 border flex flex-col justify-between min-w-0 transition-all ${
      highlight 
        ? "bg-teal-50/80 border-teal-200/90" 
        : "bg-slate-50/70 border-slate-100"
    }`}>
      <span className="block text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-slate-400 truncate">
        {title}
      </span>
      <p className={`text-xs font-black tracking-tight truncate my-0.5 ${
        highlight ? "text-teal-950" : "text-slate-900"
      }`}>
        {value}
      </p>
      {subtext && (
        <span className={`text-[9px] font-semibold block truncate ${
          highlight ? "text-teal-700" : "text-slate-500"
        }`}>
          {subtext}
        </span>
      )}
    </div>
  );
}