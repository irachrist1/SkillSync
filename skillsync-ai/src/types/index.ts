export type Currency = "RWF" | "USD";

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type SkillCategoryType = "technical" | "digital" | "soft" | "language";

export type JobLevel = "entry" | "mid" | "senior" | "lead";

export type JobType = "full-time" | "part-time" | "contract" | "internship";

export type DemandLevel = "very-high" | "high" | "medium" | "low";

export type AnalysisSource = "ai" | "fallback";

export type FallbackReason =
  | "AI unavailable"
  | "AI timeout"
  | "AI invalid format"
  | "AI parse failure"
  | "Unknown AI failure"
  | string;

export type ProfileVersion = number;

export interface DataFreshness {
  latestImportAt: number | null;
  latestJobUpdatedAt: number | null;
  importVersion: string | null;
}

export interface UserSkill {
  id: string;
  name: string;
  category: SkillCategoryType;
  level: SkillLevel;
  yearsExperience?: number;
  certifications?: string[];
}

export interface UserProfile {
  id: string;
  userId: string;
  skills: UserSkill[];
  experienceText: string;
  preferredIndustries: string[];
  version: ProfileVersion;
  updatedAt: number;
}

export interface JobOpportunity {
  id: string;
  externalId: string;
  title: string;
  company: string;
  location: string;
  industry: string;
  salaryRange: {
    min: number;
    max: number;
    currency: Currency;
  };
  requiredSkills: string[];
  preferredSkills: string[];
  experienceLevel: JobLevel;
  description: string;
  jobType: JobType;
  isRemote: boolean;
  postedAt: number;
  source: string;
  active: boolean;
  matchScore?: number;
  missingSkills?: string[];
}

export interface SkillGap {
  skill: string;
  importance: "critical" | "high" | "medium" | "low";
  timeToLearn: string;
  salaryImpact: number;
  opportunities: number;
  learningResources: LearningResource[];
}

export interface LearningResource {
  id: string;
  title: string;
  type: "video" | "course" | "article" | "tutorial" | "project" | "certification";
  provider: string;
  url: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  cost: "free" | "paid";
  rating?: number;
  tags: string[];
}

export interface LearningPhase {
  id: string;
  title: string;
  duration: string;
  description: string;
  resources: LearningResource[];
  objectives: string[];
}

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  skills: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedHours: number;
  portfolioValue: "high" | "medium" | "low";
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  criteria: string[];
  reward?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  targetSkill: string;
  totalDuration: string;
  phases: LearningPhase[];
  projects: ProjectIdea[];
  milestones: Milestone[];
}

export interface LearningRecommendation {
  currentOpportunityIds: string[];
  nextLevelOpportunityIds: string[];
  skillGaps: SkillGap[];
  learningPath: LearningPath;
  salaryProjection: {
    current: number;
    potential: number;
    timeframe: string;
  };
}

export interface AIAnalysis {
  id: string;
  userId: string;
  profileVersion: ProfileVersion;
  source: AnalysisSource;
  fallbackReason?: FallbackReason;
  recommendations: LearningRecommendation;
  marketInsights: string[];
  createdAt: number;
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: string[];
  avgSalaryImpact: number;
  demandLevel: DemandLevel;
}

export interface JobFilters {
  industry?: string;
  level?: JobLevel;
  remoteOnly?: boolean;
  minSalary?: number;
  maxSalary?: number;
}

export interface PaginatedJobMatches {
  jobs: JobOpportunity[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  industries: string[];
}

export interface LearningProgress {
  id: string;
  userId: string;
  targetSkill: string;
  phaseId: string;
  completedResourceIds: string[];
  milestonesDone: string[];
  minutesSpent: number;
  updatedAt: number;
}
