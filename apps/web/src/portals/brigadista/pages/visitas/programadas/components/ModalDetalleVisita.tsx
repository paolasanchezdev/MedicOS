// =========================================================================
// ARCHIVO: ModalDetalleVisita.tsx
// DESCRIPCIÓN: Ficha de visita con captura en vivo de coordenadas GPS de la vivienda.
// =========================================================================

import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Play, CheckCircle2, Phone, Navigation } from 'lucide-react';
import type { CommunityVisitRecord } from '../../../../../../modules/visits/types/visit.types';
import { calcularTemporalidadVisita } from '../../../../../../modules/visits/hooks/useVisits';

interface ModalDetalleVisitaProps {
  isOpen: boolean;
  onClose: () => void;
  visita: CommunityVisitRecord | null;
  onIniciarVisita: (id: string) => void;
  onRegistrarResultado: (visita: CommunityVisitRecord) => void;
  onGuardarUbicacionVivienda?: (patientId: string, lat: number, lng: number) => Promise<void>;
}

export const ModalDetalleVisita: React.FC<ModalDetalleVisitaProps> = ({
  isOpen,
  onClose,
  visita,
  onIniciarVisita,
  onRegistrarResultado,
  onGuardarUbicacionVivienda,
}) => {
  const [capturandoGps, setCapturandoGps] = useState(false);
  const [gpsRegistrado, setGpsRegistrado] = useState<{ lat: number; lng: number } | null>(null);

  if (!isOpen || !visita) return null;

  const temp = calcularTemporalidadVisita(visita.scheduledDate, visita.status);

  const handleCapturarGpsVivienda = () => {
    if (!navigator.geolocation) return;
    setCapturandoGps(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setGpsRegistrado(coords);
        if (onGuardarUbicacionVivienda && visita.patientId) {
          await onGuardarUbicacionVivienda(visita.patientId, coords.lat, coords.lng);
        }
        setCapturandoGps(false);
      },
      () => {
        setCapturandoGps(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              {visita.patientExpediente && (
                <span className="font-mono text-xs font-bold text-[#166E7A] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {visita.patientExpediente}
                </span>
              )}
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                  visita.status === 'IN_PROGRESS'
                    ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                    : temp === 'VENCIDA'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : temp === 'HOY'
                    ? 'bg-teal-50 text-[#166E7A] border-teal-200'
                    : temp === 'COMPLETADA'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                ● {visita.status === 'IN_PROGRESS' ? 'EN CURSO' : visita.status}
              </span>
            </div>
            <h3 className="text-base font-black text-[#1A282D]">
              {visita.patientName}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#166E7A] block">
              Motivo de la Visita Domiciliaria
            </span>
            <h4 className="text-sm font-black text-[#1A282D]">{visita.reason}</h4>
            <div className="flex items-center gap-4 text-xs font-bold text-teal-900 pt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#166E7A]" />
                <span>Fecha: {visita.scheduledDate}</span>
              </span>
              {visita.scheduledTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#166E7A]" />
                  <span>Hora: {visita.scheduledTime}</span>
                </span>
              )}
            </div>
          </div>

          {/* Ubicación Territorial y Captura de GPS */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-[#166E7A]" />
                <span>Ubicación y Georreferenciación de la Vivienda</span>
              </span>

              {/* Botón de Georreferenciación en Terreno */}
              <button
                type="button"
                onClick={handleCapturarGpsVivienda}
                disabled={capturandoGps}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#166E7A] hover:bg-[#105F68] text-white text-[11px] font-black shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Navigation className={`w-3 h-3 ${capturandoGps ? 'animate-spin' : ''}`} />
                <span>{capturandoGps ? 'Capturando...' : '📍 Registrar Ubicación Actual'}</span>
              </button>
            </div>

            {gpsRegistrado && (
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[11px] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Vivienda Georreferenciada: Lat {gpsRegistrado.lat.toFixed(5)}, Lng {gpsRegistrado.lng.toFixed(5)}</span>
              </div>
            )}

            {visita.comunidad && (
              <p className="text-slate-800 font-semibold">
                <strong>{visita.comunidad}</strong> {visita.sector ? `• ${visita.sector}` : ''}
              </p>
            )}

            {(visita.referenciaUbicacion || visita.patientAddress) && (
              <p className="text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/70 leading-relaxed">
                "{visita.referenciaUbicacion || visita.patientAddress}"
              </p>
            )}

            <div className="flex items-center gap-3 pt-1 text-slate-500 font-medium flex-wrap">
              {visita.patientPhone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{visita.patientPhone}</span>
                </span>
              )}
              {visita.brigadistaName && (
                <span>Resp: {visita.brigadistaName}</span>
              )}
            </div>
          </div>
        </div>

        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Cerrar
          </button>

          <div className="flex items-center gap-2">
            {visita.status === 'SCHEDULED' && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onIniciarVisita(visita.id);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#166E7A] hover:bg-[#105F68] text-white text-xs font-black rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Iniciar Visita</span>
              </button>
            )}

            {visita.status === 'IN_PROGRESS' && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRegistrarResultado(visita);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Registrar Resultado</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};