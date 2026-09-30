// components/templates/Template8_Harshibar.tsx — Clean American style, icons in header
import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, paddingTop: 36, paddingBottom: 36, paddingLeft: 48, paddingRight: 48, color: "#1a1a1a" },
  name: { fontSize: 20, fontFamily: "Helvetica-Bold", marginBottom: 3, color: "#0f172a" },
  contactRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8, fontSize: 9, color: "#475569" },
  contactItem: { marginRight: 14 },
  divider: { borderBottomWidth: 1.5, borderBottomColor: "#0f172a", marginBottom: 10 },
  section: { marginTop: 9 },
  sectionTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 1, borderBottomWidth: 0.5, borderBottomColor: "#94a3b8", paddingBottom: 2, marginBottom: 5, color: "#0f172a" },
  entryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
  titleBold: { fontFamily: "Helvetica-Bold", fontSize: 10 },
  subtitle: { fontSize: 9.5, color: "#475569" },
  dateText: { fontSize: 9, color: "#64748b" },
  bulletRow: { flexDirection: "row", marginBottom: 1.5, paddingLeft: 4 },
  bullet: { width: 10, fontSize: 9, color: "#334155" },
  bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.4 },
  skillsText: { fontSize: 9.5, lineHeight: 1.5 },
})

const BulletList = ({ items }: { items: string[] }) => (
  <View>{items.map((item, i) => (
    <View key={i} style={styles.bulletRow}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.bulletText}>{item}</Text>
    </View>
  ))}</View>
)

interface Props { data: Record<string, unknown> }

export function Template8_Harshibar({ data }: Props) {
  const basic = (data.basic_info as Record<string, string>) || {}
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
  const objective = (data.career_objective as string) || (data.summary as string) || ""
  const achievements = (data.achievements as string[]) || []

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{basic.name || "Your Name"}</Text>
        <View style={styles.contactRow}>
          {basic.email    && <Text style={styles.contactItem}>✉ {basic.email}</Text>}
          {basic.phone    && <Text style={styles.contactItem}>📞 {basic.phone}</Text>}
          {basic.city     && <Text style={styles.contactItem}>📍 {basic.city}</Text>}
          {basic.linkedin && <Text style={styles.contactItem}>🔗 {basic.linkedin}</Text>}
          {basic.github   && <Text style={styles.contactItem}>⌨ {basic.github}</Text>}
        </View>
        <View style={styles.divider} />

        {/* Career Objective / Summary */}
        {Boolean(objective) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={{ fontSize: 9.5, lineHeight: 1.45, color: "#334155" }}>{objective}</Text>
          </View>
        )}

        {/* Experience or Internship */}
        {expList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{expTitle}</Text>
            {expList.map((exp, i) => (
              <View key={i} style={{ marginBottom: 7 }}>
                <View style={styles.entryRow}>
                  <Text style={styles.titleBold}>{(exp.job_title || exp.role) as string}</Text>
                  <Text style={styles.dateText}>{((exp.from_date ? `${exp.from_date} – ${exp.to_date || "Present"}` : exp.duration)) as string}</Text>
                </View>
                <Text style={styles.subtitle}>{exp.company as string}{exp.location ? `, ${exp.location}` : ""}</Text>
                <BulletList items={(exp.bullets as string[]) || [exp.description as string]} />
              </View>
            ))}
          </View>
        )}

        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <Text style={styles.skillsText}>{skills.join("  •  ")}</Text>
          </View>
        )}

        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((proj, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <View style={styles.entryRow}>
                  <Text style={styles.titleBold}>{proj.name as string}</Text>
                  {Boolean(proj.date) && <Text style={styles.dateText}>{proj.date as string}</Text>}
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", marginBottom: 2 }}>
                  {Boolean(proj.tech_stack) && <Text style={styles.subtitle}>{proj.tech_stack as string}</Text>}
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

        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, i) => (
              <View key={i} style={{ marginBottom: 4 }}>
                <View style={styles.entryRow}>
                  <Text style={styles.titleBold}>{edu.degree} — {edu.institution}</Text>
                  <Text style={styles.dateText}>{edu.year_to}</Text>
                </View>
                {edu.cgpa && <Text style={styles.subtitle}>CGPA: {edu.cgpa}</Text>}
              </View>
            ))}
          </View>
        )}

        {certs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certs.map((c, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
                <Text style={{ fontSize: 9.5 }}>• {c.name}{c.platform ? ` — ${c.platform}` : ""}{c.year ? ` (${c.year})` : ""}</Text>
                {Boolean(c.link) && (
                  <Link src={c.link} style={{ fontSize: 8.5, color: "#2563eb", marginLeft: 6 }}>
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
