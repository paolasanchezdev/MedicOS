

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
│   │   │   ├── data/
│   │   │   │   └── establecimientos.geojson
│   │   │   ├── migrations/
│   │   │   │   ├── 20260714200750_init_medicos_mvp_core/
│   │   │   │   │   └── migration.sql
│   │   │   │   ├── 20260716153349_add_patient_role/
│   │   │   │   │   └── migration.sql
│   │   │   │   ├── 20260814001330_sync_patient_and_schema_changes/
│   │   │   │   │   └── migration.sql
│   │   │   │   ├── 20260818025235_add_work_session_model/
│   │   │   │   │   └── migration.sql
│   │   │   │   ├── 20260819141205_add_establishment_model/
│   │   │   │   │   └── migration.sql
│   │   │   │   ├── 20260819154147_add_establishment_geojson_fields/
│   │   │   │   │   └── migration.sql
│   │   │   │   ├── 20260820204413_add_resources_and_equipment_module/
│   │   │   │   │   └── migration.sql
│   │   │   │   └── migration_lock.toml
│   │   │   ├── schema.prisma
│   │   │   ├── seed-clinics.ts
│   │   │   ├── seed-health-units.ts
│   │   │   ├── seed-hospitals.ts
│   │   │   └── seed.ts
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   └── prisma.ts
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── error.middleware.ts
│   │   │   │   ├── turnstile.middleware.ts
│   │   │   │   └── validate.middleware.ts
│   │   │   ├── modules/
│   │   │   │   ├── admin/
│   │   │   │   │   ├── admin-dashboard.service.ts
│   │   │   │   │   ├── admin.controller.ts
│   │   │   │   │   ├── admin.routes.ts
│   │   │   │   │   └── admin.service.ts
│   │   │   │   ├── auth/
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.routes.ts
│   │   │   │   │   ├── auth.schema.ts
│   │   │   │   │   └── auth.service.ts
│   │   │   │   ├── authority/
│   │   │   │   │   └── authority.types.ts
│   │   │   │   ├── brigadas/
│   │   │   │   │   ├── brigades.controller.ts
│   │   │   │   │   ├── brigades.routes.ts
│   │   │   │   │   ├── brigades.schema.ts
│   │   │   │   │   ├── brigades.service.ts
│   │   │   │   │   └── brigadista-dashboard.service.ts
│   │   │   │   ├── medico/
│   │   │   │   │   ├── medico-dashboard.service.ts
│   │   │   │   │   ├── medico.controller.ts
│   │   │   │   │   ├── medico.routes.ts
│   │   │   │   │   └── medico.service.ts
│   │   │   │   ├── patients/
│   │   │   │   │   ├── patient-dashboard.service.ts
│   │   │   │   │   ├── patients.controller.ts
│   │   │   │   │   ├── patients.routes.ts
│   │   │   │   │   ├── patients.schema.ts
│   │   │   │   │   └── patients.service.ts
│   │   │   │   ├── reports/
│   │   │   │   │   ├── reports.controller.ts
│   │   │   │   │   ├── reports.routes.ts
│   │   │   │   │   ├── reports.schema.ts
│   │   │   │   │   └── reports.service.ts
│   │   │   │   ├── resources/
│   │   │   │   │   ├── services/
│   │   │   │   │   │   ├── devices.service.ts
│   │   │   │   │   │   ├── dotation.service.ts
│   │   │   │   │   │   ├── equipment.service.ts
│   │   │   │   │   │   └── resources.service.ts
│   │   │   │   │   ├── resources.controller.ts
│   │   │   │   │   └── resources.routes.ts
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
│   │   │   │   ├── create-brigadist.ts
│   │   │   │   ├── create-medic.ts
│   │   │   │   └── test-db.ts
│   │   │   ├── services/
│   │   │   │   └── base.service.ts
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   ├── .gitignore
│   │   ├── elsalvador-health.json
│   │   ├── elsalvador-public-raw.json
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
│       │   │   │   └── environment.ts
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
│       │   │   ├── admin/
│       │   │   │   └── types/
│       │   │   │       └── admin-dashboard.types.ts
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
│       │   │   │   │   ├── AssignLeaderModal.tsx
│       │   │   │   │   ├── BrigadeStatusModal.tsx
│       │   │   │   │   ├── CreateBrigadeModal.tsx
│       │   │   │   │   └── DeleteBrigadeModal.tsx
│       │   │   │   ├── constants/
│       │   │   │   ├── context/
│       │   │   │   │   ├── BrigadeContext.tsx
│       │   │   │   │   └── BrigadeProvider.tsx
│       │   │   │   ├── data/
│       │   │   │   │   └── mock-brigade.ts
│       │   │   │   ├── hooks/
│       │   │   │   │   ├── useAdminBrigades.ts
│       │   │   │   │   └── useBrigade.ts
│       │   │   │   ├── schemas/
│       │   │   │   ├── services/
│       │   │   │   │   └── brigades.service.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── brigade.types.ts
│       │   │   │   ├── utils/
│       │   │   │   └── index.ts
│       │   │   ├── establishments/
│       │   │   │   ├── components/
│       │   │   │   │   ├── CreateEstablishmentModal.tsx
│       │   │   │   │   ├── DeleteEstablishmentModal.tsx
│       │   │   │   │   ├── EditEstablishmentModal.tsx
│       │   │   │   │   ├── EstablishmentDetailModal.tsx
│       │   │   │   │   └── UpdateEstablishmentResourceModal.tsx
│       │   │   │   ├── hooks/
│       │   │   │   │   └── useHospitals.ts
│       │   │   │   ├── services/
│       │   │   │   │   └── establishments.service.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── establishment.types.ts
│       │   │   │   └── index.ts
│       │   │   ├── landing/
│       │   │   │   ├── components/
│       │   │   │   │   ├── layout/
│       │   │   │   │   │   ├── Footer.tsx
│       │   │   │   │   │   └── Header.tsx
│       │   │   │   │   ├── sections/
│       │   │   │   │   │   ├── AiSupportSection/
│       │   │   │   │   │   │   ├── components/
│       │   │   │   │   │   │   │   ├── AiCapabilities.tsx
│       │   │   │   │   │   │   │   ├── AiDataFlowPipeline.tsx
│       │   │   │   │   │   │   │   ├── AiHeader.tsx
│       │   │   │   │   │   │   │   ├── AiHumanControl.tsx
│       │   │   │   │   │   │   │   ├── CapabilitySelector.tsx
│       │   │   │   │   │   │   │   └── ClinicalSimulator.tsx
│       │   │   │   │   │   │   ├── data/
│       │   │   │   │   │   │   │   └── aiSectionData.ts
│       │   │   │   │   │   │   ├── AiSupportSection.styles.ts
│       │   │   │   │   │   │   ├── AiSupportSection.tsx
│       │   │   │   │   │   │   └── index.ts
│       │   │   │   │   │   ├── CommunityDedicationSection/
│       │   │   │   │   │   │   ├── CommunityDedicationSection.styles.ts
│       │   │   │   │   │   │   ├── CommunityDedicationSection.tsx
│       │   │   │   │   │   │   └── index.ts
│       │   │   │   │   │   ├── Hero/
│       │   │   │   │   │   │   ├── panels/
│       │   │   │   │   │   │   │   ├── AuthorityPanel.tsx
│       │   │   │   │   │   │   │   ├── BrigadistaPanel.tsx
│       │   │   │   │   │   │   │   ├── DoctorPanel.tsx
│       │   │   │   │   │   │   │   └── PatientPanel.tsx
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
│       │   │   │   │   │   │   │   ├── ImpactGrid.tsx
│       │   │   │   │   │   │   │   └── ImpactHeader.tsx
│       │   │   │   │   │   │   ├── ImpactSection.styles.ts
│       │   │   │   │   │   │   ├── ImpactSection.tsx
│       │   │   │   │   │   │   └── index.ts
│       │   │   │   │   │   ├── MainModules/
│       │   │   │   │   │   │   ├── components/
│       │   │   │   │   │   │   │   ├── FutureScopeNote.tsx
│       │   │   │   │   │   │   │   ├── ModuleContent.tsx
│       │   │   │   │   │   │   │   ├── ModuleSelector.tsx
│       │   │   │   │   │   │   │   └── ModuleShowcase.tsx
│       │   │   │   │   │   │   ├── data/
│       │   │   │   │   │   │   │   └── modulesData.ts
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
│       │   │   ├── resources/
│       │   │   │   ├── components/
│       │   │   │   │   ├── CreateDeviceModal.tsx
│       │   │   │   │   ├── CreateDotationModal.tsx
│       │   │   │   │   ├── CreateEquipmentModal.tsx
│       │   │   │   │   ├── CreateResourceModal.tsx
│       │   │   │   │   ├── CreateStockModal.tsx
│       │   │   │   │   ├── DeleteDeviceModal.tsx
│       │   │   │   │   ├── DeleteEquipmentModal.tsx
│       │   │   │   │   ├── DeleteResourceModal.tsx
│       │   │   │   │   ├── DeviceStatusModal.tsx
│       │   │   │   │   ├── DotationDetailsModal.tsx
│       │   │   │   │   ├── EquipmentMaintenanceModal.tsx
│       │   │   │   │   ├── LiquidateDotationModal.tsx
│       │   │   │   │   └── ResourceLotsModal.tsx
│       │   │   │   ├── hooks/
│       │   │   │   │   ├── useDevices.ts
│       │   │   │   │   ├── useDotacion.ts
│       │   │   │   │   ├── useMedicalEquipment.ts
│       │   │   │   │   └── useResources.ts
│       │   │   │   ├── services/
│       │   │   │   │   ├── devices.service.ts
│       │   │   │   │   ├── dotation.service.ts
│       │   │   │   │   ├── equipment.service.ts
│       │   │   │   │   └── resources.service.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── resource.types.ts
│       │   │   │   └── index.ts
│       │   │   └── users/
│       │   │       ├── components/
│       │   │       │   ├── CreateUserModal.tsx
│       │   │       │   ├── DeleteUserModal.tsx
│       │   │       │   ├── EditCredentialsModal.tsx
│       │   │       │   ├── UserPermissionOverrideModal.tsx
│       │   │       │   ├── UserRoleModal.tsx
│       │   │       │   └── UserStatusModal.tsx
│       │   │       ├── constants/
│       │   │       │   └── user.constants.ts
│       │   │       ├── context/
│       │   │       ├── hooks/
│       │   │       │   └── useUsers.ts
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
│       │   │   │   │   │       ├── components/
│       │   │   │   │   │       │   ├── BrigadasFilters.tsx
│       │   │   │   │   │       │   ├── BrigadasHeader.tsx
│       │   │   │   │   │       │   ├── BrigadasMetrics.tsx
│       │   │   │   │   │       │   └── BrigadasTable.tsx
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
│       │   │   │   │   │   │   ├── components/
│       │   │   │   │   │   │   │   ├── ActividadItem.tsx
│       │   │   │   │   │   │   │   ├── DetalleActividad.tsx
│       │   │   │   │   │   │   │   ├── EncabezadoActividad.tsx
│       │   │   │   │   │   │   │   ├── EstadoActividad.tsx
│       │   │   │   │   │   │   │   ├── FiltrosActividad.tsx
│       │   │   │   │   │   │   │   ├── PaginacionActividad.tsx
│       │   │   │   │   │   │   │   └── ResumenActividad.tsx
│       │   │   │   │   │   │   └── ActividadSistemaPage.tsx
│       │   │   │   │   │   └── resumen/
│       │   │   │   │   │       ├── components/
│       │   │   │   │   │       │   ├── AccionesRapidas.tsx
│       │   │   │   │   │       │   ├── ActividadReciente.tsx
│       │   │   │   │   │       │   ├── TarjetaActividadSistema.tsx
│       │   │   │   │   │       │   ├── TarjetaBienvenidaAdmin.tsx
│       │   │   │   │   │       │   ├── TarjetaBrigadas.tsx
│       │   │   │   │   │       │   ├── TarjetaEstadoSistema.tsx
│       │   │   │   │   │       │   ├── TarjetaPacientes.tsx
│       │   │   │   │   │       │   ├── TarjetaSincronizacion.tsx
│       │   │   │   │   │       │   └── TarjetaUsuarios.tsx
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
│       │   │   │   │   │   │   ├── components/
│       │   │   │   │   │   │   │   ├── ClinicFilters.tsx
│       │   │   │   │   │   │   │   ├── ClinicMap.tsx
│       │   │   │   │   │   │   │   ├── ClinicMetrics.tsx
│       │   │   │   │   │   │   │   └── ClinicTable.tsx
│       │   │   │   │   │   │   └── ClinicasPage.tsx
│       │   │   │   │   │   ├── hospitales/
│       │   │   │   │   │   │   ├── components/
│       │   │   │   │   │   │   │   ├── CreateHospitalModal.tsx
│       │   │   │   │   │   │   │   ├── HospitalFilters.tsx
│       │   │   │   │   │   │   │   ├── HospitalMap.tsx
│       │   │   │   │   │   │   │   ├── HospitalMetrics.tsx
│       │   │   │   │   │   │   │   └── HospitalTable.tsx
│       │   │   │   │   │   │   └── HospitalesPage.tsx
│       │   │   │   │   │   ├── recursos/
│       │   │   │   │   │   │   ├── components/
│       │   │   │   │   │   │   │   ├── RecursosFilters.tsx
│       │   │   │   │   │   │   │   ├── RecursosMetrics.tsx
│       │   │   │   │   │   │   │   └── RecursosTable.tsx
│       │   │   │   │   │   │   └── RecursosEstablecimientosPage.tsx
│       │   │   │   │   │   └── unidades-salud/
│       │   │   │   │   │       ├── components/
│       │   │   │   │   │       │   ├── HealthUnitFilters.tsx
│       │   │   │   │   │       │   ├── HealthUnitMap.tsx
│       │   │   │   │   │       │   ├── HealthUnitMetrics.tsx
│       │   │   │   │   │       │   └── HealthUnitTable.tsx
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
│       │   │   │   │   ├── recursos/
│       │   │   │   │   │   ├── dotacion/
│       │   │   │   │   │   │   ├── components/
│       │   │   │   │   │   │   │   ├── DotacionFilters.tsx
│       │   │   │   │   │   │   │   ├── DotacionHeader.tsx
│       │   │   │   │   │   │   │   ├── DotacionMetrics.tsx
│       │   │   │   │   │   │   │   └── DotacionTable.tsx
│       │   │   │   │   │   │   └── DotacionBrigadasPage.tsx
│       │   │   │   │   │   ├── equipos/
│       │   │   │   │   │   │   ├── components/
│       │   │   │   │   │   │   │   ├── EquiposFilters.tsx
│       │   │   │   │   │   │   │   ├── EquiposHeader.tsx
│       │   │   │   │   │   │   │   ├── EquiposMetrics.tsx
│       │   │   │   │   │   │   │   └── EquiposTable.tsx
│       │   │   │   │   │   │   └── EquiposMedicosPage.tsx
│       │   │   │   │   │   ├── medicamentos/
│       │   │   │   │   │   │   ├── components/
│       │   │   │   │   │   │   │   ├── MedicamentosFilters.tsx
│       │   │   │   │   │   │   │   ├── MedicamentosHeader.tsx
│       │   │   │   │   │   │   │   ├── MedicamentosMetrics.tsx
│       │   │   │   │   │   │   │   └── MedicamentosTable.tsx
│       │   │   │   │   │   │   └── MedicamentosPage.tsx
│       │   │   │   │   │   └── tecnologia/
│       │   │   │   │   │       ├── components/
│       │   │   │   │   │       │   ├── DispositivosFilters.tsx
│       │   │   │   │   │       │   ├── DispositivosHeader.tsx
│       │   │   │   │   │       │   ├── DispositivosMetrics.tsx
│       │   │   │   │   │       │   └── DispositivosTable.tsx
│       │   │   │   │   │       └── DispositivosTecnologicosPage.tsx
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
│       │   │   │   │       │   ├── components/
│       │   │   │   │       │   │   ├── UserStatusBadge.tsx
│       │   │   │   │       │   │   ├── UserStatusFilters.tsx
│       │   │   │   │       │   │   ├── UserStatusMetrics.tsx
│       │   │   │   │       │   │   └── UserStatusTable.tsx
│       │   │   │   │       │   └── EstadoUsuariosPage.tsx
│       │   │   │   │       ├── permisos/
│       │   │   │   │       │   ├── components/
│       │   │   │   │       │   │   └── PermisosCard.tsx
│       │   │   │   │       │   └── PermisosPage.tsx
│       │   │   │   │       ├── roles/
│       │   │   │   │       │   ├── components/
│       │   │   │   │       │   │   ├── ConfirmRoleModal.tsx
│       │   │   │   │       │   │   ├── RoleAssignmentTable.tsx
│       │   │   │   │       │   │   ├── RoleMatrixTable.tsx
│       │   │   │   │       │   │   └── RoleStatsCards.tsx
│       │   │   │   │       │   └── RolesPage.tsx
│       │   │   │   │       └── todos/
│       │   │   │   │           ├── components/
│       │   │   │   │           │   ├── UserFilterBar.tsx
│       │   │   │   │           │   ├── UserHeaderSection.tsx
│       │   │   │   │           │   └── UserTable.tsx
│       │   │   │   │           └── UsuariosPage.tsx
│       │   │   │   ├── routes/
│       │   │   │   │   └── AdminRoutes.tsx
│       │   │   │   └── AdminPanel.tsx
│       │   │   ├── authority/
│       │   │   │   ├── layout/
│       │   │   │   │   ├── AuthorityHeader.tsx
│       │   │   │   │   ├── AuthorityLayout.tsx
│       │   │   │   │   ├── AuthoritySidebar.tsx
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
│       │   │   │   ├── types/
│       │   │   │   │   └── authority.types.ts
│       │   │   │   └── AuthorityPanel.tsx
│       │   │   ├── brigadista/
│       │   │   │   ├── layout/
│       │   │   │   │   ├── BrigadistaHeader.tsx
│       │   │   │   │   ├── BrigadistaLayout.tsx
│       │   │   │   │   ├── BrigadistaSidebar.tsx
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
│       │   │   │   │   │       ├── components/
│       │   │   │   │   │       │   ├── AccionesRapidas.tsx
│       │   │   │   │   │       │   ├── AlertasClinicasCard.tsx
│       │   │   │   │   │       │   ├── ConsultasHoyCard.tsx
│       │   │   │   │   │       │   ├── EstadoJornadaCard.tsx
│       │   │   │   │   │       │   ├── PacientesAtendidosCard.tsx
│       │   │   │   │   │       │   ├── PacientesPendientesCard.tsx
│       │   │   │   │   │       │   ├── ProximaAccionCard.tsx
│       │   │   │   │   │       │   ├── ResumenJornadaCard.tsx
│       │   │   │   │   │       │   ├── SincronizacionCard.tsx
│       │   │   │   │   │       │   ├── TarjetaBienvenidaBrigadista.tsx
│       │   │   │   │   │       │   └── UltimoPacienteCard.tsx
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
│       │   │   │   │   ├── MedicoHeader.tsx
│       │   │   │   │   ├── MedicoLayout.tsx
│       │   │   │   │   └── MedicoSidebar.tsx
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
│       │   │   │   │   │   │   ├── components/
│       │   │   │   │   │   │   │   ├── ActividadItem.tsx
│       │   │   │   │   │   │   │   ├── DetalleActividad.tsx
│       │   │   │   │   │   │   │   ├── EncabezadoActividad.tsx
│       │   │   │   │   │   │   │   ├── EstadoActividad.tsx
│       │   │   │   │   │   │   │   ├── FiltrosActividad.tsx
│       │   │   │   │   │   │   │   ├── PaginacionActividad.tsx
│       │   │   │   │   │   │   │   └── ResumenActividad.tsx
│       │   │   │   │   │   │   └── ActividadMedicoPage.tsx
│       │   │   │   │   │   └── resumen/
│       │   │   │   │   │       ├── components/
│       │   │   │   │   │       │   ├── AccionesRapidas.tsx
│       │   │   │   │   │       │   ├── AgendaProximaCard.tsx
│       │   │   │   │   │       │   ├── AlertasClinicasCard.tsx
│       │   │   │   │   │       │   ├── ConsultasRecientesCard.tsx
│       │   │   │   │   │       │   ├── PacientesPendientesCard.tsx
│       │   │   │   │   │       │   ├── ResumenConsultasCard.tsx
│       │   │   │   │   │       │   ├── SeguimientosPendientesCard.tsx
│       │   │   │   │   │       │   └── TarjetaBienvenidaMedico.tsx
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
│       │   │       ├── components/
│       │   │       │   ├── PacienteHeader.tsx
│       │   │       │   └── PacienteSidebar.tsx
│       │   │       ├── layout/
│       │   │       │   ├── index.ts
│       │   │       │   └── PacienteLayout.tsx
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
│       │   │       │   │   │   ├── components/
│       │   │       │   │   │   │   ├── ActividadItem.tsx
│       │   │       │   │   │   │   ├── ActividadReciente.tsx
│       │   │       │   │   │   │   ├── DetalleActividad.tsx
│       │   │       │   │   │   │   ├── EncabezadoActividad.tsx
│       │   │       │   │   │   │   ├── EstadoActividad.tsx
│       │   │       │   │   │   │   └── FiltrosActividad.tsx
│       │   │       │   │   │   └── ActividadPacientePage.tsx
│       │   │       │   │   ├── resumen/
│       │   │       │   │   │   ├── components/
│       │   │       │   │   │   │   ├── AccionesRapidas.tsx
│       │   │       │   │   │   │   ├── LineaTiempoSalud.tsx
│       │   │       │   │   │   │   ├── TarjetaAccionesPendientes.tsx
│       │   │       │   │   │   │   ├── TarjetaBienvenidaPaciente.tsx
│       │   │       │   │   │   │   ├── TarjetaEstadoSalud.tsx
│       │   │       │   │   │   │   ├── TarjetaProximaCita.tsx
│       │   │       │   │   │   │   ├── TarjetaResumenExpediente.tsx
│       │   │       │   │   │   │   └── TarjetaTratamientosActivos.tsx
│       │   │       │   │   │   └── ResumenPacientePage.tsx
│       │   │       │   │   └── DashboardLayout.tsx
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
│       │   │   │   ├── header/
│       │   │   │   │   ├── BuscadorHeader.tsx
│       │   │   │   │   ├── HeaderGlobal.tsx
│       │   │   │   │   ├── NotificacionesMenu.tsx
│       │   │   │   │   └── PerfilUsuarioHeader.tsx
│       │   │   │   ├── sidebar/
│       │   │   │   │   └── SidebarGlobal.tsx
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
│       ├── vercel.json
│       └── vite.config.ts
├── packages/
│   ├── design-system/
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── shared-types/
│       ├── src/
│       │   ├── authority/
│       │   │   └── authority.types.ts
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
├── dump.sql
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
├── turbo.json
└── vercel.json
```
