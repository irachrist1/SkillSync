import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const riasecScore = v.object({
  realistic: v.number(),
  investigative: v.number(),
  artistic: v.number(),
  social: v.number(),
  enterprising: v.number(),
  conventional: v.number(),
});

const valuesScore = v.object({
  impact: v.number(),
  income: v.number(),
  autonomy: v.number(),
  balance: v.number(),
  growth: v.number(),
  stability: v.number(),
});

const bigFiveScore = v.object({
  openness: v.number(),
  conscientiousness: v.number(),
  extraversion: v.number(),
});

export const listActiveCareerProfiles = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("careerProfiles")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

export const getLatestAssessmentByDevice = query({
  args: {
    deviceId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("assessmentResults")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
      .order("desc")
      .first();
  },
});

export const saveAssessmentResult = mutation({
  args: {
    deviceId: v.string(),
    answers: v.array(
      v.object({
        questionId: v.number(),
        value: v.number(),
      }),
    ),
    riasecScores: riasecScore,
    valuesScores: valuesScore,
    bigFiveScores: bigFiveScore,
    environment: v.object({
      teamSize: v.string(),
      pace: v.string(),
    }),
    careerMatches: v.array(
      v.object({
        careerId: v.string(),
        careerTitle: v.string(),
        matchScore: v.number(),
        reasoning: v.string(),
        sector: v.optional(v.string()),
        interestScore: v.optional(v.number()),
        valueScore: v.optional(v.number()),
        personalityScore: v.optional(v.number()),
        environmentScore: v.optional(v.number()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("assessmentResults", {
      ...args,
      completedAt: Date.now(),
    });
  },
});
