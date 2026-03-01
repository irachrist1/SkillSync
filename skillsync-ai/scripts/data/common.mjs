import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "../..");
const curatedDir = path.join(root, "data/curated");

export const taxonomySchema = z.array(
  z.object({
    categoryId: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    demandLevel: z.enum(["very-high", "high", "medium", "low"]),
    avgSalaryImpact: z.number().nonnegative(),
    skills: z.array(z.string().min(1)).min(1),
  }),
);

export const jobSchema = z.array(
  z.object({
    externalId: z.string().min(1),
    title: z.string().min(1),
    company: z.string().min(1),
    location: z.string().min(1),
    industry: z.string().min(1),
    salaryMin: z.number().nonnegative(),
    salaryMax: z.number().nonnegative(),
    currency: z.enum(["RWF", "USD"]),
    requiredSkills: z.array(z.string().min(1)).min(1),
    preferredSkills: z.array(z.string().min(1)),
    level: z.enum(["entry", "mid", "senior", "lead"]),
    jobType: z.enum(["full-time", "part-time", "contract", "internship"]),
    isRemote: z.boolean(),
    postedAt: z.number().int(),
    source: z.string().min(1),
    active: z.boolean(),
  }),
);

export const resourceSchema = z.array(
  z.object({
    resourceId: z.string().min(1),
    title: z.string().min(1),
    provider: z.string().min(1),
    type: z.enum(["video", "course", "article", "tutorial", "project", "certification"]),
    url: z.string().url(),
    duration: z.string().min(1),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]),
    cost: z.enum(["free", "paid"]),
    rating: z.number().min(0).max(5).optional(),
    tags: z.array(z.string().min(1)).min(1),
  }),
);

export const marketInsightsSchema = z.array(z.string().min(1)).min(1);

export async function loadCuratedData() {
  const [taxonomyRaw, jobsRaw, resourcesRaw, insightsRaw] = await Promise.all([
    readFile(path.join(curatedDir, "skills.taxonomy.v1.json"), "utf8"),
    readFile(path.join(curatedDir, "jobs.rw.v1.json"), "utf8"),
    readFile(path.join(curatedDir, "learning.resources.v1.json"), "utf8"),
    readFile(path.join(curatedDir, "market.insights.v1.json"), "utf8"),
  ]);

  const taxonomy = taxonomySchema.parse(JSON.parse(taxonomyRaw));
  const jobs = jobSchema.parse(JSON.parse(jobsRaw));
  const resources = resourceSchema.parse(JSON.parse(resourcesRaw));
  const marketInsights = marketInsightsSchema.parse(JSON.parse(insightsRaw));

  return {
    taxonomy,
    jobs,
    resources,
    marketInsights,
  };
}

export function checksumDataset(payload) {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

export function ensureNoDuplicates(entries, key, label) {
  const seen = new Set();
  for (const item of entries) {
    const value = item[key];
    if (seen.has(value)) {
      throw new Error(`Duplicate ${label} detected: ${String(value)}`);
    }
    seen.add(value);
  }
}

export function assertBusinessRules(data) {
  for (const job of data.jobs) {
    if (job.salaryMin > job.salaryMax) {
      throw new Error(`Invalid salary range for ${job.externalId}: min greater than max`);
    }
  }

  ensureNoDuplicates(data.taxonomy, "categoryId", "categoryId");
  ensureNoDuplicates(data.jobs, "externalId", "externalId");
  ensureNoDuplicates(data.resources, "resourceId", "resourceId");
}

export function getDatasetVersion() {
  return "v1";
}
