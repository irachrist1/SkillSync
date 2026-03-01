import { describe, expect, it } from "vitest";
import { parseAiRecommendationPayload } from "../../convex/lib/aiParser";
import type { LearningResourceInput, RecommendationOutput } from "../../convex/lib/analysis";

const deterministic: RecommendationOutput = {
  currentOpportunityIds: ["job-1"],
  nextLevelOpportunityIds: ["job-2"],
  skillGaps: [
    {
      skill: "React",
      importance: "high",
      timeToLearn: "4-6 weeks",
      salaryImpact: 120000,
      opportunities: 3,
      learningResources: [],
    },
  ],
  learningPath: {
    id: "path-1",
    title: "React Path",
    description: "desc",
    targetSkill: "React",
    totalDuration: "8 weeks",
    phases: [],
    projects: [],
    milestones: [],
  },
  salaryProjection: {
    current: 300000,
    potential: 450000,
    timeframe: "6 months",
  },
};

const resources: LearningResourceInput[] = [
  {
    resourceId: "res-1",
    title: "React Basics",
    provider: "fcc",
    type: "course",
    url: "https://example.com",
    duration: "10h",
    difficulty: "beginner",
    cost: "free",
    tags: ["React"],
  },
];

describe("ai parser", () => {
  it("accepts valid JSON payload and merges into deterministic output", () => {
    const raw = JSON.stringify({
      skillGaps: [
        {
          skill: "React",
          importance: "critical",
          timeToLearn: "6 weeks",
          salaryImpact: 180000,
          opportunities: 5,
        },
      ],
      marketInsights: ["React demand rising in Rwanda startups"],
      learningPath: {
        id: "react-path",
        title: "React MVP Path",
        description: "Build React production skills",
        targetSkill: "React",
        totalDuration: "10 weeks",
        phases: [
          {
            id: "foundation",
            title: "Foundation",
            duration: "3 weeks",
            description: "Core concepts",
            objectives: ["Understand components"],
          },
        ],
        projects: [
          {
            id: "p1",
            title: "Portfolio App",
            description: "Build one portfolio app",
            skills: ["React"],
            difficulty: "intermediate",
            estimatedHours: 20,
            portfolioValue: "high",
          },
        ],
        milestones: [
          {
            id: "m1",
            title: "Milestone",
            description: "Done",
            criteria: ["Ship app"],
          },
        ],
      },
      salaryProjection: {
        current: 320000,
        potential: 520000,
        timeframe: "6 months",
      },
    });

    const parsed = parseAiRecommendationPayload(raw, deterministic, resources);
    expect(parsed.recommendation.skillGaps[0]!.importance).toBe("critical");
    expect(parsed.marketInsights.length).toBeGreaterThan(0);
  });

  it("throws on invalid JSON payload", () => {
    const invalid = "no-json-here";
    expect(() => parseAiRecommendationPayload(invalid, deterministic, resources)).toThrow();
  });
});
