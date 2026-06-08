# Software Requirements Specification (SRS)

## Project: CuraGenie
## Version: 1.0
## Date: 2026-02-24
## Prepared By: GitHub Copilot (GPT-5.3-Codex)

---

## 1. Introduction

### 1.1 Purpose
This document defines the software requirements for **CuraGenie**, an AI-powered healthcare platform for genomic analysis, MRI analysis, risk scoring, and user-facing clinical insights.

### 1.2 Scope
CuraGenie provides:
- Genomic file ingestion and processing (VCF/FASTQ)
- Polygenic Risk Score (PRS) generation and retrieval
- MRI image analysis workflows
- AI chatbot for genomics-oriented educational guidance
- Timeline, dashboard, reports, and profile management features
- Web frontend for patients and healthcare workflows

### 1.3 Intended Audience
- Product owners and stakeholders
- Backend and frontend developers
- QA and test engineers
- DevOps/SRE teams
- Security and compliance reviewers

### 1.4 Definitions and Acronyms
- **PRS**: Polygenic Risk Score
- **VCF**: Variant Call Format
- **FASTQ**: Sequencing read format
- **API**: Application Programming Interface
- **JWT**: JSON Web Token
- **LLM**: Large Language Model
- **PHI**: Protected Health Information

---

## 2. Overall Description

### 2.1 Product Perspective
CuraGenie is a distributed web platform with:
- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Backend**: FastAPI + Python
- **Data Layer**: SQLite (current), PostgreSQL-ready
- **Async/Workers**: Celery + Redis
- **Containerization**: Docker/Docker Compose

### 2.2 Product Functions (High Level)
- User authentication and session workflows
- Genomic upload, parsing, variant storage, PRS analysis
- MRI upload and analysis status/result retrieval
- Clinical timeline and dashboard summarization
- Health report generation and retrieval
- AI chatbot interactions with optional genomic context
- Profile and medical history management

### 2.3 User Classes
- **Patient**: Uploads files, views analyses, receives recommendations/reports, uses chatbot
- **Doctor**: Accesses relevant patient-facing and clinical views (role model present)
- **Admin**: Operational/admin-level access (role model present)

### 2.4 Operating Environment
- Windows/Linux/macOS for development
- Dockerized deployment for production-like environments
- Browser clients (Chrome/Firefox/Edge/Safari)

### 2.5 Constraints
- Certain endpoints/features are marked partial or placeholder in code (see Section 4.12)
- ML and enhanced MRI routes are environment-gated (`ENABLE_ML`, `ENABLE_ENHANCED_MRI`)
- LLM provider behavior depends on configured provider/API keys

### 2.6 Assumptions and Dependencies
- Network connectivity to backend from frontend
- Required environment variables and secrets are configured
- Redis available when Celery flows are enabled
- Storage paths for uploads are writable

---

## 3. External Interface Requirements

### 3.1 User Interfaces
- Web-based responsive UI with major pages:
  - Landing/home
  - Login/Register
  - Dashboard
  - Visualizations
  - Chatbot
  - Reports
  - Privacy policy
  - Doctor dashboard
- Debug pages available for backend/auth/upload diagnostics

### 3.2 Software Interfaces
- FastAPI REST endpoints under `/api/*`
- WebSocket endpoint: `/ws/{user_id}`
- Optional Supabase signed upload integration (`/api/upload/supabase/presign`)
- Optional external LLM providers: OpenAI, Anthropic, Ollama

### 3.3 Communication Interfaces
- HTTP/HTTPS for API and frontend traffic
- WebSocket for realtime user-scoped messaging

---

## 4. Functional Requirements

### 4.1 Authentication & Account Management
- **FR-AUTH-001**: System shall allow user registration with unique email and username.
- **FR-AUTH-002**: System shall store password as hashed password in DB-backed auth flow.
- **FR-AUTH-003**: System shall issue JWT token on successful login (DB-backed API flow).
- **FR-AUTH-004**: System shall provide `GET /api/auth/me` for current user profile.
- **FR-AUTH-005**: System shall provide logout endpoint (`POST /api/auth/logout`).
- **FR-AUTH-006**: System shall support change-password operation for authenticated users.
- **FR-AUTH-007**: System shall support account deactivation via delete-account endpoint.
- **FR-AUTH-008**: System should support social auth token exchange (`/api/auth/social-auth`).
- **FR-AUTH-009**: System shall provide forgot-password request endpoint.
- **FR-AUTH-010**: System shall expose reset/verify/resend endpoints even if implementation is partial.

### 4.2 Genomic File Upload & Processing
- **FR-GEN-001**: System shall accept genomic uploads (VCF/VCF.GZ/FASTQ/FQ and gzip variants).
- **FR-GEN-002**: System shall reject unsupported extensions with clear validation errors.
- **FR-GEN-003**: System shall persist upload metadata and processing status.
- **FR-GEN-004**: System shall trigger background processing for accepted files.
- **FR-GEN-005**: System shall create timeline events for upload and analysis milestones.
- **FR-GEN-006**: System shall provide user genomic upload retrieval APIs.
- **FR-GEN-007**: System shall support authenticated and test upload paths.

