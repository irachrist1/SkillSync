from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class CamelCaseModel(BaseModel):
    model_config = ConfigDict(alias_generator=lambda string: string.split('_')[0] + ''.join(word.capitalize() for word in string.split('_')[1:]), populate_by_name=True)

class SkillsRequest(CamelCaseModel):
    skills: List[str]

class SalaryRange(CamelCaseModel):
    min: int
    max: int
    currency: str

class Job(CamelCaseModel):
    id: int
    title: str
    company: str
    location: str
    industry: str
    job_type: str
    experience_level: str
    posted_date: str
    salary_range: SalaryRange
    required_skills: List[str]
    match_score: Optional[float] = None

class SalaryProjection(CamelCaseModel):
    current: int
    potential: int

class SkillGap(CamelCaseModel):
    skill: str
    explanation: str
    potential_salary_increase_rwf: int

class LearningPathItem(CamelCaseModel):
    skill: str
    resource: str
    project: str

class Recommendations(CamelCaseModel):
    salary_projection: SalaryProjection
    skill_gaps: List[SkillGap]
    learning_path: List[LearningPathItem]
    next_level_opportunities: List[Job]

class FullAnalysis(CamelCaseModel):
    current_opportunities: List[Job]
    market_insights: List[str]
    recommendations: Recommendations

class CoachChatRequest(CamelCaseModel):
    question: str
    role: str
    analysis: dict
    user_skills: List[str]

class Chat(CamelCaseModel):
    answer: str
    follow_ups: List[str]

class CoachChatResponse(CamelCaseModel):
    chat: Chat

class CourseRequest(CamelCaseModel):
    target_skill: str
    level: str
    user_skills: List[str]

class Lesson(CamelCaseModel):
    title: str
    resource: str

class Module(CamelCaseModel):
    title: str
    lessons: List[Lesson]

class Project(CamelCaseModel):
    title: str
    brief: str

class Course(CamelCaseModel):
    title: str
    duration: str
    modules: List[Module]
    project: Project

class CourseResponse(CamelCaseModel):
    course: Course
