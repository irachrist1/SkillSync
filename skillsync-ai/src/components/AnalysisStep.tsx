'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JobMatches } from '@/components/JobMatches';
import { LearningPath } from '@/components/LearningPath';
import { NextLevelJobs } from '@/components/NextLevelJobs';
import { CourseOutline } from '@/components/CourseOutline';
import { CoachChat } from '@/components/CoachChat';
import { AIAnalysis, UserSkill } from '@/types';
import { Services } from '@/lib/services';
import { LocalStorageManager } from '@/lib/localStorage';

interface AnalysisStepProps {
  aiAnalysis: AIAnalysis;
  userSkills: UserSkill[];
  onReset: () => void;
  onShowCoach: () => void;
  onGenerateCourse: (skill: string) => void;
  generatedCourse: any | null;
}

export function AnalysisStep({ aiAnalysis, userSkills, onReset, onShowCoach, onGenerateCourse, generatedCourse }: AnalysisStepProps) {
  const handleExport = () => {
    try {
      const blob = new Blob([JSON.stringify(aiAnalysis, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `skillsync-analysis-${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Career Analysis</h1>
            <p className="text-gray-600">Based on your {userSkills.length} skills and Rwanda's job market</p>
          </div>
          <Button variant="outline" onClick={onReset}>Update Skills</Button>
        </div>
      </div>
      <div className="space-y-8">
        <JobMatches jobs={aiAnalysis.currentOpportunities} userSkills={userSkills} />
        <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">💰 Earning Potential</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-2xl font-bold text-green-600 mb-2">{aiAnalysis.recommendations.salaryProjection.current.toLocaleString()} RWF</div>
                <div className="text-sm text-green-700">Current Potential (Monthly)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-2">{aiAnalysis.recommendations.salaryProjection.potential.toLocaleString()} RWF</div>
                <div className="text-sm text-blue-700">With Recommended Skills</div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded-lg">
              <div className="text-sm text-gray-600">
                <strong>Potential increase:</strong> {' '}
                {((aiAnalysis.recommendations.salaryProjection.potential - aiAnalysis.recommendations.salaryProjection.current) / 1000).toFixed(0)}k RWF/month
                ({Math.round(((aiAnalysis.recommendations.salaryProjection.potential / aiAnalysis.recommendations.salaryProjection.current) - 1) * 100)}% boost)
              </div>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                <div>
                  <div className="text-xl font-semibold text-blue-700">{aiAnalysis.currentOpportunities.filter(j => j.matchScore && j.matchScore >= 0.8).length}</div>
                  <div className="text-xs text-gray-600">Excellent Matches</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-emerald-700">{(aiAnalysis.recommendations.salaryProjection.potential - aiAnalysis.recommendations.salaryProjection.current).toLocaleString()} RWF</div>
                  <div className="text-xs text-gray-600">Salary Delta</div>
                </div>
                <div>
                  <div className={`text-xl font-semibold ${aiAnalysis.recommendations.salaryProjection.potential - aiAnalysis.recommendations.salaryProjection.current > 200000 ? 'text-green-700' : 'text-amber-700'}`}>
                    {aiAnalysis.recommendations.salaryProjection.potential - aiAnalysis.recommendations.salaryProjection.current > 200000 ? 'High' : 'Moderate'}
                  </div>
                  <div className="text-xs text-gray-600">ROI Meter</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-purple-700">{aiAnalysis.recommendations.skillGaps.length}</div>
                  <div className="text-xs text-gray-600">Skills to Learn</div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={onShowCoach}>Ask a Coach</Button>
                <Button size="sm" onClick={handleExport}>Export Findings</Button>
                <Button size="sm" variant="secondary" onClick={() => onGenerateCourse(aiAnalysis.recommendations.skillGaps?.[0]?.skill || 'React')}>Generate Full Course</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>📊 Rwanda Market Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {aiAnalysis.marketInsights.map((insight, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="text-gray-700">{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <LearningPath learningPath={aiAnalysis.recommendations.learningPath} />
        {generatedCourse && <CourseOutline course={generatedCourse} />}
        <div className="text-right">
          <a href="/courses" className="text-blue-600 hover:underline text-sm">View all courses →</a>
        </div>
        <NextLevelJobs jobs={aiAnalysis.recommendations.nextLevelOpportunities} userSkills={userSkills} />
      </div>
    </div>
  );
}
