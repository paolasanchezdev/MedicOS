

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
│       ├── baa6eacda26a3470.tar.zst
│       ├── cdf4b227a59f8c6c-manifest.json
│       ├── cdf4b227a59f8c6c-meta.json
│       └── cdf4b227a59f8c6c.tar.zst
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
│       │   │   │   │   └── index.ts
│       │   │   │   ├── navigation/
│       │   │   │   │   └── admin.navigation.ts
│       │   │   │   ├── pages/
│       │   │   │   │   ├── dashboard/
│       │   │   │   │   │   ├── resumen/
│       │   │   │   │   │   │   └── ResumenPage.tsx
│       │   │   │   │   │   └── salud-sistema/
│       │   │   │   │   │       └── SaludSistemaPage.tsx
│       │   │   │   │   └── gestion-principal/
│       │   │   │   │       └── usuarios-roles/
│       │   │   │   │           └── UsuariosRolesPage.tsx
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
│       │   │   │   │   ├── dashboard/
│       │   │   │   │   │   ├── resumen/
│       │   │   │   │   │   │   └── ResumenAutoridadPage.tsx
│       │   │   │   │   │   └── salud-sistema/
│       │   │   │   │   │       └── SaludSistemaPage.tsx
│       │   │   │   │   └── estadisticas/
│       │   │   │   │       ├── enfermedades/
│       │   │   │   │       │   └── EstadisticasEnfermedadesPage.tsx
│       │   │   │   │       └── pacientes/
│       │   │   │   │           └── EstadisticasPacientesPage.tsx
│       │   │   │   ├── routes/
│       │   │   │   │   └── AuthorityRoutes.tsx
│       │   │   │   └── AuthorityPanel.tsx
│       │   │   ├── brigadista/
│       │   │   │   ├── layout/
│       │   │   │   ├── navigation/
│       │   │   │   ├── pages/
│       │   │   │   ├── routes/
│       │   │   │   └── BrigadistaPanel.tsx
│       │   │   ├── doctor/
│       │   │   │   ├── layout/
│       │   │   │   ├── navigation/
│       │   │   │   ├── pages/
│       │   │   │   ├── routes/
│       │   │   │   └── DoctorPanel.tsx
│       │   │   └── patient/
│       │   │       ├── layout/
│       │   │       │   ├── index.ts
│       │   │       │   ├── PatientBottomNav.tsx
│       │   │       │   ├── PatientHeader.tsx
│       │   │       │   ├── PatientLayout.tsx
│       │   │       │   └── PatientSidebar.tsx
│       │   │       ├── navigation/
│       │   │       │   └── patient.navigation.ts
│       │   │       ├── pages/
│       │   │       │   └── dashboard/
│       │   │       │       └── resumen/
│       │   │       │           └── PatientDashboardPage.tsx
│       │   │       ├── routes/
│       │   │       │   └── PatientRoutes.tsx
│       │   │       └── PatientPanel.tsx
│       │   ├── services/
│       │   ├── shared/
│       │   │   ├── components/
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
