import { CheckCircle2, CircleAlert, Plus, Trash2, Users } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { Modal } from '../components/Modal'
import { emptyMember, validateTeam } from '../lib/validation'
import { registerTeam } from '../lib/teams'
import type { Grade, MemberInput, TeamInput } from '../types'

const grades: Grade[] = ['Α΄', 'Β΄', 'Γ΄']

export function RegistrationPage() {
  const [form, setForm] = useState<TeamInput>({ name: '', members: [emptyMember()], website: '' })
  const [error, setError] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const changeMember = (index: number, field: keyof MemberInput, value: string) => {
    setForm((current) => ({ ...current, members: current.members.map((member, i) => i === index ? { ...member, [field]: value } : member) }))
  }
  const addMember = () => setForm((current) => current.members.length < 4 ? { ...current, members: [...current.members, emptyMember()] } : current)
  const removeMember = (index: number) => setForm((current) => ({ ...current, members: current.members.filter((_, i) => i !== index) }))
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const validationError = validateTeam(form)
    setError(validationError ?? '')
    if (!validationError) setConfirm(true)
  }
  const confirmSubmit = async () => {
    setSubmitting(true); setError('')
    try {
      await registerTeam(form)
      setConfirm(false); setSuccess(true); setForm({ name: '', members: [emptyMember()], website: '' })
    } catch (caught) {
      setConfirm(false); setError(caught instanceof Error ? caught.message : 'Παρουσιάστηκε πρόβλημα στην εγγραφή.')
    } finally { setSubmitting(false) }
  }

  return <div className="shell max-w-3xl py-12 sm:py-16">
    <header><p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan">Συμμετοχή</p><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Δήλωση Ομάδας</h1><p className="mt-4 max-w-2xl leading-relaxed text-slate-300">Συμπληρώστε μία καταχώριση για την ομάδα σας. Κάθε ομάδα μπορεί να έχει έως 4 μέλη.</p></header>
    {success && <div role="status" className="mt-7 flex gap-3 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-emerald-100"><CheckCircle2 className="shrink-0 text-emerald-300" /><div><p className="font-semibold">Η ομάδα καταχωρίστηκε επιτυχώς.</p><p className="mt-1 text-sm text-emerald-200/90">Ευχαριστούμε για τη δήλωσή σας.</p></div></div>}
    {error && <div role="alert" className="mt-7 flex gap-3 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-red-100"><CircleAlert className="shrink-0 text-red-300" /><p>{error}</p></div>}
    <form onSubmit={onSubmit} className="surface mt-7 p-5 sm:p-7">
      <div><label htmlFor="team-name" className="label">Όνομα Ομάδας</label><input id="team-name" className="field" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} maxLength={80} autoComplete="off" required /></div>
      <input tabIndex={-1} aria-hidden="true" className="absolute -left-[10000px] opacity-0" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} name="website" autoComplete="off" />
      <div className="mt-8"><div className="flex items-center justify-between gap-4"><h2 className="flex items-center gap-2 text-lg font-bold"><Users size={20} className="text-cyan" />Μέλη ομάδας</h2><span className="text-sm text-slate-500">{form.members.length}/4</span></div>
        <div className="mt-4 space-y-4">{form.members.map((member, index) => <fieldset key={index} className="rounded-xl border border-slate-700 bg-slate-950/25 p-4"><legend className="px-1 text-sm font-semibold text-slate-300">Μέλος {index + 1}</legend><div className="grid gap-3 sm:grid-cols-2"><Field label="Όνομα" value={member.firstName} onChange={(value) => changeMember(index, 'firstName', value)} id={`first-name-${index}`} /><Field label="Επώνυμο" value={member.lastName} onChange={(value) => changeMember(index, 'lastName', value)} id={`last-name-${index}`} /><div><label className="label" htmlFor={`grade-${index}`}>Τάξη</label><select id={`grade-${index}`} className="field" value={member.grade} onChange={(event) => changeMember(index, 'grade', event.target.value)} required><option value="">Επιλέξτε τάξη</option>{grades.map((grade) => <option key={grade} value={grade}>{grade}</option>)}</select></div><Field label="Τμήμα" value={member.section} onChange={(value) => changeMember(index, 'section', value)} id={`section-${index}`} /></div>{form.members.length > 1 && <button type="button" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-red-300" onClick={() => removeMember(index)}><Trash2 size={15} />Αφαίρεση μέλους</button>}</fieldset>)}</div>
        {form.members.length < 4 && <button type="button" onClick={addMember} className="button-secondary mt-4 text-sm"><Plus size={17} />Προσθήκη μέλους</button>}
      </div>
      <p className="mt-7 rounded-xl border border-slate-700 bg-slate-950/30 p-3 text-sm leading-relaxed text-slate-400"><strong className="font-semibold text-slate-300">Προστασία προσωπικών δεδομένων:</strong> Τα στοιχεία χρησιμοποιούνται αποκλειστικά για τη διαχείριση των ομάδων του Ομίλου. Δεν εμφανίζονται δημόσια.</p>
      <button type="submit" className="button-primary mt-6 w-full sm:w-auto">Έλεγχος και υποβολή</button>
    </form>
    {confirm && <Modal title="Επιβεβαίωση δήλωσης" onClose={() => !submitting && setConfirm(false)}><p className="leading-relaxed text-slate-300">Θα καταχωριστεί η ομάδα <strong className="text-white">{form.name.trim()}</strong> με {form.members.length} {form.members.length === 1 ? 'μέλος' : 'μέλη'}. Ελέγξτε ότι τα στοιχεία είναι σωστά.</p><div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" className="button-secondary" disabled={submitting} onClick={() => setConfirm(false)}>Επιστροφή</button><button type="button" className="button-primary" disabled={submitting} onClick={confirmSubmit}>{submitting ? 'Καταχώριση…' : 'Επιβεβαίωση'}</button></div></Modal>}
  </div>
}

function Field({ label, value, onChange, id }: { label: string; value: string; onChange: (value: string) => void; id?: string }) {
  const fieldId = id ?? `field-${label}`
  return <div><label className="label" htmlFor={fieldId}>{label}</label><input id={fieldId} className="field" value={value} onChange={(event) => onChange(event.target.value)} maxLength={label === 'Τμήμα' ? 20 : 80} required /></div>
}
