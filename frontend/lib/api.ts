// ─────────────────────────────────────────────────────────────────────────────
// lib/api.ts
//
// WHAT THIS FILE DOES:
//   All API call functions that talk to the FastAPI backend.
//   Every component that needs backend data imports functions from here.
//
// WHY A SEPARATE API FILE?
//   - Single place to change the backend URL
//   - Reusable across multiple components
//   - Handles errors consistently
//   - Easy to mock for testing
//
// AXIOS vs FETCH:
//   Both do HTTP requests. Axios automatically:
//   - Parses JSON responses
//   - Throws errors for non-2xx status codes
//   - Handles request/response interceptors
// ─────────────────────────────────────────────────────────────────────────────

import axios from "axios"
import { ResumeData, GenerateResumeResponse } from "./types"

// ── BASE URL SETUP ────────────────────────────────────────────────────────
// process.env.NEXT_PUBLIC_BACKEND_URL reads from .env.local file
// NEXT_PUBLIC_ prefix = available in browser (not just server)
// Falls back to localhost:8000 if env var is not set

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",   // Tell server we're sending JSON
  },
  timeout: 180000,   // 3 minutes timeout (AI pipeline safety cushion)
})


// ─────────────────────────────────────────────────────────────────────────────
// FUNCTION 1: Generate Resume
// ─────────────────────────────────────────────────────────────────────────────

