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

## Initial Git Setup

To turn this into a GitHub repo:

```bash
cd medicaid_ce_repo   # adjust to your extracted folder name
git init
git add .
git commit -m "Initial commit: Medicaid Community Engagement POC scaffold"
git branch -M main
git remote add origin git@github.com:<your-org>/<your-repo>.git
git push -u origin main
```

After that, you can point Devin at this repo and use the docs in `docs/` as its guardrails.
