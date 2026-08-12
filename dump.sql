--
-- PostgreSQL database dump
--

\restrict K0nGrx8zaTmn3YkvtmEdq26PQLVGz0LpNLW14Pjbc2KE7KfYF0HwN92K95IC1B7

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.18

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

ALTER TABLE IF EXISTS ONLY public."VitalSigns" DROP CONSTRAINT IF EXISTS "VitalSigns_patientId_fkey";
ALTER TABLE IF EXISTS ONLY public."VitalSigns" DROP CONSTRAINT IF EXISTS "VitalSigns_consultationId_fkey";
ALTER TABLE IF EXISTS ONLY public."SyncQueue" DROP CONSTRAINT IF EXISTS "SyncQueue_deviceId_fkey";
ALTER TABLE IF EXISTS ONLY public."Consultation" DROP CONSTRAINT IF EXISTS "Consultation_patientId_fkey";
ALTER TABLE IF EXISTS ONLY public."Consultation" DROP CONSTRAINT IF EXISTS "Consultation_doctorId_fkey";
ALTER TABLE IF EXISTS ONLY public."Consultation" DROP CONSTRAINT IF EXISTS "Consultation_clinicalRecordId_fkey";
ALTER TABLE IF EXISTS ONLY public."Consultation" DROP CONSTRAINT IF EXISTS "Consultation_brigadeId_fkey";
ALTER TABLE IF EXISTS ONLY public."ClinicalRecord" DROP CONSTRAINT IF EXISTS "ClinicalRecord_patientId_fkey";
ALTER TABLE IF EXISTS ONLY public."Brigade" DROP CONSTRAINT IF EXISTS "Brigade_leaderId_fkey";
ALTER TABLE IF EXISTS ONLY public."BrigadeMember" DROP CONSTRAINT IF EXISTS "BrigadeMember_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."BrigadeMember" DROP CONSTRAINT IF EXISTS "BrigadeMember_brigadeId_fkey";
ALTER TABLE IF EXISTS ONLY public."AuditLog" DROP CONSTRAINT IF EXISTS "AuditLog_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."AuditLog" DROP CONSTRAINT IF EXISTS "AuditLog_deviceId_fkey";
DROP INDEX IF EXISTS public."VitalSigns_syncStatus_idx";
DROP INDEX IF EXISTS public."VitalSigns_patientId_idx";
DROP INDEX IF EXISTS public."VitalSigns_originDeviceId_idx";
DROP INDEX IF EXISTS public."VitalSigns_lastModifiedByDeviceId_idx";
DROP INDEX IF EXISTS public."VitalSigns_createdAt_idx";
DROP INDEX IF EXISTS public."VitalSigns_consultationId_idx";
DROP INDEX IF EXISTS public."User_status_idx";
DROP INDEX IF EXISTS public."User_role_idx";
DROP INDEX IF EXISTS public."User_lastName_firstName_idx";
DROP INDEX IF EXISTS public."User_email_key";
DROP INDEX IF EXISTS public."SyncQueue_status_priority_createdAt_idx";
DROP INDEX IF EXISTS public."SyncQueue_entity_entityId_idx";
DROP INDEX IF EXISTS public."SyncQueue_deviceId_idx";
DROP INDEX IF EXISTS public."Patient_syncStatus_idx";
DROP INDEX IF EXISTS public."Patient_originDeviceId_idx";
DROP INDEX IF EXISTS public."Patient_lastName_firstName_idx";
DROP INDEX IF EXISTS public."Patient_lastModified_idx";
DROP INDEX IF EXISTS public."Patient_lastModifiedByDeviceId_idx";
DROP INDEX IF EXISTS public."Patient_dui_key";
DROP INDEX IF EXISTS public."Patient_dui_idx";
DROP INDEX IF EXISTS public."Device_status_idx";
DROP INDEX IF EXISTS public."Device_serialNumber_key";
DROP INDEX IF EXISTS public."Device_serialNumber_idx";
DROP INDEX IF EXISTS public."Consultation_syncStatus_idx";
DROP INDEX IF EXISTS public."Consultation_status_idx";
DROP INDEX IF EXISTS public."Consultation_patientId_idx";
DROP INDEX IF EXISTS public."Consultation_originDeviceId_idx";
DROP INDEX IF EXISTS public."Consultation_lastModified_idx";
DROP INDEX IF EXISTS public."Consultation_lastModifiedByDeviceId_idx";
DROP INDEX IF EXISTS public."Consultation_doctorId_idx";
DROP INDEX IF EXISTS public."Consultation_brigadeId_idx";
DROP INDEX IF EXISTS public."ClinicalRecord_syncStatus_idx";
DROP INDEX IF EXISTS public."ClinicalRecord_patientId_key";
DROP INDEX IF EXISTS public."ClinicalRecord_originDeviceId_idx";
DROP INDEX IF EXISTS public."ClinicalRecord_lastModified_idx";
DROP INDEX IF EXISTS public."ClinicalRecord_lastModifiedByDeviceId_idx";
DROP INDEX IF EXISTS public."Brigade_syncStatus_idx";
DROP INDEX IF EXISTS public."Brigade_status_idx";
DROP INDEX IF EXISTS public."Brigade_originDeviceId_idx";
DROP INDEX IF EXISTS public."Brigade_lastModified_idx";
DROP INDEX IF EXISTS public."Brigade_lastModifiedByDeviceId_idx";
DROP INDEX IF EXISTS public."BrigadeMember_userId_brigadeId_key";
DROP INDEX IF EXISTS public."AuditLog_entity_entityId_idx";
DROP INDEX IF EXISTS public."AuditLog_createdAt_idx";
ALTER TABLE IF EXISTS ONLY public."VitalSigns" DROP CONSTRAINT IF EXISTS "VitalSigns_pkey";
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."SyncQueue" DROP CONSTRAINT IF EXISTS "SyncQueue_pkey";
ALTER TABLE IF EXISTS ONLY public."Patient" DROP CONSTRAINT IF EXISTS "Patient_pkey";
ALTER TABLE IF EXISTS ONLY public."Device" DROP CONSTRAINT IF EXISTS "Device_pkey";
ALTER TABLE IF EXISTS ONLY public."Consultation" DROP CONSTRAINT IF EXISTS "Consultation_pkey";
ALTER TABLE IF EXISTS ONLY public."ClinicalRecord" DROP CONSTRAINT IF EXISTS "ClinicalRecord_pkey";
ALTER TABLE IF EXISTS ONLY public."Brigade" DROP CONSTRAINT IF EXISTS "Brigade_pkey";
ALTER TABLE IF EXISTS ONLY public."BrigadeMember" DROP CONSTRAINT IF EXISTS "BrigadeMember_pkey";
ALTER TABLE IF EXISTS ONLY public."AuditLog" DROP CONSTRAINT IF EXISTS "AuditLog_pkey";
DROP TABLE IF EXISTS public."VitalSigns";
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."SyncQueue";
DROP TABLE IF EXISTS public."Patient";
DROP TABLE IF EXISTS public."Device";
DROP TABLE IF EXISTS public."Consultation";
DROP TABLE IF EXISTS public."ClinicalRecord";
DROP TABLE IF EXISTS public."BrigadeMember";
DROP TABLE IF EXISTS public."Brigade";
DROP TABLE IF EXISTS public."AuditLog";
DROP TYPE IF EXISTS public."UserStatus";
DROP TYPE IF EXISTS public."SyncStatus";
DROP TYPE IF EXISTS public."SyncOperation";
DROP TYPE IF EXISTS public."Sex";
DROP TYPE IF EXISTS public."Role";
DROP TYPE IF EXISTS public."QueueStatus";
DROP TYPE IF EXISTS public."QueuePriority";
DROP TYPE IF EXISTS public."DeviceStatus";
DROP TYPE IF EXISTS public."ConsultationStatus";
DROP TYPE IF EXISTS public."BrigadeStatus";
DROP TYPE IF EXISTS public."BloodType";
--
-- Name: BloodType; Type: TYPE; Schema: public; Owner: medicos_app
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


