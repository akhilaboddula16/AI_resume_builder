import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer"
const S = StyleSheet.create({
  page: { fontFamily: "Times-Roman", fontSize: 10, padding: 38 },
  name: { fontSize: 17, fontFamily: "Times-Bold", textAlign: "center", marginBottom: 2 },
  contactRow: { flexDirection: "row", justifyContent: "center", flexWrap: "wrap", fontSize: 9, color: "#444", marginBottom: 6 },
  ci: { marginHorizontal: 6 },
  divider: { borderBottomWidth: 1.5, borderBottomColor: "#000", marginBottom: 8 },
  section: { marginTop: 8 },
  sectionTitle: { fontFamily: "Times-Bold", textTransform: "uppercase", fontSize: 10.5, borderBottomWidth: 0.5, borderBottomColor: "#555", paddingBottom: 1, marginBottom: 4 },
  projectName: { fontFamily: "Times-Bold", fontSize: 10.5, marginBottom: 1 },
  projectMeta: { fontStyle: "italic", fontSize: 9.5, color: "#444", marginBottom: 2 },
  bulletRow: { flexDirection: "row", marginBottom: 1.5, paddingLeft: 6 },
  dot: { width: 10 },
  bt: { flex: 1, fontSize: 9.5, lineHeight: 1.4 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  bold: { fontFamily: "Times-Bold" },
  italic: { fontStyle: "italic", fontSize: 9.5 },
  date: { fontSize: 9.5 },
})
const BL = ({ items }: { items: string[] }) => (
  <View>{items.map((t, i) => <View key={i} style={S.bulletRow}><Text style={S.dot}>·</Text><Text style={S.bt}>{t}</Text></View>)}</View>
)
interface Props { data: Record<string, unknown> }
export function Template4_RishiShah({ data }: Props) {
  const b = (data.basic_info as Record<string, string>) || {}
  const edu = (data.education as Record<string, string>[]) || []
  const objective = data.career_objective as string || ""
  const projects = (data.projects as Record<string, unknown>[]) || []
  const skills = (data.skills as string[]) || []
  const exp = (data.experience as Record<string, unknown>[]) || []
  const intern = (data.internship as Record<string, unknown>[]) || []
  const achievements = (data.achievements as string[]) || []
  return (
    <Document><Page size="A4" style={S.page}>
      <Text style={S.name}>{b.name}</Text>
      <View style={S.contactRow}>
        {b.email && <Text style={S.ci}>{b.email}</Text>}
        {b.phone && <Text style={S.ci}>{b.phone}</Text>}
        {b.linkedin && <Text style={S.ci}>{b.linkedin}</Text>}
        {b.github && <Text style={S.ci}>{b.github}</Text>}
      </View>
      <View style={S.divider} />
      {edu.length > 0 && <View style={S.section}><Text style={S.sectionTitle}>Education</Text>
        {edu.map((e, i) => <View key={i} style={{ marginBottom: 4 }}>
          <View style={S.row}><Text style={S.bold}>{e.institution}</Text><Text style={S.date}>{e.year_from} – {e.year_to}</Text></View>
          <Text style={S.italic}>{e.degree}{e.department ? `, ${e.department}` : ""}</Text>
          {e.cgpa && <Text style={S.italic}>CGPA: {e.cgpa}</Text>}
        </View>)}
      </View>}
      {objective && <View style={S.section}><Text style={S.sectionTitle}>Carrier Objective</Text>
        <Text style={{ fontSize: 9.5, lineHeight: 1.5 }}>{objective}</Text>
      </View>}
      {projects.length > 0 && <View style={S.section}><Text style={S.sectionTitle}>Projects</Text>
        {projects.map((p, i) => <View key={i} style={{ marginBottom: 7 }}>
          <View style={S.row}>
            <Text style={S.projectName}>{p.name as string}</Text>
            {Boolean(p.date) && <Text style={S.date}>{p.date as string}</Text>}
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", marginBottom: 2 }}>
            {Boolean(p.tech_stack) && <Text style={S.projectMeta}>Tech: {p.tech_stack as string}</Text>}
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
      {skills.length > 0 && <View style={S.section}><Text style={S.sectionTitle}>Technical Skills</Text>
        <Text style={{ fontSize: 9.5, lineHeight: 1.5 }}>{skills.join(" · ")}</Text>
      </View>}
      {(exp.length > 0 || intern.length > 0) && <View style={S.section}>
        <Text style={S.sectionTitle}>{exp.length > 0 ? "Work Experience" : "Internship / Trainings"}</Text>
        {[...exp, ...intern].map((e, i) => <View key={i} style={{ marginBottom: 5 }}>
          <View style={S.row}><Text style={S.bold}>{(e.job_title || e.role) as string}</Text><Text style={S.date}>{(e.from_date || e.duration) as string}</Text></View>
          <Text style={S.italic}>{e.company as string}</Text>
          <BL items={(e.bullets as string[]) || [e.description as string]} />
        </View>)}
      </View>}
      {Boolean(data.certifications) && ((data.certifications as Record<string, string>[]).length > 0) && (
        <View style={S.section}>
          <Text style={S.sectionTitle}>Certifications</Text>
          {(data.certifications as Record<string, string>[]).map((c, i) => (
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
      {achievements.length > 0 && <View style={S.section}><Text style={S.sectionTitle}>Achievements</Text>
        <BL items={achievements} />
      </View>}
    </Page></Document>
  )
}
