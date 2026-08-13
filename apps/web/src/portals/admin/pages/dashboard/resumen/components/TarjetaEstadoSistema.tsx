// =========================================================================
// ARCHIVO: apps/web/src/portals/admin/pages/dashboard/resumen/components/TarjetaEstadoSistema.tsx
// DESCRIPCIÓN: Tarjeta de Infraestructura con Mapa Estilizado (Carto Voyager) y datos de la BD
// =========================================================================

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { Server, Wifi, AlertTriangle } from 'lucide-react';

import 'leaflet/dist/leaflet.css';

export type DeviceStatus = 'ACTIVE' | 'OFFLINE' | 'WARNING';

export interface DeviceNodeLocation {
  id: string;
  name: string;
  locationName?: string;
  lat: number;
  lng: number;
  status: DeviceStatus;
}

interface TarjetaEstadoSistemaProps {
  apiOnline: boolean;
  devicesSummary: {
    total: number;
    active: number;
    offline: number;
  };
  nodes?: DeviceNodeLocation[];
}

// Icono personalizado para los marcadores del mapa
const createCustomMarkerIcon = (status: DeviceStatus) => {
  const isActive = status === 'ACTIVE';
  const colorClass = isActive ? 'bg-emerald-500' : 'bg-rose-500';
  const ringClass = isActive ? 'bg-emerald-400/30' : 'bg-rose-400/30';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative flex items-center justify-center w-6 h-6">
        <span class="absolute w-6 h-6 rounded-full ${ringClass} animate-ping"></span>
        <span class="relative w-3.5 h-3.5 rounded-full ${colorClass} border-2 border-white shadow-md"></span>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Respaldo por defecto en caso de que la API aún no mande nodos geolocalizados
const defaultNodes: DeviceNodeLocation[] = [
  {
    id: 'DEV-CENTRAL-01',
    name: 'Servidor Central - MedicOS',
    locationName: 'San Salvador',
    lat: 13.6929,
    lng: -89.2182,
    status: 'ACTIVE',
  },
  {
    id: 'DEV-MOB-MORAZAN-01',
    name: 'Tablet Brigada Morazán #1',
    locationName: 'Morazán',
    lat: 13.6942,
    lng: -88.1072,
    status: 'ACTIVE',
  },
  {
    id: 'DEV-MOB-CABANAS-01',
    name: 'Tablet Brigada Cabañas #1',
    locationName: 'Cabañas',
    lat: 13.8753,
    lng: -88.6311,
    status: 'OFFLINE',
  },
];

export const TarjetaEstadoSistema: React.FC<TarjetaEstadoSistemaProps> = ({
  apiOnline,
  devicesSummary,
  nodes = defaultNodes,
}) => {
  const centerElSalvador: [number, number] = [13.7942, -88.8965];
  const activeCount = devicesSummary?.active ?? 0;
  const offlineCount = devicesSummary?.offline ?? 0;
  const displayNodes = nodes && nodes.length > 0 ? nodes : defaultNodes;

  return (
    <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Cabecera */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100/70 flex items-center justify-center text-slate-600">
            <Server className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 tracking-tight">
              Infraestructura y Red
            </h3>
            <p className="text-[11px] font-normal text-slate-400">
              Distribución de nodos en El Salvador
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
            apiOnline
              ? 'bg-emerald-50/80 border-emerald-200/60 text-emerald-700'
              : 'bg-rose-50/80 border-rose-200/60 text-rose-700'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              apiOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
            }`}
          />
          <span>{apiOnline ? 'API Operativa' : 'API Desconectada'}</span>
        </div>
      </div>

      {/* Contadores Conectados a la BD */}
      <div className="grid grid-cols-2 gap-3 my-4">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 border border-slate-100/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100/60 text-emerald-600 flex items-center justify-center">
              <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-medium text-slate-600">Activos</span>
          </div>
          <span className="text-base font-bold text-slate-800">{activeCount}</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 border border-slate-100/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-100/60 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-medium text-slate-600">Offline</span>
          </div>
          <span className="text-base font-bold text-slate-800">{offlineCount}</span>
        </div>
      </div>

      {/* Mapa Interactivo con Leaflet y estilo Voyager */}
      <div className="relative w-full h-64 rounded-xl overflow-hidden border border-slate-200/70 shadow-inner z-0">
        <MapContainer
          center={centerElSalvador}
          zoom={8}
          zoomControl={false}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          <ZoomControl position="bottomright" />

          {displayNodes.map((node) => (
            <Marker
              key={node.id}
              position={[node.lat, node.lng]}
              icon={createCustomMarkerIcon(node.status)}
            >
              <Popup className="rounded-lg shadow-lg">
                <div className="p-1">
                  <p className="text-xs font-semibold text-slate-900">{node.name}</p>
                  {node.locationName && (
                    <p className="text-[11px] text-slate-500">{node.locationName}</p>
                  )}
                  <span
                    className={`inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      node.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {node.status === 'ACTIVE' ? 'Conectado' : 'Sin conexión'}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};