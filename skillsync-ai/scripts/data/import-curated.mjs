import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import {
  assertBusinessRules,
  checksumDataset,
  getDatasetVersion,
  loadCuratedData,
} from "./common.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

loadEnv({ path: path.join(projectRoot, ".env.local") });

async function main() {
  const token = process.env.SKILLSYNC_ADMIN_IMPORT_TOKEN;
  if (!token) {
    throw new Error("SKILLSYNC_ADMIN_IMPORT_TOKEN is required in environment.");
  }

  const data = await loadCuratedData();
  assertBusinessRules(data);

  const payload = {
    token,
    version: getDatasetVersion(),
    checksum: checksumDataset(data),
    taxonomy: data.taxonomy,
    jobs: data.jobs,
    resources: data.resources,
    marketInsights: data.marketInsights,
  };

  const run = spawnSync(
    "npx",
    ["convex", "run", "admin:importCuratedData", JSON.stringify(payload)],
    {
      cwd: projectRoot,
      env: process.env,
      stdio: "inherit",
      shell: process.platform === "win32",
    },
  );

  if (run.status !== 0) {
    throw new Error("Convex import command failed.");
  }
}

main().catch((error) => {
  console.error("Curated data import failed:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
