// ─────────────────────────────────────────────────────────────────────────────
// components/builder/StepIndicator.tsx
//
// WHAT THIS FILE DOES:
//   Shows the progress bar at the top of the builder page.
//   Displays: "Step 2 of 7 — Education" with a visual progress bar.
//   User can see how far along they are in the form.
// ─────────────────────────────────────────────────────────────────────────────

"use client"

import { Progress } from "@/components/ui/progress"
import { useResumeStore } from "@/lib/store"
import {
  BuilderStep,
  STEP_ORDER_EXPERIENCED,
  STEP_ORDER_FRESHER_WITH_INTERNSHIP,
  STEP_ORDER_FRESHER_NO_INTERNSHIP,
} from "@/lib/types"

// Human-readable labels for each step
const STEP_LABELS: Record<BuilderStep, string> = {
  "template":         "Choose Template",
  "basic-info":       "Basic Info",
  "education":        "Education",
  "experience":       "Work Experience",
  "internship":       "Internship",
  "skills":           "Skills",
  "projects":         "Projects",
  "certifications":   "Certifications",
  "job-description":  "Tailor to JD",
  "generating":       "AI Processing",
  "preview":          "Preview",
}

export default function StepIndicator() {
  const { currentStep, userType, hasInternship, setCurrentStep } = useResumeStore()

  // Pick the correct step order for this user
  const stepOrder =
    userType === "experienced"
      ? STEP_ORDER_EXPERIENCED
      : hasInternship
      ? STEP_ORDER_FRESHER_WITH_INTERNSHIP
      : STEP_ORDER_FRESHER_NO_INTERNSHIP

  const currentIndex = stepOrder.indexOf(currentStep)
  const totalSteps = stepOrder.length
  const progressPercent = Math.round(((currentIndex + 1) / totalSteps) * 100)
  // e.g., step 2 of 7 = (2/7)*100 = 28%

  return (
    <div className="w-full px-6 py-3 bg-white border-b shadow-xs">
      <div className="max-w-4xl mx-auto">
        {/* Step counter and label */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-slate-700">
            Step {currentIndex + 1} of {totalSteps} — {STEP_LABELS[currentStep]}
          </span>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            {progressPercent}%
          </span>
        </div>

        {/* Progress bar from shadcn/ui */}
        <Progress value={progressPercent} className="h-1.5 mb-2.5" />

        {/* Clickable Step Pills for quick navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar text-xs">
          {stepOrder
            .filter((s) => s !== "generating" && s !== "preview")
            .map((step, idx) => {
              const isCurrent = step === currentStep
              const isPassed = currentIndex > idx
              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => setCurrentStep(step)}
                  className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-all flex items-center gap-1 text-xs cursor-pointer ${
                    isCurrent
                      ? "bg-blue-600 text-white font-medium shadow-xs"
                      : isPassed
                      ? "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                      : "bg-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <span className="opacity-60">{idx + 1}.</span>
                  <span>{STEP_LABELS[step]}</span>
                </button>
              )
            })}
        </div>
      </div>
    </div>
  )
}
