# MianySoul

A full-stack personal content management system and homepage built for creators.

Supports articles, diaries, dreams, galleries, videos, audio, lyrics, narratives, and scenes — with rich media management and content creation capabilities.

---

## Tech Stack

### Backend

- **Fastify** + TypeScript — High-performance web framework
- **Prisma** ORM — SQLite currently, switchable to PostgreSQL
- **@fastify/jwt** — JWT authentication
- **@fastify/swagger** — Auto-generated API documentation
- **sharp** — Auto image conversion to AVIF
- **fluent-ffmpeg** — Auto video conversion to AV1
- **zod** — Parameter validation
- **bcryptjs** — Password encryption
- **lru-cache** — In-memory caching

### Frontend

- **Vue 3** + Vite 5 + TypeScript — Core framework
- **Pinia** — State management with persistence
- **Vue Router 4** — Routing
- **TailwindCSS** — CSS framework with CSS variable-driven theming
- **Naive UI** — Admin UI component library
- **ByteMD** — Markdown editor (live edit/preview, GFM support)
- **@iconify/vue** — Icon library
- **lucide-vue-next** — Icon library
- **ECharts** — Charting library

### Engineering

- **pnpm** Monorepo workspace
- **ESLint** + **Prettier** Code standards
- **Husky** + **lint-staged** Git hooks

---

## Project Structure

```
miany-soul/
├── apps/
│   ├── backend/          # Backend API (Fastify + Prisma)
│   │   ├── src/          # Entry, routes, plugins, utilities
│   │   ├── prisma/       # Data models + seed data
│   │   └── uploads/      # Upload directory
│   └── frontend/         # Frontend app (Vue 3 + Vite)
│       ├── src/          # Components, views, router, stores
│       ├── vite.config.ts
│       └── tailwind.config.js
├── packages/
│   └── shared/           # Shared types and utilities
├── docker-compose.yml    # Docker orchestration
├── pnpm-workspace.yaml
└── package.json
```

---

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

```bash
# Backend
cp apps/backend/.env.example apps/backend/.env
```

Required configuration:

- `JWT_SECRET` — JWT secret (must change in production)
- `DATABASE_URL` — Database connection (default: `file:./dev.db`)
- `CORS_ORIGIN` — Allowed CORS origins

### 3. Initialize Database

```bash
pnpm db:push    # Push schema to database
pnpm db:seed    # Create default categories
```

### 4. Start Development

```bash
pnpm dev        # Start both frontend and backend
```

Or start separately:

```bash
pnpm --filter @miany-soul/backend dev
pnpm --filter @miany-soul/frontend dev
```

### 5. Access Services

- Frontend: http://localhost:5173
- Admin: http://localhost:5173/admin
- Swagger API Docs: http://localhost:3000/docs

> The backend auto-detects available ports and writes the port to `.port` file. The frontend proxy reads this file automatically.

---

## Modules

### Frontend Pages

| Page        | Description                                          |
| ----------- | ---------------------------------------------------- |
| Home        | Recent articles, gallery, diary overview             |
| Archive     | Articles grouped by year with cover preview          |
| Categories  | Browse articles by category                          |
| Lyrics Wall | Masonry card layout, category filter, audio playback |
| Gallery     | Selected gallery browsing                            |
| Narrative   | Narrative stories list, image/video stories          |
| About       | Personal info, tech stack display                    |
| Memory      | Memory highlights (login required)                   |

### Admin Modules

| Module       | Description                                     |
| ------------ | ----------------------------------------------- |
| Dashboard    | Statistics, quick access entries                |
| Articles     | Article management, ByteMD Markdown editor      |
| Gallery      | Image group management with AVIF conversion     |
| Videos       | Video group management with AV1 conversion      |
| Audio        | Audio group management, linked to lyrics        |
| Music/Lyrics | Lyrics CRUD, category management, audio linking |
| Narrative    | Narrative entries with image/video media        |
| Memory       | Memoir entries management                       |
| Users        | User profile management                         |
| Site Info    | Site configuration (logo, title, theme colors)  |
| Settings     | Module/page name customization, database backup |

---

## Key Features

### Auto Media Conversion

- Images auto-converted to **AVIF** (quality 70, ~23% smaller)
- Videos auto-converted to **AV1** via SVT-AV1 encoder
- High-performance media formats compatible with modern browsers

### Configuration System

- Site config stored as **JSON in database** with dynamic updates
- Module names, page titles, theme colors, home wallpapers all configurable
- Auto-cached on frontend for performance

### Theme System

- CSS variable-driven dual theme (light teal / dark purple)
- View API **circular expand transition** on theme toggle
- Customizable theme colors via settings page

### Editor

- **ByteMD** Markdown editor with live edit/preview split view
- GFM support (tables, task lists, code blocks, footnotes)
- Light/dark theme adaptive
- Image insertion via gallery selector

### Security

- JWT loose-mode authentication (token expiry doesn't block requests)
- Global response sanitization (password/token auto-replaced with `***`)
- Rate limiting (100/min globally, 5/min for login)
- Helmet security headers

### Data Backup

- One-click export of all data as JSON
- One-click import with integrity validation
- Transactional operations for data consistency

---

## Commands

```bash
# Development
pnpm dev                    # Start both services

# Database
pnpm db:push                # Push schema
pnpm db:seed                # Seed data
pnpm db:studio              # Open Prisma Studio

# Build
pnpm build                  # Build all

# Linting
pnpm lint                   # ESLint check
pnpm format                 # Prettier format
```

---

## API Overview

| Module    | Prefix           | Description                                 |
| --------- | ---------------- | ------------------------------------------- |
| Auth      | `/api/auth`      | Login, register, user info, password change |
| Upload    | `/api/upload`    | Single/multiple file upload                 |
| Config    | `/api/config`    | Site config CRUD, backup import/export      |
| Scene     | `/api/scene`     | White noise scene management                |
| Gallery   | `/api/gallery`   | Image/group management                      |
| Video     | `/api/video`     | Video/group management                      |
| Article   | `/api/article`   | Article CRUD, category management           |
| Music     | `/api/music`     | Lyrics CRUD, category management            |
| Audio     | `/api/audio`     | Audio/group management                      |
| Narrative | `/api/narrative` | Narrative entries + media                   |
| Stats     | `/api/stats`     | Statistics (public/admin)                   |
| Memoir    | `/api/memoir`    | Memoir management                           |
| Diary     | `/api/diary`     | Diary management                            |
| Dream     | `/api/dream`     | Dream records                               |

All endpoints return: `{ code, data, message }`

---

## Environment Variables

### Backend (`.env`)

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=file:./dev.db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=2h
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`.env`)

```env
VITE_API_BASE_URL=/api
VITE_APP_TITLE=MianySoul
```

---

## Production Deployment

### Docker

`docker-compose.yml` is configured with backend and frontend services. Requires `Dockerfile` files:

- `apps/backend/Dockerfile` — Backend Node.js service
- `apps/frontend/Dockerfile` — Frontend static file service (Nginx)

```bash
docker-compose up -d
```

### Notes

- **Must** replace `JWT_SECRET` with a strong random key
- Backup SQLite database and upload files regularly
- Backend listens on `0.0.0.0` for external access
- Uploads stored in `apps/backend/uploads/`, must be persisted

---

## License

MIT
