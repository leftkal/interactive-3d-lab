import { ChevronDown, Sparkles } from 'lucide-react'
import { club, objectives, schedule } from '../data/club'
import { images } from '../lib/assets'

export function ClubPage() {
  return <div className="shell py-12 sm:py-16">
    <header className="grid items-center gap-7 lg:grid-cols-[1.25fr_.75fr]"><div><p className="eyebrow">Ο Όμιλος</p><h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">Από την ιδέα στη διαδραστική κατασκευή.</h1><p className="mt-5 leading-relaxed text-slate-600">{club.description}</p></div><img src={images.sensorNetwork} alt="Δίκτυο αισθητήρων, μικροελεγκτή και φωτισμού" className="mx-auto w-60 rotate-2 drop-shadow-xl" /></header>
    <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div><h2 className="text-xl font-extrabold text-slate-800">Κύριοι στόχοι</h2><ul className="mt-4 space-y-3">{objectives.map((objective, index) => <li key={objective} className="flex gap-3 text-slate-600"><span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg ${index % 2 ? 'bg-violet/15 text-violet' : 'bg-sunshine/30 text-orange-700'}`}><Sparkles size={14} /></span>{objective}</li>)}</ul></div>
      <div className="surface relative overflow-hidden p-6"><div aria-hidden className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-sunshine/25" /><h2 className="relative text-xl font-extrabold text-slate-800">Το κοινό τελικό έργο</h2><p className="relative mt-3 leading-relaxed text-slate-600">Οι ομάδες σχεδιάζουν και υλοποιούν ένα διαδραστικό εικαστικό για το σχολείο, ενσωματώνοντας τρισδιάστατα εκτυπωμένα στοιχεία, αισθητήρες, RGB φωτισμό, ESP32 και αυτοματισμούς μέσω Home Assistant.</p><img src={images.labSculpture} alt="Αφηρημένο διαδραστικό εικαστικό με φωτισμό" className="relative mx-auto mt-2 w-48" loading="lazy" /></div>
    </section>
    <section className="mt-14 max-w-4xl"><div className="flex items-baseline justify-between gap-4"><h2 className="text-2xl font-extrabold text-slate-800">Χρονοδιάγραμμα</h2><p className="text-sm font-bold text-coral">Νοέμβριος–Ιούνιος</p></div><div className="mt-5 divide-y divide-sky-100 overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-playful">{schedule.map((item, index) => <details key={item.month} open={index === 0} className="group"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 font-extrabold text-slate-700 marker:content-none hover:bg-sky-50"><span>{item.month}</span><span className="flex items-center gap-3 text-sm font-semibold text-slate-500">{item.meetings}<ChevronDown size={18} className="text-cyan transition group-open:rotate-180" /></span></summary><p className="px-4 pb-4 leading-relaxed text-slate-600">{item.summary}</p></details>)}</div></section>
  </div>
}
