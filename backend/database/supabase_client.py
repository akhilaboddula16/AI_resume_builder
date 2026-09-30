# ─────────────────────────────────────────────────────────────────────────────
# database/supabase_client.py
#
# WHAT THIS FILE DOES:
#   Sets up the connection to Supabase (our cloud PostgreSQL database).
#   Creates TWO types of connections:
#   1. Supabase Client  — for easy table operations (insert, select, etc.)
#   2. Direct DB URL    — for pgvector (vector similarity search)
#
# WHY TWO CONNECTIONS?
#   - Supabase Client: High-level, easy API (like an ORM)
#   - Direct psycopg2:  Low-level, needed for pgvector SQL queries
#
# PATTERN: Singleton
#   We create the client ONCE here and import it everywhere else.
#   This avoids creating a new connection on every API request.
# ─────────────────────────────────────────────────────────────────────────────

import os
from supabase import create_client, Client
from dotenv import load_dotenv

# load_dotenv() reads the .env file and makes variables available via os.getenv()
# Without this, os.getenv("SUPABASE_URL") would return None
load_dotenv()


def get_supabase_client() -> Client:
    """
    Creates and returns a Supabase client instance.

    The client is used for:
    - Inserting resume records into the 'resumes' table
    - Fetching resumes by session_id
    - Supabase Auth (if we add login later)

    Returns:
        Supabase Client object

    Raises:
        ValueError: If environment variables are not set
    """
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")

    # Validate that environment variables exist
    if not url or not key:
        raise ValueError(
            "SUPABASE_URL and SUPABASE_KEY must be set in .env file. "
            "Copy .env.example to .env and fill in your values."
        )

    # create_client() establishes the connection
    # url  = your Supabase project URL (e.g., https://xxxx.supabase.co)
    # key  = your anon/public key (safe to use in backend)
    client = create_client(url, key)
    return client


def get_database_url() -> str:
    """
    Returns the direct PostgreSQL connection URL for pgvector operations.

    This URL is used by psycopg2 and pgvector library to connect directly
    to the PostgreSQL database for vector similarity searches.

    Returns:
        PostgreSQL connection string
    """
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        raise ValueError(
            "DATABASE_URL must be set in .env file. "
            "Get it from Supabase → Settings → Database → Connection String"
        )
    return db_url


# ── Create singleton instances ─────────────────────────────────────────────
# These are created ONCE when this module is first imported
# All other files import these objects directly

try:
    supabase: Client = get_supabase_client()
    # 'supabase' is now available for import:
    # from database.supabase_client import supabase
    print("✅ Supabase client connected successfully")
except ValueError as e:
    supabase = None
    print(f"⚠️ Supabase not connected: {e}")
    print("   Add SUPABASE_URL and SUPABASE_KEY to your .env file")
