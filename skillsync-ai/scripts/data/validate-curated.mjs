import { assertBusinessRules, getDatasetVersion, loadCuratedData } from "./common.mjs";

async function main() {
  const data = await loadCuratedData();
  assertBusinessRules(data);

  console.log(`Curated dataset validation passed (${getDatasetVersion()}).`);
  console.log(`taxonomy=${data.taxonomy.length} jobs=${data.jobs.length} resources=${data.resources.length} insights=${data.marketInsights.length}`);
}

main().catch((error) => {
  console.error("Curated dataset validation failed:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
