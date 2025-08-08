// Client-side service layer to switch between backend and local stubs

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7800';
const USE_BACKEND = (process.env.NEXT_PUBLIC_USE_BACKEND || 'true').toLowerCase() === 'true';

// 🎯 DEMO MODE - Set to true for guaranteed demo experience with rich mock data
const DEMO_MODE = true; // Toggle this to true for demo

let fallbackUsed = false;
export function resetFallbackFlag() { fallbackUsed = false; }
export function wasFallbackUsed() { return fallbackUsed; }

function useBackend(): boolean {
  return USE_BACKEND && !DEMO_MODE;
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
  if (path.includes('coach-chat')) { fallbackUsed = true; return stubCoachChat(body); }
  if (path.includes('generate-course')) { fallbackUsed = true; return stubGenerateCourse(body); }
  throw lastErr || new Error('Unknown error');
}

// ---- Enhanced Stub implementations for Demo (mirror backend JSON shape)
// Realistic loading delays to simulate API processing
async function simulateProcessing(operation: string, baseDelay: number = 2000): Promise<void> {
  // Different delays based on operation complexity
  const delays = {
    'match-jobs': 1800 + Math.random() * 800, // 1.8-2.6s
    'gap-analysis': 3200 + Math.random() * 1200, // 3.2-4.4s (most complex)
    'salary-impact': 1200 + Math.random() * 600, // 1.2-1.8s
    'curriculum': 2800 + Math.random() * 1000, // 2.8-3.8s
    'market-insights': 2200 + Math.random() * 800, // 2.2-3.0s
    'coach-chat': 1500 + Math.random() * 700, // 1.5-2.2s
    'generate-course': 3000 + Math.random() * 1000 // 3.0-4.0s
  };
  
  const delay = delays[operation as keyof typeof delays] || baseDelay;
  await new Promise(resolve => setTimeout(resolve, delay));
}

async function stubMatchJobs(skills: string[]) {
  await simulateProcessing('match-jobs');
  
  const jobs = [
    // Basic Web Development Jobs
    {
      id: 1,
      title: 'Junior Web Developer',
      salaryRange: { min: 200000, max: 350000, currency: 'RWF' },
      required_skills: ['html', 'css', 'javascript'],
      company: 'TechStart Rwanda',
      location: 'Kigali, Rwanda',
      industry: 'Technology',
      jobType: 'full-time',
      experienceLevel: 'entry',
      postedDate: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Frontend Developer (React)',
      salaryRange: { min: 450000, max: 700000, currency: 'RWF' },
      required_skills: ['html', 'css', 'javascript', 'react'],
      company: 'Rwanda ICT Chamber',
      location: 'Kigali, Rwanda',
      industry: 'Technology',
      jobType: 'full-time',
      experienceLevel: 'mid',
      postedDate: new Date().toISOString(),
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      salaryRange: { min: 600000, max: 1000000, currency: 'RWF' },
      required_skills: ['html', 'css', 'javascript', 'react', 'python'],
      company: 'Liquid Telecom Rwanda',
      location: 'Kigali, Rwanda',
      industry: 'Telecommunications',
      jobType: 'full-time',
      experienceLevel: 'senior',
      postedDate: new Date().toISOString(),
    },
    // Data Analysis Jobs
    {
      id: 4,
      title: 'Data Analyst',
      salaryRange: { min: 400000, max: 650000, currency: 'RWF' },
      required_skills: ['python', 'sql', 'excel'],
      company: 'Rwanda Development Board',
      location: 'Kigali, Rwanda',
      industry: 'Government',
      jobType: 'full-time',
      experienceLevel: 'mid',
      postedDate: new Date().toISOString(),
    },
    {
      id: 5,
      title: 'Business Intelligence Analyst',
      salaryRange: { min: 500000, max: 800000, currency: 'RWF' },
      required_skills: ['sql', 'powerbi', 'python'],
      company: 'Bank of Kigali',
      location: 'Kigali, Rwanda',
      industry: 'Banking',
      jobType: 'full-time',
      experienceLevel: 'mid',
      postedDate: new Date().toISOString(),
    },
    // Digital Marketing Jobs
    {
      id: 6,
      title: 'Digital Marketing Specialist',
      salaryRange: { min: 300000, max: 500000, currency: 'RWF' },
      required_skills: ['seo', 'social media marketing'],
      company: 'Rwanda Tours & Travel',
      location: 'Kigali, Rwanda',
      industry: 'Tourism',
      jobType: 'full-time',
      experienceLevel: 'entry',
      postedDate: new Date().toISOString(),
    },
    {
      id: 7,
      title: 'Growth Marketing Manager',
      salaryRange: { min: 600000, max: 900000, currency: 'RWF' },
      required_skills: ['seo', 'social media marketing', 'google analytics'],
      company: 'Zipline Rwanda',
      location: 'Kigali, Rwanda',
      industry: 'Healthcare Tech',
      jobType: 'full-time',
      experienceLevel: 'senior',
      postedDate: new Date().toISOString(),
    },
    // Backend Development
    {
      id: 8,
      title: 'Backend Developer',
      salaryRange: { min: 500000, max: 750000, currency: 'RWF' },
      required_skills: ['python', 'fastapi', 'sql'],
      company: 'I&M Bank Rwanda',
      location: 'Kigali, Rwanda',
      industry: 'Banking',
      jobType: 'full-time',
      experienceLevel: 'mid',
      postedDate: new Date().toISOString(),
    },
    // Mixed Skills
    {
      id: 9,
      title: 'Technical Product Manager',
      salaryRange: { min: 800000, max: 1200000, currency: 'RWF' },
      required_skills: ['python', 'sql', 'product management'],
      company: 'MTN Rwanda',
      location: 'Kigali, Rwanda',
      industry: 'Telecommunications',
      jobType: 'full-time',
      experienceLevel: 'senior',
      postedDate: new Date().toISOString(),
    },
    {
      id: 10,
      title: 'UI/UX Developer',
      salaryRange: { min: 400000, max: 650000, currency: 'RWF' },
      required_skills: ['html', 'css', 'javascript', 'figma'],
      company: 'Norrsken House Kigali',
      location: 'Kigali, Rwanda',
      industry: 'Startup Incubator',
      jobType: 'full-time',
      experienceLevel: 'mid',
      postedDate: new Date().toISOString(),
    }
  ];

  const hasSkills = (req: string[]) => req.every(s => skills.includes(s));
  const qualified_jobs = jobs.filter(j => hasSkills(j.required_skills));
  
  // For demo: ensure we always have at least some jobs
  if (DEMO_MODE && qualified_jobs.length === 0) {
    return Promise.resolve({ qualified_jobs: jobs.slice(0, 3) }); // Return first 3 jobs as fallback
  }
  
  return Promise.resolve({ qualified_jobs });
}

async function stubGapAnalysis(skills: string[]) {
  await simulateProcessing('gap-analysis');
  const allRecommendations = [
    {
      skill: 'react',
      explanation: 'React is the most in-demand frontend framework in Rwanda, with 70% of tech companies using it. Master React to unlock 450-700k RWF frontend roles.',
      potential_salary_increase_rwf: 350000
    },
    {
      skill: 'python',
      explanation: 'Python dominates Rwanda\'s data science and fintech sectors. High demand at Bank of Kigali, MTN, and government institutions.',
      potential_salary_increase_rwf: 400000
    },
    {
      skill: 'sql',
      explanation: 'SQL skills are critical for data roles in Rwanda\'s growing banking and telecom sectors. Essential for BI analyst positions.',
      potential_salary_increase_rwf: 250000
    },
    {
      skill: 'powerbi',
      explanation: 'Power BI expertise is highly valued in Rwanda\'s business intelligence market, especially in banking and government sectors.',
      potential_salary_increase_rwf: 300000
    },
    {
      skill: 'git',
      explanation: 'Version control with Git is mandatory for all development roles in Rwanda. Required by 95% of tech companies.',
      potential_salary_increase_rwf: 100000
    },
    {
      skill: 'node.js',
      explanation: 'Node.js skills open backend development opportunities with fintech companies and startups in Kigali.',
      potential_salary_increase_rwf: 320000
    },
    {
      skill: 'figma',
      explanation: 'UI/UX design with Figma is increasingly important as Rwanda focuses on digital transformation and user experience.',
      potential_salary_increase_rwf: 280000
    },
    {
      skill: 'google analytics',
      explanation: 'Digital marketing analytics skills are crucial for Rwanda\'s growing e-commerce and tourism sectors.',
      potential_salary_increase_rwf: 200000
    }
  ];

  // Filter out skills the user already has
  const recommendations = allRecommendations
    .filter(rec => !skills.includes(rec.skill))
    .slice(0, 2); // Top 2 recommendations

  // For demo: ensure we always have recommendations
  if (DEMO_MODE && recommendations.length === 0) {
    return Promise.resolve({ 
      analysis: { 
        recommendations: [
          {
            skill: 'react',
            explanation: 'React is the most in-demand frontend framework in Rwanda, with 70% of tech companies using it.',
            potential_salary_increase_rwf: 350000
          },
          {
            skill: 'python',
            explanation: 'Python dominates Rwanda\'s data science and fintech sectors with excellent career prospects.',
            potential_salary_increase_rwf: 400000
          }
        ]
      } 
    });
  }
  
  return Promise.resolve({ analysis: { recommendations } });
}

async function stubSalaryImpact(skills: string[], new_skill: string) {
  await simulateProcessing('salary-impact');
  const skill = (new_skill || '').toLowerCase();
  
  // Define salary impact for different skills based on existing skills
  let impact = 0;
  
  switch (skill) {
    case 'react':
      impact = skills.includes('javascript') ? 350000 : 250000;
      break;
    case 'python':
      impact = skills.includes('sql') ? 400000 : 300000;
      break;
    case 'sql':
      impact = 250000;
      break;
    case 'powerbi':
      impact = skills.includes('sql') ? 300000 : 200000;
      break;
    case 'node.js':
      impact = skills.includes('javascript') ? 320000 : 220000;
      break;
    case 'git':
      impact = 100000;
      break;
    case 'figma':
      impact = skills.includes('html') || skills.includes('css') ? 280000 : 200000;
      break;
    case 'google analytics':
      impact = 200000;
      break;
    case 'typescript':
      impact = skills.includes('javascript') ? 250000 : 150000;
      break;
    default:
      impact = 150000; // Default impact for other skills
  }
  
  // For demo: ensure we always show some impact
  if (DEMO_MODE && impact === 0) {
    impact = 250000;
  }
  
  return Promise.resolve({ potential_salary_increase_rwf: impact });
}

async function stubCurriculum(skills_to_learn: string[]) {
  await simulateProcessing('curriculum');
  const skillsResources: { [key: string]: { resource: string; project: string } } = {
    'react': {
      resource: 'https://klab.rw/programs/web-development',
      project: 'Build a Rwanda tourism booking app with React, featuring local attractions, hotels, and activities with real-time availability'
    },
    'python': {
      resource: 'https://solvit.africa/python-bootcamp',
      project: 'Create a Rwanda agricultural data analysis tool that tracks crop yields, weather patterns, and market prices for farmers'
    },
    'sql': {
      resource: 'https://www.w3schools.com/sql/',
      project: 'Design and query a database for Rwanda\'s healthcare system, tracking patient records, hospitals, and medical resources'
    },
    'powerbi': {
      resource: 'https://docs.microsoft.com/power-bi/',
      project: 'Build a comprehensive Rwanda economic dashboard showing GDP, trade, employment data with interactive visualizations'
    },
    'html': {
      resource: 'https://www.freecodecamp.org/learn/responsive-web-design/',
      project: 'Create a responsive website for a Rwandan SME showcasing products, services, and contact information'
    },
    'css': {
      resource: 'https://www.freecodecamp.org/learn/responsive-web-design/',
      project: 'Design a modern, mobile-first website for Rwanda\'s cultural heritage sites with beautiful animations'
    },
    'javascript': {
      resource: 'https://javascript.info/',
      project: 'Build an interactive Rwanda weather app with location-based forecasts and agricultural recommendations'
    },
    'git': {
      resource: 'https://learngitbranching.js.org/',
      project: 'Set up version control for a collaborative Rwanda tech project with proper branching and workflow'
    },
    'node.js': {
      resource: 'https://nodejs.org/en/learn/',
      project: 'Develop a REST API for Rwanda\'s public transport system with route planning and real-time updates'
    },
    'figma': {
      resource: 'https://www.figma.com/academy/',
      project: 'Design a complete mobile app interface for Rwanda\'s digital payment system with user-centered design principles'
    },
    'google analytics': {
      resource: 'https://analytics.google.com/analytics/academy/',
      project: 'Analyze website traffic for a Rwandan e-commerce platform and create actionable marketing insights'
    },
    'seo': {
      resource: 'https://moz.com/beginners-guide-to-seo',
      project: 'Optimize a local Rwandan business website for search engines, focusing on local SEO and mobile performance'
    },
    'social media marketing': {
      resource: 'https://www.hootsuite.com/education',
      project: 'Create and execute a social media campaign for Rwanda\'s tourism sector, showcasing unique experiences'
    }
  };

  const learning_path = skills_to_learn.map(skill => {
    const s = skill.toLowerCase();
    const skillData = skillsResources[s];
    
    return {
      skill,
      resource: skillData?.resource || 'https://www.freecodecamp.org/',
      project: skillData?.project || `Build a practical project demonstrating ${skill} skills in Rwanda's context`
    };
  });
  
  // For demo: ensure we always have a meaningful learning path
  if (DEMO_MODE && learning_path.length === 0) {
    return Promise.resolve({ 
      curriculum: { 
        learning_path: [
          {
            skill: 'React',
            resource: 'https://klab.rw/programs/web-development',
            project: 'Build a Rwanda tourism booking app with React, featuring local attractions and real-time availability'
          },
          {
            skill: 'Python',
            resource: 'https://solvit.africa/python-bootcamp',
            project: 'Create a Rwanda agricultural data analysis tool for tracking crop yields and market prices'
          }
        ]
      } 
    });
  }
  
  return Promise.resolve({ curriculum: { learning_path } });
}

async function stubMarketInsights(skills: string[]) {
  await simulateProcessing('market-insights');
  const allInsights = [
    'Rwanda\'s ICT sector is projected to grow 15% annually, with frontend development leading job creation across fintech and government digitization projects.',
    'The government\'s Vision 2050 digital transformation initiative is creating 2,000+ new tech jobs annually, with React and Python skills in highest demand.',
    'Kigali is emerging as East Africa\'s tech hub - companies like Zipline, Mara Phones, and local startups are actively hiring skilled developers.',
    'Remote work opportunities from international companies have increased 300% post-COVID, with Rwandan developers earning 40-60% more than local salaries.',
    'The banking sector (Bank of Kigali, I&M Bank) is heavily investing in digital platforms, creating demand for full-stack developers and data analysts.',
    'Rwanda\'s fintech boom (mobile money, digital lending) requires Python and SQL skills, with salaries ranging 600k-1.2M RWF for experienced professionals.',
    'Government digitization projects offer stable career paths with competitive benefits, particularly for developers with experience in scalable web applications.',
    'The tourism sector\'s digital recovery is driving demand for e-commerce developers, digital marketers, and UX designers with local market knowledge.',
    'Data science roles are expanding in agriculture, healthcare, and urban planning as Rwanda leverages data for evidence-based policy making.',
    'Startup ecosystem support through Norrsken House and other incubators is creating opportunities for entrepreneurial developers with MVP building skills.'
  ];

  // Select contextual insights based on skills
  let selectedInsights: string[] = [];
  
  if (skills.includes('react') || skills.includes('javascript') || skills.includes('html')) {
    selectedInsights.push(allInsights[0]!); // ICT growth frontend
    selectedInsights.push(allInsights[2]!); // Kigali tech hub
  }
  
  if (skills.includes('python') || skills.includes('sql')) {
    selectedInsights.push(allInsights[5]!); // Fintech boom
    selectedInsights.push(allInsights[8]!); // Data science expansion
  }
  
  if (skills.includes('seo') || skills.includes('social media marketing')) {
    selectedInsights.push(allInsights[7]!); // Tourism digital recovery
  }
  
  // Fill remaining slots with general insights
  while (selectedInsights.length < 4) {
    const remainingInsights = allInsights.filter(insight => !selectedInsights.includes(insight));
    if (remainingInsights.length > 0) {
      const randomInsight = remainingInsights[Math.floor(Math.random() * remainingInsights.length)];
      if (randomInsight) {
        selectedInsights.push(randomInsight);
      }
    } else {
      break;
    }
  }
  
  // Ensure we have at least 3-4 insights
  if (selectedInsights.length < 3) {
    selectedInsights = allInsights.slice(0, 4);
  }
  
  return Promise.resolve({ insights: { insights: selectedInsights } });
}

async function stubCoachChat(body: any) {
  await simulateProcessing('coach-chat');
  const answer = body?.question?.toLowerCase().includes('next')
    ? 'Based on your analysis, learn React next to unlock 400–600k RWF roles. Start with components, hooks, and a mini CRUD app.'
    : 'Focus on one high‑ROI skill, schedule 45 minutes daily, and ship one small project per week.';
  return Promise.resolve({ chat: { answer, follow_ups: ['Which skill unlocks the most jobs?', 'Give me a 2‑week plan.', 'How do I build a portfolio project?'] } });
}

async function stubGenerateCourse(body: any) {
  await simulateProcessing('generate-course');
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
  async matchJobs(skills: string[]) {
    return useBackend() ? await postJson('/skillsync/match-jobs', { skills }) : await stubMatchJobs(skills);
  },
  async gapAnalysis(skills: string[]) {
    return useBackend() ? await postJson('/skillsync/opportunity-gap-analysis', { skills }) : await stubGapAnalysis(skills);
  },
  async salaryImpact(skills: string[], new_skill: string) {
    return useBackend() ? await postJson('/skillsync/salary-impact-calculator', { skills, new_skill }) : await stubSalaryImpact(skills, new_skill);
  },
  async generateCurriculum(skills_to_learn: string[]) {
    return useBackend() ? await postJson('/skillsync/generate-curriculum', { skills_to_learn }) : await stubCurriculum(skills_to_learn);
  },
  async marketInsights(skills: string[]) {
    return useBackend() ? await postJson('/skillsync/market-insights', { skills }) : await stubMarketInsights(skills);
  },
  async coachChat(role: string, analysis: any, question: string) {
    return useBackend() ? await postJson('/skillsync/coach-chat', { role, analysis, question }) : await stubCoachChat({ role, analysis, question });
  },
  async generateCourse(target_skill: string, level?: string) {
    return useBackend() ? await postJson('/skillsync/generate-course', { target_skill, level }) : await stubGenerateCourse({ target_skill, level });
  },
  useBackend,
  resetFallbackFlag,
  wasFallbackUsed,
  // 🎯 Demo utilities
  isDemoMode: () => DEMO_MODE,
};