ALTER TYPE public."BloodType" OWNER TO medicos_app;

--
-- Name: BrigadeStatus; Type: TYPE; Schema: public; Owner: medicos_app
--

CREATE TYPE public."BrigadeStatus" AS ENUM (
    'PLANNED',
    'ACTIVE',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."BrigadeStatus" OWNER TO medicos_app;

--
-- Name: ConsultationStatus; Type: TYPE; Schema: public; Owner: medicos_app
--

CREATE TYPE public."ConsultationStatus" AS ENUM (
    'DRAFT',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."ConsultationStatus" OWNER TO medicos_app;

--
-- Name: DeviceStatus; Type: TYPE; Schema: public; Owner: medicos_app
--

CREATE TYPE public."DeviceStatus" AS ENUM (
    'ACTIVE',
    'OFFLINE',
    'BLOCKED',
    'RETIRED'
);


ALTER TYPE public."DeviceStatus" OWNER TO medicos_app;

--
-- Name: QueuePriority; Type: TYPE; Schema: public; Owner: medicos_app
--

CREATE TYPE public."QueuePriority" AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);


ALTER TYPE public."QueuePriority" OWNER TO medicos_app;

--
-- Name: QueueStatus; Type: TYPE; Schema: public; Owner: medicos_app
--

CREATE TYPE public."QueueStatus" AS ENUM (
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED'
);


ALTER TYPE public."QueueStatus" OWNER TO medicos_app;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: medicos_app
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'DOCTOR',
    'BRIGADISTA',
    'AUTHORITY',
    'PATIENT'
);


