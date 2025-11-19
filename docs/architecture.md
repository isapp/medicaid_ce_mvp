# Architecture Overview (Medicaid Community Engagement POC)

## 1. System Summary

This POC is a multi-tenant SaaS application for **Medicaid Community Engagement**. It helps case workers and beneficiaries track engagement activities (e.g., employment, training, volunteering), verify information with third parties, and send reminders and notifications.

- **Frontend**: React + TypeScript SPA aligned with a Figma Make design system.
- **Backend**: Node.js + TypeScript, modularized by domain.
- **API**: REST JSON under `/api/v1`.
- **Database**: PostgreSQL.
- **Infra**: Containerized services (Docker) with a path to ECS/Fargate or similar.
- **Integrations**: Pluggable integrations for employment verification, messaging (SMS/email), and document exchange.

The architecture is designed to be:
- Simple enough for a POC.
- Opinionated enough to guide Devin.
- Extensible enough to plug in additional third-party apps later.

## 2. High-Level Components

### 2.1 Frontend

- React + TypeScript SPA.
- Uses a component library that mirrors Figma Make components.
- Fetches data via a shared API client targeting `/api/v1/...`.
- Multi-tenant context derived from authenticated user.

### 2.2 Backend

- Node.js + TypeScript, organized as:

```text
/backend
  /src
    /modules
      /auth
      /tenant
      /beneficiaries
      /engagement
    /integrations
      /employment
      /messaging
    /shared
      config/
      logging/
      errors/
      db/
  tsconfig.json
```

- Controllers/route handlers are thin: they validate, call services, and format responses.
- Domain logic lives in services within `modules/*`.
- Data access is via an ORM/repository layer only.

### 2.3 Integrations Layer

- All third-party vendors (employment verification, messaging, etc.) live under `src/integrations`.
- Each integration follows an adapter pattern:
  - **Client** (raw HTTP/API calls)
  - **Mapper** (normalize vendor payloads)
  - **Service** (implements a domain-facing interface, e.g., `EmploymentVerificationProvider`)
  - **Webhook handlers** for inbound events

Domain modules depend on internal interfaces, not on vendor-specific implementations.

## 3. Multi-Tenancy Model

- Each tenant (e.g., state agency or sub-organization) has a `tenant_id`.
- Every row of tenant-owned data includes a `tenant_id`.
- All queries must filter by `tenant_id` via repository/ORM to avoid cross-tenant leakage.
- Integration configuration is also tenant-scoped.

Example `integrations` table:

```sql
CREATE TABLE integrations (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  type text NOT NULL, -- e.g. 'employment', 'messaging'
  vendor text NOT NULL, -- e.g. 'vendor_x'
  status text NOT NULL, -- e.g. 'connected', 'disconnected'
  config jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## 4. API Design

- Versioned API under `/api/v1`.
- JSON request and response bodies.
- Standard response envelope:

```json
{
  "data": { },
  "error": {
    "code": "OPTIONAL_ERROR_CODE",
    "message": "Optional message"
  }
}
```

- Validation at the boundary using schema validation (e.g., Zod).
- Authentication via JWT, tenancy derived from the authenticated user.

## 5. UI/UX and Figma

- Figma Make is the source of truth for:
  - Colors, typography, spacing
  - Components (buttons, inputs, cards, navigation)
  - Layouts for key flows (beneficiary overview, engagement logging, messaging)

The frontend maps Figma components to React components in `frontend/src/components/ui`. New UI features follow this workflow:

1. Product/design define or update Figma flows.
2. Devin reviews Figma and maps screens → components → React implementation.
3. Deviations from Figma are explicitly documented and justified.

## 6. Extensibility and Third-Party Apps

The system supports multiple third-party “apps” per tenant:

- Integrations are modeled as first-class records in `integrations` table.
- Outgoing domain events (e.g., `ENGAGEMENT_ACTIVITY_RECORDED`, `BENEFICIARY_STATUS_CHANGED`) can be hooked to vendor-specific behavior.
- Adding a new vendor involves implementing an interface in `src/integrations`, not altering core domain logic.

## 7. Observability

- Centralized logging (structured logs) with:
  - request ID
  - user ID
  - tenant ID
  - operation name
  - success/failure
- Metrics collection hooks can be added later without modifying business logic.
