# ─────────────────────────────────────────────────────────────────────────────
# main.py
#
# WHAT THIS FILE DOES:
#   The ENTRY POINT of the entire FastAPI backend application.
#   This is the first file that runs when you start the server.
#
# WHAT IT SETS UP:
#   1. Creates the FastAPI app instance
#   2. Configures CORS (allows frontend to call this backend)
#   3. Registers all routers (health, resume)
#   4. Prints startup message
#
# HOW TO RUN:
#   uvicorn main:app --reload --port 8000
#   ↑ "main" = this file, "app" = the FastAPI instance created below
# ─────────────────────────────────────────────────────────────────────────────

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# CORSMiddleware — handles Cross-Origin Resource Sharing
# Without this, the browser blocks requests from frontend (port 3000)
# to backend (port 8000) because they're on different ports = different "origins"

import sys
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

from dotenv import load_dotenv
load_dotenv()   # Load .env variables FIRST before anything else imports os.getenv()

from routers import health, resume  # Import our routers


# ── CREATE THE FASTAPI APP ─────────────────────────────────────────────────
app = FastAPI(
    title="AI Resume Builder API",
    description="Agentic AI Resume Builder using LangGraph + Groq + Supabase pgvector",
    version="1.0.0",
    # These show up in the auto-generated API docs at /docs
)


# ── CONFIGURE CORS ────────────────────────────────────────────────────────
# CORS tells the browser which frontend URLs are allowed to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",            # Local Next.js dev server
        "https://*.vercel.app",             # Any Vercel deployment
        "*",                                # Allow all (for public app)
        # In production, replace "*" with your actual Vercel URL
        # e.g., "https://your-app.vercel.app"
    ],
    allow_credentials=True,     # Allow cookies/auth headers
    allow_methods=["*"],        # Allow GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],        # Allow all headers
)


# ── REGISTER ROUTERS ──────────────────────────────────────────────────────
# include_router() adds all the endpoints from that router to the app
app.include_router(health.router)
# Adds: GET /health

app.include_router(resume.router)
# Adds: POST /api/resume/generate
#       GET  /api/resume/skills
#       GET  /api/resume/{session_id}


# ── ROOT ENDPOINT ─────────────────────────────────────────────────────────
@app.get("/")
async def root():
    """
    Root endpoint — confirms the API is running.
    Visit http://localhost:8000/ to see this.
    """
    return {
        "message": "🚀 AI Resume Builder API is running!",
        "docs": "Visit /docs for interactive API documentation",
        "health": "Visit /health to check server status"
    }


# ── STARTUP EVENT ─────────────────────────────────────────────────────────
@app.on_event("startup")
async def startup_event():
    """
    Runs once when the server starts up.
    Good place to verify connections and log startup info.
    """
    print("\n" + "="*50)
    print("🚀 AI Resume Builder Backend Starting...")
    print("="*50)
    print("📍 API running at:  http://localhost:8000")
    print("📚 API docs at:     http://localhost:8000/docs")
    print("❤️  Health check:   http://localhost:8000/health")
    print("="*50 + "\n")


# ── SHUTDOWN EVENT ────────────────────────────────────────────────────────
@app.on_event("shutdown")
async def shutdown_event():
    """Runs when the server is stopping."""
    print("\n👋 AI Resume Builder Backend shutting down...")
