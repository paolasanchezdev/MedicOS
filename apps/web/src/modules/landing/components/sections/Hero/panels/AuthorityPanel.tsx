/**
 * AuthorityPanel.tsx
 * 
 * Panel de Autoridades con mapa vectorial de El Salvador,
 * hotspots de actividad epidemiológica en vivo y métricas territoriales.
 */

export default function AuthorityPanel() {
  return (
    <div className="relative w-full h-full flex flex-col justify-between gap-2 text-slate-800 antialiased select-none">
      
      {/* HEADER DEL PANEL */}
      <div className="flex items-center justify-between shrink-0 border-b border-slate-100 pb-1.5">
        <div className="min-w-0 pr-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-teal-700 block leading-none truncate">
            Centro de Coordinación
          </span>
          <h3 className="text-xs sm:text-sm font-black tracking-tight text-slate-900 leading-tight truncate mt-0.5">
            Autoridades de Salud & Vigilancia
          </h3>
        </div>

        {/* Badge Estado */}
        <span className="inline-flex items-center gap-1 rounded-full border border-teal-600/20 bg-teal-50 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-teal-800 shrink-0">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>18 Brigadas Activas</span>
        </span>
      </div>

      {/* CONTENEDOR DEL MAPA (AMPLIO) */}
      <div className="relative flex-1 min-h-0 w-full overflow-hidden rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/90 p-2.5 sm:p-3 flex flex-col justify-between shadow-2xs">
        {/* Fondo con trama de puntos */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-size-[12px_12px] opacity-40 pointer-events-none" />
        
        {/* Header dentro de la tarjeta de mapa */}
        <div className="flex justify-between items-center relative z-10 shrink-0">
          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 truncate">
            Cobertura Territorial Nacional
          </span>
          <span className="text-[8px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60 shrink-0">
            En Línea
          </span>
        </div>

        {/* MAPA USANDO SV.SVG CON MÁSCARA Y GRADIENTE */}
        <div className="relative z-10 w-full flex-1 flex items-center justify-center my-1">
          <div
            className="relative h-24 sm:h-28 w-full bg-linear-to-r from-emerald-500 via-teal-600 to-amber-500 transition-all"
            style={{
              WebkitMaskImage: 'url("/sv.svg")',
              maskImage: 'url("/sv.svg")',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
            }}
          />
          
          {/* Hotspot San Salvador */}
          <div className="absolute top-[52%] left-[44%] flex items-center justify-center pointer-events-none">
            <span className="size-2 rounded-full bg-slate-900 border border-white z-10" />
            <span className="absolute size-5 rounded-full bg-emerald-500/60 animate-ping" />
          </div>
        </div>

        {/* Footer dentro del mapa */}
        <div className="relative z-10 flex justify-between items-center text-[9px] font-bold text-slate-500 border-t border-slate-200/60 pt-1 shrink-0">
          <span className="truncate">El Salvador — Monitoreo Activo</span>
          <span className="text-teal-700 font-extrabold shrink-0 ml-1">Hace 2 min</span>
        </div>
      </div>

      {/* GRILLA DE MÉTRICAS INFERIOR (2 COLUMNAS) */}
      <div className="grid grid-cols-2 gap-2 shrink-0">
        
        {/* Tarjeta 1: Personas Atendidas */}
        <div className="bg-slate-50 p-2.5 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between min-w-0">
          <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-slate-400 block truncate">
            Personas Atendidas
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <p className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
              4,820
            </p>
            <span className="text-[8px] sm:text-[9px] font-extrabold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200/60 shrink-0">
              ↑ 12%
            </span>
          </div>
        </div>

        {/* Tarjeta 2: Sincronización Off-Grid */}
        <div className="bg-slate-50 p-2.5 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between min-w-0">
          <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-slate-400 block truncate">
            Sincronización Off-Grid
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <p className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
              98.4%
            </p>
            <span className="text-[8px] sm:text-[9px] font-extrabold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200/60 shrink-0">
              Base segura
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}