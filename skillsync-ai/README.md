# SkillSync AI MVP

SkillSync AI is a Rwanda-focused skills-to-jobs matcher.
It maps a user's current skills to curated Rwanda opportunities, generates high-impact skill gaps, and produces practical learning paths with persistent progress tracking.

## MVP Capabilities

- Anonymous persistent user profile (device-based identity)
- Curated Rwanda job data in Convex
- Skills assessment and profile versioning
- Job matching with filters, sorting, and pagination
- AI career analysis via Gemini (server-side only)
- Deterministic fallback analysis if AI fails
- Learning path generation with progress persistence
- Data import pipeline with validation and idempotent upserts

## Stack

- Next.js 14 + TypeScript + Tailwind
- Convex (database + backend functions + actions)
- Google Gemini API (server-side action)
- Zod schema validation
- Vitest unit/integration tests
- Playwright E2E test scaffolding

## Project Structure

```text
skillsync-ai/
├── convex/
│   ├── schema.ts
│   ├── users.ts
│   ├── profiles.ts
│   ├── jobs.ts
│   ├── analysis.ts
│   ├── analysisRunner.ts
│   ├── progress.ts
│   ├── admin.ts
│   └── _generated/
├── data/curated/
│   ├── skills.taxonomy.v1.json
│   ├── jobs.rw.v1.json
│   ├── learning.resources.v1.json
│   └── market.insights.v1.json
├── scripts/data/
│   ├── common.mjs
│   ├── validate-curated.mjs
│   └── import-curated.mjs
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── types/
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

## Environment

Copy `.env.example` to `.env.local` and configure values:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CONVEX_URL=
GEMINI_API_KEY=
SKILLSYNC_ADMIN_IMPORT_TOKEN=
```

Also set backend secrets in Convex:

```bash
npx convex env set GEMINI_API_KEY "..."
npx convex env set SKILLSYNC_ADMIN_IMPORT_TOKEN "..."
```

## Local Setup

```bash
cd skillsync-ai
npm install
npx convex dev --once --typecheck=disable
npm run data:validate
npm run data:import
npm run dev
```

## Commands

```bash
npm run lint
npm run type-check
npm run test
npm run build

npm run convex:dev
npm run convex:codegen

npm run data:validate
npm run data:import

npm run test:e2e
```

## Data Pipeline

1. Curated JSON files live in `data/curated/`
2. `npm run data:validate` enforces schema + business rules
3. `npm run data:import` upserts into Convex with checksum/version tracking
4. Import metadata is persisted in `dataImports`

## Security Notes

- No Gemini key is used in browser code
- Import endpoint requires `SKILLSYNC_ADMIN_IMPORT_TOKEN`
- AI failures always fall back to deterministic recommendations

## CI

GitHub Actions workflow runs:

1. `npm ci`
2. `npm run lint`
3. `npm run type-check`
4. `npm run test`
5. `npm run build`
