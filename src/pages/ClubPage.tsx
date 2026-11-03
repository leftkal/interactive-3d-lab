import { ChevronDown, Sparkles } from 'lucide-react'
import { club, objectives, schedule } from '../data/club'

export function ClubPage() {
  return <div className="shell py-12 sm:py-16">
    <header className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan">Ο Όμιλος</p><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Από την ιδέα στη διαδραστική κατασκευή.</h1><p className="mt-5 leading-relaxed text-slate-300">{club.description}</p></header>
    <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div><h2 className="text-xl font-bold">Κύριοι στόχοι</h2><ul className="mt-4 space-y-3">{objectives.map((objective) => <li key={objective} className="flex gap-3 text-slate-300"><Sparkles size={18} className="mt-0.5 shrink-0 text-violet" />{objective}</li>)}</ul></div>
      <div className="surface p-6"><h2 className="text-xl font-bold">Το κοινό τελικό έργο</h2><p className="mt-3 leading-relaxed text-slate-300">Οι ομάδες σχεδιάζουν και υλοποιούν ένα διαδραστικό εικαστικό για το σχολείο, ενσωματώνοντας τρισδιάστατα εκτυπωμένα στοιχεία, αισθητήρες, RGB φωτισμό, ESP32 και αυτοματισμούς μέσω Home Assistant.</p></div>
    </section>
    <section className="mt-14 max-w-4xl"><div className="flex items-baseline justify-between gap-4"><h2 className="text-2xl font-bold">Χρονοδιάγραμμα</h2><p className="text-sm text-slate-500">Νοέμβριος–Ιούνιος</p></div><div className="mt-5 divide-y divide-slate-700 rounded-2xl border border-slate-700 bg-panel/70">{schedule.map((item, index) => <details key={item.month} open={index === 0} className="group"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 font-semibold marker:content-none"><span>{item.month}</span><span className="flex items-center gap-3 text-sm font-normal text-slate-400">{item.meetings}<ChevronDown size={18} className="transition group-open:rotate-180" /></span></summary><p className="px-4 pb-4 leading-relaxed text-slate-300">{item.summary}</p></details>)}</div></section>
  </div>
}
