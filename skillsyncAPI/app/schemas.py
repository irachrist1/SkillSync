from pydantic import BaseModel

class Skills(BaseModel):
    skills: list[str]

class SalaryImpactRequest(BaseModel):
    skills: list[str]
    new_skill: str

class CurriculumRequest(BaseModel):
    skills_to_learn: list[str]
