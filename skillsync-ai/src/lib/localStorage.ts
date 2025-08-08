// localStorage utilities for SkillSync AI user data persistence

import { UserProfile, AIAnalysis } from '@/types';

const STORAGE_KEYS = {
  USER_PROFILE: 'skillsync_user_profile',
  AI_ANALYSIS: 'skillsync_ai_analysis',
  LEARNING_PROGRESS: 'skillsync_learning_progress',
  PREFERENCES: 'skillsync_preferences'
};

export class LocalStorageManager {
  // User Profile Management
  static saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify({
        ...profile,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  }

  static getUserProfile(): UserProfile | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (!stored) return null;
      
      const profile = JSON.parse(stored);
      // Convert date strings back to Date objects
      profile.lastUpdated = new Date(profile.lastUpdated);
      return profile;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  // AI Analysis Caching
  static saveAIAnalysis(analysis: AIAnalysis): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AI_ANALYSIS, JSON.stringify({
        ...analysis,
        lastAnalyzed: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error saving AI analysis:', error);
    }
  }

  static getAIAnalysis(): AIAnalysis | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AI_ANALYSIS);
      if (!stored) return null;
      
      const analysis = JSON.parse(stored);
      analysis.lastAnalyzed = new Date(analysis.lastAnalyzed);
      return analysis;
    } catch (error) {
      console.error('Error loading AI analysis:', error);
      return null;
    }
  }

  // Learning Progress Tracking
  static saveLearningProgress(skillId: string, progress: {
    completedResources: string[];
    currentPhase: string;
    timeSpent: number; // minutes
    milestonesDone: string[];
    lastUpdated: Date;
  }): void {
    try {
      const existingProgress = this.getLearningProgress();
      const updatedProgress = {
        ...existingProgress,
        [skillId]: {
          ...progress,
          lastUpdated: new Date().toISOString()
        }
      };
      localStorage.setItem(STORAGE_KEYS.LEARNING_PROGRESS, JSON.stringify(updatedProgress));
    } catch (error) {
      console.error('Error saving learning progress:', error);
    }
  }

  static getLearningProgress(): Record<string, any> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LEARNING_PROGRESS);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading learning progress:', error);
      return {};
    }
  }

  // User Preferences
  static savePreferences(preferences: {
    theme: 'light' | 'dark';
    language: 'en' | 'rw' | 'fr';
    notifications: boolean;
    currency: 'RWF' | 'USD';
    emailUpdates: boolean;
  }): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }

  static getPreferences(): any {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return stored ? JSON.parse(stored) : {
        theme: 'light',
        language: 'en',
        notifications: true,
        currency: 'RWF',
        emailUpdates: false
      };
    } catch (error) {
      console.error('Error loading preferences:', error);
      return {
        theme: 'light',
        language: 'en', 
        notifications: true,
        currency: 'RWF',
        emailUpdates: false
      };
    }
  }

  // Utility methods
  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error clearing ${key}:`, error);
      }
    });
  }

  static isDataStale(lastUpdated: Date, maxAgeHours: number = 24): boolean {
    const now = new Date();
    const ageInHours = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
    return ageInHours > maxAgeHours;
  }

  static getStorageUsage(): { used: number; available: number } {
    try {
      let used = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length;
        }
      }
      
      // Estimate available space (browsers typically allow 5-10MB for localStorage)
      const estimated = 5 * 1024 * 1024; // 5MB in bytes
      return {
        used: used,
        available: Math.max(0, estimated - used)
      };
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      return { used: 0, available: 0 };
    }
  }

  // Export/Import functionality for data portability
  static exportUserData(): string {
    const data = {
      profile: this.getUserProfile(),
      analysis: this.getAIAnalysis(),
      progress: this.getLearningProgress(),
      preferences: this.getPreferences(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  static importUserData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.profile) this.saveUserProfile(data.profile);
      if (data.analysis) this.saveAIAnalysis(data.analysis);
      if (data.preferences) this.savePreferences(data.preferences);
      
      // Import learning progress
      if (data.progress) {
        Object.entries(data.progress).forEach(([skillId, progress]) => {
          this.saveLearningProgress(skillId, progress as any);
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error importing user data:', error);
      return false;
    }
  }

  // Courses storage (simple local DB)
  static saveCourse(course: any): void {
    try {
      const raw = localStorage.getItem('skillsync_courses');
      const list = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex((c: any) => c.id === course.id);
      if (idx >= 0) list[idx] = course; else list.unshift(course);
      localStorage.setItem('skillsync_courses', JSON.stringify(list));
    } catch (e) { console.error('saveCourse error', e); }
  }

  static listCourses(): any[] {
    try { return JSON.parse(localStorage.getItem('skillsync_courses') || '[]'); } catch { return []; }
  }

  static getCourse(id: string): any | null {
    try {
      const list = this.listCourses();
      return list.find((c: any) => c.id === id) || null;
    } catch { return null; }
  }
}
