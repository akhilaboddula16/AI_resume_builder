# ─────────────────────────────────────────────────────────────────────────────
# agents/state.py
#
# WHAT THIS FILE DOES:
#   Defines the "shared state" object that ALL LangGraph agents read from
#   and write to. Think of it as a shared whiteboard all agents can see.
#
# HOW LANGGRAPH STATE WORKS:
#   - When Agent 1 (Research) finishes, it WRITES its results to state
#   - Agent 2 (Writer) READS those results from the same state object
#   - Every agent gets the FULL state as input and returns UPDATED state
#
# WHY TypedDict?
#   LangGraph requires state to be a TypedDict (a typed Python dictionary).
#   This gives us type safety + LangGraph knows what fields exist.
# ─────────────────────────────────────────────────────────────────────────────

from typing import TypedDict, Optional, List, Dict, Any
# TypedDict — creates a dictionary with specific typed keys
# Optional   — field can be None (not yet filled by any agent)
# List       — a list of items
# Dict       — a dictionary
# Any        — any type (used for flexible JSON-like data)


class ResumeState(TypedDict):
    """
    The shared state object that flows through the entire LangGraph pipeline.

    FLOW:
    START
      → research_agent  fills: researched_keywords, similar_resumes
      → writer_agent    fills: polished_content
      → ats_agent       fills: ats_score, ats_suggestions, needs_improvement
      → (if needs_improvement=True) → writer_agent again (loop)
      → formatter_agent fills: final_resume
    END
    """

    # ── INPUT DATA (filled when graph starts) ─────────────────────
    user_input: Dict[str, Any]
    # The complete raw form data from the user.
    # Contains basic_info, education, experience, skills, projects, etc.
    # Set once at the beginning, never changed.

    user_type: str
    # "fresher" or "experienced"
    # Agents use this to adjust their behavior.

    has_internship: bool
    # True if the fresher has internship experience.
    # Writer Agent uses this to label the section correctly.

    template_id: int
    # Which template the user selected (1-8).
    # Formatter Agent uses this to structure data for that template.

    job_title: Optional[str]
    # The user's target job title (e.g., "Python Developer").
    # Research Agent uses this to find relevant keywords.
    # Can be None if user didn't provide one.

    job_description: Optional[str]
    # Optional: the full job description the user pasted.
    # ATS Agent and Writer Agent use this for targeted keyword tailoring.

    # ── RESEARCH AGENT OUTPUT ─────────────────────────────────────
    researched_keywords: Optional[List[str]]
    # Keywords/skills found by Research Agent from vector DB and LLM.
    # Example: ["REST API", "Docker", "PostgreSQL", "Agile"]
    # Used by Writer Agent to weave keywords into bullet points.

    similar_resumes: Optional[List[str]]
    # Sample resume snippets retrieved from pgvector database.
    # Used by Writer Agent as reference/examples.

    # ── WRITER AGENT OUTPUT ───────────────────────────────────────
    polished_content: Optional[Dict[str, Any]]
    # Complete resume data after AI improvement.
    # Same structure as user_input but with polished descriptions.
    # Example: experience bullets rewritten with action verbs + keywords.

    improvement_count: int
    # How many times the Writer Agent has tried to improve the resume.
    # Used to prevent infinite loops (max 2 improvement attempts).

    # ── ATS AGENT OUTPUT ──────────────────────────────────────────
    ats_score: Optional[int]
    # ATS compatibility score from 0 to 100.
    # >= 70 = passes → go to Formatter
    # <  70 = fails  → go back to Writer (improve again)

    ats_suggestions: Optional[List[str]]
    # List of suggestions to improve ATS score.
    # Example: ["Add more action verbs", "Include Docker keyword"]

    ats_breakdown: Optional[Dict[str, Any]]
    # Score breakdown by category:
    # { keyword_presence: 25, section_completeness: 22, content_quality: 20, format_compatibility: 15 }

    ats_strong_points: Optional[List[str]]
    # What the resume is already doing well.
    # Example: ["Good use of technical keywords", "Education section is complete"]

    needs_improvement: Optional[bool]
    # True if ats_score < 70 AND improvement_count < 2.
    # Used by the conditional edge to decide: improve or format.

    # ── FORMATTER AGENT OUTPUT (FINAL) ────────────────────────────
    final_resume: Optional[Dict[str, Any]]
    # The completely structured resume JSON ready for the frontend.
    # Organized in the correct section order for the chosen template.

    # ── ERROR TRACKING ────────────────────────────────────────────
    error: Optional[str]
    # If any agent fails, the error message is stored here.
    # Frontend shows a user-friendly error message.
