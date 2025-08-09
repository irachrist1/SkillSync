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

---

## API Endpoints

All endpoints are prefixed with `/skillsync`.

### 1. Match Jobs

*   **URL:** `/skillsync/match-jobs`
*   **Method:** `POST`
*   **Description:** Takes a list of a user's current skills and returns a list of jobs from the database that they are fully qualified for. This is used by the frontend to display suitable job openings to the user.

**Request Body Schema:**

```json
{
  "skills": ["string"]
}
```

**Example Request (`curl`):**

```bash
curl -X POST http://localhost:7800/skillsync/match-jobs \
-H "Content-Type: application/json" \
-d '{
  "skills": ["html", "css", "javascript"]
}'
```

**Example Response:**

```json
{
  "qualified_jobs": [
    {
      "id": 1,
      "title": "Entry-level Web Developer",
      "salaryRange": {
        "min": 150000,
        "max": 300000,
        "currency": "RWF"
      },
      "requiredSkills": ["html", "css", "javascript"]
    }
  ]
}
```

---


### 2. Opportunity Gap Analysis

*   **URL:** `/skillsync/opportunity-gap-analysis`
*   **Method:** `POST`
*   **Description:** Takes a user's skills and uses the Gemini AI to recommend the top 1-2 skills they should learn to unlock better job opportunities. The frontend uses this to provide personalized career guidance. The AI response is now directly parsed into JSON.

**Request Body Schema:**

```json
{
  "skills": ["string"]
}
```

**Example Response:**

```json
{
  "analysis": {
    "recommendations": [
      {
        "skill": "React",
        "explanation": "React is highly demanded in Rwanda\u0027s tech scene...",
        "potential_salary_increase_rwf": 250000
      }
    ]
  }
}
```

---


### 3. Salary Impact Calculator

*   **URL:** `/skillsync/salary-impact-calculator`
*   **Method:** `POST`
*   **Description:** Calculates the potential increase in a user\'s *maximum* potential salary if they were to learn a specific new skill. This helps users make informed decisions about their learning path. The calculation logic has been improved to ensure a non-negative increase.

**Request Body Schema:**

```json
{
  "skills": ["string"],
  "new_skill": "string"
}
```

**Example Response:**

```json
{
  "potential_salary_increase_rwf": 300000
}
```

---


### 4. Generate Curriculum

*   **URL:** `/skillsync/generate-curriculum`
*   **Method:** `POST`
*   **Description:** Takes a list of skills a user wants to learn and uses the Gemini AI to generate a personalized, project-based learning path. The frontend displays this curriculum to the user to guide their learning. The AI response is now directly parsed into JSON.

**Request Body Schema:**

```json
{
  "skills_to_learn": ["string"]
}
```

**Example Response:**

```json
{
  "curriculum": {
    "learning_path": [
      {
        "skill": "SQL",
        "resource": "https://example.com/sql-tutorial",
        "project": "Build a database for an e-commerce platform."
      }
    ]
  }
}
```

---

### 5. Market Insights

*   **URL:** `/skillsync/market-insights`
*   **Method:** `POST`
*   **Description:** Generates market insights based on a user\'s skills using the Gemini AI. This provides users with a broader understanding of the job market. The AI response is now directly parsed into JSON.

**Request Body Schema:**

```json
{
  "skills": ["string"]
}
```

**Example Response:**

```json
{
  "insights": {
    "insights": [
      "Web Development remains the most in-demand skill in Rwanda.",
      "FinTech and Mobile Money integration are critical for many new roles.",
      "Data Analysis skills are seeing rapid growth in the Rwandan market."
    ]
  }
}
```

---