ALTER TYPE public."Role" OWNER TO medicos_app;

--
-- Name: Sex; Type: TYPE; Schema: public; Owner: medicos_app
--

CREATE TYPE public."Sex" AS ENUM (
    'MALE',
    'FEMALE',
    'OTHER'
);


ALTER TYPE public."Sex" OWNER TO medicos_app;

--
-- Name: SyncOperation; Type: TYPE; Schema: public; Owner: medicos_app
--

CREATE TYPE public."SyncOperation" AS ENUM (
    'CREATE',
    'UPDATE',
    'DELETE'
);


ALTER TYPE public."SyncOperation" OWNER TO medicos_app;

--
-- Name: SyncStatus; Type: TYPE; Schema: public; Owner: medicos_app
--

CREATE TYPE public."SyncStatus" AS ENUM (
    'PENDING',
    'SYNCED',
    'CONFLICT'
);


ALTER TYPE public."SyncStatus" OWNER TO medicos_app;

--
-- Name: UserStatus; Type: TYPE; Schema: public; Owner: medicos_app
--

CREATE TYPE public."UserStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED'
);


ALTER TYPE public."UserStatus" OWNER TO medicos_app;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: medicos_app
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


ALTER TABLE public."AuditLog" OWNER TO medicos_app;

--
-- Name: Brigade; Type: TABLE; Schema: public; Owner: medicos_app
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


ALTER TABLE public."Brigade" OWNER TO medicos_app;

--
-- Name: BrigadeMember; Type: TABLE; Schema: public; Owner: medicos_app
--

CREATE TABLE public."BrigadeMember" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "brigadeId" text NOT NULL,
    "joinedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."BrigadeMember" OWNER TO medicos_app;

--
-- Name: ClinicalRecord; Type: TABLE; Schema: public; Owner: medicos_app
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


ALTER TABLE public."ClinicalRecord" OWNER TO medicos_app;

--
-- Name: Consultation; Type: TABLE; Schema: public; Owner: medicos_app
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


ALTER TABLE public."Consultation" OWNER TO medicos_app;

--
-- Name: Device; Type: TABLE; Schema: public; Owner: medicos_app
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


ALTER TABLE public."Device" OWNER TO medicos_app;

--
-- Name: Patient; Type: TABLE; Schema: public; Owner: medicos_app
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


ALTER TABLE public."Patient" OWNER TO medicos_app;

--
-- Name: SyncQueue; Type: TABLE; Schema: public; Owner: medicos_app
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


ALTER TABLE public."SyncQueue" OWNER TO medicos_app;

