# SkillSync API Documentation

Welcome, Developer 1! This guide explains how to connect the Next.js frontend to the SkillSync API.

## Running the API

To get started, run the API using Docker:

```bash
sudo docker-compose up --build -d
```

The API will be available at `http://localhost:7800`.

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
      "salary_range_rwf": [150000, 300000],
      "required_skills": ["html", "css", "javascript"]
    }
  ]
}
```

---


### 2. Opportunity Gap Analysis

*   **URL:** `/skillsync/opportunity-gap-analysis`
*   **Method:** `POST`
*   **Description:** Takes a user's skills and uses the Gemini AI to recommend the top 1-2 skills they should learn to unlock better job opportunities.

**Request Body Schema:**

```json
{
  "skills": ["string"]
}
```

**Example Response (the `analysis` field contains a stringified JSON object):

```json
{
  "analysis": "{\"recommendations\":[{\"skill\":\"React\", ...}]}"
}
```

---


### 3. Salary Impact Calculator

*   **URL:** `/skillsync/salary-impact-calculator`
*   **Method:** `POST`
*   **Description:** Calculates the potential increase in a user's *maximum* potential salary if they were to learn a specific new skill.

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
*   **Description:** Takes a list of skills a user wants to learn and uses the Gemini AI to generate a personalized, project-based learning path.

**Request Body Schema:**

```json
{
  "skills_to_learn": ["string"]
}
```

**Example Response (the `curriculum` field contains a stringified JSON object):

```json
{
  "curriculum": "{\"learning_path\":[{\"skill\":\"react\", ...}]}"
}
```

---

Good luck with the integration!
