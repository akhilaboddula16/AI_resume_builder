// components/builder/SkillsForm.tsx
"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Zap, Plus } from "lucide-react"
import { useResumeStore } from "@/lib/store"
import { getSuggestedSkills } from "@/lib/api"

export default function SkillsForm() {
  const { resumeData, setSkills, setJobTitle, nextStep, prevStep } = useResumeStore()
  const [skills, setLocalSkills] = useState<string[]>(resumeData.skills || [])
  const [inputValue, setInputValue] = useState("")
  const [jobTitleInput, setJobTitleInput] = useState(resumeData.jobTitle || "")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)

  const addSkill = (skill: string) => {
    const trimmed = skill.trim()
    if (trimmed && !skills.includes(trimmed)) {
      const updated = [...skills, trimmed]
      setLocalSkills(updated)
      setSkills(updated)
    }
    setInputValue("")
  }

  const removeSkill = (skill: string) => {
    const updated = skills.filter((s) => s !== skill)
    setLocalSkills(updated)
    setSkills(updated)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Add skill when user presses Enter or comma
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addSkill(inputValue)
    }
  }

  const fetchSuggestions = async () => {
    if (!jobTitleInput.trim()) return
    setIsLoadingSuggestions(true)
    try {
      const result = await getSuggestedSkills(jobTitleInput, resumeData.userType || "fresher")
      setSuggestions(result.skills.filter((s) => !skills.includes(s)))
    } catch {
      setSuggestions(["Python", "SQL", "Git", "Communication", "Problem Solving"])
      // Fallback suggestions if API fails
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  const handleNext = () => {
    if (jobTitleInput) setJobTitle(jobTitleInput)
    setSkills(skills)
    nextStep()
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Skills</h2>
        <p className="text-slate-600">Enter your skills or let AI suggest them based on your job title.</p>
      </div>

      {/* AI Suggestions */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6">
        <p className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4" /> Get AI skill suggestions
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Enter your target job title (e.g., Python Developer)"
            value={jobTitleInput}
            onChange={(e) => setJobTitleInput(e.target.value)}
            className="bg-white"
          />
          <Button
            onClick={fetchSuggestions}
            disabled={isLoadingSuggestions}
            className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
          >
            {isLoadingSuggestions ? "Loading..." : "Suggest Skills"}
          </Button>
        </div>

        {/* Suggestion chips */}
        {suggestions.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-blue-700 mb-2">Click to add:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s}
                  onClick={() => { addSkill(s); setSuggestions((p) => p.filter((x) => x !== s)) }}
                  className="text-xs px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                  + {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Manual skill input */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <Label className="mb-3 block">Your Skills</Label>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Type a skill and press Enter or comma"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button variant="outline" onClick={() => addSkill(inputValue)}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Skills tags */}
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary"
                className="px-3 py-1.5 text-sm flex items-center gap-1.5 bg-slate-100">
                {skill}
                <button onClick={() => removeSkill(skill)} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">No skills added yet. Type above or use AI suggestions.</p>
        )}

        <p className="text-xs text-slate-500 mt-3">{skills.length} skills added</p>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={prevStep} className="px-8">← Back</Button>
        <Button onClick={handleNext} disabled={skills.length === 0}
          className="px-10 bg-blue-600 hover:bg-blue-700 text-white">
          Next: Projects →
        </Button>
      </div>
    </div>
  )
}
