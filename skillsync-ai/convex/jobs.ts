import { query } from "./_generated/server";
import { v } from "convex/values";
import { calculateJobMatchScore, getMissingSkills, type JobListingInput, type UserSkillInput } from "./lib/analysis";

export const listMatchedJobs = query({
  args: {
    profileId: v.id("skillProfiles"),
    filters: v.optional(
      v.object({
        industry: v.optional(v.string()),
        level: v.optional(v.union(v.literal("entry"), v.literal("mid"), v.literal("senior"), v.literal("lead"))),
        remoteOnly: v.optional(v.boolean()),
        minSalary: v.optional(v.number()),
        maxSalary: v.optional(v.number()),
      }),
    ),
    sortBy: v.optional(v.union(v.literal("match"), v.literal("salary"), v.literal("recency"))),
    sortDirection: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
    page: v.optional(v.number()),
    pageSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.profileId);
    if (!profile) {
      throw new Error("Profile not found");
    }

    const jobs = await ctx.db
      .query("jobListings")
      .withIndex("by_active", (q) => q.eq("active", true))
      .collect();

    const filters = args.filters ?? {};
    const filtered = jobs.filter((job) => {
      if (filters.industry && job.industry !== filters.industry) return false;
      if (filters.level && job.level !== filters.level) return false;
      if (filters.remoteOnly && !job.isRemote) return false;
      if (typeof filters.minSalary === "number" && job.salaryMax < filters.minSalary) return false;
      if (typeof filters.maxSalary === "number" && job.salaryMin > filters.maxSalary) return false;
      return true;
    });

    const scored = filtered.map((job) => {
      const projectionJob: JobListingInput = {
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
      };

      const userSkills = profile.skills as UserSkillInput[];
      const matchScore = calculateJobMatchScore(userSkills, projectionJob);
      const missingSkills = getMissingSkills(userSkills, projectionJob);

      return {
        ...job,
        matchScore,
        missingSkills,
      };
    });

    const sortBy = args.sortBy ?? "match";
    const direction = args.sortDirection ?? "desc";

    scored.sort((a, b) => {
      const dir = direction === "asc" ? 1 : -1;
      if (sortBy === "salary") {
        const aSalary = (a.salaryMin + a.salaryMax) / 2;
        const bSalary = (b.salaryMin + b.salaryMax) / 2;
        return (aSalary - bSalary) * dir;
      }
      if (sortBy === "recency") {
        return (a.postedAt - b.postedAt) * dir;
      }
      return (a.matchScore - b.matchScore) * dir;
    });

    const page = Math.max(args.page ?? 1, 1);
    const pageSize = Math.min(Math.max(args.pageSize ?? 10, 1), 50);
    const start = (page - 1) * pageSize;
    const paged = scored.slice(start, start + pageSize);

    return {
      jobs: paged,
      total: scored.length,
      page,
      pageSize,
      hasNextPage: start + pageSize < scored.length,
      industries: [...new Set(jobs.map((job) => job.industry))],
    };
  },
});

export const getJobById = query({
  args: { jobId: v.id("jobListings") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.jobId);
  },
});
