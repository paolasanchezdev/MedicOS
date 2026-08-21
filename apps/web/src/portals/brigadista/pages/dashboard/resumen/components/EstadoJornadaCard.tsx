// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/resumen/components/EstadoJornadaCard.tsx
// =========================================================================

import React, { useState } from 'react';
import {
  MapPin,
  Play,
  Square,
  AlertCircle,
  Clock,
  Users,
  Compass,
  ExternalLink,
  ShieldAlert,
  X,
  Building2,
  Maximize2
} from 'lucide-react';

export interface CoordenadasUbicacion {
  lat: number;
  lng: number;
}

interface EstadoJornadaCardProps {
  jornadaActiva: boolean;
  nombreBrigada?: string;
  ubicacion?: string;
  horaInicio?: string;
  totalPacientesAtendidos?: number;
  coordenadas?: CoordenadasUbicacion;
  onIniciarJornada?: () => void;
  onFinalizarJornada?: () => void;
  onVerMapa?: () => void;
}

// Coordenadas conocidas por municipio/lugar para centrar el mapa sin fallos
const COORDENADAS_MUNICIPIOS: Record<string, CoordenadasUbicacion> = {
  'san miguel tepezontes': { lat: 13.6239, lng: -88.9958 },
  'san juan tepezontes': { lat: 13.6256, lng: -88.9833 },
  'san pedro nonualco': { lat: 13.6028, lng: -88.9319 },
  'zacatecoluca': { lat: 13.5089, lng: -88.8689 },
};

