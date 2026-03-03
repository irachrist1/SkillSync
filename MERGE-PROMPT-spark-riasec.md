# Merge Prompt: Port Spark's RIASEC Assessment into SkillSync

## Goal

Port Spark's RIASEC + Big Five personality assessment system into SkillSync's existing assessment infrastructure. SkillSync keeps its skill-based matching as a complementary system — RIASEC adds interest/personality-based career discovery on top.

## Source (Spark)

```
/Users/christiantonny/Documents/spark/
├── src/lib/assessment-algorithm.ts    # Core: calculateProfileFromAnswers(), matchStudentToCareers()
├── src/app/assessment/                # UI: intro, questions flow, results display
│   ├── page.tsx                       # Assessment intro
│   ├── questions/page.tsx             # 25-question flow
│   └── results/page.tsx               # Results + career matches
├── convex/assessments.ts              # Backend: save/retrieve assessment results
├── convex/careers.ts                  # Career data with RIASEC profiles
└── convex/schema.ts                   # assessmentResults, careers tables
```

### What the Assessment Does
- 25 Likert-scale questions (0-4):
  - Q1-12: RIASEC interests (2 per type × 6 types)
  - Q13-18: Values (impact, income, autonomy, balance, growth, stability)
  - Q19-24: Big Five personality (openness, conscientiousness, extraversion)
  - Q25: Work environment preference
- Scoring: Cosine similarity between student profile and career profiles
- Weights: Interest 40% + Values 30% + Personality 20% + Environment 10%
- Output: Top 25 career matches with percentages + reasoning

## Target (SkillSync)

```
/Users/christiantonny/Documents/SkillSync/skillsync-ai/
├── src/app/                           # Single-page step flow
├── src/components/                    # SkillsSelector, JobMatches
├── convex/schema.ts                   # users, skillProfiles, analyses, jobListings
└── convex/                            # Queries and mutations
```

### Key Differences to Handle
| Aspect | Spark | SkillSync |
|--------|-------|-----------|
| Auth | Clerk (JWT, user accounts) | Device-based (localStorage UUID) |
| Career data | 150+ careers in Convex | Job listings from Rwanda market |
| Matching | RIASEC cosine similarity | Skill overlap percentage |
| UI pattern | Multi-page routes | Single-page step flow |

## Migration Steps

### Step 1: Port the Algorithm
Copy `spark/src/lib/assessment-algorithm.ts` into `skillsync-ai/src/lib/`. This file is pure functions with no framework dependencies. Remove any Clerk-specific user ID references — use SkillSync's deviceId pattern instead.

### Step 2: Add Assessment Schema
Add to `skillsync-ai/convex/schema.ts`:
- `assessmentResults` table (deviceId, answers, riasecScores, valuesScores, bigFiveScores, careerMatches, completedAt)
- Add RIASEC profile fields to `jobListings` table (or create a separate `careerProfiles` table)

### Step 3: Create Assessment UI
Add a new step to SkillSync's step flow (between "skills" and "analysis"):
- `assessment` step: Render 25 questions with Likert scale
- Use SkillSync's existing UI components (not Spark's Clerk-dependent components)
- On completion: save results to Convex, proceed to analysis

### Step 4: Merge Matching Results
The analysis step should show BOTH:
1. **Skill-based matches** (existing): "Based on your skills, you match these jobs"
2. **Interest-based matches** (new): "Based on your interests and personality, explore these careers"

Do NOT replace skill matching. Present them as complementary views.

### Step 5: Handle Career Data
Option A (recommended): Add RIASEC profiles to existing `jobListings` — each listing gets a riasecProfile field. Pre-compute profiles for Rwanda job categories.

Option B: Import Spark's careers as a separate `careerProfiles` table. More data but harder to maintain.

### Step 6: Test
- Run `npm run ci` in skillsync-ai to verify no regressions
- Verify the step flow works: welcome → skills → assessment → analysis
- Verify both skill-based and interest-based results display correctly

## What NOT to Do
- Do NOT import Clerk dependencies
- Do NOT replace SkillSync's skill-based matching
- Do NOT copy Spark's UI components wholesale — adapt to SkillSync's design system
- Do NOT import Spark's career data without reviewing for Rwanda market relevance
