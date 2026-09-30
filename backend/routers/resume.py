# ─────────────────────────────────────────────────────────────────────────────
# routers/resume.py
#
# WHAT THIS FILE DOES:
#   Defines all resume-related API endpoints.
#   This is where frontend requests come in and LangGraph pipeline is triggered.
#
# ENDPOINTS:
#   POST /api/resume/generate  → Run LangGraph pipeline, return polished resume
#   GET  /api/resume/skills    → Return AI-suggested skills for a job title
#   GET  /api/resume/{id}      → Get a previously saved resume by session ID
# ─────────────────────────────────────────────────────────────────────────────

import json
import os
from fastapi import APIRouter, HTTPException
from starlette.concurrency import run_in_threadpool
from langchain_core.messages import HumanMessage

from agents.llm import get_llm, extract_json
from schemas.resume_schema import ResumeRequest, ResumeResponse, SkillsRequest
from agents.graph import run_resume_pipeline
from database.crud import save_resume, get_resume_by_session
from prompts.research_prompt import SKILLS_SUGGESTION_PROMPT

router = APIRouter(prefix="/api/resume")
# prefix="/api/resume" means all routes in this file start with /api/resume
# So @router.post("/generate") becomes POST /api/resume/generate


# ─────────────────────────────────────────────────────────────────────────────
# ENDPOINT 1: Generate Resume
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/generate")
async def generate_resume(request: ResumeRequest):
    """
    Main endpoint — triggers the full LangGraph agent pipeline.
    """
    try:
        print(f"\n📥 New resume request: {request.user_type} | Template {request.template_id}")

        # ── STEP 1: Convert Pydantic model to plain dict ───────────────────
        # LangGraph state expects a plain Python dict, not Pydantic model
        user_input = {
            "basic_info": request.basic_info.model_dump(),
            # .model_dump() converts Pydantic model → Python dict

            "education": [edu.model_dump() for edu in request.education],
            # List comprehension: convert each Education object to dict

            "experience": [exp.model_dump() for exp in request.experience] if request.experience else [],
            "internship": [intern.model_dump() for intern in request.internship] if request.internship else [],
            "skills": request.skills,
            "projects": [proj.model_dump() for proj in request.projects] if request.projects else [],
            "certifications": [cert.model_dump() for cert in request.certifications] if request.certifications else [],
            "career_objective": request.career_objective,
            "achievements": request.achievements or [],
            "personal_skills": request.personal_skills or [],
        }

        # ── STEP 2: Prepare pipeline input ────────────────────────────────
        pipeline_input = {
            "user_input": user_input,
            "user_type": request.user_type,
            "has_internship": request.has_internship,
            "template_id": request.template_id,
            "job_title": request.job_title or _infer_job_title(user_input),
            "job_description": request.job_description or "",
            # If user didn't provide job title, try to infer from their experience
        }

        # ── STEP 3: Run LangGraph pipeline in background threadpool ────────
        print("🚀 Triggering LangGraph pipeline...")
        final_state = await run_in_threadpool(run_resume_pipeline, pipeline_input)

        # ── STEP 4: Extract results from final state ───────────────────────
        final_resume = final_state.get("final_resume", {})
        ats_score = final_state.get("ats_score", 75)
        ats_suggestions = final_state.get("ats_suggestions", [])
        ats_breakdown = final_state.get("ats_breakdown", {})
        ats_strong_points = final_state.get("ats_strong_points", [])
        session_id = final_resume.get("session_id", "unknown")

        # ── STEP 5: Save to Supabase (offloaded to threadpool) ─────────────
        await run_in_threadpool(
            save_resume,
            session_id=session_id,
            user_type=request.user_type,
            template_id=request.template_id,
            raw_input=user_input,
            ai_output=final_state.get("polished_content", {}),
            ats_score=ats_score,
            final_resume=final_resume
        )

        # ── STEP 6: Return response to frontend ───────────────────────────
        print(f"✅ Resume generated! ATS Score: {ats_score}/100")
        return {
            "session_id": session_id,
            "polished_resume": final_resume,
            "ats_score": ats_score,
            "ats_grade": _get_ats_grade(ats_score),
            "ats_suggestions": ats_suggestions,
            "ai_improvements": final_state.get("polished_content", {}).get("improvements_made", []),
            "ats_breakdown": ats_breakdown,
            "ats_strong_points": ats_strong_points,
        }

    except Exception as e:
        print(f"❌ Error generating resume: {e}")
        raise HTTPException(status_code=500, detail=f"Resume generation failed: {str(e)}")
        # HTTPException → FastAPI sends a proper HTTP error response to frontend
        # status_code=500 = Internal Server Error


