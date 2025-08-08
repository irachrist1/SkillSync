// Utility functions for SkillSync AI

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserSkill, JobOpportunity, SkillGap } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Salary formatting utilities
export function formatSalary(amount: number, currency: 'RWF' | 'USD' = 'RWF'): string {
  if (currency === 'RWF') {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}



export function getMatchCategory(score: number): {
  category: 'excellent' | 'good' | 'fair' | 'poor';
  color: string;
  description: string;
} {
  if (score >= 0.8) {
    return {
      category: 'excellent',
      color: 'text-green-600',
      description: 'Excellent match - you qualify for this role'
    };
  } else if (score >= 0.6) {
    return {
      category: 'good', 
      color: 'text-blue-600',
      description: 'Good match - strong candidate with some gaps'
    };
  } else if (score >= 0.4) {
    return {
      category: 'fair',
      color: 'text-yellow-600',
      description: 'Fair match - significant skill development needed'
    };
  } else {
    return {
      category: 'poor',
      color: 'text-red-600',
      description: 'Poor match - major reskilling required'
    };
  }
}

// Skill gap analysis utilities
export function prioritizeSkillGaps(skillGaps: SkillGap[]): SkillGap[] {
  return skillGaps.sort((a, b) => {
    // Priority scoring: importance + ROI + ease of learning
    const scoreA = getGapPriorityScore(a);
    const scoreB = getGapPriorityScore(b);
    return scoreB - scoreA;
  });
}

function getGapPriorityScore(gap: SkillGap): number {
  const importanceWeights = { critical: 10, high: 7, medium: 4, low: 1 };
  const roiScore = gap.salaryImpact / 100000; // Normalize salary impact
  const opportunityScore = Math.min(gap.opportunities / 10, 5); // Cap at 5 points
  
  // Time to learn (inverse - shorter time = higher score)
  const timeScore = gap.timeToLearn.includes('weeks') ? 5 : 
                   gap.timeToLearn.includes('1-2 months') ? 3 : 1;
  
  return importanceWeights[gap.importance] + roiScore + opportunityScore + timeScore;
}

// Time and date utilities
export function formatDuration(duration: string): string {
  // Convert various duration formats to a standardized display
  const patterns = [
    { regex: /(\d+)-(\d+)\s*weeks?/, format: (m: string[]) => `${m[1]}-${m[2]} weeks` },
    { regex: /(\d+)\s*months?/, format: (m: string[]) => `${m[1]} months` },
    { regex: /(\d+)\s*hours?/, format: (m: string[]) => `${m[1]} hours` }
  ];
  
  for (const pattern of patterns) {
    const match = duration.match(pattern.regex);
    if (match) return pattern.format(match);
  }
  
  return duration;
}

export function formatTimeAgo(dateInput: Date | string | number): string {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) return 'Recently';
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

// Data validation utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateSkillLevel(level: string): boolean {
  const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
  return validLevels.includes(level);
}

// Array utilities
export function removeDuplicates<T>(array: T[], key?: keyof T): T[] {
  if (!key) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    groups[groupKey] = groups[groupKey] || [];
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

// Storage size utilities
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Rwanda-specific utilities
export function getRwandaTimeZone(): string {
  return 'Africa/Kigali';
}

export function calculateJobMatchScore(userSkills: UserSkill[], job: JobOpportunity): number {
  const { requiredSkills, preferredSkills } = job;
  if (!requiredSkills || requiredSkills.length === 0) {
    return 1; // Or some other default for jobs with no required skills
  }

  const userSkillNames = userSkills.map(s => s.name.toLowerCase());
  
  let score = 0;
  const requiredWeight = 0.7;
  const preferredWeight = 0.3;

  // Calculate score for required skills
  const requiredMet = requiredSkills.filter(skill => 
    userSkillNames.some(userSkill => 
      userSkill.includes(skill.toLowerCase()) || skill.toLowerCase().includes(userSkill)
    )
  ).length;
  score += (requiredMet / requiredSkills.length) * requiredWeight;

  // Calculate score for preferred skills
  if (preferredSkills && preferredSkills.length > 0) {
    const preferredMet = preferredSkills.filter(skill => 
      userSkillNames.some(userSkill => 
        userSkill.includes(skill.toLowerCase()) || skill.toLowerCase().includes(userSkill)
      )
    ).length;
    score += (preferredMet / preferredSkills.length) * preferredWeight;
  } else {
    // If no preferred skills, give the remaining weight to required skills
    score += (requiredMet / requiredSkills.length) * preferredWeight;
  }
  
  return Math.min(score, 1); // Ensure score doesn't exceed 1
}

export function formatRwandaDate(date: Date): string {
  return date.toLocaleDateString('en-RW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: getRwandaTimeZone()
  });
}

export function isBusinessHour(): boolean {
  const now = new Date();
  const rwTime = new Date(now.toLocaleString("en-US", {timeZone: getRwandaTimeZone()}));
  const hour = rwTime.getHours();
  return hour >= 8 && hour < 17; // 8 AM to 5 PM Rwanda time
}
