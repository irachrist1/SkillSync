'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Target, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/components/LoadingSpinner';
import { SkillsSelector } from '@/components/SkillsSelector';
import { JobMatches } from '@/components/JobMatches';
import { UserSkill, UserProfile, AIAnalysis } from '@/types';
import { RWANDA_JOB_OPPORTUNITIES, RWANDA_MARKET_INSIGHTS } from '@/data/rwanda-skills';
import { LocalStorageManager } from '@/lib/localStorage';
import { GeminiCareerAnalyst } from '@/lib/gemini';

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'skills' | 'analysis'>('welcome');
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved data on component mount
  useEffect(() => {
    const savedProfile = LocalStorageManager.getUserProfile();
    const savedAnalysis = LocalStorageManager.getAIAnalysis();
    
    if (savedProfile) {
      setUserProfile(savedProfile);
      setUserSkills(savedProfile.skills);
      
      // Skip to analysis if we have recent data
      if (savedAnalysis && !LocalStorageManager.isDataStale(savedAnalysis.lastAnalyzed, 24)) {
        setAiAnalysis(savedAnalysis);
        setCurrentStep('analysis');
      } else if (savedProfile.skills.length > 0) {
        setCurrentStep('skills');
      }
    }
  }, []);

  const handleGetStarted = () => {
    setCurrentStep('skills');
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
      // For now, use mock analysis since API key might not be set
      // const analyst = new GeminiCareerAnalyst();
      // const recommendation = await analyst.analyzeCareerOpportunities(userProfile, RWANDA_JOB_OPPORTUNITIES);
      
      // Mock analysis for demo purposes
      const mockAnalysis: AIAnalysis = {
        userProfile,
        currentOpportunities: RWANDA_JOB_OPPORTUNITIES.slice(0, 3),
        recommendations: {
          currentOpportunities: RWANDA_JOB_OPPORTUNITIES.slice(0, 3),
          skillGaps: [
            {
              skill: 'React',
              importance: 'high',
              timeToLearn: '4-6 weeks',
              salaryImpact: 150000,
              opportunities: 8,
              learningResources: []
            }
          ],
          nextLevelOpportunities: RWANDA_JOB_OPPORTUNITIES.slice(3),
          learningPath: {
            id: 'path-react',
            title: 'React Development Path',
            description: 'Master React for Rwanda job market',
            targetSkill: 'React',
            totalDuration: '6 weeks',
            phases: [],
            projects: [],
            milestones: []
          },
          salaryProjection: {
            current: 300000,
            potential: 450000,
            timeframe: '6 months'
          }
        },
        marketInsights: RWANDA_MARKET_INSIGHTS,
        lastAnalyzed: new Date()
      };

      setAiAnalysis(mockAnalysis);
      LocalStorageManager.saveAIAnalysis(mockAnalysis);
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
            >
              See Demo
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
            </div>
          </CardContent>
        </Card>
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
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <p className="text-red-800 text-sm">{error}</p>
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
            jobs={RWANDA_JOB_OPPORTUNITIES}
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
        </div>
    </div>
  );
}

  return <LoadingState message="Loading your profile..." />;
}