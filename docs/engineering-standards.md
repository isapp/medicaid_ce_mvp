# Engineering Standards

These apply to all code in this POC, including code written by Devin.

## 1. General Principles

1. Prefer clarity and simplicity over cleverness.
2. Keep domain logic in services, not controllers or UI.
3. Use TypeScript everywhere (no untyped JS).
4. Figma + architecture docs are authoritative; do not invent new patterns silently.

## 2. Frontend Standards

- React + TypeScript only.
- Use components from `src/components/ui` and the shared `theme` file.
- No arbitrary hex colors or magic spacing values; use tokens.
- Use a centralized API client in `src/api/client.ts` instead of calling `fetch` directly.
- Feature-specific components live in `src/components/features/<feature>`.

## 3. Backend Standards

- Organize code by domain module (`src/modules`) and shared utilities (`src/shared`, `src/integrations`).
- Controllers (route handlers):
  - Validate input.
  - Call services.
  - Map domain errors to HTTP responses.
- Domain services:
  - Contain business rules.
  - Use repositories/ORM for data access.
- All queries are filtered by `tenant_id` where applicable.

## 4. Integrations

- All third-party logic lives in `src/integrations/<vendor>`.
- Domain services rely on interfaces (e.g., `EmploymentVerificationProvider`).
- Webhooks are terminated in `/webhooks/<vendor>/<type>` endpoints and normalized to internal events.
- No hardcoded secrets or API keys in code.

## 5. Testing

- Aim for:
  - Unit tests for domain services.
  - Integration tests for API endpoints (happy path + main failure modes).
- No tests should call live third-party services.
- Where DB is used in tests, use a dedicated test DB or in-memory substitute.

## 6. Config & Secrets

- All config from environment variables via `src/shared/config.ts`.
- App should fail fast on missing required config at startup.
- Secrets stored in environment or secret management, never in source.

## 7. Logging & Observability

- Use a shared logger module with structured logs.
- Include request ID, user ID, tenant ID, and operation name as standard fields.
- Never log secrets or sensitive PII.

## 8. Workflow with Devin

1. Provide Devin with:
   - `docs/architecture.md`
   - `docs/engineering-standards.md`
   - `docs/ui-ux-standards.md`
   - `docs/integrations-strategy.md`
   - Relevant Figma links
2. Ask Devin to:
   - Summarize the change.
   - Propose a design (what modules, endpoints, and models will change).
3. Only then should Devin:
   - Make small, incremental code changes.
   - Ensure `npm run lint`, `npm run typecheck`, and tests pass.
4. Devin should update documentation (API contracts and/or ADRs) if decisions change.
