

## Project Structure

```text
MedicOS/
├── .readme-generator/
│   ├── history/
│   │   └── 1785534733625-a420fdad.md
│   └── .gitignore
├── apps/
│   ├── api/
│   │   ├── prisma/
│   │   │   ├── migrations/
│   │   │   │   ├── 20260714200750_init_medicos_mvp_core/
│   │   │   │   │   └── migration.sql
│   │   │   │   ├── 20260716153349_add_patient_role/
│   │   │   │   │   └── migration.sql
│   │   │   │   └── migration_lock.toml
│   │   │   └── schema.prisma
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   └── prisma.ts
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── error.middleware.ts
│   │   │   │   ├── turnstile.middleware.ts
│   │   │   │   └── validate.middleware.ts
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.routes.ts
│   │   │   │   │   ├── auth.schema.ts
│   │   │   │   │   └── auth.service.ts
│   │   │   │   ├── brigades/
│   │   │   │   │   ├── brigades.controller.ts
│   │   │   │   │   ├── brigades.routes.ts
│   │   │   │   │   ├── brigades.schema.ts
│   │   │   │   │   └── brigades.service.ts
│   │   │   │   ├── patients/
│   │   │   │   │   ├── patients.controller.ts
│   │   │   │   │   ├── patients.routes.ts
│   │   │   │   │   ├── patients.schema.ts
│   │   │   │   │   └── patients.service.ts
│   │   │   │   ├── reports/
│   │   │   │   │   ├── reports.controller.ts
│   │   │   │   │   ├── reports.routes.ts
│   │   │   │   │   ├── reports.schema.ts
│   │   │   │   │   └── reports.service.ts
│   │   │   │   └── users/
│   │   │   │       ├── users.controller.ts
│   │   │   │       ├── users.routes.ts
│   │   │   │       ├── users.schema.ts
│   │   │   │       └── users.service.ts
│   │   │   ├── routes/
│   │   │   │   ├── health.routes.ts
│   │   │   │   └── index.ts
│   │   │   ├── scripts/
│   │   │   │   ├── create-admin.ts
│   │   │   │   ├── create-authority-user.ts
│   │   │   │   └── test-db.ts
│   │   │   ├── services/
│   │   │   │   └── base.service.ts
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   ├── .gitignore
│   │   ├── package.json
│   │   ├── prisma.config.ts
│   │   └── tsconfig.json
│   └── web/
│       ├── public/
│       │   ├── images/
│       │   │   ├── flow/
│       │   │   │   ├── step-01.png
│       │   │   │   └── step-02.png
│       │   │   └── how-it-works/
│       │   │       ├── step1-brigada.png
│       │   │       └── step2-qr.png
│       │   ├── —Pngtree—3d teal cross with red_22560716.png
│       │   ├── bg-medicos.png
│       │   ├── desafio1.png
│       │   ├── desafio2.png
│       │   ├── desafio3.png
│       │   ├── favicon.svg
│       │   ├── icons.svg
│       │   ├── logo-sinNombre.png
│       │   ├── logo.png
│       │   ├── solucion1.png
│       │   ├── solucion2.png
│       │   ├── solucion3.webp
│       │   └── sv.svg
│       ├── src/
│       │   ├── app/
│       │   │   ├── router/
│       │   │   │   ├── protectedRoutes.tsx
│       │   │   │   └── routes.tsx
│       │   │   └── store/
│       │   │       └── index.ts
│       │   ├── core/
│       │   │   ├── auth/
│       │   │   │   ├── session.ts
│       │   │   │   └── token.ts
│       │   │   ├── config/
│       │   │   │   ├── navigation/
│       │   │   │   │   ├── roles/
│       │   │   │   │   │   ├── admin.navigation.ts
│       │   │   │   │   │   ├── authority.navigation.ts
│       │   │   │   │   │   ├── brigadista.navigation.ts
│       │   │   │   │   │   ├── doctor.navigation.ts
│       │   │   │   │   │   └── patient.navigation.ts
│       │   │   │   │   └── types.ts
│       │   │   │   ├── environment.ts
│       │   │   │   └── navigation.config.ts
│       │   │   ├── context/
│       │   │   │   ├── AuthContext.tsx
│       │   │   │   ├── AuthContextInstance.ts
│       │   │   │   ├── AuthTypes.ts
│       │   │   │   └── useAuth.ts
│       │   │   ├── permissions/
│       │   │   │   └── roles.ts
│       │   │   └── security/
│       │   │       └── Gate.tsx
│       │   ├── layouts/
│       │   │   └── DashboardLayout/
│       │   │       └── DashboardLayout.tsx
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   │   ├── components/
│       │   │   │   │   ├── LoginBanner.tsx
│       │   │   │   │   ├── LoginForm.tsx
│       │   │   │   │   ├── RegisterBanner.tsx
│       │   │   │   │   └── RegisterForm.tsx
│       │   │   │   ├── hooks/
│       │   │   │   │   ├── useIdleTimeout.ts
│       │   │   │   │   └── useLoginForm.ts
│       │   │   │   ├── pages/
│       │   │   │   │   ├── Login.tsx
│       │   │   │   │   └── Register.tsx
│       │   │   │   └── services/
│       │   │   │       └── auth.service.ts
│       │   │   ├── brigades/
│       │   │   │   ├── components/
│       │   │   │   ├── constants/
│       │   │   │   ├── context/
│       │   │   │   │   ├── BrigadeContext.tsx
│       │   │   │   │   └── BrigadeProvider.tsx
│       │   │   │   ├── data/
│       │   │   │   │   └── mock-brigade.ts
│       │   │   │   ├── hooks/
│       │   │   │   │   └── useBrigade.ts
│       │   │   │   ├── schemas/
│       │   │   │   ├── services/
│       │   │   │   ├── types/
│       │   │   │   │   └── brigade.types.ts
│       │   │   │   ├── utils/
│       │   │   │   └── index.ts
│       │   │   ├── landing/
│       │   │   │   ├── components/
│       │   │   │   │   ├── layout/
│       │   │   │   │   │   ├── Footer.tsx
│       │   │   │   │   │   └── Header.tsx
│       │   │   │   │   ├── sections/
│       │   │   │   │   │   ├── AiSupportSection/
│       │   │   │   │   │   │   ├── components/
│       │   │   │   │   │   │   ├── data/
│       │   │   │   │   │   │   ├── AiSupportSection.styles.ts
│       │   │   │   │   │   │   ├── AiSupportSection.tsx
│       │   │   │   │   │   │   └── index.ts
│       │   │   │   │   │   ├── CommunityDedicationSection/
│       │   │   │   │   │   │   ├── CommunityDedicationSection.styles.ts
│       │   │   │   │   │   │   ├── CommunityDedicationSection.tsx
│       │   │   │   │   │   │   └── index.ts
│       │   │   │   │   │   ├── Hero/
│       │   │   │   │   │   │   ├── panels/
│       │   │   │   │   │   │   ├── Hero.styles.ts
│       │   │   │   │   │   │   ├── Hero.tsx
│       │   │   │   │   │   │   ├── HeroBackground.tsx
│       │   │   │   │   │   │   ├── HeroDashboardPreview.tsx
│       │   │   │   │   │   │   ├── HeroGlassBadge.tsx
│       │   │   │   │   │   │   ├── HeroWidgets.tsx
│       │   │   │   │   │   │   └── useHeroInteractions.ts
│       │   │   │   │   │   ├── HowItWorks/
│       │   │   │   │   │   │   ├── HowItWorks.styles.ts
│       │   │   │   │   │   │   └── HowItWorks.tsx
│       │   │   │   │   │   ├── ImpactSection/
│       │   │   │   │   │   │   ├── components/
│       │   │   │   │   │   │   ├── ImpactSection.styles.ts
│       │   │   │   │   │   │   ├── ImpactSection.tsx
│       │   │   │   │   │   │   └── index.ts
│       │   │   │   │   │   ├── MainModules/
│       │   │   │   │   │   │   ├── components/
│       │   │   │   │   │   │   ├── data/
│       │   │   │   │   │   │   ├── MainModules.styles.ts
│       │   │   │   │   │   │   └── MainModules.tsx
│       │   │   │   │   │   ├── ProblemSection/
│       │   │   │   │   │   │   ├── ProblemSection.styles.ts
│       │   │   │   │   │   │   └── ProblemSection.tsx
│       │   │   │   │   │   └── SolutionSection/
│       │   │   │   │   │       ├── SolutionSection.styles.ts
│       │   │   │   │   │       └── SolutionSection.tsx
│       │   │   │   │   └── ui/
│       │   │   │   │       ├── DemoModal/
│       │   │   │   │       │   ├── DemoModal.tsx
│       │   │   │   │       │   └── index.ts
│       │   │   │   │       ├── FeatureCard.tsx
│       │   │   │   │       └── ScrollReveal.tsx
│       │   │   │   ├── data/
│       │   │   │   │   ├── featuresData.ts
│       │   │   │   │   └── landingData.ts
│       │   │   │   ├── hooks/
│       │   │   │   │   └── useParallax.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── parallax.ts
│       │   │   │   └── LandingPage.tsx
│       │   │   ├── patients/
│       │   │   │   ├── components/
│       │   │   │   ├── constants/
│       │   │   │   ├── context/
│       │   │   │   ├── data/
│       │   │   │   ├── hooks/
│       │   │   │   ├── schemas/
│       │   │   │   ├── services/
│       │   │   │   ├── types/
│       │   │   │   │   └── patient.types.ts
│       │   │   │   ├── utils/
│       │   │   │   └── index.ts
│       │   │   ├── reports/
│       │   │   │   ├── components/
│       │   │   │   │   └── context/
│       │   │   │   ├── constants/
│       │   │   │   ├── context/
│       │   │   │   ├── data/
│       │   │   │   ├── hooks/
│       │   │   │   │   └── useReports.ts
│       │   │   │   ├── schemas/
│       │   │   │   ├── services/
│       │   │   │   │   └── reports.service.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── reports.types.ts
│       │   │   │   └── utils/
│       │   │   └── users/
│       │   │       ├── components/
│       │   │       │   └── UserRoleModal.tsx
│       │   │       ├── constants/
│       │   │       │   └── user.constants.ts
│       │   │       ├── context/
│       │   │       ├── hooks/
│       │   │       ├── schemas/
│       │   │       │   └── user.schemas.ts
│       │   │       ├── services/
│       │   │       │   └── users.service.ts
│       │   │       ├── types/
│       │   │       │   └── user.types.ts
│       │   │       └── index.ts
│       │   ├── portals/
│       │   │   ├── admin/
│       │   │   │   ├── layout/
│       │   │   │   │   ├── AdminHeader.tsx
│       │   │   │   │   ├── AdminLayout.tsx
│       │   │   │   │   ├── AdminSidebar.tsx
│       │   │   │   │   ├── EstadoSistemaBadge.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   ├── navigation/
│       │   │   │   │   └── admin.navigation.ts
│       │   │   │   ├── pages/
│       │   │   │   │   ├── brigadas/
│       │   │   │   │   │   ├── equipos/
│       │   │   │   │   │   │   └── EquiposBrigadasPage.tsx
│       │   │   │   │   │   ├── estado/
│       │   │   │   │   │   │   └── EstadoBrigadasPage.tsx
│       │   │   │   │   │   ├── responsables/
│       │   │   │   │   │   │   └── ResponsablesBrigadasPage.tsx
│       │   │   │   │   │   └── todas/
│       │   │   │   │   │       └── BrigadasPage.tsx
│       │   │   │   │   ├── configuracion/
│       │   │   │   │   │   ├── general/
│       │   │   │   │   │   │   └── ConfiguracionGeneralPage.tsx
│       │   │   │   │   │   ├── notificaciones/
│       │   │   │   │   │   │   └── ConfiguracionNotificacionesPage.tsx
│       │   │   │   │   │   ├── preferencias/
│       │   │   │   │   │   │   └── PreferenciasPage.tsx
│       │   │   │   │   │   └── seguridad/
│       │   │   │   │   │       └── ConfiguracionSeguridadPage.tsx
│       │   │   │   │   ├── dashboard/
│       │   │   │   │   │   ├── actividad/
│       │   │   │   │   │   │   └── ActividadSistemaPage.tsx
│       │   │   │   │   │   └── resumen/
│       │   │   │   │   │       └── ResumenAdminPage.tsx
│       │   │   │   │   ├── datos/
│       │   │   │   │   │   ├── exportacion/
│       │   │   │   │   │   │   └── ExportacionDatosPage.tsx
│       │   │   │   │   │   ├── importacion/
│       │   │   │   │   │   │   └── ImportacionDatosPage.tsx
│       │   │   │   │   │   ├── integridad/
│       │   │   │   │   │   │   └── IntegridadDatosPage.tsx
│       │   │   │   │   │   └── sincronizacion/
│       │   │   │   │   │       └── SincronizacionPage.tsx
│       │   │   │   │   ├── establecimientos/
│       │   │   │   │   │   ├── clinicas/
│       │   │   │   │   │   │   └── ClinicasPage.tsx
│       │   │   │   │   │   ├── hospitales/
│       │   │   │   │   │   │   └── HospitalesPage.tsx
│       │   │   │   │   │   ├── recursos/
│       │   │   │   │   │   │   └── RecursosEstablecimientosPage.tsx
│       │   │   │   │   │   └── unidades-salud/
│       │   │   │   │   │       └── UnidadesSaludPage.tsx
│       │   │   │   │   ├── notificaciones/
│       │   │   │   │   │   ├── centro/
│       │   │   │   │   │   │   └── CentroNotificacionesPage.tsx
│       │   │   │   │   │   ├── historial/
│       │   │   │   │   │   │   └── HistorialNotificacionesPage.tsx
│       │   │   │   │   │   └── plantillas/
│       │   │   │   │   │       └── PlantillasNotificacionesPage.tsx
│       │   │   │   │   ├── pacientes/
│       │   │   │   │   │   ├── estado-registros/
│       │   │   │   │   │   │   └── EstadoRegistrosPage.tsx
│       │   │   │   │   │   ├── identificacion/
│       │   │   │   │   │   │   └── IdentificacionPacientesPage.tsx
│       │   │   │   │   │   └── todos/
│       │   │   │   │   │       └── PacientesPage.tsx
│       │   │   │   │   ├── reportes/
│       │   │   │   │   │   ├── actividad/
│       │   │   │   │   │   │   └── ReportesActividadPage.tsx
│       │   │   │   │   │   ├── exportaciones/
│       │   │   │   │   │   │   └── ExportacionesPage.tsx
│       │   │   │   │   │   ├── sistema/
│       │   │   │   │   │   │   └── ReportesSistemaPage.tsx
│       │   │   │   │   │   └── usuarios/
│       │   │   │   │   │       └── ReportesUsuariosPage.tsx
│       │   │   │   │   ├── seguridad/
│       │   │   │   │   │   ├── accesos/
│       │   │   │   │   │   │   └── AccesosPage.tsx
│       │   │   │   │   │   ├── auditoria/
│       │   │   │   │   │   │   └── AuditoriaPage.tsx
│       │   │   │   │   │   ├── eventos/
│       │   │   │   │   │   │   └── EventosSeguridadPage.tsx
│       │   │   │   │   │   └── sesiones/
│       │   │   │   │   │       └── SesionesActivasPage.tsx
│       │   │   │   │   ├── sistema/
│       │   │   │   │   │   ├── base-datos/
│       │   │   │   │   │   │   └── EstadoBaseDatosPage.tsx
│       │   │   │   │   │   ├── salud/
│       │   │   │   │   │   │   └── SaludSistemaPage.tsx
│       │   │   │   │   │   ├── servicios/
│       │   │   │   │   │   │   └── ServiciosSistemaPage.tsx
│       │   │   │   │   │   └── sincronizacion/
│       │   │   │   │   │       └── EstadoSincronizacionPage.tsx
│       │   │   │   │   └── usuarios/
│       │   │   │   │       ├── estado/
│       │   │   │   │       │   └── EstadoUsuariosPage.tsx
│       │   │   │   │       ├── permisos/
│       │   │   │   │       │   └── PermisosPage.tsx
│       │   │   │   │       ├── roles/
│       │   │   │   │       │   └── RolesPage.tsx
│       │   │   │   │       └── todos/
│       │   │   │   │           └── UsuariosPage.tsx
│       │   │   │   ├── routes/
│       │   │   │   │   └── AdminRoutes.tsx
│       │   │   │   └── AdminPanel.tsx
│       │   │   ├── authority/
│       │   │   │   ├── layout/
│       │   │   │   │   ├── AuthorityHeader.tsx
│       │   │   │   │   ├── AuthorityLayout.tsx
│       │   │   │   │   ├── AuthoritySidebar.tsx
│       │   │   │   │   ├── EstadoSistemaBadge.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   ├── navigation/
│       │   │   │   │   └── authority.navigation.ts
│       │   │   │   ├── pages/
│       │   │   │   │   ├── brigadas/
│       │   │   │   │   │   ├── cobertura/
│       │   │   │   │   │   │   └── CoberturaBrigadasPage.tsx
│       │   │   │   │   │   ├── historial/
│       │   │   │   │   │   │   └── HistorialBrigadasPage.tsx
│       │   │   │   │   │   ├── programadas/
│       │   │   │   │   │   │   └── BrigadasProgramadasPage.tsx
│       │   │   │   │   │   └── resultados/
│       │   │   │   │   │       └── ResultadosBrigadasPage.tsx
│       │   │   │   │   ├── campanas/
│       │   │   │   │   │   ├── activas/
│       │   │   │   │   │   │   └── CampanasActivasPage.tsx
│       │   │   │   │   │   ├── planificacion/
│       │   │   │   │   │   │   └── PlanificacionCampanasPage.tsx
│       │   │   │   │   │   ├── resultados/
│       │   │   │   │   │   │   └── ResultadosCampanasPage.tsx
│       │   │   │   │   │   └── seguimiento/
│       │   │   │   │   │       └── SeguimientoCampanasPage.tsx
│       │   │   │   │   ├── configuracion/
│       │   │   │   │   │   ├── accesos/
│       │   │   │   │   │   │   └── AccesosPage.tsx
│       │   │   │   │   │   ├── auditoria/
│       │   │   │   │   │   │   └── AuditoriaPage.tsx
│       │   │   │   │   │   ├── notificaciones/
│       │   │   │   │   │   │   └── NotificacionesPage.tsx
│       │   │   │   │   │   └── preferencias/
│       │   │   │   │   │       └── PreferenciasPage.tsx
│       │   │   │   │   ├── dashboard/
│       │   │   │   │   │   ├── resumen/
│       │   │   │   │   │   │   └── ResumenAutoridadPage.tsx
│       │   │   │   │   │   └── salud-sistema/
│       │   │   │   │   │       └── SaludSistemaPage.tsx
│       │   │   │   │   ├── epidemiologia/
│       │   │   │   │   │   ├── alertas/
│       │   │   │   │   │   │   └── AlertasEpidemiologicasPage.tsx
│       │   │   │   │   │   ├── brotes/
│       │   │   │   │   │   │   └── BrotesPage.tsx
│       │   │   │   │   │   ├── factores-riesgo/
│       │   │   │   │   │   │   └── FactoresRiesgoPage.tsx
│       │   │   │   │   │   ├── tendencias/
│       │   │   │   │   │   │   └── TendenciasEpidemiologicasPage.tsx
│       │   │   │   │   │   └── vigilancia/
│       │   │   │   │   │       └── VigilanciaEpidemiologicaPage.tsx
│       │   │   │   │   ├── establecimientos/
│       │   │   │   │   │   ├── clinicas/
│       │   │   │   │   │   │   └── ClinicasPage.tsx
│       │   │   │   │   │   ├── hospitales/
│       │   │   │   │   │   │   └── HospitalesPage.tsx
│       │   │   │   │   │   ├── recursos/
│       │   │   │   │   │   │   └── RecursosEstablecimientosPage.tsx
│       │   │   │   │   │   └── unidades-salud/
│       │   │   │   │   │       └── UnidadesSaludPage.tsx
│       │   │   │   │   ├── estadisticas/
│       │   │   │   │   │   ├── brigadas/
│       │   │   │   │   │   │   └── EstadisticasBrigadasPage.tsx
│       │   │   │   │   │   ├── cobertura/
│       │   │   │   │   │   │   └── CoberturaPage.tsx
│       │   │   │   │   │   ├── comunidades/
│       │   │   │   │   │   │   └── EstadisticasComunidadesPage.tsx
│       │   │   │   │   │   ├── enfermedades/
│       │   │   │   │   │   │   └── EstadisticasEnfermedadesPage.tsx
│       │   │   │   │   │   ├── pacientes/
│       │   │   │   │   │   │   └── EstadisticasPacientesPage.tsx
│       │   │   │   │   │   ├── salud-materno-infantil/
│       │   │   │   │   │   │   └── SaludMaternoInfantilPage.tsx
│       │   │   │   │   │   └── vacunacion/
│       │   │   │   │   │       └── VacunacionPage.tsx
│       │   │   │   │   ├── inteligencia-artificial/
│       │   │   │   │   │   ├── consultas/
│       │   │   │   │   │   │   └── ConsultasIAPage.tsx
│       │   │   │   │   │   ├── predicciones/
│       │   │   │   │   │   │   └── PrediccionesIAPage.tsx
│       │   │   │   │   │   ├── recomendaciones/
│       │   │   │   │   │   │   └── RecomendacionesIAPage.tsx
│       │   │   │   │   │   ├── resumenes/
│       │   │   │   │   │   │   └── ResumenesIAPage.tsx
│       │   │   │   │   │   └── tendencias/
│       │   │   │   │   │       └── TendenciasIAPage.tsx
│       │   │   │   │   ├── mapas/
│       │   │   │   │   │   ├── brigadas/
│       │   │   │   │   │   │   └── MapaBrigadasPage.tsx
│       │   │   │   │   │   ├── calor-epidemiologico/
│       │   │   │   │   │   │   └── MapaCalorEpidemiologicoPage.tsx
│       │   │   │   │   │   ├── cobertura/
│       │   │   │   │   │   │   └── MapaCoberturaPage.tsx
│       │   │   │   │   │   ├── comunidades/
│       │   │   │   │   │   │   └── MapaComunidadesPage.tsx
│       │   │   │   │   │   └── zonas-prioritarias/
│       │   │   │   │   │       └── ZonasPrioritariasPage.tsx
│       │   │   │   │   └── reportes/
│       │   │   │   │       ├── brigadas/
│       │   │   │   │       │   └── ReportesBrigadasPage.tsx
│       │   │   │   │       ├── ejecutivos/
│       │   │   │   │       │   └── ReportesEjecutivosPage.tsx
│       │   │   │   │       ├── epidemiologicos/
│       │   │   │   │       │   └── ReportesEpidemiologicosPage.tsx
│       │   │   │   │       ├── exportaciones/
│       │   │   │   │       │   └── ExportacionesPage.tsx
│       │   │   │   │       └── personalizados/
│       │   │   │   │           └── ReportesPersonalizadosPage.tsx
│       │   │   │   ├── routes/
│       │   │   │   │   └── AuthorityRoutes.tsx
│       │   │   │   └── AuthorityPanel.tsx
│       │   │   ├── brigadista/
│       │   │   │   ├── layout/
│       │   │   │   │   ├── BrigadistaBottomNav.tsx
│       │   │   │   │   ├── BrigadistaHeader.tsx
│       │   │   │   │   ├── BrigadistaLayout.tsx
│       │   │   │   │   ├── BrigadistaSidebar.tsx
│       │   │   │   │   ├── BrigadistaStatusBadge.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   ├── navigation/
│       │   │   │   │   └── brigadista.navigation.ts
│       │   │   │   ├── pages/
│       │   │   │   │   ├── brigada/
│       │   │   │   │   │   ├── jornada/
│       │   │   │   │   │   │   └── JornadaBrigadaPage.tsx
│       │   │   │   │   │   ├── pacientes/
│       │   │   │   │   │   │   └── PacientesBrigadaPage.tsx
│       │   │   │   │   │   └── resumen/
│       │   │   │   │   │       └── ResumenBrigadaPage.tsx
│       │   │   │   │   ├── consultas/
│       │   │   │   │   │   ├── historial/
│       │   │   │   │   │   │   └── HistorialConsultasPage.tsx
│       │   │   │   │   │   ├── nueva/
│       │   │   │   │   │   │   └── NuevaConsultaPage.tsx
│       │   │   │   │   │   └── pendientes/
│       │   │   │   │   │       └── ConsultasPendientesPage.tsx
│       │   │   │   │   ├── dashboard/
│       │   │   │   │   │   ├── actividad/
│       │   │   │   │   │   │   └── ActividadBrigadistaPage.tsx
│       │   │   │   │   │   └── resumen/
│       │   │   │   │   │       └── ResumenBrigadistaPage.tsx
│       │   │   │   │   ├── evaluacion/
│       │   │   │   │   │   ├── antecedentes/
│       │   │   │   │   │   │   └── AntecedentesPage.tsx
│       │   │   │   │   │   ├── observaciones/
│       │   │   │   │   │   │   └── ObservacionesPage.tsx
│       │   │   │   │   │   ├── signos-vitales/
│       │   │   │   │   │   │   └── SignosVitalesPage.tsx
│       │   │   │   │   │   └── sintomas/
│       │   │   │   │   │       └── SintomasPage.tsx
│       │   │   │   │   ├── mapa/
│       │   │   │   │   │   ├── establecimientos/
│       │   │   │   │   │   │   └── MapaEstablecimientosPage.tsx
│       │   │   │   │   │   ├── pacientes/
│       │   │   │   │   │   │   └── MapaPacientesPage.tsx
│       │   │   │   │   │   └── ubicacion/
│       │   │   │   │   │       └── UbicacionPage.tsx
│       │   │   │   │   ├── notificaciones/
│       │   │   │   │   │   ├── alertas/
│       │   │   │   │   │   │   └── AlertasPage.tsx
│       │   │   │   │   │   └── centro/
│       │   │   │   │   │       └── CentroNotificacionesPage.tsx
│       │   │   │   │   ├── pacientes/
│       │   │   │   │   │   ├── buscar/
│       │   │   │   │   │   │   └── BuscarPacientePage.tsx
│       │   │   │   │   │   ├── escanear/
│       │   │   │   │   │   │   └── EscanearPacientePage.tsx
│       │   │   │   │   │   ├── expediente/
│       │   │   │   │   │   │   └── ExpedientePacientePage.tsx
│       │   │   │   │   │   └── registrar/
│       │   │   │   │   │       └── RegistrarPacientePage.tsx
│       │   │   │   │   ├── perfil/
│       │   │   │   │   │   ├── datos/
│       │   │   │   │   │   │   └── DatosBrigadistaPage.tsx
│       │   │   │   │   │   ├── preferencias/
│       │   │   │   │   │   │   └── PreferenciasBrigadistaPage.tsx
│       │   │   │   │   │   └── seguridad/
│       │   │   │   │   │       └── SeguridadBrigadistaPage.tsx
│       │   │   │   │   ├── reportes/
│       │   │   │   │   │   ├── brigada/
│       │   │   │   │   │   │   └── ReportesBrigadaPage.tsx
│       │   │   │   │   │   ├── consultas/
│       │   │   │   │   │   │   └── ReportesConsultasPage.tsx
│       │   │   │   │   │   └── pacientes/
│       │   │   │   │   │       └── ReportesPacientesPage.tsx
│       │   │   │   │   ├── seguimiento/
│       │   │   │   │   │   ├── alertas/
│       │   │   │   │   │   │   └── AlertasSeguimientoPage.tsx
│       │   │   │   │   │   ├── controles/
│       │   │   │   │   │   │   └── ControlesPage.tsx
│       │   │   │   │   │   └── pacientes/
│       │   │   │   │   │       └── SeguimientoPacientesPage.tsx
│       │   │   │   │   ├── sincronizacion/
│       │   │   │   │   │   ├── estado/
│       │   │   │   │   │   │   └── EstadoSincronizacionPage.tsx
│       │   │   │   │   │   ├── historial/
│       │   │   │   │   │   │   └── HistorialSincronizacionPage.tsx
│       │   │   │   │   │   └── pendientes/
│       │   │   │   │   │       └── PendientesSincronizacionPage.tsx
│       │   │   │   │   └── tratamientos/
│       │   │   │   │       ├── indicaciones/
│       │   │   │   │       │   └── IndicacionesPage.tsx
│       │   │   │   │       ├── medicamentos/
│       │   │   │   │       │   └── MedicamentosPage.tsx
│       │   │   │   │       └── seguimiento/
│       │   │   │   │           └── SeguimientoTratamientoPage.tsx
│       │   │   │   ├── routes/
│       │   │   │   │   └── BrigadistaRoutes.tsx
│       │   │   │   ├── BrigadistaPanel.tsx
│       │   │   │   └── index.ts
│       │   │   ├── medico/
│       │   │   │   ├── layout/
│       │   │   │   │   ├── index.ts
│       │   │   │   │   ├── MedicoBottomNav.tsx
│       │   │   │   │   ├── MedicoHeader.tsx
│       │   │   │   │   ├── MedicoLayout.tsx
│       │   │   │   │   ├── MedicoSidebar.tsx
│       │   │   │   │   └── MedicoStatusBadge.tsx
│       │   │   │   ├── navigation/
│       │   │   │   │   └── medico.navigation.ts
│       │   │   │   ├── pages/
│       │   │   │   │   ├── consultas/
│       │   │   │   │   │   ├── agenda/
│       │   │   │   │   │   │   └── AgendaConsultasPage.tsx
│       │   │   │   │   │   ├── historial/
│       │   │   │   │   │   │   └── HistorialConsultasPage.tsx
│       │   │   │   │   │   ├── nueva/
│       │   │   │   │   │   │   └── NuevaConsultaPage.tsx
│       │   │   │   │   │   └── seguimiento/
│       │   │   │   │   │       └── SeguimientoConsultasPage.tsx
│       │   │   │   │   ├── dashboard/
│       │   │   │   │   │   ├── actividad/
│       │   │   │   │   │   │   └── ActividadMedicoPage.tsx
│       │   │   │   │   │   ├── agenda/
│       │   │   │   │   │   │   └── AgendaMedicoPage.tsx
│       │   │   │   │   │   ├── alertas/
│       │   │   │   │   │   │   └── AlertasClinicasPage.tsx
│       │   │   │   │   │   └── resumen/
│       │   │   │   │   │       └── ResumenMedicoPage.tsx
│       │   │   │   │   ├── diagnosticos/
│       │   │   │   │   │   ├── catalogo/
│       │   │   │   │   │   │   └── CatalogoDiagnosticosPage.tsx
│       │   │   │   │   │   ├── historial/
│       │   │   │   │   │   │   └── HistorialDiagnosticosPage.tsx
│       │   │   │   │   │   └── nuevo/
│       │   │   │   │   │       └── NuevoDiagnosticoPage.tsx
│       │   │   │   │   ├── estudios/
│       │   │   │   │   │   ├── imagen/
│       │   │   │   │   │   │   └── EstudiosImagenPage.tsx
│       │   │   │   │   │   ├── laboratorio/
│       │   │   │   │   │   │   └── ResultadosLaboratorioPage.tsx
│       │   │   │   │   │   ├── resultados/
│       │   │   │   │   │   │   └── ResultadosEstudiosPage.tsx
│       │   │   │   │   │   └── solicitar/
│       │   │   │   │   │       └── SolicitarEstudioPage.tsx
│       │   │   │   │   ├── evaluacion/
│       │   │   │   │   │   ├── anamnesis/
│       │   │   │   │   │   │   └── AnamnesisPage.tsx
│       │   │   │   │   │   ├── examen-fisico/
│       │   │   │   │   │   │   └── ExamenFisicoPage.tsx
│       │   │   │   │   │   ├── observaciones/
│       │   │   │   │   │   │   └── ObservacionesClinicasPage.tsx
│       │   │   │   │   │   └── signos-vitales/
│       │   │   │   │   │       └── RegistroSignosVitalesPage.tsx
│       │   │   │   │   ├── expediente/
│       │   │   │   │   │   ├── antecedentes/
│       │   │   │   │   │   │   └── AlergiasAntecedentesPacientePage.tsx
│       │   │   │   │   │   ├── consultas/
│       │   │   │   │   │   │   └── ConsultasPacientePage.tsx
│       │   │   │   │   │   ├── diagnosticos/
│       │   │   │   │   │   │   └── DiagnosticosPacientePage.tsx
│       │   │   │   │   │   ├── medicamentos/
│       │   │   │   │   │   │   └── MedicamentosPacientePage.tsx
│       │   │   │   │   │   ├── signos-vitales/
│       │   │   │   │   │   │   └── SignosVitalesPacientePage.tsx
│       │   │   │   │   │   └── vacunas/
│       │   │   │   │   │       └── VacunasPacientePage.tsx
│       │   │   │   │   ├── ia/
│       │   │   │   │   │   ├── alertas/
│       │   │   │   │   │   │   └── AlertasIAPage.tsx
│       │   │   │   │   │   ├── analisis/
│       │   │   │   │   │   │   └── AnalisisIAPage.tsx
│       │   │   │   │   │   ├── asistente/
│       │   │   │   │   │   │   └── AsistenteClinicoIAPage.tsx
│       │   │   │   │   │   └── historial/
│       │   │   │   │   │       └── HistorialAnalisisIAPage.tsx
│       │   │   │   │   ├── notificaciones/
│       │   │   │   │   │   ├── alertas/
│       │   │   │   │   │   │   └── AlertasPage.tsx
│       │   │   │   │   │   ├── centro/
│       │   │   │   │   │   │   └── CentroNotificacionesPage.tsx
│       │   │   │   │   │   └── mensajes/
│       │   │   │   │   │       └── MensajesPage.tsx
│       │   │   │   │   ├── pacientes/
│       │   │   │   │   │   ├── buscar/
│       │   │   │   │   │   │   └── BuscarPacientePage.tsx
│       │   │   │   │   │   ├── detalle/
│       │   │   │   │   │   │   └── DetallePacientePage.tsx
│       │   │   │   │   │   ├── listado/
│       │   │   │   │   │   │   └── PacientesPage.tsx
│       │   │   │   │   │   └── qr/
│       │   │   │   │   │       └── LectorQRPage.tsx
│       │   │   │   │   ├── perfil/
│       │   │   │   │   │   ├── datos-profesionales/
│       │   │   │   │   │   │   └── DatosProfesionalesPage.tsx
│       │   │   │   │   │   ├── especialidad/
│       │   │   │   │   │   │   └── EspecialidadPage.tsx
│       │   │   │   │   │   ├── preferencias/
│       │   │   │   │   │   │   └── PreferenciasMedicoPage.tsx
│       │   │   │   │   │   └── seguridad/
│       │   │   │   │   │       └── SeguridadMedicoPage.tsx
│       │   │   │   │   ├── recetas/
│       │   │   │   │   │   ├── activas/
│       │   │   │   │   │   │   └── RecetasActivasPage.tsx
│       │   │   │   │   │   ├── historial/
│       │   │   │   │   │   │   └── HistorialRecetasPage.tsx
│       │   │   │   │   │   └── nueva/
│       │   │   │   │   │       └── NuevaRecetaPage.tsx
│       │   │   │   │   ├── reportes/
│       │   │   │   │   │   ├── brigadas/
│       │   │   │   │   │   │   └── ReporteBrigadasPage.tsx
│       │   │   │   │   │   ├── clinicos/
│       │   │   │   │   │   │   └── ReportesClinicosPage.tsx
│       │   │   │   │   │   ├── consultas/
│       │   │   │   │   │   │   └── ReporteConsultasPage.tsx
│       │   │   │   │   │   └── pacientes/
│       │   │   │   │   │       └── ReportePacientesPage.tsx
│       │   │   │   │   ├── salud-materna/
│       │   │   │   │   │   ├── controles-prenatales/
│       │   │   │   │   │   │   └── ControlesPrenatalesPage.tsx
│       │   │   │   │   │   ├── embarazo/
│       │   │   │   │   │   │   └── ControlEmbarazoPage.tsx
│       │   │   │   │   │   └── seguimiento/
│       │   │   │   │   │       └── SeguimientoMaternoPage.tsx
│       │   │   │   │   └── tratamientos/
│       │   │   │   │       ├── historial/
│       │   │   │   │       │   └── HistorialTratamientosPage.tsx
│       │   │   │   │       ├── medicamentos/
│       │   │   │   │       │   └── MedicamentosPage.tsx
│       │   │   │   │       ├── plan/
│       │   │   │   │       │   └── PlanTratamientoPage.tsx
│       │   │   │   │       └── seguimiento/
│       │   │   │   │           └── SeguimientoTratamientoPage.tsx
│       │   │   │   ├── routes/
│       │   │   │   │   └── MedicoRoutes.tsx
│       │   │   │   ├── index.ts
│       │   │   │   └── MedicoPanel.tsx
│       │   │   └── paciente/
│       │   │       ├── layout/
│       │   │       │   ├── index.ts
│       │   │       │   ├── PacienteHeader.tsx
│       │   │       │   ├── PacienteLayout.tsx
│       │   │       │   └── PacienteSidebar.tsx
│       │   │       ├── navigation/
│       │   │       │   └── paciente.navigation.ts
│       │   │       ├── pages/
│       │   │       │   ├── citas/
│       │   │       │   │   ├── agendar/
│       │   │       │   │   │   └── AgendarCitaPage.tsx
│       │   │       │   │   ├── mis-citas/
│       │   │       │   │   │   └── MisCitasPage.tsx
│       │   │       │   │   └── telemedicina/
│       │   │       │   │       └── TelemedicinaPage.tsx
│       │   │       │   ├── dashboard/
│       │   │       │   │   ├── actividad/
│       │   │       │   │   │   └── ActividadPacientePage.tsx
│       │   │       │   │   └── resumen/
│       │   │       │   │       └── ResumenPacientePage.tsx
│       │   │       │   ├── documentos/
│       │   │       │   │   ├── constancias/
│       │   │       │   │   │   └── ConstanciasMedicasPage.tsx
│       │   │       │   │   └── descarga-expediente/
│       │   │       │   │       └── DescargaExpedientePage.tsx
│       │   │       │   ├── educacion-ia/
│       │   │       │   │   ├── articulos/
│       │   │       │   │   │   └── ArticulosEducativosPage.tsx
│       │   │       │   │   ├── asistente/
│       │   │       │   │   │   └── AsistenteSaludIAPage.tsx
│       │   │       │   │   └── consejos-personalizados/
│       │   │       │   │       └── ConsejosPersonalizadosPage.tsx
│       │   │       │   ├── estudios/
│       │   │       │   │   ├── estudios-imagen/
│       │   │       │   │   │   └── EstudiosImagenPage.tsx
│       │   │       │   │   └── resultados-laboratorio/
│       │   │       │   │       └── ResultadosLaboratorioPage.tsx
│       │   │       │   ├── expediente/
│       │   │       │   │   ├── alergias-antecedentes/
│       │   │       │   │   │   └── AlergiasAntecedentesPage.tsx
│       │   │       │   │   ├── consultas/
│       │   │       │   │   │   └── HistorialConsultasPage.tsx
│       │   │       │   │   ├── diagnosticos/
│       │   │       │   │   │   └── DiagnosticosPage.tsx
│       │   │       │   │   └── vacunas/
│       │   │       │   │       └── VacunasPage.tsx
│       │   │       │   ├── monitoreo/
│       │   │       │   │   ├── habitos-estilo-vida/
│       │   │       │   │   │   └── EstiloVidaPage.tsx
│       │   │       │   │   └── signos-vitales/
│       │   │       │   │       └── SignosVitalesPage.tsx
│       │   │       │   ├── notificaciones/
│       │   │       │   │   ├── centro/
│       │   │       │   │   │   └── CentroNotificacionesPage.tsx
│       │   │       │   │   └── mensajes-medico/
│       │   │       │   │       └── MensajesMedicoPage.tsx
│       │   │       │   ├── perfil/
│       │   │       │   │   ├── contactos-emergencia/
│       │   │       │   │   │   └── ContactosEmergenciaPage.tsx
│       │   │       │   │   ├── datos-personales/
│       │   │       │   │   │   └── DatosPersonalesPage.tsx
│       │   │       │   │   ├── preferencias/
│       │   │       │   │   │   └── PreferenciasPacientePage.tsx
│       │   │       │   │   └── seguridad/
│       │   │       │   │       └── SeguridadPacientePage.tsx
│       │   │       │   ├── salud-materna/
│       │   │       │   │   ├── citas-prenatales/
│       │   │       │   │   │   └── CitasPrenatalesPage.tsx
│       │   │       │   │   ├── control-embarazo/
│       │   │       │   │   │   └── ControlEmbarazoPage.tsx
│       │   │       │   │   └── diario-sintomas/
│       │   │       │   │       └── DiarioSintomasPage.tsx
│       │   │       │   └── tratamientos/
│       │   │       │       ├── historial-medicamentos/
│       │   │       │       │   └── HistorialMedicamentosPage.tsx
│       │   │       │       ├── recetas-activas/
│       │   │       │       │   └── RecetasActivasPage.tsx
│       │   │       │       └── recordatorios/
│       │   │       │           └── RecordatoriosTomasPage.tsx
│       │   │       ├── routes/
│       │   │       │   └── PacienteRoutes.tsx
│       │   │       └── PacientePanel.tsx
│       │   ├── services/
│       │   ├── shared/
│       │   │   ├── components/
│       │   │   │   └── UnderConstruction.tsx
│       │   │   ├── constants/
│       │   │   ├── hooks/
│       │   │   ├── lib/
│       │   │   │   └── apiClient.ts
│       │   │   ├── styles/
│       │   │   ├── types/
│       │   │   └── utils/
│       │   ├── App.tsx
│       │   ├── index.css
│       │   └── main.tsx
│       ├── .gitignore
│       ├── eslint.config.js
│       ├── index.html
│       ├── package.json
│       ├── postcss.config.js
│       ├── README.md
│       ├── tailwind.config.js
│       ├── tsconfig.app.json
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       └── vite.config.ts
├── packages/
│   ├── design-system/
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── shared-types/
│       ├── src/
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── .dockerignore
├── .env.example
├── .gitignore
├── create-admin-portal.ps1
├── create-authority-portal.ps1
├── create-brigadista-portal.sh
├── create-medico-portal.sh
├── install_all.sh
├── LICENSE
├── medicos_backup.sql
├── package-lock.json
├── package.json
├── README-INSTALACION.md
├── README-INSTALL.md
├── README.md
├── run.ps1
├── run.sh
├── tsconfig.json
└── turbo.json
```
