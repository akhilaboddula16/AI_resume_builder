// ─────────────────────────────────────────────────────────────────────────────
// components/preview/LivePreview.tsx
//
// WHAT THIS FILE DOES:
//   Renders the live PDF preview of the resume in the browser.
//   Uses React-PDF's PDFViewer to show the PDF inline.
//   Also provides a download button for the PDF.
//
// HOW REACT-PDF WORKS:
//   - We pick the correct template component based on templateId
//   - Pass the AI-generated resume data to it
//   - React-PDF renders it as a real PDF in the browser
//   - User can download it as a .pdf file
// ─────────────────────────────────────────────────────────────────────────────
"use client"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TemplateId } from "@/lib/types"

// Import all 8 template components
import { Template1_AKumar }    from "@/components/templates/Template1_AKumar"
import { Template2_ShailaAng } from "@/components/templates/Template2_ShailaAng"
import { Template3_Nishchay }  from "@/components/templates/Template3_Nishchay"
import { Template4_RishiShah } from "@/components/templates/Template4_RishiShah"
import { Template5_Pooja }     from "@/components/templates/Template5_Pooja"
import { Template6_Tamal }     from "@/components/templates/Template6_Tamal"
import { Template7_AlexWebb }  from "@/components/templates/Template7_AlexWebb"
import { Template8_Harshibar } from "@/components/templates/Template8_Harshibar"

// Dynamic import for PDFViewer and PDFDownloadLink
// WHY DYNAMIC IMPORT?
//   React-PDF uses browser APIs (canvas, blobs) that don't exist during
//   Next.js server-side rendering. Dynamic import with ssr:false loads it
//   only in the browser.
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFViewer),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full text-slate-500">Loading PDF preview...</div> }
)

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  { ssr: false }
)

interface LivePreviewProps {
  resumeData: Record<string, unknown>   // Polished resume data from AI
  templateId: TemplateId                 // Which template to render
  candidateName?: string                 // For the PDF filename
}

// Map template IDs to their components
const TEMPLATE_MAP: Record<TemplateId, React.ComponentType<{ data: Record<string, unknown> }>> = {
  1: Template1_AKumar,
  2: Template2_ShailaAng,
  3: Template3_Nishchay,
  4: Template4_RishiShah,
  5: Template5_Pooja,
  6: Template6_Tamal,
  7: Template7_AlexWebb,
  8: Template8_Harshibar,
}

export default function LivePreview({ resumeData, templateId, candidateName }: LivePreviewProps) {
  const [isClient, setIsClient] = useState(false)

  // Only render on client-side (React-PDF needs browser APIs)
  useEffect(() => { setIsClient(true) }, [])

  // Get the correct template component
  const TemplateComponent = TEMPLATE_MAP[templateId] || Template7_AlexWebb
  const fileName = `${candidateName?.replace(/\s+/g, "_") || "Resume"}_Resume.pdf`

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-96 bg-slate-100 rounded-xl">
        <p className="text-slate-500">Loading preview...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Download Button */}
      <PDFDownloadLink
        document={<TemplateComponent data={resumeData} />}
        fileName={fileName}
      >
        {({ loading }) => (
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 text-base rounded-xl"
            disabled={loading}
          >
            <Download className="w-5 h-5 mr-2" />
            {loading ? "Preparing PDF..." : "Download Resume PDF"}
          </Button>
        )}
      </PDFDownloadLink>

      {/* Inline PDF Viewer */}
      <div className="border rounded-xl overflow-hidden shadow-sm" style={{ height: "800px" }}>
        <PDFViewer width="100%" height="100%" showToolbar={false}>
          <TemplateComponent data={resumeData} />
        </PDFViewer>
      </div>
    </div>
  )
}
