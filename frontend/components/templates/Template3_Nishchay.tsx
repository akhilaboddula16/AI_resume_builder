import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer"
const S = StyleSheet.create({
  page: { fontFamily: "Times-Roman", fontSize: 10, padding: 40 },
  name: { fontSize: 16, fontFamily: "Times-Bold", textAlign: "center", marginBottom: 2 },
  contactRow: { flexDirection: "row", justifyContent: "center", flexWrap: "wrap", fontSize: 9, color: "#444", marginBottom: 4 },
  ci: { marginHorizontal: 5 },
  divider: { borderBottomWidth: 1.5, borderBottomColor: "#000", marginBottom: 8 },
  section: { marginTop: 8 },
  sectionTitle: { fontFamily: "Times-Bold", fontSize: 10.5, textTransform: "uppercase", borderBottomWidth: 0.5, borderBottomColor: "#333", paddingBottom: 1, marginBottom: 4 },
  // TABLE styles
  tableRow: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#ccc", paddingVertical: 3 },
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#000", paddingVertical: 3, backgroundColor: "#f5f5f5" },
  col1: { flex: 2, fontSize: 9 },
  col2: { flex: 2, fontSize: 9 },
  col3: { flex: 1.5, fontSize: 9 },
  col4: { flex: 1, fontSize: 9 },
  col5: { flex: 1, fontSize: 9 },
  colBold: { fontFamily: "Times-Bold" },
  bulletRow: { flexDirection: "row", marginBottom: 1.5, paddingLeft: 6 },
  dot: { width: 10 },
  bt: { flex: 1, fontSize: 9.5, lineHeight: 1.4 },
  bold: { fontFamily: "Times-Bold" },
  italic: { fontStyle: "italic", fontSize: 9.5 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
  date: { fontSize: 9.5 },
})
const BL = ({ items }: { items: string[] }) => (
  <View>{items.map((t, i) => <View key={i} style={S.bulletRow}><Text style={S.dot}>·</Text><Text style={S.bt}>{t}</Text></View>)}</View>
)
interface Props { data: Record<string, unknown> }
export function Template3_Nishchay({ data }: Props) {
  const b = (data.basic_info as Record<string, string>) || {}
  const edu = (data.education as Record<string, string>[]) || []
  const rawSkills = data.skills || data.technical_skills || data.technical_strengths || []
  const skills: string[] = Array.isArray(rawSkills)
    ? rawSkills.map(String)
    : typeof rawSkills === "object" && rawSkills !== null
    ? Object.values(rawSkills).flat().map(String)
    : []
  const trainings = (data.internship as Record<string, unknown>[]) || []
  const experience = (data.experience as Record<string, unknown>[]) || []
  const projects = (data.projects as Record<string, unknown>[]) || []
  const certs = (data.certifications as Record<string, string>[]) || []
  const objective = (data.career_objective as string) || (data.summary as string) || ""
  const personalSkills = (data.personal_skills as string[]) || []
  return (
    <Document><Page size="A4" style={S.page}>
      <Text style={S.name}>{b.name}</Text>
      <View style={S.contactRow}>
        {b.email && <Text style={S.ci}>{b.email}</Text>}
        {b.phone && <Text style={S.ci}>{b.phone}</Text>}
        {b.city && <Text style={S.ci}>{b.city}</Text>}
      </View>
      <View style={S.divider} />
      {objective && <View style={S.section}><Text style={S.sectionTitle}>Career Objective</Text>
        <Text style={{ fontSize: 9.5, lineHeight: 1.5 }}>{objective}</Text>
      </View>}
      {edu.length > 0 && <View style={S.section}><Text style={S.sectionTitle}>Education</Text>
        {/* Table header */}
        <View style={S.tableHeader}>
          <Text style={[S.col1, S.colBold]}>Course</Text>
          <Text style={[S.col2, S.colBold]}>Institution</Text>
          <Text style={[S.col3, S.colBold]}>Board/Univ.</Text>
          <Text style={[S.col4, S.colBold]}>Year</Text>
          <Text style={[S.col5, S.colBold]}>%/CGPA</Text>
        </View>
        {edu.map((e, i) => <View key={i} style={S.tableRow}>
          <Text style={S.col1}>{e.degree}</Text>
          <Text style={S.col2}>{e.institution}</Text>
          <Text style={S.col3}>{e.board_university || e.boardUniversity || "-"}</Text>
          <Text style={S.col4}>{e.year_to || e.yearTo}</Text>
          <Text style={S.col5}>{e.percentage || e.cgpa || "-"}</Text>
        </View>)}
      </View>}
      {skills.length > 0 && <View style={S.section}><Text style={S.sectionTitle}>Technical Strengths</Text>
        <Text style={{ fontSize: 9.5, lineHeight: 1.6 }}>{skills.join(" · ")}</Text>
      </View>}
      {trainings.length > 0 && <View style={S.section}><Text style={S.sectionTitle}>Internship / Trainings</Text>
        {trainings.map((t, i) => <View key={i} style={{ marginBottom: 5 }}>
          <View style={S.row}><Text style={S.bold}>{(t.role || t.job_title) as string}</Text><Text style={S.date}>{t.duration as string}</Text></View>
          <Text style={S.italic}>{t.company as string}</Text>
          <BL items={(t.bullets as string[]) || [t.description as string]} />
        </View>)}
      </View>}
      {projects.length > 0 && <View style={S.section}><Text style={S.sectionTitle}>Projects</Text>
        {projects.map((p, i) => <View key={i} style={{ marginBottom: 5 }}>
          <View style={S.row}>
            <Text style={S.bold}>{p.name as string}</Text>
            {Boolean(p.date) && <Text style={S.date}>{p.date as string}</Text>}
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", marginBottom: 2 }}>
            {Boolean(p.tech_stack) && <Text style={S.italic}>{p.tech_stack as string}</Text>}
            {Boolean(p.github_url) && (
              <Link src={p.github_url as string} style={{ fontSize: 8.5, color: "#2563eb", marginLeft: 6 }}>
                [{p.github_url as string}]
              </Link>
            )}
            {Boolean(p.live_url) && (
              <Link src={p.live_url as string} style={{ fontSize: 8.5, color: "#2563eb", marginLeft: 6 }}>
                [Live Demo]
              </Link>
            )}
          </View>
          <BL items={(p.bullets as string[]) || [p.description as string]} />
        </View>)}
      </View>}
      {certs.length > 0 && (
        <View style={S.section}>
          <Text style={S.sectionTitle}>Certifications</Text>
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
      {personalSkills.length > 0 && <View style={S.section}><Text style={S.sectionTitle}>Personal Skills</Text>
        <Text style={{ fontSize: 9.5 }}>{personalSkills.join(" · ")}</Text>
      </View>}
    </Page></Document>
  )
}
