// Legacy seed reference. Canonical production data now lives in `data/curated/*.json`
// and is imported into Convex via `npm run data:import`.

export const RWANDA_SEED_NOTE = {
  datasetLocation: "data/curated",
  importCommand: "npm run data:import",
  validationCommand: "npm run data:validate",
} as const;
