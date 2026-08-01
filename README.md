

## Project Structure

```text
MedicOS/
├── .readme-generator/
│   ├── history/
│   │   └── 1785534733625-a420fdad.md
│   └── .gitignore
├── .turbo/
│   └── cache/
│       ├── 102914d5773447f3-manifest.json
│       ├── 102914d5773447f3-meta.json
│       ├── 102914d5773447f3.tar.zst
│       ├── 845f713455ba3d8b-manifest.json
│       ├── 845f713455ba3d8b-meta.json
│       ├── 845f713455ba3d8b.tar.zst
│       ├── baa6eacda26a3470-manifest.json
│       ├── baa6eacda26a3470-meta.json
│       └── baa6eacda26a3470.tar.zst
├── apps/
│   ├── api/
│   │   ├── .turbo/
│   │   │   └── turbo-build.log
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
│   │   │   ├── database/
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── error.middleware.ts
│   │   │   │   ├── turnstile.middleware.ts
│   │   │   │   └── validate.middleware.ts
│   │   │   ├── modules/
│   │   │   │   └── auth/
│   │   │   │       ├── auth.controller.ts
│   │   │   │       ├── auth.routes.ts
│   │   │   │       ├── auth.schema.ts
│   │   │   │       └── auth.service.ts
│   │   │   ├── routes/
│   │   │   │   ├── health.routes.ts
│   │   │   │   └── index.ts
│   │   │   ├── services/
│   │   │   │   └── base.service.ts
│   │   │   ├── app.ts
│   │   │   ├── create-admin.ts
│   │   │   ├── server.ts
│   │   │   └── test-db.ts
│   │   ├── .gitignore
│   │   ├── package.json
│   │   ├── prisma.config.ts
│   │   └── tsconfig.json
│   ├── station/
│   └── web/
│       ├── .turbo/
│       │   ├── turbo-build.log
│       │   └── turbo-lint.log
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
│       │   │   ├── providers/
│       │   │   ├── router/
│       │   │   │   ├── protectedRoutes.tsx
│       │   │   │   └── routes.tsx
│       │   │   └── store/
│       │   │       └── index.ts
│       │   ├── core/
│       │   │   ├── auth/
│       │   │   │   ├── components/
│       │   │   │   │   ├── LoginBanner.tsx
│       │   │   │   │   ├── LoginForm.tsx
│       │   │   │   │   ├── RegisterBanner.tsx
│       │   │   │   │   └── RegisterForm.tsx
│       │   │   │   ├── hooks/
│       │   │   │   │   └── useLoginForm.ts
│       │   │   │   ├── auth.service.ts
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
│       │   ├── data/
│       │   ├── layouts/
│       │   │   ├── AuthLayout/
│       │   │   │   └── AuthLayout.tsx
│       │   │   ├── DashboardLayout/
│       │   │   │   ├── components/
│       │   │   │   │   └── Header.tsx
│       │   │   │   └── DashboardLayout.tsx
│       │   │   └── PublicLayout/
│       │   │       └── PublicLayout.tsx
│       │   ├── modules/
│       │   │   ├── ai/
│       │   │   ├── auth/
│       │   │   │   └── pages/
│       │   │   │       ├── Login.tsx
│       │   │   │       └── Register.tsx
│       │   │   ├── brigades/
│       │   │   │   ├── context/
│       │   │   │   │   ├── BrigadeContext.tsx
│       │   │   │   │   └── BrigadeProvider.tsx
│       │   │   │   ├── data/
│       │   │   │   │   └── mock-brigade.ts
│       │   │   │   ├── hooks/
│       │   │   │   │   └── useBrigade.ts
│       │   │   │   └── types/
│       │   │   │       └── brigade.types.ts
│       │   │   ├── clinical-records/
│       │   │   ├── consultations/
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
│       │   │   ├── reports/
│       │   │   ├── statistics/
│       │   │   └── users/
│       │   ├── offline/
│       │   │   ├── cache/
│       │   │   ├── conflict-resolution/
│       │   │   ├── indexeddb/
│       │   │   ├── service-worker/
│       │   │   └── sync/
│       │   ├── portals/
│       │   │   ├── admin/
│       │   │   │   ├── components/
│       │   │   │   │   ├── MetricsCard.tsx
│       │   │   │   │   ├── SystemHealthStatus.tsx
│       │   │   │   │   └── UserRoleModal.tsx
│       │   │   │   ├── layout/
│       │   │   │   │   ├── AdminHeader.tsx
│       │   │   │   │   ├── AdminLayout.tsx
│       │   │   │   │   ├── AdminSidebar.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   ├── navigation/
│       │   │   │   │   └── admin.navigation.ts
│       │   │   │   ├── pages/
│       │   │   │   │   ├── configuracion/
│       │   │   │   │   │   ├── gestion-documental/
│       │   │   │   │   │   ├── integraciones/
│       │   │   │   │   │   ├── notificaciones-sistema/
│       │   │   │   │   │   └── parametros-generales/
│       │   │   │   │   ├── dashboard/
│       │   │   │   │   │   ├── resumen/
│       │   │   │   │   │   │   ├── components/
│       │   │   │   │   │   │   ├── hooks/
│       │   │   │   │   │   │   ├── ResumenPage.tsx
│       │   │   │   │   │   │   └── services.ts
│       │   │   │   │   │   └── salud-sistema/
│       │   │   │   │   │       ├── components/
│       │   │   │   │   │       ├── hooks/
│       │   │   │   │   │       ├── SaludSistemaPage.tsx
│       │   │   │   │   │       └── services.ts
│       │   │   │   │   ├── gestion-principal/
│       │   │   │   │   │   ├── brigadas-medicas/
│       │   │   │   │   │   ├── catalogos-sistema/
│       │   │   │   │   │   ├── dispositivos-nodos/
│       │   │   │   │   │   ├── inventario-suministros/
│       │   │   │   │   │   └── usuarios-roles/
│       │   │   │   │   │       ├── components/
│       │   │   │   │   │       ├── hooks/
│       │   │   │   │   │       ├── constants.ts
│       │   │   │   │   │       ├── schemas.ts
│       │   │   │   │   │       ├── services.ts
│       │   │   │   │   │       ├── types.ts
│       │   │   │   │   │       └── UsuariosRolesPage.tsx
│       │   │   │   │   ├── operaciones/
│       │   │   │   │   │   ├── auditoria/
│       │   │   │   │   │   ├── seguridad/
│       │   │   │   │   │   └── sincronizacion/
│       │   │   │   │   └── reportes/
│       │   │   │   │       ├── exportaciones-programadas/
│       │   │   │   │       ├── reportes-operativos/
│       │   │   │   │       └── uso-sistema/
│       │   │   │   ├── routes/
│       │   │   │   │   └── AdminRoutes.tsx
│       │   │   │   ├── AdminPanel.tsx
│       │   │   │   └── index.ts
│       │   │   ├── authority/
│       │   │   ├── brigadist/
│       │   │   │   ├── layout/
│       │   │   │   │   ├── BrigadistBottomNav.tsx
│       │   │   │   │   ├── BrigadistHeader.tsx
│       │   │   │   │   ├── BrigadistLayout.tsx
│       │   │   │   │   ├── BrigadistSidebar.tsx
│       │   │   │   │   ├── index.ts
│       │   │   │   │   └── SystemStatusBadge.tsx
│       │   │   │   ├── pages/
│       │   │   │   │   ├── brigade/
│       │   │   │   │   │   └── BrigadePage.tsx
│       │   │   │   │   ├── consultations/
│       │   │   │   │   │   └── ConsultationsPage.tsx
│       │   │   │   │   ├── dashboard/
│       │   │   │   │   │   ├── components/
│       │   │   │   │   │   │   ├── ActiveBrigadeInfo.tsx
│       │   │   │   │   │   │   ├── AttendanceOverview.tsx
│       │   │   │   │   │   │   ├── QuickActions.tsx
│       │   │   │   │   │   │   ├── RecentPatientsTable.tsx
│       │   │   │   │   │   │   └── ShiftSummaryCards.tsx
│       │   │   │   │   │   └── BrigadistDashboardPage.tsx
│       │   │   │   │   ├── patients/
│       │   │   │   │   │   └── PatientsPage.tsx
│       │   │   │   │   ├── profile/
│       │   │   │   │   │   └── ProfilePage.tsx
│       │   │   │   │   ├── records/
│       │   │   │   │   │   └── RecordsPage.tsx
│       │   │   │   │   └── scan/
│       │   │   │   │       └── ScanQrPage.tsx
│       │   │   │   ├── BrigadistPanel.tsx
│       │   │   │   └── index.ts
│       │   │   ├── doctor/
│       │   │   │   ├── DoctorPanel.tsx
│       │   │   │   └── index.ts
│       │   │   └── patient/
│       │   │       ├── components/
│       │   │       │   ├── AppointmentCard.tsx
│       │   │       │   ├── FamilyMemberCard.tsx
│       │   │       │   ├── HealthMetricCard.tsx
│       │   │       │   ├── MedicationReminderCard.tsx
│       │   │       │   ├── NotificationCard.tsx
│       │   │       │   ├── PatientQrBadge.tsx
│       │   │       │   └── QuickActionCard.tsx
│       │   │       ├── layout/
│       │   │       │   ├── index.ts
│       │   │       │   ├── PatientBottomNav.tsx
│       │   │       │   ├── PatientHeader.tsx
│       │   │       │   ├── PatientLayout.tsx
│       │   │       │   └── PatientSidebar.tsx
│       │   │       ├── navigation/
│       │   │       │   └── patient.navigation.ts
│       │   │       ├── pages/
│       │   │       │   ├── asistente-ia/
│       │   │       │   │   ├── chat/
│       │   │       │   │   ├── educacion/
│       │   │       │   │   ├── evaluacion-rapida/
│       │   │       │   │   ├── recomendaciones/
│       │   │       │   │   └── sintomas/
│       │   │       │   ├── consultas/
│       │   │       │   │   ├── diagnosticos/
│       │   │       │   │   ├── historial/
│       │   │       │   │   ├── ordenes-medicas/
│       │   │       │   │   ├── proximas/
│       │   │       │   │   ├── recetas/
│       │   │       │   │   └── seguimientos/
│       │   │       │   ├── dashboard/
│       │   │       │   │   └── resumen/
│       │   │       │   │       ├── components/
│       │   │       │   │       ├── hooks/
│       │   │       │   │       ├── PatientDashboardPage.tsx
│       │   │       │   │       └── services.ts
│       │   │       │   ├── familia/
│       │   │       │   │   ├── autorizaciones/
│       │   │       │   │   ├── miembros/
│       │   │       │   │   ├── pacientes-a-cargo/
│       │   │       │   │   └── solicitudes/
│       │   │       │   ├── notificaciones/
│       │   │       │   │   └── bandeja/
│       │   │       │   ├── perfil/
│       │   │       │   │   ├── contactos/
│       │   │       │   │   ├── datos-personales/
│       │   │       │   │   ├── dispositivos/
│       │   │       │   │   ├── emergencias/
│       │   │       │   │   ├── preferencias/
│       │   │       │   │   ├── privacidad/
│       │   │       │   │   ├── seguridad/
│       │   │       │   │   └── seguro-medico/
│       │   │       │   ├── qr/
│       │   │       │   │   └── credencial/
│       │   │       │   └── salud/
│       │   │       │       ├── alergias/
│       │   │       │       ├── documentos/
│       │   │       │       ├── embarazo/
│       │   │       │       ├── enfermedades-cronicas/
│       │   │       │       ├── medicamentos/
│       │   │       │       ├── resumen/
│       │   │       │       ├── signos-vitales/
│       │   │       │       └── vacunas/
│       │   │       ├── routes/
│       │   │       │   └── PatientRoutes.tsx
│       │   │       ├── index.ts
│       │   │       └── PatientPanel.tsx
│       │   ├── services/
│       │   │   ├── ai/
│       │   │   ├── api/
│       │   │   │   └── apiClient.ts
│       │   │   ├── qr/
│       │   │   └── websocket/
│       │   ├── shared/
│       │   │   ├── components/
│       │   │   │   ├── Button.tsx
│       │   │   │   ├── FloatingIcon.tsx
│       │   │   │   └── Input.tsx
│       │   │   ├── hooks/
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
├── docs/
│   ├── adr/
│   ├── api/
│   ├── architecture/
│   ├── database/
│   ├── diagrams/
│   ├── manuals/
│   └── security/
├── infrastructure/
│   ├── backups/
│   ├── docker/
│   ├── hosting/
│   ├── nginx/
│   ├── raspberry/
│   └── scripts/
├── packages/
│   ├── design-system/
│   ├── shared-types/
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── utils/
│   └── validation/
├── services/
│   └── ai-service/
├── tests/
│   ├── api/
│   ├── e2e/
│   ├── integration/
│   └── unit/
├── .dockerignore
├── .env.example
├── .gitignore
├── docker-compose.yml
├── LICENSE
├── package-lock.json
├── package.json
├── README-INSTALACION.md
├── README.md
├── run.ps1
├── run.sh
├── tsconfig.json
├── tsconfig.tsbuildinfo
└── turbo.json
```
