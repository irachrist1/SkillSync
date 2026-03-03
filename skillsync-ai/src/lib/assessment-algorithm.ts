import type {
  AssessmentAnswer,
  AssessmentAnswersInput,
  AssessmentProfile,
  BigFiveScore,
  CareerProfile,
  EnvironmentPace,
  EnvironmentTeamSize,
  MatchOptions,
  MatchResult,
  MatchWeights,
  RiasecScore,
  ValuesScore,
  WeightPreset,
} from "@/lib/types/assessment";

const PRESET_WEIGHTS: Record<WeightPreset, MatchWeights> = {
  skillsync: {
    interest: 0.4,
    values: 0.3,
    personality: 0.2,
    environment: 0.1,
  },
  sparkLegacy: {
    interest: 0.4,
    values: 0.25,
    personality: 0.2,
    environment: 0.15,
  },
};

const TEAM_SIZE_ALIASES: Record<string, EnvironmentTeamSize> = {
  medium: "small",
  team: "small",
};

const PACE_ALIASES: Record<string, EnvironmentPace> = {
  fast: "intense",
};

function toNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.min(4, Math.round(value)));
  }
  return 0;
}

function normalizeAnswers(input: AssessmentAnswersInput): Record<number, number> {
  if (Array.isArray(input)) {
    return input.reduce<Record<number, number>>((acc, answer: AssessmentAnswer) => {
      acc[answer.questionId] = toNumber(answer.value);
      return acc;
    }, {});
  }

  const out: Record<number, number> = {};
  Object.entries(input).forEach(([key, value]) => {
    const numericKey = Number(key);
    if (!Number.isNaN(numericKey)) {
      out[numericKey] = toNumber(value);
    }
  });
  return out;
}

function normalizeVector(values: number[]): number[] {
  const magnitude = Math.sqrt(values.reduce((sum, value) => sum + value * value, 0));
  if (magnitude === 0) return values.map(() => 0);
  return values.map((value) => value / magnitude);
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  const na = normalizeVector(a);
  const nb = normalizeVector(b);
  const dot = na.reduce((sum, value, index) => sum + value * (nb[index] ?? 0), 0);
  return Math.max(0, Math.min(1, dot));
}

function riasecToVector(score: RiasecScore): number[] {
  return [
    score.realistic,
    score.investigative,
    score.artistic,
    score.social,
    score.enterprising,
    score.conventional,
  ];
}

function valuesToVector(score: ValuesScore): number[] {
  return [score.impact, score.income, score.autonomy, score.balance, score.growth, score.stability];
}

function bigFiveToVector(score: BigFiveScore): number[] {
  return [score.openness, score.conscientiousness, score.extraversion];
}

function normalizeTeamSize(input: string | undefined): EnvironmentTeamSize | undefined {
  if (!input) return undefined;
  if (input in TEAM_SIZE_ALIASES) return TEAM_SIZE_ALIASES[input];
  const normalized = input as EnvironmentTeamSize;
  if (["solo", "independent", "small", "large", "leader", "minimal"].includes(normalized)) {
    return normalized;
  }
  return undefined;
}

function normalizePace(input: string | undefined): EnvironmentPace | undefined {
  if (!input) return undefined;
  if (input in PACE_ALIASES) return PACE_ALIASES[input];
  const normalized = input as EnvironmentPace;
  if (["steady", "moderate", "intense", "flexible", "deadline-driven", "predictable"].includes(normalized)) {
    return normalized;
  }
  return undefined;
}

function environmentMatch(
  profile: AssessmentProfile,
  career: CareerProfile,
): number {
  const teamSize = normalizeTeamSize(career.environmentProfile?.teamSize);
  const pace = normalizePace(career.environmentProfile?.pace);

  if (!teamSize && !pace) {
    return 0.5;
  }

  let score = 0;
  let checks = 0;

  if (teamSize) {
    checks += 1;
    if (teamSize === profile.environment.teamSize) score += 1;
  }

  if (pace) {
    checks += 1;
    if (pace === profile.environment.pace) score += 1;
  }

  return checks === 0 ? 0.5 : score / checks;
}

function getTopValue(values: ValuesScore): keyof ValuesScore {
  const entries = Object.entries(values) as Array<[keyof ValuesScore, number]>;
  entries.sort((a, b) => b[1] - a[1]);
  const top = entries[0];
  return top ? top[0] : "growth";
}

function riasecLabel(key: string): string {
  return key.slice(0, 1).toUpperCase() + key.slice(1);
}

function formatReasoning(profile: AssessmentProfile, career: CareerProfile): string {
  const profileTop = getTop3RIASEC(profile.riasec);
  const careerTop = getTop3RIASEC(career.riasecProfile);
  const overlap = profileTop.filter((item) => careerTop.includes(item));

  const topValue = getTopValue(profile.values);
  const valueCopy: Record<keyof ValuesScore, string> = {
    impact: "social impact",
    income: "financial growth",
    autonomy: "independence",
    balance: "work-life balance",
    growth: "career growth",
    stability: "stability",
  };

  const pieces: string[] = [];

  if (overlap.length >= 2) {
    pieces.push(`Strong RIASEC overlap in ${overlap.join(" and ")}.`);
  } else if (overlap.length === 1) {
    pieces.push(`Strong interest alignment in ${overlap[0]}.`);
  }

  pieces.push(`This path aligns with your priority for ${valueCopy[topValue]}.`);

  const teamSize = normalizeTeamSize(career.environmentProfile?.teamSize);
  if (teamSize && teamSize === profile.environment.teamSize) {
    pieces.push("The team environment fits how you prefer to work.");
  }

  return pieces.join(" ");
}

