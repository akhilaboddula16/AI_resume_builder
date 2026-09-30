import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: { fontFamily: "Times-Roman", fontSize: 10, paddingTop: 36, paddingBottom: 36, paddingLeft: 48, paddingRight: 48 },
  name: { fontSize: 18, fontFamily: "Times-Bold", textAlign: "center", marginBottom: 2 },
  contactRow: { flexDirection: "row", justifyContent: "center", flexWrap: "wrap", fontSize: 9.5, color: "#333", marginBottom: 6 },
  contactItem: { marginHorizontal: 8 },
  divider: { borderBottomWidth: 1, borderBottomColor: "#000", marginBottom: 8 },
  section: { marginTop: 8 },
  sectionTitle: { fontFamily: "Times-Bold", fontSize: 11, textTransform: "uppercase", borderBottomWidth: 0.5, borderBottomColor: "#000", paddingBottom: 1, marginBottom: 4 },
  entryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
  titleBold: { fontFamily: "Times-Bold", fontSize: 10 },
  subtitle: { fontSize: 9.5, color: "#444" },
  dateText: { fontSize: 9.5, color: "#444" },
  bulletRow: { flexDirection: "row", marginBottom: 1.5, paddingLeft: 6 },
  bulletDot: { width: 10, fontSize: 10 },
  bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.4 },
  twoCol: { flexDirection: "row" },
  colLeft: { flex: 1 },
  colRight: { flex: 1 },
  courseItem: { fontSize: 9.5, marginBottom: 1 },
})

const BulletList = ({ items }: { items: string[] }) => (
  <View>{items.map((item, i) => (
    <View key={i} style={styles.bulletRow}>
      <Text style={styles.bulletDot}>·</Text>
      <Text style={styles.bulletText}>{item}</Text>
    </View>
  ))}</View>
)

interface Props { data: Record<string, unknown> }

export function Template1_AKumar({ data }: Props) {
  const basic = (data.basic_info as Record<string, string>) || {}
  const summary = (data.career_objective as string) || (data.summary as string) || ""
  const education = (data.education as Record<string, string>[]) || []
  const experience = (data.experience as Record<string, unknown>[]) || []
  const internship = (data.internship as Record<string, unknown>[]) || []
  const rawSkills = data.skills || data.technical_skills || data.technical_strengths || []
  const skills: string[] = Array.isArray(rawSkills)
    ? rawSkills.map(String)
    : typeof rawSkills === "object" && rawSkills !== null
    ? Object.values(rawSkills).flat().map(String)
    : []
  const projects = (data.projects as Record<string, unknown>[]) || []
  const certs = (data.certifications as Record<string, string>[]) || []
  const achievements = (data.achievements as string[]) || []

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{basic.name || "Your Name"}</Text>
        <View style={styles.contactRow}>
          {basic.email  && <Text style={styles.contactItem}>{basic.email}</Text>}
          {basic.phone  && <Text style={styles.contactItem}>{basic.phone}</Text>}
          {basic.city   && <Text style={styles.contactItem}>{basic.city}</Text>}
          {basic.github && <Text style={styles.contactItem}>{basic.github}</Text>}
          {basic.linkedin && <Text style={styles.contactItem}>{basic.linkedin}</Text>}
        </View>
        <View style={styles.divider} />

        {Boolean(summary) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={{ fontSize: 9.5, lineHeight: 1.45, color: "#333" }}>{summary}</Text>
          </View>
        )}

        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, i) => (
              <View key={i} style={{ marginBottom: 4 }}>
                <View style={styles.entryRow}>
                  <Text style={styles.titleBold}>{edu.institution}</Text>
                  <Text style={styles.dateText}>{edu.year_from} – {edu.year_to}</Text>
                </View>
                <Text style={styles.subtitle}>{edu.degree}{edu.department ? `, ${edu.department}` : ""}</Text>
                {edu.cgpa && <Text style={styles.subtitle}>CGPA: {edu.cgpa}</Text>}
              </View>
            ))}
          </View>
        )}

        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Strengths</Text>
            <View style={styles.twoCol}>
              <View style={styles.colLeft}>
                {skills.slice(0, Math.ceil(skills.length / 2)).map((s, i) => (
                  <Text key={i} style={styles.courseItem}>· {s}</Text>
                ))}
              </View>
              <View style={styles.colRight}>
                {skills.slice(Math.ceil(skills.length / 2)).map((s, i) => (
                  <Text key={i} style={styles.courseItem}>· {s}</Text>
                ))}
              </View>
            </View>
          </View>
        )}

        {(experience.length > 0 || internship.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{experience.length > 0 ? "Experience" : "Internship / Trainings"}</Text>
            {[...experience, ...internship].map((exp, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <View style={styles.entryRow}>
                  <Text style={styles.titleBold}>{(exp.job_title || exp.role) as string}</Text>
                  <Text style={styles.dateText}>{(exp.from_date || exp.duration) as string}</Text>
                </View>
                <Text style={styles.subtitle}>{exp.company as string}</Text>
                <BulletList items={(exp.bullets as string[]) || [exp.description as string]} />
              </View>
            ))}
          </View>
        )}

        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((proj, i) => (
              <View key={i} style={{ marginBottom: 5 }}>
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

        {certs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certs.map((c, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
                <Text style={{ fontSize: 9.5 }}>• {c.name}{c.platform ? ` — ${c.platform}` : ""}{c.year ? ` (${c.year})` : ""}</Text>
                {Boolean(c.link) && (
                  <Link src={c.link} style={{ fontSize: 8.5, color: "#2563eb", marginLeft: 6 }}>
                    [Verify Link]
                  </Link>
                )}
              </View>
            ))}
          </View>
        )}

        {achievements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <BulletList items={achievements} />
          </View>
        )}
      </Page>
    </Document>
  )
}
