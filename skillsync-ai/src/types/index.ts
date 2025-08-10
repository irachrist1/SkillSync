// Core TypeScript interfaces for SkillSync AI

export interface UserSkill {
  id: string;
  name: string;
  category: 'technical' | 'digital' | 'soft' | 'language';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsExperience?: number;
  certifications?: string[];
}

export interface UserProfile {
  id: string;
  skills: UserSkill[];
  experience: string;
  education?: string;
  location: string;
  preferredIndustries: string[];
  salaryExpectation?: {
    min: number;
    max: number;
    currency: 'RWF' | 'USD';
  };
  lastUpdated: Date;
}

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  industry: string;
  salaryRange: {
    min: number;
    max: number;
    currency: 'RWF' | 'USD';
  };
  requiredSkills: string[];
  preferredSkills?: string[];
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
  description: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
  isRemote: boolean;
  postedDate: Date;
  matchScore?: number;
}

export interface SkillGap {
  skill: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  timeToLearn: string; // e.g., "2-4 weeks"
  salaryImpact: number; // potential salary increase in RWF
  opportunities: number; // number of additional jobs this unlocks
  learningResources: LearningResource[];
}

export interface LearningPathItem {
  skill: string;
  resource: string;
  project: string;
}

export interface LearningRecommendation {
  currentOpportunities: JobOpportunity[];
  skillGaps: SkillGap[];
  nextLevelOpportunities: JobOpportunity[];
  learningPath: LearningPathItem[];
  salaryProjection: {
    current: number;
    potential: number;
    timeframe: string;
  };
}

export interface LearningResource {
  id: string;
  title: string;
  type: 'video' | 'course' | 'article' | 'tutorial' | 'project' | 'certification';
  provider: string;
  url: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  cost: 'free' | 'paid';
  rating?: number;
  description: string;
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
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  portfolioValue: 'high' | 'medium' | 'low';
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  criteria: string[];
  reward?: string;
}

export interface AIAnalysis {
  userProfile: UserProfile;
  currentOpportunities: JobOpportunity[];
  recommendations: LearningRecommendation;
  marketInsights: string[];
  lastAnalyzed: Date;
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: string[];
  avgSalaryImpact: number;
  demandLevel: 'very-high' | 'high' | 'medium' | 'low';
}

export interface Lesson {
  title: string;
  resource: string;
}

export interface Module {
  title: string;
  lessons: Lesson[];
}

export interface Project {
  title: string;
  brief: string;
}

export interface Course {
  title: string;
  duration: string;
  modules: Module[];
  project: Project;
}

// Rwanda-specific interfaces
export interface RwandaJobMarket {
  industries: string[];
  topSkillsInDemand: string[];
  averageSalaries: Record<string, number>;
  growthSectors: string[];
  remoteWorkAvailability: number; // percentage
}

export interface LocalLearningProvider {
  id: string;
  name: string;
  type: 'institution' | 'bootcamp' | 'online' | 'workshop';
  location: string;
  specializations: string[];
  cost: string;
  duration: string;
  successRate?: number;
  partnershipWithEmployers: boolean;
}
