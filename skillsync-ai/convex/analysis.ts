import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAnalysisContext = query({
  args: {},
  handler: async (ctx) => {
    const [jobs, resources, insights] = await Promise.all([
      ctx.db
        .query("jobListings")
        .withIndex("by_active", (q) => q.eq("active", true))
        .collect(),
      ctx.db.query("learningResources").collect(),
      ctx.db.query("marketInsights").collect(),
    ]);

    return {
      jobs,
      resources,
      insights: insights.map((item) => item.insight),
    };
  },
});

export const saveAnalysis = mutation({
  args: {
    userId: v.id("users"),
    profileVersion: v.number(),
    source: v.union(v.literal("ai"), v.literal("fallback")),
    fallbackReason: v.optional(v.string()),
    recommendations: v.any(),
    marketInsights: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("analyses", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getLatestAnalysis = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("analyses")
      .withIndex("by_user_created", (q) => q.eq("userId", args.userId))
      .order("desc")
      .first();
  },
});