### 4.3 Variant Extraction & Genome Browser Data
- **FR-VAR-001**: System shall parse and store genomic variant entries from processed VCF data.
- **FR-VAR-002**: System shall expose variant retrieval endpoint by user with optional region filtering.
- **FR-VAR-003**: System shall expose genome-browser optimized aggregate response (summary + chart data).
- **FR-VAR-004**: System should deduplicate variants for browser visualization responses.

### 4.4 PRS Calculation & Access
- **FR-PRS-001**: System shall calculate disease-specific PRS values from processed genomic data.
- **FR-PRS-002**: System shall persist PRS results with disease type, score, and timestamps.
- **FR-PRS-003**: System shall expose PRS retrieval by user, genomic data id, and PRS id.
- **FR-PRS-004**: System shall support queue-based PRS calculation requests (`/api/prs/calculate`).
- **FR-PRS-005**: System should expose “latest PRS per disease” direct endpoint for dashboard use.

### 4.5 Dashboard, Timeline, and Stats
- **FR-DASH-001**: System shall return dashboard stats indicating data availability and risk metrics.
- **FR-DASH-002**: System shall provide timeline endpoint containing upload/analysis milestones.
- **FR-DASH-003**: System shall return welcome/onboarding event when no user events exist.

### 4.6 MRI Analysis
- **FR-MRI-001**: System shall accept MRI image uploads via `/api/mri/upload` and related endpoints.
- **FR-MRI-002**: System shall validate image format/dimensions before analysis.
- **FR-MRI-003**: System shall store MRI analysis records with status lifecycle (processing/analyzing/completed/failed).
- **FR-MRI-004**: System shall expose MRI analysis retrieval endpoints by analysis id and user id.
- **FR-MRI-005**: System should provide debug/test MRI routes for validation workflows.

### 4.7 AI Chatbot
- **FR-CHAT-001**: System shall accept chat requests including `user_id` and `message`.
- **FR-CHAT-002**: System shall generate responses through configured LLM provider.
- **FR-CHAT-003**: System shall support provider fallback behavior when provider init fails.
- **FR-CHAT-004**: System shall expose chatbot health and user context endpoints.
- **FR-CHAT-005**: Chat responses shall be positioned as educational and non-diagnostic guidance.

### 4.8 Reports
- **FR-REP-001**: System shall support report generation request for selected genomic data.
- **FR-REP-002**: System shall allow users to list their generated reports.
- **FR-REP-003**: System shall allow users to fetch report detail by id.
- **FR-REP-004**: System shall support report download endpoint (JSON currently guaranteed).
- **FR-REP-005**: System shall allow users to delete owned reports.
- **FR-REP-006**: System should provide instant report generation path.

### 4.9 Profile & Medical History
- **FR-PROF-001**: System shall return authenticated user profile with patient details.
- **FR-PROF-002**: System shall allow update of patient profile fields.
- **FR-PROF-003**: System shall support avatar upload with image extension validation.
- **FR-PROF-004**: System shall provide dashboard aggregation for uploads/PRS history.
- **FR-PROF-005**: System shall allow listing and deleting user uploads.
- **FR-PROF-006**: System shall provide medical-history view combining profile, uploads, PRS and timeline.

### 4.10 Realtime
- **FR-RT-001**: System shall accept WebSocket connections at `/ws/{user_id}`.
- **FR-RT-002**: System shall maintain active connection map and report active count via health endpoint.
- **FR-RT-003**: System shall send user-scoped JSON messages over WebSocket channel.

### 4.11 Frontend Functional Requirements
- **FR-FE-001**: Frontend shall provide login/register workflows integrated with `/api/auth/*`.
- **FR-FE-002**: Frontend shall provide dashboard with upload, PRS display, recommendations, and stats.
- **FR-FE-003**: Frontend shall provide visualizations for MRI, genomics, timeline, and genome browser.
- **FR-FE-004**: Frontend shall provide reports page with report readiness and download actions.
- **FR-FE-005**: Frontend shall provide chatbot page and conversational UI.
- **FR-FE-006**: Frontend shall use configurable API base URL via `NEXT_PUBLIC_API_URL`.

### 4.12 Known Functional Gaps / Partial Implementations
- **FR-GAP-001**: Password reset token verification is exposed but not fully implemented.
- **FR-GAP-002**: Some report formats (PDF/HTML) are referenced but JSON is currently guaranteed.
- **FR-GAP-003**: Certain local/test/direct endpoints coexist with production-style routes and may differ in auth behavior.

---

## 5. Data Requirements

### 5.1 Core Entities
- `users` (id, email, username, role, active/verified flags)
- `patient_profiles` (demographic and medical profile fields)
- `genomic_data` / `uploaded_files` (file metadata + processing state)
- `prs_scores` (disease score outputs)
- `genomic_variants` (variant-level extracted data)
- `mri_analyses` (analysis result/status)
- `medical_reports` (report metadata + payload)
- `timeline_events` (user event chronology)

