# ─────────────────────────────────────────────────────────────────────────────
# vector_store/pgvector_store.py
#
# WHAT THIS FILE DOES:
#   Handles all vector database operations using pgvector (PostgreSQL extension).
#   This is the RAG (Retrieval Augmented Generation) component.
#
# WHAT IS RAG?
#   RAG = Retrieve → Augment → Generate
#   1. RETRIEVE: Search the vector DB for relevant documents (similar resumes)
#   2. AUGMENT:  Add those documents as context to the LLM prompt
#   3. GENERATE: LLM generates better output using that context
#
# HOW VECTORS WORK:
#   Text → Embedding Model → Vector (array of 768 numbers)
#   "Python Developer" → [0.23, -0.41, 0.89, ...] (768 numbers)
#   Similar texts have vectors that are "close" to each other mathematically.
#   pgvector finds the closest vectors = finds the most similar resumes.
#
# ─────────────────────────────────────────────────────────────────────────────

import os
import psycopg2                    # PostgreSQL driver for Python
from typing import List
from dotenv import load_dotenv

load_dotenv()


_db_connection_attempted = False
_db_available = True

def get_db_connection():
    """
    Creates a direct PostgreSQL connection using psycopg2.
    Used for pgvector operations (not available via Supabase client).

    Returns:
        psycopg2 connection object or None
    """
    global _db_connection_attempted, _db_available

    db_url = os.getenv("DATABASE_URL")
    if not db_url or not _db_available:
        return None

    try:
        conn = psycopg2.connect(db_url, connect_timeout=1)
        _db_available = True
        return conn
    except Exception as e:
        if not _db_connection_attempted:
            print(f"[Vector Store] DB unavailable (RAG skipped): {e}")
            _db_connection_attempted = True
        _db_available = False
        return None


def get_embedding(text: str) -> List[float]:
    """
    Converts text into a vector embedding using Google's embedding model.

    WHY GOOGLE EMBEDDING?
    - Free to use
    - Works well with Gemini/Google ecosystem
    - 768-dimensional vectors (matches our pgvector column size)

    Args:
        text: Any text string to embed

    Returns:
        List of 768 floats representing the text as a vector
    """
    try:
        from google import genai as google_genai
        from google.genai import types

        client = google_genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

        result = client.models.embed_content(
            model="models/gemini-embedding-001",
            contents=text,
            config=types.EmbedContentConfig(output_dimensionality=768)
        )
        return result.embeddings[0].values  # Returns list of 768 floats

    except Exception as e:
        print(f"⚠️ Embedding failed: {e}. Using zero vector as fallback.")
        return [0.0] * 768


def search_similar_resumes(job_title: str, limit: int = 3) -> List[str]:
    """
    RAG Step — Searches pgvector for resume examples similar to the job title.

    HOW IT WORKS:
    1. Convert job_title to a vector embedding
    2. Search resume_embeddings table for nearest vectors
    3. Return the text of the most similar resumes

    Args:
        job_title: e.g., "Python Developer", "Data Scientist"
        limit: How many similar resumes to retrieve (default 3)

    Returns:
        List of resume text snippets (used as context for Writer Agent)
    """
    try:
        conn = get_db_connection()
        if not conn:
            return []

        # Step 1: Convert job title to vector
        query_embedding = get_embedding(job_title)

        # Step 2: Search pgvector with cosine distance
        cursor = conn.cursor()

        # This SQL uses pgvector's <=> operator for cosine distance
        # ORDER BY embedding <=> %s::vector  = find nearest vectors
        cursor.execute("""
            SELECT content
            FROM resume_embeddings
            ORDER BY embedding <=> %s::vector
            LIMIT %s
        """, (query_embedding, limit))
        # %s = parameter placeholder (prevents SQL injection)

        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        # Extract the text content from each row
        similar_resumes = [row[0] for row in rows]
        print(f"Found {len(similar_resumes)} similar resumes for: {job_title}")
        return similar_resumes

    except Exception as e:
        print(f"[Vector Store] Search skipped: {e}")
        return []   # Return empty list — pipeline continues without RAG context


def store_resume_embedding(content: str, job_title: str, metadata: dict = None):
    """
    Stores a resume text + its vector embedding in the database.

    Called by seed_data.py to populate the vector DB with example resumes.

    Args:
        content:    Resume text to store
        job_title:  Job title associated with this resume
        metadata:   Optional extra info (industry, seniority level, etc.)
    """
    try:
        # Convert the resume text to a vector
        embedding = get_embedding(content)

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO resume_embeddings (content, job_title, embedding, metadata)
            VALUES (%s, %s, %s::vector, %s)
        """, (
            content,
            job_title,
            embedding,              # pgvector stores this as a vector column
            metadata or {}
        ))

        conn.commit()   # Actually saves the insert to the DB
        cursor.close()
        conn.close()
        print(f"✅ Stored embedding for: {job_title}")

    except Exception as e:
        print(f"❌ Failed to store embedding: {e}")
