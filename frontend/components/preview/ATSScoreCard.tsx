// ─────────────────────────────────────────────────────────────────────────────
// components/preview/ATSScoreCard.tsx
//
// WHAT THIS FILE DOES:
//   Shows a detailed ATS compatibility breakdown card with:
//   - Overall score + grade
//   - 4 category breakdown bars (keyword, sections, content, format)
//   - Strong points (what the resume already does well)
//   - Suggestions to improve
//   - What AI improved
// ─────────────────────────────────────────────────────────────────────────────
"use client"
import { motion } from "framer-motion"
import { CheckCircle, AlertCircle, XCircle, Lightbulb, Star, TrendingUp } from "lucide-react"
import { ATSBreakdown } from "@/lib/types"

interface ATSScoreCardProps {
  score: number
  grade: string
  suggestions: string[]
  improvements: string[]
  breakdown?: ATSBreakdown
  strongPoints?: string[]
  onEdit?: () => void
}

const BREAKDOWN_CONFIG = [
  { key: "keyword_presence",     label: "Keyword Match",       max: 30, color: "bg-blue-500"    },
  { key: "section_completeness", label: "Section Completeness",max: 25, color: "bg-violet-500"  },
  { key: "content_quality",      label: "Content Quality",     max: 25, color: "bg-emerald-500" },
  { key: "format_compatibility", label: "Format & Structure",  max: 20, color: "bg-orange-500"  },
]

export default function ATSScoreCard({
  score, grade, suggestions, improvements, breakdown, strongPoints, onEdit
}: ATSScoreCardProps) {

  // Color changes based on score range
  const getScoreColor = () => {
    if (score >= 90) return { bar: "bg-green-500",  text: "text-green-600",  bg: "bg-green-50 border-green-200"   }
    if (score >= 70) return { bar: "bg-blue-500",   text: "text-blue-600",   bg: "bg-blue-50 border-blue-200"    }
    if (score >= 50) return { bar: "bg-yellow-500", text: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" }
    return              { bar: "bg-red-500",    text: "text-red-600",    bg: "bg-red-50 border-red-200"      }
  }

  const getIcon = () => {
    if (score >= 70) return <CheckCircle className="w-5 h-5 text-green-500" />
    if (score >= 50) return <AlertCircle className="w-5 h-5 text-yellow-500" />
    return <XCircle className="w-5 h-5 text-red-500" />
  }

  const colors = getScoreColor()
  const hasBreakdown = breakdown && Object.keys(breakdown).length > 0

  return (
    <div className="space-y-3">
      {/* ── MAIN SCORE CARD ──────────────────────────────────────── */}
      <div className={`rounded-xl border p-5 ${colors.bg}`}>
        {/* Score header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getIcon()}
            <span className="font-semibold text-slate-800">ATS Score</span>
          </div>
          <div className="text-right">
            <span className={`text-3xl font-bold ${colors.text}`}>{score}</span>
            <span className="text-slate-500 text-lg">/100</span>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="w-full bg-white rounded-full h-3 mb-2 overflow-hidden border">
          <motion.div
            className={`h-full rounded-full ${colors.bar}`}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <p className={`text-sm font-medium ${colors.text} mb-0`}>{grade}</p>
      </div>

      {/* ── BREAKDOWN CARD ────────────────────────────────────────── */}
      {hasBreakdown && (
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-slate-400" /> Score Breakdown
          </p>
          <div className="space-y-3">
            {BREAKDOWN_CONFIG.map(({ key, label, max, color }) => {
              const val = (breakdown as unknown as Record<string, number>)[key] ?? 0
              const pct = Math.round((val / max) * 100)
              return (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-600">{label}</span>
                    <span className="text-xs font-semibold text-slate-700">{val}/{max}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── STRONG POINTS ─────────────────────────────────────────── */}
      {strongPoints && strongPoints.length > 0 && (
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-500" /> Strong Points
          </p>
          <ul className="space-y-1.5">
            {strongPoints.slice(0, 3).map((s, i) => (
              <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" /> {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── SUGGESTIONS ───────────────────────────────────────────── */}
      {suggestions.length > 0 && (
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Suggestions to improve
          </p>
          <ul className="space-y-1.5 mb-3">
            {suggestions.slice(0, 4).map((s, i) => (
              <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">→</span> {s}
              </li>
            ))}
          </ul>
          {onEdit && (
            <button
              onClick={onEdit}
              className="w-full mt-2 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-blue-200"
            >
              <span>✏️ Edit Resume to Fix These</span>
            </button>
          )}
        </div>
      )}

      {/* ── AI IMPROVEMENTS ───────────────────────────────────────── */}
      {improvements.length > 0 && (
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-green-500" /> AI improvements made
          </p>
          <ul className="space-y-1">
            {improvements.slice(0, 3).map((imp, i) => (
              <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span> {imp}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
