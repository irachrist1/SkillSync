"use client";

import React, { useMemo, useState } from "react";
import { Calendar, ExternalLink, Filter, MapPin, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatSalary, formatTimeAgo } from "@/lib/utils";
import { JobFilters, JobOpportunity } from "@/types";

type SortBy = "match" | "salary" | "recency";
type SortDirection = "asc" | "desc";

interface JobMatchesProps {
  jobs: JobOpportunity[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  industries: string[];
  filters: JobFilters;
  sortBy: SortBy;
  sortDirection: SortDirection;
  onFiltersChange: (filters: JobFilters) => void;
  onSortChange: (sortBy: SortBy, direction: SortDirection) => void;
  onPageChange: (nextPage: number) => void;
  onLearnSkill: (skill: string) => void;
}

function cleanFilters(filters: JobFilters): JobFilters {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== ""),
  ) as JobFilters;
}

function getMatchCategory(score: number): {
  category: "excellent" | "good" | "fair" | "poor";
  color: string;
  description: string;
} {
  if (score >= 0.8) {
    return {
      category: "excellent",
      color: "text-green-600",
      description: "Excellent match - ready to apply",
    };
  }
  if (score >= 0.6) {
    return {
      category: "good",
      color: "text-blue-600",
      description: "Strong fit with minor gaps",
    };
  }
  if (score >= 0.4) {
    return {
      category: "fair",
      color: "text-yellow-700",
      description: "Potential fit after focused upskilling",
    };
  }
  return {
    category: "poor",
    color: "text-red-600",
    description: "Longer skill path required",
  };
}

export function JobMatches({
  jobs,
  total,
  page,
  pageSize,
  hasNextPage,
  industries,
  filters,
  sortBy,
  sortDirection,
  onFiltersChange,
  onSortChange,
  onPageChange,
  onLearnSkill,
}: JobMatchesProps) {
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);

  const summary = useMemo(() => {
    const excellent = jobs.filter((job) => (job.matchScore ?? 0) >= 0.8);
    const averageSalary =
      excellent.length === 0
        ? 0
        : Math.round(
            excellent.reduce((sum, job) => sum + (job.salaryRange.min + job.salaryRange.max) / 2, 0) /
              excellent.length,
          );

    return {
      excellentCount: excellent.length,
      remoteCount: jobs.filter((job) => job.isRemote).length,
      avgSalary: averageSalary,
      industries: new Set(jobs.map((job) => job.industry)).size,
    };
  }, [jobs]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Job Matches</h2>
        <p className="text-gray-600">{total} opportunities ranked for your current profile.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters and Sorting
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-4 gap-3">
          <select
            className="h-10 rounded-md border px-3 text-sm"
            value={filters.industry ?? ""}
            onChange={(event) =>
              onFiltersChange(cleanFilters({ ...filters, industry: event.target.value || undefined }))
            }
          >
            <option value="">All industries</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>

          <select
            className="h-10 rounded-md border px-3 text-sm"
            value={filters.level ?? ""}
            onChange={(event) =>
              onFiltersChange(
                cleanFilters({ ...filters, level: (event.target.value as JobFilters["level"]) || undefined }),
              )
            }
          >
            <option value="">All levels</option>
            <option value="entry">Entry</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>

          <select
            className="h-10 rounded-md border px-3 text-sm"
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value as SortBy, sortDirection)}
          >
            <option value="match">Sort by match</option>
            <option value="salary">Sort by salary</option>
            <option value="recency">Sort by recency</option>
          </select>

          <div className="flex gap-2">
            <Button
              variant={filters.remoteOnly ? "default" : "outline"}
              onClick={() => onFiltersChange(cleanFilters({ ...filters, remoteOnly: !filters.remoteOnly }))}
              className="flex-1"
            >
              Remote only
            </Button>
            <Button
              variant="outline"
              onClick={() => onSortChange(sortBy, sortDirection === "asc" ? "desc" : "asc")}
              className="w-16"
            >
              {sortDirection === "asc" ? "↑" : "↓"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {jobs.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-gray-600">
              No jobs match your current filters. Try broadening your criteria.
            </CardContent>
          </Card>
        )}

        {jobs.map((job) => {
          const matchScore = job.matchScore ?? 0;
          const matchInfo = getMatchCategory(matchScore);
          const missingSkills = job.missingSkills ?? [];
          const firstMissingSkill = missingSkills[0];

          return (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <Badge>{job.industry}</Badge>
                      {job.isRemote && <Badge variant="outline">Remote</Badge>}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.company} • {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatTimeAgo(job.postedAt)}
                      </div>
                    </div>
                    <CardDescription className="mt-2">{job.description}</CardDescription>
                  </div>

                  <div className="text-right min-w-[180px]">
                    <div className="text-lg font-bold text-gray-900">
                      {formatSalary(job.salaryRange.min, job.salaryRange.currency)} - {formatSalary(job.salaryRange.max, job.salaryRange.currency)}
                    </div>
                    <div className="text-xs text-gray-500 capitalize mb-2">
                      {job.jobType} • {job.experienceLevel}
                    </div>
                    <Badge
                      variant={
                        matchInfo.category === "excellent"
                          ? "success"
                          : matchInfo.category === "good"
                          ? "info"
                          : matchInfo.category === "fair"
                          ? "warning"
                          : "destructive"
                      }
                    >
                      <Target className="w-3 h-3 mr-1" />
                      {Math.round(matchScore * 100)}% Match
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className={cn("p-3 rounded-md border", matchInfo.color.replace("text", "border"))}>
                  <div className={cn("text-sm font-medium", matchInfo.color)}>{matchInfo.description}</div>
                  {missingSkills.length > 0 && (
                    <div className="text-xs text-gray-600 mt-1">Missing skills: {missingSkills.join(", ")}</div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => setSelectedJob(job)}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  {firstMissingSkill && (
                    <Button variant="outline" onClick={() => onLearnSkill(firstMissingSkill)}>
                      Learn Missing Skills
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{summary.excellentCount}</div>
            <div className="text-sm text-blue-700">Excellent Matches</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{summary.avgSalary ? formatSalary(summary.avgSalary).replace("RWF", "") : "-"}</div>
            <div className="text-sm text-green-700">Avg Salary</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{summary.remoteCount}</div>
            <div className="text-sm text-purple-700">Remote Roles</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">{summary.industries}</div>
            <div className="text-sm text-orange-700">Industries</div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing page {page} with {pageSize} results per page
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1}>
            Previous
          </Button>
          <Button variant="outline" onClick={() => onPageChange(page + 1)} disabled={!hasNextPage}>
            Next
          </Button>
        </div>
      </div>

      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{selectedJob.title}</CardTitle>
              <CardDescription>
                {selectedJob.company} • {selectedJob.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.requiredSkills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedJob.preferredSkills.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Preferred Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.preferredSkills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {(selectedJob.missingSkills ?? []).length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Skill Gaps</h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedJob.missingSkills ?? []).map((skill) => (
                      <Button key={skill} variant="outline" size="sm" onClick={() => onLearnSkill(skill)}>
                        {skill}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button variant="ghost" onClick={() => setSelectedJob(null)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
