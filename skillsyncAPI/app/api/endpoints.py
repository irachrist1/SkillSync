import os
import json
import google.generativeai as genai
from fastapi import APIRouter
from dotenv import load_dotenv
from .. import database, schemas

load_dotenv()

router = APIRouter()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

@router.post("/match-jobs")
def match_jobs(request: schemas.Skills):
    """
    Matches a user's skills to jobs in the database.
    A user is considered qualified for a job if they have all the required skills.
    """
    qualified_jobs = []
    for job in database.JOBS:
        if set(job["required_skills"]).issubset(set(request.skills)):
            qualified_jobs.append(job)
    return {"qualified_jobs": qualified_jobs}

@router.post("/opportunity-gap-analysis")
def opportunity_gap_analysis(request: schemas.Skills):
    """
    Analyzes a user's skills and identifies the highest-impact skills to learn next.
    """
    # Find all jobs the user is NOT qualified for
    unqualified_jobs = []
    for job in database.JOBS:
        if not set(job["required_skills"]).issubset(set(request.skills)):
            unqualified_jobs.append(job)

    # Create a prompt for the Gemini API
    prompt = f"""You are a career intelligence analyst specializing in Rwanda's digital economy.

A user has the following skills: {request.skills}.

They are not qualified for the following jobs: {unqualified_jobs}.

Analyze the user's skill gap and recommend the top 1-2 skills they should learn to unlock the most significant job opportunities. 
Provide a brief explanation for each recommendation and the potential salary increase.

Your response should be in JSON format, with the following structure:
{{
  "recommendations": [
    {{
      "skill": "<skill_name>",
      "explanation": "<explanation>",
      "potential_salary_increase_rwf": <salary_increase>
    }}
  ]
}}
"""

    # Call the Gemini API
    model = genai.GenerativeModel('gemini-1.5-flash-latest')
    response = model.generate_content(prompt)

    # Extract the JSON from the response
    json_response = json.loads(response.text.replace("```json", "").replace("```", ""))

    return {"analysis": json_response}

@router.post("/salary-impact-calculator")
def salary_impact_calculator(request: schemas.SalaryImpactRequest):
    """
    Calculates the potential salary impact of learning a new skill.
    """
    # Find the user's current maximum potential salary
    current_max_salary = 0
    for job in database.JOBS:
        if set(job["required_skills"]).issubset(set(request.skills)):
            if job["salaryRange"]["max"] > current_max_salary:
                current_max_salary = job["salaryRange"]["max"]

    # Find the new maximum potential salary with the new skill
    new_skills = request.skills + [request.new_skill]
    new_max_salary = 0
    for job in database.JOBS:
        if set(job["required_skills"]).issubset(set(new_skills)):
            if job["salaryRange"]["max"] > new_max_salary:
                new_max_salary = job["salaryRange"]["max"]

    # Calculate the potential salary increase, ensuring it's not negative
    salary_increase = max(0, new_max_salary - current_max_salary)

    return {"potential_salary_increase_rwf": salary_increase}


@router.post("/generate-curriculum")
def generate_curriculum(request: schemas.CurriculumRequest):
    """
    Generates a personalized learning path for a user based on a list of skills.
    """
    # Create a prompt for the Gemini API
    prompt = f"""You are an expert curriculum designer creating job-market-driven learning paths.

A user wants to learn the following skills: {request.skills_to_learn}.

Design a practical, project-based learning experience for these skills. 
For each skill, provide a link to a learning resource and a brief project description to test their knowledge.

Your response should be in JSON format, with the following structure:
{{
  "learning_path": [
    {{
      "skill": "<skill_name>",
      "resource": "<resource_link>",
      "project": "<project_description>"
    }}
  ]
}}
"""

    # Call the Gemini API
    model = genai.GenerativeModel('gemini-1.5-flash-latest')
    response = model.generate_content(prompt)

    # Extract the JSON from the response
    json_response = json.loads(response.text.replace("```json", "").replace("```", ""))

    return {"curriculum": json_response}


@router.post("/market-insights")
def market_insights(request: schemas.Skills):
    """
    Generates market insights based on a user's skills.
    """
    # Create a prompt for the Gemini API
    prompt = f"""You are a Rwandan job market analyst.

A user has the following skills: {request.skills}.

Based on these skills, provide 3-4 key insights about the current job market in Rwanda. 
Focus on trends, opportunities, and potential challenges.

Your response should be in JSON format, with the following structure:
{{
  "insights": [
    "<insight_1>",
    "<insight_2>",
    "<insight_3>"
  ]
}}
"""

    # Call the Gemini API
    model = genai.GenerativeModel('gemini-1.5-flash-latest')
    response = model.generate_content(prompt)

    # Extract the JSON from the response
    json_response = json.loads(response.text.replace("```json", "").replace("```", ""))

    return {"insights": json_response}

