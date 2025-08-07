// Rwanda-specific skills taxonomy and job market data

import { SkillCategory, JobOpportunity, LearningResource } from '@/types';

export const RWANDA_SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'web-development',
    name: 'Web Development',
    description: 'Frontend and backend web technologies',
    skills: [
      'HTML/CSS',
      'JavaScript',
      'React',
      'Node.js',
      'PHP',
      'WordPress',
      'Bootstrap',
      'Tailwind CSS',
      'TypeScript',
      'Next.js',
      'Laravel',
      'MySQL',
      'MongoDB'
    ],
    avgSalaryImpact: 350000, // RWF
    demandLevel: 'very-high'
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis & Analytics',
    description: 'Data processing, analysis, and business intelligence',
    skills: [
      'Excel Advanced',
      'SQL',
      'Python',
      'R',
      'Power BI',
      'Tableau',
      'Google Analytics',
      'Data Visualization',
      'Statistics',
      'Machine Learning Basics',
      'ETL Processes',
      'Business Intelligence'
    ],
    avgSalaryImpact: 400000,
    demandLevel: 'very-high'
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    description: 'Online marketing and social media management',
    skills: [
      'Social Media Marketing',
      'Google Ads',
      'Facebook Ads',
      'SEO',
      'Content Marketing',
      'Email Marketing',
      'Influencer Marketing',
      'Marketing Analytics',
      'Brand Management',
      'Copywriting',
      'Graphic Design',
      'Video Marketing'
    ],
    avgSalaryImpact: 280000,
    demandLevel: 'high'
  },
  {
    id: 'fintech',
    name: 'FinTech & Mobile Money',
    description: 'Financial technology and mobile payment systems',
    skills: [
      'Mobile Money Integration',
      'Payment Gateway APIs',
      'Financial APIs',
      'Blockchain Basics',
      'Cryptocurrency',
      'Regulatory Compliance',
      'Risk Management',
      'Financial Modeling',
      'API Development',
      'Security Protocols',
      'Mobile App Development'
    ],
    avgSalaryImpact: 500000,
    demandLevel: 'very-high'
  },
  {
    id: 'mobile-development',
    name: 'Mobile App Development',
    description: 'iOS and Android application development',
    skills: [
      'React Native',
      'Flutter',
      'Swift',
      'Kotlin',
      'Java',
      'Mobile UI/UX',
      'App Store Optimization',
      'Firebase',
      'Mobile Security',
      'Cross-platform Development'
    ],
    avgSalaryImpact: 450000,
    demandLevel: 'high'
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    description: 'Information security and data protection',
    skills: [
      'Network Security',
      'Ethical Hacking',
      'Security Auditing',
      'Incident Response',
      'Risk Assessment',
      'Compliance (ISO 27001)',
      'Penetration Testing',
      'Security Awareness Training',
      'Cloud Security'
    ],
    avgSalaryImpact: 600000,
    demandLevel: 'high'
  },
  {
    id: 'project-management',
    name: 'Project Management',
    description: 'Digital project coordination and agile methodologies',
    skills: [
      'Agile/Scrum',
      'Project Planning',
      'Risk Management',
      'Stakeholder Management',
      'Budget Management',
      'JIRA',
      'Trello',
      'Microsoft Project',
      'Team Leadership',
      'Communication'
    ],
    avgSalaryImpact: 320000,
    demandLevel: 'high'
  }
];

