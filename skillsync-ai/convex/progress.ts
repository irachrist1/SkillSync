import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const updateLearningProgress = mutation({
  args: {
    userId: v.id("users"),
    targetSkill: v.string(),
    phaseId: v.string(),
    completedResourceIds: v.array(v.string()),
    milestonesDone: v.array(v.string()),
    minutesSpent: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("learningProgress")
      .withIndex("by_user_skill", (q) => q.eq("userId", args.userId).eq("targetSkill", args.targetSkill))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        phaseId: args.phaseId,
        completedResourceIds: args.completedResourceIds,
        milestonesDone: args.milestonesDone,
        minutesSpent: args.minutesSpent,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("learningProgress", {
      ...args,
      updatedAt: Date.now(),
    });
  },
});

export const getUserProgress = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("learningProgress")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});
