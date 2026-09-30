// ─────────────────────────────────────────────────────────────────────────────
// lib/store.ts
//
// WHAT THIS FILE DOES:
//   Global state management using Zustand.
//   Stores ALL data that needs to be shared between pages and components.
//
// WHY ZUSTAND?
//   Without global state, you'd have to pass data as props through
//   many component levels (called "prop drilling") — very messy.
//   Zustand creates a global "store" any component can read from / write to.
//
// HOW IT WORKS:
//   1. Define state shape + update functions (called "actions") in create()
//   2. Any component calls useResumeStore() to read or update state
//   3. When state changes, only components using that piece of state re-render
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand"
import {
  ResumeData,
  UserType,
  TemplateId,
  BuilderStep,
  BasicInfo,
  Education,
  Experience,
  Internship,
  Project,
  Certification,
  GenerateResumeResponse,
  STEP_ORDER_FRESHER_NO_INTERNSHIP,
  STEP_ORDER_FRESHER_WITH_INTERNSHIP,
  STEP_ORDER_EXPERIENCED,
} from "./types"


// ── STORE TYPE DEFINITION ─────────────────────────────────────────────────
// Describes everything in the store: data fields + action functions

interface ResumeStore {
  // ── STATE ────────────────────────────────────────────────────────────────

  // User settings
  userType: UserType | null           // null = not yet chosen
  hasInternship: boolean
  templateId: TemplateId              // Default = 7 (Alex Webb)
  currentStep: BuilderStep

  // Resume data
  resumeData: Partial<ResumeData>     // Partial = all fields are optional (fills up gradually)

  // AI results (filled after generation)
  aiResponse: GenerateResumeResponse | null
  isGenerating: boolean               // True while AI agents are running
  sessionId: string | null            // Saved resume session ID

  // ── ACTIONS (functions to update state) ──────────────────────────────────

  setUserType: (type: UserType) => void
  setHasInternship: (value: boolean) => void
  setTemplateId: (id: TemplateId) => void
  setCurrentStep: (step: BuilderStep) => void

  // Resume data setters — each updates one section
  setBasicInfo: (info: BasicInfo) => void
  setEducation: (education: Education[]) => void
  setExperience: (experience: Experience[]) => void
  setInternship: (internship: Internship[]) => void
  setSkills: (skills: string[]) => void
  setProjects: (projects: Project[]) => void
  setCertifications: (certs: Certification[]) => void
  setCareerObjective: (objective: string) => void
  setAchievements: (achievements: string[]) => void
  setJobTitle: (title: string) => void
  setJobDescription: (jd: string) => void

  // Navigation
  nextStep: () => void
  prevStep: () => void

  // AI
  setAIResponse: (response: GenerateResumeResponse) => void
  setIsGenerating: (value: boolean) => void

  // Reset entire store (for "Start Over" button)
  reset: () => void
}


// ── INITIAL STATE ─────────────────────────────────────────────────────────
// What the store looks like when the app first loads

const initialState = {
  userType: null,
  hasInternship: false,
  templateId: 7 as TemplateId,       // Alex Webb is default
  currentStep: "template" as BuilderStep,
  resumeData: {},
  aiResponse: null,
  isGenerating: false,
  sessionId: null,
}


// ── CREATE THE STORE ──────────────────────────────────────────────────────

export const useResumeStore = create<ResumeStore>((set, get) => ({
  // Spread initial state values
  ...initialState,

  // ── USER SETTINGS ACTIONS ─────────────────────────────────────────────

  setUserType: (type) => set({ userType: type }),
  // set() merges the new object into existing state
  // Only userType changes — everything else stays the same

  setHasInternship: (value) => set({ hasInternship: value }),

  setTemplateId: (id) => set({ templateId: id }),

  setCurrentStep: (step) => set({ currentStep: step }),

  // ── RESUME DATA ACTIONS ───────────────────────────────────────────────

  setBasicInfo: (info) =>
    set((state) => ({
      resumeData: { ...state.resumeData, basicInfo: info }
      // Spread existing resumeData first, then override basicInfo
      // This preserves other fields (education, skills, etc.)
    })),

  setEducation: (education) =>
    set((state) => ({
      resumeData: { ...state.resumeData, education }
    })),

  setExperience: (experience) =>
    set((state) => ({
      resumeData: { ...state.resumeData, experience }
    })),

  setInternship: (internship) =>
    set((state) => ({
      resumeData: { ...state.resumeData, internship }
    })),

  setSkills: (skills) =>
    set((state) => ({
      resumeData: { ...state.resumeData, skills }
    })),

  setProjects: (projects) =>
    set((state) => ({
      resumeData: { ...state.resumeData, projects }
    })),

  setCertifications: (certifications) =>
    set((state) => ({
      resumeData: { ...state.resumeData, certifications }
    })),

  setCareerObjective: (careerObjective) =>
    set((state) => ({
      resumeData: { ...state.resumeData, careerObjective }
    })),

  setAchievements: (achievements) =>
    set((state) => ({
      resumeData: { ...state.resumeData, achievements }
    })),

  setJobTitle: (jobTitle) =>
    set((state) => ({
      resumeData: { ...state.resumeData, jobTitle }
    })),

  setJobDescription: (jobDescription) =>
    set((state) => ({
      resumeData: { ...state.resumeData, jobDescription }
    })),

  // ── NAVIGATION ACTIONS ────────────────────────────────────────────────

  nextStep: () => {
    const { currentStep, userType, hasInternship } = get()
    // get() reads current state inside an action

    // Pick the correct step order based on user type
    const stepOrder =
      userType === "experienced"
        ? STEP_ORDER_EXPERIENCED
        : hasInternship
        ? STEP_ORDER_FRESHER_WITH_INTERNSHIP
        : STEP_ORDER_FRESHER_NO_INTERNSHIP

    const currentIndex = stepOrder.indexOf(currentStep)
    const nextIndex = currentIndex + 1

    if (nextIndex < stepOrder.length) {
      set({ currentStep: stepOrder[nextIndex] })
    }
  },

  prevStep: () => {
    const { currentStep, userType, hasInternship } = get()

    const stepOrder =
      userType === "experienced"
        ? STEP_ORDER_EXPERIENCED
        : hasInternship
        ? STEP_ORDER_FRESHER_WITH_INTERNSHIP
        : STEP_ORDER_FRESHER_NO_INTERNSHIP

    const currentIndex = stepOrder.indexOf(currentStep)
    const prevIndex = currentIndex - 1

    if (prevIndex >= 0) {
      set({ currentStep: stepOrder[prevIndex] })
    }
  },

  // ── AI ACTIONS ────────────────────────────────────────────────────────

  setAIResponse: (response) =>
    set({ aiResponse: response, sessionId: response.sessionId }),

  setIsGenerating: (value) => set({ isGenerating: value }),

  // ── RESET ─────────────────────────────────────────────────────────────

  reset: () => set(initialState),
  // Resets everything back to initial values (used by "Start Over" button)
}))
