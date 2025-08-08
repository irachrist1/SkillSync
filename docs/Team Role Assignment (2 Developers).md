# Team Role Assignment (2 Developers)

## Developer 1: Foundation Builder
**Responsibility:** Phase 1 - Skills Intelligence Engine (2 hours)  
**Focus:** Frontend architecture, skills database, user interface  
**Deliverable:** Working skills selection interface with Rwanda job market data

### Developer 1 — Updated Plan (UI/UX + Flow)
Based on the current UI and the goals in `SkillSync AI - Development Guide.md`, visuals render but end‑to‑end functionality is not wired. Priority is a clean, navigable, demo‑ready flow that uses stubbed data first and can switch to real APIs later.

#### Information Architecture (minimal, modern, clutter‑free)
- **App Shell:** Top navbar (brand + primary action), content area, simple footer.
- **Screens:** `Home` → `Skills` → `Analysis`.
  - Home: hero, 3 value cards, Rwanda market preview, primary CTA → Skills.
  - Skills: selected skills area, categories with search/filter, Analyze button.
  - Analysis: Job Matches, Salary Projection, Market Insights, Learning Path, Next‑Level Jobs.
- **State Flow:** `welcome → skills → analysis` with persistence via `localStorage` and a 24h staleness check.

#### Navigation & UX
- Navbar links: brand → Home; right‑aligned context action (`Get Started` or `Update Skills`).
- Exactly one primary CTA per screen; secondary actions remain subtle.
- Robust empty/loading/error states in all Analysis sections.
- Mobile: no horizontal scroll; tap targets ≥ 44px; sticky Analyze on small screens.

#### Data & Config (dev‑first)
- `USE_BACKEND=false` by default:
  - Local TS data for Rwanda jobs and salary projection.
  - Mock AI responses (gap analysis, curriculum, insights) shaped like production JSON.
- Single switch (`USE_BACKEND=true`) enables real endpoints when available.

#### Components to (Re)work
- Global: Navbar, Footer, Toast/Banner, LoadingSkeleton, SectionHeader.
- Skills: `SkillsSelector` density/levels; category scroll cues.
- Jobs: `JobMatches` alignment; match badge; remote/industry chips; missing‑skills hints.
- Salary: guard divide‑by‑zero; clear copy; currency formatting helpers.
- Learning/Insights: clearer link styles, readable line length, conditional rendering.

#### Acceptance Criteria (Phase 1 DoD)
- User can navigate Home → Skills → Analysis with clear CTAs and no dead ends.
- Selecting ≥1 skill enables Analyze; clicking Analyze renders stubbed results instantly.
- Loading, empty, and error states exist and are testable via a flag.
- State persists across reload and resumes at the last meaningful step.
- Mobile layout passes quick Lighthouse a11y ≥ 90 locally.

### M3 — Navigation & Information Architecture Enhancements (Plan + Brainstorm)
Goal: clearer discovery of core features, faster access to skills, and obvious way home while staying minimal and mobile‑friendly.

Brainstormed options (choose minimal set first, keep others for iteration):
- Tabs in header: **Home**, **Skills**, **Analysis**, optional **Learning Path**, **Insights** (last two hide on mobile or move to overflow).
- Logo behavior: clicking the logo returns to Home and resets flow to `?step=welcome`.
- Global CTA: context‑aware button — “Get Started” on Home, “Analyze N Skills” on Skills, “Update Skills” on Analysis.
- Profile menu (no auth yet): avatar button opens dropdown with: **View Profile** (local summary), **Edit Profile** (go to Skills), **Saved Analyses** (local list placeholder), **Settings** (theme stub), **Clear Data** (danger with confirm).
- Mobile patterns: hamburger → sheet with the same links; primary CTA stays visible.
- Future routes: placeholders for `/profile`, `/about` (or modals first, routes later).

Implementation plan:
- Create `NavigationBar` with typed `NavLink[]` and active state; import in `layout.tsx`.
- Use Next.js navigation to reflect the current step with `?step=welcome|skills|analysis` and update without full reload.
- Add `ProfileMenu` dropdown (accessible, keyboard navigable), backed by `LocalStorageManager`.
- Add dedicated “Skill Picker” button that jumps to `?step=skills` and focuses the search input.
- A11y: proper roles/labels, focus management on open/close, escape to dismiss menus.

