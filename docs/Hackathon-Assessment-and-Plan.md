# SkillSync AI — Hackathon Assessment & Plan

Source brief: `docs/Hackathon Challenge.md`

## Executive summary
- Value proposition (current): Map a user’s skills to Rwanda job opportunities, show immediate matches, AI gap analysis, salary impact, and a concrete learning path. One‑click demo, clean navigation, works with or without backend.
- Verdict: Strong core demo loop is in place; needs sharper Rwanda evidence, offline/low‑bandwidth angle, and clearer employer outcome to maximize scoring.

## What’s working (maps to value)
- Skills → job matches (with scores), salary projection, market insights, and learning path displayed in a single analysis page.
- Job details modal + persistent user profile; See Demo path; feature flag for stubs (fast, reliable demos).
- Minimal, mobile‑friendly navigation with state persisted via query and localStorage.

## Gaps vs value proposition
- Rwanda evidence: limited localized data (few jobs, generic insights/resources).
- Low‑bandwidth/offline story: local stubs exist but not framed as an offline mode.
- Employer signal: no way to showcase outcomes (e.g., shareable skill plan or employer view).
- Measurement: no simple metrics panel to show “impact” (e.g., jobs unlocked, salary delta).

## Criteria score (self‑rating 1–5) and quick win to +1
- Relevance: 4/5 — Good fit; add real Rwanda data points (kLab/SOLVIT citations) on page to reach 5.
- Feasibility & AI: 3/5 — AI calls/stubs OK; add structured prompting + graceful fallbacks and cache to reach 4.
- Milestones & Execution: 4/5 — Clear M1–M4 delivered; add short in‑app checklist and README to reach 5.
- Innovation & Differentiation: 3/5 — Add “Opportunity ROI meter” and employer‑facing share link to reach 4.
- Scalability & Impact: 3/5 — Add offline wording + light data sync plan and partner hooks to reach 4.
- Team Capacity: 4/5 — Shows full stack capability; add tests and type guards to reach 5.
- Presentation & Communication: 4/5 — Tighten hero copy and add 90‑sec guided demo button to reach 5.

## Milestones (implementation plan)
- M1 — Rwanda proof & offline framing (1–2h)
  - Add Rwanda badges (kLab, SOLVIT Africa) and cite source lines under Insights.
  - Replace/augment two learning resources with Rwanda‑relevant ones.
  - Add “Works offline after first load” badge; rename stubs to “Low‑data mode”.
- M2 — Opportunity ROI & metrics (1h)
  - Add “Impact Summary” card: jobs unlocked, salary delta, time‑to‑earn estimate.
  - Color‑coded ROI meter (low/med/high) fed by gap analysis + salary impact.
- M3 — AI prompting quality & resilience (1–2h)
  - Centralize prompts; enforce JSON schema; add retry/backoff and cached last good response.
  - If AI fails, show cached insights with subtle banner.
- M4 — Employer/share output (1–2h)
  - “Share Plan” → generate a compact, read‑only link or printable PDF summary (skills, ROI, learning path).
  - Add “Employer readiness checklist” (required skills satisfied, missing skills list).
- M5 — Presentation polish (1h)
  - Add “Guided Demo (90s)” overlay: step through Skills → Analyze → Results with fake timer.
  - Tighten hero/value copy and add three concise bullets tied to judging criteria.

## Demo script (90 seconds)
1) Home: “We show what job you can get today in Rwanda, and the fastest way to double opportunities.”
2) Click See Demo → Analysis: show matches, ROI card (M2), and gap skill(s).
3) Show Learning Path with Rwanda resources; mention offline/low‑data.
4) Click Share Plan → explain employer view.

## Risks & mitigations
- AI variability → schema guard + cached responses (M3).
- Limited Rwanda data → cite sources and expand 3–5 entries (M1).
- Time: prioritize M1→M2→M5; M3/M4 if time remains.
