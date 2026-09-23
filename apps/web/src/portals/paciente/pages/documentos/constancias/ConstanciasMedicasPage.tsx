// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/documentos/constancias/ConstanciasMedicasPage.tsx
// DESCRIPCIÓN: Orquestador principal de la Bóveda de Constancias con vista dual
//              (Fichas de Certificado en Rejilla y Libro Oficial de Folios).
// =========================================================================

import React, { useState, useMemo } from 'react';
import { useAuth } from '../../../../../core/context/useAuth.js';
import { constanciasModuleService } from '../../../../../modules/documents/services/constancias.service.js';
import type { MedicalCertificateItem } from '../../../../../modules/documents/types/constancias.types.js';

import {
  ConstanciasHeader,
  ConstanciasFilters,
  ConstanciaCard,
  ConstanciaPreviewModal,
  ConstanciasEmpty,
  ConstanciasLoading,
  ConstanciasError,
} from './components/index.js';

import { Eye, Download, CheckCircle2 } from 'lucide-react';

export const ConstanciasMedicasPage: React.FC = () => {
  const { user } = useAuth();
  const patientId = user?.id || 'paciente-demo';

  const [loading, setInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<MedicalCertificateItem[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [previewCert, setPreviewCert] = useState<MedicalCertificateItem | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    const fetchCerts = async () => {
      try {
        setInitializing(true);
        const data = await constanciasModuleService.getCertificates(patientId);
        if (isMounted) {
          setCertificates(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'Error al obtener los documentos';
          setError(message);
        }
      } finally {
        if (isMounted) {
          setInitializing(false);
        }
      }
    };
    void fetchCerts();
    return () => {
      isMounted = false;
    };
  }, [patientId]);

  const handleDownloadPdf = (cert: MedicalCertificateItem) => {
    setPreviewCert(cert);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        cert.code.toLowerCase().includes(q) ||
        cert.title.toLowerCase().includes(q) ||
        cert.establishment.toLowerCase().includes(q) ||
        cert.professional.toLowerCase().includes(q);
      const matchesType = selectedType === 'ALL' || cert.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [certificates, searchQuery, selectedType]);

  if (loading && certificates.length === 0) {
    return (
      <div className="w-full max-w-[1700px] mx-auto p-4 space-y-5">
        <ConstanciasHeader certificates={[]} />
        <ConstanciasLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1700px] mx-auto p-4 space-y-5">
        <ConstanciasHeader certificates={[]} />
        <ConstanciasError 
          message={error} 
          onRetry={() => {
            setInitializing(true);
            constanciasModuleService.getCertificates(patientId)
              .then(setCertificates)
              .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Error'))
              .finally(() => setInitializing(false));
          }} 
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1700px] mx-auto p-3 sm:p-5 space-y-5 select-none animate-in fade-in duration-200">
      
      {/* Cabecera oficial de la bóveda */}
      <ConstanciasHeader certificates={certificates} />

      {/* Barra de control y búsqueda */}
      <ConstanciasFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Listado de Documentos */}
      {filteredCertificates.length === 0 ? (
        <ConstanciasEmpty
          hasFilters={searchQuery.trim() !== '' || selectedType !== 'ALL'}
          onClearFilters={() => {
            setSearchQuery('');
            setSelectedType('ALL');
          }}
        />
      ) : viewMode === 'grid' ? (
        /* VISTA EN CUADRÍCULA DE DOCUMENTOS OFICIALES */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCertificates.map((cert) => (
            <ConstanciaCard
              key={cert.id}
              certificate={cert}
              onPreview={(c) => setPreviewCert(c)}
              onDownload={handleDownloadPdf}
            />
          ))}
        </div>
      ) : (
        /* VISTA EN TABLA OFICIAL (LIBRO DE FOLIOS) */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-black tracking-wider text-[9.5px]">
                <tr>
                  <th className="py-3 px-4">Folio Oficial</th>
                  <th className="py-3 px-4">Tipo de Constancia</th>
                  <th className="py-3 px-4">Establecimiento</th>
                  <th className="py-3 px-4">Profesional Emisor</th>
                  <th className="py-3 px-4">Fecha Emisión</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCertificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-black text-[#2B7A78]">
                      {cert.code}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {cert.title}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {cert.establishment}
                    </td>
                    <td className="py-3 px-4 text-slate-900 font-semibold">
                      {cert.professional}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-medium">
                      {new Date(cert.issuedAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" />
                        Válido
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setPreviewCert(cert)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition cursor-pointer"
                        title="Ver Documento"
                      >
                        <Eye className="w-4 h-4 inline" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadPdf(cert)}
                        className="p-1.5 rounded-lg text-[#2B7A78] hover:bg-teal-50 hover:text-teal-900 transition cursor-pointer"
                        title="Descargar PDF"
                      >
                        <Download className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Visor PDF Oficial con descarga limpia */}
      <ConstanciaPreviewModal
        certificate={previewCert}
        onClose={() => setPreviewCert(null)}
        onDownload={() => {}}
      />
    </div>
  );
};

export default ConstanciasMedicasPage;