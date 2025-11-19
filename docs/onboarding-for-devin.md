# Onboarding Devin (AI Agent) for this POC

## Goal

Ensure Devin consistently follows architecture, engineering, and UI/UX standards when writing code.

## Steps

1. Provide Devin with:
   - `docs/architecture.md`
   - `docs/engineering-standards.md`
   - `docs/ui-ux-standards.md`
   - `docs/integrations-strategy.md`
   - `docs/api-contracts.md`
   - Relevant Figma links

2. Ask Devin to:
   - Summarize requirements.
   - Propose a brief design:
     - Which modules will change.
     - What endpoints and data models will be added/modified.
     - How Figma components will map to React components.

3. Approve or adjust the design.

4. Ask Devin to implement in **small steps**, ensuring each step:
   - Compiles and passes `lint`, `typecheck`, and tests.
   - Updates or creates tests.
   - Updates docs where appropriate.

5. Review Devin's PRs (yourself or with another AI assistant) for:
   - Adherence to architecture.
   - Multi-tenancy and security.
   - Integration boundaries and error handling.
