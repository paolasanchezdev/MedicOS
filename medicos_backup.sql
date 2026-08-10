--
-- PostgreSQL database dump
--

\restrict 2Yc9RN9zXQ9pOzKqDASVN79ZIz7Ke50c9opjEXQTGwmUFjFIwb1n9dd8c5Vckgj

-- Dumped from database version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: BloodType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."BloodType" AS ENUM (
    'A_POSITIVE',
    'A_NEGATIVE',
    'B_POSITIVE',
    'B_NEGATIVE',
    'O_POSITIVE',
    'O_NEGATIVE',
    'AB_POSITIVE',
    'AB_NEGATIVE',
    'UNKNOWN'
);


--
-- Name: BrigadeStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."BrigadeStatus" AS ENUM (
    'PLANNED',
    'ACTIVE',
    'COMPLETED',
    'CANCELLED'
);


--
-- Name: ConsultationStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ConsultationStatus" AS ENUM (
    'DRAFT',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);


--
-- Name: DeviceStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."DeviceStatus" AS ENUM (
    'ACTIVE',
    'OFFLINE',
    'BLOCKED',
    'RETIRED'
);


--
-- Name: QueuePriority; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."QueuePriority" AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);


--
-- Name: QueueStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."QueueStatus" AS ENUM (
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED'
);


--
-- Name: Role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'DOCTOR',
    'BRIGADISTA',
    'AUTHORITY',
    'PATIENT'
);


--
-- Name: Sex; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Sex" AS ENUM (
    'MALE',
    'FEMALE',
    'OTHER'
);


--
-- Name: SyncOperation; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."SyncOperation" AS ENUM (
    'CREATE',
    'UPDATE',
    'DELETE'
);


--
-- Name: SyncStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."SyncStatus" AS ENUM (
    'PENDING',
    'SYNCED',
    'CONFLICT'
);


