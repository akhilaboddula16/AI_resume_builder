// ─────────────────────────────────────────────────────────────────────────────
// components/builder/JobDescriptionForm.tsx
//
// WHAT THIS FILE DOES:
//   Optional step where users can paste a Job Description (JD).
//   The AI will use it to tailor resume keywords to match that specific JD.
//   Users can skip this step entirely — it's 100% optional.
// ─────────────────────────────────────────────────────────────────────────────
"use client"
import { useState } from "react"
import { Sparkles, ArrowRight, SkipForward, Target, CheckCircle2, FileSearch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useResumeStore } from "@/lib/store"

export default function JobDescriptionForm() {
  const { resumeData, setJobDescription, nextStep } = useResumeStore()
  const [jd, setJd] = useState(resumeData.jobDescription || "")
  const [charCount, setCharCount] = useState(resumeData.jobDescription?.length || 0)

  const handleChange = (val: string) => {
    setJd(val)
    setCharCount(val.length)
  }

  const handleSaveAndContinue = () => {
    setJobDescription(jd.trim())
    nextStep()
  }

  const handleSkip = () => {
    // Clear any previously saved JD and move on
    setJobDescription("")
    nextStep()
  }

  const hasContent = jd.trim().length > 50

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 bg-violet-50 border border-violet-100 rounded-xl flex items-center justify-center shrink-0">
          <Target className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800">Job Description Tailoring</h2>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">Optional</span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Paste the job description you're applying to — our AI will tailor keywords to match it exactly.
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-violet-50/60 border border-violet-100 rounded-xl p-4 mb-5">
        <p className="text-xs font-semibold text-violet-700 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> What tailoring does for you
        </p>
        <ul className="space-y-1.5">
          {[
            "Matches your resume's keywords to the exact JD language",
            "Boosts ATS score for that specific role",
            "Highlights skills the recruiter is looking for",
          ].map((b, i) => (
            <li key={i} className="text-xs text-violet-800 flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-violet-500 shrink-0 mt-0.5" />
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* Textarea */}
      <div className="mb-2">
        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
          <FileSearch className="w-4 h-4 text-slate-400" />
          Paste Job Description
        </label>
        <textarea
          value={jd}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={`Example:\n\nWe are looking for a Full Stack Developer with experience in React, Node.js, and PostgreSQL...\n\nPaste the full job posting here for best results.`}
          rows={10}
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-400 transition-all"
        />
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-slate-400">
            {charCount > 0
              ? charCount < 50
                ? "Add more detail for better results (50+ characters recommended)"
                : `✓ ${charCount} characters — good detail for tailoring`
              : ""}
          </p>
          <span className="text-xs text-slate-400">{charCount} chars</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Button
          onClick={handleSaveAndContinue}
          disabled={!hasContent}
          className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-5 rounded-xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Tailor to This JD
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button
          variant="outline"
          onClick={handleSkip}
          className="flex-1 sm:flex-none sm:w-auto border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 py-5 rounded-xl"
        >
          <SkipForward className="w-4 h-4 mr-2" />
          Skip — Generate Without Tailoring
        </Button>
      </div>
    </div>
  )
}
