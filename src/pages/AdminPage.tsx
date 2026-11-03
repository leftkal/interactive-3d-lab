import { Download, LogIn, Pencil, Plus, Trash2, Users, X } from 'lucide-react'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Modal } from '../components/Modal'
import { emptyMember, validateTeam } from '../lib/validation'
import { deleteTeam, getTeams, updateTeam } from '../lib/teams'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type { Grade, MemberInput, Team, TeamInput } from '../types'

const grades: Grade[] = ['Α΄', 'Β΄', 'Γ΄']

export function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [teams, setTeams] = useState<Team[]>([])
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<Team | null>(null)
  const [deleting, setDeleting] = useState<Team | null>(null)

  const load = async () => {
    try {
      const { data: teacher, error: roleError } = await supabase!.rpc('is_teacher')
      if (roleError || !teacher) {
        setAuthorized(false)
        setError('Ο λογαριασμός αυτός δεν έχει δικαιώματα εκπαιδευτικού.')
        return
      }
      setAuthorized(true)
      setTeams(await getTeams()); setError('')
    } catch { setAuthorized(false); setError('Δεν είναι δυνατή η πρόσβαση στις εγγραφές. Βεβαιωθείτε ότι ο λογαριασμός έχει δικαιώματα εκπαιδευτικού.') }
  }
  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.auth.getSession().then(async ({ data }) => { setAuthenticated(Boolean(data.session)); if (data.session) await load(); setLoading(false) })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => { setAuthenticated(Boolean(session)); if (session) { setLoading(true); void load().finally(() => setLoading(false)) } else { setTeams([]); setAuthorized(false) } })
    return () => listener.subscription.unsubscribe()
  }, [])
  const students = useMemo(() => teams.reduce((sum, team) => sum + team.team_members.length, 0), [teams])

  if (!isSupabaseConfigured) return <div className="shell py-16"><AdminNotice text="Η σύνδεση με το Supabase δεν έχει ρυθμιστεί ακόμη." /></div>
  if (loading) return <div className="shell py-16 text-slate-400">Φόρτωση…</div>
  if (!authenticated) return <AdminLogin onSuccess={() => { setAuthenticated(true); setLoading(true); void load().finally(() => setLoading(false)) }} />
  if (!authorized) return <div className="shell max-w-xl py-16"><AdminNotice text={error || 'Ο λογαριασμός αυτός δεν έχει δικαιώματα εκπαιδευτικού.'} /><button className="button-secondary mt-4" onClick={() => supabase?.auth.signOut()}>Έξοδος</button></div>
  return <div className="shell py-12 sm:py-16">
    <div className="flex flex-wrap items-start justify-between gap-5"><header><p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan">Διαχείριση</p><h1 className="mt-3 text-3xl font-bold">Εγγεγραμμένες ομάδες</h1></header><div className="flex flex-wrap gap-2"><button className="button-secondary text-sm" onClick={() => exportCsv(teams)} disabled={!teams.length}><Download size={16} />Εξαγωγή CSV</button><button className="button-secondary text-sm" onClick={() => supabase?.auth.signOut()}>Έξοδος</button></div></div>
    <div className="mt-8 grid grid-cols-2 gap-4 sm:max-w-md"><Stat value={teams.length} label="Ομάδες" /><Stat value={students} label="Μαθητές/τριες" /></div>
    {error && <div role="alert" className="mt-6"><AdminNotice text={error} /></div>}
    <div className="mt-8 space-y-3">{teams.length === 0 && !error ? <div className="surface p-6 text-slate-400">Δεν υπάρχουν ακόμη καταχωρίσεις.</div> : teams.map((team) => <article key={team.id} className="surface p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-bold">{team.name}</h2><p className="mt-1 text-sm text-slate-500">{new Intl.DateTimeFormat('el-GR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(team.created_at))}</p></div><div className="flex gap-2"><button className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-cyan" onClick={() => setEditing(team)} aria-label={`Επεξεργασία ${team.name}`}><Pencil size={17} /></button><button className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-red-300" onClick={() => setDeleting(team)} aria-label={`Διαγραφή ${team.name}`}><Trash2 size={17} /></button></div></div><ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">{team.team_members.map((member) => <li key={member.id} className="rounded-lg bg-slate-950/40 px-3 py-2 text-slate-300"><span className="font-medium text-white">{member.firstName} {member.lastName}</span><span className="text-slate-500"> · {member.grade} · {member.section}</span></li>)}</ul></article>)}</div>
    {editing && <EditTeam team={editing} onClose={() => setEditing(null)} onDone={async () => { setEditing(null); await load() }} />}
    {deleting && <DeleteConfirmation team={deleting} onClose={() => setDeleting(null)} onDone={async () => { setDeleting(null); await load() }} />}
  </div>
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  const submit = async (event: FormEvent) => { event.preventDefault(); setBusy(true); setError(''); const { error: authError } = await supabase!.auth.signInWithPassword({ email, password }); setBusy(false); if (authError) setError('Τα στοιχεία σύνδεσης δεν είναι σωστά.'); else onSuccess() }
  return <div className="shell max-w-lg py-14"><div className="surface p-6 sm:p-8"><LogIn className="text-cyan" /><h1 className="mt-4 text-2xl font-bold">Σύνδεση εκπαιδευτικού</h1><p className="mt-2 text-sm leading-relaxed text-slate-400">Η πρόσβαση στις εγγραφές επιτρέπεται μόνο σε εξουσιοδοτημένους λογαριασμούς.</p>{error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}<form onSubmit={submit} className="mt-6 space-y-4"><div><label className="label" htmlFor="email">Email</label><input id="email" type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></div><div><label className="label" htmlFor="password">Κωδικός</label><input id="password" type="password" className="field" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /></div><button className="button-primary w-full" disabled={busy}>{busy ? 'Σύνδεση…' : 'Σύνδεση'}</button></form></div></div>
}

function EditTeam({ team, onClose, onDone }: { team: Team; onClose: () => void; onDone: () => Promise<void> }) {
  const [form, setForm] = useState<TeamInput>({ name: team.name, members: team.team_members.map(({ firstName, lastName, grade, section }) => ({ firstName, lastName, grade, section })) })
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  const setMember = (i: number, field: keyof MemberInput, value: string) => setForm((current) => ({ ...current, members: current.members.map((member, index) => index === i ? { ...member, [field]: value } : member) }))
  const submit = async (event: FormEvent) => { event.preventDefault(); const message = validateTeam(form); if (message) { setError(message); return }; setBusy(true); try { await updateTeam(team.id, form); await onDone() } catch { setError('Η ενημέρωση δεν ολοκληρώθηκε. Ελέγξτε τα στοιχεία ή τα δικαιώματα πρόσβασης.') } finally { setBusy(false) } }
  return <Modal title="Επεξεργασία ομάδας" onClose={onClose}><form onSubmit={submit} className="space-y-4">{error && <p role="alert" className="text-sm text-red-300">{error}</p>}<div><label className="label">Όνομα Ομάδας</label><input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>{form.members.map((member, index) => <div key={index} className="rounded-xl border border-slate-700 p-3"><div className="mb-2 flex justify-between text-sm font-semibold">Μέλος {index + 1}{form.members.length > 1 && <button type="button" onClick={() => setForm({ ...form, members: form.members.filter((_, i) => i !== index) })} className="text-red-300"><X size={16} /></button>}</div><div className="grid grid-cols-2 gap-2"><input aria-label="Όνομα" className="field" placeholder="Όνομα" value={member.firstName} onChange={(e) => setMember(index, 'firstName', e.target.value)} required /><input aria-label="Επώνυμο" className="field" placeholder="Επώνυμο" value={member.lastName} onChange={(e) => setMember(index, 'lastName', e.target.value)} required /><select aria-label="Τάξη" className="field" value={member.grade} onChange={(e) => setMember(index, 'grade', e.target.value)} required><option value="">Τάξη</option>{grades.map((grade) => <option key={grade}>{grade}</option>)}</select><input aria-label="Τμήμα" className="field" placeholder="Τμήμα" value={member.section} onChange={(e) => setMember(index, 'section', e.target.value)} required /></div></div>)}{form.members.length < 4 && <button type="button" className="button-secondary text-sm" onClick={() => setForm({ ...form, members: [...form.members, emptyMember()] })}><Plus size={16} />Προσθήκη μέλους</button>}<div className="flex justify-end gap-2 pt-2"><button type="button" className="button-secondary" onClick={onClose}>Ακύρωση</button><button className="button-primary" disabled={busy}>{busy ? 'Αποθήκευση…' : 'Αποθήκευση'}</button></div></form></Modal>
}

function DeleteConfirmation({ team, onClose, onDone }: { team: Team; onClose: () => void; onDone: () => Promise<void> }) {
  const [busy, setBusy] = useState(false); const [error, setError] = useState('')
  const remove = async () => { setBusy(true); try { await deleteTeam(team.id); await onDone() } catch { setError('Η διαγραφή δεν ολοκληρώθηκε.') } finally { setBusy(false) } }
  return <Modal title="Διαγραφή ομάδας" onClose={onClose}><p className="text-slate-300">Να διαγραφεί οριστικά η ομάδα <strong className="text-white">{team.name}</strong> και τα στοιχεία των μελών της;</p>{error && <p className="mt-3 text-sm text-red-300">{error}</p>}<div className="mt-6 flex justify-end gap-2"><button className="button-secondary" onClick={onClose}>Ακύρωση</button><button className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 font-semibold text-white disabled:opacity-50" onClick={remove} disabled={busy}>{busy ? 'Διαγραφή…' : 'Διαγραφή'}</button></div></Modal>
}

function Stat({ value, label }: { value: number; label: string }) { return <div className="surface p-4"><p className="text-2xl font-bold text-cyan">{value}</p><p className="text-sm text-slate-400">{label}</p></div> }
function AdminNotice({ text }: { text: string }) { return <div className="surface p-5 text-slate-300">{text}</div> }

function exportCsv(teams: Team[]) {
  const rows = [['Όνομα Ομάδας', 'Όνομα', 'Επώνυμο', 'Τάξη', 'Τμήμα', 'Ημερομηνία εγγραφής']]
  teams.forEach((team) => team.team_members.forEach((member) => rows.push([team.name, member.firstName, member.lastName, member.grade, member.section, new Intl.DateTimeFormat('el-GR').format(new Date(team.created_at))])))
  const csv = '\uFEFF' + rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(';')).join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })); const link = document.createElement('a'); link.href = url; link.download = 'omades-interactive-3d-lab.csv'; link.click(); URL.revokeObjectURL(url)
}
