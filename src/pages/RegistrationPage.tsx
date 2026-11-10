import { CheckCircle2, CircleAlert, Plus, Trash2, Users } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { Modal } from '../components/Modal'
import { emptyMember, validateTeam } from '../lib/validation'
import { registerTeam } from '../lib/teams'
import { images } from '../lib/assets'
import type { Grade, MemberInput, TeamInput } from '../types'

const grades: Grade[] = ['Α΄', 'Β΄', 'Γ΄']

export function RegistrationPage() {
  const registrationsOpen = import.meta.env.VITE_REGISTRATION_OPEN !== 'false'
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

  if (!registrationsOpen) return <div className="shell max-w-3xl py-12 sm:py-16"><div className="surface grid items-center gap-6 overflow-hidden p-7 sm:grid-cols-[1fr_200px] sm:p-10"><div><p className="eyebrow">Συμμετοχή</p><h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">Οι δηλώσεις ολοκληρώθηκαν</h1><p className="mt-4 max-w-xl leading-relaxed text-slate-600">Η περίοδος δήλωσης ομάδων για τον Όμιλο έχει κλείσει.</p></div><img src={images.printedForm} alt="Αφηρημένο τρισδιάστατο αντικείμενο" className="mx-auto w-44" /></div></div>

  return <div className="shell max-w-3xl py-12 sm:py-16">
    <header className="grid items-center gap-4 sm:grid-cols-[1fr_150px]"><div><p className="eyebrow">Συμμετοχή</p><h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">Δήλωση Ομάδας</h1><p className="mt-4 max-w-2xl leading-relaxed text-slate-600">Συμπληρώστε μία καταχώριση για την ομάδα σας. Κάθε ομάδα μπορεί να έχει έως 4 μέλη.</p></div><img src={images.printedForm} alt="Αφηρημένο τρισδιάστατο αντικείμενο" className="mx-auto hidden w-32 sm:block" loading="lazy" /></header>
    {success && <div role="status" className="mt-7 flex gap-3 rounded-2xl border border-grass/30 bg-green-50 p-4 text-green-800"><CheckCircle2 className="shrink-0 text-grass" /><div><p className="font-bold">Η ομάδα καταχωρίστηκε επιτυχώς.</p><p className="mt-1 text-sm">Ευχαριστούμε για τη δήλωσή σας.</p></div></div>}
    {error && <div role="alert" className="mt-7 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700"><CircleAlert className="shrink-0 text-red-500" /><p>{error}</p></div>}
    <form onSubmit={onSubmit} className="surface mt-7 p-5 sm:p-7">
      <div><label htmlFor="team-name" className="label">Όνομα Ομάδας</label><input id="team-name" className="field" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} maxLength={80} autoComplete="off" required /></div>
      <input tabIndex={-1} aria-hidden="true" className="absolute -left-[10000px] opacity-0" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} name="website" autoComplete="off" />
      <div className="mt-8"><div className="flex items-center justify-between gap-4"><h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-800"><Users size={20} className="text-cyan" />Μέλη ομάδας</h2><span className="rounded-full bg-cyan/10 px-2.5 py-1 text-sm font-bold text-cyan">{form.members.length}/4</span></div>
        <div className="mt-4 space-y-4">{form.members.map((member, index) => <fieldset key={index} className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4"><legend className="rounded-full bg-white px-2 text-sm font-bold text-violet shadow-sm">Μέλος {index + 1}</legend><div className="grid gap-3 sm:grid-cols-2"><Field label="Όνομα" value={member.firstName} onChange={(value) => changeMember(index, 'firstName', value)} id={`first-name-${index}`} /><Field label="Επώνυμο" value={member.lastName} onChange={(value) => changeMember(index, 'lastName', value)} id={`last-name-${index}`} /><div><label className="label" htmlFor={`grade-${index}`}>Τάξη</label><select id={`grade-${index}`} className="field" value={member.grade} onChange={(event) => changeMember(index, 'grade', event.target.value)} required><option value="">Επιλέξτε τάξη</option>{grades.map((grade) => <option key={grade} value={grade}>{grade}</option>)}</select></div><Field label="Τμήμα" value={member.section} onChange={(value) => changeMember(index, 'section', value)} id={`section-${index}`} /></div>{form.members.length > 1 && <button type="button" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-red-500" onClick={() => removeMember(index)}><Trash2 size={15} />Αφαίρεση μέλους</button>}</fieldset>)}</div>
        {form.members.length < 4 && <button type="button" onClick={addMember} className="button-secondary mt-4 text-sm"><Plus size={17} />Προσθήκη μέλους</button>}
      </div>
      <p className="mt-7 rounded-2xl border border-violet/15 bg-violet/5 p-3 text-sm leading-relaxed text-slate-600"><strong className="font-bold text-violet">Προστασία προσωπικών δεδομένων:</strong> Τα στοιχεία χρησιμοποιούνται αποκλειστικά για τη διαχείριση των ομάδων του Ομίλου. Δεν εμφανίζονται δημόσια.</p>
      <button type="submit" className="button-primary mt-6 w-full sm:w-auto">Έλεγχος και υποβολή</button>
    </form>
    {confirm && <Modal title="Επιβεβαίωση δήλωσης" onClose={() => !submitting && setConfirm(false)}><p className="leading-relaxed text-slate-600">Θα καταχωριστεί η ομάδα <strong className="text-slate-800">{form.name.trim()}</strong> με {form.members.length} {form.members.length === 1 ? 'μέλος' : 'μέλη'}. Ελέγξτε ότι τα στοιχεία είναι σωστά.</p><div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" className="button-secondary" disabled={submitting} onClick={() => setConfirm(false)}>Επιστροφή</button><button type="button" className="button-primary" disabled={submitting} onClick={confirmSubmit}>{submitting ? 'Καταχώριση…' : 'Επιβεβαίωση'}</button></div></Modal>}
  </div>
}

function Field({ label, value, onChange, id }: { label: string; value: string; onChange: (value: string) => void; id?: string }) {
  const fieldId = id ?? `field-${label}`
  return <div><label className="label" htmlFor={fieldId}>{label}</label><input id={fieldId} className="field" value={value} onChange={(event) => onChange(event.target.value)} maxLength={label === 'Τμήμα' ? 20 : 80} required /></div>
}
