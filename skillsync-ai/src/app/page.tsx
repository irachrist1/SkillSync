'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Target, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/components/LoadingSpinner';
import { SkillsSelector } from '@/components/SkillsSelector';
import { JobMatches } from '@/components/JobMatches';
import { LearningPath } from '@/components/LearningPath';
import { NextLevelJobs } from '@/components/NextLevelJobs';
import { GuidedDemo } from '@/components/GuidedDemo';
import { CoachChat } from '@/components/CoachChat';
import { CourseOutline } from '@/components/CourseOutline';
import { UserSkill, UserProfile, AIAnalysis, JobOpportunity } from '@/types';
import { LocalStorageManager } from '@/lib/localStorage';
import { Services } from '@/lib/services';
import { useRouter, useSearchParams } from 'next/navigation';

// API_URL retained for backward compatibility; service layer controls traffic now

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<'welcome' | 'skills' | 'analysis'>('welcome');
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const [showCoach, setShowCoach] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState<any | null>(null);

  // Load initial step from query/local storage on mount
  useEffect(() => {
    const stepFromQuery = searchParams.get('step');
    const savedProfile = LocalStorageManager.getUserProfile();
    const savedAnalysis = LocalStorageManager.getAIAnalysis();
    
    if (stepFromQuery === 'welcome' || stepFromQuery === 'skills' || stepFromQuery === 'analysis') {
      setCurrentStep(stepFromQuery);
    }

    if (savedProfile) {
      setUserProfile(savedProfile);
      setUserSkills(savedProfile.skills);
      
      // Skip to analysis if we have recent data
      if (savedAnalysis && !LocalStorageManager.isDataStale(savedAnalysis.lastAnalyzed, 24)) {
        setAiAnalysis(savedAnalysis);
        if (!stepFromQuery) setCurrentStep('analysis');
      } else if (savedProfile.skills.length > 0) {
        if (!stepFromQuery) setCurrentStep('skills');
      }
    }
  }, [searchParams]);

  // Sync step to URL query
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('step', currentStep);
    // Keep history clean
    router.replace(url.pathname + url.search);
  }, [currentStep, router]);

  // UX polish: focus search on Skills, scroll to top on Analysis
  useEffect(() => {
    if (currentStep === 'skills') {
      setTimeout(() => {
        const el = document.getElementById('skill-search-input') as HTMLInputElement | null;
        el?.focus();
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 0);
    } else if (currentStep === 'analysis') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  const handleGetStarted = () => {
    setCurrentStep('skills');
  };

  const handleSeeDemo = () => {
    // Preload a realistic demo skill set and auto-run analysis
    const demoSkills: UserSkill[] = [
      { id: `demo-html`, name: 'HTML', category: 'technical', level: 'intermediate' },
      { id: `demo-css`, name: 'CSS', category: 'technical', level: 'intermediate' },
      { id: `demo-js`, name: 'JavaScript', category: 'technical', level: 'intermediate' },
      { id: `demo-react`, name: 'React', category: 'technical', level: 'beginner' },
      { id: `demo-git`, name: 'Git', category: 'technical', level: 'beginner' },
    ];

    handleSkillsChange(demoSkills);
    setCurrentStep('skills');

    // Ensure state is applied before running analysis
    setTimeout(() => {
      void handleAnalyzeSkills();
    }, 0);
  };

  const handleSkillsChange = (skills: UserSkill[]) => {
    setUserSkills(skills);
    
    // Update user profile
    const profile: UserProfile = {
      id: userProfile?.id || `user-${Date.now()}`,
      skills,
      experience: userProfile?.experience || 'Not specified',
      location: userProfile?.location || 'Kigali, Rwanda',
      preferredIndustries: userProfile?.preferredIndustries || ['Technology'],
      lastUpdated: new Date()
    };
    
    setUserProfile(profile);
    LocalStorageManager.saveUserProfile(profile);
  };

  const handleAnalyzeSkills = async () => {
    if (userSkills.length === 0 || !userProfile) {
      setError('Please select at least one skill to analyze opportunities.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Call service layer (backend or stubs)
      const skillsList = userSkills.map(s => s.name.toLowerCase());
      Services.resetFallbackFlag();
      const matchedJobsData = await Services.matchJobs(skillsList);

      // Normalize backend jobs (snake_case → camelCase, fill required fields)
      const normalizeJobs = (backendJobs: any[]): JobOpportunity[] => {
        return (backendJobs || []).map((j: any, index: number) => ({
          id: String(j.id ?? index),
          title: j.title ?? 'Job Opportunity',
          company: j.company ?? '—',
          location: j.location ?? 'Kigali, Rwanda',
          industry: j.industry ?? 'Technology',
          salaryRange: j.salaryRange ?? { min: 0, max: 0, currency: 'RWF' },
          requiredSkills: j.requiredSkills ?? j.required_skills ?? [],
          preferredSkills: j.preferredSkills ?? j.preferred_skills ?? [],
          experienceLevel: j.experienceLevel ?? 'entry',
          description: j.description ?? '',
          jobType: j.jobType ?? 'full-time',
          isRemote: Boolean(j.isRemote ?? false),
          postedDate: j.postedDate ? new Date(j.postedDate) : new Date(),
        }));
      };
      const normalizedJobs = normalizeJobs(matchedJobsData.qualified_jobs);

      const gapAnalysisData = await Services.gapAnalysis(skillsList);

      const salaryImpactData = await Services.salaryImpact(
        skillsList,
        gapAnalysisData.analysis.recommendations[0]?.skill || ''
      );

      const curriculumData = await Services.generateCurriculum(
        gapAnalysisData.analysis.recommendations.map((r: any) => r.skill)
      );

      const marketInsightsData = await Services.marketInsights(skillsList);

      // Calculate current salary from normalized jobs
      const currentSalary = normalizedJobs.reduce((max: number, job: any) => Math.max(max, job.salaryRange?.max ?? 0), 0);

      // Construct AIAnalysis object from API responses
      const newAIAnalysis: AIAnalysis = {
        userProfile: userProfile,
        currentOpportunities: normalizedJobs,
        recommendations: {
          currentOpportunities: normalizedJobs,
          skillGaps: gapAnalysisData.analysis.recommendations || [],
          nextLevelOpportunities: [],
          learningPath: (curriculumData?.curriculum?.learning_path) || [],
          salaryProjection: {
            current: currentSalary,
            potential: currentSalary + salaryImpactData.potential_salary_increase_rwf,
            timeframe: '6 months'
          }
        },
        marketInsights: Array.isArray(marketInsightsData?.insights?.insights)
          ? marketInsightsData.insights.insights
          : Array.isArray(marketInsightsData?.insights)
            ? marketInsightsData.insights
            : [],
        lastAnalyzed: new Date()
      };

      setAiAnalysis(newAIAnalysis);
      if (Services.wasFallbackUsed()) {
        setError('Low‑data mode: showing cached/local results due to network issues.');
      }
      LocalStorageManager.saveAIAnalysis(newAIAnalysis);
      setCurrentStep('analysis');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze your skills. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setCurrentStep('skills');
    setAiAnalysis(null);
  };

  if (currentStep === 'welcome') {
  return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Skills.
            <br />
            <span className="text-blue-600">Rwanda's Opportunities.</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect your current skills directly to real job opportunities in Rwanda, 
            then get AI-powered learning paths to unlock better career outcomes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleGetStarted} 
              size="lg"
              className="text-lg px-8 py-4"
            >
              Get Started Free
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-4"
              onClick={handleSeeDemo}
            >
              See Demo
            </Button>
            <Button 
              variant="ghost" 
              size="lg"
              className="text-lg px-8 py-4"
              onClick={() => setShowDemo(true)}
            >
              Guided Demo (90s)
            </Button>
          </div>
        </div>

        {/* Value Propositions */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Real Job Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                See exactly what jobs you qualify for today in Rwanda with your current skills and realistic salary ranges.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Smart Gap Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                AI identifies 1-2 specific skills that unlock 2x better opportunities with clear learning paths and ROI.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Rwanda Job Market</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Real local employment data from kLab, SOLVIT Africa, and actual job postings - not generic global content.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Market Insights Preview */}
          <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">🇷🇼 Rwanda Digital Job Market</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-900 mb-3">High-Demand Skills</h4>
                <ul className="space-y-1 text-blue-800 text-sm">
                  <li>• Web Development (70% of jobs)</li>
                  <li>• Data Analysis (45% growth)</li>
                  <li>• FinTech Integration (Mobile Money)</li>
                  <li>• Digital Marketing (Remote-friendly)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-3">Market Opportunities</h4>
                <ul className="space-y-1 text-blue-800 text-sm">
                  <li>• Entry-level: 150k - 400k RWF</li>
                  <li>• Mid-level: 400k - 700k RWF</li>
                  <li>• Senior-level: 700k+ RWF</li>
                  <li>• Remote work: +200% since 2020</li>
                </ul>
              </div>
                <div className="md:col-span-2 text-xs text-blue-900/80 mt-2">
                  Sources: kLab Rwanda, SOLVIT Africa, public job postings. Data is indicative for demo.
                </div>
            </div>
          </CardContent>
        </Card>
        {showDemo && <GuidedDemo onClose={() => setShowDemo(false)} />}
      </div>
    );
  }

  if (currentStep === 'skills') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Skills Assessment</h1>
              <p className="text-gray-600">
                Tell us about your current skills to discover opportunities
              </p>
            </div>
            {userSkills.length > 0 && (
              <Button 
                onClick={handleAnalyzeSkills}
                disabled={isAnalyzing}
                className="shrink-0"
              >
                {isAnalyzing ? 'Analyzing...' : `Analyze ${userSkills.length} Skills`}
              </Button>
            )}
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4 flex items-center justify-between">
              <p className="text-red-800 text-sm mr-4">{error}</p>
              <Button size="sm" variant="outline" onClick={handleAnalyzeSkills}>Retry</Button>
            </div>
          )}
        </div>

        <SkillsSelector
          selectedSkills={userSkills}
          onSkillsChange={handleSkillsChange}
        />

        {userSkills.length > 0 && !isAnalyzing && (
          <div className="mt-8 text-center">
            <Button 
              onClick={handleAnalyzeSkills}
              size="lg"
              className="px-8"
            >
              Analyze My Skills & Find Jobs
            </Button>
          </div>
        )}

        {isAnalyzing && (
          <LoadingState message="Analyzing your skills against Rwanda's job market..." />
        )}
      </div>
    );
  }

  if (currentStep === 'analysis' && aiAnalysis) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Career Analysis</h1>
              <p className="text-gray-600">
                Based on your {userSkills.length} skills and Rwanda's job market
              </p>
            </div>
            <Button variant="outline" onClick={resetAnalysis}>
              Update Skills
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          <JobMatches 
            jobs={aiAnalysis.recommendations.currentOpportunities}
            userSkills={userSkills}
          />

          {/* Salary Projection Card */}
          <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">💰 Earning Potential</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {aiAnalysis.recommendations.salaryProjection.current.toLocaleString()} RWF
                  </div>
                  <div className="text-sm text-green-700">Current Potential (Monthly)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {aiAnalysis.recommendations.salaryProjection.potential.toLocaleString()} RWF
                  </div>
                  <div className="text-sm text-blue-700">With Recommended Skills</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white rounded-lg">
                <div className="text-sm text-gray-600">
                  <strong>Potential increase:</strong> {' '}
                  {((aiAnalysis.recommendations.salaryProjection.potential - aiAnalysis.recommendations.salaryProjection.current) / 1000).toFixed(0)}k RWF/month
                  ({Math.round(((aiAnalysis.recommendations.salaryProjection.potential / aiAnalysis.recommendations.salaryProjection.current) - 1) * 100)}% boost)
                </div>
                {/* M2: Impact summary */}
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                  <div>
                    <div className="text-xl font-semibold text-blue-700">
                      {aiAnalysis.recommendations.currentOpportunities.filter(j => j.matchScore && j.matchScore >= 0.8).length}
                    </div>
                    <div className="text-xs text-gray-600">Excellent Matches</div>
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-emerald-700">
                      {(aiAnalysis.recommendations.salaryProjection.potential - aiAnalysis.recommendations.salaryProjection.current).toLocaleString()} RWF
                    </div>
                    <div className="text-xs text-gray-600">Salary Delta</div>
                  </div>
                  <div>
                    <div className={`text-xl font-semibold ${aiAnalysis.recommendations.salaryProjection.potential - aiAnalysis.recommendations.salaryProjection.current > 200000 ? 'text-green-700' : 'text-amber-700'}`}>
                      {aiAnalysis.recommendations.salaryProjection.potential - aiAnalysis.recommendations.salaryProjection.current > 200000 ? 'High' : 'Moderate'}
                    </div>
                    <div className="text-xs text-gray-600">ROI Meter</div>
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-purple-700">
                      {aiAnalysis.recommendations.skillGaps.length}
                    </div>
                    <div className="text-xs text-gray-600">Skills to Learn</div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => setShowCoach(true)}>Ask a Coach</Button>
                  <Button size="sm" onClick={() => {
                    try {
                      const blob = new Blob([JSON.stringify(aiAnalysis, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `skillsync-analysis-${new Date().toISOString()}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    } catch {}
                  }}>Export Findings</Button>
                  <Button size="sm" variant="secondary" onClick={async () => {
                    const topSkill = (aiAnalysis.recommendations.skillGaps?.[0]?.skill || 'React') as string;
                    const res = await Services.generateCourse(topSkill, 'beginner');
                    setGeneratedCourse(res.course || null);
                    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
                  }}>Generate Full Course</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Insights */}
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

          <NextLevelJobs 
            jobs={aiAnalysis.recommendations.nextLevelOpportunities}
            userSkills={userSkills}
          />
        </div>
        <CoachChat open={showCoach} onClose={() => setShowCoach(false)} analysis={aiAnalysis} />
    </div>
  );
}

  return <LoadingState message="Loading your profile..." />;
}