# UI/UX Standards

## 1. Source of Truth

- Figma Make is the source of truth for:
  - Layouts and navigation.
  - Visual styles (colors, typography, spacing).
  - Component patterns.

## 2. Design Tokens

- All visual values are derived from tokens defined in:
  - Figma library.
  - `frontend/src/theme/tokens.ts` (mirror of Figma tokens).

If a token is missing, add it to `tokens.ts` and ensure Figma is updated rather than hardcoding one-off values.

## 3. Component Library

- Base components live in `frontend/src/components/ui`.
- Feature components live in `frontend/src/components/features/<feature>`.
- Mapping from Figma components to React components is documented in `docs/figma-component-mapping.md`.

## 4. Workflow with Devin

1. Provide Figma links for the relevant flow.
2. Devin:
   - Lists required components.
   - Maps them to existing React components.
   - Describes layout and breakpoints.
3. After review, Devin implements using only approved components and tokens.
4. Any deviations from Figma must be explicitly listed in the PR description.
