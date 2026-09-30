// components/builder/InternshipForm.tsx — For freshers with internship experience
"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { useResumeStore } from "@/lib/store"
import { Internship } from "@/lib/types"

const emptyInternship = (): Internship => ({
  company: "", role: "", duration: "", location: "", description: ""
})

export default function InternshipForm() {
  const { resumeData, setInternship, nextStep, prevStep } = useResumeStore()
  const [entries, setEntries] = useState<Internship[]>(
    resumeData.internship?.length ? resumeData.internship : [emptyInternship()]
  )

  const update = (i: number, field: keyof Internship, val: string) => {
    const updated = entries.map((e, idx) => idx === i ? { ...e, [field]: val } : e)
    setEntries(updated)
    setInternship(updated)
  }

  const addEntry = () => {
    const updated = [...entries, emptyInternship()]
    setEntries(updated)
    setInternship(updated)
  }

  const removeEntry = (i: number) => {
    const updated = entries.filter((_, idx) => idx !== i)
    setEntries(updated)
    setInternship(updated)
  }

  const handleNext = () => {
    setInternship(entries.filter((e) => e.company && e.role))
    nextStep()
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Internship Experience</h2>
        <p className="text-slate-600">
          Add your internship details. Don&apos;t worry about writing perfectly —{" "}
          <span className="text-blue-600 font-medium">AI will improve your descriptions.</span>
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
                <Input placeholder="e.g., TCS, Infosys, StartupXYZ"
                  value={entry.company} onChange={(e) => update(i, "company", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Role / Position <span className="text-red-500">*</span></Label>
                <Input placeholder="e.g., Python Developer Intern"
                  value={entry.role} onChange={(e) => update(i, "role", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input placeholder="e.g., June 2024 - Aug 2024 (3 months)"
                  value={entry.duration} onChange={(e) => update(i, "duration", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="e.g., Bangalore, India"
                  value={entry.location} onChange={(e) => update(i, "location", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>What did you do? <span className="text-red-500">*</span></Label>
              <Textarea
                placeholder="Write in your own words. e.g., worked on python scripts, fixed bugs, helped team with data..."
                className="min-h-24 resize-none"
                value={entry.description}
                onChange={(e) => update(i, "description", e.target.value)}
              />
              <p className="text-xs text-blue-600">✨ AI will rewrite this into professional bullet points</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={addEntry}
        className="mt-4 flex items-center gap-2 text-blue-600 text-sm font-medium">
        <Plus className="w-4 h-4" /> Add another internship
      </button>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={prevStep} className="px-8">← Back</Button>
        <Button onClick={handleNext} className="px-10 bg-blue-600 hover:bg-blue-700 text-white">Next →</Button>
      </div>
    </div>
  )
}
