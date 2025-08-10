'use client';

import { useEffect } from 'react';
// import { useSearchParams } from 'next/navigation'; // Temporarily commented out
import { LocalStorageManager } from '@/lib/localStorage';
import { AIAnalysis, UserProfile, UserSkill } from '@/types';

interface SearchParamsHandlerProps {
  setCurrentStep: (step: 'welcome' | 'skills' | 'analysis') => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setUserSkills: (skills: UserSkill[]) => void;
  setAiAnalysis: (analysis: AIAnalysis | null) => void;
}

export function SearchParamsHandler({
  setCurrentStep,
  setUserProfile,
  setUserSkills,
  setAiAnalysis,
}: SearchParamsHandlerProps) {
  // const searchParams = useSearchParams(); // Temporarily commented out

  useEffect(() => {
    // const stepFromQuery = searchParams.get('step'); // Temporarily commented out
    const savedProfile = LocalStorageManager.getUserProfile();
    const savedAnalysis = LocalStorageManager.getAIAnalysis();

    // if (stepFromQuery === 'welcome' || stepFromQuery === 'skills' || stepFromQuery === 'analysis') {
    //   setCurrentStep(stepFromQuery);
    // }

    if (savedProfile) {
      setUserProfile(savedProfile);
      setUserSkills(savedProfile.skills);

      if (savedAnalysis && !LocalStorageManager.isDataStale(savedAnalysis.lastAnalyzed, 24)) {
        setAiAnalysis(savedAnalysis);
        // if (!stepFromQuery) setCurrentStep('analysis');
      } else if (savedProfile.skills.length > 0) {
        // if (!stepFromQuery) setCurrentStep('skills');
      }
    }
  }, [/* searchParams, */ setCurrentStep, setUserProfile, setUserSkills, setAiAnalysis]); // Temporarily commented out searchParams

  return null; // This component doesn't render anything
}