### 5.2 Data Retention (Baseline)
- Uploads and generated records are persisted in DB/storage until explicitly removed or operational cleanup occurs.
- User-initiated deletion is supported for some resources (e.g., uploads/reports).

### 5.3 Data Integrity
- Unique constraints: email and username.
- Foreign key relationships in SQLAlchemy/SQLite schemas.
- Validation checks for file type and image/file parsing.

---

## 6. Non-Functional Requirements

### 6.1 Performance
- **NFR-PERF-001**: API should respond to health and simple data endpoints within acceptable interactive latency (target: sub-second under nominal local load).
- **NFR-PERF-002**: Long-running analysis tasks shall run asynchronously where implemented.
- **NFR-PERF-003**: Frontend build shall support production optimization (`next build`).

### 6.2 Reliability & Availability
- **NFR-REL-001**: Health endpoints shall expose service health for backend and frontend.
- **NFR-REL-002**: Services shall support restart policies in container orchestration (`unless-stopped`).
- **NFR-REL-003**: Background worker dependencies (Redis, DB) shall be health-checked in compose deployment.

### 6.3 Security
- **NFR-SEC-001**: Authentication tokens shall be required on protected API routes.
- **NFR-SEC-002**: Passwords shall be hashed in DB-backed auth.
- **NFR-SEC-003**: Secrets/keys shall be injected via environment variables.
- **NFR-SEC-004**: CORS shall be configurable by environment.
- **NFR-SEC-005**: Uploads shall be extension-validated.

### 6.4 Scalability
- **NFR-SCAL-001**: Architecture shall support horizontal decomposition (frontend, backend, worker, redis, db).
- **NFR-SCAL-002**: Queue-based tasks (Celery) shall support asynchronous scaling.

### 6.5 Maintainability
- **NFR-MAIN-001**: Codebase shall remain modular across `api`, `core`, `db`, `schemas`, `services`.
- **NFR-MAIN-002**: API docs shall remain available via FastAPI docs endpoints.
- **NFR-MAIN-003**: Environment-driven configuration shall be centralized in config modules and compose env blocks.

### 6.6 Compatibility
- **NFR-COMP-001**: Frontend shall run on modern browsers.
- **NFR-COMP-002**: Backend shall run on Python 3.9+ class runtime stack as documented.

### 6.7 Compliance & Medical Safety Positioning
- **NFR-COMP-REG-001**: System messaging shall include educational/research-use disclaimers.
- **NFR-COMP-REG-002**: AI outputs shall not be positioned as definitive medical diagnosis.

---

## 7. Deployment Requirements

### 7.1 Local/Dev Deployment
- Backend: FastAPI/uvicorn
- Frontend: Next.js
- Optional all-in-one startup scripts and compose

### 7.2 Containerized Deployment
- Services: `frontend`, `backend`, `worker`, `redis` (+ `postgres` in prod compose)
- Health checks must be configured for service readiness.

### 7.3 Environment Variables (Minimum)
- Frontend: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_WS_URL`
- Backend: `DATABASE_URL` or `DATABASE_PATH`, `SECRET_KEY`, CORS settings, upload limits, LLM keys as required
- Worker/Broker: Redis and Celery URLs

---

## 8. Verification and Acceptance Criteria

### 8.1 Functional Acceptance
- User can register/login and access dashboard.
- User can upload valid genomic file and observe processing lifecycle.
- User can view PRS scores and timeline entries.
- User can access visualizations and genome browser data.
- User can initiate chatbot interaction and receive response.
- User can request and retrieve reports.

### 8.2 Non-Functional Acceptance
- Health checks report healthy status in deployed setup.
- Core pages load without blocking errors.
- Configurable API base URL works across environments.

---

## 9. Traceability (Specs Sources Used)

This SRS is derived from analyzed repository specifications and implementation, including:
- `README.md`
- `DEPLOYMENT_GUIDE.md`
- `LOCAL_TESTING_GUIDE.md`
- `TESTING_RESULTS.md`
- `FRONTEND_ENDPOINT_ANALYSIS.md`
- `CLEANUP_SUMMARY.md`
- `backend/main.py`
- `backend/app.py`
- `backend/api/*.py`
- `backend/db/models.py`
- `backend/db/auth_models.py`
- `backend/core/config.py`
- `backend/core/llm_service.py`
- `backend/requirements.txt`
- `frontend/package.json`
- `frontend/src/app/**/page.tsx`
- `frontend/src/store/auth-store.ts`
- `docker-compose.yml`
- `docker-compose.prod.yml`

---

## 10. Open Items for Next Revision

1. Finalize password reset token flow implementation and acceptance tests.
2. Standardize and deprecate duplicate/direct/test endpoints where applicable.
3. Add explicit SLA/SLO targets (latency, uptime, error budgets).
4. Define retention, encryption-at-rest, and audit logging policy for production compliance.
5. Add role-based access matrix across all endpoints and UI routes.
