import { z } from "zod";
import { extractJsonObject, type LearningResourceInput, type RecommendationOutput } from "./analysis";

export const aiSkillGapSchema = z.object({
  skill: z.string(),
  importance: z.enum(["critical", "high", "medium", "low"]),
  timeToLearn: z.string(),
  salaryImpact: z.number().nonnegative(),
  opportunities: z.number().int().nonnegative(),
});

const aiPhaseSchema = z.object({
  id: z.string(),
  title: z.string(),
  duration: z.string(),
  description: z.string(),
  objectives: z.array(z.string()),
});

export const aiPathSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  targetSkill: z.string(),
  totalDuration: z.string(),
  phases: z.array(aiPhaseSchema),
  projects: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      skills: z.array(z.string()),
      difficulty: z.enum(["beginner", "intermediate", "advanced"]),
      estimatedHours: z.number().int().positive(),
      portfolioValue: z.enum(["high", "medium", "low"]),
    }),
  ),
  milestones: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      criteria: z.array(z.string()),
      reward: z.string().optional(),
    }),
  ),
});

export const aiRecommendationSchema = z.object({
  skillGaps: z.array(aiSkillGapSchema).min(1),
  marketInsights: z.array(z.string()).min(1),
  learningPath: aiPathSchema,
  salaryProjection: z.object({
    current: z.number().nonnegative(),
    potential: z.number().nonnegative(),
    timeframe: z.string(),
  }),
});

function mapAiLearningPath(
  aiPath: z.infer<typeof aiPathSchema>,
  resources: LearningResourceInput[],
): RecommendationOutput["learningPath"] {
  const topResources = resources.slice(0, 9);

  return {
    id: aiPath.id,
    title: aiPath.title,
    description: aiPath.description,
    targetSkill: aiPath.targetSkill,
    totalDuration: aiPath.totalDuration,
    phases: aiPath.phases.map((phase, index) => ({
      ...phase,
      resources: topResources.slice(index * 3, index * 3 + 3),
    })),
    projects: aiPath.projects,
    milestones: aiPath.milestones,
  };
}

export function parseAiRecommendationPayload(
  raw: string,
  deterministic: RecommendationOutput,
  resources: LearningResourceInput[],
): { recommendation: RecommendationOutput; marketInsights: string[] } {
  const jsonText = extractJsonObject(raw);
  if (!jsonText) {
    throw new Error("No JSON object found in AI response");
  }

  const parsed = aiRecommendationSchema.parse(JSON.parse(jsonText));

  return {
    recommendation: {
      ...deterministic,
      skillGaps: deterministic.skillGaps.map((gap, index) => {
        const aiGap = parsed.skillGaps[index];
        if (!aiGap) return gap;
        return {
          ...gap,
          ...aiGap,
        };
      }),
      learningPath: mapAiLearningPath(parsed.learningPath, resources),
      salaryProjection: parsed.salaryProjection,
    },
    marketInsights: parsed.marketInsights,
  };
}