--
-- Name: UserStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UserStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AuditLog" (
    id text NOT NULL,
    "userId" text,
    "deviceId" text,
    action text NOT NULL,
    entity text NOT NULL,
    "entityId" text NOT NULL,
    "changedFields" jsonb,
    "ipAddress" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Brigade; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Brigade" (
    id text NOT NULL,
    name text NOT NULL,
    department text NOT NULL,
    municipality text NOT NULL,
    latitude double precision,
    longitude double precision,
    status public."BrigadeStatus" DEFAULT 'PLANNED'::public."BrigadeStatus" NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone,
    "leaderId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "syncStatus" public."SyncStatus" DEFAULT 'PENDING'::public."SyncStatus" NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    "originDeviceId" text NOT NULL,
    "lastModifiedByDeviceId" text NOT NULL,
    "lastModified" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: BrigadeMember; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BrigadeMember" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "brigadeId" text NOT NULL,
    "joinedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: ClinicalRecord; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ClinicalRecord" (
    id text NOT NULL,
    "patientId" text NOT NULL,
    "bloodType" public."BloodType" DEFAULT 'UNKNOWN'::public."BloodType" NOT NULL,
    "familyHistory" text,
    "surgicalHistory" text,
    observations text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "syncStatus" public."SyncStatus" DEFAULT 'PENDING'::public."SyncStatus" NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    "originDeviceId" text NOT NULL,
    "lastModifiedByDeviceId" text NOT NULL,
    "lastModified" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Consultation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Consultation" (
    id text NOT NULL,
    "patientId" text NOT NULL,
    "doctorId" text NOT NULL,
    "clinicalRecordId" text NOT NULL,
    "brigadeId" text NOT NULL,
    status public."ConsultationStatus" DEFAULT 'DRAFT'::public."ConsultationStatus" NOT NULL,
    "chiefComplaint" text NOT NULL,
    "physicalExam" text NOT NULL,
    "diagnosisCode" text,
    "diagnosisDesc" text NOT NULL,
    "treatmentPlan" text NOT NULL,
    "consultationDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "followUpDate" timestamp(3) without time zone,
    "startedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "completedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "syncStatus" public."SyncStatus" DEFAULT 'PENDING'::public."SyncStatus" NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    "originDeviceId" text NOT NULL,
    "lastModifiedByDeviceId" text NOT NULL,
    "lastModified" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Device; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Device" (
    id text NOT NULL,
    name text NOT NULL,
    "serialNumber" text NOT NULL,
    "operatingSystem" text NOT NULL,
    "appVersion" text NOT NULL,
    "publicKey" text,
    location text,
    "lastSyncAt" timestamp(3) without time zone,
    status public."DeviceStatus" DEFAULT 'ACTIVE'::public."DeviceStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


--
-- Name: Patient; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Patient" (
    id text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "dateOfBirth" timestamp(3) without time zone NOT NULL,
    dui text,
    sex public."Sex" DEFAULT 'OTHER'::public."Sex" NOT NULL,
    phone text,
    address text NOT NULL,
    "emergencyName" text,
    "emergencyPhone" text,
    "emergencyRelation" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "syncStatus" public."SyncStatus" DEFAULT 'PENDING'::public."SyncStatus" NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    "originDeviceId" text NOT NULL,
    "lastModifiedByDeviceId" text NOT NULL,
    "lastModified" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: SyncQueue; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SyncQueue" (
    id text NOT NULL,
    "deviceId" text,
    entity text NOT NULL,
    "entityId" text NOT NULL,
    operation public."SyncOperation" NOT NULL,
    payload jsonb NOT NULL,
    priority public."QueuePriority" DEFAULT 'MEDIUM'::public."QueuePriority" NOT NULL,
    status public."QueueStatus" DEFAULT 'PENDING'::public."QueueStatus" NOT NULL,
    "retryCount" integer DEFAULT 0 NOT NULL,
    "errorMessage" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "syncedAt" timestamp(3) without time zone
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    role public."Role" DEFAULT 'BRIGADISTA'::public."Role" NOT NULL,
    status public."UserStatus" DEFAULT 'ACTIVE'::public."UserStatus" NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    phone text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


--
-- Name: VitalSigns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."VitalSigns" (
    id text NOT NULL,
    "patientId" text NOT NULL,
    "consultationId" text,
    temperature double precision NOT NULL,
    "heartRate" integer NOT NULL,
    "oxygenSat" integer NOT NULL,
    systolic integer NOT NULL,
    diastolic integer NOT NULL,
    weight double precision,
    height double precision,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "syncStatus" public."SyncStatus" DEFAULT 'PENDING'::public."SyncStatus" NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    "originDeviceId" text NOT NULL,
    "lastModifiedByDeviceId" text NOT NULL,
    "lastModified" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AuditLog" (id, "userId", "deviceId", action, entity, "entityId", "changedFields", "ipAddress", "createdAt") FROM stdin;
\.


--
-- Data for Name: Brigade; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Brigade" (id, name, department, municipality, latitude, longitude, status, "startDate", "endDate", "leaderId", "createdAt", "updatedAt", "deletedAt", "syncStatus", version, "originDeviceId", "lastModifiedByDeviceId", "lastModified") FROM stdin;
\.


--
-- Data for Name: BrigadeMember; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."BrigadeMember" (id, "userId", "brigadeId", "joinedAt") FROM stdin;
\.


--
-- Data for Name: ClinicalRecord; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ClinicalRecord" (id, "patientId", "bloodType", "familyHistory", "surgicalHistory", observations, "createdAt", "updatedAt", "deletedAt", "syncStatus", version, "originDeviceId", "lastModifiedByDeviceId", "lastModified") FROM stdin;
\.


--
-- Data for Name: Consultation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Consultation" (id, "patientId", "doctorId", "clinicalRecordId", "brigadeId", status, "chiefComplaint", "physicalExam", "diagnosisCode", "diagnosisDesc", "treatmentPlan", "consultationDate", "followUpDate", "startedAt", "completedAt", "createdAt", "updatedAt", "deletedAt", "syncStatus", version, "originDeviceId", "lastModifiedByDeviceId", "lastModified") FROM stdin;
\.


--
-- Data for Name: Device; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Device" (id, name, "serialNumber", "operatingSystem", "appVersion", "publicKey", location, "lastSyncAt", status, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: Patient; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Patient" (id, "firstName", "lastName", "dateOfBirth", dui, sex, phone, address, "emergencyName", "emergencyPhone", "emergencyRelation", "createdAt", "updatedAt", "deletedAt", "syncStatus", version, "originDeviceId", "lastModifiedByDeviceId", "lastModified") FROM stdin;
\.


--
-- Data for Name: SyncQueue; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."SyncQueue" (id, "deviceId", entity, "entityId", operation, payload, priority, status, "retryCount", "errorMessage", "createdAt", "syncedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, email, "passwordHash", role, status, "firstName", "lastName", phone, "createdAt", "updatedAt", "deletedAt") FROM stdin;
2d7f7f3a-9fd5-4d35-90a0-5ca10bfeec34	paola@medicos.com	$2b$10$8EMvjtiTnQxRoo.sWP7X4.zXrim39y3e1UjklJ3JnxwIlc2OdNPjy	ADMIN	ACTIVE	Paola	Rodríguez	\N	2026-07-29 17:01:59.408	2026-07-29 17:01:59.408	\N
c6ed469c-c7a3-4b25-8f05-34c2b75ca144	karlapaolasanchezr@gmail.com	$2b$10$g3sMT7aurrkSgHvMivaaw.QclwmaSB6cdtujkvZaKOX0lYjqf223a	PATIENT	ACTIVE	Karla Paola	Sánchez Rodríguez	7043-3127	2026-07-29 21:05:05.905	2026-07-29 21:05:05.905	\N
a2e7cafa-3f3e-4072-bde8-82f6d105875a	mariajuana@gmail.com	$2b$10$xrVKYVMHBdOsXzgwZXsDuevDUFoYtCOsbyvudcRwCwP.EpApVSbcO	PATIENT	ACTIVE	Maria Juana	Peréz Torres	7023-6594	2026-07-31 23:46:41.58	2026-07-31 23:46:41.58	\N
4bd0863b-f19c-4661-ad00-f1d1f9ce80ee	autoridad@medicos.com	$2b$10$wq3/JU8F1WdLpGWM.WPnr.IuRHrm35xL.3C49S2jnvNZM7CyS9.7S	AUTHORITY	ACTIVE	Paola	Sánchez	\N	2026-08-04 23:36:53.35	2026-08-04 23:36:53.35	\N
\.


--
-- Data for Name: VitalSigns; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."VitalSigns" (id, "patientId", "consultationId", temperature, "heartRate", "oxygenSat", systolic, diastolic, weight, height, "createdAt", "updatedAt", "deletedAt", "syncStatus", version, "originDeviceId", "lastModifiedByDeviceId", "lastModified") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
66397b49-ebb4-4233-ba81-ad5fd0054827	3ce1de6b6aba30f9cceff7e047b59153822c38945d2d1843751280348d272c94	2026-07-29 11:01:01.476166-06	20260714200750_init_medicos_mvp_core	\N	\N	2026-07-29 11:01:01.30404-06	1
57fd11f7-2177-4434-a9fa-db0f3dd82a45	06c55bd4816412c5c88f2af0cf41d7921bd3288b831b03b9a6c39eb42366617d	2026-07-29 11:01:01.480398-06	20260716153349_add_patient_role	\N	\N	2026-07-29 11:01:01.477267-06	1
\.


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: BrigadeMember BrigadeMember_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BrigadeMember"
    ADD CONSTRAINT "BrigadeMember_pkey" PRIMARY KEY (id);


--
-- Name: Brigade Brigade_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Brigade"
    ADD CONSTRAINT "Brigade_pkey" PRIMARY KEY (id);


--
-- Name: ClinicalRecord ClinicalRecord_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClinicalRecord"
    ADD CONSTRAINT "ClinicalRecord_pkey" PRIMARY KEY (id);


--
-- Name: Consultation Consultation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Consultation"
    ADD CONSTRAINT "Consultation_pkey" PRIMARY KEY (id);


--
-- Name: Device Device_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Device"
    ADD CONSTRAINT "Device_pkey" PRIMARY KEY (id);


--
-- Name: Patient Patient_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Patient"
    ADD CONSTRAINT "Patient_pkey" PRIMARY KEY (id);


--
-- Name: SyncQueue SyncQueue_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SyncQueue"
    ADD CONSTRAINT "SyncQueue_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: VitalSigns VitalSigns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."VitalSigns"
    ADD CONSTRAINT "VitalSigns_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: AuditLog_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "AuditLog_createdAt_idx" ON public."AuditLog" USING btree ("createdAt");


--
-- Name: AuditLog_entity_entityId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "AuditLog_entity_entityId_idx" ON public."AuditLog" USING btree (entity, "entityId");


--
-- Name: BrigadeMember_userId_brigadeId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "BrigadeMember_userId_brigadeId_key" ON public."BrigadeMember" USING btree ("userId", "brigadeId");


--
-- Name: Brigade_lastModifiedByDeviceId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Brigade_lastModifiedByDeviceId_idx" ON public."Brigade" USING btree ("lastModifiedByDeviceId");


--
-- Name: Brigade_lastModified_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Brigade_lastModified_idx" ON public."Brigade" USING btree ("lastModified");


--
-- Name: Brigade_originDeviceId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Brigade_originDeviceId_idx" ON public."Brigade" USING btree ("originDeviceId");


--
-- Name: Brigade_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Brigade_status_idx" ON public."Brigade" USING btree (status);


--
-- Name: Brigade_syncStatus_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Brigade_syncStatus_idx" ON public."Brigade" USING btree ("syncStatus");


--
-- Name: ClinicalRecord_lastModifiedByDeviceId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClinicalRecord_lastModifiedByDeviceId_idx" ON public."ClinicalRecord" USING btree ("lastModifiedByDeviceId");


--
-- Name: ClinicalRecord_lastModified_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClinicalRecord_lastModified_idx" ON public."ClinicalRecord" USING btree ("lastModified");


--
-- Name: ClinicalRecord_originDeviceId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClinicalRecord_originDeviceId_idx" ON public."ClinicalRecord" USING btree ("originDeviceId");


--
-- Name: ClinicalRecord_patientId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ClinicalRecord_patientId_key" ON public."ClinicalRecord" USING btree ("patientId");


--
-- Name: ClinicalRecord_syncStatus_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ClinicalRecord_syncStatus_idx" ON public."ClinicalRecord" USING btree ("syncStatus");


--
-- Name: Consultation_brigadeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Consultation_brigadeId_idx" ON public."Consultation" USING btree ("brigadeId");


--
-- Name: Consultation_doctorId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Consultation_doctorId_idx" ON public."Consultation" USING btree ("doctorId");


--
-- Name: Consultation_lastModifiedByDeviceId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Consultation_lastModifiedByDeviceId_idx" ON public."Consultation" USING btree ("lastModifiedByDeviceId");


--
-- Name: Consultation_lastModified_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Consultation_lastModified_idx" ON public."Consultation" USING btree ("lastModified");


--
-- Name: Consultation_originDeviceId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Consultation_originDeviceId_idx" ON public."Consultation" USING btree ("originDeviceId");


--
-- Name: Consultation_patientId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Consultation_patientId_idx" ON public."Consultation" USING btree ("patientId");


--
-- Name: Consultation_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Consultation_status_idx" ON public."Consultation" USING btree (status);


--
-- Name: Consultation_syncStatus_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Consultation_syncStatus_idx" ON public."Consultation" USING btree ("syncStatus");


--
-- Name: Device_serialNumber_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Device_serialNumber_idx" ON public."Device" USING btree ("serialNumber");


--
-- Name: Device_serialNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Device_serialNumber_key" ON public."Device" USING btree ("serialNumber");


--
-- Name: Device_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Device_status_idx" ON public."Device" USING btree (status);


--
-- Name: Patient_dui_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Patient_dui_idx" ON public."Patient" USING btree (dui);


--
-- Name: Patient_dui_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Patient_dui_key" ON public."Patient" USING btree (dui);


--
-- Name: Patient_lastModifiedByDeviceId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Patient_lastModifiedByDeviceId_idx" ON public."Patient" USING btree ("lastModifiedByDeviceId");


--
-- Name: Patient_lastModified_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Patient_lastModified_idx" ON public."Patient" USING btree ("lastModified");


--
-- Name: Patient_lastName_firstName_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Patient_lastName_firstName_idx" ON public."Patient" USING btree ("lastName", "firstName");


--
-- Name: Patient_originDeviceId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Patient_originDeviceId_idx" ON public."Patient" USING btree ("originDeviceId");


--
-- Name: Patient_syncStatus_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Patient_syncStatus_idx" ON public."Patient" USING btree ("syncStatus");


--
-- Name: SyncQueue_deviceId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "SyncQueue_deviceId_idx" ON public."SyncQueue" USING btree ("deviceId");


--
-- Name: SyncQueue_entity_entityId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "SyncQueue_entity_entityId_idx" ON public."SyncQueue" USING btree (entity, "entityId");


--
-- Name: SyncQueue_status_priority_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "SyncQueue_status_priority_createdAt_idx" ON public."SyncQueue" USING btree (status, priority, "createdAt");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_lastName_firstName_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "User_lastName_firstName_idx" ON public."User" USING btree ("lastName", "firstName");


--
-- Name: User_role_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "User_role_idx" ON public."User" USING btree (role);


--
-- Name: User_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "User_status_idx" ON public."User" USING btree (status);


--
-- Name: VitalSigns_consultationId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "VitalSigns_consultationId_idx" ON public."VitalSigns" USING btree ("consultationId");


--
-- Name: VitalSigns_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "VitalSigns_createdAt_idx" ON public."VitalSigns" USING btree ("createdAt");


--
-- Name: VitalSigns_lastModifiedByDeviceId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "VitalSigns_lastModifiedByDeviceId_idx" ON public."VitalSigns" USING btree ("lastModifiedByDeviceId");


--
-- Name: VitalSigns_originDeviceId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "VitalSigns_originDeviceId_idx" ON public."VitalSigns" USING btree ("originDeviceId");


--
-- Name: VitalSigns_patientId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "VitalSigns_patientId_idx" ON public."VitalSigns" USING btree ("patientId");


--
-- Name: VitalSigns_syncStatus_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "VitalSigns_syncStatus_idx" ON public."VitalSigns" USING btree ("syncStatus");


--
-- Name: AuditLog AuditLog_deviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES public."Device"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: AuditLog AuditLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: BrigadeMember BrigadeMember_brigadeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BrigadeMember"
    ADD CONSTRAINT "BrigadeMember_brigadeId_fkey" FOREIGN KEY ("brigadeId") REFERENCES public."Brigade"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BrigadeMember BrigadeMember_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BrigadeMember"
    ADD CONSTRAINT "BrigadeMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Brigade Brigade_leaderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Brigade"
    ADD CONSTRAINT "Brigade_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ClinicalRecord ClinicalRecord_patientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClinicalRecord"
    ADD CONSTRAINT "ClinicalRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES public."Patient"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Consultation Consultation_brigadeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Consultation"
    ADD CONSTRAINT "Consultation_brigadeId_fkey" FOREIGN KEY ("brigadeId") REFERENCES public."Brigade"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Consultation Consultation_clinicalRecordId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Consultation"
    ADD CONSTRAINT "Consultation_clinicalRecordId_fkey" FOREIGN KEY ("clinicalRecordId") REFERENCES public."ClinicalRecord"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Consultation Consultation_doctorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Consultation"
    ADD CONSTRAINT "Consultation_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Consultation Consultation_patientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Consultation"
    ADD CONSTRAINT "Consultation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES public."Patient"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SyncQueue SyncQueue_deviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SyncQueue"
    ADD CONSTRAINT "SyncQueue_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES public."Device"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: VitalSigns VitalSigns_consultationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."VitalSigns"
    ADD CONSTRAINT "VitalSigns_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES public."Consultation"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: VitalSigns VitalSigns_patientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."VitalSigns"
    ADD CONSTRAINT "VitalSigns_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES public."Patient"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 2Yc9RN9zXQ9pOzKqDASVN79ZIz7Ke50c9opjEXQTGwmUFjFIwb1n9dd8c5Vckgj

