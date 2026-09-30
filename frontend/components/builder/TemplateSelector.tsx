// ─────────────────────────────────────────────────────────────────────────────
// components/builder/TemplateSelector.tsx
//
// WHAT THIS FILE DOES:
//   Shows all 8 resume template cards with authentic, realistic mini-mockups
//   displaying actual typography, headers, dates, tables, and layouts so users
//   can visually evaluate and choose the exact design they want!
// ─────────────────────────────────────────────────────────────────────────────

"use client"

import { motion } from "framer-motion"
import { CheckCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useResumeStore } from "@/lib/store"
import { TemplateId, TemplateInfo } from "@/lib/types"

// ── TEMPLATE METADATA ─────────────────────────────────────────────────────
const TEMPLATES: TemplateInfo[] = [
  { id: 1, name: "A Kumar",       style: "Academic Classic",    bestFor: "IIT / Research / LaTeX",  font: "serif",      isDefault: false },
  { id: 2, name: "Shaila Ang",    style: "Professional",        bestFor: "Corporate / Business",    font: "serif",      isDefault: false },
  { id: 3, name: "Nishchay",      style: "Table Education",     bestFor: "Diploma / B.E. / 10th+12th",font: "serif",     isDefault: false },
  { id: 4, name: "Rishi Shah",    style: "Engineering Focus",   bestFor: "Projects-Heavy",          font: "serif",      isDefault: false },
  { id: 5, name: "Pooja Panwar",  style: "Traditional Corporate",bestFor: "Indian Enterprise",       font: "serif",      isDefault: false },
  { id: 6, name: "Tamal Barman",  style: "College Format",      bestFor: "NIT / College Placement", font: "serif",      isDefault: false },
  { id: 7, name: "Alex Webb",     style: "Modern AI / Tech",    bestFor: "Tech / AI (Recommended)", font: "sans-serif", isDefault: true  },
  { id: 8, name: "Harshibar",     style: "Clean American",      bestFor: "Startup / Global Roles",  font: "sans-serif", isDefault: false },
]

