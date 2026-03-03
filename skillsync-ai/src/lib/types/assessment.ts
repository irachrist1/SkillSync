export type RiasecKey =
  | "realistic"
  | "investigative"
  | "artistic"
  | "social"
  | "enterprising"
  | "conventional";

export type ValuesKey = "impact" | "income" | "autonomy" | "balance" | "growth" | "stability";

export type BigFiveKey = "openness" | "conscientiousness" | "extraversion";

export type EnvironmentTeamSize =
  | "solo"
  | "independent"
  | "small"
  | "large"
  | "leader"
  | "minimal";

export type EnvironmentPace =
  | "steady"
  | "moderate"
  | "intense"
  | "flexible"
  | "deadline-driven"
  | "predictable";

export interface RiasecScore {
  realistic: number;
  investigative: number;
  artistic: number;
  social: number;
  enterprising: number;
  conventional: number;
}

export interface ValuesScore {
  impact: number;
  income: number;
  autonomy: number;
  balance: number;
  growth: number;
  stability: number;
}

export interface BigFiveScore {
  openness: number;
  conscientiousness: number;
  extraversion: number;
}

export interface EnvironmentPreference {
  teamSize: EnvironmentTeamSize;
  pace: EnvironmentPace;
}

export interface EnvironmentProfile {
  teamSize?: EnvironmentTeamSize | string;
  pace?: EnvironmentPace | string;
}

export interface AssessmentProfile {
  riasec: RiasecScore;
  values: ValuesScore;
  bigFive: BigFiveScore;
  environment: EnvironmentPreference;
}

export interface CareerProfile {
  id?: string;
  title: string;
  slug: string;
  description: string;
  sector: string;
  requiredEducation: string;
  growthOutlook: string;
  isActive: boolean;
  riasecProfile: RiasecScore;
  valuesProfile: ValuesScore;
  personalityProfile?: BigFiveScore;
  environmentProfile?: EnvironmentProfile;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface MatchBreakdown {
  interestScore: number;
  valueScore: number;
  personalityScore: number;
  environmentScore: number;
}

export interface MatchResult {
  careerId: string;
  careerTitle: string;
  sector: string;
  matchScore: number;
  reasoning: string;
  breakdown: MatchBreakdown;
}

export interface AssessmentAnswer {
  questionId: number;
  value: number;
}

export type AssessmentAnswersInput = Record<number, number> | Record<string, number> | AssessmentAnswer[];

export interface MatchWeights {
  interest: number;
  values: number;
  personality: number;
  environment: number;
}

export type WeightPreset = "skillsync" | "sparkLegacy";

export interface MatchOptions {
  limit?: number;
  preset?: WeightPreset;
  weights?: Partial<MatchWeights>;
}

export type AssessmentCategory = "riasec" | "values" | "bigFive" | "environment";

export interface LikertOption {
  value: 0 | 1 | 2 | 3 | 4;
  label: string;
}

export interface AssessmentQuestion {
  id: number;
  text: string;
  category: AssessmentCategory;
  subcategory: string;
  options: LikertOption[];
}
