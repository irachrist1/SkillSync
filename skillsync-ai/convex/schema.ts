import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const skillValue = v.object({
  id: v.string(),
  name: v.string(),
  category: v.union(v.literal("technical"), v.literal("digital"), v.literal("soft"), v.literal("language")),
  level: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced"), v.literal("expert")),
  yearsExperience: v.optional(v.number()),
  certifications: v.optional(v.array(v.string())),
});

export default defineSchema({
  users: defineTable({
    deviceId: v.string(),
    locale: v.string(),
    timezone: v.string(),
    createdAt: v.number(),
    lastSeenAt: v.number(),
  }).index("by_deviceId", ["deviceId"]),

  skillProfiles: defineTable({
    userId: v.id("users"),
    skills: v.array(skillValue),
    experienceText: v.string(),
    preferredIndustries: v.array(v.string()),
    version: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_version", ["userId", "version"]),

  analyses: defineTable({
    userId: v.id("users"),
    profileVersion: v.number(),
    source: v.union(v.literal("ai"), v.literal("fallback")),
    fallbackReason: v.optional(v.string()),
    recommendations: v.any(),
    marketInsights: v.array(v.string()),
    createdAt: v.number(),
  }).index("by_user_created", ["userId", "createdAt"]),

  learningProgress: defineTable({
    userId: v.id("users"),
    targetSkill: v.string(),
    phaseId: v.string(),
    completedResourceIds: v.array(v.string()),
    milestonesDone: v.array(v.string()),
    minutesSpent: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_skill", ["userId", "targetSkill"]),

  jobListings: defineTable({
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
    updatedAt: v.number(),
  })
    .index("by_externalId", ["externalId"])
    .index("by_active", ["active"]),

  skillTaxonomy: defineTable({
    categoryId: v.string(),
    name: v.string(),
    description: v.string(),
    demandLevel: v.union(v.literal("very-high"), v.literal("high"), v.literal("medium"), v.literal("low")),
    avgSalaryImpact: v.number(),
    skills: v.array(v.string()),
  }).index("by_categoryId", ["categoryId"]),

  learningResources: defineTable({
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
  }).index("by_resourceId", ["resourceId"]),

  marketInsights: defineTable({
    version: v.string(),
    insight: v.string(),
  }).index("by_version", ["version"]),

  dataImports: defineTable({
    datasetType: v.string(),
    version: v.string(),
    checksum: v.string(),
    importedAt: v.number(),
    recordCount: v.number(),
    status: v.union(v.literal("success"), v.literal("failed")),
    errors: v.array(v.string()),
  }).index("by_dataset_version", ["datasetType", "version"]),

  assessmentResults: defineTable({
    deviceId: v.string(),
    answers: v.array(
      v.object({
        questionId: v.number(),
        value: v.number(),
      }),
    ),
    riasecScores: v.object({
      realistic: v.number(),
      investigative: v.number(),
      artistic: v.number(),
      social: v.number(),
      enterprising: v.number(),
      conventional: v.number(),
    }),
    valuesScores: v.object({
      impact: v.number(),
      income: v.number(),
      autonomy: v.number(),
      balance: v.number(),
      growth: v.number(),
      stability: v.number(),
    }),
    bigFiveScores: v.object({
      openness: v.number(),
      conscientiousness: v.number(),
      extraversion: v.number(),
    }),
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
    completedAt: v.number(),
  }).index("by_deviceId", ["deviceId"]),

  careerProfiles: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    riasecProfile: v.object({
      realistic: v.number(),
      investigative: v.number(),
      artistic: v.number(),
      social: v.number(),
      enterprising: v.number(),
      conventional: v.number(),
    }),
    valuesProfile: v.object({
      impact: v.number(),
      income: v.number(),
      autonomy: v.number(),
      balance: v.number(),
      growth: v.number(),
      stability: v.number(),
    }),
    personalityProfile: v.optional(
      v.object({
        openness: v.number(),
        conscientiousness: v.number(),
        extraversion: v.number(),
      }),
    ),
    environmentProfile: v.optional(
      v.object({
        teamSize: v.optional(v.string()),
        pace: v.optional(v.string()),
        structure: v.optional(v.string()),
      }),
    ),
    salaryRange: v.optional(
      v.object({
        min: v.number(),
        max: v.number(),
        currency: v.string(),
      }),
    ),
    sector: v.string(),
    growthOutlook: v.string(),
    requiredEducation: v.string(),
    isActive: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_active", ["isActive"]),
});
