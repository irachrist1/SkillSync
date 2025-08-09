import os
import json
import re
import google.generativeai as genai
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from google.api_core.exceptions import ResourceExhausted
from .. import database, schemas
import asyncio

load_dotenv()

router = APIRouter()

# Configure the Gemini API key
try:
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
except (TypeError, ValueError) as e:
    raise RuntimeError("GOOGLE_API_KEY is not configured correctly.") from e

def clean_and_parse_json(text: str) -> dict:
    """Cleans the raw text from Gemini and parses it into a Python dictionary."""
    cleaned_text = re.sub(r"```json\n?|```", "", text).strip()
    try:
        return json.loads(cleaned_text)
    except json.JSONDecodeError as e:
        print(f"JSONDecodeError: {e}\nOriginal text: {text}")
        raise HTTPException(status_code=500, detail=f"Failed to parse AI response: {e}")

async def get_opportunity_gap_analysis(skills: list[str]) -> dict:
    """Analyzes a user's skills and identifies the highest-impact skills to learn next."""
    unqualified_jobs = [j for j in database.JOBS if not set(j["required_skills"]).issubset(set(skills))]
    prompt = f'''**SYSTEM PROMPT**

You are a hyper-focused career intelligence analyst for Rwanda's digital economy, integrated into the SkillSync application. Your sole purpose is to help users bridge the skills gap and find better jobs in Rwanda.

**CONTEXT**
- **User's Current Skills:** {skills}
- **Relevant Unqualified Jobs (Data):** {unqualified_jobs}
- **Your Goal:** Analyze the user's skill gap based *only* on the provided data and recommend the top 1-2 skills that will unlock the most significant job opportunities and salary increases in Rwanda.

**INSTRUCTIONS**
1.  **Analyze the Data:** Identify the most frequently required skills in the `unqualified_jobs` list that the user is missing.
2.  **Prioritize by Impact:** Determine which of those missing skills leads to the highest potential salary increase and opens up the most job opportunities.
3.  **Generate Recommendations:** Provide a concise, data-driven explanation for each recommended skill.
4.  **Output Pure JSON:** Your response MUST be only the JSON object, with no markdown formatting or commentary.

**EXAMPLE**
*If a user knows HTML/CSS and the data shows many high-paying jobs require 'React', your output should be...*

```json
{{
  "recommendations": [
    {{
      "skill": "React",
      "explanation": "React is the most in-demand frontend library in Rwanda, required for over 60% of mid-level web development jobs. Learning it can increase your salary potential by up to 300,000 RWF.",
      "potential_salary_increase_rwf": 300000
    }}
  ]
}}
```

**RESPONSE FORMAT**
```json
{{
  "recommendations": [
    {{
      "skill": "<skill_name>",
      "explanation": "<data-driven_explanation>",
      "potential_salary_increase_rwf": <salary_increase_integer>
    }}
  ]
}}
```'''
    try:
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        response = await model.generate_content_async(prompt)
        return clean_and_parse_json(response.text)
    except ResourceExhausted as e:
        raise HTTPException(status_code=429, detail=f"API quota exceeded: {e}")
    except Exception as e:
        # Catch other potential errors during API call
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred with the AI model: {e}")

async def get_learning_path(skills_to_learn: list[str]) -> dict:
    """Generates a personalized learning path for a given set of skills."""
    prompt = f'''**SYSTEM PROMPT**

You are an expert curriculum designer for the SkillSync application, focused on the Rwandan job market.

**CONTEXT**
- **Skills to Learn:** {skills_to_learn}
- **Your Goal:** Generate a practical, project-based learning path to help a user acquire these skills and become job-ready in Rwanda.

**INSTRUCTIONS**
1.  **Create a Module for Each Skill:** For each skill in the list, create a learning module.
2.  **Find a High-Quality Resource:** For each module, recommend a specific, high-quality, and preferably free online resource (e.g., a specific YouTube playlist, a freeCodeCamp course, etc.).
3.  **Design a Mini-Project:** For each module, design a small, practical project that allows the user to apply the skill in a way that is relevant to the Rwandan job market.
4.  **Output Pure JSON:** Your response MUST be only the JSON object, with no markdown formatting or commentary.

**RESPONSE FORMAT**
```json
{{
  "learning_path": [
    {{
      "skill": "<skill_name>",
      "resource": "<resource_url>",
      "project": "<project_description>"
    }}
  ]
}}
```'''
    try:
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        response = await model.generate_content_async(prompt)
        return clean_and_parse_json(response.text)
    except ResourceExhausted as e:
        raise HTTPException(status_code=429, detail=f"API quota exceeded: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred with the AI model: {e}")

