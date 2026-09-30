// ─────────────────────────────────────────────────────────────────────────────
// app/preview/page.tsx  — Final Preview Page (route: /preview)
//
// WHAT THIS FILE DOES:
//   Shows the completed resume after AI agents finish processing.
//   Left side: PDF preview + download button
//   Right side: ATS score breakdown + Cover Letter generator
//   Bottom: Action buttons (Download Again, Build Another)
// ─────────────────────────────────────────────────────────────────────────────
"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  RefreshCw, FileText, Sparkles, Copy, Check, X,
  Mail, Loader2, Home, Edit3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useResumeStore } from "@/lib/store"
import { BuilderStep } from "@/lib/types"
import { generateCoverLetter } from "@/lib/api"
import LivePreview from "@/components/preview/LivePreview"
import ATSScoreCard from "@/components/preview/ATSScoreCard"

export default function PreviewPage() {
  const router = useRouter()
  const { aiResponse, templateId, resumeData, reset, setCurrentStep } = useResumeStore()

  // ── Cover Letter modal state ────────────────────────────────────────────
  const [showCoverLetter, setShowCoverLetter] = useState(false)
  const [coverLetterText, setCoverLetterText] = useState<string>("")
  const [coverLetterCompany, setCoverLetterCompany] = useState("")
  const [isGeneratingCL, setIsGeneratingCL] = useState(false)
  const [clError, setClError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // If no AI response yet, redirect to home
  useEffect(() => {
    if (!aiResponse) router.push("/")
  }, [aiResponse, router])

  if (!aiResponse) return null

  const resumeContent = (aiResponse.polishedResume as Record<string, unknown>)?.resume_data as Record<string, unknown>
    || aiResponse.polishedResume as Record<string, unknown>

  const handleStartOver = () => {
    reset()
    router.push("/")
  }

  const handleEditResume = (targetStep: BuilderStep = "basic-info") => {
    setCurrentStep(targetStep)
    router.push("/builder")
  }

  // ── Cover Letter ────────────────────────────────────────────────────────

  const handleGenerateCoverLetter = async () => {
    setIsGeneratingCL(true)
    setClError(null)
    try {
      const result = await generateCoverLetter({
        name: resumeData.basicInfo?.name || "",
        jobTitle: resumeData.jobTitle || "Software Developer",
        company: coverLetterCompany || undefined,
        skills: resumeData.skills || [],
        experienceSummary: buildExperienceSummary(),
      })
      setCoverLetterText(result.coverLetter)
    } catch (err) {
      setClError("Failed to generate. Please try again.")
    } finally {
      setIsGeneratingCL(false)
    }
  }

  const buildExperienceSummary = () => {
    const exp = resumeData.experience || []
    const intern = resumeData.internship || []
    if (exp.length > 0) {
      return `${exp[0].description?.slice(0, 200) || ""}`
    }
    if (intern.length > 0) {
      return `${intern[0].description?.slice(0, 200) || ""}`
    }
    return ""
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(coverLetterText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-slate-800">ResumeAI</span>
          <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
            ✓ Resume Ready
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditResume("skills")}
            className="flex items-center gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50 font-medium"
          >
            <Edit3 className="w-4 h-4" /> Edit & Improve
          </Button>
          <Button variant="ghost" size="sm" onClick={handleStartOver}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800">
            <Home className="w-4 h-4" /> New Resume
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Your resume is ready! 🎉
          </h1>
          <p className="text-slate-600">
            AI agents polished your content and scored it for ATS compatibility.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── LEFT: PDF Preview ─────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <LivePreview
              resumeData={resumeContent}
              templateId={templateId}
              candidateName={resumeData.basicInfo?.name}
            />
          </div>

          {/* ── RIGHT: ATS Score + Actions ─────────────────────────────── */}
          <div className="space-y-4">
            {/* ATS Score Breakdown Card */}
            <ATSScoreCard
              score={aiResponse.atsScore}
              grade={aiResponse.atsGrade}
              suggestions={aiResponse.atsSuggestions}
              improvements={aiResponse.aiImprovements}
              breakdown={aiResponse.atsBreakdown}
              strongPoints={aiResponse.atsStrongPoints}
              onEdit={() => handleEditResume("skills")}
            />

            {/* ── Edit Resume CTA Card ───────────────────────────────── */}
            <Button
              onClick={() => handleEditResume("basic-info")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-5 shadow-sm font-semibold text-sm"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Details & Retest Score
            </Button>

            {/* ── Cover Letter Button ─────────────────────────────────── */}
            <div className="bg-white rounded-xl border p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-3 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Cover Letter
              </p>
              <p className="text-xs text-slate-500 mb-3">
                Generate a matching cover letter for this role in ~5 seconds.
              </p>
              <Button
                onClick={() => setShowCoverLetter(true)}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Cover Letter
              </Button>
            </div>

            {/* Template Used */}
            <div className="bg-white rounded-xl border p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Template Used</p>
              <p className="text-slate-700 font-medium">Template {templateId}</p>
            </div>

            {/* Session ID */}
            {aiResponse.sessionId && (
              <div className="bg-white rounded-xl border p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Session ID</p>
                <p className="text-xs text-slate-600 font-mono break-all">{aiResponse.sessionId}</p>
                <p className="text-xs text-slate-400 mt-1">Save this to retrieve your resume later</p>
              </div>
            )}

            {/* Start Over */}
            <Button
              variant="outline"
              className="w-full border-2 border-dashed border-slate-300 text-slate-500 hover:border-blue-400 hover:text-blue-600"
              onClick={handleStartOver}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Build a new resume
            </Button>
          </div>
        </div>
      </div>

      {/* ── COVER LETTER MODAL ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showCoverLetter && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowCoverLetter(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-violet-50 border border-violet-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 text-base">Cover Letter Generator</h2>
                    <p className="text-xs text-slate-500">Tailored to your resume + job title</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCoverLetter(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Company input */}
                {!coverLetterText && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Company Name <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={coverLetterCompany}
                      onChange={(e) => setCoverLetterCompany(e.target.value)}
                      placeholder="e.g., Google, Infosys, Startup XYZ"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />

                    <div className="mt-4 bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-500">
                      <span className="font-semibold text-slate-600">Will be generated for: </span>
                      {resumeData.basicInfo?.name} → {resumeData.jobTitle || "Software Developer"}
                      {coverLetterCompany && ` at ${coverLetterCompany}`}
                    </div>
                  </div>
                )}

                {/* Error */}
                {clError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
                    {clError}
                  </div>
                )}

                {/* Generated text */}
                {coverLetterText && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Generated Cover Letter</p>
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 font-medium"
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                      {coverLetterText}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCoverLetterText("")
                        setClError(null)
                      }}
                      className="mt-3 text-xs text-slate-500"
                    >
                      ↺ Regenerate
                    </Button>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t flex gap-3">
                {!coverLetterText ? (
                  <>
                    <Button
                      onClick={handleGenerateCoverLetter}
                      disabled={isGeneratingCL}
                      className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-xl"
                    >
                      {isGeneratingCL ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Now
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCoverLetter(false)}
                      className="rounded-xl"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setShowCoverLetter(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-900 text-white rounded-xl"
                  >
                    Done
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
