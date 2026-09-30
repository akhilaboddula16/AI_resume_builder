// ─────────────────────────────────────────────────────────────────────────────
// components/templates/Template7_AlexWebb.tsx — DEFAULT TEMPLATE
//
// WHAT THIS FILE DOES:
//   Renders the Alex Webb resume template using @react-pdf/renderer.
//   This is the DEFAULT template (Template 7) — modern, sans-serif, ATS-friendly.
//
// TEMPLATE STYLE:
//   - Sans-serif font (Helvetica)
//   - Small-caps section headers with underline
//   - Summary at top
//   - Projects BEFORE experience
//   - Tech stack right-aligned on same line as date
//   - Filled bullet points (•)
// ─────────────────────────────────────────────────────────────────────────────

import {
  Document, Page, Text, View, StyleSheet, Link, Font
} from "@react-pdf/renderer"
// Document  = the PDF document container
// Page      = one page of the PDF
// Text      = text content
// View      = like a div/box container
// StyleSheet= create styles (similar to CSS but for PDF)
// Link      = clickable hyperlink
// Font      = register custom fonts

// ── STYLES ───────────────────────────────────────────────────────────────
// React-PDF uses a CSS-like styling system but with limitations
// (no flexbox wrap, no grid, limited properties)

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",       // Sans-serif font
    fontSize: 10,
    paddingTop: 36,
    paddingBottom: 36,
    paddingLeft: 48,
    paddingRight: 48,
    color: "#1a1a1a",
  },

  // ── HEADER ──────────────────────────────────────────────────────────────
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    marginBottom: 4,
    color: "#0f172a",
  },
  contactRow: {
    flexDirection: "row",          // Horizontal layout (like flex-row)
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 2,
    fontSize: 9,
    color: "#475569",
  },
  contactItem: {
    marginRight: 12,
  },

  // ── SECTION ─────────────────────────────────────────────────────────────
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",    // SMALL CAPS style
    color: "#0f172a",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    paddingBottom: 2,
    marginBottom: 5,
  },

  // ── ENTRY ROW ────────────────────────────────────────────────────────────
  entryRow: {
    flexDirection: "row",
    justifyContent: "space-between",  // Name on left, date on right
    marginBottom: 1,
  },
  entryTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: "#0f172a",
  },
  entrySubtitle: {
    fontSize: 9.5,
    color: "#475569",
    fontStyle: "italic",
  },
  dateText: {
    fontSize: 9,
    color: "#64748b",
  },
  techText: {
    fontSize: 9,
    color: "#3b82f6",              // Blue for tech stack
    textAlign: "right",
  },

  // ── BULLET POINTS ────────────────────────────────────────────────────────
  bulletRow: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 4,
  },
  bullet: {
    width: 10,
    fontSize: 9,
    color: "#475569",
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 1.4,
    color: "#1e293b",
  },

  // ── SKILLS ───────────────────────────────────────────────────────────────
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  skillTag: {
    backgroundColor: "#f1f5f9",
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 9,
    color: "#334155",
  },
})


// ── COMPONENT PROPS ──────────────────────────────────────────────────────
interface Template7Props {
  data: Record<string, unknown>   // Resume data from AI formatter
}

// ── HELPER: Render bullet list ────────────────────────────────────────────
const BulletList = ({ items }: { items: string[] }) => (
  <View>
    {items.map((item, i) => (
      <View key={i} style={styles.bulletRow}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>{item}</Text>
      </View>
    ))}
  </View>
)

// ── HELPER: Section title ─────────────────────────────────────────────────
const SectionTitle = ({ title }: { title: string }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
)


