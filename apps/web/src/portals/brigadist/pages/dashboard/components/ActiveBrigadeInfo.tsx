import React, { useState } from 'react';
import { MapPin, Navigation, ZoomIn, ZoomOut, ShieldAlert, CheckCircle2, Compass } from 'lucide-react';
import { useBrigade } from '@modules/brigades/hooks/useBrigade';

export const ActiveBrigadeInfo: React.FC = () => {
  const { brigade } = useBrigade();
  const [zoomScale, setZoomScale] = useState<number>(1);

  const hasBrigade = Boolean(brigade?.community && brigade?.municipality);

  const handleZoomIn = () => setZoomScale((prev) => Math.min(prev + 0.2, 1.6));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(prev - 0.2, 0.8));

  return (
    <div className="bg-white rounded-3xl border border-slate-200/70 shadow-xs overflow-hidden transition-all duration-300">
      {/* Cabecera de Ubicación */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shadow-xs">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Ubicación del Puesto de Campo
            </h3>
            <p className="text-sm font-bold text-slate-900 tracking-tight mt-0.5">
              {hasBrigade ? `${brigade.community}, ${brigade.municipality}` : 'Sin asignación territorial'}
            </p>
          </div>
        </div>

        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 border shadow-2xs ${
          hasBrigade 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
            : 'bg-amber-50 text-amber-700 border-amber-200/60'
        }`}>
          {hasBrigade ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <ShieldAlert className="w-3.5 h-3.5" />}
          {hasBrigade ? 'Brigada Activa' : 'En Espera'}
        </span>
      </div>

      {/* Contenedor del Mapa Estilo Apple Maps */}
      <div className="relative h-64 bg-slate-900/5 overflow-hidden select-none">
        {/* Visual interactivo con Zoom dinámico */}
        <div 
          className="absolute inset-0 transition-transform duration-300 ease-out flex items-center justify-center"
          style={{ transform: `scale(${zoomScale})` }}
        >
          {/* Fondo reticulado simulando vector de mapa */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] bg-size-[16px_16px]" />
          
          {/* Líneas simuladas de mapa topográfico */}
          <svg className="absolute inset-0 w-full h-full opacity-15 stroke-slate-400 fill-none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-100 100 Q 150 300 400 100 T 900 200" strokeWidth="2" />
            <path d="M-50 200 Q 200 50 500 250 T 1000 150" strokeWidth="1.5" strokeDasharray="4 4" />
          </svg>

          {hasBrigade ? (
            <div className="relative flex flex-col items-center">
              <div className="absolute -inset-4 rounded-full bg-teal-500/20 animate-ping" />
              <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-xl shadow-teal-600/30 border-2 border-white z-10">
                <Navigation className="w-5 h-5 transform rotate-45" />
              </div>
              <div className="bg-white/95 backdrop-blur-md text-slate-900 px-3.5 py-1.5 rounded-xl text-xs font-bold mt-2 shadow-md border border-slate-200/80 flex items-center gap-1.5 z-10">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {brigade.community}
              </div>
            </div>
          ) : (
            <div className="text-center p-6 z-10 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm max-w-xs">
              <p className="text-xs font-bold text-slate-800">Sin zona asignada</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Selecciona una jornada para cargar las coordenadas del mapa.
              </p>
            </div>
          )}
        </div>

        {/* Controles de Zoom estilo iOS */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-20 bg-white/90 backdrop-blur-md p-1 rounded-2xl border border-slate-200/80 shadow-sm">
          <button 
            type="button"
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-xl hover:bg-slate-100 active:bg-slate-200 text-slate-700 flex items-center justify-center transition-all"
            title="Acercar"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="h-px bg-slate-200/80 mx-1.5" />
          <button 
            type="button"
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-xl hover:bg-slate-100 active:bg-slate-200 text-slate-700 flex items-center justify-center transition-all"
            title="Alejar"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Coordenadas discretas & brújula */}
        <div className="absolute top-3 left-3 bg-white/85 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-200/70 text-[10px] font-mono text-slate-600 z-20 flex items-center gap-1.5 shadow-2xs">
          <Compass className="w-3 h-3 text-teal-600 animate-spin-slow" />
          <span>13.6929° N, 89.2182° W</span>
        </div>
      </div>
    </div>
  );
};

export default ActiveBrigadeInfo;