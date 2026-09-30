# ─────────────────────────────────────────────────────────────────────────────
# vector_store/seed_data.py
#
# WHAT THIS FILE DOES:
#   Seeds the pgvector database with example resume content.
#   This is a ONE-TIME SETUP script — run it once to populate the vector DB.
#   After seeding, the Research Agent can use RAG to find similar examples.
#
# HOW TO RUN:
#   python vector_store/seed_data.py
#
# WHAT IT DOES:
#   Takes 20+ sample resume bullet points for different job roles,
#   converts each to a vector embedding, and stores in resume_embeddings table.
# ─────────────────────────────────────────────────────────────────────────────

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from vector_store.pgvector_store import store_resume_embedding

# ── SAMPLE RESUME SNIPPETS FOR RAG ────────────────────────────────────────
# These are high-quality resume examples for common job roles.
# The Research Agent retrieves these as context to guide the Writer Agent.

SEED_DATA = [
    # ── Python / Backend Developer ──────────────────────────────────────
    {
        "job_title": "Python Developer",
        "content": """
        - Developed RESTful APIs using FastAPI and Django, serving 10,000+ daily requests
        - Implemented PostgreSQL database schemas and optimized queries, reducing load time by 40%
        - Built automated CI/CD pipelines using GitHub Actions and Docker
        - Collaborated with frontend team to integrate React.js with backend services
        - Wrote unit tests using pytest, achieving 90% code coverage
        """
    },
    {
        "job_title": "Python Developer",
        "content": """
        - Designed and deployed microservices architecture using FastAPI and Docker
        - Integrated third-party APIs (Stripe, Twilio, AWS S3) for payment and notification services
        - Implemented JWT-based authentication and role-based access control
        - Optimized database performance using Redis caching, reducing API response time by 60%
        - Mentored 2 junior developers on Python best practices and code review
        """
    },

    # ── Data Scientist / ML Engineer ────────────────────────────────────
    {
        "job_title": "Data Scientist",
        "content": """
        - Built machine learning models using Python, scikit-learn, and TensorFlow achieving 94% accuracy
        - Performed exploratory data analysis on 1M+ row datasets using Pandas and NumPy
        - Created interactive dashboards using Tableau and Power BI for business stakeholders
        - Deployed ML models to production using Flask APIs and Docker containers
        - Reduced customer churn by 25% using predictive modeling and A/B testing
        """
    },
    {
        "job_title": "Machine Learning Engineer",
        "content": """
        - Developed and deployed NLP models for sentiment analysis using BERT and Hugging Face
        - Built data pipelines using Apache Spark and Airflow processing 5TB daily
        - Implemented computer vision models using PyTorch for object detection (mAP: 0.87)
        - Optimized model inference time by 3x using ONNX quantization
        - Published research paper on transformer-based text classification
        """
    },

    # ── Gen AI / LLM Developer ───────────────────────────────────────────
    {
        "job_title": "Generative AI Developer",
        "content": """
        - Built RAG-based chatbot using LangChain, ChromaDB, and OpenAI GPT-4 for enterprise knowledge base
        - Implemented multi-agent AI workflows using LangGraph for automated document processing
        - Fine-tuned LLaMA 2 model on custom dataset using LoRA, achieving 15% improvement in task accuracy
        - Developed prompt engineering strategies reducing hallucination rate by 40%
        - Integrated AI features into production Next.js application serving 5,000+ users
        """
    },
    {
        "job_title": "AI Engineer",
        "content": """
        - Designed agentic AI pipeline using CrewAI and Groq for automated resume generation
        - Built vector search system using pgvector and Supabase for semantic document retrieval
        - Implemented streaming LLM responses using FastAPI and WebSockets
        - Created evaluation framework for LLM outputs using RAGAS metrics
        - Deployed AI microservices on AWS Lambda with 99.9% uptime
        """
    },

    # ── Frontend / Full Stack Developer ─────────────────────────────────
    {
        "job_title": "Frontend Developer",
        "content": """
        - Built responsive web applications using React.js, Next.js, and TypeScript
        - Implemented pixel-perfect UI designs using Tailwind CSS and shadcn/ui components
        - Optimized web performance achieving 95+ Lighthouse scores across all metrics
        - Integrated REST APIs and GraphQL endpoints with React Query for state management
        - Reduced bundle size by 35% through code splitting and lazy loading
        """
    },
    {
        "job_title": "Full Stack Developer",
        "content": """
        - Developed full-stack web application using Next.js, Node.js, and PostgreSQL
        - Implemented real-time features using WebSockets and Socket.io
        - Built authentication system using NextAuth.js with OAuth providers
        - Deployed application on Vercel with CI/CD pipeline reducing deployment time by 50%
        - Led team of 3 developers using Agile/Scrum methodology
        """
    },

    # ── DevOps / Cloud Engineer ──────────────────────────────────────────
    {
        "job_title": "DevOps Engineer",
        "content": """
        - Designed and maintained Kubernetes clusters on AWS EKS handling 100k+ daily requests
        - Implemented Infrastructure as Code using Terraform reducing provisioning time by 70%
        - Set up monitoring and alerting using Prometheus, Grafana, and PagerDuty
        - Built Docker-based CI/CD pipelines using Jenkins reducing deployment time by 60%
        - Achieved 99.95% uptime SLA through automated failover and health checks
        """
    },

    # ── Fresher / Entry Level ────────────────────────────────────────────
    {
        "job_title": "Software Developer Fresher",
        "content": """
        - Developed Weather Forecast web app using Python Flask and OpenWeatherMap API
        - Built E-commerce platform with cart functionality using React.js and Node.js
        - Implemented RESTful API for todo application with CRUD operations using FastAPI
        - Completed 3-month internship at TechCorp building internal HR management tool
        - Contributed to 2 open-source projects with 50+ GitHub stars
        """
    },
    {
        "job_title": "Python Intern",
        "content": """
        - Automated data extraction from 500+ PDF reports saving 10 hours of manual work weekly
        - Built web scraper using BeautifulSoup and Selenium to collect competitor pricing data
        - Created data visualization dashboard using Matplotlib and Streamlit for sales team
        - Assisted senior developers in debugging and testing REST APIs
        - Documented codebase improving onboarding time for new team members by 30%
        """
    },
]


def seed_vector_database():
    """
    Runs the seeding process — inserts all sample data into pgvector.

    Call this once after setting up the database:
        python vector_store/seed_data.py
    """
    print(f"🌱 Starting database seeding with {len(SEED_DATA)} entries...")
    print("   This may take a minute (embedding each entry)...")

    success_count = 0
    for i, item in enumerate(SEED_DATA):
        try:
            store_resume_embedding(
                content=item["content"],
                job_title=item["job_title"],
                metadata={"source": "seed_data", "index": i}
            )
            success_count += 1
            print(f"   [{i+1}/{len(SEED_DATA)}] ✅ {item['job_title']}")
        except Exception as e:
            print(f"   [{i+1}/{len(SEED_DATA)}] ❌ Failed: {e}")

    print(f"\n🎉 Seeding complete! {success_count}/{len(SEED_DATA)} entries stored.")
    print("   Your RAG system is now ready to retrieve relevant examples.")


# Run when this script is called directly
if __name__ == "__main__":
    seed_vector_database()