// Sample Rwanda job opportunities with realistic data
export const RWANDA_JOB_OPPORTUNITIES: JobOpportunity[] = [
  {
    id: 'web-dev-junior-1',
    title: 'Junior Web Developer',
    company: 'kLab',
    location: 'Kigali',
    industry: 'Technology',
    salaryRange: { min: 200000, max: 350000, currency: 'RWF' },
    requiredSkills: ['HTML/CSS', 'JavaScript', 'PHP', 'MySQL'],
    preferredSkills: ['React', 'Node.js'],
    experienceLevel: 'entry',
    description: 'Build and maintain web applications for local businesses',
    jobType: 'full-time',
    isRemote: false,
    postedDate: new Date('2024-01-15')
  },
  {
    id: 'data-analyst-1',
    title: 'Data Analyst',
    company: 'Bank of Kigali',
    location: 'Kigali',
    industry: 'Banking',
    salaryRange: { min: 400000, max: 600000, currency: 'RWF' },
    requiredSkills: ['Excel Advanced', 'SQL', 'Power BI'],
    preferredSkills: ['Python', 'Statistics'],
    experienceLevel: 'mid',
    description: 'Analyze customer data and create business intelligence reports',
    jobType: 'full-time',
    isRemote: false,
    postedDate: new Date('2024-01-10')
  },
  {
    id: 'digital-marketer-1',
    title: 'Digital Marketing Specialist',
    company: 'Rwanda Tourism Board',
    location: 'Kigali',
    industry: 'Tourism',
    salaryRange: { min: 300000, max: 450000, currency: 'RWF' },
    requiredSkills: ['Social Media Marketing', 'Google Ads', 'Content Marketing'],
    preferredSkills: ['SEO', 'Analytics'],
    experienceLevel: 'mid',
    description: 'Promote Rwanda tourism through digital channels',
    jobType: 'full-time',
    isRemote: true,
    postedDate: new Date('2024-01-12')
  },
  {
    id: 'fintech-dev-1',
    title: 'FinTech Developer',
    company: 'Equity Bank Rwanda',
    location: 'Kigali',
    industry: 'FinTech',
    salaryRange: { min: 500000, max: 800000, currency: 'RWF' },
    requiredSkills: ['JavaScript', 'Node.js', 'Mobile Money Integration', 'API Development'],
    preferredSkills: ['React', 'Security Protocols'],
    experienceLevel: 'mid',
    description: 'Develop mobile banking and payment solutions',
    jobType: 'full-time',
    isRemote: false,
    postedDate: new Date('2024-01-08')
  },
  {
    id: 'mobile-dev-1',
    title: 'Mobile App Developer',
    company: 'SOLVIT Africa',
    location: 'Kigali',
    industry: 'Technology',
    salaryRange: { min: 450000, max: 650000, currency: 'RWF' },
    requiredSkills: ['React Native', 'JavaScript', 'Firebase'],
    preferredSkills: ['Flutter', 'Mobile UI/UX'],
    experienceLevel: 'mid',
    description: 'Build mobile applications for African markets',
    jobType: 'full-time',
    isRemote: true,
    postedDate: new Date('2024-01-14')
  }
];

// Learning resources specific to Rwanda context
export const RWANDA_LEARNING_RESOURCES: LearningResource[] = [
  {
    id: 'klab-bootcamp',
    title: 'kLab Web Development Bootcamp',
    type: 'course',
    provider: 'kLab',
    url: 'https://klab.rw',
    duration: '12 weeks',
    difficulty: 'beginner',
    cost: 'free',
    rating: 4.5,
    description: 'Comprehensive web development training in Kigali'
  },
  {
    id: 'freecodecamp-js',
    title: 'JavaScript Algorithms and Data Structures',
    type: 'course',
    provider: 'freeCodeCamp',
    url: 'https://freecodecamp.org',
    duration: '300 hours',
    difficulty: 'intermediate',
    cost: 'free',
    rating: 4.8,
    description: 'Complete JavaScript programming course'
  },
  {
    id: 'coursera-data-analysis',
    title: 'Google Data Analytics Certificate',
    type: 'certification',
    provider: 'Coursera',
    url: 'https://coursera.org',
    duration: '6 months',
    difficulty: 'beginner',
    cost: 'paid',
    rating: 4.6,
    description: 'Professional data analytics certification'
  },
  {
    id: 'youtube-react',
    title: 'React Complete Course 2024',
    type: 'video',
    provider: 'YouTube',
    url: 'https://youtube.com',
    duration: '20 hours',
    difficulty: 'intermediate',
    cost: 'free',
    rating: 4.4,
    description: 'Full React.js tutorial series'
  }
];

export const RWANDA_MARKET_INSIGHTS = [
  "70% of digital jobs in Rwanda require web development skills",
  "FinTech sector growing 45% annually with high salary premiums",
  "Remote work availability increased 200% post-2020",
  "Data analysis skills command highest salary premiums in banking sector",
  "Mobile-first development crucial for Rwanda market penetration"
];
