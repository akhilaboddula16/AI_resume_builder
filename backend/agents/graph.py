# ─────────────────────────────────────────────────────────────────────────────
# agents/graph.py
#
# WHAT THIS FILE DOES:
#   This is the HEART of the Agentic AI system.
#   It defines the LangGraph workflow — how all 4 agents are connected,
#   in what order they run, and what happens at each decision point.
#
# HOW LANGGRAPH WORKS:
#   Think of it as a flowchart made of code:
#   - NODES = the agents (each does one job)
#   - EDGES = arrows connecting nodes (what runs next)
#   - CONDITIONAL EDGES = "if-else" arrows (based on a decision function)
#   - STATE = shared data flowing through all nodes
#
# THE GRAPH FLOW:
#   START
#     ↓
#   research_node   (Agent 1 — find keywords)
#     ↓
#   writer_node     (Agent 2 — write content)
#     ↓
#   ats_node        (Agent 3 — score resume)
#     ↓
#   check_ats_score() → "improve" or "format"
#     ↓ (improve)         ↓ (format)
#   writer_node     formatter_node
#     ↓                   ↓
#   ats_node             END
#     ↓
#   (loop max 2 times)
# ─────────────────────────────────────────────────────────────────────────────

from langgraph.graph import StateGraph, END
# StateGraph — the main class to build a LangGraph graph
# END        — special constant that means "this is the last node, stop here"

from agents.state import ResumeState            # Our shared state definition
from agents.research_agent import research_agent    # Agent 1
from agents.writer_agent import writer_agent        # Agent 2
from agents.ats_agent import ats_agent, check_ats_score  # Agent 3 + decision function
from agents.formatter_agent import formatter_agent  # Agent 4


def build_resume_graph():
    """
    Builds and compiles the LangGraph workflow.

    Returns:
        Compiled LangGraph app that can be invoked with initial state.

    USAGE:
        graph = build_resume_graph()
        result = graph.invoke(initial_state)
        final_resume = result["final_resume"]
    """

    # ── STEP 1: Create the graph with our state type ──────────────────────
    graph = StateGraph(ResumeState)
    # StateGraph(ResumeState) means:
    # "Create a graph where all nodes share data using the ResumeState format"

    # ── STEP 2: Add nodes (each agent becomes a node) ─────────────────────
    graph.add_node("research", research_agent)
    # "research" = the name of this node (used when adding edges)
    # research_agent = the function to call when this node runs

    graph.add_node("writer", writer_agent)
    # Writer Agent — also used as the "improve" node when ATS fails

    graph.add_node("ats_check", ats_agent)
    # ATS Agent — scores the resume

    graph.add_node("formatter", formatter_agent)
    # Formatter Agent — final node that structures the output

    # ── STEP 3: Set the entry point (which node runs first) ───────────────
    graph.set_entry_point("research")
    # When we call graph.invoke(), it always starts at "research" node

    # ── STEP 4: Add simple edges (straight arrows) ────────────────────────
    graph.add_edge("research", "writer")
    # After research finishes → always go to writer

    graph.add_edge("writer", "ats_check")
    # After writer finishes → always go to ats_check

    # ── STEP 5: Add CONDITIONAL edge (the decision point / if-else) ───────
    graph.add_conditional_edges(
        "ats_check",        # FROM this node
        check_ats_score,    # CALL this function to decide where to go
        {
            "improve": "writer",       # If function returns "improve" → go to writer
            "format": "formatter",     # If function returns "format"  → go to formatter
        }
    )
    # This is how the improvement LOOP works:
    # ats_check → check_ats_score() returns "improve" → writer → ats_check → ...
    # ats_check → check_ats_score() returns "format"  → formatter → END

    # ── STEP 6: Add final edge to END ─────────────────────────────────────
    graph.add_edge("formatter", END)
    # After formatter finishes → pipeline is complete, return final state

    # ── STEP 7: Compile the graph ─────────────────────────────────────────
    compiled_graph = graph.compile()
    # .compile() validates the graph (checks for disconnected nodes, etc.)
    # and returns an executable object

    print("✅ LangGraph pipeline compiled successfully")
    return compiled_graph


# ── CREATE THE GRAPH ONCE (singleton pattern) ─────────────────────────────
# We create it once here so it doesn't rebuild on every API call
# It's imported by routers/resume.py and used there

resume_graph = build_resume_graph()


def run_resume_pipeline(initial_data: dict) -> dict:
    """
    Main function called by the API router to run the full pipeline.
    """
    # ── Build the initial state ────────────────────────────────────────────
    # All optional fields start as None — agents will fill them in
    initial_state: ResumeState = {
        "user_input": initial_data.get("user_input", {}),
        "user_type": initial_data.get("user_type", "fresher"),
        "has_internship": initial_data.get("has_internship", False),
        "template_id": initial_data.get("template_id", 7),
        "job_title": initial_data.get("job_title"),
        "job_description": initial_data.get("job_description", ""),
        "researched_keywords": None,
        "similar_resumes": None,
        "polished_content": None,
        "improvement_count": 0,
        "ats_score": None,
        "ats_suggestions": None,
        "ats_breakdown": None,
        "ats_strong_points": None,
        "needs_improvement": None,
        "final_resume": None,
        "error": None,
    }

    print(f"🚀 Starting LangGraph pipeline for {initial_state['user_type']}...")

    # ── Run the graph synchronously ────────────────────────────────────────
    final_state = resume_graph.invoke(initial_state)

    print("🏁 LangGraph pipeline complete!")
    return final_state
