// ─────────────────────────────────────────────────────────────────────────────
// components/builder/BasicInfoForm.tsx
//
// WHAT THIS FILE DOES:
//   Form for collecting personal information:
//   Name, Email, Phone, LinkedIn, GitHub, City, State
//   This is Step 2 of the builder.
// ─────────────────────────────────────────────────────────────────────────────

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useResumeStore } from "@/lib/store"
import { BasicInfo } from "@/lib/types"

export default function BasicInfoForm() {
  const { resumeData, setBasicInfo, nextStep, prevStep } = useResumeStore()

  // Local form state — starts with existing data if user goes back to edit
  const [form, setForm] = useState<BasicInfo>({
    name: resumeData.basicInfo?.name || "",
    email: resumeData.basicInfo?.email || "",
    phone: resumeData.basicInfo?.phone || "",
    linkedin: resumeData.basicInfo?.linkedin || "",
    github: resumeData.basicInfo?.github || "",
    portfolio: resumeData.basicInfo?.portfolio || "",
    city: resumeData.basicInfo?.city || "",
    state: resumeData.basicInfo?.state || "",
    address: resumeData.basicInfo?.address || "",
  })

  // Simple validation state
  const [errors, setErrors] = useState<Partial<BasicInfo>>({})

  const handleChange = (field: keyof BasicInfo, value: string) => {
    const updated = { ...form, [field]: value }
    setForm(updated)
    setBasicInfo(updated)
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<BasicInfo> = {}
    if (!form.name.trim()) newErrors.name = "Name is required"
    if (!form.email.trim()) newErrors.email = "Email is required"
    if (!form.phone.trim()) newErrors.phone = "Phone is required"
    // Basic email format check
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email address"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
    // Returns true if no errors
  }

  const handleNext = () => {
    if (!validate()) return   // Stop if validation fails
    setBasicInfo(form)        // Save to global store
    nextStep()                // Move to next step
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Personal Information</h2>
        <p className="text-slate-600">This appears at the top of your resume.</p>
      </div>

      <div className="space-y-6 bg-white rounded-2xl p-6 shadow-sm border">

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g., Karthik Sharma"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={errors.name ? "border-red-400" : ""}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Email + Phone in a row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={errors.email ? "border-red-400" : ""}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              placeholder="+91 9999999999"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={errors.phone ? "border-red-400" : ""}
            />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
          </div>
        </div>

        {/* LinkedIn + GitHub */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn URL <span className="text-slate-400 text-xs">(optional)</span></Label>
            <Input
              id="linkedin"
              placeholder="linkedin.com/in/yourname"
              value={form.linkedin}
              onChange={(e) => handleChange("linkedin", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub URL <span className="text-slate-400 text-xs">(optional)</span></Label>
            <Input
              id="github"
              placeholder="github.com/yourname"
              value={form.github}
              onChange={(e) => handleChange("github", e.target.value)}
            />
          </div>
        </div>

        {/* City + State */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City <span className="text-slate-400 text-xs">(optional)</span></Label>
            <Input
              id="city"
              placeholder="e.g., Bangalore"
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State <span className="text-slate-400 text-xs">(optional)</span></Label>
            <Input
              id="state"
              placeholder="e.g., Karnataka"
              value={form.state}
              onChange={(e) => handleChange("state", e.target.value)}
            />
          </div>
        </div>

        {/* Address (for templates that show it) */}
        <div className="space-y-2">
          <Label htmlFor="address">Address <span className="text-slate-400 text-xs">(optional — for some templates)</span></Label>
          <Input
            id="address"
            placeholder="e.g., 123 MG Road, Bangalore"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={prevStep} className="px-8">
          ← Back
        </Button>
        <Button
          onClick={handleNext}
          className="px-10 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Next: Education →
        </Button>
      </div>
    </div>
  )
}
