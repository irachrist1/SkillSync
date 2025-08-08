# SkillSync AI — Current Progress (dev-backend)

- Date: 2025-08-08
- Scope: Git review, local setup (Node/Python), run FastAPI, fix frontend install, add demo flow, normalize backend→UI data, smoke test.

## What's working
- Backend API on 7800 returning 200: match-jobs, opportunity-gap-analysis, salary-impact-calculator, generate-curriculum, market-insights.
- Frontend dev server (Next.js 14.2.31) using NEXT_PUBLIC_API_URL=http://localhost:7800.
- Analyze flow: Skills → calls all 5 endpoints → renders Job Matches, Salary Projection, Market Insights, Learning Path.
- "See Demo" preloads demo skills and auto‑runs analysis.
- UI normalization for backend snake_case → camelCase with safe defaults (prevents crashes).

## What's blocked / not working
- View Details button in job cards has no action (no link/handler).
- Avg Salary formatting bug shows values like "RF 362k500" (string replacement on formatted currency adds an extra "k").
- Salary increase can be 0 for some skill sets (data dependent; add guard copy for demo).

## Next immediate task
- Implement real handler/URL for View Details (external job link or details modal). ✅ Done (modal + optional external link)
- Fix Avg Salary calculation/formatting in JobMatches summary (compute numeric average, then use formatSalary; remove text post‑processing). ✅ Done
- Minor UI polish for spacing, badges, and mobile; keep minimalistic and clear navigation. 🔄 Ongoing (M3)
- Add navigation tabs, logo home redirect, profile menu. ✅ Done
- Add feature flag + stub services to run without backend (M4). ✅ Done via `NEXT_PUBLIC_USE_BACKEND` and service layer

## Demo‑ready features
- Skills selection → Analyze → Job Matches with match scores and missing skills.
- Salary Projection (current vs recommended) with guardrails.
- Rwanda Market Insights.
- Personalized Learning Path.
- One‑click "See Demo" walkthrough.

## M3 polish in this pass
- Tabs navigation (Home, Skills, Analysis), logo → Home, profile menu with Clear Data.
- Focus management: Skills search auto-focus; Analysis scrolls to top.
- Copy/layout tweaks on Job Matches header; improved a11y labels.

## M2 & M3 updates (new)
- Added Impact Summary inside Earning Potential (excellent matches, salary delta, ROI meter, skills to learn).
- Implemented low‑bandwidth resilience: service layer has retry/backoff and cached fallback; stubs act as "Low‑data mode".
- Home page includes Rwanda sources note; stub curriculum links to kLab and SOLVIT Africa when relevant.

---

Notes: Backend and frontend run locally without Docker (optional later). CORS enabled; JSON parsing handled via UI normalization. A "Low‑data mode" automatically uses cached/stubbed responses if backend is unreachable; a banner appears in Skills.
