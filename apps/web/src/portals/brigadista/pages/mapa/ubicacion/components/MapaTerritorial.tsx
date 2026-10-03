// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/mapa/ubicacion/components/MapaTerritorial.tsx
// DESCRIPCIÓN: Visor Leaflet con tiles OpenStreetMap, ajuste reactivo de tamaño,
//              marcador de brigadista arrastrable manualmente y marcadores temáticos.
// =========================================================================

import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { ElementoBusquedaMapa } from './MapaBusqueda';

function AjustadorTamanoMapa() {
  const map = useMap();

  useEffect(() => {
    const timer1 = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    const timer2 = setTimeout(() => {
      map.invalidateSize();
    }, 500);

    const onResize = () => {
      map.invalidateSize();
    };

    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', onResize);
    };
  }, [map]);

  return null;
}

function ControladorCamara({
  centro,
  zoom,
}: {
  centro: { lat: number; lng: number };
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([centro.lat, centro.lng], zoom, { duration: 1.2 });
  }, [centro, zoom, map]);

  return null;
}

function crearMarcadorVectorial(colorBg: string, svgPath: string) {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="background-color: ${colorBg}; box-shadow: 0 4px 10px rgba(0,0,0,0.25);" 
           class="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          ${svgPath}
        </svg>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

const ICONO_BRIGADISTA = crearMarcadorVectorial(
  '#0D9488',
  '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>'
);

const ICONO_ESTABLECIMIENTO = crearMarcadorVectorial(
  '#0284C7',
  '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M12 4v4"/>'
);

const ICONO_VISITA = crearMarcadorVectorial(
  '#166E7A',
  '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'
);

const ICONO_PACIENTE = crearMarcadorVectorial(
  '#4F46E5',
  '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'
);

const ICONO_REFERENCIA = crearMarcadorVectorial(
  '#D97706',
  '<path d="m15 18-6-6 6-6"/>'
);

interface MapaTerritorialProps {
  centro: { lat: number; lng: number };
  zoom: number;
  miUbicacion: { lat: number; lng: number };
  elementos: ElementoBusquedaMapa[];
  onSeleccionar: (elemento: ElementoBusquedaMapa) => void;
  onCambiarMiUbicacion?: (coordenadas: { lat: number; lng: number }) => void;
}

export const MapaTerritorial: React.FC<MapaTerritorialProps> = ({
  centro,
  zoom,
  miUbicacion,
  elementos,
  onSeleccionar,
  onCambiarMiUbicacion,
}) => {
  const getIcono = (tipo: ElementoBusquedaMapa['tipo']) => {
    switch (tipo) {
      case 'ESTABLECIMIENTO':
        return ICONO_ESTABLECIMIENTO;
      case 'VISITA':
        return ICONO_VISITA;
      case 'PACIENTE':
        return ICONO_PACIENTE;
      case 'REFERENCIA':
        return ICONO_REFERENCIA;
    }
  };

  const eventHandlersBrigadista = useMemo(
    () => ({
      dragend(e: L.DragEndEvent) {
        const marker = e.target as L.Marker;
        const pos = marker.getLatLng();
        if (onCambiarMiUbicacion) {
          onCambiarMiUbicacion({ lat: pos.lat, lng: pos.lng });
        }
      },
    }),
    [onCambiarMiUbicacion]
  );

  return (
    <div className="w-full h-full min-h-112.5 relative rounded-3xl overflow-hidden border border-[#D3E8EC]">
      <MapContainer
        center={[centro.lat, centro.lng]}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full min-h-112.5 z-0"
      >
        <AjustadorTamanoMapa />
        <ControladorCamara centro={centro} zoom={zoom} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Brigadista en campo (Arrastrable para corregir ubicación en computadoras) */}
        <Marker
          position={[miUbicacion.lat, miUbicacion.lng]}
          icon={ICONO_BRIGADISTA}
          draggable={true}
          eventHandlers={eventHandlersBrigadista}
        >
          <Popup>
            <div className="text-xs p-1 space-y-1">
              <strong className="text-teal-900 block font-black">Tu Ubicación de Campo</strong>
              <span className="text-slate-600 block text-[11px]">
                Coordenadas: {miUbicacion.lat.toFixed(4)}, {miUbicacion.lng.toFixed(4)}
              </span>
              <span className="text-[10px] text-[#166E7A] font-bold block pt-1 border-t border-slate-100">
                Puedes arrastrar este marcador a tu posición real
              </span>
            </div>
          </Popup>
        </Marker>
        <Circle
          center={[miUbicacion.lat, miUbicacion.lng]}
          radius={200}
          pathOptions={{ fillColor: '#0D9488', fillOpacity: 0.15, color: '#0D9488', weight: 1.5 }}
        />

        {/* Elementos reales de las capas */}
        {elementos.map((item) => (
          <Marker
            key={`${item.tipo}-${item.id}`}
            position={[item.coordenadas.lat, item.coordenadas.lng]}
            icon={getIcono(item.tipo)}
            eventHandlers={{
              click: () => onSeleccionar(item),
            }}
          >
            <Popup>
              <div className="text-xs space-y-0.5 p-0.5">
                <span className="text-[9.5px] font-bold text-[#166E7A] uppercase block">
                  {item.tipo}
                </span>
                <strong className="text-slate-900 block text-xs">{item.titulo}</strong>
                {item.subtitulo && <span className="text-slate-500 block">{item.subtitulo}</span>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};