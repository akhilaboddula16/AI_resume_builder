# ─────────────────────────────────────────────────────────────────────────────
# prompts/research_prompt.py
#
# WHAT THIS FILE DOES:
#   Stores the prompt template for the Research Agent.
#   A prompt template is a pre-written instruction to the LLM with
#   placeholders ({job_title}, {similar_resumes}) that get filled at runtime.
#
# WHY SEPARATE PROMPT FILES?
#   Keeping prompts in separate files makes them easy to:
#   - Edit and improve without touching agent logic
#   - Test independently
#   - Version control changes to prompts specifically
# ─────────────────────────────────────────────────────────────────────────────

RESEARCH_PROMPT = """
You are an expert resume consultant and career advisor with deep knowledge of
industry-specific skills, keywords, and ATS (Applicant Tracking System) requirements.

Your task is to research and identify the most relevant skills, keywords, and 
industry terms for the following job profile:

JOB TITLE: {job_title}
USER TYPE: {user_type}

SIMILAR RESUME EXAMPLES FROM DATABASE:
{similar_resumes}

Based on the job title and similar resumes above, provide:

1. TECHNICAL SKILLS (10-15 most important technical skills/tools for this role)
2. SOFT SKILLS (5 important soft skills for this role)
3. ATS KEYWORDS (10 high-impact keywords recruiters search for)
4. ACTION VERBS (10 strong action verbs used in this field)

Format your response as a JSON object like this:
{{
    "technical_skills": ["skill1", "skill2", ...],
    "soft_skills": ["skill1", "skill2", ...],
    "ats_keywords": ["keyword1", "keyword2", ...],
    "action_verbs": ["verb1", "verb2", ...]
}}

IMPORTANT:
- Focus on skills most relevant to {job_title} in 2024-2025
- Include both beginner and advanced level skills (since user may be {user_type})
- Prioritize skills that appear in job postings and ATS systems
- Return ONLY the JSON object, no other text
"""


SKILLS_SUGGESTION_PROMPT = """
You are a career advisor helping a {user_type} build their resume.

They are looking for a job as: {job_title}

Suggest the TOP 15 most important skills they should have/learn for this role.

Group them into categories.

Return as JSON:
{{
    "skills": ["skill1", "skill2", ...],
    "categories": {{
        "Programming Languages": ["Python", "JavaScript"],
        "Frameworks": ["FastAPI", "React"],
        "Tools": ["Git", "Docker"],
        "Databases": ["PostgreSQL", "MongoDB"],
        "Other": ["Agile", "REST API"]
    }}
}}

Return ONLY the JSON, no other text.
"""
