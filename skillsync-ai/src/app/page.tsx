"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Brain, Target, TrendingUp, Users } from "lucide-react";
import { api } from "@convex/_generated/api";
import type { Doc, Id } from "@convex/_generated/dataModel";
import { JobMatches } from "@/components/JobMatches";
import { LoadingState } from "@/components/LoadingSpinner";
import { SkillsSelector } from "@/components/SkillsSelector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getOrCreateDeviceId } from "@/lib/device";
import { formatSalary } from "@/lib/utils";
import {
  AIAnalysis,
  JobFilters,
  JobOpportunity,
  LearningResource,
  LearningPath,
  LearningProgress,
  LearningRecommendation,
  SkillCategory,
  UserSkill,
} from "@/types";

type AppStep = "welcome" | "skills" | "analysis";
type SortBy = "match" | "salary" | "recency";
type SortDirection = "asc" | "desc";
type MatchedJobDoc = Doc<"jobListings"> & { matchScore: number; missingSkills: string[] };

function categoryDocsToUi(docs: Array<Doc<"skillTaxonomy">> | undefined): SkillCategory[] {
  if (!docs) return [];
  return docs.map((doc) => ({
    id: doc.categoryId,
    name: doc.name,
    description: doc.description,
    demandLevel: doc.demandLevel,
    avgSalaryImpact: doc.avgSalaryImpact,
    skills: doc.skills,
  }));
}

function mapJobDoc(doc: MatchedJobDoc): JobOpportunity {
  return {
    id: doc._id,
    externalId: doc.externalId,
    title: doc.title,
    company: doc.company,
    location: doc.location,
    industry: doc.industry,
    salaryRange: {
      min: doc.salaryMin,
      max: doc.salaryMax,
      currency: doc.currency,
    },
    requiredSkills: doc.requiredSkills,
    preferredSkills: doc.preferredSkills,
    experienceLevel: doc.level,
    description: `${doc.title} opportunity at ${doc.company}.`,
    jobType: doc.jobType,
    isRemote: doc.isRemote,
    postedAt: doc.postedAt,
    source: doc.source,
    active: doc.active,
    matchScore: doc.matchScore,
    missingSkills: doc.missingSkills,
  };
}

function normalizeRecommendation(raw: LearningRecommendation): LearningRecommendation {
  const normalizeResource = (resource: Partial<LearningResource> & { resourceId?: string }): LearningResource => ({
    id: resource.id ?? resource.resourceId ?? `resource-${Math.random().toString(36).slice(2, 8)}`,
    title: resource.title ?? "Untitled Resource",
    type: resource.type ?? "article",
    provider: resource.provider ?? "Unknown Provider",
    url: resource.url ?? "#",
    duration: resource.duration ?? "Unknown duration",
    difficulty: resource.difficulty ?? "beginner",
    cost: resource.cost ?? "free",
    rating: resource.rating,
    tags: resource.tags ?? [],
  });

  const normalizePath = (path: LearningPath): LearningPath => ({
    ...path,
    phases: path.phases.map((phase) => ({
      ...phase,
      resources: phase.resources.map((resource) => normalizeResource(resource)),
    })),
  });

  return {
    ...raw,
    skillGaps: raw.skillGaps.map((gap) => ({
      ...gap,
      learningResources: (gap.learningResources ?? []).map((resource) => normalizeResource(resource)),
    })),
    learningPath: normalizePath(raw.learningPath),
  };
}

function mapAnalysisDoc(doc: Doc<"analyses">): AIAnalysis {
  return {
    id: doc._id,
    userId: doc.userId,
    profileVersion: doc.profileVersion,
    source: doc.source,
    fallbackReason: doc.fallbackReason,
    recommendations: normalizeRecommendation(doc.recommendations),
    marketInsights: doc.marketInsights,
    createdAt: doc.createdAt,
  };
}

