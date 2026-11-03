import { ArrowRight, CalendarClock, GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { club } from '../data/club'

export function HomePage() {
  return <>
    <section className="shell py-16 sm:py-24">
      <div className="max-w-3xl">
        <p className="mb-5 inline-flex rounded-full border border-cyan/25 bg-cyan/10 px-3 py-1 text-sm font-medium text-cyan">Όμιλος · {club.year}</p>
        <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl">Interactive <span className="text-cyan">3D</span> Lab</h1>
        <p className="mt-5 max-w-2xl text-lg font-medium leading-relaxed text-slate-200">{club.title}</p>
        <p className="mt-3 max-w-xl text-slate-400">{club.school}</p>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-300">{club.description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/registration" className="button-primary">Δήλωση Ομάδας <ArrowRight size={18} /></Link>
          <Link to="/club" className="button-secondary">Δείτε τον Όμιλο</Link>
        </div>
      </div>
    </section>
    <section className="shell grid gap-4 sm:grid-cols-2">
      <div className="surface p-5"><CalendarClock className="mb-3 text-cyan" /><p className="font-semibold">Συναντήσεις</p><p className="mt-1 text-slate-400">{club.meetings} · {club.duration}</p></div>
      <div className="surface p-5"><GraduationCap className="mb-3 text-violet" /><p className="font-semibold">Μαθητές και μαθήτριες</p><p className="mt-1 text-slate-400">{club.students}</p></div>
    </section>
    <section className="shell mt-12"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Τεχνολογίες</p><div className="mt-4 flex flex-wrap gap-2">{club.technologies.map((technology) => <span key={technology} className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-sm text-blue-100">{technology}</span>)}</div></section>
  </>
}
