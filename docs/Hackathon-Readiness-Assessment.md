# SkillSync AI — Hackathon Readiness Assessment & M‑Plan

This document evaluates our current value proposition and implementation against the hackathon brief and judging criteria, then proposes a focused milestone plan (M1–M5) to maximize our score and demo impact.

## 1) Current Value Proposition (What the product does today)

- **Core promise:** Connect your current skills to real Rwanda job opportunities, then show the fastest way to unlock better roles with AI‑generated learning paths and salary impact.
- **Implemented user flow:** `Home → Skills → Analysis` with persistence and resume.
  - Navigation shell and profile menu with data reset in `layout.tsx`, `NavigationMenu`, `ProfileMenu`.
  - State persisted via `LocalStorageManager` with staleness checks and export/import.
- **Job matching:** Frontend calls service layer → FastAPI (or local stubs) for `match-jobs`, returning qualified jobs by skills.
- **AI analysis:** FastAPI uses Gemini to produce:
  - Opportunity gap analysis (top skills to learn with rationale and RWF impact)
  - Salary impact calculator (delta after adding a skill)
  - Curriculum generator (skill → resource link → project brief)
  - Market insights list (Rwanda‑specific)
- **Results UI:**
  - Ranked job matches with match scores, required/missing skills and salary ranges (`JobMatches`).
  - Salary projection card (current vs potential + delta and ROI meter).
  - Learning path section linking to resources and mini‑projects (`LearningPath`).
  - Market insights section.
  - “Low‑data mode” banner if backend/cache fallback was used.
- **Resilience:** Service layer with retry, cache‑fallback, and full local stub mode via `NEXT_PUBLIC_USE_BACKEND`.
- **Demo affordances:** Guided demo, seeded skill set, and quick “Analyze N Skills” CTA.

## 2) Evidence from the codebase (high‑signal refs)

- Frontend orchestration and analysis assembly: `src/app/page.tsx` (skills → services → analysis object).
- Local persistence utilities: `src/lib/localStorage.ts`.
- Backend endpoints and Gemini prompts: `skillsyncAPI/app/api/endpoints.py` with `/match-jobs`, `/opportunity-gap-analysis`, `/salary-impact-calculator`, `/generate-curriculum`, `/market-insights`.
- Service layer with retry/cache/stubs: `src/lib/services.ts`.

## 3) Fit vs Hackathon Judging Criteria

- **Relevance to the Problem — Strong, needs more evidence:**
  - Rwanda‑specific framing, salary in RWF, and insights are present.
  - Gap: Expand job dataset and cite sources in‑app; add industry diversity and rural/low‑bandwidth considerations.

- **Feasibility & Use of AI — Strong prototype, add determinism:**
  - Working Gemini integration and graceful fallback. Good separation via service layer.
  - Gap: Make Gemini outputs deterministic/parse‑safe (strict JSON, schema validation), and unit tests for JSON contracts.

- **Milestones & Execution — Visible progress, add acceptance tests:**
  - Flow works end‑to‑end; multiple sections render with empty/loading states.
  - Gap: Formalize acceptance criteria and smoke tests; add more realistic data to strengthen the demo.

- **Innovation & Differentiation — Clear narrative, amplify ROI:**
  - “Next‑skill to unlock 2× opportunities” + salary delta is compelling.
  - Gap: Add ROI ranking (time‑to‑learn vs salary delta), and a “One‑Skill Plan” summary block.

- **Scalability & Impact — Plausible, show pathway:**
  - Modular architecture; data/provider‑agnostic service layer.
  - Gap: Offline/low‑bandwidth mode indicator, small dataset prebundle, and partner hooks (kLab/SOLVIT) as next steps.

- **Team Capacity — Clear split:**
  - Frontend foundation vs AI/analysis backend already reflected in repo; keep this division in milestones.

## 4) Highest‑impact gaps to close before demo (ranked)

1) **Credible Rwanda dataset:** 15–25 curated jobs across Technology, Banking/FinTech, Tourism, Government/NGO, and Education, each with realistic RWF ranges and skills.
2) **Deterministic AI outputs:** Enforce strict JSON contracts and robust parsing; pre‑cache 2–3 demo scenarios.
3) **ROI view:** Rank suggested skills by salary delta vs time‑to‑learn; show one clear “Next Step”.
4) **Low‑bandwidth readiness:** “Low‑data mode” badge, reduced image payloads, and offline cache for static data.
5) **Evidence & citations:** Add source notes in the UI and a docs appendix listing local sources used.

