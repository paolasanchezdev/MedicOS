/**
 * MedicOS - Hero Brigadista Panel
 *
 * Showcase visual del módulo principal utilizado
 * por brigadistas durante jornadas médicas comunitarias.
 */

export default function BrigadistaPanel() {
  return (
    <div className="relative w-full h-full flex flex-col justify-between text-slate-800 antialiased gap-2">
      
      {/* HEADER: Título y Badge Offline */}
      <div className="flex items-center justify-between shrink-0">
        <div className="min-w-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-teal-700 block truncate">
            Brigada comunitaria
          </span>
          <h3 className="text-sm sm:text-base font-black tracking-tight text-slate-900 leading-tight truncate">
            Estación de Campo
          </h3>
        </div>

        {/* Estado offline estilo Apple Status Chip */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-600/20 bg-teal-50 px-2.5 py-1 text-[10px] sm:text-[11px] font-bold text-teal-800 shrink-0">
          <span className="size-2 rounded-full bg-teal-500 animate-pulse" />
          <span>Offline activo</span>
        </div>
      </div>

      {/* BRIGADISTA PROFILE CARD */}
      <div className="flex items-center justify-between rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-2.5 sm:p-3 shadow-2xs shrink-0 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-teal-600 font-black text-xs text-white shadow-xs shrink-0">
            AB
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight truncate">
              Ana Beltrán
            </h4>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 truncate">
              Exp. #BR-412 • El Pinar
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 border border-emerald-200/60">
            ● Activa
          </span>
        </div>
      </div>

      {/* QUICK ACTIONS GRID */}
      <div className="grid grid-cols-2 gap-2 shrink-0">
        <ActionCard title="Nuevo paciente" value="+" highlight />
        <ActionCard title="Atenciones hoy" value="12" subtext="↑ 4 turno" />
      </div>

      {/* LAST PATIENT & VITALS */}
      <div className="rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-2.5 sm:p-3 shadow-2xs flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 gap-2">
          <div className="min-w-0">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block truncate">
              Última atención
            </span>
            <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight truncate">
              María González <span className="text-[10px] font-semibold text-slate-500">• 34a</span>
            </p>
          </div>

          <span className="rounded-md bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 shrink-0">
            Normal
          </span>
        </div>

        {/* VITAL SIGNS WIDGETS */}
        <div className="grid grid-cols-3 gap-1.5">
          <Vital label="Temp." value="36.7°C" />
          <Vital label="Pulso" value="78 bpm" />
          <Vital label="SpO₂" value="98%" />
        </div>
      </div>

      {/* SYNC STATUS FOOTER */}
      <div className="flex items-center justify-between rounded-xl sm:rounded-2xl border border-teal-500/20 bg-slate-900 p-2.5 sm:px-3 sm:py-2 text-white shadow-xs shrink-0 gap-2">
        <div className="min-w-0">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block truncate">
            Base local segura
          </span>
          <p className="text-[11px] sm:text-xs font-black text-teal-300 truncate">
            24 registros locales
          </p>
        </div>

        <button
          type="button"
          className="rounded-lg bg-teal-600 hover:bg-teal-500 active:scale-[0.98] px-3 py-1.5 text-[10px] sm:text-[11px] font-black text-white shadow-xs cursor-pointer shrink-0 transition-all"
        >
          Sincronizar
        </button>
      </div>

    </div>
  );
}

{/* COMPONENTE: ACTION CARD */}
function ActionCard({
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
    <div
      className={`group relative flex items-center justify-between rounded-xl sm:rounded-2xl p-2.5 sm:p-3 transition-all duration-200 ${
        highlight
          ? "bg-teal-600 text-white shadow-xs hover:bg-teal-700"
          : "border border-slate-200/90 bg-white text-slate-900 shadow-2xs"
      }`}
    >
      <div className="min-w-0">
        <span
          className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider block truncate ${
            highlight ? "text-teal-100" : "text-slate-400"
          }`}
        >
          {title}
        </span>
        {subtext && (
          <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md inline-block mt-0.5">
            {subtext}
          </span>
        )}
      </div>

      <p
        className={`text-lg sm:text-xl font-black tracking-tight shrink-0 ml-1 ${
          highlight ? "text-white" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

{/* COMPONENTE: VITAL SIGNS WIDGET */}
function Vital({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-slate-50 border border-slate-100 p-1.5 text-center">
      <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <p className="mt-0.5 text-xs font-black text-slate-900 tracking-tight">
        {value}
      </p>
    </div>
  );
}