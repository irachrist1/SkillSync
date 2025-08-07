# Developer 2: AI Specialist - Guide & Progress Tracker

This guide outlines your role, tasks, and a tracker for your progress in building the SkillSync AI application.

## Your Role: AI Specialist

As the AI Specialist, you are responsible for the core intelligence of the SkillSync application. Your primary focus is on integrating the Google Gemini API to provide users with actionable career insights. You will build the systems that analyze user skills, identify opportunities in the Rwandan job market, and generate personalized learning paths to help users achieve their career goals.

You are responsible for **Phase 2 (Job Market Matching & Analysis)** and **Phase 3 (Learning Path Generation & Polish)**.

---

## Phase 2: Job Market Matching & Analysis (2 hours)

**Focus:** AI Integration + Business Logic
**Deliverable:** A results dashboard showing a user their current vs. potential job opportunities with clear visualizations.

### Core Tasks:
- [ ] **Build Curated Rwanda Jobs Database:** Create a database with realistic salary ranges and skill requirements for jobs in Rwanda.
- [ ] **Create Job-to-Skills Matching Algorithm:** Develop a sophisticated algorithm that matches users to jobs based on combinations of skills, not just individual ones.
- [ ] **Develop AI-Powered Opportunity Gap Analysis:** Use advanced Google Gemini prompting to analyze a user's skill gaps and identify high-impact opportunities.
- [ ] **Build Results Dashboard:** Design and implement a dashboard that clearly visualizes current vs. potential opportunities.
- [ ] **Implement Salary Impact Calculator:** Create a system that shows users the potential salary increase and ROI for learning new skills.

### AI Prompting Strategy for Phase 2:
```
You are an expert career strategist creating opportunity analysis for Rwanda's job market.
Analyze skill combinations and their market value impact.
Generate specific salary projections and career pathway recommendations.
Provide structured output with clear action items and timelines.
```

---

## Phase 3: Learning Path Generation & Polish (1 hour)

**Focus:** AI Curriculum + UX Polish
**Deliverable:** A complete, polished system that provides personalized learning paths and tracks user progress.

### Core Tasks:
- [ ] **Create Learning Resource Database:** Compile a list of high-quality, accessible learning resources (e.g., YouTube, freeCodeCamp, local Rwandan programs).
- [ ] **Build AI-Powered Curriculum Generation:** Implement a system that uses structured prompting to generate personalized, project-based learning paths.
- [ ] **Implement Progress Tracking:** Use `localStorage` to save and manage user progress through their learning paths.
- [ ] **Add Skills Impact Visualizations:** Create charts or other visuals to show users how their opportunities grow as they acquire new skills.
- [ ] **Polish UI/UX:** Ensure the application is mobile-responsive, professional, and provides a motivating user experience.

### Curriculum Generation Prompting for Phase 3:
```
You are an expert curriculum designer creating job-market-driven learning paths.
Design practical, project-based learning experiences for specific Rwanda job opportunities.
Include realistic timelines, accessible resources, and measurable milestones.
Each recommendation must connect to concrete employment outcomes.
```

---

## Integration

After completing your phases, you will work with Developer 1 to integrate the full application.

- **Connect:** Link the skills selection interface to your AI analysis system.
- **Unify:** Create a single, cohesive dashboard.
- **Polish:** Refine the mobile UX, add loading states, and prepare for the final demo.

Good luck!
