# ─────────────────────────────────────────────────────────────────────────────
# agents/formatter_agent.py
#
# WHAT THIS FILE DOES:
#   This is Agent 4 (the FINAL agent) in the LangGraph pipeline.
#   It takes the polished resume content and organizes it into the exact
#   structure required by the user's chosen template.
#
# HOW IT WORKS:
#   1. Reads polished_content + template_id + ats_score from state
#   2. Looks up the correct section order for the chosen template
#   3. Reorganizes data into that structure
#   4. Returns the final_resume JSON ready for frontend to render
#
# INPUT  (reads from state): polished_content, template_id, ats_score, ats_suggestions
# OUTPUT (writes to state):  final_resume
# ─────────────────────────────────────────────────────────────────────────────

import json
import os
import uuid  # To generate unique session IDs

from langchain_core.messages import HumanMessage

from agents.state import ResumeState
from agents.llm import get_llm, extract_json
from prompts.formatter_prompt import (
    FORMATTER_PROMPT,
    TEMPLATE_SECTION_ORDERS,
    TEMPLATE_RULES,
)


def formatter_agent(state: ResumeState) -> dict:
    """
    Formatter Agent — Final Agent 4 in the LangGraph pipeline.
    Structures the polished resume into the chosen template's format.
    """

    print("🎨 Formatter Agent: Structuring final resume...")

    try:
        # ── STEP 1: Get all needed data from state ────────────────────────
        user_input = state.get("user_input", {})
        polished_content = state.get("polished_content", {})
        template_id = state.get("template_id", 7)           # Default = Template 7
        user_type = state.get("user_type", "fresher")
        has_internship = state.get("has_internship", False)
        ats_score = state.get("ats_score", 75)
        ats_suggestions = state.get("ats_suggestions", [])

        # ── STEP 2: Get the section order for this template ───────────────
        section_order = TEMPLATE_SECTION_ORDERS.get(template_id, TEMPLATE_SECTION_ORDERS[7])
        template_rules = TEMPLATE_RULES.get(template_id, "Professional style")

        # Formatter Agent directly structures and ensures complete integrity
        # without an extra redundant 20-second LLM call
        formatted_resume = dict(polished_content) if isinstance(polished_content, dict) else {}

        # ── SAFEGUARD: Ensure NO user section or link is ever lost ─────────
        # 1. basic_info
        if not formatted_resume.get("basic_info"):
            formatted_resume["basic_info"] = polished_content.get("basic_info") or user_input.get("basic_info", {})

        # 2. career_objective / summary
        if not formatted_resume.get("career_objective"):
            formatted_resume["career_objective"] = (
                formatted_resume.get("summary") or
                formatted_resume.get("profile") or
                polished_content.get("career_objective") or
                polished_content.get("summary") or
                user_input.get("career_objective")
            )

        # 3. skills (flatten if dict, merge from polished_content / user_input)
        raw_skills = (
            formatted_resume.get("skills") or
            formatted_resume.get("technical_skills") or
            formatted_resume.get("technical_strengths") or
            polished_content.get("skills") or
            user_input.get("skills")
        )
        if isinstance(raw_skills, dict):
            flat_skills = []
            for sub in raw_skills.values():
                if isinstance(sub, list):
                    flat_skills.extend([str(x) for x in sub])
                else:
                    flat_skills.append(str(sub))
            raw_skills = flat_skills
        formatted_resume["skills"] = raw_skills or []

        # 4. education
        if not formatted_resume.get("education"):
            formatted_resume["education"] = polished_content.get("education") or user_input.get("education", [])

        # 5. experience & internship
        if not formatted_resume.get("experience"):
            formatted_resume["experience"] = polished_content.get("experience") or user_input.get("experience", [])
        if not formatted_resume.get("internship"):
            formatted_resume["internship"] = polished_content.get("internship") or user_input.get("internship", [])

        # 6. projects (preserve links & dates)
        raw_proj = formatted_resume.get("projects") or polished_content.get("projects")
        user_proj = user_input.get("projects", [])
        if raw_proj and isinstance(raw_proj, list):
            for idx, p in enumerate(raw_proj):
                if isinstance(p, dict) and idx < len(user_proj):
                    u = user_proj[idx]
                    if isinstance(u, dict):
                        if not p.get("github_url") and u.get("github_url"):
                            p["github_url"] = u["github_url"]
                        if not p.get("live_url") and u.get("live_url"):
                            p["live_url"] = u["live_url"]
                        if not p.get("date") and u.get("date"):
                            p["date"] = u["date"]
            formatted_resume["projects"] = raw_proj
        elif user_proj:
            formatted_resume["projects"] = user_proj

        # 7. certifications (preserve credential link)
        raw_certs = formatted_resume.get("certifications") or polished_content.get("certifications")
        user_certs = user_input.get("certifications", [])
        if raw_certs and isinstance(raw_certs, list):
            for idx, c in enumerate(raw_certs):
                if isinstance(c, dict) and idx < len(user_certs):
                    u = user_certs[idx]
                    if isinstance(u, dict) and not c.get("link") and u.get("link"):
                        c["link"] = u["link"]
            formatted_resume["certifications"] = raw_certs
        elif user_certs:
            formatted_resume["certifications"] = user_certs

        # 8. achievements
        if not formatted_resume.get("achievements"):
            formatted_resume["achievements"] = polished_content.get("achievements") or user_input.get("achievements", [])

        # ── STEP 6: Add metadata to the final resume ──────────────────────
        final_resume = {
            "resume_data": formatted_resume,
            "template_id": template_id,
            "section_order": section_order,
            "ats_score": ats_score,
            "ats_suggestions": ats_suggestions,
            "session_id": str(uuid.uuid4()),
            "improvements_made": polished_content.get("improvements_made", [])
        }

        print(f"✅ Formatter Agent done. Template {template_id} structure applied.")

        # ── STEP 7: Return the final state update ─────────────────────────
        return {
            "final_resume": final_resume
        }

    except Exception as e:
        print(f"❌ Formatter Agent error: {e}")
        # On failure: return the polished content as-is without template formatting
        return {
            "final_resume": {
                "resume_data": state.get("polished_content", {}),
                "template_id": state.get("template_id", 7),
                "section_order": TEMPLATE_SECTION_ORDERS.get(state.get("template_id", 7), []),
                "ats_score": state.get("ats_score", 75),
                "ats_suggestions": state.get("ats_suggestions", []),
                "session_id": str(uuid.uuid4()),
                "improvements_made": [],
                "error": f"Formatter error: {str(e)}"
            }
        }
