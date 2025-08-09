import { AIAnalysis, Course } from '@/types';

const API_BASE_URL = '/api'; // Use relative path to call the Next.js proxy

/**
 * A generic POST request handler.
 * @param endpoint The API endpoint to call.
 * @param body The request body.
 * @returns The JSON response.
 */
async function post<T>(endpoint: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorInfo = await response.json().catch(() => ({ error: 'An unknown API error occurred' }));
    throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorInfo.error || 'No details provided'}`);
  }

  return response.json();
}

// This is a simplified placeholder for the fallback logic.
let fallbackUsed = false;

export const Services = {
  /**
   * Calls the backend to get a full analysis of the user's skills.
   * @param skills A list of the user's skills.
   * @returns The AI analysis.
   */
  generateFullAnalysis: (skills: string[]): Promise<AIAnalysis> => {
    return post<AIAnalysis>('generate-full-analysis', { skills });
  },

  /**
   * Calls the backend to generate a course for a specific skill.
   * @param target_skill The skill to generate a course for.
   * @param level The user's level in that skill.
   * @returns The generated course.
   */
  generateCourse: (target_skill: string, level: string): Promise<{ course: Course }> => {
    return post<{ course: Course }>('generate-course', { target_skill, level });
  },

  /**
   * Resets the fallback flag. 
   * In a real app, this would be part of a more complex offline/error handling strategy.
   */
  resetFallbackFlag: () => {
    fallbackUsed = false;
  },

  /**
   * Checks if a fallback was used for the last operation.
   * @returns True if a fallback was used, false otherwise.
   */
  wasFallbackUsed: (): boolean => {
    return fallbackUsed;
  },

  /**
   * Calls the backend to get a response from the AI coach.
   * @param role The role of the coach (tutor, coach, mentor).
   * @param analysis The AI analysis object.
   * @param question The user's question.
   * @returns The coach's response and follow-up suggestions.
   */
  coachChat: (role: string, analysis: any, question: string): Promise<{ chat: { answer: string; follow_ups: string[] } }> => {
    return post<{ chat: { answer: string; follow_ups: string[] } }>('coach-chat', { role, analysis, question });
  },
};