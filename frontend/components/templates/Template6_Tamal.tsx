// components/templates/Template6_Tamal.tsx — NIT Engineering, logo LEFT + info RIGHT header
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
const S = StyleSheet.create({
  page: { fontFamily: "Times-Roman", fontSize: 10, padding: 38 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, borderBottomWidth: 1.5, borderBottomColor: "#000", paddingBottom: 6 },
  logoBox: { width: 50, height: 50, border: "1 solid #ccc", alignItems: "center", justifyContent: "center" },
  logoText: { fontSize: 7, color: "#999", textAlign: "center" },
  nameBlock: { flex: 1, paddingLeft: 10 },
  name: { fontSize: 16, fontFamily: "Times-Bold", marginBottom: 2 },
  contactLine: { fontSize: 9, color: "#444" },
  section: { marginTop: 8 },
  sectionTitle: { fontFamily: "Times-Bold", textTransform: "uppercase", fontSize: 10.5, borderBottomWidth: 0.5, borderBottomColor: "#555", paddingBottom: 1, marginBottom: 4 },
  tableRow: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#ccc", paddingVertical: 3 },
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#000", paddingVertical: 3 },
  col1: { flex: 2, fontSize: 9 }, col2: { flex: 2, fontSize: 9 }, col3: { flex: 1, fontSize: 9 }, col4: { flex: 1, fontSize: 9 },
  colBold: { fontFamily: "Times-Bold" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
  bold: { fontFamily: "Times-Bold" },
  italic: { fontStyle: "italic", fontSize: 9.5, color: "#444" },
  date: { fontSize: 9.5 },
  bulletRow: { flexDirection: "row", marginBottom: 1.5, paddingLeft: 6 },
  dot: { width: 10 },
  bt: { flex: 1, fontSize: 9.5, lineHeight: 1.4 },
  subBulletRow: { flexDirection: "row", marginBottom: 1, paddingLeft: 16 },
  subDot: { width: 10, fontSize: 9 },
  subBt: { flex: 1, fontSize: 9 },
})
const BL = ({ items }: { items: string[] }) => (
  <View>{items.map((t, i) => <View key={i} style={S.bulletRow}><Text style={S.dot}>·</Text><Text style={S.bt}>{t}</Text></View>)}</View>
)
interface Props { data: Record<string, unknown> }
export function Template6_Tamal({ data }: Props) {
  const b = (data.basic_info as Record<string, string>) || {}
  const edu = (data.education as Record<string, string>[]) || []
  const exp = (data.experience as Record<string, unknown>[]) || []
  const intern = (data.internship as Record<string, unknown>[]) || []
  const skills = (data.skills as string[]) || []
  const projects = (data.projects as Record<string, unknown>[]) || []
  const certs = (data.certifications as Record<string, string>[]) || []
  const achievements = (data.achievements as string[]) || []
  return (
    <Document><Page size="A4" style={S.page}>
      {/* Special header: logo left, info right */}
      <View style={S.header}>
        <View style={S.logoBox}><Text style={S.logoText}>COLLEGE{"\n"}LOGO</Text></View>
        <View style={S.nameBlock}>
          <Text style={S.name}>{b.name}</Text>
          {b.email && <Text style={S.contactLine}>{b.email} | {b.phone}</Text>}
          {b.linkedin && <Text style={S.contactLine}>{b.linkedin}</Text>}
          {b.github && <Text style={S.contactLine}>{b.github}</Text>}
        </View>
      </View>
      {edu.length > 0 && <View style={S.section}><Text style={S.sectionTitle}>Education</Text>
        <View style={S.tableHeader}>
          <Text style={[S.col1, S.colBold]}>Degree</Text>
          <Text style={[S.col2, S.colBold]}>Institution</Text>
          <Text style={[S.col3, S.colBold]}>Year</Text>
          <Text style={[S.col4, S.colBold]}>CGPA/%</Text>
        </View>
        {edu.map((e, i) => <View key={i} style={S.tableRow}>
          <Text style={S.col1}>{e.degree}</Text>
          <Text style={S.col2}>{e.institution}</Text>
          <Text style={S.col3}>{e.year_to || e.yearTo}</Text>
          <Text style={S.col4}>{e.cgpa || e.percentage || "-"}</Text>
        </View>)}
      </View>}
      {(exp.length > 0 || intern.length > 0) && <View style={S.section}>
        <Text style={S.sectionTitle}>{exp.length > 0 ? "Work Experience" : "Internship"}</Text>
        {[...exp, ...intern].map((e, i) => <View key={i} style={{ marginBottom: 6 }}>
          <View style={S.row}><Text style={S.bold}>{(e.job_title || e.role) as string}</Text><Text style={S.date}>{(e.from_date || e.duration) as string}</Text></View>
          <Text style={S.italic}>{e.company as string}</Text>
          <BL items={(e.bullets as string[]) || [e.description as string]} />
        </View>)}
      </View>}
      {projects.length > 0 && <View style={S.section}><Text style={S.sectionTitle}>Projects</Text>
        {projects.map((p, i) => <View key={i} style={{ marginBottom: 5 }}>
          <Text style={S.bold}>{p.name as string}{p.tech_stack ? ` | ${p.tech_stack}` : ""}</Text>
          <BL items={(p.bullets as string[]) || [p.description as string]} />
        </View>)}
      </View>}
      {skills.length > 0 && <View style={S.section}><Text style={S.sectionTitle}>Skills</Text>
        <Text style={{ fontSize: 9.5, lineHeight: 1.5 }}>{skills.join(" · ")}</Text>
      </View>}
      {achievements.length > 0 && <View style={S.section}><Text style={S.sectionTitle}>Achievements</Text>
        <BL items={achievements} />
      </View>}
    </Page></Document>
  )
}