function resolveWeights(options: MatchOptions | undefined): MatchWeights {
  const presetWeights = PRESET_WEIGHTS[options?.preset ?? "skillsync"];
  const merged: MatchWeights = {
    interest: options?.weights?.interest ?? presetWeights.interest,
    values: options?.weights?.values ?? presetWeights.values,
    personality: options?.weights?.personality ?? presetWeights.personality,
    environment: options?.weights?.environment ?? presetWeights.environment,
  };

  const total = merged.interest + merged.values + merged.personality + merged.environment;
  if (total <= 0) {
    return presetWeights;
  }

  return {
    interest: merged.interest / total,
    values: merged.values / total,
    personality: merged.personality / total,
    environment: merged.environment / total,
  };
}

function pickEnvironment(answers: Record<number, number>) {
  const collaboration = answers[23] ?? 2;
  const predictable = answers[24] ?? 2;
  const leadership = answers[25] ?? 2;

  const teamScores: Record<EnvironmentTeamSize, number> = {
    solo: (4 - collaboration) + (4 - leadership),
    independent: (4 - leadership) + Math.max(0, 2 - collaboration),
    small: 4 - Math.abs(2 - collaboration),
    large: collaboration,
    leader: leadership,
    minimal: Math.max(0, 3 - collaboration) + Math.max(0, 2 - leadership),
  };

  const paceScores: Record<EnvironmentPace, number> = {
    steady: predictable,
    moderate: 4 - Math.abs(2 - predictable),
    intense: collaboration,
    flexible: (4 - predictable) + Math.max(0, 2 - collaboration),
    "deadline-driven": leadership,
    predictable,
  };

  const teamSize = (Object.entries(teamScores) as Array<[EnvironmentTeamSize, number]>).sort(
    (a, b) => b[1] - a[1],
  )[0]?.[0] ?? "small";

  const pace =
    (Object.entries(paceScores) as Array<[EnvironmentPace, number]>).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "moderate";

  return { teamSize, pace };
}

export function getTop3RIASEC(profile: RiasecScore): string[] {
  const entries = Object.entries(profile) as Array<[keyof RiasecScore, number]>;
  return entries
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key]) => riasecLabel(key));
}

export function calculateProfileFromAnswers(answersInput: AssessmentAnswersInput): AssessmentProfile {
  const answers = normalizeAnswers(answersInput);

  const riasec: RiasecScore = {
    realistic: ((answers[1] ?? 0) + (answers[2] ?? 0)) * 10,
    investigative: ((answers[3] ?? 0) + (answers[4] ?? 0)) * 10,
    artistic: ((answers[5] ?? 0) + (answers[6] ?? 0)) * 10,
    social: ((answers[7] ?? 0) + (answers[8] ?? 0)) * 10,
    enterprising: ((answers[9] ?? 0) + (answers[10] ?? 0)) * 10,
    conventional: ((answers[11] ?? 0) + (answers[12] ?? 0)) * 10,
  };

  const values: ValuesScore = {
    impact: (answers[13] ?? 0) * 15,
    income: (answers[14] ?? 0) * 15,
    autonomy: (answers[15] ?? 0) * 15,
    balance: (answers[16] ?? 0) * 15,
    growth: (answers[17] ?? 0) * 15,
    stability: (answers[18] ?? 0) * 15,
  };

  const conscientiousness = (((answers[20] ?? 0) * 25) + ((4 - (answers[21] ?? 0)) * 25)) / 2;

  const bigFive: BigFiveScore = {
    openness: (answers[19] ?? 0) * 25,
    conscientiousness,
    extraversion: (answers[22] ?? 0) * 25,
  };

  return {
    riasec,
    values,
    bigFive,
    environment: pickEnvironment(answers),
  };
}

export function matchStudentToCareers(
  profile: AssessmentProfile,
  careers: CareerProfile[],
  options?: MatchOptions,
): MatchResult[] {
  const weights = resolveWeights(options);
  const limit = options?.limit ?? 25;

  const results = careers
    .filter((career) => career.isActive)
    .map((career) => {
      const interestScore = cosineSimilarity(riasecToVector(profile.riasec), riasecToVector(career.riasecProfile));
      const valueScore = cosineSimilarity(valuesToVector(profile.values), valuesToVector(career.valuesProfile));
      const personalityScore = career.personalityProfile
        ? cosineSimilarity(bigFiveToVector(profile.bigFive), bigFiveToVector(career.personalityProfile))
        : 0.5;
      const environmentScore = environmentMatch(profile, career);

      const weighted =
        interestScore * weights.interest +
        valueScore * weights.values +
        personalityScore * weights.personality +
        environmentScore * weights.environment;

      return {
        careerId: career.slug,
        careerTitle: career.title,
        sector: career.sector,
        matchScore: Math.round(weighted * 100),
        reasoning: formatReasoning(profile, career),
        breakdown: {
          interestScore: Math.round(interestScore * 100),
          valueScore: Math.round(valueScore * 100),
          personalityScore: Math.round(personalityScore * 100),
          environmentScore: Math.round(environmentScore * 100),
        },
      } satisfies MatchResult;
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  return results.slice(0, limit);
}

export const MATCH_WEIGHT_PRESETS = PRESET_WEIGHTS;
