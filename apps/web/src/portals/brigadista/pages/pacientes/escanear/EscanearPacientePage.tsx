// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/escanear/EscanearPacientePage.tsx
// DESCRIPCIÓN: Pantalla de Escaneo de Carnet en Terreno para Brigadistas.
//              Diseño amplio y equilibrado que aprovecha el alto de pantalla
//              en computadoras sin generar scroll vertical.
// =========================================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QRScannerCard } from '../../../../../modules/qr/index.js';
import {
  QrCode,
  ArrowLeft,
  Users,
  Search,
  UserPlus,
  ShieldCheck,
  Smartphone,
  SunMedium,
  CheckCircle2,
  WifiOff,
  Sparkles,
} from 'lucide-react';

export const EscanearPacientePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full px-4 py-2 sm:px-6 sm:py-3 space-y-3 max-w-[1700px] mx-auto animate-in fade-in duration-150">
      {/* 1. Botón de Retorno Rápido */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/brigadista/pacientes/buscar')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#2B7A78] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Volver a Búsqueda de Pacientes</span>
        </button>
      </div>

      {/* 2. Banner Institucional Oficial (Degradado Teal) */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#2B7A78] via-[#236866] to-[#1B5250] p-3.5 sm:px-6 sm:py-4 text-white shadow-2xs border border-teal-700/50">
        <div className="absolute -right-12 -bottom-12 w-60 h-60 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block">
          <svg
            width="170"
            height="85"
            viewBox="0 0 200 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 50H50L62 15L78 85L92 35L102 60L112 50H190"
              stroke="white"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 sm:gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-semibold text-teal-100 shadow-2xs">
                <QrCode className="w-3 h-3 text-teal-200" />
                Identificación Biométrica y QR
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-100 border border-amber-400/30">
                <Users className="w-3 h-3 text-amber-200" />
                Módulo Territorial
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
              Identificación de Paciente en Brigada
            </h1>

            <p className="text-xs text-teal-100/90 font-medium max-w-3xl leading-snug">
              Escanea el código QR del carnet oficial físico o digital para acceder de inmediato al expediente nominal, triaje y registro de jornada.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
            <div className="text-left text-[11px] leading-tight text-teal-50">
              <span className="font-bold block text-white">Validación Offline</span>
              <span>Criptografía CR-80</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Cuadrícula de Trabajo Ampliada: Escáner y Panel Operativo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* Columna Izquierda: Lector QR + Banner Red */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-3">
          <QRScannerCard scannerRole="BRIGADISTA" />

          {/* Banner Informativo de Red Local */}
          <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-100 text-[#1B5250] flex items-center justify-center shrink-0">
                <WifiOff className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-xs leading-none">Modo Offline Activo</p>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                  La lectura de carnet no requiere conexión a internet para verificar la identidad.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] font-bold text-teal-800 bg-teal-100/70 px-2.5 py-1 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
              Sincronizado
            </span>
          </div>
        </div>

        {/* Columna Derecha: Contingencias Operativas y Guía de Terreno */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-3">
          {/* Card 1: Alternativas si la cámara no funciona o no hay carnet */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-[#2B7A78]" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider leading-none">
                  Opciones de Contingencia
                </h3>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">¿Problemas al escanear el carnet?</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-snug">
              Si la cámara del dispositivo no está disponible, el carnet está deteriorado o la persona aún no tiene documento:
            </p>

            <div className="space-y-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => navigate('/brigadista/pacientes/buscar')}
                className="w-full inline-flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-teal-50 border border-slate-200/80 hover:border-teal-200 rounded-xl transition text-xs font-bold text-slate-700 hover:text-[#1B5250] cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#2B7A78]" />
                  <span>Buscar por DUI o Nombre</span>
                </div>
                <span className="text-[11px] text-slate-400 group-hover:text-teal-700">Ir &rarr;</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/brigadista/pacientes/registrar')}
                className="w-full inline-flex items-center justify-between px-3 py-2 bg-teal-50/70 hover:bg-teal-100/70 border border-teal-200/80 rounded-xl transition text-xs font-bold text-[#1B5250] cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[#2B7A78]" />
                  <span>Registrar Persona en Terreno</span>
                </div>
                <span className="text-[11px] text-teal-700">Nuevo &rarr;</span>
              </button>
            </div>
          </div>

          {/* Card 2: Recomendaciones de lectura en campo */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-2.5">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 leading-none">
              <Smartphone className="w-4 h-4 text-[#2B7A78]" />
              Guía de Lectura Rápida
            </h3>

            <div className="space-y-2 text-[11px] text-slate-600">
              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-teal-50 border border-teal-100 text-[#1B5250] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <p className="leading-snug">
                  Mantén el carnet físico a una distancia de <strong className="text-slate-800">15 a 20 cm</strong> del lente del teléfono o tableta.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-teal-50 border border-teal-100 text-[#1B5250] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div className="leading-snug">
                  <p>
                    Evita reflejos directos del sol sobre el laminado protector del código.
                  </p>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <SunMedium className="w-3 h-3 text-amber-500" />
                    En exteriores busca sombra ligera.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-teal-50 border border-teal-100 text-[#1B5250] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <p className="leading-snug">
                  Compatible con códigos QR mostrados directamente desde la app comunitaria del paciente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscanearPacientePage;