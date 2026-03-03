import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";

interface CareerProfilePayload {
  title: string;
  slug: string;
  description: string;
  riasecProfile: {
    realistic: number;
    investigative: number;
    artistic: number;
    social: number;
    enterprising: number;
    conventional: number;
  };
  valuesProfile: {
    impact: number;
    income: number;
    autonomy: number;
    balance: number;
    growth: number;
    stability: number;
  };
  personalityProfile?: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
  };
  environmentProfile?: {
    teamSize?: string;
    pace?: string;
    structure?: string;
  };
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  sector: string;
  growthOutlook: string;
  requiredEducation: string;
  isActive: boolean;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const dataPath = path.join(projectRoot, "data", "career-profiles.json");

loadEnv({ path: path.join(projectRoot, ".env.local") });

function main() {
  const token = process.env.SKILLSYNC_ADMIN_IMPORT_TOKEN ?? "local-career-import-token";
  const raw = readFileSync(dataPath, "utf8");
  const profiles = JSON.parse(raw) as CareerProfilePayload[];

  if (!Array.isArray(profiles) || profiles.length === 0) {
    throw new Error("data/career-profiles.json is empty or invalid.");
  }

  const payload = {
    token,
    profiles,
  };

  const run = spawnSync(
    "npx",
    ["convex", "run", "admin:importCareerProfiles", JSON.stringify(payload)],
    {
      cwd: projectRoot,
      env: process.env,
      stdio: "inherit",
      shell: process.platform === "win32",
    },
  );

  if (run.status !== 0) {
    throw new Error("Career profile import command failed.");
  }
}

try {
  main();
} catch (error) {
  console.error("Career profile import failed:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
