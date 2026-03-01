export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type UserSkillInput = {
  id: string;
  name: string;
  category: "technical" | "digital" | "soft" | "language";
  level: SkillLevel;
  yearsExperience?: number;
  certifications?: string[];
};

export type JobListingInput = {
  _id: string;
  title: string;
  company: string;
  industry: string;
  salaryMin: number;
  salaryMax: number;
  requiredSkills: string[];
  preferredSkills: string[];
  level: "entry" | "mid" | "senior" | "lead";
  postedAt: number;
  isRemote: boolean;
};

export type LearningResourceInput = {
  resourceId: string;
  title: string;
  provider: string;
  type: "video" | "course" | "article" | "tutorial" | "project" | "certification";
  url: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  cost: "free" | "paid";
  rating?: number;
  tags: string[];
};

export type SkillGapOutput = {
  skill: string;
  importance: "critical" | "high" | "medium" | "low";
  timeToLearn: string;
  salaryImpact: number;
  opportunities: number;
  learningResources: LearningResourceInput[];
};

export type LearningPathOutput = {
  id: string;
  title: string;
  description: string;
  targetSkill: string;
  totalDuration: string;
  phases: Array<{
    id: string;
    title: string;
    duration: string;
    description: string;
    resources: LearningResourceInput[];
    objectives: string[];
  }>;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    skills: string[];
    difficulty: "beginner" | "intermediate" | "advanced";
    estimatedHours: number;
    portfolioValue: "high" | "medium" | "low";
  }>;
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    criteria: string[];
    reward?: string;
  }>;
};

export type RecommendationOutput = {
  currentOpportunityIds: string[];
  nextLevelOpportunityIds: string[];
  skillGaps: SkillGapOutput[];
  learningPath: LearningPathOutput;
  salaryProjection: {
    current: number;
    potential: number;
    timeframe: string;
  };
};

function normalizeSkill(skill: string): string {
  return skill.toLowerCase().trim().replace(/\s+/g, " ");
}

function skillMatches(userSkill: string, requiredSkill: string): boolean {
  const u = normalizeSkill(userSkill);
  const r = normalizeSkill(requiredSkill);
  return u === r || u.includes(r) || r.includes(u);
}

export function calculateJobMatchScore(userSkills: UserSkillInput[], job: JobListingInput): number {
  if (job.requiredSkills.length === 0) {
    return 0;
  }

  const userSkillNames = userSkills.map((skill) => skill.name);
  const requiredMatched = job.requiredSkills.filter((required) =>
    userSkillNames.some((userSkill) => skillMatches(userSkill, required)),
  ).length;

  const preferredMatched = job.preferredSkills.filter((preferred) =>
    userSkillNames.some((userSkill) => skillMatches(userSkill, preferred)),
  ).length;

  const requiredScore = requiredMatched / job.requiredSkills.length;
  const preferredScore =
    job.preferredSkills.length > 0 ? preferredMatched / job.preferredSkills.length : 0;

  return Number((requiredScore * 0.75 + preferredScore * 0.25).toFixed(4));
}

export function getMissingSkills(userSkills: UserSkillInput[], job: JobListingInput): string[] {
  const userSkillNames = userSkills.map((skill) => skill.name);
  return job.requiredSkills.filter(
    (required) => !userSkillNames.some((userSkill) => skillMatches(userSkill, required)),
  );
}

function levelWeight(level: JobListingInput["level"]): number {
  switch (level) {
    case "entry":
      return 1;
    case "mid":
      return 1.2;
    case "senior":
      return 1.5;
    case "lead":
      return 1.7;
  }
}

function averageSalary(job: JobListingInput): number {
  return Math.round((job.salaryMin + job.salaryMax) / 2);
}

function inferLearningTime(opportunities: number, importance: SkillGapOutput["importance"]): string {
  if (importance === "critical") return opportunities > 5 ? "8-12 weeks" : "6-8 weeks";
  if (importance === "high") return opportunities > 4 ? "6-8 weeks" : "4-6 weeks";
  if (importance === "medium") return "3-5 weeks";
  return "2-3 weeks";
}

