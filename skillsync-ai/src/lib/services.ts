// Client-side service layer to switch between backend and local stubs

const API_URL = '/api';
const USE_BACKEND = (process.env.NEXT_PUBLIC_USE_BACKEND || 'true').toLowerCase() === 'true';

let fallbackUsed = false;
export function resetFallbackFlag() { fallbackUsed = false; }
export function wasFallbackUsed() { return fallbackUsed; }

function useBackend(): boolean {
  return USE_BACKEND;
}

// ---- Real backend calls
// Basic retry/backoff + local cache fallback
function getCacheKey(path: string, body: any) {
  return `skillsync_cache:${path}:${JSON.stringify(body)}`;
}

function saveCache(path: string, body: any, data: unknown) {
  try { localStorage.setItem(getCacheKey(path, body), JSON.stringify({ data, ts: Date.now() })); } catch {}
}

function readCache(path: string, body: any): any | null {
  try {
    const raw = localStorage.getItem(getCacheKey(path, body));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.data ?? null;
  } catch { return null; }
}

async function postJson(path: string, body: any, onChunk?: (chunk: any) => void) {
  const url = `${API_URL}${path}`;
  const attempt = async () => fetch(url, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });

  if (path.includes('coach-chat') && onChunk) {
    const response = await attempt();
    if (!response.body) return;
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || ''; // Keep the last partial line

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const json = JSON.parse(line.substring(6));
            onChunk(json);
          } catch (e) {
            console.error('Failed to parse stream chunk:', e);
          }
        }
      }
    }
    return; // End of stream
  }

  let lastErr: any = null;
  for (let i = 0; i < 2; i++) { // 2 attempts
    try {
      const res = await attempt();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      saveCache(path, body, json);
      return json;
    } catch (e) {
      lastErr = e;
      await new Promise(r => setTimeout(r, 250 * (i + 1)));
    }
  }
  // Fallback to cache, then stub if available
  const cached = readCache(path, body);
  if (cached) { fallbackUsed = true; return cached; }
  if (path.includes('match-jobs')) { fallbackUsed = true; return stubMatchJobs(body.skills || []); }
  if (path.includes('opportunity-gap-analysis')) { fallbackUsed = true; return stubGapAnalysis(body.skills || []); }
  if (path.includes('salary-impact-calculator')) { fallbackUsed = true; return stubSalaryImpact(body.skills || [], body.new_skill || ''); }
  if (path.includes('generate-curriculum')) { fallbackUsed = true; return stubCurriculum(body.skills_to_learn || []); }
  if (path.includes('market-insights')) { fallbackUsed = true; return stubMarketInsights(body.skills || []); }
  if (path.includes('coach-chat')) { fallbackUsed = true; return stubCoachChat(body); }
  if (path.includes('generate-course')) { fallbackUsed = true; return stubGenerateCourse(body); }
  throw lastErr || new Error('Unknown error');
}

// ---- Stub implementations (mirror backend JSON shape)
function stubMatchJobs(skills: string[]) {
  const jobs = [
    {
      id: 1,
      title: 'Entry-level Web Developer',
      salaryRange: { min: 150000, max: 300000, currency: 'RWF' },
      required_skills: ['html', 'css', 'javascript'],
      company: 'Local Startup',
      location: 'Kigali, Rwanda',
      industry: 'Technology',
      jobType: 'full-time',
      experienceLevel: 'entry',
      postedDate: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Frontend Developer (React)',
      salaryRange: { min: 400000, max: 600000, currency: 'RWF' },
      required_skills: ['html', 'css', 'javascript', 'react', 'git'],
      company: 'Fintech Co',
      location: 'Kigali, Rwanda',
      industry: 'Technology',
      jobType: 'full-time',
      experienceLevel: 'entry',
      postedDate: new Date().toISOString(),
    },
  ];

  const hasSkills = (req: string[]) => req.every(s => skills.includes(s));
  const qualified_jobs = jobs.filter(j => hasSkills(j.required_skills));
  return Promise.resolve({ qualified_jobs });
}

function stubGapAnalysis(skills: string[]) {
  const recommendations: any[] = [];
  if (!skills.includes('react')) {
    recommendations.push({ skill: 'react', explanation: 'Unlock modern frontend roles in Kigali', potential_salary_increase_rwf: 300000 });
  }
  if (!skills.includes('git')) {
    recommendations.push({ skill: 'git', explanation: 'Collaboration and workflows required by most employers', potential_salary_increase_rwf: 50000 });
  }
  return Promise.resolve({ analysis: { recommendations } });
}

function stubSalaryImpact(skills: string[], new_skill: string) {
  const base = (new_skill || '').toLowerCase() === 'react' && skills.includes('javascript') ? 300000 : 0;
  return Promise.resolve({ potential_salary_increase_rwf: base });
}

function stubCurriculum(skills_to_learn: string[]) {
  const learning_path = skills_to_learn.map(skill => {
    const s = skill.toLowerCase();
    let resource = 'https://www.freecodecamp.org/';
    if (s === 'react' || s === 'frontend') resource = 'https://klab.rw/';
    if (s === 'python' || s === 'data analysis') resource = 'https://solvit.africa/';
    return {
      skill,
      resource,
      project: `Build a mini project to practice ${skill}`,
    };
  });
  return Promise.resolve({ curriculum: { learning_path } });
}

function stubMarketInsights(_skills: string[]) {
  const insights: string[] = [
    'Front-end roles are growing in Rwanda with demand for React and TypeScript.',
    'Knowledge of Git and collaborative workflows is expected for junior roles.',
    'Pay growth is highest for candidates who can ship production-ready UI.',
  ];
  return Promise.resolve({ insights: { insights } });
}

function stubCoachChat(body: any) {
  const answer = body?.question?.toLowerCase().includes('next')
    ? 'Based on your analysis, learn React next to unlock 400–600k RWF roles. Start with components, hooks, and a mini CRUD app.'
    : 'Focus on one high‑ROI skill, schedule 45 minutes daily, and ship one small project per week.';
  return Promise.resolve({ chat: { answer, follow_ups: ['Which skill unlocks the most jobs?', 'Give me a 2‑week plan.', 'How do I build a portfolio project?'] } });
}

function stubGenerateCourse(body: any) {
  const skill = body?.target_skill || 'React';
  return Promise.resolve({
    course: {
      title: `${skill} in 2 Weeks (Practical)`,
      duration: '2 weeks',
      modules: [
        { title: 'Foundations', lessons: [{ title: 'Intro', resource: 'https://www.freecodecamp.org/' }] },
        { title: 'Core Concepts', lessons: [{ title: 'Hands‑on', resource: 'https://www.youtube.com' }] },
      ],
      project: { title: `${skill} Mini App`, brief: 'Build and deploy a small app demonstrating key concepts.' }
    }
  });
}

// ---- Public API
export const Services = {
  generateFullAnalysis(skills: string[]) {
    return postJson('/generate-full-analysis', { skills });
  },
  coachChat(role: string, analysis: any, question: string, onChunk: (chunk: any) => void) {
    return useBackend() ? postJson('/coach-chat', { role, analysis, question }, onChunk) : stubCoachChat({ role, analysis, question });
  },
  generateCourse(target_skill: string, level?: string) {
    return useBackend() ? postJson('/generate-course', { target_skill, level }) : stubGenerateCourse({ target_skill, level });
  },
  useBackend,
  resetFallbackFlag,
  wasFallbackUsed,
};