import { describe, expect, it } from "vitest";

async function loadHelpers() {
  return await import("../../scripts/data/common.mjs");
}

describe("curated data pipeline", () => {
  it("loads and validates curated datasets", async () => {
    const { loadCuratedData, assertBusinessRules } = await loadHelpers();
    const data = await loadCuratedData();

    expect(data.jobs.length).toBeGreaterThan(0);
    expect(data.resources.length).toBeGreaterThan(0);
    expect(data.taxonomy.length).toBeGreaterThan(0);

    expect(() => assertBusinessRules(data)).not.toThrow();
  });

  it("produces stable checksum for same payload", async () => {
    const { loadCuratedData, checksumDataset } = await loadHelpers();
    const first = await loadCuratedData();
    const second = await loadCuratedData();

    expect(checksumDataset(first)).toBe(checksumDataset(second));
  });
});
