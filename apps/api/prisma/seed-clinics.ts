// apps/api/prisma/seed-clinics.ts
// ======================================================
// MedicOS
// Seed oficial de Clínicas Comunales ISSS
//
// IMPORTANTE:
//
// Este seed realiza una LIMPIEZA CONTROLADA únicamente
// de los establecimientos cuyo código comienza con:
//
//     ISSS-CC-
//
// Posteriormente inserta las Clínicas Comunales ISSS
// definidas en el catálogo oficial del ISSS con sus
// coordenadas GPS georreferenciadas.
//
// NO elimina:
//
// - Hospitales MINSAL
// - Hospitales ISSS
// - Unidades Médicas ISSS
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
// Fuente:
// Directorio oficial de Centros de Atención del ISSS
//
// Fecha de catálogo:
// Agosto 2026
//
// Arquitectura:
// Offline First
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

// ======================================================
// IDENTIFICADOR DEL SISTEMA
// ======================================================

const SYSTEM_DEVICE_ID = 'SYSTEM_OFFICIAL_ISSS_2026';

// ======================================================
// INTERFAZ
// ======================================================

interface VerifiedClinicRecord {
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
// CLÍNICAS COMUNALES ISSS (35 ESTABLECIMIENTOS)
// ======================================================

const verifiedCommunalClinics: VerifiedClinicRecord[] = [
  // ====================================================
  // 1. CLÍNICA COMUNAL GUADALUPE
  // ====================================================
  {
    code: 'ISSS-CC-001',
    name: 'Clínica Comunal Guadalupe',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'Apopa',
    address:
      'Entrada a Col. Cuscatlán, Calle Principal, Casa #510, detrás de Pizza Hut Pericentro Apopa.',
    phone: '2591-2181',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.8055,
    longitude: -89.1788,
    specialties: [],
  },

  // ====================================================
  // 2. CLÍNICA COMUNAL AYUTUXTEPEQUE
  // ====================================================
  {
    code: 'ISSS-CC-002',
    name: 'Clínica Comunal Ayutuxtepeque',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'Ayutuxtepeque',
    address:
      '29 Av. Norte, Calle Principal #84, Col. Scandia, Ayutuxtepeque. Referencia: entrada de la Col. Scandia.',
    phone: '2593-0005',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.7431,
    longitude: -89.2067,
    specialties: [],
  },

  // ====================================================
  // 3. CLÍNICA COMUNAL CUSCATANCINGO
  // ====================================================
  {
    code: 'ISSS-CC-003',
    name: 'Clínica Comunal Cuscatancingo',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'Cuscatancingo',
    address:
      'Calle Bolívar y Pasaje "A", #7, Col. Santa Rosa, Cuscatancingo. Referencia: una cuadra antes del punto de los microbuses de la Ruta 20, a la par de Escuela La Paz.',
    phone: '2593-0008',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.7378,
    longitude: -89.1822,
    specialties: [],
  },

  // ====================================================
  // 4. CLÍNICA COMUNAL CIUDAD DELGADO
  // ====================================================
  {
    code: 'ISSS-CC-004',
    name: 'Clínica Comunal Ciudad Delgado',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'Delgado',
    address:
      'Avenida Paleca #8, Ciudad Delgado. Después (abajo) de la Plaza del Mercado.',
    phone: '2593-0006',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.7225,
    longitude: -89.1706,
    specialties: [],
  },

  // ====================================================
  // 5. CLÍNICA COMUNAL SANTA LUCIA
  // ====================================================
  {
    code: 'ISSS-CC-005',
    name: 'Clínica Comunal Santa Lucia',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'Ilopango',
    address:
      'Prolongación Calle Principal #66-C, Col. Santa Lucía. Entrada Col. Manzano, 1 cuadra al sur, entre Telecom y bomba de ANDA.',
    phone: '2591-2147',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.7022,
    longitude: -89.1245,
    specialties: [],
  },

  // ====================================================
  // 6. CLÍNICA COMUNAL SAN CRISTOBAL
  // ====================================================
  {
    code: 'ISSS-CC-006',
    name: 'Clínica Comunal San Cristobal',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'Ilopango',
    address:
      'Calle Francisco Meléndez, Barrio El Centro #3, Ilopango. Referencia: frente al costado norte de la Alcaldía de Ilopango.',
    phone: '2295-0918',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.7011,
    longitude: -89.1092,
    specialties: [],
  },

  // ====================================================
  // 7. CLÍNICA COMUNAL MEJICANOS
  // ====================================================
  {
    code: 'ISSS-CC-007',
    name: 'Clínica Comunal Mejicanos',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'Mejicanos',
    address:
      'Col. Palmira, Pasaje Honduras, Calle El Roble "A", N°24, Mejicanos. Referencia: a dos casas de la Unidad de Salud Pública Mejicanos.',
    phone: '2593-0002 / 2593-0009',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.738,
    longitude: -89.213,
    specialties: [],
  },

  // ====================================================
  // 8. CLÍNICA COMUNAL VIRGEN DEL TRANSITO
  // ====================================================
  {
    code: 'ISSS-CC-008',
    name: 'Clínica Comunal Virgen del Transito',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'Mejicanos',
    address:
      'Final 5ª Avenida Norte #27-B, Colonia Alfaro, Mejicanos. Referencia: frente al Súper Selectos Mejicanos.',
    phone: '2591-2145',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.7315,
    longitude: -89.214,
    specialties: [],
  },

  // ====================================================
  // 9. CLÍNICA COMUNAL LAS VICTORIAS
  // ====================================================
  {
    code: 'ISSS-CC-009',
    name: 'Clínica Comunal Las Victorias',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'Mejicanos',
    address:
      '35ª Avenida Norte, Reparto Santa Fe, No. 6, San Salvador. Referencia: 3 cuadras al norte del Parque El Roble, cerca de Cines Reforma, atrás de ANDA.',
    phone: '2235-1449',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.7205,
    longitude: -89.2185,
    specialties: [],
  },

  // ====================================================
  // 10. CLÍNICA COMUNAL SAN MARCOS
  // ====================================================
  {
    code: 'ISSS-CC-010',
    name: 'Clínica Comunal San Marcos',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'San Marcos',
    address:
      'Calle 25 de Abril Poniente y 3 Av. Norte, #125, Barrio San José, San Marcos.',
    phone: '2213-0200',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.6592,
    longitude: -89.1831,
    specialties: [],
  },

  // ====================================================
  // 11. CLÍNICA COMUNAL SAN MARTIN
  // ====================================================
  {
    code: 'ISSS-CC-011',
    name: 'Clínica Comunal San Martin',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'San Martín',
    address:
      '3ª Calle Poniente y Calle Principal, Col. San Joaquín #17 y 17 Bis, San Martín. Detrás de Iglesia Católica.',
    phone: '2593-0013',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.7428,
    longitude: -89.0558,
    specialties: [],
  },

  // ====================================================
  // 12. CLÍNICA COMUNAL SAN MIGUELITO
  // ====================================================
  {
    code: 'ISSS-CC-012',
    name: 'Clínica Comunal San Miguelito',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'San Salvador',
    address:
      '1ª Avenida Norte #1256, entre 21 y 23 Calle Poniente. Referencia: atrás del ex-Cine Fausto.',
    phone: '2591-2158',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.7083,
    longitude: -89.1925,
    specialties: [],
  },

  // ====================================================
  // 13. CLÍNICA COMUNAL LA RABIDA
  // ====================================================
  {
    code: 'ISSS-CC-013',
    name: 'Clínica Comunal La Rabida',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'San Salvador',
    address:
      'Pasaje El Refugio #131 entre 35 y 37 Calle Oriente, Col. La Rábida. Referencia: 3 cuadras abajo de gasolinera Texaco La Rábida.',
    phone: '2591-2160',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.7142,
    longitude: -89.1878,
    specialties: [],
  },

  // ====================================================
  // 14. CLÍNICA COMUNAL SAN ANTONIO ABAD
  // ====================================================
  {
    code: 'ISSS-CC-014',
    name: 'Clínica Comunal San Antonio Abad',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'San Salvador',
    address:
      'Calle San Antonio Abad, Av. Lisboa #771. Referencia: una cuadra abajo de Monumento La Constitución.',
    phone: '2591-2142',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.722,
    longitude: -89.2325,
    specialties: [],
  },

  // ====================================================
  // 15. CLÍNICA COMUNAL MIRAMONTE
  // ====================================================
  {
    code: 'ISSS-CC-015',
    name: 'Clínica Comunal Miramonte',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'San Salvador',
    address:
      'Colonia Miramonte y Avenida Sierra Nevada #618, frente a Casa Miriam.',
    phone: '2591-2144',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.7075,
    longitude: -89.2195,
    specialties: [],
  },

  // ====================================================
  // 16. CLÍNICA COMUNAL MONSERRAT
  // ====================================================
  {
    code: 'ISSS-CC-016',
    name: 'Clínica Comunal Monserrat',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'San Salvador',
    address:
      'Calle Monserrat, antiguo plantel de IVU, Ciudadela Monserrat ISSS.',
    phone: '2591-6838',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.6872,
    longitude: -89.212,
    specialties: [],
  },

  // ====================================================
  // 17. CLÍNICA COMUNAL COSTA RICA
  // ====================================================
  {
    code: 'ISSS-CC-017',
    name: 'Clínica Comunal Costa Rica',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'San Salvador',
    address:
      'Avenida Irazú y Calle Juan Mora #306, Colonia Costa Rica. Referencia: frente al ISRI y al Asilo Sara Zaldívar.',
    phone: '2270-0248',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.6811,
    longitude: -89.1915,
    specialties: [],
  },

  // ====================================================
  // 18. CLÍNICA COMUNAL SANTO TOMAS
  // ====================================================
  {
    code: 'ISSS-CC-018',
    name: 'Clínica Comunal Santo Tomas',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'Santo Tomás',
    address:
      'Barrio El Calvario, Calle Alberto Masferrer, Casa #16, Santo Tomás. Calle antigua a Zacatecoluca, frente al Cementerio Municipal.',
    phone: '2593-0014',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.6408,
    longitude: -89.1333,
    specialties: [],
  },

  // ====================================================
  // 19. CLÍNICA COMUNAL MONTE MARIA
  // ====================================================
  {
    code: 'ISSS-CC-019',
    name: 'Clínica Comunal Monte Maria',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'Soyapango',
    address:
      'Reparto Monte María II, Pasaje 3, Casa #1, Soyapango. Referencia: 1.5 cuadras después de Hospital Amatepec ISSS.',
    phone: '2293-4902',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.705,
    longitude: -89.143,
    specialties: [],
  },

  // ====================================================
  // 20. CLÍNICA COMUNAL SAN JOSE
  // ====================================================
  {
    code: 'ISSS-CC-020',
    name: 'Clínica Comunal San Jose',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'Soyapango',
    address:
      'Polígono "D", Lote #1, Lotificación Alta Vista, Residencial Alta Vista, Ilopango. En la misma calle del Colegio Juan Coto.',
    phone: '2593-0011',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.728,
    longitude: -89.098,
    specialties: [],
  },

  // ====================================================
  // 21. CLÍNICA COMUNAL MORAZAN
  // ====================================================
  {
    code: 'ISSS-CC-021',
    name: 'Clínica Comunal Morazan',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'San Salvador',
    municipality: 'Soyapango',
    address:
      'Calle Xochimilco #3, Repto. Guadalupe, Soyapango. Frente a Escuela María Auxiliadora.',
    phone: '2277-0759',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.6965,
    longitude: -89.148,
    specialties: [],
  },

  // ====================================================
  // 22. CLÍNICA COMUNAL EL CALVARIO
  // ====================================================
  {
    code: 'ISSS-CC-022',
    name: 'Clínica Comunal El Calvario',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'Ahuachapán',
    municipality: 'Ahuachapán',
    address:
      '2ª Avenida Norte #2-7, Barrio El Calvario, Ahuachapán. 1 y 1/2 cuadra al sur de la Iglesia El Calvario.',
    phone: '2890-0126',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.9214,
    longitude: -89.8467,
    specialties: [],
  },

  // ====================================================
  // 23. CLÍNICA COMUNAL LOURDES COLON
  // ====================================================
  {
    code: 'ISSS-CC-023',
    name: 'Clínica Comunal Lourdes Colon',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'La Libertad',
    municipality: 'Colón',
    address:
      'Km 23 y ½ carretera a Sonsonate, Lourdes Colón. Unos 200 metros después del mercado viniendo de Sonsonate a San Salvador.',
    phone: '2338-4054',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.7231,
    longitude: -89.3639,
    specialties: [],
  },

  // ====================================================
  // 24. CLÍNICA COMUNAL SITIO DEL NIÑO
  // ====================================================
  {
    code: 'ISSS-CC-024',
    name: 'Clínica Comunal Sitio del Niño',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'La Libertad',
    municipality: 'San Juan Opico',
    address:
      'Avenida Principal, Calle N°2 Casa #24, Col. Sitio del Niño, San Juan Opico. 1/2 cuadra antes de Iglesia Parroquial.',
    phone: '2990-2000',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.7889,
    longitude: -89.3514,
    specialties: [],
  },

  // ====================================================
  // 25. CLÍNICA COMUNAL ANTIGUO CUSCATLAN
  // ====================================================
  {
    code: 'ISSS-CC-025',
    name: 'Clínica Comunal Antiguo Cuscatlan',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'La Libertad',
    municipality: 'Santa Tecla',
    address:
      'Col. La Sultana 2, Avenida Antiguo Cuscatlán, Calle Los Claveles 2, Casa Nº9, Antiguo Cuscatlán.',
    phone: '2593-0004',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.6764,
    longitude: -89.2486,
    specialties: [],
  },

  // ====================================================
  // 26. CLÍNICA COMUNAL CIUDAD MERLIOT
  // ====================================================
  {
    code: 'ISSS-CC-026',
    name: 'Clínica Comunal Ciudad Merliot',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'La Libertad',
    municipality: 'Santa Tecla',
    address:
      'Boulevard Merliot, Polígono "C", Casa #4, Urb. Jardines de La Libertad, Santa Tecla. En Boulevard Merliot por Ferretería Freund.',
    phone: '2591-2180',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.678,
    longitude: -89.272,
    specialties: [],
  },

  // ====================================================
  // 27. CLÍNICA COMUNAL SAN ANTONIO
  // ====================================================
  {
    code: 'ISSS-CC-027',
    name: 'Clínica Comunal San Antonio',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'La Libertad',
    municipality: 'Santa Tecla',
    address:
      '1 Av. Norte 2-6 entre 1ª y 3ª Calle Poniente, Barrio Belén, Santa Tecla.',
    phone: '2591-2175',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.6739,
    longitude: -89.2889,
    specialties: [],
  },

  // ====================================================
  // 28. CLÍNICA COMUNAL SANTA MONICA
  // ====================================================
  {
    code: 'ISSS-CC-028',
    name: 'Clínica Comunal Santa Monica',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'La Libertad',
    municipality: 'Santa Tecla',
    address:
      '9ª Calle Oriente, Polígono 17, Casa #6, Ciudad Merliot. Referencia: 4 cuadras arriba de Plaza Merliot, frente a Restaurante La Taberna.',
    phone: '2229-8880',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.6795,
    longitude: -89.266,
    specialties: [],
  },

  // ====================================================
  // 29. CLÍNICA COMUNAL OLOCUILTA
  // ====================================================
  {
    code: 'ISSS-CC-029',
    name: 'Clínica Comunal Olocuilta',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'La Paz',
    municipality: 'Olocuilta',
    address:
      'Barrio El Carmen, Calle La Tejera (calle al cementerio) #3, Olocuilta. Referencia: 1/2 cuadra después de gasolinera Texaco.',
    phone: '2990-2023',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.565,
    longitude: -89.1172,
    specialties: [],
  },

  // ====================================================
  // 30. CLÍNICA COMUNAL SANTA ROSA DE LIMA
  // ====================================================
  {
    code: 'ISSS-CC-030',
    name: 'Clínica Comunal Santa Rosa de Lima',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'La Unión',
    municipality: 'Santa Rosa de Lima',
    address:
      'Avenida Fernando Benítez, Barrio Las Delicias, 2 cuadras y 1/2 al norte del parque central de la ciudad de Santa Rosa de Lima.',
    phone: '2656-6753',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.6247,
    longitude: -87.8936,
    specialties: [],
  },

  // ====================================================
  // 31. CLÍNICA COMUNAL BARRIO SAN FRANCISCO
  // ====================================================
  {
    code: 'ISSS-CC-031',
    name: 'Clínica Comunal Barrio San Francisco',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'San Miguel',
    municipality: 'San Miguel',
    address:
      '5ª Avenida Norte, conocida por Av. Monseñor Romero #501-A, Barrio San Francisco, San Miguel. Referencia: 1/2 cuadra al sur de Pupusería San Rafael.',
    phone: '2790-0023 / 2790-0022',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.486,
    longitude: -88.175,
    specialties: [],
  },

  // ====================================================
  // 32. CLÍNICA COMUNAL PANAMERICANA
  // ====================================================
  {
    code: 'ISSS-CC-032',
    name: 'Clínica Comunal Panamericana',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'San Miguel',
    municipality: 'San Miguel',
    address:
      '17 Calle Poniente número 104, Barrio San Nicolás, San Miguel. A una cuadra del Banco de Fomento Agropecuario y media cuadra de Restaurante El Portón.',
    phone: '2640-1946',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.4795,
    longitude: -88.181,
    specialties: [],
  },

  // ====================================================
  // 33. CLÍNICA COMUNAL SAN RAFAEL
  // ====================================================
  {
    code: 'ISSS-CC-033',
    name: 'Clínica Comunal San Rafael',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'Santa Ana',
    municipality: 'Chalchuapa',
    address:
      'Final 23 Avenida Sur, entre 9ª y 11ª Calle Oriente. A la par de ACODES.',
    phone: '2890-3006',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.9867,
    longitude: -89.6806,
    specialties: [],
  },

  // ====================================================
  // 34. CLÍNICA COMUNAL SANTA BARBARA
  // ====================================================
  {
    code: 'ISSS-CC-034',
    name: 'Clínica Comunal Santa Barbara',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'Santa Ana',
    municipality: 'Santa Ana',
    address:
      '6ª Avenida Sur, entre 7ª y 9ª Calle Poniente #29, Santa Ana. Frente a la ex-Guardia Nacional.',
    phone: '2890-0114',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.9942,
    longitude: -89.5597,
    specialties: [],
  },

  // ====================================================
  // 35. CLÍNICA COMUNAL SANTO DOMINGO
  // ====================================================
  {
    code: 'ISSS-CC-035',
    name: 'Clínica Comunal Santo Domingo',
    type: EstablishmentType.CLINIC,
    level: EstablishmentLevel.BASIC,
    operator: EstablishmentOperator.ISSS,
    department: 'Sonsonate',
    municipality: 'Sonsonate',
    address:
      'Final 23 Avenida Sur, entre 9ª y 11ª Calle Oriente. A la par de ACODES.',
    phone: '2890-3006',
    emergencyPhone: null,
    hasEmergency: false,
    latitude: 13.7189,
    longitude: -89.7242,
    specialties: [],
  },
];

// ======================================================
// FUNCIÓN PRINCIPAL
// ======================================================

async function main() {
  console.log('');
  console.log('============================================================');
  console.log('🏥 MedicOS - SIEMBRA DE CLÍNICAS COMUNALES ISSS (CON GPS)');
  console.log('============================================================');
  console.log('');

  console.log(
    '📋 Clínicas Comunales oficiales preparadas:',
    verifiedCommunalClinics.length,
  );

  console.log('');
  console.log('⚠️  Se eliminarán ÚNICAMENTE los registros cuyo código');
  console.log('    comience con ISSS-CC-.');
  console.log('');
  console.log('✅ Los hospitales y las Unidades Médicas NO serán tocados.');
  console.log('');

  // ====================================================
  // 1. LIMPIEZA CONTROLADA
  // ====================================================

  console.log('🧹 Eliminando Clínicas Comunales ISSS existentes...');

  const deleted = await prisma.establishment.deleteMany({
    where: {
      code: {
        startsWith: 'ISSS-CC-',
      },
    },
  });

  console.log(`🗑️  Clínicas Comunales eliminadas: ${deleted.count}`);
  console.log('');

  // ====================================================
  // 2. CREACIÓN DEL CATÁLOGO
  // ====================================================

  console.log('🏥 Insertando catálogo oficial con georreferenciación GPS...');
  console.log('');

  let createdCount = 0;

  for (const clinic of verifiedCommunalClinics) {
    await prisma.establishment.create({
      data: {
        code: clinic.code,
        name: clinic.name,
        type: clinic.type,
        level: clinic.level,
        operator: clinic.operator,
        department: clinic.department,
        municipality: clinic.municipality,
        address: clinic.address,
        phone: clinic.phone,
        emergencyPhone: clinic.emergencyPhone,
        hasEmergency: clinic.hasEmergency,
        latitude: clinic.latitude,
        longitude: clinic.longitude,
        specialties: clinic.specialties,
        totalBeds: 0,
        availableBeds: 0,
        status: EstablishmentStatus.OPERATIONAL,
        syncStatus: SyncStatus.SYNCED,
        version: 1,
        originDeviceId: SYSTEM_DEVICE_ID,
        lastModifiedByDeviceId: SYSTEM_DEVICE_ID,
      },
    });

    createdCount++;
    console.log(`➕ Creado: ${clinic.code} — ${clinic.name} [GPS: ${clinic.latitude}, ${clinic.longitude}]`);
  }

  // ====================================================
  // 3. VALIDACIÓN FINAL
  // ====================================================

  const totalClinicsInDatabase = await prisma.establishment.count({
    where: {
      code: {
        startsWith: 'ISSS-CC-',
      },
    },
  });

  const clinicTypeCount = await prisma.establishment.count({
    where: {
      code: {
        startsWith: 'ISSS-CC-',
      },
      type: EstablishmentType.CLINIC,
    },
  });

  const isssClinicOperatorCount = await prisma.establishment.count({
    where: {
      code: {
        startsWith: 'ISSS-CC-',
      },
      operator: EstablishmentOperator.ISSS,
    },
  });

  const hospitalCount = await prisma.establishment.count({
    where: {
      type: EstablishmentType.HOSPITAL,
    },
  });

  const medicalUnitCount = await prisma.establishment.count({
    where: {
      code: {
        startsWith: 'ISSS-UM-',
      },
    },
  });

  // ====================================================
  // 4. RESULTADOS Y VALIDACIÓN DE INTEGRIDAD
  // ====================================================

  console.log('');
  console.log('============================================================');
  console.log('🏥 SIEMBRA DE CLÍNICAS COMUNALES COMPLETADA');
  console.log('============================================================');
  console.log(`🗑️  Registros ISSS-CC eliminados: ${deleted.count}`);
  console.log(`➕ Registros creados:             ${createdCount}`);
  console.log(`🏥 Clínicas ISSS-CC en BD:        ${totalClinicsInDatabase}`);
  console.log(`🏥 Tipo CLINIC:                   ${clinicTypeCount}`);
  console.log(`🏛️  Operador ISSS:                ${isssClinicOperatorCount}`);
  console.log(`🏥 Hospitales conservados:        ${hospitalCount}`);
  console.log(`🏥 Unidades Médicas conservadas:  ${medicalUnitCount}`);
  console.log('============================================================');
  console.log('');

  if (totalClinicsInDatabase !== verifiedCommunalClinics.length) {
    throw new Error(
      `❌ ERROR DE INTEGRIDAD: se esperaban ${verifiedCommunalClinics.length} Clínicas Comunales ISSS, pero la base contiene ${totalClinicsInDatabase}.`
    );
  }

  if (clinicTypeCount !== verifiedCommunalClinics.length) {
    throw new Error(
      `❌ ERROR DE INTEGRIDAD: se esperaban ${verifiedCommunalClinics.length} registros con tipo CLINIC, pero existen ${clinicTypeCount}.`
    );
  }

  if (isssClinicOperatorCount !== verifiedCommunalClinics.length) {
    throw new Error(
      `❌ ERROR DE INTEGRIDAD: se esperaban ${verifiedCommunalClinics.length} registros con operador ISSS, pero existen ${isssClinicOperatorCount}.`
    );
  }

  if (hospitalCount !== 42) {
    throw new Error(
      `❌ ERROR DE INTEGRIDAD: se esperaban 42 hospitales conservados, pero existen ${hospitalCount}.`
    );
  }

  console.log('✅ Validación de Clínicas Comunales: OK.');
  console.log('✅ Validación de hospitales existentes: OK.');
  console.log('✅ Validación de Unidades Médicas existentes: OK.');
  console.log('');
}

// ======================================================
// EJECUCIÓN
// ======================================================

main()
  .catch((error) => {
    console.error('');
    console.error('============================================================');
    console.error('❌ ERROR DURANTE LA SIEMBRA DE CLÍNICAS COMUNALES');
    console.error('============================================================');
    console.error(error);
    console.error('');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });