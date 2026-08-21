// ======================================================
// MedicOS
// Seed oficial de establecimientos hospitalarios
// MINSAL + ISSS
//
// IMPORTANTE:
// Este seed realiza una LIMPIEZA TOTAL de la tabla
// Establishment y posteriormente inserta únicamente
// los hospitales definidos en este archivo.
//
// NO elimina:
// - Users
// - Patients
// - Brigades
// - Consultations
// - VitalSigns
// - WorkSessions
// - AuditLogs
// - Devices
// - SyncQueues
//
// Fecha de catálogo: Junio 2026
// Arquitectura: Offline First
// ======================================================

import {
  PrismaClient,
  EstablishmentType,
  EstablishmentLevel,
  EstablishmentOperator,
  EstablishmentStatus,
  SyncStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

// Identificador del dispositivo/sistema que origina
// este catálogo institucional oficial.
const SYSTEM_DEVICE_ID = 'SYSTEM_OFFICIAL_MINSAL_ISSS_2026';

// ======================================================
// INTERFAZ
// ======================================================

interface VerifiedHospitalRecord {
  code: string;
  name: string;
  type: EstablishmentType;
  level: EstablishmentLevel;
  operator: EstablishmentOperator;
  department: string;
  municipality: string;
  address: string;
  phone: string | null;
  emergencyPhone: string | null;
  hasEmergency: boolean;
  latitude: number | null;
  longitude: number | null;
  specialties: string[];
}

// ======================================================
// CATÁLOGO OFICIAL
// MINSAL + ISSS
// ======================================================

const verifiedNationalHospitals: VerifiedHospitalRecord[] = [
  // ====================================================
  // 1. HOSPITALES NACIONALES MINSAL
  // ====================================================

  {
    code: 'MINSAL-HN-001',
    name: 'Hospital Nacional Rosales',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.SPECIALIZED,
    operator: EstablishmentOperator.MINSAL,
    department: 'San Salvador',
    municipality: 'San Salvador',
    address: 'Final 25 Avenida Norte y Calle Arce, San Salvador',
    phone: '+503 2594-3000',
    emergencyPhone: '+503 2231-9200',
    hasEmergency: true,
    latitude: 13.7008703,
    longitude: -89.2042204,
    specialties: [
      'Medicina Interna',
      'Cirugía General',
      'Especialidades Quirúrgicas',
    ],
  },

  {
    code: 'MINSAL-HN-002',
    name: 'Hospital Nacional Especializado de Niños "Benjamín Bloom"',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.SPECIALIZED,
    operator: EstablishmentOperator.MINSAL,
    department: 'San Salvador',
    municipality: 'San Salvador',
    address: 'Final 25 Avenida Norte, San Salvador',
    phone: '+503 2133-3100',
    emergencyPhone: '+503 2225-4114',
    hasEmergency: true,
    latitude: 13.7143739,
    longitude: -89.2039403,
    specialties: [
      'Pediatría Integral',
      'Cirugía Pediátrica',
      'Subespecialidades Pediátricas',
    ],
  },

  {
    code: 'MINSAL-HN-003',
    name: 'Hospital Nacional de la Mujer "Dra. María Isabel Rodríguez"',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.SPECIALIZED,
    operator: EstablishmentOperator.MINSAL,
    department: 'San Salvador',
    municipality: 'San Salvador',
    address:
      'Final 25 Avenida Sur y Calle Francisco Menéndez, Barrio Santa Anita, San Salvador',
    phone: '+503 2206-6200',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.6906741,
    longitude: -89.2043962,
    specialties: [
      'Ginecología',
      'Obstetricia',
      'Perinatología',
      'Neonatología',
    ],
  },

  {
    code: 'MINSAL-HN-004',
    name: 'Hospital Nacional El Salvador',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.SPECIALIZED,
    operator: EstablishmentOperator.MINSAL,
    department: 'San Salvador',
    municipality: 'San Salvador',
    address:
      'Avenida de La Revolución No. 222, Colonia San Benito, San Salvador',
    phone: '+503 2594-2100',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.6884694,
    longitude: -89.2357836,
    specialties: [
      'Cuidados Críticos',
      'Atención Especializada',
      'Telemedicina',
    ],
  },

  {
    code: 'MINSAL-HN-005',
    name:
      'Hospital Nacional General de Neumología y Medicina Familiar "Dr. José Antonio Saldaña"',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.SPECIALIZED,
    operator: EstablishmentOperator.MINSAL,
    department: 'San Salvador',
    municipality: 'Panchimalco',
    address:
      'Km. 8 ½, Carretera a Los Planes de Renderos, San Salvador',
    phone: '+503 2594-5700',
    emergencyPhone: '+503 2201-2100',
    hasEmergency: true,
    latitude: 13.6472109,
    longitude: -89.1945984,
    specialties: [
      'Neumología',
      'Medicina Familiar',
      'Patologías Respiratorias',
    ],
  },

  {
    code: 'MINSAL-HN-006',
    name:
      'Hospital Nacional General y de Psiquiatría "Dr. José Molina Martínez"',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.SPECIALIZED,
    operator: EstablishmentOperator.MINSAL,
    department: 'San Salvador',
    municipality: 'Soyapango',
    address:
      'Calle La Fuente, Cantón Venecia, Soyapango, San Salvador',
    phone: '+503 2327-0200',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.7142761,
    longitude: -89.138315,
    specialties: [
      'Salud Mental',
      'Psiquiatría',
      'Rehabilitación Psicosocial',
    ],
  },

  {
    code: 'MINSAL-HN-007',
    name:
      'Hospital Nacional General "Dr. Juan José Fernández", Zacamil',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.DEPARTMENTAL,
    operator: EstablishmentOperator.MINSAL,
    department: 'San Salvador',
    municipality: 'Mejicanos',
    address:
      'Urbanización José Simeón Cañas, Colonia Zacamil, San Salvador',
    phone: '+503 2594-5000',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.7326,
    longitude: -89.2133,
    specialties: [
      'Cirugía General',
      'Maternidad',
      'Pediatría',
      'Medicina Interna',
    ],
  },

  {
    code: 'MINSAL-HN-008',
    name:
      'Hospital Nacional General "Enf. Angélica Vidal de Najarro", San Bartolo',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.DEPARTMENTAL,
    operator: EstablishmentOperator.MINSAL,
    department: 'San Salvador',
    municipality: 'Ilopango',
    address:
      'Final Calle Francisco Menéndez, contiguo a Zona Franca San Bartolo, Ilopango, San Salvador',
    phone: '+503 2201-3100',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.7043121,
    longitude: -89.1060703,
    specialties: [
      'Medicina Interna',
      'Cirugía General',
      'Pediatría',
      'Ginecología',
    ],
  },

  {
    code: 'MINSAL-HN-009',
    name:
      'Hospital Nacional Regional "San Juan de Dios", Santa Ana',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.REGIONAL,
    operator: EstablishmentOperator.MINSAL,
    department: 'Santa Ana',
    municipality: 'Santa Ana',
    address: 'Final 13 Avenida Sur No. 1, Santa Ana',
    phone: '+503 2891-1500',
    emergencyPhone: '+503 2435-9500',
    hasEmergency: true,
    latitude: 13.9918759,
    longitude: -89.5512748,
    specialties: [
      'Cirugía General',
      'Cuidados Intensivos',
      'Medicina Interna',
      'Pediatría',
      'Ginecología',
    ],
  },

  {
    code: 'MINSAL-HN-010',
    name: 'Hospital Nacional General "Dr. Jorge Mazzini Villacorta"',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.DEPARTMENTAL,
    operator: EstablishmentOperator.MINSAL,
    department: 'Sonsonate',
    municipality: 'Sonsonate',
    address: 'Calle Alberto Masferrer Poniente #3-1, Sonsonate',
    phone: '+503 2891-6500',
    emergencyPhone: '+503 2451-0200',
    hasEmergency: true,
    latitude: 13.7228276,
    longitude: -89.7292116,
    specialties: [
      'Urgencias',
      'Traumatología',
      'Maternidad',
      'Pediatría',
    ],
  },

  {
    code: 'MINSAL-HN-011',
    name: 'Hospital Nacional General "Dr. Francisco Menéndez"',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.DEPARTMENTAL,
    operator: EstablishmentOperator.MINSAL,
    department: 'Ahuachapán',
    municipality: 'Ahuachapán',
    address: 'Calle Zacamil, Cantón Ashapuco, Ahuachapán',
    phone: '+503 2891-1400',
    emergencyPhone: '+503 2445-6800',
    hasEmergency: true,
    latitude: 13.9292485,
    longitude: -89.8464141,
    specialties: [
      'Medicina General',
      'Cirugía Básica',
      'Pediatría',
      'Gineco-Obstetricia',
    ],
  },

  {
    code: 'MINSAL-HN-012',
    name: 'Hospital Nacional General "Dr. Arturo Morales", Metapán',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.MINSAL,
    department: 'Santa Ana',
    municipality: 'Metapán',
    address: 'Carretera Internacional Km. 112, Metapán, Santa Ana',
    phone: '+503 2891-1600',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 14.3248378,
    longitude: -89.4431944,
    specialties: [
      'Medicina General',
      'Cirugía Básica',
      'Pediatría',
    ],
  },

  {
    code: 'MINSAL-HN-013',
    name: 'Hospital Nacional General de Chalchuapa',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.MINSAL,
    department: 'Santa Ana',
    municipality: 'Chalchuapa',
    address:
      'Final Avenida 2 de Abril Norte, Chalchuapa, Santa Ana',
    phone: '+503 2891-4500',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.986111,
    longitude: -89.681111,
    specialties: [
      'Cirugía General',
      'Atención Materno-Infantil',
      'Urgencias',
    ],
  },

  {
    code: 'MINSAL-HN-014',
    name: 'Hospital Nacional General "San Rafael", Santa Tecla',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.REGIONAL,
    operator: EstablishmentOperator.MINSAL,
    department: 'La Libertad',
    municipality: 'Santa Tecla',
    address: '4ª Calle Oriente No. 9-2, Santa Tecla, La Libertad',
    phone: '+503 2594-4000',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.671168,
    longitude: -89.2782914,
    specialties: [
      'Urgencias 24/7',
      'Trauma',
      'Cirugía Laparoscópica',
      'Cuidados Críticos',
    ],
  },

  {
    code: 'MINSAL-HN-015',
    name: 'Hospital Nacional General "Dr. Luis Edmundo Vásquez"',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.DEPARTMENTAL,
    operator: EstablishmentOperator.MINSAL,
    department: 'Chalatenango',
    municipality: 'Chalatenango',
    address: 'Barrio San Antonio, Chalatenango',
    phone: '+503 2991-0000',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 14.0385126,
    longitude: -88.9362493,
    specialties: [
      'Atención Hospitalaria Integral',
      'Ginecología',
      'Urgencias',
    ],
  },

  {
    code: 'MINSAL-HN-016',
    name: 'Hospital Nacional General de Nueva Concepción',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.MINSAL,
    department: 'Chalatenango',
    municipality: 'Nueva Concepción',
    address:
      '9ª Calle Oriente, Barrio Rosario, Nueva Concepción, Chalatenango',
    phone: '+503 2991-0500',
    emergencyPhone: '+503 2347-5200',
    hasEmergency: true,
    latitude: 14.1313917,
    longitude: -89.2883944,
    specialties: [
      'Maternidad',
      'Urgencias Comunitarias',
      'Cirugía Básica',
    ],
  },

  {
    code: 'MINSAL-HN-017',
    name: 'Hospital Nacional "Nuestra Señora de Fátima" de Cojutepeque',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.DEPARTMENTAL,
    operator: EstablishmentOperator.MINSAL,
    department: 'Cuscatlán',
    municipality: 'Cojutepeque',
    address:
      'Barrio El Calvario, Km. 33 Antigua Carretera Panamericana, Cojutepeque, Cuscatlán',
    phone: '+503 2991-2200',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.722222,
    longitude: -88.932222,
    specialties: [
      'Emergencias',
      'Pediatría',
      'Cirugía General',
    ],
  },

  {
    code: 'MINSAL-HN-018',
    name: 'Hospital Nacional General de Suchitoto',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.MINSAL,
    department: 'Cuscatlán',
    municipality: 'Suchitoto',
    address:
      'Avenida José María Peña Fernández, Barrio El Calvario, Suchitoto, Cuscatlán',
    phone: '+503 2347-4700',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.9338102,
    longitude: -89.0288622,
    specialties: [
      'Medicina Familiar',
      'Urgencias',
      'Parto de Bajo Riesgo',
    ],
  },

  {
    code: 'MINSAL-HN-019',
    name: 'Hospital Nacional General "Santa Teresa", Zacatecoluca',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.REGIONAL,
    operator: EstablishmentOperator.MINSAL,
    department: 'La Paz',
    municipality: 'Zacatecoluca',
    address:
      'Final Avenida Juan Manuel Rodríguez, Calle al Volcán, Zacatecoluca, La Paz',
    phone: '+503 2347-1200',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.5172168,
    longitude: -88.8680208,
    specialties: [
      'Medicina Interna',
      'Cirugía General',
      'Pediatría',
      'Obstetricia',
    ],
  },

  {
    code: 'MINSAL-HN-020',
    name: 'Hospital Nacional General "Santa Gertrudis"',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.REGIONAL,
    operator: EstablishmentOperator.MINSAL,
    department: 'San Vicente',
    municipality: 'San Vicente',
    address: '2ª Avenida Sur No. 23, San Vicente',
    phone: '+503 2393-9500',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.6408928,
    longitude: -88.7837273,
    specialties: [
      'Cirugía',
      'Medicina Interna',
      'Pediatría',
      'Urgencias 24 Horas',
    ],
  },

  {
    code: 'MINSAL-HN-021',
    name: 'Hospital Nacional "San Jerónimo Emiliani" de Sensuntepeque',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.MINSAL,
    department: 'Cabañas',
    municipality: 'Sensuntepeque',
    address:
      '10ª Avenida Sur No. 1, Santa Bárbara, Sensuntepeque, Cabañas',
    phone: '+503 2361-0700',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.8751429,
    longitude: -88.622188,
    specialties: [
      'Urgencias 24/7',
      'Atención Hospitalaria General',
      'Pediatría',
    ],
  },

  {
    code: 'MINSAL-HN-022',
    name: 'Hospital Nacional General "Dr. José Luís Saca", Ilobasco',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.MINSAL,
    department: 'Cabañas',
    municipality: 'Ilobasco',
    address:
      'Final 4ª Calle Poniente, Barrio El Calvario, Ilobasco, Cabañas',
    phone: '+503 2347-5000',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.8391989,
    longitude: -88.8587581,
    specialties: [
      'Cirugía de Corta Estancia',
      'Pediatría',
      'Maternidad',
    ],
  },

  {
    code: 'MINSAL-HN-023',
    name: 'Hospital Nacional General "San Pedro", Usulután',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.DEPARTMENTAL,
    operator: EstablishmentOperator.MINSAL,
    department: 'Usulután',
    municipality: 'Usulután',
    address:
      'Final Calle Federico Penado, salida a San Salvador, Usulután',
    phone: '+503 2792-0000',
    emergencyPhone: '+503 2633-8800',
    hasEmergency: true,
    latitude: 13.3431402,
    longitude: -88.4498295,
    specialties: [
      'Medicina Interna',
      'Cirugía General',
      'Ginecología',
      'Emergencias',
    ],
  },

  {
    code: 'MINSAL-HN-024',
    name: 'Hospital Nacional de Jiquilisco',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.MINSAL,
    department: 'Usulután',
    municipality: 'Jiquilisco',
    address:
      '1ª Avenida Sur, Calle a Puerto Avalos, Cantón Roquinete, Jiquilisco, Usulután',
    phone: '+503 2684-3300',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.3189874,
    longitude: -88.571923,
    specialties: [
      'Medicina General',
      'Pediatría',
      'Maternidad',
    ],
  },

  {
    code: 'MINSAL-HN-025',
    name:
      'Hospital Nacional General "Dr. Jorge Arturo Mena", Santiago de María',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.MINSAL,
    department: 'Usulután',
    municipality: 'Santiago de María',
    address:
      '3ª Calle Poniente No. 15, Barrio Concepción, Santiago de María, Usulután',
    phone: '+503 2792-1000',
    emergencyPhone: '+503 2663-1606',
    hasEmergency: true,
    latitude: 13.4848701,
    longitude: -88.4685129,
    specialties: [
      'Atención Hospitalaria Secundaria',
      'Pediatría',
      'Obstetricia',
    ],
  },

  {
    code: 'MINSAL-HN-026',
    name:
      'Hospital Nacional Regional "San Juan de Dios", San Miguel',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.REGIONAL,
    operator: EstablishmentOperator.MINSAL,
    department: 'San Miguel',
    municipality: 'San Miguel',
    address:
      'Final 11 Calle Poniente y 23 Avenida Sur, Colonia Ciudad Jardín, San Miguel',
    phone: '+503 2792-3000',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.4740703,
    longitude: -88.1909257,
    specialties: [
      'Cirugía General',
      'Medicina Interna',
      'Cuidados Intensivos',
      'Cardiología',
    ],
  },

  {
    code: 'MINSAL-HN-027',
    name: 'Hospital Nacional General de Nueva Guadalupe',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.MINSAL,
    department: 'San Miguel',
    municipality: 'Nueva Guadalupe',
    address:
      'Barrio San Luis, Final Avenida Principal, Nueva Guadalupe, San Miguel',
    phone: '+503 2645-2200',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.5377068,
    longitude: -88.3491298,
    specialties: [
      'Medicina General',
      'Pediatría',
      'Atención de Emergencias',
    ],
  },

  {
    code: 'MINSAL-HN-028',
    name:
      'Hospital Nacional General "Monseñor Oscar Arnulfo Romero y Galdámez", Ciudad Barrios',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.MINSAL,
    department: 'San Miguel',
    municipality: 'Ciudad Barrios',
    address:
      '6ª Avenida Norte, Barrio Roma, Ciudad Barrios, San Miguel',
    phone: '+503 2792-2200',
    emergencyPhone: '+503 2684-1500',
    hasEmergency: true,
    latitude: 13.7667666,
    longitude: -88.2680037,
    specialties: [
      'Medicina General',
      'Pediatría',
      'Emergencias',
    ],
  },

  {
    code: 'MINSAL-HN-029',
    name:
      'Hospital Nacional General "Dr. Héctor Antonio Hernández Flores", San Francisco Gotera',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.DEPARTMENTAL,
    operator: EstablishmentOperator.MINSAL,
    department: 'Morazán',
    municipality: 'San Francisco Gotera',
    address:
      'Final Avenida Thompson Norte, Barrio La Cruz, San Francisco Gotera, Morazán',
    phone: '+503 2645-7100',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.6950674,
    longitude: -88.102132,
    specialties: [
      'Servicios Hospitalarios Básicos',
      'Maternidad',
      'Cirugía Básica',
    ],
  },

  {
    code: 'MINSAL-HN-030',
    name: 'Hospital Nacional General de La Unión',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.DEPARTMENTAL,
    operator: EstablishmentOperator.MINSAL,
    department: 'La Unión',
    municipality: 'Conchagua',
    address:
      'Kilómetro 180, Carretera Panamericana, Cantón Huisquil, Conchagua, La Unión',
    phone: '+503 2792-5000',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.3499923,
    longitude: -87.8593447,
    specialties: [
      'Urgencias',
      'Obstetricia',
      'Medicina Interna',
      'Cirugía General',
    ],
  },

  {
    code: 'MINSAL-HN-031',
    name: 'Hospital Nacional General de Santa Rosa de Lima',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.MINSAL,
    department: 'La Unión',
    municipality: 'Santa Rosa de Lima',
    address:
      'Carretera Ruta Militar, salida a San Miguel, Santa Rosa de Lima, La Unión',
    phone: '+503 2792-4400',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.6206222,
    longitude: -87.8968032,
    specialties: [
      'Atención Hospitalaria de Contención',
      'Emergencias 24/7',
      'Pediatría',
    ],
  },

  // ====================================================
  // 2. HOSPITALES Y POLICLÍNICOS ISSS
  // ====================================================

  {
    code: 'ISSS-HN-001',
    name: 'Hospital Médico Quirúrgico y Oncológico',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.SPECIALIZED,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'San Salvador',
    address:
      '25 Avenida Norte y 25 Calle Poniente, San Salvador',
    phone: '+503 2591-5500',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.7021511,
    longitude: -89.2070264,
    specialties: [
      'Oncología Médica y Quirúrgica',
      'Hematología',
      'Cirugía Cardiovascular',
      'Cuidados Intensivos',
    ],
  },

  {
    code: 'ISSS-HN-002',
    name: 'Hospital Materno-Infantil 1º de Mayo',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.SPECIALIZED,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'San Salvador',
    address: '23 Avenida Sur y Calle Arce, San Salvador',
    phone: '+503 2591-4700',
    emergencyPhone: '+503 2591-4899',
    hasEmergency: true,
    latitude: 13.6999492,
    longitude: -89.204144,
    specialties: [
      'Emergencias Ginecoobstétricas',
      'Perinatología',
      'Neonatología de Alta Complejidad',
    ],
  },

  {
    code: 'ISSS-HN-003',
    name: 'Hospital General ISSS',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.SPECIALIZED,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'San Salvador',
    address:
      'Alameda Juan Pablo II y 25 Avenida Norte, San Salvador',
    phone: '+503 2591-4000',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.704512,
    longitude: -89.205123,
    specialties: [
      'Traumatología',
      'Cirugía General',
      'Medicina Interna',
      'Unidad de Máxima Urgencia',
    ],
  },

  {
    code: 'ISSS-HN-004',
    name: 'Hospital Amatepec ISSS',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.DEPARTMENTAL,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'Soyapango',
    address:
      'Urbanización Amatepec, Soyapango, San Salvador',
    phone: '+503 2591-5700',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.7001696,
    longitude: -89.1634928,
    specialties: [
      'Cirugía General',
      'Medicina Interna',
      'Ginecología',
      'Obstetricia',
      'Neonatología',
    ],
  },

  {
    code: 'ISSS-HN-005',
    name: 'Hospital Policlínico Arce',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.SPECIALIZED,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'San Salvador',
    address:
      'Calle Arce y 23 Avenida Sur, San Salvador',
    phone: '+503 2591-5000',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.6998,
    longitude: -89.2081,
    specialties: [
      'Emergencias Psiquiátricas',
      'Neurología',
      'Nefrología',
      'Pie Diabético',
      'Cirugía Plástica',
    ],
  },

  {
    code: 'ISSS-HN-006',
    name: 'Hospital Policlínico Zacamil',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.DEPARTMENTAL,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'Mejicanos',
    address: 'Colonia Zacamil, Mejicanos, San Salvador',
    phone: '+503 2591-6000',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.7319,
    longitude: -89.2152,
    specialties: [
      'Emergencias Adultos y Pediatría',
      'Cirugía General',
      'Oftalmología',
      'Dermatología',
    ],
  },

  {
    code: 'ISSS-HN-007',
    name: 'Hospital Policlínico Roma',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.SPECIALIZED,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'San Salvador',
    address:
      '6a-10a Calle Poniente, Colonia Roma, San Salvador',
    phone: '+503 2591-7000',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.6944033,
    longitude: -89.2251779,
    specialties: [
      'Emergencias Pediátricas',
      'Observación Infantil',
      'Cirugía Laparoscópica',
    ],
  },

  {
    code: 'ISSS-HN-008',
    name: 'Hospital Policlínico Planes de Renderos',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.SPECIALIZED,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'Panchimalco',
    address:
      'Km. 9 ½, Carretera a Los Planes de Renderos, Panchimalco, San Salvador',
    phone: '+503 2280-2000',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.647211,
    longitude: -89.194598,
    specialties: [
      'Rehabilitación Física Integral',
      'Terapia de Lenguaje y Ocupacional',
    ],
  },

  {
    code: 'ISSS-HN-009',
    name: 'Hospital Regional de Santa Ana ISSS',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.REGIONAL,
    operator: EstablishmentOperator.ISSS,
    department: 'Santa Ana',
    municipality: 'Santa Ana',
    address: 'Final 6a Avenida Sur, Santa Ana',
    phone: '+503 2484-4000',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.9763156,
    longitude: -89.5671711,
    specialties: [
      'Cuidados Intensivos',
      'Cirugía',
      'Maternidad',
      'Pediatría',
      'Traumatología',
    ],
  },

  {
    code: 'ISSS-HN-010',
    name: 'Hospital Regional de Sonsonate ISSS',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.REGIONAL,
    operator: EstablishmentOperator.ISSS,
    department: 'Sonsonate',
    municipality: 'Sonsonate',
    address: 'Paseo 15 de Septiembre, Sonsonate',
    phone: '+503 2483-3000',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.7108578,
    longitude: -89.7273168,
    specialties: [
      'Medicina Interna',
      'Cirugía General',
      'Ortopedia',
      'Cardiología',
      'Perinatología',
    ],
  },

  {
    code: 'ISSS-HN-011',
    name: 'Hospital Regional de San Miguel ISSS',
    type: EstablishmentType.HOSPITAL,
    level: EstablishmentLevel.REGIONAL,
    operator: EstablishmentOperator.ISSS,
    department: 'San Miguel',
    municipality: 'San Miguel',
    address: 'Avenida Roosevelt Sur, San Miguel',
    phone: '+503 2660-5000',
    emergencyPhone: null,
    hasEmergency: true,
    latitude: 13.473056,
    longitude: -88.182222,
    specialties: [
      'Cirugía',
      'Ginecología y Obstetricia',
      'Cuidados Intensivos',
      'Neonatología',
    ],
  },
];

// ======================================================
// FUNCIÓN PRINCIPAL
// ======================================================

async function main() {
  console.log('');
  console.log('============================================================');
  console.log('🏥 MedicOS - LIMPIEZA Y SIEMBRA DEL CATÁLOGO HOSPITALARIO');
  console.log('============================================================');
  console.log('');
  console.log('📋 Registros oficiales preparados:', verifiedNationalHospitals.length);
  console.log('');
  console.log('⚠️  Se eliminarán TODOS los registros actuales de');
  console.log('    la tabla Establishment.');
  console.log('');
  console.log('⚠️  Esta operación NO elimina pacientes, usuarios,');
  console.log('    brigadas, consultas ni ninguna otra entidad.');
  console.log('');

  // ====================================================
  // 1. LIMPIEZA TOTAL DE ESTABLISHMENT
  // ====================================================

  console.log('🧹 Eliminando establecimientos existentes...');

  const deleted = await prisma.establishment.deleteMany({});

  console.log(
    `🗑️  Establecimientos eliminados: ${deleted.count}`,
  );

  console.log('');

  // ====================================================
  // 2. CREACIÓN DEL CATÁLOGO LIMPIO
  // ====================================================

  console.log('🏥 Insertando catálogo oficial MINSAL + ISSS...');
  console.log('');

  let createdCount = 0;

  for (const hospital of verifiedNationalHospitals) {
    await prisma.establishment.create({
      data: {
        // ------------------------------------------------
        // Identificación
        // ------------------------------------------------
        code: hospital.code,
        name: hospital.name,

        // ------------------------------------------------
        // Clasificación institucional
        // ------------------------------------------------
        type: hospital.type,
        level: hospital.level,
        operator: hospital.operator,

        // ------------------------------------------------
        // Ubicación
        // ------------------------------------------------
        department: hospital.department,
        municipality: hospital.municipality,
        address: hospital.address,

        // ------------------------------------------------
        // Contacto
        // ------------------------------------------------
        phone: hospital.phone,
        emergencyPhone: hospital.emergencyPhone,
        hasEmergency: hospital.hasEmergency,

        // ------------------------------------------------
        // Geolocalización
        // ------------------------------------------------
        latitude: hospital.latitude,
        longitude: hospital.longitude,

        // ------------------------------------------------
        // Especialidades
        // ------------------------------------------------
        specialties: hospital.specialties,

        // ------------------------------------------------
        // Camas
        //
        // El schema actual utiliza:
        // totalBeds     Int @default(0)
        // availableBeds Int @default(0)
        //
        // Por eso NO usamos null.
        // ------------------------------------------------
        totalBeds: 0,
        availableBeds: 0,

        // ------------------------------------------------
        // Estado
        // ------------------------------------------------
        status: EstablishmentStatus.OPERATIONAL,

        // ------------------------------------------------
        // Offline First
        // ------------------------------------------------
        syncStatus: SyncStatus.SYNCED,
        version: 1,
        originDeviceId: SYSTEM_DEVICE_ID,
        lastModifiedByDeviceId: SYSTEM_DEVICE_ID,
      },
    });

    createdCount++;

    console.log(
      `➕ Creado: ${hospital.code} — ${hospital.name}`,
    );
  }

  // ====================================================
  // 3. VALIDACIÓN FINAL
  // ====================================================

  const totalInDatabase = await prisma.establishment.count();

  const minsalCount = await prisma.establishment.count({
    where: {
      operator: EstablishmentOperator.MINSAL,
    },
  });

  const isssCount = await prisma.establishment.count({
    where: {
      operator: EstablishmentOperator.ISSS,
    },
  });

  const hospitalCount = await prisma.establishment.count({
    where: {
      type: EstablishmentType.HOSPITAL,
    },
  });

  // ====================================================
  // 4. RESULTADO
  // ====================================================

  console.log('');
  console.log('============================================================');
  console.log('🏥 SIEMBRA HOSPITALARIA COMPLETADA');
  console.log('============================================================');
  console.log(`🗑️  Registros eliminados:  ${deleted.count}`);
  console.log(`➕ Registros creados:      ${createdCount}`);
  console.log(`🏥 Total en Establishment: ${totalInDatabase}`);
  console.log(`🏥 Hospitales:             ${hospitalCount}`);
  console.log(`🏛️  MINSAL:                 ${minsalCount}`);
  console.log(`🏥 ISSS:                  ${isssCount}`);
  console.log('============================================================');
  console.log('');

  // ====================================================
  // 5. VALIDACIÓN DE INTEGRIDAD
  // ====================================================

  if (totalInDatabase !== verifiedNationalHospitals.length) {
    throw new Error(
      `❌ ERROR DE INTEGRIDAD: se esperaban ${verifiedNationalHospitals.length} establecimientos, pero la base contiene ${totalInDatabase}.`,
    );
  }

  if (minsalCount !== 31) {
    throw new Error(
      `❌ ERROR DE INTEGRIDAD: se esperaban 31 establecimientos MINSAL, pero existen ${minsalCount}.`,
    );
  }

  if (isssCount !== 11) {
    throw new Error(
      `❌ ERROR DE INTEGRIDAD: se esperaban 11 establecimientos ISSS, pero existen ${isssCount}.`,
    );
  }

  if (hospitalCount !== 42) {
    throw new Error(
      `❌ ERROR DE INTEGRIDAD: se esperaban 42 hospitales, pero existen ${hospitalCount}.`,
    );
  }

  console.log('✅ Validación completada correctamente.');
  console.log('✅ La tabla Establishment contiene exactamente 42 registros.');
  console.log('');
}

// ======================================================
// EJECUCIÓN
// ======================================================

main()
  .catch((error) => {
    console.error('');
    console.error('============================================================');
    console.error('❌ ERROR DURANTE LA SIEMBRA HOSPITALARIA');
    console.error('============================================================');
    console.error(error);
    console.error('');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });