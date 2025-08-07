// Google Gemini AI integration for SkillSync AI

import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserProfile, JobOpportunity, LearningRecommendation, SkillGap } from '@/types';

if (!process.env.GOOGLE_GEMINI_API_KEY) {
  throw new Error('GOOGLE_GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export class GeminiCareerAnalyst {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async analyzeCareerOpportunities(
    userProfile: UserProfile, 
    availableJobs: JobOpportunity[]
  ): Promise<LearningRecommendation> {
    const prompt = this.buildCareerAnalysisPrompt(userProfile, availableJobs);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const analysisText = response.text();
      
      return this.parseCareerAnalysis(analysisText, userProfile, availableJobs);
    } catch (error) {
      console.error('Error analyzing career opportunities:', error);
      throw new Error('Failed to generate career analysis');
    }
  }

  private buildCareerAnalysisPrompt(userProfile: UserProfile, jobs: JobOpportunity[]): string {
    return `
You are a career intelligence analyst specializing in Rwanda's digital economy. 
Analyze the following user profile against current job market opportunities and provide structured career guidance.

USER PROFILE:
Skills: ${userProfile.skills.map(s => `${s.name} (${s.level})`).join(', ')}
Experience: ${userProfile.experience}
Location: ${userProfile.location}
Preferred Industries: ${userProfile.preferredIndustries.join(', ')}

AVAILABLE JOBS IN RWANDA:
${jobs.map(job => `
- ${job.title} at ${job.company}
  Salary: ${job.salaryRange.min}-${job.salaryRange.max} RWF
  Required: ${job.requiredSkills.join(', ')}
  Preferred: ${job.preferredSkills?.join(', ') || 'None'}
  Level: ${job.experienceLevel}
`).join('\n')}

ANALYSIS REQUIRED:
1. Current Job Matches: Which jobs can the user qualify for RIGHT NOW with their existing skills?
2. Skill Gaps: What specific skills are missing for better opportunities?
3. Impact Analysis: For each missing skill, estimate:
   - Time to learn (realistic timeframe)
   - Salary increase potential in RWF
   - Number of additional job opportunities it unlocks
4. Priority Ranking: Which 2-3 skills should be learned first for maximum career impact?
5. Rwanda Context: Consider local market conditions, remote work availability, and industry growth.

RESPONSE FORMAT (JSON-like structure):
CURRENT_MATCHES: [List jobs user qualifies for now]
SKILL_GAPS: [
  {
    skill: "specific skill name",
    importance: "critical/high/medium/low", 
    timeToLearn: "X weeks/months",
    salaryImpact: "estimated RWF increase",
    opportunities: "number of additional jobs",
    reasoning: "why this skill matters for Rwanda market"
  }
]
PRIORITY_LEARNING: [Top 2-3 skills to focus on first]
SALARY_PROJECTION: Current potential vs 6-month potential with recommended skills
MARKET_INSIGHTS: [Rwanda-specific observations about this career path]

Focus on actionable, specific guidance that connects directly to job outcomes in Rwanda's market.
`;
  }

  private parseCareerAnalysis(
    analysisText: string, 
    userProfile: UserProfile, 
    availableJobs: JobOpportunity[]
  ): LearningRecommendation {
    // Parse the AI response and structure it
    // This is a simplified parser - in production, you'd want more robust parsing
    
    const currentOpportunities = availableJobs.filter(job => 
      this.calculateJobMatch(userProfile, job) > 0.7
    );

    const skillGaps: SkillGap[] = this.extractSkillGaps(analysisText);
    
    const nextLevelOpportunities = availableJobs.filter(job =>
      this.calculateJobMatch(userProfile, job) < 0.7 && 
      this.calculateJobMatch(userProfile, job) > 0.4
    );

    return {
      currentOpportunities,
      skillGaps,
      nextLevelOpportunities,
      learningPath: {
        id: `path-${Date.now()}`,
        title: `Career Advancement Path`,
        description: `Personalized learning path based on Rwanda job market analysis`,
        targetSkill: skillGaps[0]?.skill || 'General Skills',
        totalDuration: '3-6 months',
        phases: [],
        projects: [],
        milestones: []
      },
      salaryProjection: {
        current: currentOpportunities.reduce((avg, job) => 
          avg + (job.salaryRange.min + job.salaryRange.max) / 2, 0) / currentOpportunities.length || 0,
        potential: nextLevelOpportunities.reduce((avg, job) => 
          avg + (job.salaryRange.min + job.salaryRange.max) / 2, 0) / nextLevelOpportunities.length || 0,
        timeframe: '6 months'
      }
    };
  }

  private extractSkillGaps(analysisText: string): SkillGap[] {
    // Extract skill gaps from AI analysis
    // This is simplified - you'd implement proper parsing logic
    return [
      {
        skill: "React",
        importance: "high",
        timeToLearn: "4-6 weeks",
        salaryImpact: 150000,
        opportunities: 12,
        learningResources: []
      }
    ];
  }

  private calculateJobMatch(userProfile: UserProfile, job: JobOpportunity): number {
    const userSkillNames = userProfile.skills.map(s => s.name.toLowerCase());
    const requiredSkillsMatch = job.requiredSkills.filter(skill => 
      userSkillNames.some(userSkill => userSkill.includes(skill.toLowerCase()))
    ).length / job.requiredSkills.length;

    return requiredSkillsMatch;
  }

  async generateLearningPath(targetSkill: string, userLevel: string): Promise<any> {
    const prompt = `
You are an expert curriculum designer creating job-market-driven learning paths for Rwanda.
Create a practical, project-based learning path for: ${targetSkill}
Current user level: ${userLevel}

Design a learning path that:
1. Uses accessible, free/low-cost resources relevant to Rwanda
2. Includes hands-on projects that build a portfolio
3. Connects directly to job opportunities in Rwanda
4. Provides realistic timelines and milestones
5. Focuses on skills that local employers actually need

Structure the response with:
- Phase breakdown (Foundation, Intermediate, Advanced)
- Specific resources for each phase
- Project ideas that demonstrate competency
- Milestones to track progress
- Expected time investment per week

Make it practical and achievable for someone learning while working.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating learning path:', error);
      throw new Error('Failed to generate learning path');
    }
  }
}
