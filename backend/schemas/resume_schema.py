# ─────────────────────────────────────────────────────────────────────────────
# schemas/resume_schema.py
#
# WHAT THIS FILE DOES:
#   Defines "Pydantic models" — these are Python classes that describe the
#   exact shape of data coming IN to our API (requests) and going OUT (responses).
#
# WHY PYDANTIC?
#   FastAPI uses Pydantic to automatically:
#   1. Validate incoming data (if required field is missing → auto error)
#   2. Convert types (string "2024" → int 2024 automatically)
#   3. Generate API documentation at /docs
#
# THINK OF IT LIKE:
#   TypeScript interfaces but for Python — they define the "contract"
#   between frontend and backend.
# ─────────────────────────────────────────────────────────────────────────────

from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List


# ─────────────────────────────────────────────
# SUB-MODELS — Building blocks used inside main models
# ─────────────────────────────────────────────

class BasicInfo(BaseModel):
    """
    Personal information of the resume owner.
    """
    model_config = ConfigDict(populate_by_name=True)

    name: str = ""                          # Full name
    email: str = ""                         # Email address
    phone: str = ""                         # Phone number
    linkedin: Optional[str] = None          # LinkedIn URL
    github: Optional[str] = None            # GitHub URL
    portfolio: Optional[str] = None         # Portfolio website
    city: Optional[str] = None              # City
    state: Optional[str] = None             # State
    address: Optional[str] = None           # Full address


class Education(BaseModel):
    """
    One education entry.
    """
    model_config = ConfigDict(populate_by_name=True)

    degree: str = ""                        # e.g., "B.Tech", "12th", "10th"
    institution: str = ""                   # e.g., "IIT Kanpur"
    board_university: Optional[str] = Field(default=None, alias="boardUniversity")
    year_from: Optional[str] = Field(default=None, alias="yearFrom")
    year_to: Optional[str] = Field(default=None, alias="yearTo")
    cgpa: Optional[str] = None
    percentage: Optional[str] = None
    department: Optional[str] = None
    location: Optional[str] = None


class Experience(BaseModel):
    """
    One work experience entry.
    """
    model_config = ConfigDict(populate_by_name=True)

    company: str = ""
    job_title: str = Field(default="", alias="jobTitle")
    location: Optional[str] = None
    from_date: Optional[str] = Field(default="", alias="fromDate")
    to_date: Optional[str] = Field(default="", alias="toDate")
    description: Optional[str] = ""


class Internship(BaseModel):
    """
    Internship entry for freshers.
    """
    model_config = ConfigDict(populate_by_name=True)

    company: str = ""
    role: str = ""
    duration: Optional[str] = ""
    location: Optional[str] = None
    description: Optional[str] = ""


class Project(BaseModel):
    """
    One project entry.
    """
    model_config = ConfigDict(populate_by_name=True)

    name: str = ""
    tech_stack: Optional[str] = Field(default=None, alias="techStack")
    github_url: Optional[str] = Field(default=None, alias="githubUrl")
    live_url: Optional[str] = Field(default=None, alias="liveUrl")
    date: Optional[str] = None
    description: Optional[str] = ""


class Certification(BaseModel):
    """
    One certification entry.
    """
    model_config = ConfigDict(populate_by_name=True)

    name: str = ""
    platform: Optional[str] = None
    year: Optional[str] = None
    link: Optional[str] = None


# ─────────────────────────────────────────────
# MAIN REQUEST MODEL — What frontend sends to backend
# ─────────────────────────────────────────────

class ResumeRequest(BaseModel):
    """
    The complete data payload that the frontend sends to POST /api/resume/generate.
    """
    model_config = ConfigDict(populate_by_name=True)

    user_type: str = Field(default="fresher", alias="userType")
    has_internship: bool = Field(default=False, alias="hasInternship")
    template_id: int = Field(default=7, alias="templateId")
    job_title: Optional[str] = Field(default=None, alias="jobTitle")

    basic_info: BasicInfo = Field(default_factory=BasicInfo, alias="basicInfo")
    education: List[Education] = Field(default_factory=list)
    experience: Optional[List[Experience]] = None
    internship: Optional[List[Internship]] = None
    skills: List[str] = Field(default_factory=list)
    projects: Optional[List[Project]] = None
    certifications: Optional[List[Certification]] = None
    career_objective: Optional[str] = Field(default=None, alias="careerObjective")
    achievements: Optional[List[str]] = None
    personal_skills: Optional[List[str]] = Field(default=None, alias="personalSkills")
    job_description: Optional[str] = Field(default=None, alias="jobDescription")  # JD tailoring


# ─────────────────────────────────────────────
# RESPONSE MODELS — What backend sends back to frontend
# ─────────────────────────────────────────────

class ATSResult(BaseModel):
    """
    ATS score and improvement suggestions returned to frontend.
    """
    score: int                         # 0 to 100
    grade: str                         # "Excellent", "Good", "Needs Work"
    suggestions: List[str]             # List of improvement tips


class ResumeResponse(BaseModel):
    """
    Complete response after AI agents process the resume.
    """
    session_id: str                    # Unique ID for this resume session
    polished_resume: dict              # Complete resume data after AI improvement
    ats_result: ATSResult              # ATS score + suggestions
    ai_improvements: List[str]         # Summary of what AI changed


# ─────────────────────────────────────────────
# SKILLS SUGGESTION MODELS
# ─────────────────────────────────────────────

class SkillsRequest(BaseModel):
    """
    Request model for GET /api/resume/skills endpoint.
    """
    job_title: str                     # e.g., "Python Developer"
    user_type: str = "fresher"         # "fresher" or "experienced"


class SkillsResponse(BaseModel):
    """
    Response with suggested skills for a job title.
    """
    skills: List[str]                  # e.g., ["FastAPI", "Django", "PostgreSQL"]
    categories: dict                   # Grouped by category e.g., {"Backend": [...]}
