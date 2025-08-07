'use client';

import React from 'react';
import { MapPin, Calendar, Briefcase, ExternalLink, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { JobOpportunity, UserSkill } from '@/types';
import { formatSalary, calculateJobMatchScore, getMatchCategory, formatTimeAgo } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface JobMatchesProps {
  jobs: JobOpportunity[];
  userSkills: UserSkill[];
  className?: string;
}

export function JobMatches({ jobs, userSkills, className }: JobMatchesProps) {
  // Calculate match scores and sort by relevance
  const jobsWithScores = jobs
    .map(job => ({
      ...job,
      matchScore: calculateJobMatchScore(userSkills, job)
    }))
    .sort((a, b) => b.matchScore - a.matchScore);

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

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Job Opportunities for You
        </h2>
        <p className="text-gray-600">
          {jobsWithScores.length} opportunities found in Rwanda's job market, ranked by match.
        </p>
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {jobsWithScores.map((job) => {
          const matchInfo = getMatchCategory(job.matchScore);
          const missingSkills = getMissingSkills(job);

          return (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <Badge className={getIndustryColor(job.industry)}>
                        {job.industry}
                      </Badge>
                      {job.isRemote && (
                        <Badge variant="outline">Remote Available</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.company}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatTimeAgo(job.postedDate)}
                      </div>
                    </div>

                    <CardDescription className="line-clamp-2">
                      {job.description}
                    </CardDescription>
                  </div>

                  <div className="text-right ml-4">
                    <div className="text-lg font-bold text-gray-900 mb-1">
                      {formatSalary(job.salaryRange.min)} - {formatSalary(job.salaryRange.max)}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {getJobTypeIcon(job.jobType)} {job.jobType} • {job.experienceLevel}
                    </div>
                    <Badge 
                      variant={matchInfo.category === 'excellent' ? 'success' : 
                              matchInfo.category === 'good' ? 'info' :
                              matchInfo.category === 'fair' ? 'warning' : 'destructive'}
                      className="text-xs"
                    >
                      <Target className="w-3 h-3 mr-1" />
                      {Math.round(job.matchScore * 100)}% Match
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {/* Required Skills */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {job.requiredSkills.map((skill) => {
                        const hasSkill = userSkills.some(s => 
                          s.name.toLowerCase().includes(skill.toLowerCase()) || 
                          skill.toLowerCase().includes(s.name.toLowerCase())
                        );
                        return (
                          <Badge 
                            key={skill}
                            variant={hasSkill ? "success" : "outline"}
                            className="text-xs"
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
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Preferred Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {job.preferredSkills.map((skill) => {
                          const hasSkill = userSkills.some(s => 
                            s.name.toLowerCase().includes(skill.toLowerCase()) || 
                            skill.toLowerCase().includes(s.name.toLowerCase())
                          );
                          return (
                            <Badge 
                              key={skill}
                              variant={hasSkill ? "info" : "outline"}
                              className="text-xs"
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
                <div className={cn("p-3 rounded-lg mb-4", 
                  matchInfo.category === 'excellent' ? 'bg-green-50 border border-green-200' :
                  matchInfo.category === 'good' ? 'bg-blue-50 border border-blue-200' :
                  matchInfo.category === 'fair' ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-red-50 border border-red-200'
                )}>
                  <div className={cn("text-sm font-medium mb-1", matchInfo.color)}>
                    {matchInfo.description}
                  </div>
                  
                  {missingSkills.length > 0 && (
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Missing skills:</span> {missingSkills.join(', ')}
                    </div>
                  )}
                  
                  {matchInfo.category === 'excellent' && (
                    <div className="text-xs text-green-700 mt-1">
                      🎉 You're ready to apply! Your skills align perfectly with this role.
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  {missingSkills.length > 0 && (
                    <Button variant="outline" size="sm">
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
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {jobsWithScores.filter(j => j.matchScore >= 0.8).length}
              </div>
              <div className="text-sm text-blue-700">Excellent Matches</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {formatSalary(
                  jobsWithScores
                    .filter(j => j.matchScore >= 0.8)
                    .reduce((avg, job) => avg + (job.salaryRange.min + job.salaryRange.max) / 2, 0) / 
                  Math.max(jobsWithScores.filter(j => j.matchScore >= 0.8).length, 1)
                ).replace(/,/g, 'k').replace('RWF', '')}
              </div>
              <div className="text-sm text-green-700">Avg Salary</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {jobsWithScores.filter(j => j.isRemote).length}
              </div>
              <div className="text-sm text-purple-700">Remote Jobs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {new Set(jobsWithScores.map(j => j.industry)).size}
              </div>
              <div className="text-sm text-orange-700">Industries</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
