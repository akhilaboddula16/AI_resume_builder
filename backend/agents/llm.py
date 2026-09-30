# ─────────────────────────────────────────────────────────────────────────────
# agents/llm.py — Unified Blazing-Fast LLM Factory & JSON Helper
# ─────────────────────────────────────────────────────────────────────────────

import os
import json
import re
from typing import Optional, Any
from dotenv import load_dotenv

load_dotenv()


def extract_json(text: str) -> Any:
    """
    Safely extracts and parses JSON from model responses,
    bypassing markdown fences (```json ... ```) or conversational commentary.
    """
    if not text:
        return {}
    text = text.strip()
    s = text.find("{")
    e = text.rfind("}")
    if s != -1 and e != -1 and e > s:
        try:
            return json.loads(text[s:e+1])
        except Exception:
            pass
    # Fallback to regex or raw loads
    clean = re.sub(r"^```(?:json)?\s*", "", text, flags=re.MULTILINE)
    clean = re.sub(r"```\s*$", "", clean, flags=re.MULTILINE).strip()
    return json.loads(clean)


def get_llm(temperature: float = 0.2, max_tokens: Optional[int] = 800):
    """
    Returns an ultra-fast LLM runnable using Groq (LPU ~1 second responses).
    Falls back to Gemini only if Groq is unavailable.
    """
    from langchain_groq import ChatGroq
    from langchain_google_genai import ChatGoogleGenerativeAI

    groq_key = os.getenv("GROQ_API_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")

    groq_llm = None
    if groq_key:
        try:
            groq_llm = ChatGroq(
                model=os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b"),
                temperature=temperature,
                max_tokens=max_tokens or 800,
                api_key=groq_key,
            )
        except Exception as e:
            print(f"[LLM Factory] Could not init Groq: {e}")

    gemini_llm = None
    if gemini_key:
        try:
            gemini_llm = ChatGoogleGenerativeAI(
                model="gemini-2.5-flash",
                google_api_key=gemini_key,
                temperature=temperature,
            )
        except Exception as e:
            print(f"[LLM Factory] Could not init Gemini: {e}")

    if groq_llm and gemini_llm:
        # Groq is primary (1-2s response time), fallback to Gemini if rate limited
        return groq_llm.with_fallbacks([gemini_llm])
    elif groq_llm:
        return groq_llm
    elif gemini_llm:
        return gemini_llm
    else:
        raise ValueError("Neither GROQ_API_KEY nor GEMINI_API_KEY is configured.")
