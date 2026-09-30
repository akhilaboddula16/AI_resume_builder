// ─────────────────────────────────────────────────────────────────────────────
// lib/types.ts
//
// WHAT THIS FILE DOES:
//   Defines TypeScript types and interfaces for the entire frontend.
//   Every component imports types from here — single source of truth.
//
// WHY TYPESCRIPT TYPES?
//   TypeScript catches errors BEFORE runtime.
//   If you pass wrong data to a component, TypeScript shows a red underline.
//   This prevents bugs like passing a string where a number is expected.
// ─────────────────────────────────────────────────────────────────────────────

// ── USER TYPE ──────────────────────────────────────────────────────────────

export type UserType = "fresher" | "experienced"
// "fresher"    = student/new graduate
// "experienced" = working professional

// ── TEMPLATE TYPE ─────────────────────────────────────────────────────────

export type TemplateId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
// Only values 1-8 are valid template IDs

export interface TemplateInfo {
  id: TemplateId
  name: string          // e.g., "Alex Webb"
  style: string         // e.g., "Modern AI/ML"
  bestFor: string       // e.g., "Tech/AI roles"
  font: "serif" | "sans-serif"
  isDefault: boolean    // Only Template 7 is true
}

// ── RESUME DATA TYPES ─────────────────────────────────────────────────────

export interface BasicInfo {
  name: string
  email: string
  phone: string
  linkedin?: string     // ? means optional
  github?: string
  portfolio?: string
  city?: string
  state?: string
  address?: string
}

export interface Education {
  degree: string            // e.g., "B.Tech", "12th", "10th"
  institution: string
  boardUniversity?: string  // e.g., "CBSE" — for 10th/12th
  yearFrom?: string
  yearTo?: string           // "Present" or year
  cgpa?: string
  percentage?: string
  department?: string
  location?: string
}

export interface Experience {
  company: string
  jobTitle: string
  location?: string
  fromDate: string
  toDate: string
  description: string   // Raw text — AI improves this
}

export interface Internship {
  company: string
  role: string
  duration: string      // e.g., "3 months"
  location?: string
  description: string
}

export interface Project {
  name: string
  techStack?: string
  githubUrl?: string
  liveUrl?: string
  date?: string
  description: string
}

export interface Certification {
  name: string
  platform?: string
  year?: string
  link?: string
}

// ── COMPLETE RESUME DATA ──────────────────────────────────────────────────

export interface ResumeData {
  // User settings
  userType: UserType
  hasInternship: boolean
  templateId: TemplateId
  jobTitle?: string

  // Resume sections
  basicInfo: BasicInfo
  education: Education[]          // Array — user can add multiple
  experience: Experience[]        // For experienced users
  internship: Internship[]        // For freshers with internship
  skills: string[]                // Array of skill strings
  projects: Project[]
  certifications: Certification[]
  careerObjective?: string
  achievements?: string[]
  personalSkills?: string[]       // Soft skills (Template 3 style)
  jobDescription?: string         // Optional JD for keyword tailoring
}

// ── AI RESPONSE TYPES ─────────────────────────────────────────────────────

export interface ATSResult {
  score: number           // 0-100
  grade: string           // "Excellent" | "Good" | "Needs Work" | "Poor"
  suggestions: string[]
}

export interface ATSBreakdown {
  keyword_presence: number      // out of 30
  section_completeness: number  // out of 25
  content_quality: number       // out of 25
  format_compatibility: number  // out of 20
}

export interface GenerateResumeResponse {
  sessionId: string
  polishedResume: Record<string, unknown>
  atsScore: number
  atsGrade: string
  atsSuggestions: string[]
  aiImprovements: string[]
  atsBreakdown?: ATSBreakdown
  atsStrongPoints?: string[]
}

// ── FORM STEP TYPE ────────────────────────────────────────────────────────

export type BuilderStep =
  | "template"        // Step 1: Choose template
  | "basic-info"      // Step 2: Name, email, phone
  | "education"       // Step 3: Education details
  | "experience"      // Step 4a: Work experience (experienced)
  | "internship"      // Step 4b: Internship (fresher with exp)
  | "skills"          // Step 5: Skills
  | "projects"        // Step 6: Projects
  | "certifications"  // Step 7: Certifications + optional
  | "job-description" // Step 8: Paste job description (optional JD tailoring)
  | "generating"      // Step 9: AI processing screen
  | "preview"         // Step 10: Final preview + download

export const STEP_ORDER_FRESHER_NO_INTERNSHIP: BuilderStep[] = [
  "template", "basic-info", "education", "skills", "projects", "certifications", "job-description", "generating"
]

export const STEP_ORDER_FRESHER_WITH_INTERNSHIP: BuilderStep[] = [
  "template", "basic-info", "education", "internship", "skills", "projects", "certifications", "job-description", "generating"
]

export const STEP_ORDER_EXPERIENCED: BuilderStep[] = [
  "template", "basic-info", "education", "experience", "skills", "projects", "certifications", "job-description", "generating"
]
