// ─────────────────────────────────────────────────────────────────────────────
// components/preview/BuilderLivePreview.tsx
//
// WHAT THIS FILE DOES:
//   Provides a real-time, interactive Live Preview side panel while the user
//   is filling out the resume details in the builder!
//   Updates dynamically with every keystroke and reflects the chosen template style.
// ─────────────────────────────────────────────────────────────────────────────

"use client"

import React from "react"
import { useResumeStore } from "@/lib/store"
import { TemplateId, BasicInfo } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Eye, Sparkles } from "lucide-react"

export default function BuilderLivePreview() {
  const { resumeData, templateId, setTemplateId } = useResumeStore()

  const basic = (resumeData.basicInfo || {}) as Partial<BasicInfo>
  const edu = resumeData.education || []
  const exp = resumeData.experience || []
  const intern = resumeData.internship || []
  const skills = resumeData.skills || []
  const projects = resumeData.projects || []
  const certs = resumeData.certifications || []
  const objective = resumeData.careerObjective || ""
  const achievements = resumeData.achievements || []

  const isSerif = [1, 2, 3, 4, 5, 6].includes(templateId)

  return (
    <div className="flex flex-col h-full bg-slate-100/80 rounded-2xl border border-slate-200/80 shadow-inner overflow-hidden">
      {/* Top Bar with Template Selector and status */}
      <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Live Preview
          </span>
          <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
            Real-Time
          </Badge>
        </div>

        {/* Quick Template Switcher Dropdown */}
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-slate-500 font-medium hidden sm:inline">Template:</label>
          <select
            value={templateId}
            onChange={(e) => setTemplateId(Number(e.target.value) as TemplateId)}
            className="text-xs font-medium border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={7}>Template 7: Alex Webb (Modern Tech)</option>
            <option value={1}>Template 1: A Kumar (Academic Classic)</option>
            <option value={2}>Template 2: Shaila Ang (Corporate)</option>
            <option value={3}>Template 3: Nishchay (Table Education)</option>
            <option value={4}>Template 4: Rishi Shah (Engineering Projects)</option>
            <option value={5}>Template 5: Pooja Panwar (Traditional)</option>
            <option value={6}>Template 6: Tamal Barman (NIT College Style)</option>
            <option value={8}>Template 8: Harshibar (Startup / American)</option>
          </select>
        </div>
      </div>

      {/* A4 Paper Canvas Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center items-start">
        <div
          className={`w-full max-w-[560px] min-h-[740px] bg-white rounded-lg shadow-md border border-slate-300/80 p-8 transition-all ${
            isSerif ? "font-serif text-slate-900" : "font-sans text-slate-800"
          }`}
          style={{ fontSize: "11px", lineHeight: "1.4" }}
        >
          {/* HEADER SECTION */}
          {templateId === 6 ? (
            /* Tamal Barman Header (Logo Left + Name Right) */
            <div className="flex items-start gap-4 pb-3 mb-4 border-b border-black">
              <div className="w-12 h-12 border border-slate-300 rounded flex items-center justify-center text-[9px] text-slate-400 font-sans text-center leading-tight bg-slate-50">
                COLLEGE<br />LOGO
              </div>
              <div className="flex-1">
                <h1 className="text-lg font-bold tracking-tight text-slate-900">
                  {basic.name || "Your Full Name"}
                </h1>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  {[basic.email, basic.phone, basic.city].filter(Boolean).join(" | ") || "email@domain.com | +91 9876543210 | Bangalore"}
                </p>
                {(basic.linkedin || basic.github) && (
                  <p className="text-[10px] text-blue-600 mt-0.5">
                    {[basic.linkedin, basic.github].filter(Boolean).join(" | ")}
                  </p>
                )}
              </div>
            </div>
          ) : templateId === 8 ? (
            /* Harshibar Header (Left Aligned with Icons) */
            <div className="pb-3 mb-4 border-b border-slate-900">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {basic.name || "Your Full Name"}
              </h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-600 mt-1 font-sans">
                {basic.email && <span>✉ {basic.email}</span>}
                {basic.phone && <span>📞 {basic.phone}</span>}
                {basic.city && <span>📍 {basic.city}</span>}
                {basic.linkedin && <span className="text-blue-600">🔗 {basic.linkedin}</span>}
                {basic.github && <span className="text-slate-800">⌨ {basic.github}</span>}
                {!basic.email && !basic.phone && (
                  <span className="text-slate-400 italic">✉ email@domain.com • 📞 +91 9876543210 • 📍 Location</span>
                )}
              </div>
            </div>
          ) : (
            /* Centered / Alex Webb / Classic Header */
            <div className={`pb-3 mb-3 ${templateId === 7 ? "text-left" : "text-center"}`}>
              <h1 className={`text-xl font-bold tracking-tight ${templateId === 7 ? "font-sans uppercase tracking-wider text-slate-900" : ""}`}>
                {basic.name || "YOUR FULL NAME"}
              </h1>
              <div className={`flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-slate-600 mt-1 ${templateId === 7 ? "justify-start font-sans" : "justify-center"}`}>
                <span>{basic.email || "email@example.com"}</span>
                <span>•</span>
                <span>{basic.phone || "+91 98765 43210"}</span>
                {basic.city && (
                  <>
                    <span>•</span>
                    <span>{basic.city}{basic.state ? `, ${basic.state}` : ""}</span>
                  </>
                )}
                {basic.linkedin && (
                  <>
                    <span>•</span>
                    <span className="text-blue-600 underline">{basic.linkedin}</span>
                  </>
                )}
                {basic.github && (
                  <>
                    <span>•</span>
                    <span className="text-blue-600 underline">{basic.github}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* CAREER OBJECTIVE / SUMMARY */}
          {objective ? (
            <div className="mb-3">
              <h2 className="text-[11px] font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1 text-slate-900">
                {templateId === 7 ? "Professional Summary" : templateId === 4 ? "Carrier Objective" : "Career Objective"}
              </h2>
              <p className="text-[10px] text-slate-700 leading-relaxed">{objective}</p>
            </div>
          ) : null}

          {/* EDUCATION SECTION (Table for T3 & T6, List for others) */}
          <div className="mb-3">
            <h2 className="text-[11px] font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1 text-slate-900">
              Education
            </h2>
            {edu.length > 0 ? (
              templateId === 3 || templateId === 6 ? (
                /* 5-col / 4-col table */
                <table className="w-full text-[9.5px] border-collapse mt-1">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-50 font-semibold text-slate-800">
                      <th className="py-1 px-1.5 text-left">Course / Degree</th>
                      <th className="py-1 px-1.5 text-left">Institution</th>
                      {templateId === 3 && <th className="py-1 px-1.5 text-left">Board/Univ</th>}
                      <th className="py-1 px-1.5 text-right">Year</th>
                      <th className="py-1 px-1.5 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {edu.map((e, idx) => (
                      <tr key={idx} className="border-b border-slate-200">
                        <td className="py-1 px-1.5 font-medium">{e.degree || "B.Tech Computer Science"}</td>
                        <td className="py-1 px-1.5 text-slate-600">{e.institution || "College / University"}</td>
                        {templateId === 3 && <td className="py-1 px-1.5 text-slate-500">{e.boardUniversity || "-"}</td>}
                        <td className="py-1 px-1.5 text-right text-slate-600">{e.yearTo || e.yearFrom || "2024"}</td>
                        <td className="py-1 px-1.5 text-right font-medium">{e.cgpa ? `${e.cgpa} CGPA` : e.percentage ? `${e.percentage}%` : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="space-y-1.5">
                  {edu.map((e, idx) => (
                    <div key={idx} className="text-[10px]">
                      <div className="flex justify-between font-semibold text-slate-800">
                        <span>{e.institution || "College / University Name"}</span>
                        <span className="font-normal text-slate-500">{e.yearFrom ? `${e.yearFrom} – ` : ""}{e.yearTo || "Present"}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 italic">
                        <span>{e.degree || "Degree Name"}{e.department ? `, ${e.department}` : ""}</span>
                        {e.cgpa ? <span>CGPA: {e.cgpa}</span> : e.percentage ? <span>{e.percentage}%</span> : null}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <p className="text-[10px] text-slate-400 italic">Add education in the form to see it here...</p>
            )}
          </div>

          {/* TECHNICAL SKILLS SECTION */}
          <div className="mb-3">
            <h2 className="text-[11px] font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1 text-slate-900">
              Technical Skills
            </h2>
            {skills.length > 0 ? (
              templateId === 1 ? (
                /* Two column courses for T1 */
                <div className="grid grid-cols-2 gap-x-4 text-[10px] text-slate-700">
                  {skills.map((s, idx) => (
                    <div key={idx}>• {s}</div>
                  ))}
                </div>
              ) : templateId === 7 ? (
                /* Modern Pills for Alex Webb */
                <div className="flex flex-wrap gap-1 mt-1 font-sans">
                  {skills.map((s, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[9px] font-medium border border-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-slate-700 leading-relaxed">
                  {skills.join(" • ")}
                </p>
              )
            ) : (
              <p className="text-[10px] text-slate-400 italic">Add your skills to see them here...</p>
            )}
          </div>

          {/* EXPERIENCE OR INTERNSHIPS */}
          {(exp.length > 0 || intern.length > 0) && (
            <div className="mb-3">
              <h2 className="text-[11px] font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1 text-slate-900">
                {exp.length > 0 ? "Work Experience" : "Internship / Trainings"}
              </h2>
              <div className="space-y-2 mt-1">
                {[...exp, ...intern].map((item, idx) => {
                  const role = "jobTitle" in item ? item.jobTitle : item.role
                  const dates = "fromDate" in item ? `${item.fromDate} – ${item.toDate || "Present"}` : item.duration
                  return (
                    <div key={idx} className="text-[10px]">
                      <div className="flex justify-between font-semibold text-slate-800">
                        <span>{role || "Job Role / Title"}</span>
                        <span className="font-normal text-slate-500">{dates || "Duration"}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 italic mb-0.5">
                        <span>{item.company || "Company Name"}</span>
                        {item.location && <span>{item.location}</span>}
                      </div>
                      <p className="text-[9.5px] text-slate-600 whitespace-pre-line pl-2 border-l border-slate-200">
                        {item.description || "• Description will be polished with action verbs by AI"}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* PROJECTS SECTION */}
          {projects.length > 0 && (
            <div className="mb-3">
              <h2 className="text-[11px] font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1 text-slate-900">
                Projects
              </h2>
              <div className="space-y-2 mt-1">
                {projects.map((p, idx) => (
                  <div key={idx} className="text-[10px]">
                    <div className="flex justify-between font-semibold text-slate-800">
                      <span>{p.name || "Project Name"}</span>
                      {p.date && <span className="font-normal text-slate-500">{p.date}</span>}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 text-[9.5px]">
                      {p.techStack && (
                        <span className="text-blue-600 font-sans font-medium">{p.techStack}</span>
                      )}
                      {p.githubUrl && (
                        <a
                          href={p.githubUrl.startsWith("http") ? p.githubUrl : `https://${p.githubUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline font-mono text-[9px]"
                        >
                          🔗 {p.githubUrl.replace(/^https?:\/\//, "")}
                        </a>
                      )}
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl.startsWith("http") ? p.liveUrl : `https://${p.liveUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:underline font-mono text-[9px]"
                        >
                          🌐 Live Demo
                        </a>
                      )}
                    </div>
                    <p className="text-[9.5px] text-slate-600 whitespace-pre-line pl-2 border-l border-slate-200 mt-0.5">
                      {p.description || "• Developed application features and integrated core architecture."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS SECTION */}
          {certs.length > 0 && (
            <div className="mb-2">
              <h2 className="text-[11px] font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1 text-slate-900">
                Certifications
              </h2>
              <ul className="text-[9.5px] text-slate-700 list-disc list-inside space-y-0.5 mt-0.5">
                {certs.map((c, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{c.name}</span>
                    {c.platform ? ` — ${c.platform}` : ""}
                    {c.year ? ` (${c.year})` : ""}
                    {c.link && (
                      <a
                        href={c.link.startsWith("http") ? c.link : `https://${c.link}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline ml-1.5 font-mono text-[9px]"
                      >
                        [🔗 Credential]
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {achievements.length > 0 && (
            <div className="mb-2">
              <h2 className="text-[11px] font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1 text-slate-900">
                Achievements
              </h2>
              <ul className="text-[9.5px] text-slate-700 list-disc list-inside space-y-0.5 mt-0.5">
                {achievements.map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Banner Footer */}
          <div className="mt-6 pt-2 border-t border-dashed border-slate-200 text-center">
            <span className="inline-flex items-center gap-1 text-[9px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-sans">
              <Sparkles className="w-2.5 h-2.5" /> Live preview updates as you type • AI will polish content on submit
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
