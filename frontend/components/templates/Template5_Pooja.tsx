// components/templates/Template5_Pooja.tsx — Traditional Indian with OBJECTIVE + KEY ACCOMPLISHMENTS
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
const S = StyleSheet.create({
  page: { fontFamily: "Times-Roman", fontSize: 10, padding: 40 },
  name: { fontSize: 17, fontFamily: "Times-Bold", textAlign: "center", marginBottom: 2 },
  contactRow: { flexDirection: "row", justifyContent: "center", flexWrap: "wrap", fontSize: 9, color: "#444", marginBottom: 6 },
  ci: { marginHorizontal: 6 },
  divider: { borderBottomWidth: 1.5, borderBottomColor: "#000", marginBottom: 8 },
  section: { marginTop: 9 },
  sectionTitle: { fontFamily: "Times-Bold", textTransform: "uppercase", fontSize: 10.5, borderBottomWidth: 0.5, borderBottomColor: "#555", paddingBottom: 1, marginBottom: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
  bold: { fontFamily: "Times-Bold" },
  italic: { fontStyle: "italic", fontSize: 9.5, color: "#444" },
  date: { fontSize: 9.5, color: "#444" },
  bulletRow: { flexDirection: "row", marginBottom: 1.5, paddingLeft: 6 },
  dot: { width: 10 },
  bt: { flex: 1, fontSize: 9.5, lineHeight: 1.4 },
})
const BL = ({ items }: { items: string[] }) => (
  <View>{items.map((t, i) => <View key={i} style={S.bulletRow}><Text style={S.dot}></Text><Text style={S.bt}>{t}</Text></View>)}</View>
)
interface Props { data: Record<string, unknown> }
export function Template5_Pooja({ data }: Props) {
  const b = (data.basic_info as Record<string, string>) || {}
  const edu = (data.education as Record<string, string>[]) || []
  const exp = (data.experience as Record<string, unknown>[]) || []
  const skills = (data.skills as string[]) || []
  const projects = (data.projects as Record<string, unknown>[]) || []
  const objective = data.career_objective as string || ""
  const achievements = (data.achievements as string[]) || []
  return (
    <Document><Page size="A4" style={S.page}>
      <Text style={S.name}>{b.name}</Text>
      <View style={S.contactRow}>
        {b.email && <Text style={S.ci}>{b.email}</Text>}
        {b.phone && <Text style={S.ci}>{b.phone}</Text>}
        {b.linkedin && <Text style={S.ci}>{b.linkedin}</Text>}
      </View>
      <View style={S.divider} />
      {objective && <View style={S.section}><Text style={S.sectionTitle}>Objective</Text>
        <Text style={{ fontSize: 9.5, lineHeight: 1.5 }}>{objective}</Text>
      </View>}
      {edu.length > 0 && <View style={S.section}><Text style={S.sectionTitle}>Education</Text>
        {edu.map((e, i) => <View key={i} style={{ marginBottom: 4 }}>
          <View style={S.row}><Text style={S.bold}>{e.institution}</Text><Text style={S.date}>{e.year_from} – {e.year_to}</Text></View>
          <Text style={S.italic}>{e.degree}{e.department ? `, ${e.department}` : ""}{e.cgpa ? ` | CGPA: ${e.cgpa}` : ""}</Text>
        </View>)}
      </View>}
      {exp.length > 0 && <View style={S.section}><Text style={S.sectionTitle}>Work Experience</Text>
        {exp.map((e, i) => <View key={i} style={{ marginBottom: 6 }}>
          <View style={S.row}><Text style={S.bold}>{e.job_title as string}</Text><Text style={S.date}>{e.from_date as string} – {e.to_date as string}</Text></View>
          <Text style={S.italic}>{e.company as string}</Text>
          <BL items={(e.bullets as string[]) || [e.description as string]} />
        </View>)}
      </View>}
      {projects.length > 0 && <View style={S.section}><Text style={S.sectionTitle}>Profile / Projects</Text>
        {projects.map((p, i) => <View key={i} style={{ marginBottom: 5 }}>
          <Text style={S.bold}>{p.name as string}{p.tech_stack ? ` | ${p.tech_stack}` : ""}</Text>
          <BL items={(p.bullets as string[]) || [p.description as string]} />
        </View>)}
      </View>}
      {skills.length > 0 && <View style={S.section}><Text style={S.sectionTitle}>Skills and Interests</Text>
        <Text style={{ fontSize: 9.5, lineHeight: 1.5 }}>{skills.join(" · ")}</Text>
      </View>}
      {achievements.length > 0 && <View style={S.section}><Text style={S.sectionTitle}>Key Accomplishments</Text>
        <BL items={achievements} />
      </View>}
    </Page></Document>
  )
}
