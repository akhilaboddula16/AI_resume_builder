// components/builder/ExperienceForm.tsx — For experienced candidates
"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { useResumeStore } from "@/lib/store"
import { Experience } from "@/lib/types"

const emptyExp = (): Experience => ({
  company: "", jobTitle: "", location: "", fromDate: "", toDate: "", description: ""
})

export default function ExperienceForm() {
  const { resumeData, setExperience, nextStep, prevStep } = useResumeStore()
  const [entries, setEntries] = useState<Experience[]>(
    resumeData.experience?.length ? resumeData.experience : [emptyExp()]
  )

  const update = (i: number, field: keyof Experience, val: string) => {
    const updated = entries.map((e, idx) => idx === i ? { ...e, [field]: val } : e)
    setEntries(updated)
    setExperience(updated)
  }

  const addEntry = () => {
    const updated = [...entries, emptyExp()]
    setEntries(updated)
    setExperience(updated)
  }

  const removeEntry = (i: number) => {
    const updated = entries.filter((_, idx) => idx !== i)
    setEntries(updated)
    setExperience(updated)
  }

  const handleNext = () => {
    setExperience(entries.filter((e) => e.company && e.jobTitle))
    nextStep()
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Work Experience</h2>
        <p className="text-slate-600">
          Start with your most recent job.{" "}
          <span className="text-blue-600 font-medium">AI will polish your descriptions.</span>
        </p>
      </div>

      <div className="space-y-4">
        {entries.map((entry, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border relative">
            {entries.length > 1 && (
              <button onClick={() => removeEntry(i)}
                className="absolute top-4 right-4 text-red-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label>Company Name <span className="text-red-500">*</span></Label>
                <Input placeholder="e.g., Google, TCS, Startup"
                  value={entry.company} onChange={(e) => update(i, "company", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Job Title <span className="text-red-500">*</span></Label>
                <Input placeholder="e.g., Software Engineer"
                  value={entry.jobTitle} onChange={(e) => update(i, "jobTitle", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>From Date</Label>
                <Input placeholder="e.g., Jan 2022" value={entry.fromDate}
                  onChange={(e) => update(i, "fromDate", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>To Date</Label>
                <Input placeholder='e.g., Dec 2023 or "Present"' value={entry.toDate}
                  onChange={(e) => update(i, "toDate", e.target.value)} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Location</Label>
                <Input placeholder="e.g., Bangalore, India" value={entry.location}
                  onChange={(e) => update(i, "location", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>What did you do? <span className="text-red-500">*</span></Label>
              <Textarea
                placeholder="Describe your responsibilities and achievements in plain language. AI will convert to strong bullet points..."
                className="min-h-28 resize-none"
                value={entry.description}
                onChange={(e) => update(i, "description", e.target.value)}
              />
              <p className="text-xs text-blue-600">✨ AI will rewrite this with action verbs and metrics</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={addEntry}
        className="mt-4 flex items-center gap-2 text-blue-600 text-sm font-medium">
        <Plus className="w-4 h-4" /> Add another job
      </button>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={prevStep} className="px-8">← Back</Button>
        <Button onClick={handleNext} className="px-10 bg-blue-600 hover:bg-blue-700 text-white">Next →</Button>
      </div>
    </div>
  )
}
