# SkillSync MVP Environment Setup

## 1) Local .env file

Create `skillsync-ai/.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CONVEX_URL=
GEMINI_API_KEY=
SKILLSYNC_ADMIN_IMPORT_TOKEN=
```

`NEXT_PUBLIC_CONVEX_URL` is populated automatically when running `npx convex dev`.

## 2) Convex configuration

Initialize/run local deployment and generate typed API:

```bash
npx convex dev --once --typecheck=disable
```

Set server-side environment variables in Convex:

```bash
npx convex env set GEMINI_API_KEY "your_gemini_key"
npx convex env set SKILLSYNC_ADMIN_IMPORT_TOKEN "strong_admin_token"
```

## 3) Curated data pipeline

Validate and import curated datasets:

```bash
npm run data:validate
npm run data:import
```

## 4) Run app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Troubleshooting

- `No CONVEX_DEPLOYMENT set`: run `npx convex dev --once`.
- `Unauthorized import request`: ensure `SKILLSYNC_ADMIN_IMPORT_TOKEN` exists both in local env and Convex env.
- Missing AI output: app will use deterministic fallback automatically and display fallback notice.