function getImportance(opportunityCount: number): SkillGapOutput["importance"] {
  if (opportunityCount >= 6) return "critical";
  if (opportunityCount >= 4) return "high";
  if (opportunityCount >= 2) return "medium";
  return "low";
}

function collectSkillGaps(
  userSkills: UserSkillInput[],
  jobsWithScores: Array<{ job: JobListingInput; score: number }>,
  resources: LearningResourceInput[],
): SkillGapOutput[] {
  const deficits = new Map<
    string,
    {
      opportunities: number;
      salaryImpactAccumulator: number;
      weightedDemand: number;
    }
  >();

  const baselineCurrent = jobsWithScores.filter(({ score }) => score >= 0.7);
  const baselineSalary =
    baselineCurrent.length > 0
      ? baselineCurrent.reduce((sum, item) => sum + averageSalary(item.job), 0) / baselineCurrent.length
      : 250000;

  for (const { job, score } of jobsWithScores) {
    if (score >= 0.7) continue;

    const missing = getMissingSkills(userSkills, job);
    const impact = Math.max(0, averageSalary(job) - baselineSalary);

    for (const skill of missing) {
      const normalized = normalizeSkill(skill);
      const existing = deficits.get(normalized) ?? {
        opportunities: 0,
        salaryImpactAccumulator: 0,
        weightedDemand: 0,
      };

      existing.opportunities += 1;
      existing.salaryImpactAccumulator += impact;
      existing.weightedDemand += levelWeight(job.level);
      deficits.set(normalized, existing);
    }
  }

  const ranked = [...deficits.entries()]
    .map(([skill, stats]) => {
      const opportunities = stats.opportunities;
      const importance = getImportance(opportunities);
      const relatedResources = resources
        .filter((resource) =>
          resource.tags.some((tag) => normalizeSkill(tag).includes(skill) || skill.includes(normalizeSkill(tag))),
        )
        .slice(0, 5);

      return {
        skill: skill
          .split(" ")
          .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
          .join(" "),
        importance,
        timeToLearn: inferLearningTime(opportunities, importance),
        salaryImpact: Math.round(stats.salaryImpactAccumulator / Math.max(opportunities, 1)),
        opportunities,
        learningResources: relatedResources,
        demandScore: stats.weightedDemand,
      };
    })
    .sort((a, b) => {
      const impactDelta = b.salaryImpact - a.salaryImpact;
      if (impactDelta !== 0) return impactDelta;
      const oppDelta = b.opportunities - a.opportunities;
      if (oppDelta !== 0) return oppDelta;
      return b.demandScore - a.demandScore;
    })
    .slice(0, 5)
    .map((item) => {
      const { demandScore, ...rest } = item;
      void demandScore;
      return rest;
    });

  return ranked;
}

