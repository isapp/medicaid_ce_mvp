# Integrations Strategy (Medicaid Community Engagement POC)

## 1. Overview

This POC integrates with third-party systems, such as:

- Employment verification providers.
- State eligibility/back-office systems.
- Messaging providers (SMS/email).
- Document exchange/upload services.

The goal is to keep integrations **modular** and **replaceable**.

## 2. Architectural Approach

- All integrations live in `backend/src/integrations/<vendor>`.
- Each integration should include:
  - A **client** module for HTTP/API calls.
  - A **mapper** to normalize payloads.
  - A **service** implementing domain interfaces (e.g., `EmploymentVerificationProvider`).
  - **Webhook handlers** for inbound vendor events (if applicable).

## 3. Domain Isolation

Domain code does not know about vendors. It knows only about interfaces like:

- `EmploymentVerificationProvider`
- `MessagingProvider`
- `DocumentExchangeProvider`

Concrete vendor implementations are injected where needed.

## 4. Configuration

- Global config from environment variables.
- Per-tenant config stored in `integrations` table with JSON `config`.
- No secrets or keys hardcoded in code.

## 5. Error Handling

- Do not expose raw vendor errors to the client.
- Log vendor error detail internally (sanitized).
- Wrap vendor issues in domain-level error codes, e.g.:
  - `EMPLOYMENT_VERIFICATION_UNAVAILABLE`
  - `MESSAGING_PROVIDER_ERROR`

## 6. Security

- All vendor API calls over TLS.
- API keys encrypted at rest.
- Webhooks:
  - Validate signatures (if supported).
  - Enforce IP allowlists (where possible).
  - Validate JSON schema.

## 7. Adding a New Vendor

1. Create `backend/src/integrations/<vendor>`.
2. Implement required provider interface(s).
3. Add config schema and wiring to `integrations` table.
4. Add webhook handlers if required.
5. Add tests:
   - Client tests (request/response).
   - Mapping tests.
   - Webhook tests.
6. Document new endpoints or flows in `docs/api-contracts.md` and an ADR.
