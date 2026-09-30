# ─────────────────────────────────────────────────────────────────────────────
# agents/research_agent.py
#
# WHAT THIS FILE DOES:
#   This is Agent 1 in the LangGraph pipeline.
#   It researches industry-relevant keywords and skills for the user's job title.
#
# HOW IT WORKS:
#   1. Takes user's job title from the shared state
#   2. Searches pgvector database for similar resumes (RAG step)
#   3. Sends job title + similar resumes to Groq LLM
#   4. LLM returns relevant keywords, skills, action verbs
#   5. Saves results back to shared state
#
# INPUT  (reads from state): user_input, job_title, user_type
# OUTPUT (writes to state):  researched_keywords, similar_resumes
# ─────────────────────────────────────────────────────────────────────────────

import json
import os
from typing import Any

from langchain_core.messages import HumanMessage  # Message format for LLM

from agents.state import ResumeState          # Shared state definition
from agents.llm import get_llm, extract_json
from prompts.research_prompt import RESEARCH_PROMPT  # Prompt template
from vector_store.pgvector_store import search_similar_resumes  # RAG search function


def research_agent(state: ResumeState) -> dict:
    """
    Research Agent — Agent 1 in the LangGraph pipeline.

    Args:
        state: The current shared state (read from here)

    Returns:
        dict: Updated state fields (LangGraph merges this back into state)

    EXPLANATION:
        LangGraph passes the full state to this function.
        We return ONLY the fields we want to UPDATE.
        LangGraph automatically merges our return dict into the existing state.
    """

    print("🔍 Research Agent: Starting research...")

    try:
        # ── STEP 1: Get job title from state ──────────────────────────────
        job_title = state.get("job_title") or "Software Developer"
        # .get() safely gets the value, returns "Software Developer" if None
        user_type = state.get("user_type", "fresher")

        # ── STEP 2: RAG — Search vector database for similar resumes ──────
        print(f"📚 Searching vector DB for resumes similar to: {job_title}")
        similar_resumes = search_similar_resumes(job_title, limit=3)
        # Returns list of similar resume text snippets from pgvector
        # These are used as examples/context for the LLM

        # Convert list to formatted string for the prompt
        similar_resumes_text = "\n\n---\n\n".join(similar_resumes) if similar_resumes else "No similar resumes found."

        # ── STEP 3: Initialize LLM with automatic fallback ────────────────
        llm = get_llm(temperature=0.3, max_tokens=1000)

        # ── STEP 4: Build the prompt with actual values ───────────────────
        filled_prompt = RESEARCH_PROMPT.format(
            job_title=job_title,
            user_type=user_type,
            similar_resumes=similar_resumes_text
        )

        # ── STEP 5: Call the LLM ──────────────────────────────────────────
        print("🤖 Research Agent invoking LLM for keyword research...")
        response = llm.invoke([HumanMessage(content=filled_prompt)])
        research_data = extract_json(response.content)
        # The LLM returns JSON text — json.loads() converts it to a Python dict

        # Combine all keywords into one flat list
        all_keywords = (
            research_data.get("technical_skills", []) +
            research_data.get("ats_keywords", []) +
            research_data.get("action_verbs", [])
        )

        print(f"✅ Research Agent found {len(all_keywords)} keywords")

        # ── STEP 7: Return updated state fields ───────────────────────────
        return {
            "researched_keywords": all_keywords,
            "similar_resumes": similar_resumes,
            # LangGraph will merge these into the existing state
        }

    except Exception as e:
        # If anything goes wrong, save the error to state
        print(f"❌ Research Agent error: {e}")
        return {
            "researched_keywords": [],    # Empty list as fallback
            "similar_resumes": [],
            "error": f"Research Agent failed: {str(e)}"
        }