--
-- Name: User; Type: TABLE; Schema: public; Owner: medicos_app
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


ALTER TABLE public."User" OWNER TO medicos_app;

--
-- Name: VitalSigns; Type: TABLE; Schema: public; Owner: medicos_app
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


ALTER TABLE public."VitalSigns" OWNER TO medicos_app;

--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: medicos_app
--

COPY public."AuditLog" (id, "userId", "deviceId", action, entity, "entityId", "changedFields", "ipAddress", "createdAt") FROM stdin;
\.


--
-- Data for Name: Brigade; Type: TABLE DATA; Schema: public; Owner: medicos_app
--

COPY public."Brigade" (id, name, department, municipality, latitude, longitude, status, "startDate", "endDate", "leaderId", "createdAt", "updatedAt", "deletedAt", "syncStatus", version, "originDeviceId", "lastModifiedByDeviceId", "lastModified") FROM stdin;
73a9b0b7-2968-47a9-9032-14dce7c84f34	Brigada Médica Morazán 2026	Morazán	San Francisco Gotera	13.6942	-88.1072	ACTIVE	2026-08-01 08:00:00	2026-08-30 17:00:00	73d3b137-05ef-4f09-9069-dbfc47abd5de	2026-08-12 15:20:58.982	2026-08-12 15:20:58.982	\N	PENDING	1	7153e78a-3747-4ad6-8192-2624a47b5f5a	7153e78a-3747-4ad6-8192-2624a47b5f5a	2026-08-12 15:20:58.982
\.


--
-- Data for Name: BrigadeMember; Type: TABLE DATA; Schema: public; Owner: medicos_app
--

COPY public."BrigadeMember" (id, "userId", "brigadeId", "joinedAt") FROM stdin;
f771b1a6-130c-4722-adeb-bc4e01db2371	e3df728a-6716-4c24-a22f-f7a8948dabdc	73a9b0b7-2968-47a9-9032-14dce7c84f34	2026-08-12 15:20:58.982
2c9a5dc3-6007-48c9-9815-b818f0d975c7	99d8bea6-750b-49de-8fb9-5cd2a7b1be6c	73a9b0b7-2968-47a9-9032-14dce7c84f34	2026-08-12 15:20:58.982
\.


--
-- Data for Name: ClinicalRecord; Type: TABLE DATA; Schema: public; Owner: medicos_app
--

COPY public."ClinicalRecord" (id, "patientId", "bloodType", "familyHistory", "surgicalHistory", observations, "createdAt", "updatedAt", "deletedAt", "syncStatus", version, "originDeviceId", "lastModifiedByDeviceId", "lastModified") FROM stdin;
69a610f5-1585-46a1-a35d-45cbbda76ab8	8257c791-ae63-4e61-9915-9040c0edc65c	O_POSITIVE	Diabetes Mellitus Tipo 2 (Madre)	Apendicectomía (2015)	Paciente no reporta alergias medicamentosas.	2026-08-12 15:20:58.994	2026-08-12 15:20:58.994	\N	PENDING	1	7153e78a-3747-4ad6-8192-2624a47b5f5a	7153e78a-3747-4ad6-8192-2624a47b5f5a	2026-08-12 15:20:58.994
\.


--
-- Data for Name: Consultation; Type: TABLE DATA; Schema: public; Owner: medicos_app
--

