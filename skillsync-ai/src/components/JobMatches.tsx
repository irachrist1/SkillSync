'use client';

import React, { useMemo, useState } from 'react';
import { MapPin, Calendar, Briefcase, ExternalLink, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { JobOpportunity, UserSkill } from '@/types';
import { formatSalary, getMatchCategory, formatTimeAgo, calculateJobMatchScore } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface JobMatchesProps {
  jobs: JobOpportunity[];
  userSkills: UserSkill[];
  className?: string;
}

export function JobMatches({ jobs, userSkills, className }: JobMatchesProps) {
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);

  // Calculate match scores and sort by relevance (memoized)
  const jobsWithScores = useMemo(() => {
    return jobs
      .map(job => ({
        ...job,
        matchScore: calculateJobMatchScore(userSkills, job)
      }))
      .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
  }, [jobs, userSkills]);

  const getJobTypeIcon = (jobType: string) => {
    const icons = {
      'full-time': '💼',
      'part-time': '⏰',
      'contract': '📝',
      'internship': '🎓'
    };
    return icons[jobType as keyof typeof icons] || '💼';
  };

  const getIndustryColor = (industry: string) => {
    const colors = {
      'Technology': 'bg-blue-100 text-blue-800',
      'Banking': 'bg-green-100 text-green-800',
      'FinTech': 'bg-purple-100 text-purple-800',
      'Tourism': 'bg-orange-100 text-orange-800',
      'Healthcare': 'bg-red-100 text-red-800',
      'Education': 'bg-yellow-100 text-yellow-800'
    };
    return colors[industry as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getMissingSkills = (job: JobOpportunity) => {
    const userSkillNames = userSkills.map(s => s.name.toLowerCase());
    return job.requiredSkills.filter(skill => 
      !userSkillNames.some(userSkill => 
        userSkill.includes(skill.toLowerCase()) || skill.toLowerCase().includes(userSkill)
      )
    );
  };

  if (jobsWithScores.length === 0) {
    return (
      <Card className={cn("", className)}>
        <CardContent className="text-center py-12">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Job Matches Yet</h3>
          <p className="text-gray-600 mb-4">
            Add some skills to see personalized job opportunities in Rwanda.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Helper for summary average salary
  const excellentJobs = jobsWithScores.filter(j => (j.matchScore ?? 0) >= 0.8);
  const averageSalaryNumber = excellentJobs.length > 0
    ? excellentJobs.reduce((sum, job) => sum + ((job.salaryRange.min + job.salaryRange.max) / 2), 0) / excellentJobs.length
    : 0;

  return (
    <div className={cn('space-y-8', className)}>
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Job Opportunities for You
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {jobsWithScores.length} opportunities found in Rwanda's job market, ranked by your skill match.
        </p>
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {jobsWithScores.map((job) => {
          const matchInfo = getMatchCategory(job.matchScore);
          const missingSkills = getMissingSkills(job);

          return (
            <Card key={job.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-l-4 border-l-blue-500 bg-gradient-to-r from-white to-gray-50">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <Badge className={cn("text-xs font-semibold", getIndustryColor(job.industry))}>
                            {job.industry}
                          </Badge>
                          {job.isRemote && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              🌐 Remote Available
                            </Badge>
                          )}
                          <Badge 
                            className={cn("text-xs font-semibold",
                              matchInfo.category === 'excellent' ? 'bg-green-100 text-green-700 border-green-300' : 
                              matchInfo.category === 'good' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                              matchInfo.category === 'fair' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 
                              'bg-red-100 text-red-700 border-red-300'
                            )}
                          >
                            <Target className="w-3 h-3 mr-1" />
                            {Math.round(job.matchScore * 100)}% Match
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4" />
                        <span className="font-medium">{job.company || '—'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{formatTimeAgo(job.postedDate)}</span>
                      </div>
                    </div>

                    <CardDescription className="text-gray-600 leading-relaxed">
                      {job.description}
                    </CardDescription>
                  </div>

                  <div className="text-right ml-6 flex-shrink-0">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                      <div className="text-xl font-bold text-green-700 mb-1">
                        {formatSalary(job.salaryRange.min)} - {formatSalary(job.salaryRange.max)}
                      </div>
                      <div className="text-xs text-green-600 mb-2">
                        {getJobTypeIcon(job.jobType)} {job.jobType} • {job.experienceLevel}
                      </div>
                      <div className="text-xs text-gray-500">
                        per month
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Required Skills */}
                  <div className="bg-white/70 rounded-xl p-4 border border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.map((skill) => {
                        const hasSkill = userSkills.some(s => 
                          s.name.toLowerCase().includes(skill.toLowerCase()) || 
                          skill.toLowerCase().includes(s.name.toLowerCase())
                        );
                        return (
                          <Badge 
                            key={skill}
                            className={cn(
                              "text-xs font-medium transition-all duration-200",
                              hasSkill 
                                ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200" 
                                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                            )}
                          >
                            {skill}
                            {hasSkill && " ✓"}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preferred Skills */}
                  {job.preferredSkills && job.preferredSkills.length > 0 && (
                    <div className="bg-white/70 rounded-xl p-4 border border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Preferred Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {job.preferredSkills.map((skill) => {
                          const hasSkill = userSkills.some(s => 
                            s.name.toLowerCase().includes(skill.toLowerCase()) || 
                            skill.toLowerCase().includes(s.name.toLowerCase())
                          );
                          return (
                            <Badge 
                              key={skill}
                              className={cn(
                                "text-xs font-medium transition-all duration-200",
                                hasSkill 
                                  ? "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200" 
                                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                              )}
                            >
                              {skill}
                              {hasSkill && " ✓"}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Match Analysis */}
                <div className={cn("p-4 rounded-xl mb-6 border-l-4", 
                  matchInfo.category === 'excellent' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 border-l-green-500' :
                  matchInfo.category === 'good' ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 border-l-blue-500' :
                  matchInfo.category === 'fair' ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 border-l-yellow-500' :
                  'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 border-l-red-500'
                )}>
                  <div className={cn("text-sm font-semibold mb-2 flex items-center gap-2", matchInfo.color)}>
                    <div className={cn("w-2 h-2 rounded-full",
                      matchInfo.category === 'excellent' ? 'bg-green-500' :
                      matchInfo.category === 'good' ? 'bg-blue-500' :
                      matchInfo.category === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
                    )}></div>
                    {matchInfo.description}
                  </div>
                  
                  {missingSkills.length > 0 && (
                    <div className="text-xs text-gray-600 mb-2">
                      <span className="font-medium">Missing skills:</span> {missingSkills.join(', ')}
                    </div>
                  )}
                  
                  {matchInfo.category === 'excellent' && (
                    <div className="text-sm text-green-700 font-medium bg-white/50 rounded-lg p-2 mt-2">
                      🎉 Perfect match! Your skills align excellently with this role.
                    </div>
                  )}
                  
                  {matchInfo.category === 'good' && (
                    <div className="text-sm text-blue-700 font-medium bg-white/50 rounded-lg p-2 mt-2">
                      💪 Strong candidate! You meet most requirements for this role.
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 hover:scale-105" 
                    onClick={() => setSelectedJob(job)}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  {missingSkills.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-2 border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 hover:scale-105"
                    >
                      Learn Missing Skills
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200/50 shadow-lg">
        <CardContent className="pt-8 pb-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your Job Market Summary</h3>
            <p className="text-gray-600">Based on your current skills in Rwanda's job market</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">
                {jobsWithScores.filter(j => j.matchScore >= 0.8).length}
              </div>
              <div className="text-sm text-green-700 font-medium">Excellent Matches</div>
            </div>
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">{formatSalary(averageSalaryNumber)}</div>
              <div className="text-sm text-blue-700 font-medium">Avg Salary</div>
            </div>
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {jobsWithScores.filter(j => j.isRemote).length}
              </div>
              <div className="text-sm text-purple-700 font-medium">Remote Jobs</div>
            </div>
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {new Set(jobsWithScores.map(j => j.industry)).size}
              </div>
              <div className="text-sm text-orange-700 font-medium">Industries</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>{selectedJob.title}</CardTitle>
              <CardDescription>
                {selectedJob.company} • {selectedJob.location} • {selectedJob.jobType} • {selectedJob.experienceLevel}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-700">
                <div className="font-medium mb-1">Salary</div>
                <div>
                  {formatSalary(selectedJob.salaryRange.min)} – {formatSalary(selectedJob.salaryRange.max)}
                </div>
              </div>
              {selectedJob.description && (
                <div className="text-sm text-gray-700">
                  <div className="font-medium mb-1">Description</div>
                  <p className="whitespace-pre-wrap">{selectedJob.description}</p>
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium mb-1">Required Skills</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedJob.requiredSkills.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
                {selectedJob.preferredSkills && selectedJob.preferredSkills.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-1">Preferred Skills</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedJob.preferredSkills.map((s) => (
                        <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setSelectedJob(null)}>Close</Button>
                {Boolean((selectedJob as any).url) && (
                  <Button onClick={() => window.open((selectedJob as any).url, '_blank')}>Open Posting</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
