// ─────────────────────────────────────────────────────────────────────────────
// app/page.tsx  — Landing Page (route: /)
//
// WHAT THIS FILE DOES:
//   The first page users see when they visit the app.
//   Contains the hero section, value proposition, and the
//   Fresher / Experienced choice that starts the resume building flow.
//
// NEXT.JS APP ROUTER:
//   In Next.js App Router, every page.tsx file inside app/ becomes a route.
//   app/page.tsx      → /          (this file)
//   app/builder/page.tsx → /builder
//   app/preview/page.tsx → /preview
// ─────────────────────────────────────────────────────────────────────────────

"use client"
// "use client" tells Next.js this is a Client Component.
// Client Components run in the browser (can use useState, onClick, etc.)
// Without this, it's a Server Component (runs only on server, no interactivity)

import { useState } from "react"
import { useRouter } from "next/navigation"
// useRouter = Next.js hook to navigate between pages programmatically

import { motion } from "framer-motion"
// motion = Framer Motion components that add animations

import { FileText, Zap, Download, CheckCircle } from "lucide-react"
// Lucide React icons

import { Button } from "@/components/ui/button"
// @/ = shortcut for the project root (configured in tsconfig.json)

import { useResumeStore } from "@/lib/store"
import { UserType } from "@/lib/types"


export default function LandingPage() {
  // ── STATE ──────────────────────────────────────────────────────────────
  const [showInternshipQuestion, setShowInternshipQuestion] = useState(false)
  // Controls whether to show "Do you have internship experience?" question

  // ── ZUSTAND STORE ──────────────────────────────────────────────────────
  const { setUserType, setHasInternship, setCurrentStep } = useResumeStore()
  // Destructure only the actions we need from the store

  // ── ROUTER ────────────────────────────────────────────────────────────
  const router = useRouter()

  // ── HANDLERS ──────────────────────────────────────────────────────────

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type)
    // Save user type to global store

    if (type === "fresher") {
      setShowInternshipQuestion(true)
      // Show the internship question only for freshers
    } else {
      // Experienced → go straight to builder
      setCurrentStep("template")
      router.push("/builder")
    }
  }

  const handleInternshipChoice = (hasInternship: boolean) => {
    setHasInternship(hasInternship)
    setCurrentStep("template")
    router.push("/builder")
    // Navigate to the builder page
  }


  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">

      {/* ── HEADER ───────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-8 py-4 border-b bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          <span className="font-bold text-xl text-slate-800">ResumeAI</span>
        </div>
        <span className="text-sm text-slate-500 bg-green-100 text-green-700 px-3 py-1 rounded-full">
          100% Free
        </span>
      </header>


      {/* ── HERO SECTION ─────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">

        {/* Animated heading using Framer Motion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          // initial = starting state (invisible, 30px down)
          // animate = end state (visible, normal position)
          // transition = how long the animation takes
        >
          <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Build your resume with{" "}
            <span className="text-blue-600">AI</span> in minutes
          </h1>

          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            No Word. No LaTeX. Just fill in your details and our AI agents
            will write, improve, and format your resume automatically.
          </p>
        </motion.div>


        {/* ── FEATURE PILLS ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {[
            { icon: Zap, text: "AI-powered content" },
            { icon: CheckCircle, text: "ATS optimized" },
            { icon: Download, text: "PDF download" },
            { icon: FileText, text: "8 professional templates" },
          ].map(({ icon: Icon, text }) => (
            <span
              key={text}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm text-slate-700 shadow-sm border"
            >
              <Icon className="w-4 h-4 text-blue-500" />
              {text}
            </span>
          ))}
        </motion.div>


        {/* ── FRESHER / EXPERIENCED BUTTONS ─────────────────────────── */}
        {!showInternshipQuestion ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="px-10 py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg"
              onClick={() => handleUserTypeSelect("fresher")}
            >
              🎓 I&apos;m a Fresher
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="px-10 py-6 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-2xl"
              onClick={() => handleUserTypeSelect("experienced")}
            >
              💼 I&apos;m Experienced
            </Button>
          </motion.div>

        ) : (
          /* ── INTERNSHIP QUESTION (shown after "Fresher" is clicked) ── */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 shadow-lg border max-w-lg mx-auto"
          >
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">
              One quick question 👋
            </h2>
            <p className="text-slate-600 mb-6">
              Do you have any internship or short-term work experience?
            </p>

            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                onClick={() => handleInternshipChoice(true)}
              >
                ✅ Yes, I have internship experience
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full py-5 border-2 rounded-xl"
                onClick={() => handleInternshipChoice(false)}
              >
                No, I&apos;m a complete fresher
              </Button>
            </div>
          </motion.div>
        )}

      </section>


      {/* ── HOW IT WORKS SECTION ─────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
          How it works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: "1", title: "Choose Template", desc: "Pick from 8 professional designs" },
            { step: "2", title: "Fill Details", desc: "Step-by-step guided form" },
            { step: "3", title: "AI Improves", desc: "4 agents polish your content" },
            { step: "4", title: "Download PDF", desc: "ATS-optimized resume ready" },
          ].map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {step}
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
              <p className="text-sm text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}
