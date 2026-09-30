// components/builder/ProjectsForm.tsx
"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { useResumeStore } from "@/lib/store"
import { Project } from "@/lib/types"

const emptyProject = (): Project => ({
  name: "", techStack: "", githubUrl: "", liveUrl: "", date: "", description: ""
})

export default function ProjectsForm() {
  const { resumeData, setProjects, nextStep, prevStep } = useResumeStore()
  const [entries, setEntries] = useState<Project[]>(
    resumeData.projects?.length ? resumeData.projects : [emptyProject()]
  )

  const update = (i: number, field: keyof Project, val: string) => {
    const updated = entries.map((e, idx) => idx === i ? { ...e, [field]: val } : e)
    setEntries(updated)
    setProjects(updated)
  }

  const addEntry = () => {
    const updated = [...entries, emptyProject()]
    setEntries(updated)
    setProjects(updated)
  }

  const removeEntry = (i: number) => {
    const updated = entries.filter((_, idx) => idx !== i)
    setEntries(updated)
    setProjects(updated)
  }

  const handleNext = () => {
    setProjects(entries.filter((e) => e.name))
    nextStep()
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Projects</h2>
        <p className="text-slate-600">
          Showcase your best projects.{" "}
          <span className="text-blue-600 font-medium">AI will write professional descriptions.</span>
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
                <Label>Project Name <span className="text-red-500">*</span></Label>
                <Input placeholder="e.g., AI Resume Builder"
                  value={entry.name} onChange={(e) => update(i, "name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Tech Stack</Label>
                <Input placeholder="e.g., Python, FastAPI, React"
                  value={entry.techStack} onChange={(e) => update(i, "techStack", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>GitHub URL</Label>
                <Input placeholder="github.com/yourname/project"
                  value={entry.githubUrl} onChange={(e) => update(i, "githubUrl", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Date / Duration</Label>
                <Input placeholder="e.g., Jan 2024 - Mar 2024"
                  value={entry.date} onChange={(e) => update(i, "date", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>What does it do? <span className="text-red-500">*</span></Label>
              <Textarea
                placeholder="Briefly describe what the project does and what you built..."
                className="min-h-20 resize-none"
                value={entry.description}
                onChange={(e) => update(i, "description", e.target.value)}
              />
              <p className="text-xs text-blue-600">✨ AI will make this sound professional</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={addEntry}
        className="mt-4 flex items-center gap-2 text-blue-600 text-sm font-medium">
        <Plus className="w-4 h-4" /> Add another project
      </button>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={prevStep} className="px-8">← Back</Button>
        <Button onClick={handleNext} className="px-10 bg-blue-600 hover:bg-blue-700 text-white">Next →</Button>
      </div>
    </div>
  )
}
