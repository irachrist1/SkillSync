'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useCallback, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { WelcomeStep } from '@/components/WelcomeStep';
import { SkillsStep } from '@/components/SkillsStep';
import { AnalysisStep } from '@/components/AnalysisStep';
import { LoadingState } from '@/components/LoadingSpinner';
import { GuidedDemo } from '@/components/GuidedDemo';
import { CoachChat } from '@/components/CoachChat';
import { UserSkill, UserProfile, AIAnalysis } from '@/types';
import { LocalStorageManager } from '@/lib/localStorage';
import { Services } from '@/lib/services';
import { ChatLauncher } from '@/components/ChatLauncher';
// import { SearchParamsHandler } from '@/components/SearchParamsHandler'; // Removed as it's not used

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

  useEffect(() => {
    const step = searchParams.get('step');
    if (step === 'welcome' || step === 'skills' || step === 'analysis') {
      setCurrentStep(step);
    } else {
      // Default to 'welcome' if no valid step is provided in the URL
      router.replace('/?step=welcome');
    }
  }, [searchParams, router]);

  const handleGetStarted = useCallback(() => setCurrentStep('skills'), []);

  const handleSeeDemo = useCallback(() => {
    const demoSkills: UserSkill[] = [
      { id: `demo-html`, name: 'HTML', category: 'technical', level: 'intermediate' },
      { id: `demo-css`, name: 'CSS', category: 'technical', level: 'intermediate' },
      { id: `demo-js`, name: 'JavaScript', category: 'technical', level: 'intermediate' },
      { id: `demo-react`, name: 'React', category: 'technical', level: 'beginner' },
      { id: `demo-git`, name: 'Git', category: 'technical', level: 'beginner' },
    ];
    handleSkillsChange(demoSkills);
    setCurrentStep('skills');
    setTimeout(() => handleAnalyzeSkills(demoSkills), 0);
  }, []);

  const handleSkillsChange = useCallback((skills: UserSkill[]) => {
    setUserSkills(skills);
    const profile: UserProfile = {
      id: userProfile?.id || `user-${Date.now()}`,
      skills,
      experience: userProfile?.experience || 'Not specified',
      location: userProfile?.location || 'Kigali, Rwanda',
      preferredIndustries: userProfile?.preferredIndustries || ['Technology'],
      lastUpdated: new Date(),
    };
    setUserProfile(profile);
    LocalStorageManager.saveUserProfile(profile);
  }, [userProfile]);

  const handleAnalyzeSkills = useCallback(async (skillsToAnalyze: UserSkill[] = userSkills) => {
    if (skillsToAnalyze.length === 0) {
      setError('Please select at least one skill to analyze opportunities.');
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    try {
      const skillsList = skillsToAnalyze.map(s => s.name.toLowerCase());
      Services.resetFallbackFlag();
      const newAIAnalysis = await Services.generateFullAnalysis(skillsList);
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
  }, [userSkills]);

  const handleReset = useCallback(() => {
    setCurrentStep('skills');
    setAiAnalysis(null);
  }, []);

  const handleShowCoach = useCallback(() => setShowCoach(true), []);

  const handleGenerateCourse = useCallback(async (skill: string) => {
    const skillsList = userSkills.map(s => s.name.toLowerCase());
    const res = await Services.generateCourse(skill, 'beginner', skillsList);
    setGeneratedCourse(res.course || null);
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
    try {
      const doc = {
        id: `course-${Date.now()}`,
        targetSkill: skill,
        level: 'beginner',
        course: res.course,
        createdAt: new Date().toISOString(),
      };
      LocalStorageManager.saveCourse(doc);
    } catch {}
  }, [userSkills]);

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep onGetStarted={handleGetStarted} onSeeDemo={handleSeeDemo} onShowDemo={() => setShowDemo(true)} />;
      case 'skills':
        return <SkillsStep userSkills={userSkills} isAnalyzing={isAnalyzing} error={error} onSkillsChange={handleSkillsChange} onAnalyzeSkills={() => handleAnalyzeSkills()} />;
      case 'analysis':
        if (aiAnalysis) {
          return <AnalysisStep aiAnalysis={aiAnalysis} userSkills={userSkills} onReset={handleReset} onShowCoach={handleShowCoach} onGenerateCourse={handleGenerateCourse} generatedCourse={generatedCourse} />;
        }
        return <LoadingState message="Loading analysis..." />;
      default:
        return <LoadingState message="Loading your profile..." />;
    }
  };

  return (
    <Suspense fallback={null}>
      {renderStep()}
      {showDemo && <GuidedDemo onClose={() => setShowDemo(false)} />}
      {aiAnalysis && <CoachChat open={showCoach} onClose={() => setShowCoach(false)} analysis={aiAnalysis} userSkills={userSkills} />}
      <ChatLauncher userSkills={userSkills} aiAnalysis={aiAnalysis} />
    </Suspense>
  );
}