COPY public."Consultation" (id, "patientId", "doctorId", "clinicalRecordId", "brigadeId", status, "chiefComplaint", "physicalExam", "diagnosisCode", "diagnosisDesc", "treatmentPlan", "consultationDate", "followUpDate", "startedAt", "completedAt", "createdAt", "updatedAt", "deletedAt", "syncStatus", version, "originDeviceId", "lastModifiedByDeviceId", "lastModified") FROM stdin;
7085fc14-4e11-46ed-99fd-057c464b1c2a	8257c791-ae63-4e61-9915-9040c0edc65c	e3df728a-6716-4c24-a22f-f7a8948dabdc	69a610f5-1585-46a1-a35d-45cbbda76ab8	73a9b0b7-2968-47a9-9032-14dce7c84f34	COMPLETED	Cefalea frontal pulsátil de 3 días de evolución acompañada de fatiga.	Paciente normotensa, consciente, orientada en tiempo y espacio. Sin signos de focalización neurológica.	R51	Cefalea tensional primaria	Paracetamol 500mg cada 8 horas por 3 días. Reposo relativo e hidratación adecuada.	2026-08-12 15:20:59.001	\N	2026-08-12 15:20:59.001	2026-08-12 15:20:59.001	2026-08-12 15:20:59.003	2026-08-12 15:20:59.003	\N	PENDING	1	7153e78a-3747-4ad6-8192-2624a47b5f5a	7153e78a-3747-4ad6-8192-2624a47b5f5a	2026-08-12 15:20:59.003
\.


--
-- Data for Name: Device; Type: TABLE DATA; Schema: public; Owner: medicos_app
--

COPY public."Device" (id, name, "serialNumber", "operatingSystem", "appVersion", "publicKey", location, "lastSyncAt", status, "createdAt", "updatedAt", "deletedAt") FROM stdin;
7153e78a-3747-4ad6-8192-2624a47b5f5a	Servidor Central - MedicOS	DEV-CENTRAL-01	Ubuntu 24.04 LTS	1.0.0	\N	Sede Central	\N	ACTIVE	2026-08-12 15:20:58.875	2026-08-12 15:20:58.875	\N
\.


--
-- Data for Name: Patient; Type: TABLE DATA; Schema: public; Owner: medicos_app
--

COPY public."Patient" (id, "firstName", "lastName", "dateOfBirth", dui, sex, phone, address, "emergencyName", "emergencyPhone", "emergencyRelation", "createdAt", "updatedAt", "deletedAt", "syncStatus", version, "originDeviceId", "lastModifiedByDeviceId", "lastModified") FROM stdin;
8257c791-ae63-4e61-9915-9040c0edc65c	María	González	1985-05-15 00:00:00	01234567-8	FEMALE	+503 7123-4567	Caserío El Centro, Cantón El Jocote, Morazán	José González	+503 7234-5678	Esposo	2026-08-12 15:20:58.994	2026-08-12 15:20:58.994	\N	PENDING	1	7153e78a-3747-4ad6-8192-2624a47b5f5a	7153e78a-3747-4ad6-8192-2624a47b5f5a	2026-08-12 15:20:58.994
\.


--
-- Data for Name: SyncQueue; Type: TABLE DATA; Schema: public; Owner: medicos_app
--

