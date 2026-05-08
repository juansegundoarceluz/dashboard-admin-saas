# Admin Dashboard SaaS

A multi-tenant project management dashboard built as a portfolio piece to demonstrate full-stack development with modern tooling and security best practices.

> Status: in active development — see Roadmap below.

## Demo

_Live demo: coming soon (deployment in progress)_

_Screenshots:_

```
[Add screenshots here once deployed: login, dashboard, create/delete project]
```

## Tech stack

**Frontend**
- React 19 with TypeScript
- Vite 8 for dev server and bundling
- Tailwind CSS v4 with design tokens
- React Router v7 for client-side routing
- TanStack Query v5 for server state, caching, and request deduplication
- React Hook Form + Zod for declarative form validation
- Custom React Context + hook (`useAuth`) for authentication state

**Backend**
- Node.js + Express 5
- Prisma ORM with PostgreSQL
- bcrypt for password hashing
- jsonwebtoken (JWT) for stateless authentication
- dotenv with fail-fast validation for environment variables

**Architecture**
- Monorepo with `crm-saas-frontend/` and `crm-saas-backend/`
- Layered backend (routes → controllers → services → Prisma)
- Schema-driven validation (Zod schemas as single source of truth for types)

## Features

- Email/password authentication with JWT
- Protected routes with redirect-after-login
- Project CRUD scoped per user (defense in depth)
- Confirmation dialog for destructive actions
- Dark-themed dashboard with metric cards
- Responsive composition with reusable components
- Cache invalidation on mutations (no manual UI refreshes)
- Cross-tab auth synchronization via the `storage` event

## Project structure

```
dashboard-admin/
├── crm-saas-backend/
│   ├── prisma/
│   │   └── schema.prisma          # User, Project, Task models
│   └── src/
│       ├── config/                # env validation, prisma client
│       ├── controllers/           # HTTP layer
│       ├── services/              # Business logic
│       ├── routes/                # Express router wiring
│       ├── middlewares/           # auth, etc
│       └── server.js
└── crm-saas-frontend/
    └── src/
        ├── auth/                  # AuthContext, AuthProvider, useAuth, ProtectedRoute
        ├── components/dashboard/  # Sidebar, TopBar, MetricCard, etc
        ├── hooks/                 # useProjects, useCreateProject, useDeleteProject
        ├── lib/                   # env validation
        ├── pages/                 # Login, Register, Dashboard
        ├── schemas/               # Zod schemas (auth, project)
        └── types/                 # Shared TypeScript types
```

## Getting started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+ (local or hosted — Neon, Supabase, Railway all work)
- npm

### Backend setup

```bash
cd crm-saas-backend
npm install

# Create .env from the template and fill in real values
cp .env.example .env
# Edit .env: set DATABASE_URL and JWT_SECRET (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Apply migrations to your database
npx prisma migrate dev

# Start the dev server
npm run dev
# Server runs on http://localhost:3001
```

### Frontend setup

```bash
cd crm-saas-frontend
npm install

# Create .env.local from the template
cp .env.example .env.local
# Edit .env.local: VITE_API_URL=http://localhost:3001/api

# Start the dev server
npm run dev
# App runs on http://localhost:5173
```

## Environment variables

### Backend (`.env`)

| Variable        | Required | Description                                   |
|-----------------|----------|-----------------------------------------------|
| `DATABASE_URL`  | Yes      | PostgreSQL connection string                  |
| `JWT_SECRET`    | Yes      | Secret used to sign tokens (32+ random bytes) |
| `JWT_EXPIRES_IN`| No       | Token lifetime (default: `1d`)                |
| `PORT`          | No       | Server port (default: `3001`)                 |
| `NODE_ENV`      | No       | Environment label (default: `development`)    |

The backend fails fast at boot if a required variable is missing — this is intentional. Better to crash on startup than to silently run with insecure defaults.

### Frontend (`.env.local`)

| Variable       | Required | Description           |
|----------------|----------|-----------------------|
| `VITE_API_URL` | Yes      | Backend API base URL  |

Vite only exposes variables prefixed with `VITE_` to the client bundle, preventing accidental leakage of server secrets.

## Architecture decisions

A few opinionated choices worth highlighting for reviewers:

**Server state vs client state.** Server state (projects, tasks) lives in TanStack Query, which handles caching, deduplication, refetch on focus, and stale-while-revalidate. Client state (UI: sidebar open, modal open) lives in `useState`. Mixing the two leads to subtle bugs around stale data and missed refreshes.

**Schema-driven validation.** Each form has a Zod schema. The schema produces the TypeScript type via `z.infer`, validates the form via `@hookform/resolvers/zod`, and is intended to be reused on the server (planned). One source of truth for shape and rules.

**Layered backend.** Routes are thin and only wire up middleware. Controllers handle HTTP concerns (parsing requests, returning status codes). Services contain business logic and talk to Prisma. Services don't know HTTP exists, which makes them straightforward to unit test.

**Authorization scoped per user.** Every database query that touches `Project` or `Task` filters by the authenticated user's ID. Using `deleteMany` with a compound `where` clause silently matches zero rows for unauthorized requests instead of leaking information about other users' data.

**Fail-fast configuration.** Both backend and frontend validate required environment variables at startup. Missing `JWT_SECRET` or `VITE_API_URL` throws a clear error immediately rather than failing later with a confusing message.

## Scripts

### Backend
- `npm run dev` — Run the server in watch mode with nodemon.
- `npx prisma studio` — Open a GUI to inspect the database.
- `npx prisma migrate dev` — Create and apply a new migration.

### Frontend
- `npm run dev` — Start Vite dev server with HMR.
- `npm run build` — Type-check and produce a production bundle.
- `npm run preview` — Preview the production build locally.
- `npm run lint` — Run ESLint.

## Roadmap

- [ ] Backend input validation with Zod (parity with frontend schemas)
- [ ] Global 401 handling — auto-redirect to login on token expiry
- [ ] Tasks CRUD endpoints and UI
- [ ] Backend migration to TypeScript
- [ ] Test suite (Vitest + React Testing Library + Supertest)
- [ ] Deploy to Vercel (frontend) + Railway/Render (backend)
- [ ] Multi-tenancy: workspaces with multiple users per organization
- [ ] Stripe billing integration

## License

MIT

## About

Built by [Juan Sebastián Vedia](https://github.com/) as a learning project and portfolio piece while studying for an Engineering Developer role in Australia. Feedback welcome.
