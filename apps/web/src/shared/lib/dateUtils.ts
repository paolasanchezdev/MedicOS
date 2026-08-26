// =========================================================================
// ARCHIVO: apps/web/src/shared/lib/dateUtils.ts
// DESCRIPCIÓN: Utilidades de formateo de fecha/hora para Centroamérica (UTC-6).
// =========================================================================

export const formatClinicalTime = (dateInput: string | Date | undefined | null): string => {
  if (!dateInput) return '--:--';
  
  if (typeof dateInput === 'string' && dateInput.includes('T')) {
    const timePart = dateInput.split('T')[1];
    if (timePart) {
      return timePart.substring(0, 5); // Retorna directamente "16:00"
    }
  }

  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '--:--';

  return d.toLocaleTimeString('es-SV', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/El_Salvador',
  });
};

export const formatClinicalDate = (dateInput: string | Date | undefined | null): string => {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' && !dateInput.includes('T') 
    ? new Date(`${dateInput}T00:00:00`) 
    : new Date(dateInput);

  if (isNaN(d.getTime())) return '';

  return d.toLocaleDateString('es-SV', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/El_Salvador',
  });
};