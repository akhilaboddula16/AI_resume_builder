# ─────────────────────────────────────────────────────────────────────────────
# agents/ats_agent.py
#
# WHAT THIS FILE DOES:
#   This is Agent 3 in the LangGraph pipeline.
#   It scores the polished resume for ATS compatibility (0-100).
#   Based on the score, the graph decides: format it OR improve it again.
#
# HOW IT WORKS:
#   1. Reads polished_content from state (written by Writer Agent)
#   2. Sends it to Groq LLM with ATS scoring prompt
#   3. LLM returns score + suggestions
#   4. Sets needs_improvement = True if score < 70 AND count < 2
#      (max 2 improvement attempts to avoid infinite loops)
#
# INPUT  (reads from state): polished_content, researched_keywords, improvement_count
# OUTPUT (writes to state):  ats_score, ats_suggestions, needs_improvement
# ─────────────────────────────────────────────────────────────────────────────

import json
import os

from langchain_core.messages import HumanMessage

from agents.state import ResumeState
from agents.llm import get_llm, extract_json
from prompts.ats_prompt import ATS_PROMPT

# Maximum number of improvement attempts before we accept the resume as-is
MAX_IMPROVEMENT_ATTEMPTS = 1


def ats_agent(state: ResumeState) -> dict:
    """
    ATS Agent — Agent 3 in the LangGraph pipeline.
    Scores the resume and decides if it needs improvement.
    """

    print("📊 ATS Agent: Scoring resume for ATS compatibility...")

    try:
        # ── STEP 1: Get data from state ───────────────────────────────────
        polished_content = state.get("polished_content", {})
        keywords = state.get("researched_keywords", [])
        job_title = state.get("job_title", "Software Developer")
        job_description = state.get("job_description", "")
        improvement_count = state.get("improvement_count", 0)

        # If a JD was provided, add its first 500 chars to keywords context
        jd_snippet = f"\nJOB DESCRIPTION SNIPPET:\n{job_description[:500]}" if job_description else ""

        # ── STEP 2: Initialize LLM with automatic fallback ────────────────
        llm = get_llm(temperature=0.1, max_tokens=600)

        # ── STEP 3: Build and send the ATS scoring prompt ─────────────────
        filled_prompt = ATS_PROMPT.format(
            resume_content=json.dumps(polished_content, indent=2),
            job_title=job_title,
            keywords=", ".join(keywords[:20]) + jd_snippet
        )

        print("🤖 ATS Agent invoking LLM to score ATS compatibility...")
        response = llm.invoke([HumanMessage(content=filled_prompt)])
        ats_result = extract_json(response.content)
        score = ats_result.get("total_score", 75)
        suggestions = ats_result.get("suggestions", [])
        breakdown = ats_result.get("breakdown", {})
        strong_points = ats_result.get("strong_points", [])

        print(f"📈 ATS Score: {score}/100")

        # ── STEP 5: Decide if improvement is needed ───────────────────────
        needs_improvement = (
            score < 65 and
            improvement_count < MAX_IMPROVEMENT_ATTEMPTS
        )

        if needs_improvement:
            print(f"⚠️ Score below 65. Will improve (attempt {improvement_count + 1}/{MAX_IMPROVEMENT_ATTEMPTS})")
        elif score < 65:
            print(f"⚠️ Score still below 65 but max attempts reached. Proceeding to format.")
        else:
            print(f"✅ Score {score} >= 65. Proceeding to format.")

        # ── STEP 6: Return updated state ──────────────────────────────────
        return {
            "ats_score": score,
            "ats_suggestions": suggestions,
            "ats_breakdown": breakdown,
            "ats_strong_points": strong_points,
            "needs_improvement": needs_improvement,
        }

    except Exception as e:
        print(f"❌ ATS Agent error: {e}")
        # On failure: give a passing score so the pipeline continues
        return {
            "ats_score": 75,                # Default passing score
            "ats_suggestions": [],
            "ats_breakdown": {},
            "ats_strong_points": [],
            "needs_improvement": False,     # Don't loop if ATS agent itself fails
            "error": f"ATS Agent failed: {str(e)}"
        }


def check_ats_score(state: ResumeState) -> str:
    """
    CONDITIONAL EDGE FUNCTION for LangGraph.

    LangGraph calls this function after the ATS agent runs.
    Based on the return value, LangGraph decides which node to go to next.

    Returns:
        "improve" → go to Writer Agent again (improve the resume)
        "format"  → go to Formatter Agent (finalize the resume)

    This is how the loop works in LangGraph:
        ats_check → (if "improve") → writer → ats_check → (if "format") → formatter
    """
    needs_improvement = state.get("needs_improvement", False)

    if needs_improvement:
        return "improve"   # Go back to writer agent
    else:
        return "format"    # Go to formatter agent