# ─────────────────────────────────────────────────────────────────────────────
# ENDPOINT 2: Suggest Skills
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/skills")
async def suggest_skills(job_title: str, user_type: str = "fresher"):
    """
    Returns AI-suggested skills for a given job title.
    Called when user enters their job title in the Skills form step.

    Args:
        job_title: e.g., "Python Developer" (from URL query param)
        user_type: "fresher" or "experienced"

    Returns:
        List of suggested skills + grouped by category
    """
    try:
        llm = get_llm(temperature=0.3, max_tokens=1000)

        filled_prompt = SKILLS_SUGGESTION_PROMPT.format(
            job_title=job_title,
            user_type=user_type
        )

        response = await run_in_threadpool(llm.invoke, [HumanMessage(content=filled_prompt)])
        skills_data = extract_json(response.content)

        return {
            "skills": skills_data.get("skills", []),
            "categories": skills_data.get("categories", {})
        }

    except Exception as e:
        print(f"⚠️ Skills suggestion error: {e}")
        raise HTTPException(status_code=500, detail=f"Skills suggestion failed: {str(e)}")


# ─────────────────────────────────────────────────────────────────────────────
# ENDPOINT 3: Get Saved Resume
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/{session_id}")
async def get_resume(session_id: str):
    """
    Retrieves a previously generated resume by session ID.

    Args:
        session_id: UUID of the resume session

    Returns:
        Saved resume data from Supabase
    """
    resume = get_resume_by_session(session_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume


# ─────────────────────────────────────────────────────────────────────────────
# ENDPOINT 4: Generate Cover Letter
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/cover-letter")
async def generate_cover_letter(request: dict):
    """
    Generates a professional cover letter from resume data + job title.
    Called from the preview page after resume is ready.
    """
    try:
        name = request.get("name", "") or "The Candidate"
        job_title = request.get("job_title", "Software Developer")
        company = request.get("company", "the company")
        skills = request.get("skills", [])
        experience_summary = request.get("experience_summary", "")

        skills_str = ", ".join(skills[:8]) if skills else "software development and problem solving"

        # Build a rich background sentence
        if experience_summary and len(experience_summary.strip()) > 20:
            background = experience_summary.strip()[:300]
        else:
            background = f"a passionate professional skilled in {skills_str}"

        prompt = f"""You are writing a real, complete, personalized cover letter. Do NOT use any placeholders, brackets, or template variables like [Name], [Company], [Date], or [Hiring Manager]. Write the actual letter text directly using the information below.

CANDIDATE INFORMATION:
- Full Name: {name}
- Applying For: {job_title} position
- Company: {company}
- Top Skills: {skills_str}
- Background: {background}

Write a cover letter with EXACTLY this structure — no headers, no subject line, no date, no address block:

Paragraph 1 (2-3 sentences): Express genuine enthusiasm for the {job_title} role at {company}. Mention 1-2 of the most relevant skills.

Paragraph 2 (3-4 sentences): Describe a specific achievement or experience. Use the background info. Quantify impact if possible.

Paragraph 3 (2-3 sentences): Show understanding of {company}'s work. Express why you are a great fit.

Closing line: "I look forward to discussing how I can contribute to {company}. Thank you for your time and consideration."

Sign off with:
Sincerely,
{name}

IMPORTANT RULES:
- Use "{name}" as the actual name — do not write [Your Name]
- Use "{company}" as the actual company — do not write [Company Name]
- Use "{job_title}" as the actual role — do not write [Position]
- NO brackets, NO placeholder text, NO template variables anywhere
- Write naturally, as if this is a real letter being sent today
- Total: 180-230 words (body only, excluding sign-off)
"""

        llm = get_llm(temperature=0.6, max_tokens=500)
        response = await run_in_threadpool(llm.invoke, [HumanMessage(content=prompt)])

        cover_letter_text = response.content.strip()

        # Safety: if model still returned brackets, flag it
        if "[" in cover_letter_text and "]" in cover_letter_text:
            # Strip common placeholder lines
            lines = cover_letter_text.split("\n")
            cleaned = [l for l in lines if not (l.strip().startswith("[") or l.strip().endswith("]"))]
            cover_letter_text = "\n".join(cleaned).strip()

        return {
            "cover_letter": cover_letter_text,
            "candidate_name": name,
            "job_title": job_title,
        }

    except Exception as e:
        print(f"❌ Cover letter error: {e}")
        raise HTTPException(status_code=500, detail=f"Cover letter generation failed: {str(e)}")


# ─────────────────────────────────────────────────────────────────────────────
# HELPER FUNCTIONS
# ─────────────────────────────────────────────────────────────────────────────

def _infer_job_title(user_input: dict) -> str:
    """
    Tries to infer the job title from the user's experience or internship data.
    Used when the user doesn't explicitly provide a job title.
    """
    experience = user_input.get("experience", [])
    internship = user_input.get("internship", [])

    if experience and len(experience) > 0:
        return experience[0].get("job_title", "Software Developer")
    elif internship and len(internship) > 0:
        return internship[0].get("role", "Software Developer")
    return "Software Developer"     # Default fallback


def _get_ats_grade(score: int) -> str:
    """Converts numeric ATS score to a human-readable grade."""
    if score >= 90:
        return "Excellent"
    elif score >= 70:
        return "Good"
    elif score >= 50:
        return "Needs Work"
    else:
        return "Poor"
