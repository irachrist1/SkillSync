# Environment Setup Guide for SkillSync AI

## 🔑 Environment Variables Configuration

### Required Files

Create these environment files in the root directory:

#### 1. `.env.local` (Main environment file)
```env
# Google Gemini AI API Key (Required for full AI features)
GOOGLE_GEMINI_API_KEY=your_actual_gemini_api_key_here

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

#### 2. `.env.example` (Template file - already created)
```env
# Google Gemini AI API Configuration
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here

# Application Configuration  
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Optional: Analytics and Monitoring
NEXT_PUBLIC_ANALYTICS_ID=
```

## 🔧 Getting Your Google Gemini API Key

### Step 1: Get Gemini API Access
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" in the top right
4. Create a new API key or use an existing one
5. Copy the API key

### Step 2: Add to Environment
1. Create `.env.local` in the project root
2. Add your API key:
   ```env
   GOOGLE_GEMINI_API_KEY=AIza...your_actual_key_here
   ```

### Step 3: Verify Setup
The application will automatically detect if the API key is available:
- ✅ **With API Key**: Full AI analysis and career recommendations
- ⚠️ **Without API Key**: Mock data for development and testing

## 🚀 Development Without API Key

The application is designed to work without an API key for development:

```typescript
// The app gracefully handles missing API keys
if (!process.env.GOOGLE_GEMINI_API_KEY) {
  console.warn('Using mock AI analysis - add GOOGLE_GEMINI_API_KEY for full features');
  // Falls back to realistic mock data
}
```

## 📁 File Structure for Environment

```
skillsync-ai/
├── .env.local          # Your actual environment variables (gitignored)
├── .env.example        # Template file (committed to repo)
├── .gitignore          # Ensures .env.local is not committed
└── src/
    └── lib/
        └── gemini.ts   # Handles API key validation
```

## ⚠️ Security Best Practices

### What's Safe to Commit:
- ✅ `.env.example` - Template with placeholder values
- ✅ Environment variable names and descriptions
- ✅ Default development URLs

### Never Commit:
- ❌ `.env.local` - Contains actual API keys
- ❌ `.env` - May contain sensitive data  
- ❌ Any file with actual API keys or secrets

### Production Deployment:
For production deployment (Vercel, Netlify, etc.):
1. Add environment variables in your hosting platform's dashboard
2. Use the same variable names as in `.env.example`
3. Set `NODE_ENV=production`
4. Update `NEXT_PUBLIC_APP_URL` to your actual domain

## 🔍 Environment Validation

The application includes built-in environment validation:

```typescript
// Automatic environment checking
if (!process.env.GOOGLE_GEMINI_API_KEY) {
  console.warn('GOOGLE_GEMINI_API_KEY not found - using mock data');
}

// Runtime environment display
console.log('Environment:', process.env.NODE_ENV);
console.log('API Available:', !!process.env.GOOGLE_GEMINI_API_KEY);
```

## 🛠️ Troubleshooting

### Common Issues:

**1. "API Key not working"**
```bash
# Check if file exists
ls -la .env.local

# Verify file contents (without exposing key)
cat .env.local | head -1
```

**2. "Environment variables not loading"**
- Ensure `.env.local` is in root directory (same level as `package.json`)
- Restart development server after adding variables
- Check for typos in variable names

**3. "Mock data showing instead of AI analysis"**
- Verify API key is correctly set in `.env.local`
- Check Google AI Studio for API key status
- Ensure no extra spaces or quotes around the API key

### Verification Commands:

```bash
# Verify Next.js can read environment variables
npm run dev

# Check for environment file
echo $GOOGLE_GEMINI_API_KEY  # Should show your key in terminal

# Test API connection (optional)
curl -H "Authorization: Bearer $GOOGLE_GEMINI_API_KEY" \
     "https://generativelanguage.googleapis.com/v1/models"
```

## 📋 Environment Checklist

Before running the application:

- [ ] Created `.env.local` file in root directory
- [ ] Added `GOOGLE_GEMINI_API_KEY` with actual API key
- [ ] Set `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- [ ] Verified `.env.local` is in `.gitignore`
- [ ] Tested that dev server starts without errors
- [ ] Confirmed AI features work or mock data is displayed

## 🌐 Production Environment

For production deployment:

```env
# Production .env.local
GOOGLE_GEMINI_API_KEY=your_production_api_key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production

# Optional production settings
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
SENTRY_DSN=your_error_tracking_dsn
```

---

**⚡ Quick Start**: Copy `.env.example` to `.env.local`, add your Gemini API key, and run `npm run dev`!