export async function generateResume(
  resumeData: Partial<ResumeData>
): Promise<GenerateResumeResponse> {
  /**
   * Sends all resume form data to the backend and triggers the LangGraph pipeline.
   *
   * WHAT HAPPENS:
   * 1. We format the data to match backend's ResumeRequest schema
   * 2. POST request sent to /api/resume/generate
   * 3. Backend runs 4 AI agents (takes ~15-30 seconds)
   * 4. Returns polished resume + ATS score
   *
   * @param resumeData - Complete resume form data from Zustand store
   * @returns Polished resume + ATS result
   */

  // Format data to match Python backend's expected shape
  // Python uses snake_case, TypeScript uses camelCase — convert here
  const payload = {
    user_type: resumeData.userType || "fresher",
    has_internship: Boolean(resumeData.hasInternship),
    template_id: resumeData.templateId || 7,
    job_title: resumeData.jobTitle || "",
    basic_info: formatBasicInfo(resumeData.basicInfo),
    education: formatEducation(resumeData.education),
    experience: formatExperience(resumeData.experience),
    internship: formatInternship(resumeData.internship),
    skills: resumeData.skills || [],
    projects: formatProjects(resumeData.projects),
    certifications: formatCertifications(resumeData.certifications),
    career_objective: resumeData.careerObjective || "",
    achievements: resumeData.achievements || [],
    personal_skills: resumeData.personalSkills || [],
    job_description: resumeData.jobDescription || "",   // JD tailoring field
  }

  const response = await apiClient.post("/api/resume/generate", payload)
  // apiClient.post() sends a POST request with the payload as JSON body

  // Convert response back to camelCase for TypeScript
  return {
    sessionId: response.data.session_id,
    polishedResume: response.data.polished_resume,
    atsScore: response.data.ats_score,
    atsGrade: response.data.ats_grade,
    atsSuggestions: response.data.ats_suggestions,
    aiImprovements: response.data.ai_improvements,
    atsBreakdown: response.data.ats_breakdown,
    atsStrongPoints: response.data.ats_strong_points,
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// FUNCTION 2: Get Suggested Skills
// ─────────────────────────────────────────────────────────────────────────────

export async function getSuggestedSkills(
  jobTitle: string,
  userType: string = "fresher"
): Promise<{ skills: string[]; categories: Record<string, string[]> }> {
  /**
   * Asks AI to suggest relevant skills for a job title.
   * Called when user types their job title in the Skills form step.
   *
   * @param jobTitle - e.g., "Python Developer"
   * @param userType - "fresher" or "experienced"
   * @returns skills list + grouped by category
   */

  const response = await apiClient.get("/api/resume/skills", {
    params: {              // params = URL query parameters
      job_title: jobTitle, // Becomes: /api/resume/skills?job_title=Python+Developer
      user_type: userType,
    },
  })

  return {
    skills: response.data.skills || [],
    categories: response.data.categories || {},
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// FUNCTION 3: Health Check
// ─────────────────────────────────────────────────────────────────────────────

export async function checkBackendHealth(): Promise<boolean> {
  /**
   * Checks if the backend is running.
   * Called on app load to show connection status.
   *
   * @returns true if backend is up, false otherwise
   */
  try {
    await apiClient.get("/health")
    return true
  } catch {
    return false   // Backend not reachable
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// FUNCTION 4: Generate Cover Letter
// ─────────────────────────────────────────────────────────────────────────────

export async function generateCoverLetter(params: {
  name: string
  jobTitle: string
  company?: string
  skills?: string[]
  experienceSummary?: string
}): Promise<{ coverLetter: string; candidateName: string; jobTitle: string }> {
  /**
   * Generates a professional cover letter from the user's resume data.
   * Called from the preview page when user clicks "Generate Cover Letter".
   *
   * @param params - Name, job title, company, skills
   * @returns Cover letter text
   */
  const response = await apiClient.post("/api/resume/cover-letter", {
    name: params.name,
    job_title: params.jobTitle,
    company: params.company || "the company",
    skills: params.skills || [],
    experience_summary: params.experienceSummary || "",
  })

  return {
    coverLetter: response.data.cover_letter,
    candidateName: response.data.candidate_name,
    jobTitle: response.data.job_title,
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function formatBasicInfo(basicInfo: ResumeData["basicInfo"] | undefined) {
  if (!basicInfo) return { name: "", email: "", phone: "" }

  // Convert camelCase keys to snake_case for Python backend
  return {
    name: basicInfo.name || "",
    email: basicInfo.email || "",
    phone: basicInfo.phone || "",
    linkedin: basicInfo.linkedin || null,
    github: basicInfo.github || null,
    portfolio: basicInfo.portfolio || null,
    city: basicInfo.city || null,
    state: basicInfo.state || null,
    address: basicInfo.address || null,
  }
}

function formatEducation(items?: ResumeData["education"]) {
  if (!items) return []
  return items.map((e) => ({
    degree: e.degree || "",
    institution: e.institution || "",
    board_university: e.boardUniversity || null,
    year_from: e.yearFrom || null,
    year_to: e.yearTo || null,
    cgpa: e.cgpa || null,
    percentage: e.percentage || null,
    department: e.department || null,
    location: e.location || null,
  }))
}

function formatExperience(items?: ResumeData["experience"]) {
  if (!items) return []
  return items.map((e) => ({
    company: e.company || "",
    job_title: e.jobTitle || "",
    location: e.location || null,
    from_date: e.fromDate || "",
    to_date: e.toDate || "",
    description: e.description || "",
  }))
}

function formatInternship(items?: ResumeData["internship"]) {
  if (!items) return []
  return items.map((e) => ({
    company: e.company || "",
    role: e.role || "",
    duration: e.duration || "",
    location: e.location || null,
    description: e.description || "",
  }))
}

function formatProjects(items?: ResumeData["projects"]) {
  if (!items) return []
  return items.map((p) => ({
    name: p.name || "",
    tech_stack: p.techStack || null,
    github_url: p.githubUrl || null,
    live_url: p.liveUrl || null,
    date: p.date || null,
    description: p.description || "",
  }))
}

function formatCertifications(items?: ResumeData["certifications"]) {
  if (!items) return []
  return items.map((c) => ({
    name: c.name || "",
    platform: c.platform || null,
    year: c.year || null,
    link: c.link || null,
  }))
}
