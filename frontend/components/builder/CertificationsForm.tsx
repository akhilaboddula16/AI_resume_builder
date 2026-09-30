// components/builder/CertificationsForm.tsx — Final optional step
"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { useResumeStore } from "@/lib/store"
import { Certification } from "@/lib/types"

const emptyCert = (): Certification => ({ name: "", platform: "", year: "", link: "" })

export default function CertificationsForm() {
  const { resumeData, setCertifications, setCareerObjective, setAchievements, nextStep, prevStep } = useResumeStore()
  const [certs, setCerts] = useState<Certification[]>(
    resumeData.certifications?.length ? resumeData.certifications : [emptyCert()]
  )
  const [objective, setObjective] = useState(resumeData.careerObjective || "")
  const [achievements, setAchievementsLocal] = useState<string>(
    resumeData.achievements?.join("\n") || ""
  )

  const updateCert = (i: number, field: keyof Certification, val: string) => {
    const updated = certs.map((e, idx) => idx === i ? { ...e, [field]: val } : e)
    setCerts(updated)
    setCertifications(updated.filter((c) => c.name))
  }

  const addCert = () => {
    const updated = [...certs, emptyCert()]
    setCerts(updated)
    setCertifications(updated.filter((c) => c.name))
  }

  const removeCert = (i: number) => {
    const updated = certs.filter((_, idx) => idx !== i)
    setCerts(updated)
    setCertifications(updated.filter((c) => c.name))
  }

  const handleObjectiveChange = (val: string) => {
    setObjective(val)
    setCareerObjective(val)
  }

  const handleAchievementsChange = (val: string) => {
    setAchievementsLocal(val)
    setAchievements(val.split("\n").filter((a) => a.trim()))
  }

  const handleNext = () => {
    setCertifications(certs.filter((c) => c.name))
    setCareerObjective(objective)
    setAchievements(achievements.split("\n").filter((a) => a.trim()))
    nextStep()
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Almost Done! 🎉</h2>
        <p className="text-slate-600">Add certifications and optional details. All fields here are optional.</p>
      </div>

      {/* Career Objective */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border mb-4">
        <Label className="text-base font-semibold mb-3 block">Career Objective / Summary</Label>
        <Textarea
          placeholder="Write a brief career objective in your own words. AI will polish it automatically..."
          className="min-h-20 resize-none"
          value={objective}
          onChange={(e) => handleObjectiveChange(e.target.value)}
        />
        <p className="text-xs text-blue-600 mt-1">✨ AI will improve this into a professional summary</p>
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border mb-4">
        <h3 className="font-semibold text-slate-800 mb-4">Certifications</h3>
        <div className="space-y-3">
          {certs.map((cert, i) => (
            <div key={i} className="grid grid-cols-2 gap-3 relative">
              <Input placeholder="Certification name" value={cert.name}
                onChange={(e) => updateCert(i, "name", e.target.value)} />
              <Input placeholder="Platform (e.g., Coursera)" value={cert.platform}
                onChange={(e) => updateCert(i, "platform", e.target.value)} />
              <Input placeholder="Year (e.g., 2024)" value={cert.year}
                onChange={(e) => updateCert(i, "year", e.target.value)} />
              <div className="flex gap-2">
                <Input placeholder="Certificate URL" value={cert.link}
                  onChange={(e) => updateCert(i, "link", e.target.value)} />
                {certs.length > 1 && (
                  <button onClick={() => removeCert(i)}
                    className="text-red-400 hover:text-red-600 flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <button onClick={addCert}
          className="mt-3 flex items-center gap-2 text-blue-600 text-sm font-medium">
          <Plus className="w-4 h-4" /> Add certification
        </button>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6">
        <Label className="text-base font-semibold mb-3 block">Academic Achievements</Label>
        <Textarea
          placeholder={"One achievement per line:\nRanked in top 5% in university\nWon coding hackathon at XYZ college"}
          className="min-h-24 resize-none"
          value={achievements}
          onChange={(e) => handleAchievementsChange(e.target.value)}
        />
        <p className="text-xs text-slate-500 mt-1">Press Enter for each new achievement</p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} className="px-8">← Back</Button>
        <Button onClick={handleNext} className="px-10 bg-blue-600 hover:bg-blue-700 text-white">
          Generate My Resume ✨
        </Button>
      </div>
    </div>
  )
}
