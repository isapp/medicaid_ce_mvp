# Medicaid Community Engagement POC

The project is structured as a **React + TypeScript** frontend and a **Node.js + TypeScript** backend, with a Postgres database and a dedicated integrations layer for third-party providers (employment verification, messaging, etc.).

## Monorepo Layout

- `frontend/` – React + TypeScript SPA aligned to Figma designs
- `backend/` – Node.js + TypeScript API server
- `docs/` – Architecture, standards, and integration strategy
- `infra/` – Infrastructure-as-code starter (Terraform notes, etc.)
- `docker-compose.yml` – Simple local dev orchestration

## Getting Started

1. Install dependencies:

   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. Start Postgres + services (optional, for Docker-based local dev):

   ```bash
   docker-compose up --build
   ```

3. Start frontend locally:

   ```bash
   cd frontend
   npm run dev
   ```

4. Start backend locally:

   ```bash
   cd backend
   npm run dev
   ```

