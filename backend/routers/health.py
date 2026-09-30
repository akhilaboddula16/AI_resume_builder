# ─────────────────────────────────────────────────────────────────────────────
# routers/health.py
#
# WHAT THIS FILE DOES:
#   A simple health check endpoint.
#   Used by Render (hosting) to verify the server is alive.
#   Also useful for debugging — "is the backend running?"
# ─────────────────────────────────────────────────────────────────────────────

from fastapi import APIRouter

# APIRouter = mini-FastAPI app for grouping related endpoints
# We create one router per feature area (health, resume, etc.)
# main.py then includes all routers
router = APIRouter()


@router.get("/health")
async def health_check():
    """
    Health check endpoint.
    Returns: {"status": "ok"} if server is running.
    Test: Open http://localhost:8000/health in browser
    """
    return {"status": "ok", "message": "AI Resume Builder backend is running!"}
