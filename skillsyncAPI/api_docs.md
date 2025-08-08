# SkillSync API Documentation

Welcome! This guide explains how to interact with the SkillSync API and run the entire application.

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
*   **Description:** Takes a list of a user's current skills and returns a list of jobs from the database that they are fully qualified for.

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
*   **Description:** Takes a user's skills and uses the Gemini AI to recommend the top 1-2 skills they should learn to unlock better job opportunities. The AI response is now directly parsed into JSON.

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
        "explanation": "React is highly demanded in Rwanda\'s tech scene...",
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
*   **Description:** Calculates the potential increase in a user\'s *maximum* potential salary if they were to learn a specific new skill. The calculation logic has been improved to ensure a non-negative increase.

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
*   **Description:** Takes a list of skills a user wants to learn and uses the Gemini AI to generate a personalized, project-based learning path. The AI response is now directly parsed into JSON.

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
*   **Description:** Generates market insights based on a user\'s skills using the Gemini AI. The AI response is now directly parsed into JSON.

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