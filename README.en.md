# MianySoul

A TypeScript full-stack foundation framework - zero business, highly extensible infrastructure.

## Tech Stack

### Frontend

- Vue 3 + Vite 5 + TypeScript
- Pinia (State management with persistence)
- Vue Router 4 (Routing)
- Tailwind CSS (Styling)
- Naive UI (Component library)
- Axios (HTTP client)

### Backend

- Fastify + TypeScript
- Prisma ORM
- SQLite (Development) / PostgreSQL (Production)
- JWT Authentication
- Swagger API Documentation

### Engineering

- pnpm workspace (Monorepo)
- ESLint + Prettier
- husky + lint-staged
- Docker + docker-compose

## Project Structure

```
MianySoul/
├── apps/
│   ├── frontend/          # Frontend application
│   │   ├── src/
│   │   │   ├── layouts/   # Layout components
│   │   │   ├── views/     # Page components
│   │   │   ├── router/    # Router configuration
│   │   │   ├── stores/    # State management
│   │   │   ├── utils/     # Utility functions
│   │   │   └── composables/ # Composables
│   │   └── public/        # Static assets
│   └── backend/           # Backend API service
│       ├── src/
│       │   ├── config/    # Configuration
│       │   ├── db/        # Database
│       │   ├── plugins/   # Fastify plugins
│       │   ├── middleware/ # Middleware
│       │   ├── routes/    # Routes
│       │   ├── schemas/   # Schema definitions
│       │   └── utils/     # Utility functions
│       └── prisma/        # Prisma configuration
├── packages/
│   └── shared/            # Shared code between frontend and backend
│       └── src/
│           ├── types/     # Type definitions
│           ├── constants/ # Constants
│           └── utils/     # Utility functions
├── .husky/                # Git hooks
├── pnpm-workspace.yaml    # Workspace configuration
├── docker-compose.yml     # Docker orchestration
└── README.md
```

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Initialize Database

```bash
# Copy environment variables
cp apps/backend/.env.example apps/backend/.env

# Push database schema
pnpm db:push

# Initialize seed data (creates default admin account)
pnpm db:seed
```

Default admin account: `admin` / `admin123`

### 3. Start Development Server

```bash
# Start both frontend and backend
pnpm dev

# Or start separately
pnpm --filter @miany-soul/backend dev
pnpm --filter @miany-soul/frontend dev
```

### 4. Access Services

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Swagger Documentation: http://localhost:3000/api/docs

## Features

### Backend Features

- **Unified Response Format**: All endpoints return `{ code, data, message }`
- **Global Exception Handling**: Auto-catch and return friendly error messages
- **JWT Authentication**: Access Token + Refresh Token support
- **Role Permissions**: Reserved admin super administrator role
- **Login Rate Limiting**: 5 times/minute to prevent brute force attacks
- **Global Rate Limiting**: 100 times/minute per IP
- **CORS Whitelist**: Only allow specified domains for CORS
- **XSS Protection**: Auto-escaping dangerous characters
- **Sensitive Field Masking**: password, token auto-replaced with \*\*\*
- **LRU Cache**: Memory cache with Redis interface reserved
- **Soft Delete**: Mark deletedAt when data is deleted
- **Swagger Documentation**: Auto-generated API documentation
- **Request Logging**: Graded request information output

### Frontend Features

- **Three Groups of Routes**: Frontend, Admin, Experimental fields with independent layouts
- **Route Guards**: Admin authentication, 401 redirect to login
- **State Persistence**: User login state auto-saved
- **Axios Wrapper**: Request interception, error handling, 401 redirect
- **Vite Proxy**: API forwarding in development environment
- **Tailwind CSS**: Reserved theme variables, support glassmorphism effects
- **Naive UI**: Integrated component library
- **Message Notifications**: Global messages, confirmation dialogs
- **Yuque Rich Text Editor**: Integrated yuque-rich-text for rich text editing
- **Glassmorphism Design**: Modern glassmorphism style for admin interface
- **Gradient Buttons**: Differentiated gradient color buttons in management modules
- **Bento Style Layout**: Modular card layout for Dashboard

### Frontend Pages

- **Home**: Display recent articles, images, diary overview
- **Archive**: Group articles by year, hover to show categories and tags, support cover preview
- **Categories**: Display all categories, click to view articles
- **Tag Cloud**: Display all tags, click to view articles
- **Gallery**: Filter images by group, grid layout 4-5 per row, preview dialog with click to close
- **Lyric Wall**: Novel floating card layout, category switching, glassmorphism design
- **Scenes**: White noise scene cards with play controls
- **About**: Personal information, statistics, tech stack display

## Changelog

| Date       | Updates                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------- |
| 2026-07-04 | Default group protection: Audio, image, video default groups cannot be edited or deleted          |
| 2026-07-04 | Audio selector optimization: Auto-select default group when opening; Fix default group marking    |
| 2026-07-04 | Gallery selector icon fix: Fix strange icon display when group icon is empty                      |
| 2026-07-03 | New audio management module: Audio upload, group management, lyric association, frontend playback |
| 2026-07-03 | Lyric management adds audio selection; Lyric cards add play button; Dark mode support             |
| 2026-06-30 | Scene management image selection (from gallery); Delete confirmation (scene/lyric management)     |
| 2026-06-30 | Lyric wall floating card layout, category switching; Article editor left-right layout redesign    |

## License

MIT
