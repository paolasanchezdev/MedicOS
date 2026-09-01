// =========================================================================
// ARCHIVO: apps/web/src/shared/data/elSalvadorTerritory.ts
// DESCRIPCIÓN: Catálogo territorial oficial reutilizable de El Salvador
//              (14 Departamentos, 44 Municipios y sus Distritos).
// =========================================================================

export interface MunicipioData {
  nombre: string;
  distritos: string[];
}

export interface DepartamentoData {
  nombre: string;
  municipios: MunicipioData[];
}

export const TERRITORIO_EL_SALVADOR: DepartamentoData[] = [
  {
    nombre: 'Ahuachapán',
    municipios: [
      {
        nombre: 'Ahuachapán Norte',
        distritos: ['Atiquizaya', 'El Refugio', 'San Lorenzo', 'Turín'],
      },
      {
        nombre: 'Ahuachapán Centro',
        distritos: ['Ahuachapán', 'Apaneca', 'Concepción de Ataco', 'Tacuba'],
      },
      {
        nombre: 'Ahuachapán Sur',
        distritos: ['Guaymango', 'Jujutla', 'San Francisco Menéndez', 'San Pedro Puxtla'],
      },
    ],
  },
  {
    nombre: 'Santa Ana',
    municipios: [
      {
        nombre: 'Santa Ana Norte',
        distritos: ['Masahuat', 'Metapán', 'Santa Rosa Guachipilín', 'Texistepeque'],
      },
      {
        nombre: 'Santa Ana Centro',
        distritos: ['Santa Ana'],
      },
      {
        nombre: 'Santa Ana Este',
        distritos: ['Coatepeque', 'El Congo'],
      },
      {
        nombre: 'Santa Ana Oeste',
        distritos: [
          'Candelaria de la Frontera',
          'Chalchuapa',
          'El Porvenir',
          'San Antonio Pajonal',
          'San Sebastián Salitrillo',
          'Santiago de la Frontera',
        ],
      },
    ],
  },
  {
    nombre: 'Sonsonate',
    municipios: [
      {
        nombre: 'Sonsonate Norte',
        distritos: ['Juayúa', 'Nahuizalco', 'Salcoatitán', 'Santa Catarina Masahuat'],
      },
      {
        nombre: 'Sonsonate Centro',
        distritos: [
          'Sonsonate',
          'Sonzacate',
          'Nahulingo',
          'San Antonio del Monte',
          'Santo Domingo de Guzmán',
        ],
      },
      {
        nombre: 'Sonsonate Este',
        distritos: ['Armenia', 'Caluco', 'Cuisnahuat', 'Santa Isabel Ishuatán', 'San Julián'],
      },
      {
        nombre: 'Sonsonate Oeste',
        distritos: ['Acajutla'],
      },
    ],
  },
  {
    nombre: 'Chalatenango',
    municipios: [
      {
        nombre: 'Chalatenango Norte',
        distritos: ['La Palma', 'San Ignacio', 'Citalá'],
      },
      {
        nombre: 'Chalatenango Centro',
        distritos: [
          'Nueva Concepción',
          'Agua Caliente',
          'Dulce Nombre de María',
          'El Paraíso',
          'La Reina',
          'San Fernando',
          'San Francisco Morazán',
          'San Rafael',
          'Santa Rita',
          'Tejutla',
        ],
      },
      {
        nombre: 'Chalatenango Sur',
        distritos: [
          'Chalatenango',
          'Arcatao',
          'Azacualpa',
          'Cancasque',
          'Comalapa',
          'Concepción Quezaltepeque',
          'El Carrizal',
          'La Laguna',
          'Las Vueltas',
          'Nombre de Jesús',
          'Nueva Trinidad',
          'Ojos de Agua',
          'Potonico',
          'San Antonio de la Cruz',
          'San Antonio Los Ranchos',
          'San Francisco Lempa',
          'San Isidro Labrador',
          'San José Cancasque',
          'San José Las Flores',
          'San Luis del Carmen',
          'San Miguel de Mercedes',
        ],
      },
    ],
  },
  {
    nombre: 'La Libertad',
    municipios: [
      {
        nombre: 'La Libertad Norte',
        distritos: ['Quezaltepeque', 'San Matías', 'San Pablo Tacachico'],
      },
      {
        nombre: 'La Libertad Centro',
        distritos: ['San Juan Opico', 'Ciudad Arce'],
      },
      {
        nombre: 'La Libertad Oeste',
        distritos: ['Colón', 'Jayaque', 'Sacacoyo', 'Tepecoyo', 'Talnique'],
      },
      {
        nombre: 'La Libertad Este',
        distritos: [
          'Antiguo Cuscatlán',
          'Huizúcar',
          'Nuevo Cuscatlán',
          'San José Villanueva',
          'Zaragoza',
        ],
      },
      {
        nombre: 'La Libertad Costa',
        distritos: ['Chiltiupán', 'Jicalapa', 'La Libertad', 'Tamanique', 'Teotepeque'],
      },
      {
        nombre: 'La Libertad Sur',
        distritos: ['Santa Tecla', 'Comasagua'],
      },
    ],
  },
  {
    nombre: 'San Salvador',
    municipios: [
      {
        nombre: 'San Salvador Norte',
        distritos: ['Aguilares', 'El Paisnal', 'Guazapa'],
      },
      {
        nombre: 'San Salvador Oeste',
        distritos: ['Apopa', 'Nejapa'],
      },
      {
        nombre: 'San Salvador Este',
        distritos: ['Ilopango', 'San Martín', 'Soyapango', 'Tonacatepeque'],
      },
      {
        nombre: 'San Salvador Centro',
        distritos: ['Ayutuxtepeque', 'Mejicanos', 'San Salvador', 'Cuscatancingo', 'Ciudad Delgado'],
      },
      {
        nombre: 'San Salvador Sur',
        distritos: [
          'Panchimalco',
          'Rosario de Mora',
          'San Marcos',
          'Santo Tomás',
          'Santiago Texacuangos',
        ],
      },
    ],
  },
  {
    nombre: 'Cuscatlán',
    municipios: [
      {
        nombre: 'Cuscatlán Norte',
        distritos: [
          'Suchitoto',
          'San José Guayabal',
          'Oratorio de Concepción',
          'San Bartolomé Perulapía',
          'San Pedro Perulapán',
        ],
      },
      {
        nombre: 'Cuscatlán Sur',
        distritos: [
          'Cojutepeque',
          'Candelaria',
          'El Carmen',
          'El Rosario',
          'Monte San Juan',
          'San Cristóbal',
          'San Rafael Cedros',
          'San Ramón',
          'Santa Cruz Analquito',
          'Santa Cruz Michapa',
          'Tenancingo',
        ],
      },
    ],
  },
  {
    nombre: 'La Paz',
    municipios: [
      {
        nombre: 'La Paz Oeste',
        distritos: [
          'Cuyultitán',
          'Olocuilta',
          'San Juan Talpa',
          'San Luis Talpa',
          'San Pedro Masahuat',
          'Tapalhuaca',
          'San Francisco Chinameca',
        ],
      },
      {
        nombre: 'La Paz Centro',
        distritos: [
          'El Rosario',
          'Jerusalén',
          'Mercedes La Ceiba',
          'Paraíso de Osorio',
          'San Antonio Masahuat',
          'San Emigdio',
          'San Juan Tepezontes',
          'San Luis La Herradura',
          'San Miguel Tepezontes',
          'San Pedro Nonualco',
          'Santa María Ostuma',
          'Santiago Nonualco',
        ],
      },
      {
        nombre: 'La Paz Este',
        distritos: ['San Juan Nonualco', 'San Rafael Obrajuelo', 'Zacatecoluca'],
      },
    ],
  },
  {
    nombre: 'Cabañas',
    municipios: [
      {
        nombre: 'Cabañas Este',
        distritos: ['Guacotecti', 'San Isidro', 'Sensuntepeque', 'Victoria', 'Dolores'],
      },
      {
        nombre: 'Cabañas Oeste',
        distritos: ['Ilobasco', 'Tejutepeque', 'Jutiapa', 'Cinquera'],
      },
    ],
  },
  {
    nombre: 'San Vicente',
    municipios: [
      {
        nombre: 'San Vicente Norte',
        distritos: [
          'Apastepeque',
          'Santa Clara',
          'San Ildefonso',
          'San Esteban Catarina',
          'San Sebastián',
          'San Lorenzo',
          'Santo Domingo',
        ],
      },
      {
        nombre: 'San Vicente Sur',
        distritos: [
          'San Vicente',
          'Guadalupe',
          'Verapaz',
          'Tepetitán',
          'Tecoluca',
          'San Cayetano Istepeque',
        ],
      },
    ],
  },
  {
    nombre: 'Usulután',
    municipios: [
      {
        nombre: 'Usulután Norte',
        distritos: [
          'Santiago de María',
          'Alegría',
          'Berlín',
          'Mercedes Umaña',
          'Jucuapa',
          'El Triunfo',
          'Estanzuelas',
          'San Buenaventura',
          'Nueva Granada',
        ],
      },
      {
        nombre: 'Usulután Este',
        distritos: [
          'Usulután',
          'Jucuarán',
          'San Dionisio',
          'Concepción Batres',
          'Santa María',
          'Ereguayquín',
          'Tecapán',
          'Santa Elena',
          'California',
          'Ozatlán',
        ],
      },
      {
        nombre: 'Usulután Oeste',
        distritos: ['Jiquilisco', 'Puerto El Triunfo', 'San Agustín', 'San Francisco Javier'],
      },
    ],
  },
  {
    nombre: 'San Miguel',
    municipios: [
      {
        nombre: 'San Miguel Norte',
        distritos: [
          'Ciudad Barrios',
          'Sesori',
          'Nuevo Edén de San Juan',
          'San Gerardo',
          'San Luis de la Reina',
          'Carolina',
          'San Antonio del Mosco',
          'Chapeltique',
        ],
      },
      {
        nombre: 'San Miguel Centro',
        distritos: ['San Miguel', 'Comacarán', 'Uluazapa', 'Moncagua', 'Quelepa', 'Chirilagua'],
      },
      {
        nombre: 'San Miguel Sur',
        distritos: [
          'Chinameca',
          'El Tránsito',
          'Lolotique',
          'Nueva Guadalupe',
          'San Jorge',
          'San Rafael Oriente',
        ],
      },
    ],
  },
  {
    nombre: 'Morazán',
    municipios: [
      {
        nombre: 'Morazán Norte',
        distritos: [
          'Arambala',
          'Cacaopera',
          'Corinto',
          'El Rosario',
          'Joateca',
          'Jocoaitique',
          'Meanguera',
          'Perquín',
          'San Fernando',
          'San Isidro',
          'Torola',
        ],
      },
      {
        nombre: 'Morazán Sur',
        distritos: [
          'San Francisco Gotera',
          'Chilanga',
          'Delicias de Concepción',
          'El Divisadero',
          'Gualococti',
          'Guatajiagua',
          'Jocoro',
          'Lolotiquillo',
          'Osicala',
          'San Carlos',
          'San Simón',
          'Sensembra',
          'Sociedad',
          'Yamabal',
          'Yoloaiquín',
        ],
      },
    ],
  },
  {
    nombre: 'La Unión',
    municipios: [
      {
        nombre: 'La Unión Norte',
        distritos: [
          'Anamorós',
          'Bolívar',
          'Concepción de Oriente',
          'El Sauce',
          'Lislique',
          'Nueva Esparta',
          'Pasaquina',
          'Polorós',
          'San Alejo',
          'Yucuaiquín',
        ],
      },
      {
        nombre: 'La Unión Sur',
        distritos: [
          'La Unión',
          'Conchagua',
          'El Tamarindo',
          'Meanguera del Golfo',
          'San José',
          'Yayantique',
          'Intipucá',
        ],
      },
    ],
  },
];