Acceptance criteria:
- Header shows tabs (desktop) and a compact menu (mobile); active tab is highlighted.
- Logo click navigates to Home and sets step to welcome; scroll position resets to top.
- Profile menu items work; Clear Data wipes stored profile/analysis after confirmation.
- “Skill Picker” button always brings user to Skills with search focused.

## Developer 2: AI Specialist
**Responsibility:** Phase 2 + Phase 3 - AI Integration & Learning Paths (3 hours)  
**Focus:** Google Gemini integration, job matching logic, learning path generation  
**Deliverable:** Complete AI-powered analysis and recommendation system

---

## Development Prompts

### For Developer 1 (Foundation)
Build Phase 1 of SkillSync AI - the Skills Intelligence Engine for Rwanda's job market.

**Create:**
1. Next.js 14 project with TypeScript + Tailwind
2. Skills selection interface (search/filter) with Rwanda-relevant skills (web dev, data analysis, digital marketing, fintech)
3. Rwanda jobs database with realistic salary ranges in RWF
4. localStorage architecture for user profiles
5. Basic Google Gemini API integration

#### Developer 1 — Pending Items (Updated)
- [ ] Add Navbar + minimal footer with clear CTAs on each page.
- [ ] Implement `USE_BACKEND` flag and stubbed analysis services.
- [ ] Add loading skeletons and error banners across Analysis sections.
- [ ] Guard salary calculations when no matched jobs; helpful empty copy.
- [ ] Improve `SkillsSelector` ergonomics (levels, chip density, category scroll indicator).
- [ ] Persist/restore `UserProfile` + `AIAnalysis`; 24h staleness check.
- [ ] Mobile polish: spacing, tap targets, ensure no horizontal scroll.

**Key requirement:** Research actual Rwanda digital skills landscape (kLab, SOLVIT Africa, job postings) to build realistic skills taxonomy and job data.

**Deliverable:** User can select skills and see basic job matching. Mobile-responsive interface.

> **Reference:** the main development guide for detailed requirements and research directions.

### For Developer 2 (AI Integration)
Build Phase 2 + 3 of SkillSync AI - AI-powered job matching and learning path generation.

**Create:**
1. Job-to-skills matching algorithm using skill combinations
2. Google Gemini integration for opportunity gap analysis (use structured prompting for career intelligence)
3. Salary impact calculator showing earnings potential
4. AI curriculum generation system for personalized learning paths
5. Learning resource database with progress tracking

#### Developer 2 — Updated Execution Modes
- **Mode A (Frontend‑only API routes):** Implement Next.js API route(s) that call Gemini 2.5 Flash; frontend consumes `/api/...`. No Python/Docker for MVP.
- **Mode B (FastAPI):** Keep current FastAPI endpoints stable; ensure JSON shape matches front‑end types; add graceful fallbacks and CORS.

#### Developer 2 — Pending Items
- [ ] Finalize JSON contracts for: job match, gap analysis, salary impact, curriculum, insights.
- [ ] Provide mock responses for Developer 1 stub mode (checked into repo).
- [ ] Add error/fallback responses the UI can render gracefully.

**Key requirement:** Use advanced AI prompting to generate structured career analysis and actionable learning recommendations specific to Rwanda's job market.

**Deliverable:** Complete AI analysis showing current opportunities, skill gaps, salary impact, and personalized learning paths.

> **Reference:** the main development guide for specific prompting strategies and technical requirements.

---

## Quick Status Check Prompt
Show me current progress on SkillSync AI:
- What's working?
- What's blocked?
- Next immediate task?
- Demo-ready features?

**Keep update under 3 sentences.**

---

## Integration Prompt (When Both Phases Done)
Integrate Phase 1 + Phase 2/3 of SkillSync AI.

**Tasks:**
1. Connect skills selection to AI analysis system
2. Create unified dashboard showing: current skills → job matches → skill gaps → learning paths
3. Polish mobile UX and add loading states
4. Prepare demo scenarios with realistic Rwanda data

**Deliverable:** Complete working demo ready for hackathon presentation.

**Test the core user flow:** skills input → job analysis → learning recommendations.

---

## User Journey (Draft for Demo)
- Land on Home → understand value (1 scroll) → click Get Started.
- On Skills, pick 5–10 skills → Analyze becomes enabled → click Analyze.
- On Analysis, see Job Matches → Salary Projection → Market Insights → Learning Path → Next‑Level Jobs.
- Update skills (top‑right action) and re‑run analysis; state persists across refresh.