function mapProgressDoc(doc: Doc<"learningProgress">): LearningProgress {
  return {
    id: doc._id,
    userId: doc.userId,
    targetSkill: doc.targetSkill,
    phaseId: doc.phaseId,
    completedResourceIds: doc.completedResourceIds,
    milestonesDone: doc.milestonesDone,
    minutesSpent: doc.minutesSpent,
    updatedAt: doc.updatedAt,
  };
}

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<AppStep>("welcome");
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<UserSkill[]>([]);
  const [experienceText, setExperienceText] = useState("0-2 years");
  const [preferredIndustriesText, setPreferredIndustriesText] = useState("Technology");
  const [error, setError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [analysisOverride, setAnalysisOverride] = useState<AIAnalysis | null>(null);
  const [activeProfileId, setActiveProfileId] = useState<Id<"skillProfiles"> | null>(null);
  const [jobsPage, setJobsPage] = useState(1);
  const [filters, setFilters] = useState<JobFilters>({});
  const [sortBy, setSortBy] = useState<SortBy>("match");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [learningHint, setLearningHint] = useState<string | null>(null);
  const learningSectionRef = useRef<HTMLDivElement | null>(null);

  const getOrCreateUser = useMutation(api.users.getOrCreateUser);
  const saveSkillProfile = useMutation(api.profiles.saveSkillProfile);
  const runCareerAnalysis = useAction(api.analysisRunner.runCareerAnalysis);
  const updateLearningProgress = useMutation(api.progress.updateLearningProgress);

  const taxonomyDocs = useQuery(api.data.getSkillTaxonomy, {});
  const freshness = useQuery(api.admin.getLatestDataFreshness, {});
  const latestProfile = useQuery(api.profiles.getLatestSkillProfile, userId ? { userId } : "skip");
  const latestAnalysisDoc = useQuery(api.analysis.getLatestAnalysis, userId ? { userId } : "skip");
  const progressDocs = useQuery(api.progress.getUserProgress, userId ? { userId } : "skip");

  const jobsResult = useQuery(
    api.jobs.listMatchedJobs,
        activeProfileId
      ? {
          profileId: activeProfileId,
          filters,
          sortBy,
          sortDirection,
          page: jobsPage,
          pageSize: 8,
        }
      : "skip",
  );

  const categories = useMemo(() => categoryDocsToUi(taxonomyDocs), [taxonomyDocs]);
  const latestAnalysis = analysisOverride ?? (latestAnalysisDoc ? mapAnalysisDoc(latestAnalysisDoc) : null);
  const progressList = useMemo(() => (progressDocs ? progressDocs.map(mapProgressDoc) : []), [progressDocs]);

  useEffect(() => {
    setDeviceId(getOrCreateDeviceId());
  }, []);

  useEffect(() => {
    if (!deviceId || userId) return;

    const setupUser = async () => {
      try {
        const id = await getOrCreateUser({
          deviceId,
          locale: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
        setUserId(id);
      } catch (setupError) {
        setError(setupError instanceof Error ? setupError.message : "Failed to initialize user profile.");
      }
    };

    void setupUser();
  }, [deviceId, userId, getOrCreateUser]);

  useEffect(() => {
    if (!latestProfile) return;

    setSelectedSkills(latestProfile.skills);
    setExperienceText(latestProfile.experienceText);
    setPreferredIndustriesText(latestProfile.preferredIndustries.join(", "));
    setActiveProfileId(latestProfile._id);

    if (latestAnalysis) {
      setCurrentStep("analysis");
    } else {
      setCurrentStep("skills");
    }
  }, [latestProfile, latestAnalysis]);

  useEffect(() => {
    if (!learningHint) return;
    learningSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [learningHint]);

  const preferredIndustries = useMemo(
    () => preferredIndustriesText.split(",").map((item) => item.trim()).filter(Boolean),
    [preferredIndustriesText],
  );

  const handleAnalyzeSkills = async () => {
    if (!userId) {
      setError("User context is not ready yet. Please retry in a moment.");
      return;
    }
    if (selectedSkills.length === 0) {
      setError("Select at least one skill before analysis.");
      return;
    }

    setIsSavingProfile(true);
    setError(null);

    try {
      const profileResult = await saveSkillProfile({
        userId,
        skills: selectedSkills,
        experienceText,
        preferredIndustries: preferredIndustries.length > 0 ? preferredIndustries : ["Technology"],
      });

      setActiveProfileId(profileResult.profileId);

      const analysisResult = await runCareerAnalysis({
        profileId: profileResult.profileId,
      });

      setAnalysisOverride({
        id: analysisResult.analysisId,
        userId,
        profileVersion: profileResult.version,
        source: analysisResult.source,
        fallbackReason: analysisResult.fallbackReason,
        recommendations: normalizeRecommendation(analysisResult.recommendations),
        marketInsights: analysisResult.marketInsights,
        createdAt: analysisResult.createdAt,
      });

      setCurrentStep("analysis");
      setJobsPage(1);
    } catch (analysisError) {
      setError(analysisError instanceof Error ? analysisError.message : "Failed to analyze skills.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const runDemoFlow = () => {
    if (categories.length === 0) return;

    const demoSkills = ["HTML/CSS", "JavaScript", "SQL"];
    const hydrated: UserSkill[] = demoSkills.map((name, index) => ({
      id: `demo-${name}-${index}`,
      name,
      category: "technical" as const,
      level: index === 0 ? "advanced" : "intermediate",
    }));

    setSelectedSkills(hydrated);
    setExperienceText("1-2 years");
    setPreferredIndustriesText("Technology, FinTech");
    setCurrentStep("skills");
  };

  const handleProgressUpdate = async (
    targetSkill: string,
    phaseId: string,
    completedResourceIds: string[],
    milestonesDone: string[],
    minutesSpent: number,
  ) => {
    if (!userId) return;

    try {
      await updateLearningProgress({
        userId,
        targetSkill,
        phaseId,
        completedResourceIds,
        milestonesDone,
        minutesSpent,
      });
    } catch (progressError) {
      setError(progressError instanceof Error ? progressError.message : "Failed to save progress.");
    }
  };

  if (!deviceId || !userId) {
    return <LoadingState message="Initializing SkillSync profile..." />;
  }

  if (currentStep === "welcome") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Skills.
            <br />
            <span className="text-blue-600">Rwanda&apos;s Opportunities.</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect your current skills to verified Rwanda opportunities and get a practical learning path to reach better roles.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setCurrentStep("skills")} size="lg" className="text-lg px-8 py-4">
              Start Skill Assessment
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4" onClick={runDemoFlow}>
              See Demo
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Job Reality Check</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>See which jobs you can qualify for now and what skill gaps block higher-paying roles.</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <CardTitle>ROI Skill Path</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Get ranked skills by opportunity impact, salary upside, and realistic learning time.</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Local Market Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Guidance is tuned to Rwanda market opportunities, not generic global advice.</CardDescription>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Rwanda Market Data Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-800">
              Latest import: {freshness?.latestImport?.version ?? "Not imported yet"} • Jobs last updated: {freshness?.latestJobUpdatedAt ? new Date(freshness.latestJobUpdatedAt).toLocaleDateString("en-RW") : "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === "skills") {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Skills Assessment</h1>
            <p className="text-gray-600">Set your current skills, experience, and preferred industries.</p>
          </div>
          <Button onClick={handleAnalyzeSkills} disabled={isSavingProfile || selectedSkills.length === 0}>
            {isSavingProfile ? "Analyzing..." : "Analyze Opportunities"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Profile Context</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Experience</label>
              <Input value={experienceText} onChange={(event) => setExperienceText(event.target.value)} placeholder="e.g. 0-2 years" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Preferred Industries (comma-separated)</label>
              <Input
                value={preferredIndustriesText}
                onChange={(event) => setPreferredIndustriesText(event.target.value)}
                placeholder="Technology, FinTech"
              />
            </div>
          </CardContent>
        </Card>

        <SkillsSelector selectedSkills={selectedSkills} categories={categories} onSkillsChange={setSelectedSkills} />

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6 text-red-700 text-sm">{error}</CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (!latestAnalysis || !jobsResult) {
    return <LoadingState message="Preparing your analysis dashboard..." />;
  }

  const jobs = jobsResult.jobs.map(mapJobDoc);
  const recommendation = latestAnalysis.recommendations;
  const targetSkill = recommendation.learningPath.targetSkill;
  const progress = progressList.find((item) => item.targetSkill === targetSkill);
  const completedResources = new Set(progress?.completedResourceIds ?? []);
  const completedMilestones = new Set(progress?.milestonesDone ?? []);
  const completionPercent = Math.round(
    ((completedResources.size + completedMilestones.size) /
      Math.max(
        recommendation.learningPath.phases.flatMap((phase) => phase.resources).length +
          recommendation.learningPath.milestones.length,
        1,
      )) *
      100,
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Career Analysis</h1>
          <p className="text-gray-600">Personalized from your profile and curated Rwanda market data.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={latestAnalysis.source === "ai" ? "success" : "warning"}>
            Source: {latestAnalysis.source === "ai" ? "AI" : "Deterministic fallback"}
          </Badge>
          <Button variant="outline" onClick={() => setCurrentStep("skills")}>
            Update Skills
          </Button>
        </div>
      </div>

      {latestAnalysis.fallbackReason && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6 text-sm text-yellow-800">
            AI fallback active: {latestAnalysis.fallbackReason}
          </CardContent>
        </Card>
      )}

      <JobMatches
        jobs={jobs}
        total={jobsResult.total}
        page={jobsResult.page}
        pageSize={jobsResult.pageSize}
        hasNextPage={jobsResult.hasNextPage}
        industries={jobsResult.industries}
        filters={filters}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onFiltersChange={(next) => {
          setFilters(next);
          setJobsPage(1);
        }}
        onSortChange={(nextSortBy, nextDirection) => {
          setSortBy(nextSortBy);
          setSortDirection(nextDirection);
          setJobsPage(1);
        }}
        onPageChange={setJobsPage}
        onLearnSkill={(skill) => setLearningHint(skill)}
      />

      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle>Earning Potential</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-2xl font-bold text-green-600">{formatSalary(recommendation.salaryProjection.current)}</div>
            <div className="text-sm text-green-700">Current monthly potential</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{formatSalary(recommendation.salaryProjection.potential)}</div>
            <div className="text-sm text-blue-700">Projected monthly potential</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Priority Skill Gaps</CardTitle>
          <CardDescription>
            {learningHint ? `Suggested by selected gap: ${learningHint}` : "Top opportunities to unlock better roles."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendation.skillGaps.map((gap) => (
            <div key={gap.skill} className="p-3 border rounded-md">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="font-semibold">{gap.skill}</div>
                <Badge variant={gap.importance === "critical" ? "destructive" : gap.importance === "high" ? "warning" : "info"}>
                  {gap.importance}
                </Badge>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {gap.timeToLearn} • +{formatSalary(gap.salaryImpact)} impact • {gap.opportunities} opportunities unlocked
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card ref={learningSectionRef}>
        <CardHeader>
          <CardTitle>Learning Path: {recommendation.learningPath.title}</CardTitle>
          <CardDescription>
            Progress: {completionPercent}% • {progress?.minutesSpent ?? 0} minutes tracked
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {recommendation.learningPath.phases.map((phase) => (
            <div key={phase.id} className="p-4 border rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{phase.title}</h3>
                  <p className="text-sm text-gray-600">{phase.duration} • {phase.description}</p>
                </div>
              </div>

              <div className="space-y-2">
                {phase.resources.map((resource) => {
                  const isDone = completedResources.has(resource.id);
                  return (
                    <label key={resource.id} className="flex items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={(event) => {
                          const next = new Set(completedResources);
                          if (event.target.checked) {
                            next.add(resource.id);
                          } else {
                            next.delete(resource.id);
                          }

                          void handleProgressUpdate(
                            targetSkill,
                            phase.id,
                            [...next],
                            [...completedMilestones],
                            progress?.minutesSpent ?? 0,
                          );
                        }}
                      />
                      <span>
                        <a href={resource.url} target="_blank" rel="noreferrer" className="font-medium hover:underline">
                          {resource.title}
                        </a>
                        <span className="text-gray-500"> • {resource.provider} • {resource.duration}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          <div>
            <h3 className="font-semibold mb-2">Milestones</h3>
            <div className="space-y-2">
              {recommendation.learningPath.milestones.map((milestone) => {
                const isDone = completedMilestones.has(milestone.id);
                return (
                  <label key={milestone.id} className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={(event) => {
                        const nextMilestones = new Set(completedMilestones);
                        if (event.target.checked) {
                          nextMilestones.add(milestone.id);
                        } else {
                          nextMilestones.delete(milestone.id);
                        }

                        void handleProgressUpdate(
                          targetSkill,
                          progress?.phaseId ?? recommendation.learningPath.phases[0]?.id ?? "phase-foundation",
                          [...completedResources],
                          [...nextMilestones],
                          progress?.minutesSpent ?? 0,
                        );
                      }}
                    />
                    <span>
                      <span className="font-medium">{milestone.title}</span>
                      <span className="text-gray-600"> • {milestone.description}</span>
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Time invested (minutes)</label>
              <Input
                type="number"
                min={0}
                value={progress?.minutesSpent ?? 0}
                onChange={(event) => {
                  const minutes = Number(event.target.value || 0);
                  void handleProgressUpdate(
                    targetSkill,
                    progress?.phaseId ?? recommendation.learningPath.phases[0]?.id ?? "phase-foundation",
                    [...completedResources],
                    [...completedMilestones],
                    minutes,
                  );
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rwanda Market Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-700">
            {latestAnalysis.marketInsights.map((insight, index) => (
              <li key={`${insight}-${index}`} className="flex gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-red-700 text-sm">{error}</CardContent>
        </Card>
      )}
    </div>
  );
}
