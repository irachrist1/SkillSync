import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const taxonomyItem = v.object({
  categoryId: v.string(),
  name: v.string(),
  description: v.string(),
  demandLevel: v.union(v.literal("very-high"), v.literal("high"), v.literal("medium"), v.literal("low")),
  avgSalaryImpact: v.number(),
  skills: v.array(v.string()),
});

const jobItem = v.object({
  externalId: v.string(),
  title: v.string(),
  company: v.string(),
  location: v.string(),
  industry: v.string(),
  salaryMin: v.number(),
  salaryMax: v.number(),
  currency: v.union(v.literal("RWF"), v.literal("USD")),
  requiredSkills: v.array(v.string()),
  preferredSkills: v.array(v.string()),
  level: v.union(v.literal("entry"), v.literal("mid"), v.literal("senior"), v.literal("lead")),
  jobType: v.union(v.literal("full-time"), v.literal("part-time"), v.literal("contract"), v.literal("internship")),
  isRemote: v.boolean(),
  postedAt: v.number(),
  source: v.string(),
  active: v.boolean(),
});

const resourceItem = v.object({
  resourceId: v.string(),
  title: v.string(),
  provider: v.string(),
  type: v.union(v.literal("video"), v.literal("course"), v.literal("article"), v.literal("tutorial"), v.literal("project"), v.literal("certification")),
  url: v.string(),
  duration: v.string(),
  difficulty: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
  cost: v.union(v.literal("free"), v.literal("paid")),
  rating: v.optional(v.number()),
  tags: v.array(v.string()),
});

export const importCuratedData = mutation({
  args: {
    token: v.string(),
    checksum: v.string(),
    version: v.string(),
    taxonomy: v.array(taxonomyItem),
    jobs: v.array(jobItem),
    resources: v.array(resourceItem),
    marketInsights: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const expectedToken = process.env.SKILLSYNC_ADMIN_IMPORT_TOKEN;
    if (expectedToken) {
      if (args.token !== expectedToken) {
        throw new Error("Unauthorized import request");
      }
    } else if (args.token.length < 16) {
      throw new Error("Import token does not meet minimum length requirement");
    }

    const now = Date.now();

    for (const item of args.taxonomy) {
      const existing = await ctx.db
        .query("skillTaxonomy")
        .withIndex("by_categoryId", (q) => q.eq("categoryId", item.categoryId))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, item);
      } else {
        await ctx.db.insert("skillTaxonomy", item);
      }
    }

    for (const job of args.jobs) {
      const existing = await ctx.db
        .query("jobListings")
        .withIndex("by_externalId", (q) => q.eq("externalId", job.externalId))
        .first();

      const payload = {
        ...job,
        updatedAt: now,
      };

      if (existing) {
        await ctx.db.patch(existing._id, payload);
      } else {
        await ctx.db.insert("jobListings", payload);
      }
    }

    for (const resource of args.resources) {
      const existing = await ctx.db
        .query("learningResources")
        .withIndex("by_resourceId", (q) => q.eq("resourceId", resource.resourceId))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, resource);
      } else {
        await ctx.db.insert("learningResources", resource);
      }
    }

    const existingInsights = await ctx.db
      .query("marketInsights")
      .withIndex("by_version", (q) => q.eq("version", args.version))
      .collect();

    for (const row of existingInsights) {
      await ctx.db.delete(row._id);
    }

    for (const insight of args.marketInsights) {
      await ctx.db.insert("marketInsights", {
        version: args.version,
        insight,
      });
    }

    await ctx.db.insert("dataImports", {
      datasetType: "curated",
      version: args.version,
      checksum: args.checksum,
      importedAt: now,
      recordCount: args.taxonomy.length + args.jobs.length + args.resources.length + args.marketInsights.length,
      status: "success",
      errors: [],
    });

    return {
      importedAt: now,
      taxonomy: args.taxonomy.length,
      jobs: args.jobs.length,
      resources: args.resources.length,
      marketInsights: args.marketInsights.length,
      version: args.version,
    };
  },
});

export const getLatestDataFreshness = query({
  args: {},
  handler: async (ctx) => {
    const latestImport = await ctx.db.query("dataImports").order("desc").first();
    const latestJob = await ctx.db.query("jobListings").order("desc").first();

    return {
      latestImport,
      latestJobUpdatedAt: latestJob?.updatedAt ?? null,
    };
  },
});
