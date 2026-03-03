import { describe, expect, it } from "vitest";
import {
  MATCH_WEIGHT_PRESETS,
  calculateProfileFromAnswers,
  getTop3RIASEC,
  matchStudentToCareers,
} from "@/lib/assessment-algorithm";
import type { CareerProfile } from "@/lib/types/assessment";

const careers: CareerProfile[] = [
  {
    title: "Software Developer",
    slug: "software-developer",
    description: "Build software",
    sector: "Technology",
    requiredEducation: "Bachelor's",
    growthOutlook: "High",
    isActive: true,
    riasecProfile: {
      realistic: 20,
      investigative: 90,
      artistic: 55,
      social: 30,
      enterprising: 45,
      conventional: 30,
    },
    valuesProfile: {
      impact: 65,
      income: 80,
      autonomy: 70,
      balance: 55,
      growth: 90,
      stability: 60,
    },
    personalityProfile: {
      openness: 80,
      conscientiousness: 70,
      extraversion: 45,
    },
    environmentProfile: {
      teamSize: "small",
      pace: "moderate",
    },
  },
  {
    title: "Nurse",
    slug: "nurse",
    description: "Provide healthcare support",
    sector: "Healthcare",
    requiredEducation: "Diploma",
    growthOutlook: "High",
    isActive: true,
    riasecProfile: {
      realistic: 40,
      investigative: 55,
      artistic: 20,
      social: 95,
      enterprising: 40,
      conventional: 50,
    },
    valuesProfile: {
      impact: 95,
      income: 50,
      autonomy: 40,
      balance: 55,
      growth: 65,
      stability: 80,
    },
    personalityProfile: {
      openness: 55,
      conscientiousness: 85,
      extraversion: 65,
    },
    environmentProfile: {
      teamSize: "large",
      pace: "intense",
    },
  },
];

describe("assessment algorithm", () => {
  it("calculates profile from 25-likert answers", () => {
    const answers = Array.from({ length: 25 }, (_, index) => ({
      questionId: index + 1,
      value: 4,
    }));

    const profile = calculateProfileFromAnswers(answers);

    expect(profile.riasec.investigative).toBe(80);
    expect(profile.values.income).toBe(60);
    expect(profile.bigFive.openness).toBe(100);
    expect(profile.environment.teamSize).toBeDefined();
    expect(profile.environment.pace).toBeDefined();
  });

  it("returns top RIASEC dimensions in descending order", () => {
    const top = getTop3RIASEC({
      realistic: 10,
      investigative: 60,
      artistic: 20,
      social: 40,
      enterprising: 30,
      conventional: 5,
    });

    expect(top).toEqual(["Investigative", "Social", "Enterprising"]);
  });

  it("supports default and legacy presets with normalized weighting", () => {
    const answers = {
      1: 1,
      2: 1,
      3: 4,
      4: 4,
      5: 3,
      6: 2,
      7: 1,
      8: 1,
      9: 2,
      10: 2,
      11: 3,
      12: 3,
      13: 3,
      14: 4,
      15: 4,
      16: 2,
      17: 4,
      18: 2,
      19: 4,
      20: 3,
      21: 1,
      22: 2,
      23: 2,
      24: 3,
      25: 2,
    };

    const profile = calculateProfileFromAnswers(answers);
    const skillsync = matchStudentToCareers(profile, careers, { preset: "skillsync", limit: 2 });
    const legacy = matchStudentToCareers(profile, careers, { preset: "sparkLegacy", limit: 2 });

    expect(skillsync).toHaveLength(2);
    expect(legacy).toHaveLength(2);
    expect(skillsync[0]?.careerId).toBe("software-developer");
    expect(MATCH_WEIGHT_PRESETS.skillsync.values).toBeGreaterThan(MATCH_WEIGHT_PRESETS.sparkLegacy.values);
  });

  it("sorts by match score and applies limit", () => {
    const answers = Array.from({ length: 25 }, (_, index) => ({
      questionId: index + 1,
      value: index % 5,
    }));

    const profile = calculateProfileFromAnswers(answers);
    const matches = matchStudentToCareers(profile, careers, { limit: 1 });

    expect(matches).toHaveLength(1);
    expect(matches[0]?.matchScore).toBeGreaterThanOrEqual(0);
    expect(matches[0]?.matchScore).toBeLessThanOrEqual(100);
  });
});
