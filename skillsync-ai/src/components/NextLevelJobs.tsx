'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JobOpportunity, UserSkill } from '@/types';
import { JobMatches } from './JobMatches';

interface NextLevelJobsProps {
  jobs: JobOpportunity[];
  userSkills: UserSkill[];
}

export function NextLevelJobs({ jobs, userSkills }: NextLevelJobsProps) {
  if (!jobs || jobs.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gray-50">
      <CardHeader>
        <CardTitle>🚀 Next-Level Opportunities Unlocked</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          By learning the recommended skills, you can qualify for these additional high-impact roles:
        </p>
        <JobMatches jobs={jobs} userSkills={userSkills} />
      </CardContent>
    </Card>
  );
}