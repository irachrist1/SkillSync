'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/LoadingSpinner';
import { SkillsSelector } from '@/components/SkillsSelector';
import { UserSkill } from '@/types';

interface SkillsStepProps {
  userSkills: UserSkill[];
  isAnalyzing: boolean;
  error: string | null;
  onSkillsChange: (skills: UserSkill[]) => void;
  onAnalyzeSkills: () => void;
}

export function SkillsStep({ userSkills, isAnalyzing, error, onSkillsChange, onAnalyzeSkills }: SkillsStepProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Skills Assessment</h1>
            <p className="text-gray-600">Tell us about your current skills to discover opportunities</p>
          </div>
          {userSkills.length > 0 && (
            <Button onClick={onAnalyzeSkills} disabled={isAnalyzing} className="shrink-0">
              {isAnalyzing ? 'Analyzing...' : `Analyze ${userSkills.length} Skills`}
            </Button>
          )}
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4 flex items-center justify-between">
            <p className="text-red-800 text-sm mr-4">{error}</p>
            <Button size="sm" variant="outline" onClick={onAnalyzeSkills}>Retry</Button>
          </div>
        )}
      </div>
      <SkillsSelector selectedSkills={userSkills} onSkillsChange={onSkillsChange} />
      {userSkills.length > 0 && !isAnalyzing && (
        <div className="mt-8 text-center">
          <Button onClick={onAnalyzeSkills} size="lg" className="px-8">Analyze My Skills & Find Jobs</Button>
        </div>
      )}
      {isAnalyzing && <LoadingState message="Analyzing your skills against Rwanda's job market..." />}
    </div>
  );
}