export default function TemplateSelector() {
  const { templateId, setTemplateId, nextStep } = useResumeStore()

  const renderTemplateMockup = (id: TemplateId) => {
    switch (id) {
      case 1:
        // A Kumar: Academic serif, centered header, 2-column skills
        return (
          <div className="font-serif text-[7.5px] leading-tight text-slate-800 p-2.5 bg-white h-full flex flex-col justify-between select-none">
            <div className="text-center pb-1 border-b border-black">
              <div className="font-bold text-[9px] uppercase tracking-wider">A. KUMAR</div>
              <div className="text-[6.5px] text-slate-600 mt-0.5">kumar@iitk.ac.in • +91 9876543210</div>
            </div>
            <div>
              <div className="font-bold text-[8px] uppercase tracking-wider border-b border-slate-400 mt-1 mb-0.5">Education</div>
              <div className="flex justify-between font-semibold"><span>IIT Kanpur — B.Tech CSE</span><span>2020 – 2024</span></div>
              <div className="text-slate-600 italic text-[7px]">CGPA: 9.2 / 10.0</div>
            </div>
            <div>
              <div className="font-bold text-[8px] uppercase tracking-wider border-b border-slate-400 mt-1 mb-0.5">Technical Strengths</div>
              <div className="grid grid-cols-2 text-[6.5px] text-slate-700">
                <div>· C++, Python, PyTorch</div>
                <div>· Algorithms, Linux, Git</div>
              </div>
            </div>
            <div>
              <div className="font-bold text-[8px] uppercase tracking-wider border-b border-slate-400 mt-1 mb-0.5">Projects</div>
              <div className="font-semibold text-slate-800">Neural Network Compiler</div>
              <div className="text-[6.5px] text-slate-600">· Optimized kernel runtime by 28%</div>
            </div>
          </div>
        )

      case 2:
        // Shaila Ang: Professional serif, right-aligned dates & city location
        return (
          <div className="font-serif text-[7.5px] leading-tight text-slate-800 p-2.5 bg-white h-full flex flex-col justify-between select-none">
            <div className="text-center pb-1 border-b border-slate-800">
              <div className="font-bold text-[9px]">SHAILA ANG</div>
              <div className="text-[6.5px] text-slate-600">shaila@consulting.com | +91 9988776655</div>
            </div>
            <div>
              <div className="font-bold text-[8px] uppercase border-b border-slate-300 mt-1 mb-0.5">Work Experience</div>
              <div className="flex justify-between font-semibold"><span>Associate Consultant</span><span>2021 – Present</span></div>
              <div className="flex justify-between text-slate-600 italic text-[7px]"><span>McKinsey & Co.</span><span>Bangalore, IN</span></div>
              <div className="text-[6.5px] text-slate-600">· Spearheaded digital strategy for FinTech client</div>
            </div>
            <div>
              <div className="font-bold text-[8px] uppercase border-b border-slate-300 mt-1 mb-0.5">Education</div>
              <div className="flex justify-between"><span>IIM Ahmedabad — MBA</span><span>2019 – 2021</span></div>
            </div>
            <div>
              <div className="font-bold text-[8px] uppercase border-b border-slate-300 mt-1 mb-0.5">Core Strengths</div>
              <div className="text-[6.5px] text-slate-600">Financial Modeling · Growth Strategy · Analytics</div>
            </div>
          </div>
        )

      case 3:
        // Nishchay: 5-column table for education with visible border grid lines
        return (
          <div className="font-serif text-[7px] leading-tight text-slate-800 p-2.5 bg-white h-full flex flex-col justify-between select-none">
            <div className="text-center pb-1 border-b-2 border-black">
              <div className="font-bold text-[9px] uppercase">NISHCHAY KUMAR</div>
              <div className="text-[6.5px] text-slate-600">nishchay@mail.com | +91 9123456789</div>
            </div>
            <div>
              <div className="font-bold text-[7.5px] uppercase border-b border-black mt-1 mb-0.5">Career Objective</div>
              <div className="text-[6.5px] text-slate-600 line-clamp-1">Aspiring engineer seeking challenging technical role...</div>
            </div>
            <div>
              <div className="font-bold text-[7.5px] uppercase border-b border-black mt-1 mb-0.5">Education (Table)</div>
              <div className="border border-slate-400 text-[6px]">
                <div className="flex bg-slate-100 font-bold border-b border-slate-400 p-0.5">
                  <span className="flex-1">Degree</span><span className="flex-1">Board</span><span className="w-8">Year</span><span className="w-8">Score</span>
                </div>
                <div className="flex p-0.5 border-b border-slate-200">
                  <span className="flex-1 font-semibold">B.E.</span><span className="flex-1">CSVTU</span><span className="w-8">2024</span><span className="w-8">8.5</span>
                </div>
                <div className="flex p-0.5">
                  <span className="flex-1">12th</span><span className="flex-1">CBSE</span><span className="w-8">2020</span><span className="w-8">86%</span>
                </div>
              </div>
            </div>
            <div>
              <div className="font-bold text-[7.5px] uppercase border-b border-black mt-1 mb-0.5">Trainings & Projects</div>
              <div className="text-[6.5px] font-semibold">Full Stack Web Intern — TechCorp (3 Mo)</div>
            </div>
          </div>
        )

      case 4:
        // Rishi Shah: Projects-heavy engineering with bold subheadings and tags
        return (
          <div className="font-serif text-[7.5px] leading-tight text-slate-800 p-2.5 bg-white h-full flex flex-col justify-between select-none">
            <div className="text-center pb-1 border-b border-slate-800">
              <div className="font-bold text-[9px]">RISHI SHAH</div>
              <div className="text-[6.5px] text-slate-600">github.com/rishi • rishi@engg.edu</div>
            </div>
            <div>
              <div className="font-bold text-[8px] uppercase border-b border-slate-300 mt-1 mb-0.5">Carrier Objective</div>
              <div className="text-[6.5px] text-slate-600">Driven developer specializing in scalable distributed apps...</div>
            </div>
            <div>
              <div className="font-bold text-[8px] uppercase border-b border-slate-300 mt-1 mb-0.5">Projects</div>
              <div className="flex justify-between font-bold text-slate-900"><span>[AI Code Analyzer]</span><span>Mar 2024</span></div>
              <div className="text-[6.5px] text-blue-700 italic">Tech: Python, FastAPI, Docker</div>
              <div className="text-[6.5px] text-slate-600">· Automated linting for 500+ repositories</div>
            </div>
            <div>
              <div className="font-bold text-[8px] uppercase border-b border-slate-300 mt-1 mb-0.5">Technical Skills</div>
              <div className="text-[6.5px] text-slate-700">Python · React · PostgreSQL · Docker · AWS</div>
            </div>
          </div>
        )

      case 5:
        // Pooja Panwar: Traditional Indian corporate with Objective and Key Accomplishments
        return (
          <div className="font-serif text-[7.5px] leading-tight text-slate-800 p-2.5 bg-white h-full flex flex-col justify-between select-none">
            <div className="text-center pb-1 border-b border-slate-800">
              <div className="font-bold text-[9px]">POOJA PANWAR</div>
              <div className="text-[6.5px] text-slate-600">pooja.panwar@email.com | +91 9411223344</div>
            </div>
            <div>
              <div className="font-bold text-[8px] uppercase border-b border-slate-300 mt-1 mb-0.5">Objective</div>
              <div className="text-[6.5px] text-slate-600">Seeking responsible position in software development...</div>
            </div>
            <div>
              <div className="font-bold text-[8px] uppercase border-b border-slate-300 mt-1 mb-0.5">Experience</div>
              <div className="flex justify-between font-semibold"><span>Software Engineer — TCS</span><span>2021 – 2024</span></div>
              <div className="text-[6.5px] text-slate-600">· Delivered client modules on enterprise banking portal</div>
            </div>
            <div>
              <div className="font-bold text-[8px] uppercase border-b border-slate-300 mt-1 mb-0.5">Key Accomplishments</div>
              <div className="text-[6.5px] text-slate-700">· Gold medalist in University (Rank 1/450)</div>
            </div>
          </div>
        )

      case 6:
        // Tamal Barman: College logo box top-left, details top-right, 4-col education table
        return (
          <div className="font-serif text-[7.5px] leading-tight text-slate-800 p-2.5 bg-white h-full flex flex-col justify-between select-none">
            <div className="flex items-center gap-2 pb-1 border-b border-black">
              <div className="w-7 h-7 border border-slate-400 bg-slate-100 flex items-center justify-center text-[5.5px] text-slate-500 font-sans text-center leading-tight">
                LOGO
              </div>
              <div className="flex-1">
                <div className="font-bold text-[8.5px]">TAMAL BARMAN</div>
                <div className="text-[6px] text-slate-600">NIT Trichy | barman@nitt.edu</div>
              </div>
            </div>
            <div>
              <div className="font-bold text-[7.5px] uppercase border-b border-slate-400 mt-1 mb-0.5">Education</div>
              <div className="border border-slate-300 text-[6px]">
                <div className="flex bg-slate-50 font-bold p-0.5 border-b border-slate-300">
                  <span className="flex-1">Degree</span><span className="flex-1">Institution</span><span className="w-7 text-right">Year</span><span className="w-7 text-right">CGPA</span>
                </div>
                <div className="flex p-0.5">
                  <span className="flex-1 font-semibold">B.Tech</span><span className="flex-1">NIT Trichy</span><span className="w-7 text-right">2024</span><span className="w-7 text-right">8.9</span>
                </div>
              </div>
            </div>
            <div>
              <div className="font-bold text-[7.5px] uppercase border-b border-slate-400 mt-1 mb-0.5">Work Experience</div>
              <div className="flex justify-between font-semibold"><span>Amazon — SDE Intern</span><span>Summer 2023</span></div>
              <div className="text-[6.5px] text-slate-600">· Built latency tracking dashboard using AWS CloudWatch</div>
            </div>
          </div>
        )

      case 7:
        // Alex Webb: Modern tech sans-serif, right-aligned dates, tech pills, small-caps headers
        return (
          <div className="font-sans text-[7.5px] leading-tight text-slate-800 p-2.5 bg-white h-full flex flex-col justify-between select-none">
            <div>
              <div className="font-bold text-[10px] text-slate-900 tracking-wide">ALEX WEBB</div>
              <div className="flex gap-2 text-[6.5px] text-slate-500 mt-0.5">
                <span>alex@dev.io</span><span>•</span><span>github.com/alex</span><span>•</span><span>+1 (555) 234-5678</span>
              </div>
            </div>
            <div>
              <div className="font-bold text-[8px] uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mt-1 mb-0.5">
                Summary
              </div>
              <div className="text-[6.5px] text-slate-600 line-clamp-1">AI Software Engineer building Agentic RAG workflows...</div>
            </div>
            <div>
              <div className="font-bold text-[8px] uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mt-1 mb-0.5">
                Projects
              </div>
              <div className="flex justify-between font-bold text-slate-900">
                <span>Autonomous Resume Agent</span><span className="text-slate-500 font-normal">Jan 2024</span>
              </div>
              <div className="flex gap-1 my-0.5">
                <span className="bg-blue-50 text-blue-700 text-[5.5px] px-1 rounded font-medium border border-blue-200">FastAPI</span>
                <span className="bg-blue-50 text-blue-700 text-[5.5px] px-1 rounded font-medium border border-blue-200">LangGraph</span>
                <span className="bg-blue-50 text-blue-700 text-[5.5px] px-1 rounded font-medium border border-blue-200">Next.js</span>
              </div>
            </div>
            <div>
              <div className="font-bold text-[8px] uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mt-1 mb-0.5">
                Experience
              </div>
              <div className="flex justify-between font-semibold">
                <span>AI Engineer — Scale AI</span><span className="text-slate-500 font-normal">2022 – Present</span>
              </div>
              <div className="text-[6.5px] text-slate-600">· Scaled LLM evaluation pipeline across 20+ fine-tuned models</div>
            </div>
          </div>
        )

      case 8:
        // Harshibar: Clean American sans-serif with contact icons, experience first
        return (
          <div className="font-sans text-[7.5px] leading-tight text-slate-800 p-2.5 bg-white h-full flex flex-col justify-between select-none">
            <div className="pb-1 border-b-2 border-slate-900">
              <div className="font-bold text-[10px] text-slate-900">HARSHIBAR</div>
              <div className="flex gap-2 text-[6.5px] text-slate-600 mt-0.5">
                <span>✉ email@io</span><span>📞 +1 415...</span><span>🔗 linkedin/in/harshi</span>
              </div>
            </div>
            <div>
              <div className="font-bold text-[8px] uppercase border-b border-slate-400 mt-1 mb-0.5">Experience</div>
              <div className="flex justify-between font-bold text-slate-900"><span>Product Engineer — Stripe</span><span>2021 – Present</span></div>
              <div className="text-[6.5px] text-slate-700">· <strong className="font-semibold">Spearheaded checkout flow</strong>, reducing latency by 45%</div>
              <div className="text-[6.5px] text-slate-700">· <strong className="font-semibold">Architected microservices</strong> handling 100k+ TPS</div>
            </div>
            <div>
              <div className="font-bold text-[8px] uppercase border-b border-slate-400 mt-1 mb-0.5">Projects & Open Source</div>
              <div className="font-semibold">Distributed Rate Limiter <span className="font-normal text-slate-500">(1.2k stars)</span></div>
            </div>
            <div>
              <div className="font-bold text-[8px] uppercase border-b border-slate-400 mt-1 mb-0.5">Skills</div>
              <div className="text-[6.5px] text-slate-700">TypeScript • Go • Node.js • PostgreSQL • Redis</div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
          Choose your resume template
        </h2>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Every template is ATS-compatible and designed for specific industry standards.
          Template 7 is selected by default for modern technical roles.
        </p>
      </div>

      {/* 8 Realistic Template Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {TEMPLATES.map((template) => {
          const isSelected = templateId === template.id
          return (
            <motion.div
              key={template.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setTemplateId(template.id)}
              className={`
                relative cursor-pointer rounded-2xl border-2 p-3.5 bg-white flex flex-col justify-between
                transition-all duration-200 shadow-sm hover:shadow-lg
                ${isSelected
                  ? "border-blue-600 ring-2 ring-blue-500/30 shadow-md"
                  : "border-slate-200 hover:border-slate-300"
                }
              `}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute -top-2.5 -right-2.5 z-10 bg-blue-600 text-white rounded-full p-1 shadow-md">
                  <CheckCircle className="w-5 h-5 fill-blue-600 text-white" />
                </div>
              )}

              {/* Recommended Badge */}
              {template.isDefault && (
                <div className="absolute -top-2.5 left-3 z-10">
                  <span className="flex items-center gap-1 text-[11px] font-semibold bg-blue-600 text-white px-2.5 py-0.5 rounded-full shadow-sm">
                    <Sparkles className="w-3 h-3" /> Recommended
                  </span>
                </div>
              )}

              {/* Authentic Resume Miniature Canvas */}
              <div className="w-full h-44 rounded-xl mb-3 overflow-hidden border border-slate-200 shadow-inner bg-slate-50">
                {renderTemplateMockup(template.id)}
              </div>

              {/* Template Title & Details */}
              <div className="pt-1">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">{template.name}</h3>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">{template.font}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{template.style}</p>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-blue-600 font-medium">{template.bestFor}</span>
                  {isSelected && <span className="text-blue-700 font-bold text-xs">Selected ✓</span>}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Continue CTA */}
      <div className="flex justify-center pb-4">
        <Button
          size="lg"
          className="px-12 py-6 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
          onClick={nextStep}
        >
          Continue with Template {templateId} →
        </Button>
      </div>
    </div>
  )
}
