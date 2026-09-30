# 🚀 ResumeAI — Multi-Agent AI Resume & Cover Letter Builder

> An intelligent, full-stack resume engineering platform powered by **LangGraph multi-agent pipelines**, **Groq LPU LLMs**, and **React-PDF**, designed to optimize resumes for high ATS compatibility and generate matching cover letters in seconds.

---

## 🌟 Key Features

- **Multi-Agent LangGraph Pipeline**:
  - 🔍 **Research Agent**: Analyzes the candidate's target job role and retrieves industry keywords.
  - ✍️ **Writer Agent**: Polishes experience, achievements, and project descriptions using dynamic action verbs and impact metrics.
  - 📊 **ATS Agent**: Evaluates resume compatibility against ATS standards (0–100 score) with full category breakdowns.
  - 📐 **Formatter Agent**: Automatically structures and aligns sections to strictly match the selected template format.
- **Job Description (JD) Keyword Tailoring**: Paste any target job description to dynamically align skills and bullet points to employer keywords.
- **Detailed ATS Score Breakdown**:
  - Keyword Match (out of 30)
  - Section Completeness (out of 25)
  - Content Quality (out of 25)
  - Format & Structure (out of 20)
- **Interactive Re-Score & Edit Feedback Loop**: Click directly on ATS suggestions to jump back to form sections, fix recommendations, and instantly re-score.
- **1-Click AI Cover Letter Generator**: Generates concise, professional 3-paragraph cover letters tailored to the candidate's skills and target company.
- **8 Recruiter-Approved PDF Templates**: Rendered natively via `@react-pdf/renderer` with real-time live preview.
- **High Concurrency & Async Architecture**: FastAPI with AnyIO threadpool offloading prevents blocking during concurrent generations.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Shadcn UI + Lucide Icons
- **Animation**: Framer Motion
- **State Management**: Zustand
- **PDF Engine**: `@react-pdf/renderer`
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Agent Orchestration**: LangGraph + LangChain
- **Primary LLM**: Groq (Qwen 2.5 / Llama 3 models via LPU for ~1-2s inference)
- **Fallback LLM**: Google Gemini 2.5 Flash
- **Data Validation**: Pydantic v2
- **Vector DB / Storage**: Supabase pgvector (with automatic offline fallback caching)

---

## 📁 Project Structure

```text
ai-resume-builder/
├── backend/
│   ├── agents/               # LangGraph agent definitions
│   │   ├── research_agent.py # Role & keyword intelligence
│   │   ├── writer_agent.py   # Bullet point polishing
│   │   ├── ats_agent.py      # Scoring & improvement loop
│   │   ├── formatter_agent.py# Structural formatting
│   │   ├── graph.py          # StateGraph orchestration & pipeline
│   │   └── llm.py            # Unified LLM factory (Groq + Gemini fallback)
│   ├── prompts/              # Optimized prompt templates
│   ├── routers/              # FastAPI route endpoints
│   ├── schemas/              # Pydantic request/response models
│   ├── database/             # Supabase CRUD operations
│   ├── main.py               # FastAPI server entrypoint & CORS
│   └── requirements.txt      # Python dependencies
│
├── frontend/
│   ├── app/
│   │   ├── builder/          # Multi-step resume builder page
│   │   ├── preview/          # PDF viewer, ATS scorecard & cover letter modal
│   │   └── page.tsx          # Landing page
│   ├── components/
│   │   ├── builder/          # Step forms (Basic Info, Education, Skills, Projects, JD)
│   │   ├── preview/          # LivePreview & ATSScoreCard components
│   │   └── templates/        # 8 React-PDF resume templates
│   ├── lib/                  # Zustand store, API client, TypeScript definitions
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ & npm
- Python 3.10+
- Groq API Key ([console.groq.com](https://console.groq.com))
- Google Gemini API Key ([aistudio.google.com](https://aistudio.google.com))

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in `backend/`:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   GROQ_MODEL=qwen/qwen3.8-27b
   GEMINI_API_KEY=your_gemini_api_key_here
   PYTHONUTF8=1
   ```

5. Start the backend server:
   ```bash
   uvicorn main:app --port 8000 --reload
   ```
   API docs will be available at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in `frontend/`:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   ```

4. Start the Next.js development server:
   ```bash
   npm run dev
   ```

5. Open your browser at [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deployment Guide

### Backend on Render.com
1. Create a **New Web Service** pointing to your repository.
2. Set **Root Directory** to `backend`.
3. Set **Runtime** to `Python 3`.
4. **Build Command**: `pip install -r requirements.txt`
5. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables: `GROQ_API_KEY`, `GROQ_MODEL`, `GEMINI_API_KEY`, `PYTHONUTF8`.

### Frontend on Vercel
1. Import repository on Vercel.
2. Set **Root Directory** to `frontend`.
3. Add environment variable:
   - `NEXT_PUBLIC_BACKEND_URL`: `https://your-backend-service.onrender.com`
4. Click **Deploy**.

---

## 📄 License

This project is licensed under the MIT License — feel free to customize and share with peers!
