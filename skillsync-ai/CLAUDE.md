# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## What This Is

SkillSync AI — skills assessment and career matching platform for the Rwanda job market. Users select skills, get AI-powered job matches, skill gap analysis, and personalized learning paths. Device-based auth (no login required).

**Note:** Project root is `SkillSync/skillsync-ai/`, not the parent `SkillSync/` directory.

## Commands

```bash
npm run dev              # Next.js dev server (localhost:3000)
npm run build            # Production build
npm run convex:dev       # Convex backend dev + codegen
npm run convex:codegen   # One-time Convex codegen
npm run lint             # ESLint (zero warnings policy)
npm run type-check       # TypeScript strict check
npm run test             # Unit + integration tests with coverage
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test:e2e         # Playwright E2E tests
npm run data:validate    # Validate curated job/skills data
npm run data:import      # Import data to Convex
npm run ci               # Full pipeline: lint → type-check → test → build
```

## Architecture

### Tech Stack
- Next.js 14 (App Router), React 18, TypeScript 5
- Convex v1.28 (serverless backend + real-time sync)
- Google Gemini 2.5 Flash API (`@google/generative-ai`)
- Tailwind CSS 3, Radix UI, Lucide icons
- Vitest (unit/integration), Playwright (E2E)
- Zod 4 for validation

### App Flow
Single-page step flow on `/`:
1. **welcome** — Hero + feature cards + market data status
2. **skills** — Skill selector + experience/industry inputs
3. **analysis** — Job matches + skill gaps + learning path + earnings projection

### Database Tables (`convex/schema.ts`)
- `users` — Device-based identity (deviceId, locale, timezone)
- `skillProfiles` — Versioned user skill profiles
- `analyses` — AI recommendations (source: ai|fallback)
- `learningProgress` — Completed resources/milestones + time invested
- `jobListings` — Rwanda job data (title, company, salary, skill requirements)
- `skillTaxonomy` — Skill categories + demand level + salary impact
- `learningResources` — Curated courses/articles/videos
- `marketInsights` — Pre-computed Rwanda market insights
- `dataImports` — Import log (version, checksum, status)

### Key Components (`src/components/`)
- `SkillsSelector` — Multi-select from skill taxonomy
- `JobMatches` — Paginated, filterable (industry/level/remote/salary), sortable
- `ConvexClientProvider` — DB + real-time sync setup
- `ErrorBoundary` — Error handling wrapper

## Key Patterns

- **Device-based auth**: UUID in localStorage via `getOrCreateDeviceId()`. No user accounts.
- **AI with fallback**: Gemini generates recommendations → deterministic algorithm if AI fails
- **Job matching**: `calculateJobMatchScore()` — required skills (75%) + preferred (25%), threshold: >=0.7 "current", 0.4-0.7 "next level"
- **Learning path**: 3 phases (Foundation 2-3w, Applied 3-4w, Portfolio 3-5w), top 5 skill gaps by salary impact
- **Data access**: Convex queries with indexed lookups, client-side filtering + server-side scoring

## Environment Variables

Client-side (`.env.local`):
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210
```

Server-side (Convex dashboard):
```
GEMINI_API_KEY=<google-api-key>
SKILLSYNC_ADMIN_IMPORT_TOKEN=<admin-token>
```

See `ENVIRONMENT_SETUP.md` for full setup instructions.

## Current State

MVP (v0.1.0). Fully functional with AI + fallback. Skills assessment, job matching, learning path generation all working. Curated Rwanda job market data. Test suites configured (unit/integration/E2E). Ready for Convex cloud + Vercel deployment.
