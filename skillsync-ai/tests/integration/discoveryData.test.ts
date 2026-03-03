import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

interface CareerProfileRecord {
  title: string;
  slug: string;
  sector: string;
  isActive: boolean;
  riasecProfile: Record<string, number>;
  valuesProfile: Record<string, number>;
}

const dataPath = path.resolve(process.cwd(), "data", "career-profiles.json");

describe("career profile import dataset", () => {
  it("contains active profiles with required scoring fields", async () => {
    const raw = await readFile(dataPath, "utf8");
    const profiles = JSON.parse(raw) as CareerProfileRecord[];

    expect(profiles.length).toBeGreaterThan(0);

    for (const profile of profiles) {
      expect(profile.title.length).toBeGreaterThan(0);
      expect(profile.slug.length).toBeGreaterThan(0);
      expect(profile.sector.length).toBeGreaterThan(0);
      expect(profile.isActive).toBe(true);
      expect(Object.keys(profile.riasecProfile)).toHaveLength(6);
      expect(Object.keys(profile.valuesProfile)).toHaveLength(6);
    }
  });

  it("uses unique slugs for idempotent upsert imports", async () => {
    const raw = await readFile(dataPath, "utf8");
    const profiles = JSON.parse(raw) as CareerProfileRecord[];

    const slugs = profiles.map((profile) => profile.slug);
    const unique = new Set(slugs);

    expect(unique.size).toBe(slugs.length);
  });
});
