from pydantic import BaseModel

class Skills(BaseModel):
    skills: list[str]

class SalaryImpactRequest(BaseModel):
    skills: list[str]
    new_skill: str

class CurriculumRequest(BaseModel):
    skills_to_learn: list[str]


class ChatRequest(BaseModel):
    role: str  # 'tutor' | 'coach' | 'mentor'
    analysis: dict
    question: str


class GenerateCourseRequest(BaseModel):
    target_skill: str
    level: str | None = None  # optional, e.g., 'beginner'