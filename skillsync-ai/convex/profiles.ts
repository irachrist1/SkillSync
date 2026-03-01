import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const skillValue = v.object({
  id: v.string(),
  name: v.string(),
  category: v.union(v.literal("technical"), v.literal("digital"), v.literal("soft"), v.literal("language")),
  level: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced"), v.literal("expert")),
  yearsExperience: v.optional(v.number()),
  certifications: v.optional(v.array(v.string())),
});

export const saveSkillProfile = mutation({
  args: {
    userId: v.id("users"),
    skills: v.array(skillValue),
    experienceText: v.string(),
    preferredIndustries: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const latest = await ctx.db
      .query("skillProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .first();

    const nextVersion = latest ? latest.version + 1 : 1;
    const profileId = await ctx.db.insert("skillProfiles", {
      userId: args.userId,
      skills: args.skills,
      experienceText: args.experienceText,
      preferredIndustries: args.preferredIndustries,
      version: nextVersion,
      updatedAt: Date.now(),
    });

    return { profileId, version: nextVersion };
  },
});

export const getLatestSkillProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("skillProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .first();
  },
});

export const getSkillProfileById = query({
  args: { profileId: v.id("skillProfiles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.profileId);
  },
});
