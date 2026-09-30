# ─────────────────────────────────────────────────────────────────────────────
# prompts/formatter_prompt.py — Formatter Agent Prompt
# ─────────────────────────────────────────────────────────────────────────────

# Template section orders — each template displays sections in its own preferred hierarchy
TEMPLATE_SECTION_ORDERS = {
    1: ["basic_info", "career_objective", "education", "skills", "experience", "internship", "projects", "certifications", "achievements"],
    2: ["basic_info", "career_objective", "education", "experience", "internship", "projects", "skills", "certifications"],
    3: ["basic_info", "career_objective", "education", "skills", "trainings", "projects", "personal_skills", "certifications"],
    4: ["basic_info", "career_objective", "education", "projects", "skills", "experience", "internship", "certifications", "achievements"],
    5: ["basic_info", "career_objective", "education", "experience", "internship", "skills", "projects", "certifications", "key_accomplishments"],
    6: ["basic_info", "education", "experience", "internship", "projects", "skills", "certifications", "achievements"],
    7: ["basic_info", "career_objective", "skills", "projects", "experience", "internship", "education", "certifications"],
    8: ["basic_info", "career_objective", "experience", "internship", "projects", "education", "skills", "certifications"],
}

FORMATTER_PROMPT = """
You are a resume formatter. Your job is to take the polished resume content
and organize it into the structure required by Template {template_id}.

POLISHED RESUME CONTENT:
{polished_content}

TEMPLATE {template_id} SECTION ORDER:
{section_order}

USER TYPE: {user_type}
HAS INTERNSHIP: {has_internship}

Rules for this template:
{template_rules}

IMPORTANT INTEGRITY RULES:
1. NEVER omit, discard, or delete any section that contains data in POLISHED RESUME CONTENT (e.g. career_objective, certifications, skills, projects, education). All user information must be preserved.
2. For all projects: keep "name", "tech_stack", "github_url", "live_url", "date", and "bullets".
3. For all certifications: keep "name", "platform", "year", and "link".
4. For skills: keep as a flat list under "skills": ["skill1", "skill2", ...].
5. For career objective / summary: keep under "career_objective".

Return structured JSON containing all populated sections in the template's order.
Return ONLY valid JSON.
"""

# Rules specific to each template
TEMPLATE_RULES = {
    1: "Section headers in BOLD CAPS. Use middle dot (·) for bullets. Technical strengths in 2-column format.",
    2: "Show location right-aligned under date in experience. Technical strengths at bottom.",
    3: "Education as a table with columns: Course, Institution, Board/University, Year, Percentage. Include 10th/12th.",
    4: "Projects section comes before technical strengths. Project names as bold subheadings.",
    5: "Include PROFILE section (personality summary). Label skills as SKILLS AND INTERESTS.",
    6: "Header has logo placeholder on left. Education as 4-column table. Use dash (–) for sub-bullets.",
    7: "Summary at top. Projects before experience. Show tech stack right-aligned with project dates. Sans-serif styling.",
    8: "Experience first — no summary at top. Icons in contact line. Inline bold emphasis in bullets. No dates on projects.",
}
