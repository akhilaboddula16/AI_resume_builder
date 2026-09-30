// ─────────────────────────────────────────────────────────────────────────────
// components/builder/EducationForm.tsx — Education Step
// ─────────────────────────────────────────────────────────────────────────────
"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import { useResumeStore } from "@/lib/store"
import { Education } from "@/lib/types"

const emptyEducation = (): Education => ({
  degree: "", institution: "", boardUniversity: "",
  yearFrom: "", yearTo: "", cgpa: "", percentage: "",
  department: "", location: "",
})

export default function EducationForm() {
  const { resumeData, setEducation, nextStep, prevStep, userType } = useResumeStore()
  const [entries, setEntries] = useState<Education[]>(
    resumeData.education?.length ? resumeData.education : [emptyEducation()]
  )

  const update = (i: number, field: keyof Education, val: string) => {
    const updated = entries.map((e, idx) => idx === i ? { ...e, [field]: val } : e)
    setEntries(updated)
    setEducation(updated)
  }
  const addEntry = () => {
    const updated = [...entries, emptyEducation()]
    setEntries(updated)
    setEducation(updated)
  }
  const removeEntry = (i: number) => {
    const updated = entries.filter((_, idx) => idx !== i)
    setEntries(updated)
    setEducation(updated)
  }

  const handleNext = () => {
    setEducation(entries.filter((e) => e.degree && e.institution))
    nextStep()
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Education</h2>
        <p className="text-slate-600">
          Add your degrees, diplomas, and qualifications.
          {userType === "fresher" && " You can also add 10th and 12th marks."}
        </p>
      </div>

      <div className="space-y-4">
        {entries.map((entry, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border relative">
            {entries.length > 1 && (
              <button
                onClick={() => removeEntry(i)}
                className="absolute top-4 right-4 text-red-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <h3 className="font-semibold text-slate-700 mb-4">
              {i === 0 ? "Highest Qualification" : `Education ${i + 1}`}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Degree / Course <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="e.g., B.Tech, 12th, MBA"
                  value={entry.degree}
                  onChange={(e) => update(i, "degree", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Institution <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="e.g., IIT Bombay"
                  value={entry.institution}
                  onChange={(e) => update(i, "institution", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Board / University</Label>
                <Input
                  placeholder="e.g., CBSE, Anna University"
                  value={entry.boardUniversity}
                  onChange={(e) => update(i, "boardUniversity", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Department / Field</Label>
                <Input
                  placeholder="e.g., Computer Science"
                  value={entry.department}
                  onChange={(e) => update(i, "department", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>From Year</Label>
                <Input
                  placeholder="e.g., 2020"
                  value={entry.yearFrom}
                  onChange={(e) => update(i, "yearFrom", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>To Year</Label>
                <Input
                  placeholder='e.g., 2024 or "Present"'
                  value={entry.yearTo}
                  onChange={(e) => update(i, "yearTo", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>CGPA</Label>
                <Input
                  placeholder="e.g., 8.5"
                  value={entry.cgpa}
                  onChange={(e) => update(i, "cgpa", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Percentage</Label>
                <Input
                  placeholder="e.g., 85%"
                  value={entry.percentage}
                  onChange={(e) => update(i, "percentage", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addEntry}
        className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
      >
        <Plus className="w-4 h-4" /> Add another education entry
      </button>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={prevStep} className="px-8">← Back</Button>
        <Button onClick={handleNext} className="px-10 bg-blue-600 hover:bg-blue-700 text-white">
          Next →
        </Button>
      </div>
    </div>
  )
}
