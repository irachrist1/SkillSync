import { query } from "./_generated/server";

export const getSkillTaxonomy = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("skillTaxonomy").collect();
  },
});

export const getLearningResources = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("learningResources").collect();
  },
});

export const getMarketInsights = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("marketInsights").collect();
  },
});