@router.post("/generate-full-analysis", response_model=schemas.FullAnalysis)
async def generate_full_analysis(request: schemas.SkillsRequest):
    """Orchestrates the full analysis of a user's skills."""
    dev_mode = os.getenv("DEV_MODE", "false").lower() == "true"

    if dev_mode:
        # In dev mode, return a complete, valid, pre-defined response
        return {
            "currentOpportunities": database.JOBS,
            "marketInsights": ["In dev mode: Rwanda's tech sector is booming.", "Dev mode insight: Fintech is a key growth area."],
            "recommendations": {
                "salaryProjection": {"current": 550000, "potential": 800000},
                "skillGaps": [
                    {"skill": "TypeScript", "explanation": "Adds type safety to your projects.", "potential_salary_increase_rwf": 100000},
                    {"skill": "Testing", "explanation": "Ensures code quality and reliability.", "potential_salary_increase_rwf": 50000}
                ],
                "learningPath": [
                    {"skill": "TypeScript", "resource": "https://www.typescriptlang.org/", "project": "Convert a small JS project to TypeScript."},
                    {"skill": "Testing", "resource": "https://jestjs.io/", "project": "Write unit tests for a key component."}
                ],
                "nextLevelOpportunities": [job for job in database.JOBS if job["experienceLevel"] == "Senior"]
            }
        }

    try:
        # In a real application, these would be parallelized
        gap_analysis_data = await get_opportunity_gap_analysis(request.skills)
        skill_gaps = gap_analysis_data.get("recommendations", [])
        skills_to_learn = [skill["skill"] for skill in skill_gaps]

        learning_path_data = await get_learning_path(skills_to_learn)
        learning_path = learning_path_data.get("learning_path", [])

        # Placeholder data for the new sections
        current_opportunities = database.JOBS
        market_insights = ["Market insight 1", "Market insight 2"]
        salary_projection = {"current": 500000, "potential": 750000}
        
        # Calculate next level opportunities
        next_level_opportunities = [j for j in database.JOBS if not set(j["required_skills"]).issubset(set(request.skills)) and set(j["required_skills"]).issubset(set(request.skills + skills_to_learn))]

        return {
            "currentOpportunities": current_opportunities,
            "marketInsights": market_insights,
            "recommendations": {
                "salaryProjection": salary_projection,
                "skillGaps": skill_gaps,
                "learningPath": learning_path,
                "nextLevelOpportunities": next_level_opportunities,
            },
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

@router.post("/coach-chat", response_model=schemas.CoachChatResponse)
async def coach_chat(request: schemas.CoachChatRequest):
    """Provides AI-powered coaching based on user analysis and questions."""
    prompt = f'''**SYSTEM PROMPT**

You are a {request.role} within the SkillSync application, an AI-powered career intelligence tool for the Rwandan job market. Your goal is to provide clear, actionable, and encouraging advice to help users achieve their career goals in Rwanda.

**CONTEXT**
- **User's Career Analysis:** {request.analysis}
- **User's Question:** "{request.question}"
- **Your Persona:** {request.role}

**INSTRUCTIONS**
1.  **Stay On-Topic:** Your answer must directly address the user's question within the context of their career analysis and the Rwandan job market.
2.  **Be Actionable:** Provide concrete next steps. Instead of "learn more skills," suggest "focus on learning React by building a small e-commerce front-end to add to your portfolio."
3.  **Be Encouraging:** Frame your advice in a positive and motivating way.
4.  **Generate Follow-ups:** Provide three concise, relevant follow-up questions that the user might have.
5.  **Output Pure JSON:** Your response MUST be only the JSON object, with no markdown formatting or commentary.

**EXAMPLE**
*If the user asks, "What should I do next?" your response should be structured like this:*

```json
{{
  "answer": "Based on your analysis, the highest-impact next step is to learn TypeScript. It is required for many of the 'Next-Level Opportunities' identified for you and can increase your salary potential significantly. A great first step would be to convert one of your existing JavaScript projects to TypeScript.",
  "follow_ups": [
    "Can you give me a 2-week learning plan for TypeScript?",
    "Which companies in Rwanda use TypeScript?",
    "How much more can I earn with TypeScript?"
  ]
}}
```

**RESPONSE FORMAT**
```json
{{
  "answer": "<your_actionable_answer>",
  "follow_ups": [
    "<question_1>",
    "<question_2>",
    "<question_3>"
  ]
}}
```'''
    try:
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        response = await model.generate_content_async(prompt)
        # The response from the AI is a JSON string, so we parse it
        chat_data = clean_and_parse_json(response.text)
        return {"chat": chat_data}
    except ResourceExhausted:
        raise HTTPException(status_code=429, detail="API quota exceeded.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred with the AI model: {e}")

@router.post("/generate-course", response_model=schemas.CourseResponse)
async def generate_course(request: schemas.CourseRequest):
    """Generates a course outline for a given skill."""
    prompt = f'''**SYSTEM PROMPT**

You are an expert curriculum designer for the SkillSync application, focused on the Rwandan job market.

**CONTEXT**
- **Target Skill:** {request.target_skill}
- **User Level:** {request.level}
- **Your Goal:** Generate a practical, 2-week course outline to help a user learn this skill and build a portfolio project.

**INSTRUCTIONS**
1.  **Create a Title:** The title should be practical, e.g., "React in 2 Weeks (Practical)".
2.  **Define Modules:** Create 2-3 modules with descriptive titles (e.g., "Foundations", "Core Concepts").
3.  **Add Lessons:** For each module, add 2-3 lessons with a title and a link to a high-quality, free resource.
4.  **Design a Project:** Create a final project with a title and a brief description.
5.  **Output Pure JSON:** Your response MUST be only the JSON object, with no markdown formatting or commentary.

**RESPONSE FORMAT**
```json
{{
  "course": {{
    "title": "<course_title>",
    "duration": "2 weeks",
    "modules": [
      {{
        "title": "<module_title>",
        "lessons": [
          {{
            "title": "<lesson_title>",
            "resource": "<resource_url>"
          }}
        ]
      }}
    ],
    "project": {{
      "title": "<project_title>",
      "brief": "<project_brief>"
    }}
  }}
}}```'''
    try:
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        response = await model.generate_content_async(prompt)
        return clean_and_parse_json(response.text)
    except ResourceExhausted as e:
        raise HTTPException(status_code=429, detail=f"API quota exceeded: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred with the AI model: {e}")