COPY public."SyncQueue" (id, "deviceId", entity, "entityId", operation, payload, priority, status, "retryCount", "errorMessage", "createdAt", "syncedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: medicos_app
--

COPY public."User" (id, email, "passwordHash", role, status, "firstName", "lastName", phone, "createdAt", "updatedAt", "deletedAt") FROM stdin;
73d3b137-05ef-4f09-9069-dbfc47abd5de	admin@medicos.org	$2b$10$NSgA5m6E9fIUTBrZPwETcu5VE9ycXVR1nGZ2GuW.66l/09wmCnxCO	ADMIN	ACTIVE	Administrador	Central	+503 7000-0001	2026-08-12 15:20:58.955	2026-08-12 15:20:58.955	\N
e3df728a-6716-4c24-a22f-f7a8948dabdc	doctora.martinez@medicos.org	$2b$10$NSgA5m6E9fIUTBrZPwETcu5VE9ycXVR1nGZ2GuW.66l/09wmCnxCO	DOCTOR	ACTIVE	Elena	Martínez	+503 7000-0002	2026-08-12 15:20:58.961	2026-08-12 15:20:58.961	\N
99d8bea6-750b-49de-8fb9-5cd2a7b1be6c	brigadista.perez@medicos.org	$2b$10$NSgA5m6E9fIUTBrZPwETcu5VE9ycXVR1nGZ2GuW.66l/09wmCnxCO	BRIGADISTA	ACTIVE	Carlos	Pérez	+503 7000-0003	2026-08-12 15:20:58.966	2026-08-12 15:20:58.966	\N
\.


--
-- Data for Name: VitalSigns; Type: TABLE DATA; Schema: public; Owner: medicos_app
--

COPY public."VitalSigns" (id, "patientId", "consultationId", temperature, "heartRate", "oxygenSat", systolic, diastolic, weight, height, "createdAt", "updatedAt", "deletedAt", "syncStatus", version, "originDeviceId", "lastModifiedByDeviceId", "lastModified") FROM stdin;
0163f027-c014-4ca3-8436-ade0b7d8a411	8257c791-ae63-4e61-9915-9040c0edc65c	7085fc14-4e11-46ed-99fd-057c464b1c2a	36.6	75	98	120	80	62.5	1.6	2026-08-12 15:20:59.009	2026-08-12 15:20:59.009	\N	PENDING	1	7153e78a-3747-4ad6-8192-2624a47b5f5a	7153e78a-3747-4ad6-8192-2624a47b5f5a	2026-08-12 15:20:59.009
\.


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: medicos_app
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: BrigadeMember BrigadeMember_pkey; Type: CONSTRAINT; Schema: public; Owner: medicos_app
--

ALTER TABLE ONLY public."BrigadeMember"
    ADD CONSTRAINT "BrigadeMember_pkey" PRIMARY KEY (id);


--
-- Name: Brigade Brigade_pkey; Type: CONSTRAINT; Schema: public; Owner: medicos_app
--

ALTER TABLE ONLY public."Brigade"
    ADD CONSTRAINT "Brigade_pkey" PRIMARY KEY (id);


--
-- Name: ClinicalRecord ClinicalRecord_pkey; Type: CONSTRAINT; Schema: public; Owner: medicos_app
--

ALTER TABLE ONLY public."ClinicalRecord"
    ADD CONSTRAINT "ClinicalRecord_pkey" PRIMARY KEY (id);


--
-- Name: Consultation Consultation_pkey; Type: CONSTRAINT; Schema: public; Owner: medicos_app
--

ALTER TABLE ONLY public."Consultation"
    ADD CONSTRAINT "Consultation_pkey" PRIMARY KEY (id);


--
-- Name: Device Device_pkey; Type: CONSTRAINT; Schema: public; Owner: medicos_app
--

ALTER TABLE ONLY public."Device"
    ADD CONSTRAINT "Device_pkey" PRIMARY KEY (id);


--
-- Name: Patient Patient_pkey; Type: CONSTRAINT; Schema: public; Owner: medicos_app
--

ALTER TABLE ONLY public."Patient"
    ADD CONSTRAINT "Patient_pkey" PRIMARY KEY (id);


--
-- Name: SyncQueue SyncQueue_pkey; Type: CONSTRAINT; Schema: public; Owner: medicos_app
--

ALTER TABLE ONLY public."SyncQueue"
    ADD CONSTRAINT "SyncQueue_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: medicos_app
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: VitalSigns VitalSigns_pkey; Type: CONSTRAINT; Schema: public; Owner: medicos_app
--

ALTER TABLE ONLY public."VitalSigns"
    ADD CONSTRAINT "VitalSigns_pkey" PRIMARY KEY (id);


--
-- Name: AuditLog_createdAt_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "AuditLog_createdAt_idx" ON public."AuditLog" USING btree ("createdAt");


--
-- Name: AuditLog_entity_entityId_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "AuditLog_entity_entityId_idx" ON public."AuditLog" USING btree (entity, "entityId");


--
-- Name: BrigadeMember_userId_brigadeId_key; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE UNIQUE INDEX "BrigadeMember_userId_brigadeId_key" ON public."BrigadeMember" USING btree ("userId", "brigadeId");


--
-- Name: Brigade_lastModifiedByDeviceId_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "Brigade_lastModifiedByDeviceId_idx" ON public."Brigade" USING btree ("lastModifiedByDeviceId");


--
-- Name: Brigade_lastModified_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "Brigade_lastModified_idx" ON public."Brigade" USING btree ("lastModified");


--
-- Name: Brigade_originDeviceId_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "Brigade_originDeviceId_idx" ON public."Brigade" USING btree ("originDeviceId");


--
-- Name: Brigade_status_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "Brigade_status_idx" ON public."Brigade" USING btree (status);


--
-- Name: Brigade_syncStatus_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "Brigade_syncStatus_idx" ON public."Brigade" USING btree ("syncStatus");


--
-- Name: ClinicalRecord_lastModifiedByDeviceId_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "ClinicalRecord_lastModifiedByDeviceId_idx" ON public."ClinicalRecord" USING btree ("lastModifiedByDeviceId");


--
-- Name: ClinicalRecord_lastModified_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "ClinicalRecord_lastModified_idx" ON public."ClinicalRecord" USING btree ("lastModified");


--
-- Name: ClinicalRecord_originDeviceId_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "ClinicalRecord_originDeviceId_idx" ON public."ClinicalRecord" USING btree ("originDeviceId");


--
-- Name: ClinicalRecord_patientId_key; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE UNIQUE INDEX "ClinicalRecord_patientId_key" ON public."ClinicalRecord" USING btree ("patientId");


--
-- Name: ClinicalRecord_syncStatus_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "ClinicalRecord_syncStatus_idx" ON public."ClinicalRecord" USING btree ("syncStatus");


--
-- Name: Consultation_brigadeId_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "Consultation_brigadeId_idx" ON public."Consultation" USING btree ("brigadeId");


--
-- Name: Consultation_doctorId_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "Consultation_doctorId_idx" ON public."Consultation" USING btree ("doctorId");


--
-- Name: Consultation_lastModifiedByDeviceId_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "Consultation_lastModifiedByDeviceId_idx" ON public."Consultation" USING btree ("lastModifiedByDeviceId");


--
-- Name: Consultation_lastModified_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "Consultation_lastModified_idx" ON public."Consultation" USING btree ("lastModified");


--
-- Name: Consultation_originDeviceId_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "Consultation_originDeviceId_idx" ON public."Consultation" USING btree ("originDeviceId");


--
-- Name: Consultation_patientId_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "Consultation_patientId_idx" ON public."Consultation" USING btree ("patientId");


--
-- Name: Consultation_status_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "Consultation_status_idx" ON public."Consultation" USING btree (status);


--
-- Name: Consultation_syncStatus_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "Consultation_syncStatus_idx" ON public."Consultation" USING btree ("syncStatus");


--
-- Name: Device_serialNumber_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "Device_serialNumber_idx" ON public."Device" USING btree ("serialNumber");


--
-- Name: Device_serialNumber_key; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE UNIQUE INDEX "Device_serialNumber_key" ON public."Device" USING btree ("serialNumber");


--
-- Name: Device_status_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "Device_status_idx" ON public."Device" USING btree (status);


--
-- Name: Patient_dui_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "Patient_dui_idx" ON public."Patient" USING btree (dui);


--
-- Name: Patient_dui_key; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE UNIQUE INDEX "Patient_dui_key" ON public."Patient" USING btree (dui);


--
-- Name: Patient_lastModifiedByDeviceId_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "Patient_lastModifiedByDeviceId_idx" ON public."Patient" USING btree ("lastModifiedByDeviceId");


--
-- Name: Patient_lastModified_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "Patient_lastModified_idx" ON public."Patient" USING btree ("lastModified");


--
-- Name: Patient_lastName_firstName_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "Patient_lastName_firstName_idx" ON public."Patient" USING btree ("lastName", "firstName");


--
-- Name: Patient_originDeviceId_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "Patient_originDeviceId_idx" ON public."Patient" USING btree ("originDeviceId");


--
-- Name: Patient_syncStatus_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "Patient_syncStatus_idx" ON public."Patient" USING btree ("syncStatus");


--
-- Name: SyncQueue_deviceId_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "SyncQueue_deviceId_idx" ON public."SyncQueue" USING btree ("deviceId");


--
-- Name: SyncQueue_entity_entityId_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "SyncQueue_entity_entityId_idx" ON public."SyncQueue" USING btree (entity, "entityId");


--
-- Name: SyncQueue_status_priority_createdAt_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "SyncQueue_status_priority_createdAt_idx" ON public."SyncQueue" USING btree (status, priority, "createdAt");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_lastName_firstName_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "User_lastName_firstName_idx" ON public."User" USING btree ("lastName", "firstName");


--
-- Name: User_role_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "User_role_idx" ON public."User" USING btree (role);


--
-- Name: User_status_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "User_status_idx" ON public."User" USING btree (status);


--
-- Name: VitalSigns_consultationId_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "VitalSigns_consultationId_idx" ON public."VitalSigns" USING btree ("consultationId");


--
-- Name: VitalSigns_createdAt_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "VitalSigns_createdAt_idx" ON public."VitalSigns" USING btree ("createdAt");


--
-- Name: VitalSigns_lastModifiedByDeviceId_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "VitalSigns_lastModifiedByDeviceId_idx" ON public."VitalSigns" USING btree ("lastModifiedByDeviceId");


--
-- Name: VitalSigns_originDeviceId_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "VitalSigns_originDeviceId_idx" ON public."VitalSigns" USING btree ("originDeviceId");


--
-- Name: VitalSigns_patientId_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "VitalSigns_patientId_idx" ON public."VitalSigns" USING btree ("patientId");


--
-- Name: VitalSigns_syncStatus_idx; Type: INDEX; Schema: public; Owner: medicos_app
--

CREATE INDEX "VitalSigns_syncStatus_idx" ON public."VitalSigns" USING btree ("syncStatus");


--
-- Name: AuditLog AuditLog_deviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: medicos_app
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES public."Device"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: AuditLog AuditLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: medicos_app
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: BrigadeMember BrigadeMember_brigadeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: medicos_app
--

ALTER TABLE ONLY public."BrigadeMember"
    ADD CONSTRAINT "BrigadeMember_brigadeId_fkey" FOREIGN KEY ("brigadeId") REFERENCES public."Brigade"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BrigadeMember BrigadeMember_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: medicos_app
--

ALTER TABLE ONLY public."BrigadeMember"
    ADD CONSTRAINT "BrigadeMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Brigade Brigade_leaderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: medicos_app
--

ALTER TABLE ONLY public."Brigade"
    ADD CONSTRAINT "Brigade_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ClinicalRecord ClinicalRecord_patientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: medicos_app
--

ALTER TABLE ONLY public."ClinicalRecord"
    ADD CONSTRAINT "ClinicalRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES public."Patient"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Consultation Consultation_brigadeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: medicos_app
--

ALTER TABLE ONLY public."Consultation"
    ADD CONSTRAINT "Consultation_brigadeId_fkey" FOREIGN KEY ("brigadeId") REFERENCES public."Brigade"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Consultation Consultation_clinicalRecordId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: medicos_app
--

ALTER TABLE ONLY public."Consultation"
    ADD CONSTRAINT "Consultation_clinicalRecordId_fkey" FOREIGN KEY ("clinicalRecordId") REFERENCES public."ClinicalRecord"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Consultation Consultation_doctorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: medicos_app
--

ALTER TABLE ONLY public."Consultation"
    ADD CONSTRAINT "Consultation_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Consultation Consultation_patientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: medicos_app
--

ALTER TABLE ONLY public."Consultation"
    ADD CONSTRAINT "Consultation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES public."Patient"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SyncQueue SyncQueue_deviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: medicos_app
--

ALTER TABLE ONLY public."SyncQueue"
    ADD CONSTRAINT "SyncQueue_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES public."Device"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: VitalSigns VitalSigns_consultationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: medicos_app
--

ALTER TABLE ONLY public."VitalSigns"
    ADD CONSTRAINT "VitalSigns_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES public."Consultation"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: VitalSigns VitalSigns_patientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: medicos_app
--

ALTER TABLE ONLY public."VitalSigns"
    ADD CONSTRAINT "VitalSigns_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES public."Patient"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict K0nGrx8zaTmn3YkvtmEdq26PQLVGz0LpNLW14Pjbc2KE7KfYF0HwN92K95IC1B7

