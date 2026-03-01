import { describe, expect, it } from "vitest";
import {
  calculateJobMatchScore,
  deterministicRecommendation,
  extractJsonObject,
  getMissingSkills,
  type JobListingInput,
  type LearningResourceInput,
  type UserSkillInput,
} from "../../convex/lib/analysis";

const userSkills: UserSkillInput[] = [
  { id: "1", name: "HTML/CSS", category: "technical", level: "advanced" },
  { id: "2", name: "JavaScript", category: "technical", level: "intermediate" },
  { id: "3", name: "SQL", category: "technical", level: "intermediate" },
];

const jobs: JobListingInput[] = [
  {
    _id: "job-1",
    title: "Junior Web Dev",
    company: "kLab",
    industry: "Technology",
    salaryMin: 200000,
    salaryMax: 320000,
    requiredSkills: ["HTML/CSS", "JavaScript"],
    preferredSkills: ["React"],
    level: "entry",
    postedAt: Date.now(),
    isRemote: false,
  },
  {
    _id: "job-2",
    title: "Data Analyst",
    company: "Bank of Kigali",
    industry: "Banking",
    salaryMin: 450000,
    salaryMax: 650000,
    requiredSkills: ["SQL", "Power BI"],
    preferredSkills: ["Python"],
    level: "mid",
    postedAt: Date.now(),
    isRemote: false,
  },
];

const resources: LearningResourceInput[] = [
  {
    resourceId: "res-1",
    title: "React Basics",
    provider: "freeCodeCamp",
    type: "course",
    url: "https://example.com/react",
    duration: "10h",
    difficulty: "beginner",
    cost: "free",
    tags: ["React", "JavaScript"],
  },
  {
    resourceId: "res-2",
    title: "Power BI Labs",
    provider: "Microsoft Learn",
    type: "tutorial",
    url: "https://example.com/powerbi",
    duration: "8h",
    difficulty: "intermediate",
    cost: "free",
    tags: ["Power BI", "Data Analysis"],
  },
];

describe("analysis engine", () => {
  it("calculates weighted job match score", () => {
    const score = calculateJobMatchScore(userSkills, jobs[0]!);
    expect(score).toBeGreaterThan(0.7);
  });

  it("extracts missing required skills", () => {
    const missing = getMissingSkills(userSkills, jobs[1]!);
    expect(missing).toContain("Power BI");
  });

  it("returns deterministic recommendations with salary projection", () => {
    const recommendation = deterministicRecommendation(userSkills, jobs, resources);

    expect(recommendation.skillGaps.length).toBeGreaterThan(0);
    expect(recommendation.learningPath.phases.length).toBeGreaterThan(0);
    expect(recommendation.salaryProjection.potential).toBeGreaterThanOrEqual(
      recommendation.salaryProjection.current,
    );
  });

  it("extracts JSON payload from mixed AI text", () => {
    const extracted = extractJsonObject('text before {"a":1} text after');
    expect(extracted).toBe('{"a":1}');
  });
});
