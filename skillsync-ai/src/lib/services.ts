// Client-side service layer to switch between backend and local stubs

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7800';
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

async function postJson(path: string, body: any) {
  const url = `${API_URL}${path}`;
  const attempt = async () => fetch(url, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
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

function stubMarketInsights(skills: string[]) {
  const insights = [
    'Front-end roles are growing in Rwanda with demand for React and TypeScript.',
    'Knowledge of Git and collaborative workflows is expected for junior roles.',
    'Pay growth is highest for candidates who can ship production-ready UI.',
  ];
  return Promise.resolve({ insights: { insights } });
}

// ---- Public API
export const Services = {
  matchJobs(skills: string[]) {
    return useBackend() ? postJson('/skillsync/match-jobs', { skills }) : stubMatchJobs(skills);
  },
  gapAnalysis(skills: string[]) {
    return useBackend() ? postJson('/skillsync/opportunity-gap-analysis', { skills }) : stubGapAnalysis(skills);
  },
  salaryImpact(skills: string[], new_skill: string) {
    return useBackend() ? postJson('/skillsync/salary-impact-calculator', { skills, new_skill }) : stubSalaryImpact(skills, new_skill);
  },
  generateCurriculum(skills_to_learn: string[]) {
    return useBackend() ? postJson('/skillsync/generate-curriculum', { skills_to_learn }) : stubCurriculum(skills_to_learn);
  },
  marketInsights(skills: string[]) {
    return useBackend() ? postJson('/skillsync/market-insights', { skills }) : stubMarketInsights(skills);
  },
  useBackend,
  resetFallbackFlag,
  wasFallbackUsed,
};