// ── MAIN COMPONENT ────────────────────────────────────────────────────────
export function Template7_AlexWebb({ data }: Template7Props) {
  // Safely extract data with fallbacks
  const basic = (data.basic_info as Record<string, string>) || {}
  const summary = (data.career_objective as string) || (data.summary as string) || ""
  const rawSkills = data.skills || data.technical_skills || data.technical_strengths || []
  const skills: string[] = Array.isArray(rawSkills)
    ? rawSkills.map(String)
    : typeof rawSkills === "object" && rawSkills !== null
    ? Object.values(rawSkills).flat().map(String)
    : []
  const experience = (data.experience as Record<string, unknown>[]) || []
  const internship = (data.internship as Record<string, unknown>[]) || []
  const expList = experience.length > 0 ? experience : internship
  const expTitle = experience.length > 0 ? "Experience" : "Internship / Trainings"
  const projects = (data.projects as Record<string, unknown>[]) || []
  const education = (data.education as Record<string, string>[]) || []
  const certs = (data.certifications as Record<string, string>[]) || []

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ── NAME ───────────────────────────────────────────────────── */}
        <Text style={styles.name}>{basic.name || "Your Name"}</Text>

        {/* ── CONTACT ROW ────────────────────────────────────────────── */}
        <View style={styles.contactRow}>
          {basic.email    && <Text style={styles.contactItem}>{basic.email}</Text>}
          {basic.phone    && <Text style={styles.contactItem}>{basic.phone}</Text>}
          {basic.city     && <Text style={styles.contactItem}>{basic.city}{basic.state ? `, ${basic.state}` : ""}</Text>}
          {basic.linkedin && <Link src={basic.linkedin} style={{ ...styles.contactItem, color: "#3b82f6" }}>LinkedIn</Link>}
          {basic.github   && <Link src={basic.github}   style={{ ...styles.contactItem, color: "#3b82f6" }}>GitHub</Link>}
        </View>

        {/* ── SUMMARY ────────────────────────────────────────────────── */}
        {summary && (
          <View style={styles.section}>
            <SectionTitle title="Summary" />
            <Text style={{ fontSize: 9.5, lineHeight: 1.5, color: "#334155" }}>{summary}</Text>
          </View>
        )}

        {/* ── TECHNICAL SKILLS ───────────────────────────────────────── */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <SectionTitle title="Technical Skills" />
            <View style={styles.skillsRow}>
              {skills.map((s, i) => (
                <Text key={i} style={styles.skillTag}>{s}</Text>
              ))}
            </View>
          </View>
        )}

        {/* ── PROJECTS (before experience — Template 7 style) ─────────── */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <SectionTitle title="Projects" />
            {projects.map((proj, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryTitle}>{proj.name as string}</Text>
                  <Text style={styles.dateText}>{proj.date as string}</Text>
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", marginBottom: 2 }}>
                  {Boolean(proj.tech_stack) && (
                    <Text style={styles.techText}>{proj.tech_stack as string}</Text>
                  )}
                  {Boolean(proj.github_url) && (
                    <Link src={proj.github_url as string} style={{ fontSize: 8.5, color: "#2563eb", marginLeft: 6 }}>
                      [{proj.github_url as string}]
                    </Link>
                  )}
                  {Boolean(proj.live_url) && (
                    <Link src={proj.live_url as string} style={{ fontSize: 8.5, color: "#2563eb", marginLeft: 6 }}>
                      [Live Demo]
                    </Link>
                  )}
                </View>
                <BulletList items={(proj.bullets as string[]) || [proj.description as string]} />
              </View>
            ))}
          </View>
        )}

        {/* ── EXPERIENCE OR INTERNSHIP ───────────────────────────────── */}
        {expList.length > 0 && (
          <View style={styles.section}>
            <SectionTitle title={expTitle} />
            {expList.map((exp, i) => (
              <View key={i} style={{ marginBottom: 7 }}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryTitle}>{(exp.job_title || exp.role) as string}</Text>
                  <Text style={styles.dateText}>{(exp.from_date ? `${exp.from_date} – ${exp.to_date || "Present"}` : exp.duration) as string}</Text>
                </View>
                <Text style={styles.entrySubtitle}>{exp.company as string}{exp.location ? ` · ${exp.location}` : ""}</Text>
                <BulletList items={(exp.bullets as string[]) || [exp.description as string]} />
              </View>
            ))}
          </View>
        )}

        {/* ── EDUCATION ──────────────────────────────────────────────── */}
        {education.length > 0 && (
          <View style={styles.section}>
            <SectionTitle title="Education" />
            {education.map((edu, i) => (
              <View key={i} style={{ marginBottom: 5 }}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryTitle}>{edu.degree} — {edu.institution}</Text>
                  <Text style={styles.dateText}>{edu.year_from} – {edu.year_to}</Text>
                </View>
                {edu.cgpa && <Text style={styles.entrySubtitle}>CGPA: {edu.cgpa}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* ── CERTIFICATIONS ─────────────────────────────────────────── */}
        {certs.length > 0 && (
          <View style={styles.section}>
            <SectionTitle title="Certifications" />
            {certs.map((cert, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
                <Text style={{ fontSize: 9.5 }}>
                  • {cert.name}{cert.platform ? ` — ${cert.platform}` : ""}{cert.year ? ` (${cert.year})` : ""}
                </Text>
                {Boolean(cert.link) && (
                  <Link src={cert.link} style={{ fontSize: 8.5, color: "#2563eb", marginLeft: 6 }}>
                    [Verify Credential]
                  </Link>
                )}
              </View>
            ))}
          </View>
        )}

      </Page>
    </Document>
  )
}
