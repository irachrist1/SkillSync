import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import {
  deterministicRecommendation,
  type JobListingInput,
  type LearningResourceInput,
  type UserSkillInput,
} from "./lib/analysis";
import { parseAiRecommendationPayload } from "./lib/aiParser";

function buildPrompt(profile: {
  skills: UserSkillInput[];
  experienceText: string;
  preferredIndustries: string[];
}, jobs: JobListingInput[]) {
  return [
    "You are a Rwanda-focused career intelligence analyst.",
    "Return valid JSON only and no markdown.",
    "Inputs:",
    `Skills: ${profile.skills.map((skill) => `${skill.name} (${skill.level})`).join(", ")}`,
    `Experience: ${profile.experienceText}`,
    `Preferred industries: ${profile.preferredIndustries.join(", ")}`,
    "Jobs:",
    ...jobs.map(
      (job) =>
        `- ${job.title} @ ${job.company} | level=${job.level} | salary=${job.salaryMin}-${job.salaryMax} RWF | required=[${job.requiredSkills.join(", ")}] | preferred=[${job.preferredSkills.join(", ")}]`,
    ),
    "Respond as JSON only with keys: skillGaps, marketInsights, learningPath, salaryProjection.",
  ].join("\n");
}

async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Gemini request failed: ${response.status} ${text}`);
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };

    const output = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!output) {
      throw new Error("Gemini response did not include text output");
    }

    return output;
  } finally {
    clearTimeout(timeout);
  }
}

export const runCareerAnalysis: ReturnType<typeof action> = action({
  args: {
    profileId: v.id("skillProfiles"),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.runQuery(api.profiles.getSkillProfileById, {
      profileId: args.profileId,
    });

    if (!profile) {
      throw new Error("Skill profile not found");
    }

    const context = await ctx.runQuery(api.analysis.getAnalysisContext, {});

    const jobs: JobListingInput[] = context.jobs.map((job) => ({
      _id: job._id,
      title: job.title,
      company: job.company,
      industry: job.industry,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      requiredSkills: job.requiredSkills,
      preferredSkills: job.preferredSkills,
      level: job.level,
      postedAt: job.postedAt,
      isRemote: job.isRemote,
    }));

    const resources: LearningResourceInput[] = context.resources.map((resource) => ({
      resourceId: resource.resourceId,
      title: resource.title,
      provider: resource.provider,
      type: resource.type,
      url: resource.url,
      duration: resource.duration,
      difficulty: resource.difficulty,
      cost: resource.cost,
      ...(typeof resource.rating === "number" ? { rating: resource.rating } : {}),
      tags: resource.tags,
    }));

    const deterministic = deterministicRecommendation(profile.skills as UserSkillInput[], jobs, resources);

    let source: "ai" | "fallback" = "fallback";
    let fallbackReason: string | undefined = "AI unavailable";
    let recommendations = deterministic;
    let marketInsights: string[] = context.insights;

    try {
      const prompt = buildPrompt(
        {
          skills: profile.skills as UserSkillInput[],
          experienceText: profile.experienceText,
          preferredIndustries: profile.preferredIndustries,
        },
        jobs,
      );

      const rawResponse = await callGemini(prompt);
      const aiResult = parseAiRecommendationPayload(rawResponse, deterministic, resources);
      source = "ai";
      fallbackReason = undefined;
      recommendations = aiResult.recommendation;
      marketInsights = aiResult.marketInsights;
    } catch (error) {
      source = "fallback";
      fallbackReason = error instanceof Error ? error.message : "Unknown AI failure";
    }

    const analysisId = await ctx.runMutation(api.analysis.saveAnalysis, {
      userId: profile.userId,
      profileVersion: profile.version,
      source,
      ...(fallbackReason ? { fallbackReason } : {}),
      recommendations,
      marketInsights,
    });

    return {
      analysisId,
      source,
      fallbackReason,
      recommendations,
      marketInsights,
      createdAt: Date.now(),
    };
  },
});