export function buildLearningPath(
  skillGaps: SkillGapOutput[],
  resources: LearningResourceInput[],
): LearningPathOutput {
  const primarySkill = skillGaps[0]?.skill ?? "Career Fundamentals";
  const selectedResources = resources
    .filter((resource) =>
      resource.tags.some((tag) =>
        normalizeSkill(tag).includes(normalizeSkill(primarySkill)) ||
        normalizeSkill(primarySkill).includes(normalizeSkill(tag)),
      ),
    )
    .slice(0, 9);

  const phaseOne = selectedResources.slice(0, 3);
  const phaseTwo = selectedResources.slice(3, 6);
  const phaseThree = selectedResources.slice(6, 9);

  return {
    id: `path-${normalizeSkill(primarySkill).replace(/\s+/g, "-")}`,
    title: `${primarySkill} Career Upgrade Path`,
    description: `A focused path to unlock higher-paying Rwanda opportunities by mastering ${primarySkill}.`,
    targetSkill: primarySkill,
    totalDuration: "8-12 weeks",
    phases: [
      {
        id: "phase-foundation",
        title: "Foundation",
        duration: "2-3 weeks",
        description: `Build practical fundamentals for ${primarySkill}.`,
        resources: phaseOne,
        objectives: ["Understand core concepts", "Complete first guided project"],
      },
      {
        id: "phase-practice",
        title: "Applied Practice",
        duration: "3-4 weeks",
        description: "Apply skills through market-relevant tasks.",
        resources: phaseTwo,
        objectives: ["Ship one portfolio artifact", "Solve at least two real-world scenarios"],
      },
      {
        id: "phase-portfolio",
        title: "Portfolio & Interview Prep",
        duration: "3-5 weeks",
        description: "Prepare proof-of-skill and job application readiness.",
        resources: phaseThree,
        objectives: ["Complete capstone", "Prepare interview stories and measurable impact"],
      },
    ],
    projects: [
      {
        id: "project-1",
        title: "Rwanda Market Dashboard",
        description: "Build a dashboard that tracks opportunities and salary ranges by skill.",
        skills: [primarySkill, "Data Visualization", "Communication"],
        difficulty: "intermediate",
        estimatedHours: 24,
        portfolioValue: "high",
      },
      {
        id: "project-2",
        title: "Job Readiness Portfolio Piece",
        description: "Create one project directly aligned with your top matched role.",
        skills: [primarySkill],
        difficulty: "advanced",
        estimatedHours: 30,
        portfolioValue: "high",
      },
    ],
    milestones: [
      {
        id: "milestone-1",
        title: "Core Concepts Complete",
        description: "You can explain and apply the key fundamentals confidently.",
        criteria: ["Complete at least 3 core resources", "Pass self-assessment"],
      },
      {
        id: "milestone-2",
        title: "Portfolio Proof",
        description: "You have a project artifact suitable for applications.",
        criteria: ["Publish one project", "Document outcomes and decisions"],
      },
      {
        id: "milestone-3",
        title: "Interview Ready",
        description: "You can clearly connect your new skills to job outcomes.",
        criteria: ["Prepare CV updates", "Draft interview answers from project work"],
      },
    ],
  };
}

function salaryProjection(
  current: Array<{ job: JobListingInput; score: number }>,
  next: Array<{ job: JobListingInput; score: number }>,
): { current: number; potential: number; timeframe: string } {
  const currentAverage =
    current.length > 0
      ? Math.round(current.reduce((sum, item) => sum + averageSalary(item.job), 0) / current.length)
      : 250000;

  const potentialAverage =
    next.length > 0
      ? Math.round(next.reduce((sum, item) => sum + averageSalary(item.job), 0) / next.length)
      : Math.round(currentAverage * 1.2);

  return {
    current: currentAverage,
    potential: Math.max(potentialAverage, currentAverage),
    timeframe: "6 months",
  };
}

export function deterministicRecommendation(
  userSkills: UserSkillInput[],
  jobs: JobListingInput[],
  resources: LearningResourceInput[],
): RecommendationOutput {
  const jobsWithScores = jobs
    .map((job) => ({ job, score: calculateJobMatchScore(userSkills, job) }))
    .sort((a, b) => b.score - a.score);

  const current = jobsWithScores.filter((item) => item.score >= 0.7).slice(0, 8);
  const next = jobsWithScores.filter((item) => item.score < 0.7 && item.score >= 0.4).slice(0, 8);

  const skillGaps = collectSkillGaps(userSkills, jobsWithScores, resources);
  const learningPath = buildLearningPath(skillGaps, resources);

  return {
    currentOpportunityIds: current.map((item) => item.job._id),
    nextLevelOpportunityIds: next.map((item) => item.job._id),
    skillGaps,
    learningPath,
    salaryProjection: salaryProjection(current, next),
  };
}

export function extractJsonObject(input: string): string | null {
  const start = input.indexOf("{");
  const end = input.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    return null;
  }
  return input.slice(start, end + 1);
}
