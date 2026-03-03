# /plan-feature: Discover Assessment UX

## Goal
Add a mobile-first "Discover" assessment step between Skills and Analysis that collects 25 Likert responses, allows skipping at any time, and feels fast and lightweight on phones.

## User Flow
1. User completes skills profile.
2. User enters Discover intro card.
3. User starts 25-question flow with one question per screen.
4. User can skip from intro or any question.
5. Completion computes profile and career matches, persists result, then continues to analysis.

## Mobile-first Interaction Model
- Single-column layout with max width and generous touch targets.
- One clear primary action at a time (`Start`, `Next`, `Finish`).
- Likert options shown as vertically stacked buttons on small screens.
- Sticky top progress block to maintain context.
- Always-visible `Skip assessment` button in secondary style.

## Question Interaction and Motion
- One question visible at a time (no long form).
- Progress updates immediately after answer confirmation.
- Question card transitions with subtle fade/slide (`transition-opacity`, `transition-transform`).
- `Next` disabled until a response is selected.

## Progress and Category Indicator
- Progress text: `Question X of 25`.
- Progress bar percentage based on answered position.
- Category badge based on current index:
  - 1-12 `Interests`
  - 13-18 `Values`
  - 19-22 `Personality`
  - 23-25 `Environment`

## Skip, Loading, and Recovery
- Skip action available throughout discover flow.
- Skip routes to analysis with existing skill-based results only.
- On submit, show loading state and prevent duplicate submissions.
- On save/match failure, show inline error with retry action.

## Acceptance Criteria
- Discover step is reachable from Skills and supports intro + questionnaire.
- 25 questions render one-by-one with 5 Likert options each.
- Progress bar and category badge update correctly.
- Skip works from intro and question screens.
- Completion persists assessment result and transitions to analysis.
- Analysis shows Career Discovery tab when assessment exists.
- Layout remains usable on <=390px viewport width.
