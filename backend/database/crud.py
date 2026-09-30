# ─────────────────────────────────────────────────────────────────────────────
# database/crud.py
#
# WHAT THIS FILE DOES:
#   CRUD = Create, Read, Update, Delete
#   This file contains all database operations for the 'resumes' table.
#   The API routers call these functions to save/retrieve resume data.
#
# WHY SEPARATE CRUD FILE?
#   Keeps database logic separate from API logic (clean code principle).
#   If we switch from Supabase to another DB, we only change this file.
# ─────────────────────────────────────────────────────────────────────────────

import uuid
from typing import Optional
from database.supabase_client import supabase


def save_resume(
    session_id: str,
    user_type: str,
    template_id: int,
    raw_input: dict,
    ai_output: dict,
    ats_score: int,
    final_resume: dict
) -> dict:
    """
    Saves a completed resume to the 'resumes' table in Supabase.

    Called after the LangGraph pipeline finishes, to persist the result.

    Args:
        session_id:    Unique ID for this resume session
        user_type:     "fresher" or "experienced"
        template_id:   Which template was used (1-8)
        raw_input:     Original user form data (for reference)
        ai_output:     Polished content from AI agents
        ats_score:     ATS compatibility score (0-100)
        final_resume:  Complete structured resume JSON

    Returns:
        The inserted database record
    """
    if not supabase:
        # If Supabase is not connected (e.g., no .env), skip saving
        print("⚠️ Supabase not connected. Resume not saved to database.")
        return {}

    try:
        # Insert a new row into the 'resumes' table
        result = supabase.table("resumes").insert({
            "id": session_id,
            "user_type": user_type,
            "template_id": template_id,
            "raw_input": raw_input,     # JSONB column — stores Python dict as JSON
            "ai_output": ai_output,
            "ats_score": ats_score,
            "final_resume": final_resume,
        }).execute()
        # .execute() actually sends the query to Supabase

        print(f"✅ Resume saved to database with ID: {session_id}")
        return result.data[0] if result.data else {}
    except Exception as e:
        print(f"⚠️ Failed to save resume to Supabase: {e}")
        return {}


def get_resume_by_session(session_id: str) -> Optional[dict]:
    """
    Retrieves a resume by its session ID.

    Used when user wants to revisit/edit their resume.

    Args:
        session_id: The unique session ID of the resume

    Returns:
        Resume record dict, or None if not found
    """
    if not supabase:
        return None

    result = supabase.table("resumes") \
        .select("*") \
        .eq("id", session_id) \
        .execute()
    # .select("*")      = select all columns
    # .eq("id", value)  = WHERE id = session_id

    if result.data:
        return result.data[0]   # Return first (and only) matching record
    return None
