# SkillSync AI - Rwanda Skills-to-Jobs Matcher

A Next.js application that connects users' current skills to real job opportunities in Rwanda and provides AI-powered learning paths for career advancement.

## 🎯 Overview

SkillSync AI is Rwanda's first career intelligence tool that:
- ✅ **Real Job Matching**: Shows exact jobs you qualify for with current skills
- ✅ **Smart Gap Analysis**: AI identifies high-impact skills to learn next  
- ✅ **Learning Paths**: Personalized curricula with Rwanda-relevant resources
- ✅ **Local Market Data**: Real salary ranges and opportunities from Rwanda job market

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager
- Google Gemini API key (optional for full AI features)

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd skillsync-ai
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Google Gemini API key to `.env.local`:
   ```
   GOOGLE_GEMINI_API_KEY=your_actual_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
skillsync-ai/
├── src/
│   ├── app/                 # Next.js 14 App Router
│   │   ├── layout.tsx       # Root layout with header/footer
│   │   ├── page.tsx         # Main application page
│   │   └── globals.css      # Global styles with Tailwind
│   ├── components/          # React components
│   │   ├── ui/              # Base UI components (buttons, cards, etc.)
│   │   ├── SkillsSelector.tsx   # Skills selection interface
│   │   ├── JobMatches.tsx       # Job opportunities display
│   │   ├── LoadingSpinner.tsx   # Loading states
│   │   └── ErrorBoundary.tsx    # Error handling
│   ├── lib/                 # Utilities and services
│   │   ├── gemini.ts        # Google Gemini AI integration
│   │   ├── localStorage.ts  # Client-side data persistence
│   │   └── utils.ts         # Helper functions
│   ├── data/               # Static data and configurations
│   │   └── rwanda-skills.ts # Rwanda job market data
│   └── types/              # TypeScript type definitions
│       └── index.ts        # All interface definitions
└── docs/                   # Project documentation
```

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with custom components
- **AI**: Google Gemini API for career analysis
- **Storage**: localStorage for client-side persistence
- **Icons**: Lucide React
- **State**: React hooks with custom storage manager

## 🎨 Key Features

### 1. Skills Assessment
- Interactive skills selector with Rwanda-relevant categories
- Web Development, Data Analysis, FinTech, Digital Marketing, etc.
- Skill level selection (Beginner → Expert)
- Real-time job market demand indicators

### 2. Job Matching Engine
- Calculates match scores based on required/preferred skills
- Shows realistic salary ranges in RWF
- Filters by location, industry, and remote availability
- Identifies missing skills for each opportunity

### 3. AI Career Analysis
- Powered by Google Gemini for structured career insights
- Skill gap analysis with learning time estimates
- Salary impact projections for each skill
- Priority ranking for maximum career impact

### 4. Mobile-First Design
- Responsive layout optimized for smartphones
- Touch-friendly interface elements
- Fast loading with optimized components
- Offline capability with localStorage

## 📊 Rwanda Market Data

The application includes comprehensive Rwanda job market data:

- **Skills Categories**: 7 major categories with 80+ specific skills
- **Job Opportunities**: Real positions from kLab, SOLVIT Africa, banks, startups
- **Salary Ranges**: Accurate compensation data in RWF
- **Learning Resources**: Local and online resources relevant to Rwanda

## 🔧 Development Commands

```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Production build
npm run build

# Start production server
npm start
```

## 🌍 Environment Variables

Create a `.env.local` file:

```env
# Required for AI features
GOOGLE_GEMINI_API_KEY=your_gemini_api_key

# Application configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

**Note**: The application works without the API key using mock data for development.

## 🚦 Usage Flow

1. **Welcome Screen**: Introduction and value proposition
2. **Skills Selection**: Choose current skills from Rwanda-relevant categories
3. **Job Analysis**: AI analyzes skills against real job opportunities
4. **Results Dashboard**: See matching jobs, salary projections, and learning recommendations

## 📱 Mobile Optimization

- Mobile-first CSS with Tailwind responsive utilities
- Touch-optimized button sizes and spacing
- Optimized for common Rwanda smartphone screen sizes
- Fast loading with code splitting and optimization

## 🔒 Data Privacy

- All user data stored locally in browser localStorage
- No personal information sent to external services
- Only anonymized skill data used for AI analysis
- Full data export/import functionality

## 🤝 Contributing

This project follows Rwanda's digital development goals. Contributions should focus on:
- Accurate local job market data
- Rwanda-specific learning resources
- Mobile-first user experience
- Accessibility for diverse users

## 📄 License

MIT License - Built for Rwanda's digital future.

## 🙏 Acknowledgments

- kLab Rwanda for technical ecosystem insights
- SOLVIT Africa for job market data
- Rwanda job seekers for user research
- Google Gemini AI for career analysis capabilities

---

**Built with ❤️ for Rwanda's digital transformation**