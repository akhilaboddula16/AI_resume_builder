// ─────────────────────────────────────────────────────────────────────────────
// app/builder/page.tsx  — The Multi-Step Form Page (route: /builder)
//
// WHAT THIS FILE DOES:
//   This is the main builder page. It reads `currentStep` from Zustand store
//   and renders the correct form component for that step.
//   Also handles: the "Generating" loading screen + calling the AI backend.
// ─────────────────────────────────────────────────────────────────────────────
"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Loader2, CheckCircle2, Sparkles } from "lucide-react"

import { useResumeStore } from "@/lib/store"
import { generateResume } from "@/lib/api"
import { Button } from "@/components/ui/button"

import StepIndicator    from "@/components/builder/StepIndicator"
import TemplateSelector from "@/components/builder/TemplateSelector"
import BasicInfoForm    from "@/components/builder/BasicInfoForm"
import EducationForm    from "@/components/builder/EducationForm"
import InternshipForm   from "@/components/builder/InternshipForm"
import ExperienceForm   from "@/components/builder/ExperienceForm"
import SkillsForm       from "@/components/builder/SkillsForm"
import ProjectsForm     from "@/components/builder/ProjectsForm"
import CertificationsForm from "@/components/builder/CertificationsForm"
import JobDescriptionForm from "@/components/builder/JobDescriptionForm"
import BuilderLivePreview from "@/components/preview/BuilderLivePreview"

export default function BuilderPage() {
  const router = useRouter()
  const { currentStep, resumeData, templateId, userType, setAIResponse, setIsGenerating, isGenerating, nextStep, aiResponse } = useResumeStore()
  const [stage, setStage] = useState(0)
  const [progress, setProgress] = useState(15)

  // If user lands here directly without choosing Fresher/Experienced, redirect home
  useEffect(() => {
    if (!userType) router.push("/")
  }, [userType, router])

  // When step reaches "generating", trigger AI pipeline
  useEffect(() => {
    if (currentStep === "generating" && !isGenerating) {
      runAIPipeline()
    }
  }, [currentStep])

  // Progress timer for realistic user feedback
  useEffect(() => {
    if (currentStep !== "generating") {
      setStage(0)
      setProgress(15)
      return
    }

    const t1 = setTimeout(() => { setStage(1); setProgress(45) }, 5000)
    const t2 = setTimeout(() => { setStage(2); setProgress(75) }, 18000)
    const t3 = setTimeout(() => { setStage(3); setProgress(92) }, 32000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [currentStep])

  const runAIPipeline = async () => {
    setIsGenerating(true)
    try {
      // Call backend API — runs all LangGraph agents
      const result = await generateResume(resumeData)
      setAIResponse(result)
      // Navigate to preview page after AI finishes
      router.replace("/preview")
    } catch (error) {
      console.error("AI pipeline failed:", error)
      // Even on error, go to preview with whatever we have
      router.replace("/preview")
    } finally {
      setIsGenerating(false)
    }
  }

  // ── GENERATING SCREEN (Clean, Professional Waiting Screen) ──────────────
  if (currentStep === "generating") {
    const steps = [
      "Analyzing target role & keyword requirements",
      "Polishing experience bullets & achievements",
      "Scoring ATS compatibility & optimizing keywords",
      "Finalizing formatted resume for download",
    ]

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white border border-slate-200/90 shadow-xl rounded-2xl p-8 sm:p-10 max-w-lg w-full text-center"
        >
          {/* Animated Header Badge */}
          <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Polishing Your Resume
          </h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Our AI is enhancing your bullet points, aligning industry keywords, and scoring ATS compatibility.
          </p>

          {/* Smooth Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 mb-6 overflow-hidden">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: "15%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </div>

          {/* Active Sequential Checklist */}
          <div className="space-y-3 bg-slate-50/80 border border-slate-100 rounded-xl p-4 text-left text-xs mb-6">
            {steps.map((text, idx) => {
              const isDone = stage > idx
              const isCurrent = stage === idx

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 transition-colors duration-300 ${
                    isDone
                      ? "text-slate-700 font-medium"
                      : isCurrent
                      ? "text-blue-700 font-semibold"
                      : "text-slate-400"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300 mx-1 shrink-0" />
                  )}
                  <span>{text}</span>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Takes ~30–40 seconds. Please keep this window open.</span>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── MAIN BUILDER LAYOUT ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-slate-800">ResumeAI</span>
          <span className="ml-2 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full capitalize">
            {userType}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {aiResponse && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/preview")}
              className="text-xs text-blue-600 border-blue-200 hover:bg-blue-50 py-1 h-7 font-medium"
            >
              ← Back to Preview
            </Button>
          )}
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Step: <span className="text-blue-600 capitalize">{currentStep.replace("-", " ")}</span>
          </div>
        </div>
      </header>

      {/* Step progress bar */}
      <StepIndicator />

      {/* When on Template Step: Full width for template cards */}
      {currentStep === "template" ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="pb-20"
          >
            <TemplateSelector />
          </motion.div>
        </AnimatePresence>
      ) : (
        /* Split view: Forms on left, Sticky Real-Time Live Preview tab on right! */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left side: Interactive Forms */}
            <div className="w-full lg:w-7/12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentStep === "basic-info"     && <BasicInfoForm />}
                  {currentStep === "education"      && <EducationForm />}
                  {currentStep === "internship"     && <InternshipForm />}
                  {currentStep === "experience"     && <ExperienceForm />}
                  {currentStep === "skills"         && <SkillsForm />}
                  {currentStep === "projects"       && <ProjectsForm />}
                  {currentStep === "certifications" && <CertificationsForm />}
                  {currentStep === "job-description" && <JobDescriptionForm />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right side: Real-time Live Preview Side Panel */}
            <div className="w-full lg:w-5/12 lg:sticky lg:top-6 self-start">
              <BuilderLivePreview />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
