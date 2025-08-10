# SkillSync API Documentation

Welcome! This guide provides a comprehensive overview of the SkillSync API, its architecture, and how to interact with it.

## System Architecture

The SkillSync application is composed of two primary services: a **Frontend Application** and a **Backend API**. This separation of concerns allows for a more scalable and maintainable system.

*   **Frontend Application:** A [Next.js](https://nextjs.org/) application responsible for the user interface and user experience. It is a single-page application (SPA) that runs in the user's browser. The frontend communicates with the backend API to fetch data and perform actions.

*   **Backend API:** A [FastAPI](https://fastapi.tiangolo.com/) (Python) application that serves as the system's core. It handles business logic, data processing, and integration with external services like the Gemini API for AI-powered features.

*   **Communication:** The frontend and backend communicate via a RESTful API. The frontend sends HTTP requests to the backend, and the backend responds with JSON data.

*   **Orchestration:** Both services are containerized using Docker and managed with Docker Compose. This ensures a consistent and reproducible environment for development and deployment.

## Running the Application (Frontend & Backend)

To run both the frontend and backend services using Docker Compose, navigate to the root of the `SkillSync` directory (where `docker-compose.yml` is located) and execute:

```bash
docker-compose up --build -d
```

- The **Backend API** will be available at `http://localhost:7800`.
- The **Frontend Application** will be available at `http://localhost:3000`.

To stop the services:

```bash
docker-compose down
```

### Development Mode (DEV_MODE)

The Backend API supports a `DEV_MODE` environment variable. When `DEV_MODE` is set to `true`, the `/generate-full-analysis` endpoint will return hardcoded, predefined responses instead of making actual calls to the Gemini AI model. This is useful for development and testing to save on API token usage.

To enable `DEV_MODE` when running with Docker Compose, ensure the `backend_api` service in `docker-compose.yml` has:

```yaml
    environment:
      - DEV_MODE=true
```

When running the backend locally (outside Docker Compose), you can set the environment variable before launching the application:

```bash
# Linux/macOS
export DEV_MODE=true
uvicorn app.main:app --host 0.0.0.0 --port 7800

# Windows (Command Prompt)
set DEV_MODE=true
uvicorn app.main:app --host 0.0.0.0 --port 7800
```

---

## API Endpoints

All endpoints are served directly from the backend API (e.g., `http://localhost:7800/generate-full-analysis`). There is no `/skillsync` prefix.

### 1. Generate Full Analysis

*   **URL:** `/generate-full-analysis`
*   **Method:** `POST`
*   **Description:** This is the primary orchestration endpoint. It takes a user's skills and performs a comprehensive analysis, including identifying skill gaps, recommending learning paths, providing market insights, and suggesting next-level job opportunities. It integrates multiple AI model calls (unless `DEV_MODE` is enabled).

**Request Body Schema (`schemas.SkillsRequest`):**

```json
{
  "skills": ["string", "string", ...]
}
```

**Example Request (`curl`):**

```bash
curl -X POST http://localhost:7800/generate-full-analysis \
-H "Content-Type: application/json" \
-d '{
  "skills": ["python", "javascript", "html", "css"]
}'
```

**Example Response (`schemas.FullAnalysis`):**

```json
{
  "currentOpportunities": [
    {
      "id": 1,
      "title": "Entry-level Web Developer",
      "company": "Kigali Devs",
      "location": "Kigali, Rwanda",
      "industry": "Technology",
      "jobType": "Full-time",
      "experienceLevel": "Entry",
      "postedDate": "2025-08-01",
      "salaryRange": {
        "min": 150000,
        "max": 300000,
        "currency": "RWF"
      },
      "requiredSkills": ["html", "css", "javascript"]
    }
    // ... more job objects
  ],
  "marketInsights": [
    "The demand for cybersecurity specialists is rapidly increasing due to growing digital infrastructure and financial services.",
    "Fintech innovations are creating new roles; understanding mobile money and digital payment systems is crucial."
  ],
  "recommendations": {
    "salaryProjection": {
      "current": 500000,
      "potential": 750000
    },
    "skillGaps": [
      {
        "skill": "React",
        "explanation": "React is highly demanded in Rwanda's tech scene...",
        "potential_salary_increase_rwf": 250000
      }
      // ... more skill gaps
    ],
    "learningPath": [
      {
        "skill": "SQL",
        "resource": "https://example.com/sql-tutorial",
        "project": "Build a database for an e-commerce platform."
      }
      // ... more learning path items
    ],
    "nextLevelOpportunities": [
      {
        "id": 4,
        "title": "Full-stack Developer",
        "company": "Go Kigali",
        "location": "Kigali, Rwanda",
        "industry": "Tourism",
        "jobType": "Full-time",
        "experienceLevel": "Senior",
        "postedDate": "2025-08-05",
        "salaryRange": {
          "min": 600000,
          "max": 1000000,
          "currency": "RWF"
        },
        "requiredSkills": ["html", "css", "javascript", "react", "python", "fastapi", "sql", "git"]
      }
      // ... more next level job objects
    ]
  }
}
```

---

### 2. Coach Chat

*   **URL:** `/coach-chat`
*   **Method:** `POST`
*   **Description:** Provides AI-powered coaching based on a user's career analysis and specific questions. The AI acts as a tutor, coach, or mentor based on the `role` provided.

**Request Body Schema (`schemas.CoachChatRequest`):**

```json
{
  "question": "string",
  "role": "tutor" | "coach" | "mentor",
  "analysis": {} // The full AIAnalysis object from /generate-full-analysis
}
```

**Example Request (`curl`):**

```bash
curl -X POST http://localhost:7800/coach-chat \
-H "Content-Type: application/json" \
-d '{
  "question": "What should I do next to unlock the best job?",
  "role": "coach",
  "analysis": {
    "userProfile": { /* ... */ },
    "currentOpportunities": [ /* ... */ ],
    "recommendations": { /* ... */ },
    "marketInsights": [ /* ... */ ],
    "lastAnalyzed": "2025-08-09T12:00:00Z"
  }
}'
```

**Example Response (`schemas.CoachChatResponse`):**

```json
{
  "chat": {
    "answer": "Based on your analysis, the highest-impact next step is to learn TypeScript. It is required for many of the 'Next-Level Opportunities' identified for you and can increase your salary potential significantly. A great first step would be to convert one of your existing JavaScript projects to TypeScript.",
    "follow_ups": [
      "Can you give me a 2-week learning plan for TypeScript?",
      "Which companies in Rwanda use TypeScript?",
      "How much more can I earn with TypeScript?"
    ]
  }
}
```

---

### 3. Generate Course

*   **URL:** `/generate-course`
*   **Method:** `POST`
*   **Description:** Generates a personalized, project-based course outline for a specific skill and user level.

**Request Body Schema (`schemas.CourseRequest`):**

```json
{
  "target_skill": "string",
  "level": "beginner" | "intermediate" | "advanced"
}
```

**Example Request (`curl`):**

```bash
curl -X POST http://localhost:7800/generate-course \
-H "Content-Type: application/json" \
-d '{
  "target_skill": "React",
  "level": "beginner"
}'
```

**Example Response (`schemas.CourseResponse`):**

```json
{
  "course": {
    "title": "React in 2 Weeks (Practical)",
    "duration": "2 weeks",
    "modules": [
      {
        "title": "Foundations of React",
        "lessons": [
          {
            "title": "Introduction to React & JSX",
            "resource": "https://www.youtube.com/watch?v=bMknfKXIFA8"
          }
        ]
      }
    ],
    "project": {
      "title": "Build a Simple To-Do App",
      "brief": "Develop a basic To-Do application using React, focusing on components, state, and props."
    }
  }
}
```