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
│   │   │   │   ├── ai-assistant/
│   │   │   │   │   ├── ai-assistant.controller.ts
│   │   │   │   │   ├── ai-assistant.routes.ts
│   │   │   │   │   ├── ai-assistant.service.ts
│   │   │   │   │   ├── ai-assistant.types.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── appointments/
│   │   │   │   │   ├── appointments.controller.ts
│   │   │   │   │   ├── appointments.routes.ts
│   │   │   │   │   └── appointments.service.ts
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
│   │   │   │   ├── clinical-history/
│   │   │   │   │   ├── clinical-history.controller.ts
│   │   │   │   │   ├── clinical-history.routes.ts
│   │   │   │   │   ├── clinical-history.service.ts
│   │   │   │   │   └── clinical-history.types.ts
│   │   │   │   ├── clinical-knowledge/
│   │   │   │   │   ├── clinical-graph.builder.ts
│   │   │   │   │   ├── clinical-knowledge.controller.ts
│   │   │   │   │   ├── clinical-knowledge.routes.ts
│   │   │   │   │   ├── clinical-knowledge.service.ts
│   │   │   │   │   ├── clinical-knowledge.types.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── clinical-messages/
│   │   │   │   │   └── clinical-messages.service.ts
│   │   │   │   ├── consultations/
│   │   │   │   │   ├── consultations.controller.ts
│   │   │   │   │   ├── consultations.routes.ts
│   │   │   │   │   ├── consultations.schema.ts
│   │   │   │   │   └── consultations.service.ts
│   │   │   │   ├── diagnoses/
│   │   │   │   │   ├── diagnoses.controller.ts
│   │   │   │   │   ├── diagnoses.routes.ts
│   │   │   │   │   ├── diagnoses.schema.ts
│   │   │   │   │   └── diagnoses.service.ts
│   │   │   │   ├── documents/
│   │   │   │   │   ├── documents.controller.ts
│   │   │   │   │   ├── documents.routes.ts
│   │   │   │   │   └── documents.service.ts
│   │   │   │   ├── laboratory/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── laboratory.controller.ts
│   │   │   │   │   ├── laboratory.routes.ts
│   │   │   │   │   ├── laboratory.service.ts
│   │   │   │   │   └── laboratory.types.ts
│   │   │   │   ├── lifestyle/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── lifestyle.controller.ts
│   │   │   │   │   ├── lifestyle.routes.ts
│   │   │   │   │   ├── lifestyle.service.ts
│   │   │   │   │   └── lifestyle.types.ts
│   │   │   │   ├── maternal-health/
│   │   │   │   │   ├── maternal-health.controller.ts
│   │   │   │   │   ├── maternal-health.routes.ts
│   │   │   │   │   ├── maternal-health.service.ts
│   │   │   │   │   └── maternal-health.types.ts
│   │   │   │   ├── medical-imaging/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── medical-imaging.controller.ts
│   │   │   │   │   ├── medical-imaging.routes.ts
│   │   │   │   │   ├── medical-imaging.service.ts
│   │   │   │   │   └── medical-imaging.types.ts
│   │   │   │   ├── medications/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── medications.controller.ts
│   │   │   │   │   ├── medications.routes.ts
│   │   │   │   │   ├── medications.service.ts
│   │   │   │   │   └── medications.types.ts
│   │   │   │   ├── medico/
│   │   │   │   │   ├── medico-dashboard.service.ts
│   │   │   │   │   ├── medico.controller.ts
│   │   │   │   │   ├── medico.routes.ts
│   │   │   │   │   └── medico.service.ts
│   │   │   │   ├── patients/
│   │   │   │   │   ├── patient-dashboard.service.ts
│   │   │   │   │   ├── patient-notifications.service.ts
│   │   │   │   │   ├── patients.controller.ts
│   │   │   │   │   ├── patients.routes.ts
│   │   │   │   │   ├── patients.schema.ts
│   │   │   │   │   └── patients.service.ts
│   │   │   │   ├── personalized-advice/
│   │   │   │   │   ├── personalized-advice.controller.ts
│   │   │   │   │   ├── personalized-advice.routes.ts
│   │   │   │   │   ├── personalized-advice.service.ts
│   │   │   │   │   └── personalized-advice.types.ts
│   │   │   │   ├── prescriptions/
│   │   │   │   │   ├── prescriptions.controller.ts
│   │   │   │   │   ├── prescriptions.routes.ts
│   │   │   │   │   ├── prescriptions.service.ts
│   │   │   │   │   └── prescriptions.types.ts
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
│   │   │   │   ├── users/
│   │   │   │   │   ├── users.controller.ts
│   │   │   │   │   ├── users.routes.ts
│   │   │   │   │   ├── users.schema.ts
│   │   │   │   │   └── users.service.ts
│   │   │   │   ├── vaccinations/
│   │   │   │   │   ├── vaccinations.controller.ts
│   │   │   │   │   ├── vaccinations.routes.ts
│   │   │   │   │   ├── vaccinations.schema.ts
│   │   │   │   │   ├── vaccinations.service.ts
│   │   │   │   │   └── vaccinations.types.ts
│   │   │   │   └── vital-signs/
│   │   │   │       ├── index.ts
│   │   │   │       ├── vital-signs.controller.ts
│   │   │   │       ├── vital-signs.routes.ts
│   │   │   │       ├── vital-signs.service.ts
│   │   │   │       └── vital-signs.types.ts
│   │   │   ├── routes/
│   │   │   │   ├── health.routes.ts
│   │   │   │   └── index.ts
│   │   │   ├── scripts/
│   │   │   │   ├── create-admin.ts
│   │   │   │   ├── create-authority-user.ts
│   │   │   │   ├── create-brigadist.ts
│   │   │   │   ├── create-medic.ts
│   │   │   │   ├── seed-pregnancy-control.ts
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
│       │   │   ├── articulos/
│       │   │   │   ├── art-prev-1.jpg
│       │   │   │   └── art-prev-2.jpeg
│       │   │   ├── flow/
│       │   │   │   ├── step-01.png
│       │   │   │   └── step-02.png
│       │   │   ├── how-it-works/
│       │   │   │   ├── step1-brigada.png
│       │   │   │   └── step2-qr.png
│       │   │   └── esquema-vacunacion-minsal-2026.png
│       │   ├── —Pngtree—3d teal cross with red_22560716.png
│       │   ├── bg-medicos.png
│       │   ├── desafio1.png
│       │   ├── desafio2.png
│       │   ├── desafio3.png
│       │   ├── favicon.svg
│       │   ├── icons.svg
│       │   ├── Logo MedicOS Cruz.png
│       │   ├── Logo MedicOS.png
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
│       │   │   ├── ai-assistant/
│       │   │   │   ├── hooks/
│       │   │   │   │   └── useAIAssistant.ts
│       │   │   │   ├── services/
│       │   │   │   │   └── ai-assistant.service.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── ai-assistant.types.ts
│       │   │   │   └── index.ts
│       │   │   ├── appointments/
│       │   │   │   ├── components/
│       │   │   │   │   ├── CancelarCitaModal.tsx
│       │   │   │   │   ├── CitaEstadoBadge.tsx
│       │   │   │   │   ├── DetalleCitaModal.tsx
│       │   │   │   │   ├── index.ts
│       │   │   │   │   └── ReprogramarCitaModal.tsx
│       │   │   │   ├── hooks/
│       │   │   │   │   └── useAppointments.ts
│       │   │   │   ├── rules/
│       │   │   │   │   └── appointmentOrientation.rules.ts
│       │   │   │   ├── services/
│       │   │   │   │   └── appointments.service.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── appointment.types.ts
│       │   │   │   └── index.ts
│       │   │   ├── atencion/
│       │   │   │   ├── components/
│       │   │   │   │   ├── DetalleAtencionModal.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   ├── hooks/
│       │   │   │   │   ├── useAttentionHistory.ts
│       │   │   │   │   ├── useCreateAttention.ts
│       │   │   │   │   └── usePendingAttentions.ts
│       │   │   │   ├── services/
│       │   │   │   │   └── atencion.service.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── atencion.types.ts
│       │   │   │   └── index.ts
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
│       │   │   │   │   ├── useBrigade.ts
│       │   │   │   │   ├── useBrigadistaActividad.ts
│       │   │   │   │   ├── useBrigadistaDashboard.ts
│       │   │   │   │   ├── useJornadaBrigada.ts
│       │   │   │   │   ├── usePacientesBrigada.ts
│       │   │   │   │   └── useResumenBrigada.ts
│       │   │   │   ├── schemas/
│       │   │   │   ├── services/
│       │   │   │   │   ├── brigades.service.ts
│       │   │   │   │   └── brigadista-dashboard.service.ts
│       │   │   │   ├── types/
│       │   │   │   │   ├── brigade.types.ts
│       │   │   │   │   └── brigadista-dashboard.types.ts
│       │   │   │   ├── utils/
│       │   │   │   └── index.ts
│       │   │   ├── clinical-history/
│       │   │   │   ├── components/
│       │   │   │   │   ├── AlergiaTipoBadge.tsx
│       │   │   │   │   ├── AntecedenteTipoBadge.tsx
│       │   │   │   │   ├── DetalleAlergiaModal.tsx
│       │   │   │   │   ├── DetalleAntecedenteModal.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   ├── hooks/
│       │   │   │   │   └── usePatientClinicalHistory.ts
│       │   │   │   ├── services/
│       │   │   │   │   └── clinical-history.service.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── clinical-history.types.ts
│       │   │   │   └── index.ts
│       │   │   ├── clinical-knowledge/
│       │   │   │   ├── components/
│       │   │   │   │   ├── ClinicalGraphEmpty.tsx
│       │   │   │   │   ├── ClinicalGraphFilters.tsx
│       │   │   │   │   ├── ClinicalGraphLegend.tsx
│       │   │   │   │   ├── ClinicalGraphNodeDetails.tsx
│       │   │   │   │   ├── ClinicalGraphToolbar.tsx
│       │   │   │   │   └── ClinicalGraphViewer.tsx
│       │   │   │   ├── hooks/
│       │   │   │   │   └── useClinicalGraph.ts
│       │   │   │   ├── services/
│       │   │   │   │   └── clinical-knowledge.service.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── clinical-graph.types.ts
│       │   │   │   └── index.ts
│       │   │   ├── clinical-messages/
│       │   │   │   ├── services/
│       │   │   │   │   └── clinical-messages.service.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── clinical-messages.types.ts
│       │   │   │   └── index.ts
│       │   │   ├── consultations/
│       │   │   │   ├── components/
│       │   │   │   │   ├── ConsultaEstadoBadge.tsx
│       │   │   │   │   ├── DetalleConsultaModal.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   ├── hooks/
│       │   │   │   │   ├── useConsultationDetail.ts
│       │   │   │   │   └── useConsultationHistory.ts
│       │   │   │   ├── services/
│       │   │   │   │   └── consultations.service.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── consultation.types.ts
│       │   │   │   └── index.ts
│       │   │   ├── diagnoses/
│       │   │   │   ├── components/
│       │   │   │   │   ├── DetalleDiagnosticoModal.tsx
│       │   │   │   │   ├── DiagnosticoEstadoBadge.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   ├── hooks/
│       │   │   │   │   ├── useDiagnosisDetail.ts
│       │   │   │   │   └── useDiagnosisHistory.ts
│       │   │   │   ├── services/
│       │   │   │   │   └── diagnoses.service.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── diagnosis.types.ts
│       │   │   │   └── index.ts
│       │   │   ├── documents/
│       │   │   │   ├── services/
│       │   │   │   │   └── constancias.service.ts
│       │   │   │   └── types/
│       │   │   │       └── constancias.types.ts
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
│       │   │   ├── evaluations/
│       │   │   │   ├── hooks/
│       │   │   │   │   └── useEvaluations.ts
│       │   │   │   ├── services/
│       │   │   │   │   └── evaluations.service.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── evaluation.types.ts
│       │   │   │   └── index.ts
│       │   │   ├── health-education/
│       │   │   │   ├── components/
│       │   │   │   │   ├── ArticleChecklist.tsx
│       │   │   │   │   ├── ArticleQuiz.tsx
│       │   │   │   │   ├── ArticleReader.tsx
│       │   │   │   │   ├── ArticleSources.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   ├── data/
│       │   │   │   │   ├── articles.ts
│       │   │   │   │   └── categories.ts
│       │   │   │   └── types/
│       │   │   │       └── health-education.types.ts
│       │   │   ├── laboratory/
│       │   │   │   ├── components/
│       │   │   │   │   ├── DetalleResultadoLaboratorioModal.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   ├── hooks/
│       │   │   │   │   └── useLaboratoryResults.ts
│       │   │   │   ├── services/
│       │   │   │   │   └── laboratory.service.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── laboratory.types.ts
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
│       │   │   ├── lifestyle/
│       │   │   │   ├── components/
│       │   │   │   │   ├── CrearObjetivoModal.tsx
│       │   │   │   │   ├── index.ts
│       │   │   │   │   ├── RegistrarActividadModal.tsx
│       │   │   │   │   └── RegistrarHabitoModal.tsx
│       │   │   │   ├── hooks/
│       │   │   │   │   └── useLifestyleData.ts
│       │   │   │   ├── RegistrarActividadModal.tsx/
│       │   │   │   ├── services/
│       │   │   │   │   └── lifestyle.service.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── lifestyle.types.ts
│       │   │   │   └── index.ts
│       │   │   ├── maternal-health/
│       │   │   │   ├── hooks/
│       │   │   │   │   └── usePregnancyControl.ts
│       │   │   │   ├── services/
│       │   │   │   │   ├── maternal-health.service.ts
│       │   │   │   │   └── symptom-diary.service.ts
│       │   │   │   └── types/
│       │   │   │       └── maternal-health.types.ts
│       │   │   ├── medical-imaging/
│       │   │   │   ├── components/
│       │   │   │   │   ├── DetalleEstudioImagenModal.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   ├── hooks/
│       │   │   │   │   └── useMedicalImagingStudies.ts
│       │   │   │   ├── services/
│       │   │   │   │   └── medical-imaging.service.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── medical-imaging.types.ts
│       │   │   │   └── index.ts
│       │   │   ├── medications/
│       │   │   │   ├── components/
│       │   │   │   │   ├── DetalleMedicamentoModal.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   ├── hooks/
│       │   │   │   │   └── useMedicationHistory.ts
│       │   │   │   ├── services/
│       │   │   │   │   └── medications.service.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── medication.types.ts
│       │   │   │   └── index.ts
│       │   │   ├── patients/
│       │   │   │   ├── components/
│       │   │   │   ├── constants/
│       │   │   │   ├── context/
│       │   │   │   ├── data/
│       │   │   │   ├── hooks/
│       │   │   │   │   ├── useCreatePatient.ts
│       │   │   │   │   ├── useEmergencyContacts.ts
│       │   │   │   │   ├── usePatientPersonalData.ts
│       │   │   │   │   ├── usePatientPreferences.ts
│       │   │   │   │   ├── usePatientRecord.ts
│       │   │   │   │   ├── usePatientSecurity.ts
│       │   │   │   │   └── useSearchPatients.ts
│       │   │   │   ├── schemas/
│       │   │   │   ├── services/
│       │   │   │   │   ├── patient-preferences.service.ts
│       │   │   │   │   ├── patient-profile-preferences.service.ts
│       │   │   │   │   ├── patient-security.service.ts
│       │   │   │   │   └── patients.service.ts
│       │   │   │   ├── types/
│       │   │   │   │   ├── emergency-contacts.types.ts
│       │   │   │   │   ├── patient-personal-data.types.ts
│       │   │   │   │   ├── patient-preferences.types.ts
│       │   │   │   │   ├── patient-security.types.ts
│       │   │   │   │   └── patient.types.ts
│       │   │   │   ├── utils/
│       │   │   │   └── index.ts
│       │   │   ├── personalized-advice/
│       │   │   │   ├── hooks/
│       │   │   │   │   └── usePersonalizedAdvice.ts
│       │   │   │   ├── services/
│       │   │   │   │   └── personalized-advice.service.ts
│       │   │   │   └── types/
│       │   │   │       └── personalized-advice.types.ts
│       │   │   ├── prescriptions/
│       │   │   │   ├── components/
│       │   │   │   │   ├── DetalleRecetaModal.tsx
│       │   │   │   │   ├── index.ts
│       │   │   │   │   └── RecetaEstadoBadge.tsx
│       │   │   │   ├── hooks/
│       │   │   │   │   ├── useActivePrescriptions.ts
│       │   │   │   │   └── useMedicationReminders.ts
│       │   │   │   ├── services/
│       │   │   │   │   └── prescriptions.service.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── prescription.types.ts
│       │   │   │   └── index.ts
│       │   │   ├── references/
│       │   │   │   ├── hooks/
│       │   │   │   │   └── useReferences.ts
│       │   │   │   ├── services/
│       │   │   │   │   └── references.service.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── reference.types.ts
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
│       │   │   ├── users/
│       │   │   │   ├── components/
│       │   │   │   │   ├── CreateUserModal.tsx
│       │   │   │   │   ├── DeleteUserModal.tsx
│       │   │   │   │   ├── EditCredentialsModal.tsx
│       │   │   │   │   ├── UserPermissionOverrideModal.tsx
│       │   │   │   │   ├── UserRoleModal.tsx
│       │   │   │   │   └── UserStatusModal.tsx
│       │   │   │   ├── constants/
│       │   │   │   │   └── user.constants.ts
│       │   │   │   ├── context/
│       │   │   │   ├── hooks/
│       │   │   │   │   └── useUsers.ts
│       │   │   │   ├── schemas/
│       │   │   │   │   └── user.schemas.ts
│       │   │   │   ├── services/
│       │   │   │   │   └── users.service.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── user.types.ts
│       │   │   │   └── index.ts
│       │   │   ├── vaccinations/
│       │   │   │   ├── components/
│       │   │   │   │   ├── DetalleVacunaModal.tsx
│       │   │   │   │   ├── EsquemaMinsalModal.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   ├── hooks/
│       │   │   │   │   ├── useCreateVaccination.ts
│       │   │   │   │   ├── useVaccinationHistory.ts
│       │   │   │   │   └── useVaccinationRecord.ts
│       │   │   │   ├── services/
│       │   │   │   │   └── vaccinations.service.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── vaccination.types.ts
│       │   │   │   └── index.ts
│       │   │   ├── visits/
│       │   │   │   ├── hooks/
│       │   │   │   │   └── useVisits.ts
│       │   │   │   ├── services/
│       │   │   │   │   └── visits.service.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── visit.types.ts
│       │   │   │   └── index.ts
│       │   │   └── vital-signs/
│       │   │       ├── components/
│       │   │       │   ├── DetalleSignosVitalesModal.tsx
│       │   │       │   └── index.ts
│       │   │       ├── hooks/
│       │   │       │   └── useVitalSignsHistory.ts
│       │   │       ├── services/
│       │   │       │   └── vital-signs.service.ts
│       │   │       ├── types/
│       │   │       │   └── vital-signs.types.ts
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
│       │   │   │   │   ├── notificaciones/
│       │   │   │   │   │   └── historial/
│       │   │   │   │   │       └── HistorialNotificacionesPage.tsx
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
│       │   │   │   │   ├── atencion/
│       │   │   │   │   │   ├── historial/
│       │   │   │   │   │   │   ├── components/
│       │   │   │   │   │   │   │   ├── HistorialAtencionesEmpty.tsx
│       │   │   │   │   │   │   │   ├── HistorialAtencionesFiltros.tsx
│       │   │   │   │   │   │   │   ├── HistorialAtencionesHeader.tsx
│       │   │   │   │   │   │   │   ├── HistorialAtencionesResumen.tsx
│       │   │   │   │   │   │   │   ├── HistorialAtencionesSkeleton.tsx
│       │   │   │   │   │   │   │   ├── HistorialAtencionesTabla.tsx
│       │   │   │   │   │   │   │   ├── HistorialAtencionRow.tsx
│       │   │   │   │   │   │   │   └── index.ts
│       │   │   │   │   │   │   ├── HistorialAtencionesPage.tsx
│       │   │   │   │   │   │   └── index.ts
│       │   │   │   │   │   ├── nueva/
│       │   │   │   │   │   │   ├── components/
│       │   │   │   │   │   │   │   ├── AtencionAccionesCard.tsx
│       │   │   │   │   │   │   │   ├── AtencionAntecedentesCard.tsx
│       │   │   │   │   │   │   │   ├── AtencionEducacionCard.tsx
│       │   │   │   │   │   │   │   ├── AtencionEstadoBadge.tsx
│       │   │   │   │   │   │   │   ├── AtencionGuardarModal.tsx
│       │   │   │   │   │   │   │   ├── AtencionHeader.tsx
│       │   │   │   │   │   │   │   ├── AtencionMotivoCard.tsx
│       │   │   │   │   │   │   │   ├── AtencionNavegacion.tsx
│       │   │   │   │   │   │   │   ├── AtencionObservacionesCard.tsx
│       │   │   │   │   │   │   │   ├── AtencionPacienteCard.tsx
│       │   │   │   │   │   │   │   ├── AtencionReferenciaCard.tsx
│       │   │   │   │   │   │   │   ├── AtencionResumenCard.tsx
│       │   │   │   │   │   │   │   ├── AtencionSeguimientoCard.tsx
│       │   │   │   │   │   │   │   ├── AtencionSeguimientoReferenciaCard.tsx
│       │   │   │   │   │   │   │   ├── AtencionSignosVitalesCard.tsx
│       │   │   │   │   │   │   │   ├── AtencionSintomasCard.tsx
│       │   │   │   │   │   │   │   ├── AtencionValoracionTabs.tsx
│       │   │   │   │   │   │   │   └── index.ts
│       │   │   │   │   │   │   ├── index.ts
│       │   │   │   │   │   │   └── NuevaAtencionPage.tsx
│       │   │   │   │   │   └── pendientes/
│       │   │   │   │   │       ├── components/
│       │   │   │   │   │       │   ├── AtencionesPendientesEmpty.tsx
│       │   │   │   │   │       │   ├── AtencionesPendientesFilters.tsx
│       │   │   │   │   │       │   ├── AtencionesPendientesHeader.tsx
│       │   │   │   │   │       │   ├── AtencionesPendientesList.tsx
│       │   │   │   │   │       │   ├── AtencionesPendientesSummary.tsx
│       │   │   │   │   │       │   ├── AtencionPendienteCard.tsx
│       │   │   │   │   │       │   ├── AtencionPendienteDetailModal.tsx
│       │   │   │   │   │       │   ├── AtencionPendienteStatusBadge.tsx
│       │   │   │   │   │       │   ├── AtencionSincronizacionCard.tsx
│       │   │   │   │   │       │   └── index.ts
│       │   │   │   │   │       ├── AtencionesPendientesPage.tsx
│       │   │   │   │   │       └── index.ts
│       │   │   │   │   ├── brigada/
│       │   │   │   │   │   ├── jornada/
│       │   │   │   │   │   │   ├── components/
│       │   │   │   │   │   │   │   ├── index.ts
│       │   │   │   │   │   │   │   ├── JornadaActividadesTimeline.tsx
│       │   │   │   │   │   │   │   ├── JornadaControlCard.tsx
│       │   │   │   │   │   │   │   ├── JornadaEquipoCard.tsx
│       │   │   │   │   │   │   │   ├── JornadaHeader.tsx
│       │   │   │   │   │   │   │   ├── JornadaInfoCard.tsx
│       │   │   │   │   │   │   │   ├── JornadaRecursosCard.tsx
│       │   │   │   │   │   │   │   └── RegistrarActividadModal.tsx
│       │   │   │   │   │   │   ├── index.ts
│       │   │   │   │   │   │   └── JornadaBrigadaPage.tsx
│       │   │   │   │   │   ├── pacientes/
│       │   │   │   │   │   │   ├── components/
│       │   │   │   │   │   │   │   ├── index.ts
│       │   │   │   │   │   │   │   ├── PacientesBrigadaFiltros.tsx
│       │   │   │   │   │   │   │   ├── PacientesBrigadaHeader.tsx
│       │   │   │   │   │   │   │   ├── PacientesBrigadaResumen.tsx
│       │   │   │   │   │   │   │   └── PacientesBrigadaTabla.tsx
│       │   │   │   │   │   │   ├── index.ts
│       │   │   │   │   │   │   └── PacientesBrigadaPage.tsx
│       │   │   │   │   │   └── resumen/
│       │   │   │   │   │       ├── components/
│       │   │   │   │   │       │   ├── AccionesRapidasBrigada.tsx
│       │   │   │   │   │       │   ├── EstadoActualBrigadaCard.tsx
│       │   │   │   │   │       │   ├── index.ts
│       │   │   │   │   │       │   ├── MetricasBrigadaCards.tsx
│       │   │   │   │   │       │   ├── NavegacionBrigadaCards.tsx
│       │   │   │   │   │       │   ├── RequiereAtencionBrigadaCard.tsx
│       │   │   │   │   │       │   └── ResumenBrigadaHeader.tsx
│       │   │   │   │   │       ├── index.ts
│       │   │   │   │   │       └── ResumenBrigadaPage.tsx
│       │   │   │   │   ├── dashboard/
│       │   │   │   │   │   ├── actividad/
│       │   │   │   │   │   │   ├── components/
│       │   │   │   │   │   │   │   ├── ActividadCard.tsx
│       │   │   │   │   │   │   │   ├── ActividadFiltros.tsx
│       │   │   │   │   │   │   │   ├── ActividadHeader.tsx
│       │   │   │   │   │   │   │   ├── ActividadResumen.tsx
│       │   │   │   │   │   │   │   ├── ActividadTabla.tsx
│       │   │   │   │   │   │   │   ├── ActividadTimeline.tsx
│       │   │   │   │   │   │   │   ├── EstadoActividadBadge.tsx
│       │   │   │   │   │   │   │   ├── index.ts
│       │   │   │   │   │   │   │   └── ProximaActividadCard.tsx
│       │   │   │   │   │   │   └── ActividadBrigadistaPage.tsx
│       │   │   │   │   │   └── resumen/
│       │   │   │   │   │       ├── components/
│       │   │   │   │   │       │   ├── AccionesRapidasPromotor.tsx
│       │   │   │   │   │       │   ├── ActividadRecientePromotor.tsx
│       │   │   │   │   │       │   ├── AlertasRiesgoCard.tsx
│       │   │   │   │   │       │   ├── EstadoJornadaOperativaCard.tsx
│       │   │   │   │   │       │   ├── index.ts
│       │   │   │   │   │       │   ├── ProximaAccionCard.tsx
│       │   │   │   │   │       │   ├── ResumenOperativoCard.tsx
│       │   │   │   │   │       │   ├── SincronizacionCard.tsx
│       │   │   │   │   │       │   └── TarjetaBienvenidaPromotor.tsx
│       │   │   │   │   │       ├── index.ts
│       │   │   │   │   │       └── ResumenBrigadistaPage.tsx
│       │   │   │   │   ├── mapa/
│       │   │   │   │   │   ├── establecimientos/
│       │   │   │   │   │   │   └── MapaEstablecimientosPage.tsx
│       │   │   │   │   │   ├── pacientes/
│       │   │   │   │   │   └── ubicacion/
│       │   │   │   │   │       └── UbicacionPage.tsx
│       │   │   │   │   ├── notificaciones/
│       │   │   │   │   │   ├── alertas/
│       │   │   │   │   │   │   └── AlertasPage.tsx
│       │   │   │   │   │   └── centro/
│       │   │   │   │   │       └── CentroNotificacionesPage.tsx
│       │   │   │   │   ├── pacientes/
│       │   │   │   │   │   ├── buscar/
│       │   │   │   │   │   │   ├── components/
│       │   │   │   │   │   │   │   ├── BuscadorPaciente.tsx
│       │   │   │   │   │   │   │   ├── BuscarPacienteHeader.tsx
│       │   │   │   │   │   │   │   ├── EscanearPacienteCard.tsx
│       │   │   │   │   │   │   │   ├── EstadoBusqueda.tsx
│       │   │   │   │   │   │   │   ├── index.ts
│       │   │   │   │   │   │   │   ├── PacienteResultadoCard.tsx
│       │   │   │   │   │   │   │   └── ResultadosPaciente.tsx
│       │   │   │   │   │   │   ├── BuscarPacientePage.tsx
│       │   │   │   │   │   │   └── index.ts
│       │   │   │   │   │   ├── escanear/
│       │   │   │   │   │   │   └── EscanearPacientePage.tsx
│       │   │   │   │   │   ├── expediente/
│       │   │   │   │   │   │   ├── components/
│       │   │   │   │   │   │   │   ├── tabs/
│       │   │   │   │   │   │   │   │   ├── CarnetDigitalPacienteTab.tsx
│       │   │   │   │   │   │   │   │   ├── ConsultasPacienteTab.tsx
│       │   │   │   │   │   │   │   │   ├── DetalleConsultaModal.tsx
│       │   │   │   │   │   │   │   │   ├── ResumenPacienteTab.tsx
│       │   │   │   │   │   │   │   │   └── SignosVitalesPacienteTab.tsx
│       │   │   │   │   │   │   │   ├── ExpedienteBuscador.tsx
│       │   │   │   │   │   │   │   ├── ExpedientePacienteHeader.tsx
│       │   │   │   │   │   │   │   ├── ExpedienteResu>ltados.tsx
│       │   │   │   │   │   │   │   ├── ExpedienteResumenClinico.tsx
│       │   │   │   │   │   │   │   ├── ExpedienteTabs.tsx
│       │   │   │   │   │   │   │   └── index.ts
│       │   │   │   │   │   │   ├── ExpedientePacientePage.tsx
│       │   │   │   │   │   │   └── index.ts
│       │   │   │   │   │   └── registrar/
│       │   │   │   │   │       ├── components/
│       │   │   │   │   │       │   ├── CarnetDigitalPaciente.tsx
│       │   │   │   │   │       │   ├── ConfirmacionRegistroCard.tsx
│       │   │   │   │   │       │   ├── ContactoEmergenciaCard.tsx
│       │   │   │   │   │       │   ├── ContactoPacienteCard.tsx
│       │   │   │   │   │       │   ├── CuentaMedicOSCard.tsx
│       │   │   │   │   │       │   ├── DatosIdentificacionCard.tsx
│       │   │   │   │   │       │   ├── index.ts
│       │   │   │   │   │       │   ├── InformacionMedicaCard.tsx
│       │   │   │   │   │       │   ├── PacienteRegistradoCard.tsx
│       │   │   │   │   │       │   ├── PasoIndicador.tsx
│       │   │   │   │   │       │   ├── PasoNavegacion.tsx
│       │   │   │   │   │       │   └── RegistrarPacienteHeader.tsx
│       │   │   │   │   │       ├── index.ts
│       │   │   │   │   │       └── RegistrarPacientePage.tsx
│       │   │   │   │   ├── perfil/
│       │   │   │   │   │   ├── datos/
│       │   │   │   │   │   │   └── DatosBrigadistaPage.tsx
│       │   │   │   │   │   ├── preferencias/
│       │   │   │   │   │   │   └── PreferenciasBrigadistaPage.tsx
│       │   │   │   │   │   └── seguridad/
│       │   │   │   │   │       └── SeguridadBrigadistaPage.tsx
│       │   │   │   │   ├── promocion-prevencion/
│       │   │   │   │   │   ├── educacion-prevencion/
│       │   │   │   │   │   ├── materno-infantil/
│       │   │   │   │   │   ├── nutricion/
│       │   │   │   │   │   └── vacunacion/
│       │   │   │   │   │       ├── historial/
│       │   │   │   │   │       │   ├── components/
│       │   │   │   │   │       │   │   ├── HistorialVacunacionDetail.tsx
│       │   │   │   │   │       │   │   ├── HistorialVacunacionFilters.tsx
│       │   │   │   │   │       │   │   ├── HistorialVacunacionHeader.tsx
│       │   │   │   │   │       │   │   ├── HistorialVacunacionList.tsx
│       │   │   │   │   │       │   │   └── index.ts
│       │   │   │   │   │       │   ├── HistorialVacunacionPage.tsx
│       │   │   │   │   │       │   └── index.ts
│       │   │   │   │   │       ├── registro/
│       │   │   │   │   │       │   ├── components/
│       │   │   │   │   │       │   │   ├── index.ts
│       │   │   │   │   │       │   │   ├── VacunacionAplicacionCard.tsx
│       │   │   │   │   │       │   │   ├── VacunacionHeader.tsx
│       │   │   │   │   │       │   │   ├── VacunacionNavegacion.tsx
│       │   │   │   │   │       │   │   ├── VacunacionObservacionesCard.tsx
│       │   │   │   │   │       │   │   ├── VacunacionPacienteCard.tsx
│       │   │   │   │   │       │   │   ├── VacunacionPasosBar.tsx
│       │   │   │   │   │       │   │   ├── VacunacionResumenCard.tsx
│       │   │   │   │   │       │   │   └── VacunaSeleccionCard.tsx
│       │   │   │   │   │       │   ├── index.ts
│       │   │   │   │   │       │   └── RegistroVacunacionPage.tsx
│       │   │   │   │   │       └── resumen/
│       │   │   │   │   │           ├── components/
│       │   │   │   │   │           │   ├── index.ts
│       │   │   │   │   │           │   ├── VacunacionAccionesRapidas.tsx
│       │   │   │   │   │           │   ├── VacunacionCoverageCard.tsx
│       │   │   │   │   │           │   ├── VacunacionMetricasCards.tsx
│       │   │   │   │   │           │   ├── VacunacionPendientesCard.tsx
│       │   │   │   │   │           │   ├── VacunacionRecentCard.tsx
│       │   │   │   │   │           │   ├── VacunacionResumenHeader.tsx
│       │   │   │   │   │           │   └── VacunacionSincronizacionCard.tsx
│       │   │   │   │   │           ├── index.ts
│       │   │   │   │   │           └── VacunacionResumenPage.tsx
│       │   │   │   │   ├── referencias/
│       │   │   │   │   │   ├── historial/
│       │   │   │   │   │   ├── nueva/
│       │   │   │   │   │   └── pendientes/
│       │   │   │   │   ├── reportes/
│       │   │   │   │   │   ├── atencion/
│       │   │   │   │   │   ├── brigada/
│       │   │   │   │   │   │   └── ReportesBrigadaPage.tsx
│       │   │   │   │   │   ├── pacientes/
│       │   │   │   │   │   ├── seguimiento/
│       │   │   │   │   │   └── visitas/
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
│       │   │   │   │   └── visitas/
│       │   │   │   │       ├── nueva/
│       │   │   │   │       ├── programadas/
│       │   │   │   │       └── realizadas/
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
│       │   │   │   │   │   │   ├── components/
│       │   │   │   │   │   │   │   ├── AgendaFilters.tsx
│       │   │   │   │   │   │   │   ├── AgendaHeader.tsx
│       │   │   │   │   │   │   │   └── AgendaTableList.tsx
│       │   │   │   │   │   │   └── AgendaConsultasPage.tsx
│       │   │   │   │   │   ├── historial/
│       │   │   │   │   │   │   └── HistorialConsultasPage.tsx
│       │   │   │   │   │   ├── nueva/
│       │   │   │   │   │   │   ├── components/
│       │   │   │   │   │   │   │   ├── CarruselPasosHeader.tsx
│       │   │   │   │   │   │   │   ├── ColaAtencionDual.tsx
│       │   │   │   │   │   │   │   ├── FormularioConsultaClinica.tsx
│       │   │   │   │   │   │   │   ├── NuevaConsultaHeader.tsx
│       │   │   │   │   │   │   │   ├── PacienteFichaClinica.tsx
│       │   │   │   │   │   │   │   ├── PasoAnamnesisExamen.tsx
│       │   │   │   │   │   │   │   ├── PasoDiagnosticoCIE.tsx
│       │   │   │   │   │   │   │   ├── PasoPlanCierre.tsx
│       │   │   │   │   │   │   │   ├── PasoPrescripcionReceta.tsx
│       │   │   │   │   │   │   │   ├── PrescripcionMedicamentos.tsx
│       │   │   │   │   │   │   │   └── SoporteInferenciaCard.tsx
│       │   │   │   │   │   │   ├── utils/
│       │   │   │   │   │   │   │   └── clinicalEngine.ts
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
│       │   │   │   │   │   │   ├── components/
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
│       │   │       │   ├── onboarding/
│       │   │       │   │   ├── BienvenidaOnboardingModal.tsx
│       │   │       │   │   ├── index.ts
│       │   │       │   │   ├── OnboardingCarnetPreview.tsx
│       │   │       │   │   ├── OnboardingPaso1.tsx
│       │   │       │   │   ├── OnboardingPaso2.tsx
│       │   │       │   │   ├── OnboardingPaso3.tsx
│       │   │       │   │   └── OnboardingSuccess.tsx
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
│       │   │       │   │   │   ├── components/
│       │   │       │   │   │   │   ├── AgendarCitaHeader.tsx
│       │   │       │   │   │   │   ├── AppointmentStepper.tsx
│       │   │       │   │   │   │   ├── CitaConfirmadaCard.tsx
│       │   │       │   │   │   │   ├── DoctorSelector.tsx
│       │   │       │   │   │   │   ├── MotivoCitaSelector.tsx
│       │   │       │   │   │   │   ├── SlotPicker.tsx
│       │   │       │   │   │   │   └── SymptomSelector.tsx
│       │   │       │   │   │   └── AgendarCitaPage.tsx
│       │   │       │   │   ├── mis-citas/
│       │   │       │   │   │   ├── components/
│       │   │       │   │   │   │   ├── CitaCard.tsx
│       │   │       │   │   │   │   ├── CitasFilters.tsx
│       │   │       │   │   │   │   ├── index.ts
│       │   │       │   │   │   │   ├── MisCitasEmpty.tsx
│       │   │       │   │   │   │   ├── MisCitasError.tsx
│       │   │       │   │   │   │   ├── MisCitasHeader.tsx
│       │   │       │   │   │   │   ├── MisCitasLoading.tsx
│       │   │       │   │   │   │   └── ProximaCitaCard.tsx
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
│       │   │       │   │   │   ├── components/
│       │   │       │   │   │   │   ├── ConstanciaCard.tsx
│       │   │       │   │   │   │   ├── ConstanciaPreviewModal.tsx
│       │   │       │   │   │   │   ├── ConstanciasEmpty.tsx
│       │   │       │   │   │   │   ├── ConstanciasError.tsx
│       │   │       │   │   │   │   ├── ConstanciasFilters.tsx
│       │   │       │   │   │   │   ├── ConstanciasHeader.tsx
│       │   │       │   │   │   │   ├── ConstanciasLoading.tsx
│       │   │       │   │   │   │   ├── ConstanciasStatusCards.tsx
│       │   │       │   │   │   │   └── index.ts
│       │   │       │   │   │   └── ConstanciasMedicasPage.tsx
│       │   │       │   │   └── descarga-expediente/
│       │   │       │   │       ├── components/
│       │   │       │   │       │   ├── DescargaExpedienteEmpty.tsx
│       │   │       │   │       │   ├── DescargaExpedienteError.tsx
│       │   │       │   │       │   ├── DescargaExpedienteHeader.tsx
│       │   │       │   │       │   ├── DescargaExpedienteLoading.tsx
│       │   │       │   │       │   ├── EstadoExpedienteCard.tsx
│       │   │       │   │       │   ├── FiltrosExpediente.tsx
│       │   │       │   │       │   ├── GenerandoExpedienteModal.tsx
│       │   │       │   │       │   ├── index.ts
│       │   │       │   │       │   ├── InformacionRelevanteCard.tsx
│       │   │       │   │       │   ├── OpcionesDescargaCard.tsx
│       │   │       │   │       │   ├── ResumenExpedienteCard.tsx
│       │   │       │   │       │   ├── ResumenIAExpedienteCard.tsx
│       │   │       │   │       │   ├── SeccionesExpediente.tsx
│       │   │       │   │       │   └── SeccionExpedienteCard.tsx
│       │   │       │   │       └── DescargaExpedientePage.tsx
│       │   │       │   ├── educacion-ia/
│       │   │       │   │   ├── articulos/
│       │   │       │   │   │   ├── components/
│       │   │       │   │   │   │   ├── ArticuloCard.tsx
│       │   │       │   │   │   │   ├── ArticuloDestacadoCard.tsx
│       │   │       │   │   │   │   ├── ArticulosCategorias.tsx
│       │   │       │   │   │   │   ├── ArticulosHeader.tsx
│       │   │       │   │   │   │   ├── ArticulosSearch.tsx
│       │   │       │   │   │   │   └── index.ts
│       │   │       │   │   │   └── ArticulosEducativosPage.tsx
│       │   │       │   │   ├── asistente/
│       │   │       │   │   │   ├── components/
│       │   │       │   │   │   │   ├── AsistenteHeader.tsx
│       │   │       │   │   │   │   ├── ChatInputBar.tsx
│       │   │       │   │   │   │   ├── ChatMessageBubble.tsx
│       │   │       │   │   │   │   ├── index.ts
│       │   │       │   │   │   │   └── SelectorContextoClinico.tsx
│       │   │       │   │   │   └── AsistenteSaludIAPage.tsx
│       │   │       │   │   └── consejos-personalizados/
│       │   │       │   │       ├── components/
│       │   │       │   │       │   ├── ArticulosSugeridosBanner.tsx
│       │   │       │   │       │   ├── ConsejoCard.tsx
│       │   │       │   │       │   ├── ConsejoDestacadoCard.tsx
│       │   │       │   │       │   ├── ConsejoDetalleModal.tsx
│       │   │       │   │       │   ├── ConsejosPersonalizadosEmpty.tsx
│       │   │       │   │       │   ├── ConsejosPersonalizadosHeader.tsx
│       │   │       │   │       │   └── index.ts
│       │   │       │   │       └── ConsejosPersonalizadosPage.tsx
│       │   │       │   ├── estudios/
│       │   │       │   │   ├── estudios-imagen/
│       │   │       │   │   │   ├── components/
│       │   │       │   │   │   │   ├── EstudioImagenCard.tsx
│       │   │       │   │   │   │   ├── EstudiosImagenEmpty.tsx
│       │   │       │   │   │   │   ├── EstudiosImagenError.tsx
│       │   │       │   │   │   │   ├── EstudiosImagenFilters.tsx
│       │   │       │   │   │   │   ├── EstudiosImagenHeader.tsx
│       │   │       │   │   │   │   ├── EstudiosImagenLoading.tsx
│       │   │       │   │   │   │   ├── EstudiosImagenStatusCards.tsx
│       │   │       │   │   │   │   └── index.ts
│       │   │       │   │   │   └── EstudiosImagenPage.tsx
│       │   │       │   │   └── resultados-laboratorio/
│       │   │       │   │       ├── components/
│       │   │       │   │       │   ├── index.ts
│       │   │       │   │       │   ├── ResultadoLaboratorioCard.tsx
│       │   │       │   │       │   ├── ResultadosLaboratorioEmpty.tsx
│       │   │       │   │       │   ├── ResultadosLaboratorioError.tsx
│       │   │       │   │       │   ├── ResultadosLaboratorioFilters.tsx
│       │   │       │   │       │   ├── ResultadosLaboratorioHeader.tsx
│       │   │       │   │       │   ├── ResultadosLaboratorioLoading.tsx
│       │   │       │   │       │   └── ResultadosLaboratorioStatusCards.tsx
│       │   │       │   │       └── ResultadosLaboratorioPage.tsx
│       │   │       │   ├── expediente/
│       │   │       │   │   ├── alergias-antecedentes/
│       │   │       │   │   │   ├── components/
│       │   │       │   │   │   │   ├── AlergiaCard.tsx
│       │   │       │   │   │   │   ├── AlergiasAntecedentesEmpty.tsx
│       │   │       │   │   │   │   ├── AlergiasAntecedentesError.tsx
│       │   │       │   │   │   │   ├── AlergiasAntecedentesHeader.tsx
│       │   │       │   │   │   │   ├── AlergiasAntecedentesLoading.tsx
│       │   │       │   │   │   │   ├── AntecedenteCard.tsx
│       │   │       │   │   │   │   ├── AntecedentesSection.tsx
│       │   │       │   │   │   │   ├── index.ts
│       │   │       │   │   │   │   └── ResumenAlergias.tsx
│       │   │       │   │   │   └── AlergiasAntecedentesPage.tsx
│       │   │       │   │   ├── consultas/
│       │   │       │   │   │   ├── components/
│       │   │       │   │   │   │   ├── ConsultaHistorialCard.tsx
│       │   │       │   │   │   │   ├── ConsultasStatusCards.tsx
│       │   │       │   │   │   │   ├── HistorialConsultasEmpty.tsx
│       │   │       │   │   │   │   ├── HistorialConsultasError.tsx
│       │   │       │   │   │   │   ├── HistorialConsultasFilters.tsx
│       │   │       │   │   │   │   ├── HistorialConsultasHeader.tsx
│       │   │       │   │   │   │   ├── HistorialConsultasLoading.tsx
│       │   │       │   │   │   │   └── index.ts
│       │   │       │   │   │   └── HistorialConsultasPage.tsx
│       │   │       │   │   ├── diagnosticos/
│       │   │       │   │   │   ├── components/
│       │   │       │   │   │   │   ├── DiagnosticoCard.tsx
│       │   │       │   │   │   │   ├── DiagnosticosEmpty.tsx
│       │   │       │   │   │   │   ├── DiagnosticosError.tsx
│       │   │       │   │   │   │   ├── DiagnosticosFilters.tsx
│       │   │       │   │   │   │   ├── DiagnosticosHeader.tsx
│       │   │       │   │   │   │   ├── DiagnosticosLoading.tsx
│       │   │       │   │   │   │   ├── DiagnosticosStatusCards.tsx
│       │   │       │   │   │   │   └── index.ts
│       │   │       │   │   │   └── DiagnosticosPage.tsx
│       │   │       │   │   └── vacunas/
│       │   │       │   │       ├── components/
│       │   │       │   │       │   ├── index.ts
│       │   │       │   │       │   ├── VacunaCard.tsx
│       │   │       │   │       │   ├── VacunasFilters.tsx
│       │   │       │   │       │   ├── VacunasHeader.tsx
│       │   │       │   │       │   └── VacunasStatusCards.tsx
│       │   │       │   │       └── VacunasPage.tsx
│       │   │       │   ├── monitoreo/
│       │   │       │   │   ├── habitos-estilo-vida/
│       │   │       │   │   │   ├── components/
│       │   │       │   │   │   │   ├── ActividadesHistorialCard.tsx
│       │   │       │   │   │   │   ├── ActividadesRecientesMini.tsx
│       │   │       │   │   │   │   ├── ActividadRecienteList.tsx
│       │   │       │   │   │   │   ├── EstiloVidaEmpty.tsx
│       │   │       │   │   │   │   ├── EstiloVidaError.tsx
│       │   │       │   │   │   │   ├── EstiloVidaHeader.tsx
│       │   │       │   │   │   │   ├── EstiloVidaLoading.tsx
│       │   │       │   │   │   │   ├── EstiloVidaStatusCards.tsx
│       │   │       │   │   │   │   ├── HabitosGrid.tsx
│       │   │       │   │   │   │   ├── HabitoTrackerCard.tsx
│       │   │       │   │   │   │   ├── index.ts
│       │   │       │   │   │   │   ├── MetaSemanalCard.tsx
│       │   │       │   │   │   │   └── ObjetivoSemanalCard.tsx
│       │   │       │   │   │   └── EstiloVidaPage.tsx
│       │   │       │   │   └── signos-vitales/
│       │   │       │   │       ├── components/
│       │   │       │   │       │   ├── EvolucionSignosVitales.tsx
│       │   │       │   │       │   ├── HistorialSignosVitales.tsx
│       │   │       │   │       │   ├── index.ts
│       │   │       │   │       │   ├── SignosVitalesEmpty.tsx
│       │   │       │   │       │   ├── SignosVitalesError.tsx
│       │   │       │   │       │   ├── SignosVitalesFilters.tsx
│       │   │       │   │       │   ├── SignosVitalesHeader.tsx
│       │   │       │   │       │   ├── SignosVitalesLoading.tsx
│       │   │       │   │       │   └── SignosVitalesStatusCards.tsx
│       │   │       │   │       └── SignosVitalesPage.tsx
│       │   │       │   ├── notificaciones/
│       │   │       │   │   ├── centro/
│       │   │       │   │   │   ├── components/
│       │   │       │   │   │   │   ├── index.ts
│       │   │       │   │   │   │   ├── NotificacionCard.tsx
│       │   │       │   │   │   │   ├── NotificacionesEmpty.tsx
│       │   │       │   │   │   │   ├── NotificacionesFilters.tsx
│       │   │       │   │   │   │   ├── NotificacionesGroup.tsx
│       │   │       │   │   │   │   ├── NotificacionesHeader.tsx
│       │   │       │   │   │   │   └── NotificacionesLoading.tsx
│       │   │       │   │   │   └── CentroNotificacionesPage.tsx
│       │   │       │   │   └── mensajes-medico/
│       │   │       │   │       ├── components/
│       │   │       │   │       │   ├── ChatClinicalContextCard.tsx
│       │   │       │   │       │   ├── ChatHeader.tsx
│       │   │       │   │       │   ├── ChatInputBar.tsx
│       │   │       │   │       │   ├── ChatMessageBubble.tsx
│       │   │       │   │       │   ├── ConversacionesList.tsx
│       │   │       │   │       │   ├── index.ts
│       │   │       │   │       │   ├── MensajesMedicoHeader.tsx
│       │   │       │   │       │   └── ModalAdjuntarClinico.tsx
│       │   │       │   │       └── MensajesMedicoPage.tsx
│       │   │       │   ├── perfil/
│       │   │       │   │   ├── contactos-emergencia/
│       │   │       │   │   │   ├── components/
│       │   │       │   │   │   │   ├── ContactoEmergenciaCard.tsx
│       │   │       │   │   │   │   ├── ContactoEmergenciaForm.tsx
│       │   │       │   │   │   │   ├── ContactoEmergenciaModal.tsx
│       │   │       │   │   │   │   ├── ContactoPrincipalBadge.tsx
│       │   │       │   │   │   │   ├── ContactosEmergenciaEmpty.tsx
│       │   │       │   │   │   │   ├── ContactosEmergenciaError.tsx
│       │   │       │   │   │   │   ├── ContactosEmergenciaHeader.tsx
│       │   │       │   │   │   │   ├── ContactosEmergenciaInfoCard.tsx
│       │   │       │   │   │   │   ├── ContactosEmergenciaList.tsx
│       │   │       │   │   │   │   ├── ContactosEmergenciaLoading.tsx
│       │   │       │   │   │   │   ├── EliminarContactoModal.tsx
│       │   │       │   │   │   │   ├── index.ts
│       │   │       │   │   │   │   ├── LineasEmergenciaNacionales.tsx
│       │   │       │   │   │   │   └── ServicioEmergenciaSOS.tsx
│       │   │       │   │   │   └── ContactosEmergenciaPage.tsx
│       │   │       │   │   ├── datos-personales/
│       │   │       │   │   │   ├── components/
│       │   │       │   │   │   │   ├── CambiarFotoModal.tsx
│       │   │       │   │   │   │   ├── CarnetOficialCard.tsx
│       │   │       │   │   │   │   ├── CredencialDigitalModal.tsx
│       │   │       │   │   │   │   ├── DatosPersonalesHeader.tsx
│       │   │       │   │   │   │   ├── IdentificacionMedicOSCard.tsx
│       │   │       │   │   │   │   ├── index.ts
│       │   │       │   │   │   │   ├── InformacionContactoCard.tsx
│       │   │       │   │   │   │   ├── InformacionPersonalCard.tsx
│       │   │       │   │   │   │   ├── InformacionSaludCard.tsx
│       │   │       │   │   │   │   ├── ModalIdentificacionDigital.tsx
│       │   │       │   │   │   │   ├── ModalInformacionSalud.tsx
│       │   │       │   │   │   │   ├── PerfilPacienteCard.tsx
│       │   │       │   │   │   │   ├── PersonalizacionPerfilCard.tsx
│       │   │       │   │   │   │   └── PrivacidadPerfilCard.tsx
│       │   │       │   │   │   └── DatosPersonalesPage.tsx
│       │   │       │   │   ├── preferencias/
│       │   │       │   │   │   ├── components/
│       │   │       │   │   │   │   ├── AccesibilidadPreferenciasCard.tsx
│       │   │       │   │   │   │   ├── AparienciaPreferenciasCard.tsx
│       │   │       │   │   │   │   ├── ComunicacionPreferenciasCard.tsx
│       │   │       │   │   │   │   ├── index.ts
│       │   │       │   │   │   │   ├── NotificacionesPreferenciasCard.tsx
│       │   │       │   │   │   │   ├── PreferenciaRow.tsx
│       │   │       │   │   │   │   ├── PreferenciaSelect.tsx
│       │   │       │   │   │   │   ├── PreferenciasError.tsx
│       │   │       │   │   │   │   ├── PreferenciasHeader.tsx
│       │   │       │   │   │   │   ├── PreferenciasLoading.tsx
│       │   │       │   │   │   │   ├── PreferenciasResetModal.tsx
│       │   │       │   │   │   │   ├── PreferenciasSection.tsx
│       │   │       │   │   │   │   └── PreferenciaToggle.tsx
│       │   │       │   │   │   └── PreferenciasPacientePage.tsx
│       │   │       │   │   └── seguridad/
│       │   │       │   │       ├── components/
│       │   │       │   │       │   ├── ActividadSeguridadCard.tsx
│       │   │       │   │       │   ├── CambiarContrasenaModal.tsx
│       │   │       │   │       │   ├── CerrarSesionModal.tsx
│       │   │       │   │       │   ├── EstadoSeguridadCard.tsx
│       │   │       │   │       │   ├── index.ts
│       │   │       │   │       │   ├── SeguridadError.tsx
│       │   │       │   │       │   ├── SeguridadHeader.tsx
│       │   │       │   │       │   ├── SeguridadLoading.tsx
│       │   │       │   │       │   ├── SeguridadRow.tsx
│       │   │       │   │       │   ├── SeguridadSection.tsx
│       │   │       │   │       │   ├── SesionActivaItem.tsx
│       │   │       │   │       │   ├── SesionesActivasCard.tsx
│       │   │       │   │       │   └── VerificacionDosPasosModal.tsx
│       │   │       │   │       └── SeguridadPacientePage.tsx
│       │   │       │   ├── salud-materna/
│       │   │       │   │   ├── citas-prenatales/
│       │   │       │   │   │   ├── components/
│       │   │       │   │   │   │   ├── CitaPrenatalCard.tsx
│       │   │       │   │   │   │   ├── CitasPrenatalesEmpty.tsx
│       │   │       │   │   │   │   ├── CitasPrenatalesError.tsx
│       │   │       │   │   │   │   ├── CitasPrenatalesFilters.tsx
│       │   │       │   │   │   │   ├── CitasPrenatalesHeader.tsx
│       │   │       │   │   │   │   ├── CitasPrenatalesLoading.tsx
│       │   │       │   │   │   │   ├── DetalleCitaPrenatalModal.tsx
│       │   │       │   │   │   │   ├── index.ts
│       │   │       │   │   │   │   ├── PreparacionCitaCard.tsx
│       │   │       │   │   │   │   └── ProximaCitaPrenatalCard.tsx
│       │   │       │   │   │   └── CitasPrenatalesPage.tsx
│       │   │       │   │   ├── control-embarazo/
│       │   │       │   │   │   ├── components/
│       │   │       │   │   │   │   ├── ControlEmbarazoEmpty.tsx
│       │   │       │   │   │   │   ├── ControlEmbarazoError.tsx
│       │   │       │   │   │   │   ├── ControlEmbarazoHeader.tsx
│       │   │       │   │   │   │   ├── ControlEmbarazoLoading.tsx
│       │   │       │   │   │   │   ├── EmbarazoAiSummaryCard.tsx
│       │   │       │   │   │   │   ├── EmbarazoKpisGrid.tsx
│       │   │       │   │   │   │   ├── EmbarazoResumenCard.tsx
│       │   │       │   │   │   │   ├── EmbarazoTimeline.tsx
│       │   │       │   │   │   │   ├── ExamenesEmbarazoCard.tsx
│       │   │       │   │   │   │   ├── GraficoEvolucionClinica.tsx
│       │   │       │   │   │   │   ├── index.ts
│       │   │       │   │   │   │   ├── ProgresoEmbarazoCard.tsx
│       │   │       │   │   │   │   ├── ProximoControlCard.tsx
│       │   │       │   │   │   │   ├── RecomendacionesEmbarazoCard.tsx
│       │   │       │   │   │   │   ├── UltimoControlCard.tsx
│       │   │       │   │   │   │   └── VacunasEmbarazoCard.tsx
│       │   │       │   │   │   └── ControlEmbarazoPage.tsx
│       │   │       │   │   └── diario-sintomas/
│       │   │       │   │       ├── components/
│       │   │       │   │       │   ├── DiarioSintomasHeader.tsx
│       │   │       │   │       │   ├── EstadoActualCard.tsx
│       │   │       │   │       │   ├── HistorialSintomas.tsx
│       │   │       │   │       │   ├── index.ts
│       │   │       │   │       │   ├── MovimientosFetalesCard.tsx
│       │   │       │   │       │   ├── ObservacionesDiarioCard.tsx
│       │   │       │   │       │   ├── RegistrarSintomasCard.tsx
│       │   │       │   │       │   ├── RegistrarSintomasModal.tsx
│       │   │       │   │       │   ├── RegistroSignosCasaCard.tsx
│       │   │       │   │       │   ├── ResumenParaConsultaCard.tsx
│       │   │       │   │       │   └── SignosAlarmaCard.tsx
│       │   │       │   │       └── DiarioSintomasPage.tsx
│       │   │       │   └── tratamientos/
│       │   │       │       ├── historial-medicamentos/
│       │   │       │       │   ├── components/
│       │   │       │       │   │   ├── HistorialMedicamentosEmpty.tsx
│       │   │       │       │   │   ├── HistorialMedicamentosError.tsx
│       │   │       │       │   │   ├── HistorialMedicamentosFilters.tsx
│       │   │       │       │   │   ├── HistorialMedicamentosHeader.tsx
│       │   │       │       │   │   ├── HistorialMedicamentosLoading.tsx
│       │   │       │       │   │   ├── HistorialMedicamentosStatusCards.tsx
│       │   │       │       │   │   ├── index.ts
│       │   │       │       │   │   └── MedicamentoHistorialCard.tsx
│       │   │       │       │   └── HistorialMedicamentosPage.tsx
│       │   │       │       ├── recetas-activas/
│       │   │       │       │   ├── components/
│       │   │       │       │   │   ├── index.ts
│       │   │       │       │   │   ├── ProximoFinalizarCard.tsx
│       │   │       │       │   │   ├── RecetaActivaCard.tsx
│       │   │       │       │   │   ├── RecetasActivasEmpty.tsx
│       │   │       │       │   │   ├── RecetasActivasHeader.tsx
│       │   │       │       │   │   └── RecetasActivasStatusCards.tsx
│       │   │       │       │   └── RecetasActivasPage.tsx
│       │   │       │       └── recordatorios/
│       │   │       │           ├── components/
│       │   │       │           │   ├── HorarioDiaList.tsx
│       │   │       │           │   ├── index.ts
│       │   │       │           │   ├── ProgresoDiaCard.tsx
│       │   │       │           │   ├── ProximaTomaCard.tsx
│       │   │       │           │   ├── RecordatoriosHeader.tsx
│       │   │       │           │   └── RecordatoriosStatusCards.tsx
│       │   │       │           └── RecordatoriosTomasPage.tsx
│       │   │       ├── routes/
│       │   │       │   └── PacienteRoutes.tsx
│       │   │       └── PacientePanel.tsx
│       │   ├── services/
│       │   ├── shared/
│       │   │   ├── components/
│       │   │   │   ├── carnet/
│       │   │   │   │   ├── CarnetDigitalPaciente.tsx
│       │   │   │   │   ├── index.ts
│       │   │   │   │   └── OnboardingCarnetPreview.tsx
│       │   │   │   ├── header/
│       │   │   │   │   ├── BuscadorHeader.tsx
│       │   │   │   │   ├── HeaderGlobal.tsx
│       │   │   │   │   ├── NotificacionesMenu.tsx
│       │   │   │   │   └── PerfilUsuarioHeader.tsx
│       │   │   │   ├── sidebar/
│       │   │   │   │   └── SidebarGlobal.tsx
│       │   │   │   └── UnderConstruction.tsx
│       │   │   ├── constants/
│       │   │   ├── data/
│       │   │   │   └── elSalvadorTerritory.ts
│       │   │   ├── hooks/
│       │   │   ├── lib/
│       │   │   │   ├── apiClient.ts
│       │   │   │   └── dateUtils.ts
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