export const EstadoJornadaCard: React.FC<EstadoJornadaCardProps> = ({
  jornadaActiva,
  nombreBrigada = 'Brigada Médica Tepezontes',
  ubicacion = 'San Miguel Tepezontes, La Paz',
  horaInicio,
  totalPacientesAtendidos = 0,
  coordenadas,
  onIniciarJornada,
  onFinalizarJornada,
  onVerMapa,
}) => {
  const [confirmandoFin, setConfirmandoFin] = useState(false);

  // Determinar coordenadas efectivas según la propiedad de la BD
  const claveLugar = ubicacion.toLowerCase();
  const coordsBaseBD = Object.entries(COORDENADAS_MUNICIPIOS).find(([key]) =>
    claveLugar.includes(key)
  )?.[1];

  const lat = coordenadas?.lat ?? coordsBaseBD?.lat ?? 13.6239;
  const lng = coordenadas?.lng ?? coordsBaseBD?.lng ?? -88.9958;

  // Parámetros de encuadre para OpenStreetMap
  const zoomDelta = 0.012;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - zoomDelta}%2C${lat - zoomDelta}%2C${lng + zoomDelta}%2C${lat + zoomDelta}&layer=mapnik&marker=${lat}%2C${lng}`;

  // Enlace directo a Google Maps externo
  const mapQuery = encodeURIComponent(ubicacion);
  const googleMapsExternalUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  const handleConfirmarFinalizar = () => {
    setConfirmandoFin(false);
    if (onFinalizarJornada) {
      onFinalizarJornada();
    }
  };

  // -----------------------------------------------------------------------
  // VISTA CUANDO NO HAY JORNADA ACTIVA
  // -----------------------------------------------------------------------
  if (!jornadaActiva) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between h-full hover:border-slate-300 transition-colors">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Ubicación y Estado
                </span>
                <span className="text-sm font-bold text-slate-800">
                  Jornada Médica
                </span>
              </div>
            </div>
            <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200/80">
              Inactiva
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">No hay una jornada en curso</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Inicia la jornada para activar el mapa interactivo de atención y el registro georreferenciado de pacientes en tiempo real.
            </p>
          </div>

          {/* Contenedor del Mapa Interactivo a Color */}
          <div className="relative w-full h-72 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
            <iframe
              title="Mapa de ubicación registrado"
              width="100%"
              height="100%"
              className="w-full h-full border-0"
              loading="lazy"
              src={osmEmbedUrl}
            />

            {/* Badge de Referencia del Lugar */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/90 shadow-sm flex items-center gap-2 text-xs font-semibold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-teal-600" />
              <span className="truncate max-w-[200px]">{ubicacion}</span>
            </div>

            {/* Tarjeta Inferior con Dirección y Enlace a Google Maps */}
            <div className="absolute bottom-3 left-3 right-3 p-3 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
                  <MapPin className="w-4 h-4 shrink-0" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold text-slate-400">PUNTO ASIGNADO EN BD</p>
                  <p className="text-xs font-bold text-slate-800 truncate">{ubicacion}</p>
                </div>
              </div>
              <a
                href={googleMapsExternalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                title="Abrir en Google Maps"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onIniciarJornada}
          className="mt-5 w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.99]"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Iniciar jornada médica</span>
        </button>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // VISTA CON JORNADA ACTIVA
  // -----------------------------------------------------------------------
  return (
    <div className="relative p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between h-full hover:border-slate-300 transition-colors">
      <div className="space-y-4">
        {/* Cabecera */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Ubicación de Jornada
              </span>
              <span className="text-sm font-bold text-slate-800">
                Mapa de Atención
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            En curso
          </span>
        </div>

        {/* MAPA Interactivo */}
        <div className="relative w-full h-72 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
          <iframe
            title="Mapa de la jornada médica"
            width="100%"
            height="100%"
            className="w-full h-full border-0"
            loading="lazy"
            src={osmEmbedUrl}
          />

          {/* Badge de Referencia del Lugar */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/90 shadow-sm flex items-center gap-2 text-xs font-semibold text-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate max-w-[200px]">{ubicacion}</span>
          </div>

          {/* Acciones Superiores */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {onVerMapa && (
              <button
                type="button"
                onClick={onVerMapa}
                title="Ampliar mapa"
                className="p-2 bg-white/95 hover:bg-white text-slate-700 rounded-xl border border-slate-200 shadow-sm transition-colors inline-flex items-center"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
            <a
              href={googleMapsExternalUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Abrir en Google Maps"
              className="p-2 bg-white/95 hover:bg-white text-slate-700 rounded-xl border border-slate-200 shadow-sm transition-colors inline-flex items-center"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* DATOS DETALLADOS DE LA JORNADA */}
        <div className="grid grid-cols-2 gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 text-xs">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 font-semibold">BRIGADA</p>
              <p className="font-bold text-slate-800 truncate">{nombreBrigada}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 font-semibold">UBICACIÓN</p>
              <p className="font-bold text-slate-800 truncate">{ubicacion}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-semibold">INICIO</p>
              <p className="font-bold text-slate-800 font-mono">{horaInicio || '--:--'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
            <Users className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-semibold">PACIENTES</p>
              <p className="font-bold text-teal-700">{totalPacientesAtendidos} atendidos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de Finalizar Jornada */}
      <button
        type="button"
        onClick={() => setConfirmandoFin(true)}
        className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 border border-rose-200/80 rounded-xl font-bold text-xs transition-colors"
      >
        <Square className="w-3.5 h-3.5 fill-current" />
        <span>Finalizar jornada médica</span>
      </button>

      {/* MODAL DE CONFIRMACIÓN */}
      {confirmandoFin && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs rounded-2xl p-6 flex flex-col justify-center items-center text-center z-20 animate-in fade-in duration-150">
          <button
            type="button"
            onClick={() => setConfirmandoFin(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white">¿Finalizar la jornada?</h4>
          <p className="text-xs text-slate-200 mt-1 max-w-60 leading-relaxed">
            Se cerrará la atención de esta jornada y se enviará el informe final al servidor.
          </p>

          <div className="flex items-center gap-3 mt-5 w-full">
            <button
              type="button"
              onClick={() => setConfirmandoFin(false)}
              className="flex-1 py-2.5 px-4 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmarFinalizar}
              className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              Sí, finalizar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};