## 5) Milestone Plan (M1–M5)

### M1 — Data & Contracts (today)
- **Goal:** Credible Rwanda dataset + locked JSON interfaces.
- **Tasks:**
  - Expand `database.JOBS` to 20+ entries across 5 industries with min/max RWF ranges; include `location`, `industry`, and `experienceLevel` when possible.
  - Finalize response shapes for all endpoints; add pydantic response models in the backend.
  - In `services.ts`, add lightweight schema checks; surface meaningful UI errors.
  - Document env flags: `NEXT_PUBLIC_USE_BACKEND`, `NEXT_PUBLIC_API_URL`.
- **Acceptance:** End‑to‑end run with expanded data; UI shows ≥2 excellent matches for seeded demo skills; all API responses validate.

### M2 — Analysis UX & ROI
- **Goal:** Make the value quantifiable and skimmable in 5 seconds.
- **Tasks:**
  - ROI list: recommended skills ranked by `(salary_delta / time_to_learn)` with short rationale.
  - “One‑Skill Plan” banner: the single highest‑ROI skill with link to learning path anchor.
  - Add chips for industries, remote, and experience bands on job cards; keep mobile readable.
  - Add loading skeletons and explicit empty states for each analysis section.
- **Acceptance:** On Analysis, user sees salary delta, count of excellent matches, ROI ranking, and a highlighted next skill; Lighthouse a11y ≥ 90 on mobile.

### M3 — AI Prompting, Determinism & Caching
- **Goal:** Rock‑solid AI responses for live demo.
- **Tasks:**
  - Update Gemini prompts to mandate pure JSON; strip code fences safely; validate with pydantic before returning.
  - Add request/response caching for the guided demo scenarios; record cache key on the service layer.
  - Add unit tests for each endpoint’s JSON schema and a “contract test” in the frontend for `Services.*`.
- **Acceptance:** 10/10 deterministic runs on seeded demo; no parse errors; fallback banner never shown during dry run.

### M4 — Low‑Bandwidth & Offline Readiness
- **Goal:** Demonstrate inclusiveness and practicality.
- **Tasks:**
  - Prebundle a tiny Rwanda data pack (skills, 20 jobs, 10 learning resources) and serve it offline.
  - Add “Low‑data mode” indicator when using cache/stubs; ensure core UX works with zero network after first load.
  - Optimize images and fonts; verify page weight < 250KB after first paint in demo path.
- **Acceptance:** App remains functional offline for the seeded profile; “Low‑data mode” conveys intent in the UI.

### M5 — Pitch Assets, Evidence & Demo Script
- **Goal:** Maximize scoring on presentation and credibility.
- **Tasks:**
  - Create `docs/Pitch.md` with 3–5 minute flow, screenshots, and a one‑slide numbers story (salary delta, match count, ROI).
  - Add `docs/Sources.md` listing kLab, SOLVIT Africa, and public postings used to derive data ranges; mirror key bullets in the Analysis page.
  - Record a 60–90s screen capture of the full flow as backup demo.
- **Acceptance:** Judges can see clear problem fit, working prototype, and data credibility in under 3 minutes.

## 6) Demo Script (3–5 minutes)

1) Home: one sentence problem + promise. Click “See Demo”. 10s
2) Skills: preloaded skills → “Analyze 5 Skills”. 15s
3) Analysis: show job matches first, then salary card (delta), then ROI list with “One‑Skill Plan”, then learning path. 120s
4) Low‑bandwidth note and local partner angle. 20s
5) Close with impact statement and next steps for partnerships. 20s

## 7) Risks & Mitigations

- Gemini JSON drift → strict schema validation + cached demo responses.
- Data credibility → curated set with cited ranges; avoid over‑claiming.
- Time constraints → M1–M3 are critical path; M4–M5 are polish that directly affect scoring.

## 8) Quick status framing (for judges)

- What’s working: end‑to‑end analysis with real/stubbed backend, salary delta, market insights, and learning path.
- What’s next: expand Rwanda data, enforce AI determinism, add ROI ranking and low‑data mode badge.
- Demo‑ready: cohesive flow on mobile; can run fully with cached data.

---

If we complete M1–M3, we present a credible, Rwanda‑specific career intelligence prototype with a clear “one skill → better job” story. M4–M5 add inclusiveness and polish that lift our scores on feasibility, innovation, and presentation.


