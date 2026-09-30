# ─────────────────────────────────────────────────────────────────────────────
# agents/writer_agent.py
#
# WHAT THIS FILE DOES:
#   This is Agent 2 in the LangGraph pipeline.
#   It takes the user's raw form inputs and rewrites them into
#   professional, ATS-optimized resume content.
#
# HOW IT WORKS:
#   1. Reads user's raw input + keywords from Research Agent
#   2. Sends everything to Groq LLM with the Writer Prompt
#   3. LLM rewrites experience bullets, project descriptions, objective
#   4. Saves polished content back to state
#
# NOTE: This agent runs TWICE if ATS score is low:
#   - First run: initial writing (improvement_count = 0 → 1)
#   - Second run: targeted improvement based on ATS feedback (count = 1 → 2)
#
# INPUT  (reads from state): user_input, researched_keywords, ats_suggestions (on retry)
# OUTPUT (writes to state):  polished_content, improvement_count
# ─────────────────────────────────────────────────────────────────────────────

import json
import os

from langchain_core.messages import HumanMessage

from agents.state import ResumeState
from agents.llm import get_llm, extract_json
from prompts.writer_prompt import WRITER_PROMPT, IMPROVEMENT_PROMPT
from prompts.formatter_prompt import TEMPLATE_RULES


def writer_agent(state: ResumeState) -> dict:
    """
    Writer Agent — Agent 2 (and sometimes Agent 2b on retry).

    Determines automatically whether this is:
    - First run: uses WRITER_PROMPT (full rewrite)
    - Retry run: uses IMPROVEMENT_PROMPT (targeted fixes based on ATS feedback)
    """

    improvement_count = state.get("improvement_count", 0)
    is_retry = improvement_count > 0  # True if this is a retry after low ATS score

    if is_retry:
        print(f"✍️ Writer Agent: Improving resume (attempt {improvement_count + 1})...")
    else:
        print("✍️ Writer Agent: Writing polished resume content...")

    try:
        # ── STEP 1: Get data from state ───────────────────────────────────
        user_input = state["user_input"]                          # Raw form data
        user_type = state.get("user_type", "fresher")
        has_internship = state.get("has_internship", False)
        job_title = state.get("job_title", "Software Developer")
        template_id = state.get("template_id", 7)
        keywords = state.get("researched_keywords", [])

        # ── STEP 2: Initialize LLM with automatic fallback ────────────────
        llm = get_llm(temperature=0.3, max_tokens=1500)

        # ── STEP 3: Choose prompt based on whether it's a retry ───────────
        if is_retry:
            # RETRY: Fix specific ATS issues
            ats_score = state.get("ats_score", 0)
            ats_suggestions = state.get("ats_suggestions", [])
            current_content = state.get("polished_content", user_input)

            filled_prompt = IMPROVEMENT_PROMPT.format(
                ats_score=ats_score,
                ats_suggestions="\n".join(f"- {s}" for s in ats_suggestions),
                current_content=json.dumps(current_content, indent=2),
                keywords=", ".join(keywords[:10])  # Top 10 keywords
            )
        else:
            # FIRST RUN: Full rewrite
            has_internship_text = "with internship experience" if has_internship else "no work experience"
            template_style = TEMPLATE_RULES.get(template_id, "Professional style")

            filled_prompt = WRITER_PROMPT.format(
                user_type=user_type,
                has_internship_text=has_internship_text,
                job_title=job_title,
                template_style=template_style,
                raw_input=json.dumps(user_input, indent=2),
                keywords=", ".join(keywords[:15])  # Top 15 keywords
            )

        # ── STEP 4: Call the LLM ──────────────────────────────────────────
        print("🤖 Writer Agent invoking LLM to write resume content...")
        response = llm.invoke([HumanMessage(content=filled_prompt)])
        polished_content = extract_json(response.content)

        print(f"✅ Writer Agent finished. Improvement count: {improvement_count + 1}")

        # ── STEP 6: Return updated state fields ───────────────────────────
        return {
            "polished_content": polished_content,
            "improvement_count": improvement_count + 1,
            # Reset ATS fields so ATS agent runs fresh on the improved content
            "ats_score": None,
            "ats_suggestions": None,
            "needs_improvement": None,
        }

    except Exception as e:
        print(f"❌ Writer Agent error: {e}")
        # On failure, pass through the original user input unchanged
        return {
            "polished_content": state.get("user_input", {}),
            "improvement_count": improvement_count + 1,
            "error": f"Writer Agent failed: {str(e)}"
        }
