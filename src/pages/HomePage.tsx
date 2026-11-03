import { ArrowRight, CalendarClock, GraduationCap, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { club } from '../data/club'
import { images } from '../lib/assets'

export function HomePage() {
  return <>
    <section className="shell grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.08fr_.92fr]">
      <div className="relative z-10">
        <p className="eyebrow">Όμιλος · {club.year}</p>
        <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-800 sm:text-6xl">Interactive <span className="text-cyan">3D</span> Lab</h1>
        <p className="mt-5 max-w-2xl text-lg font-bold leading-relaxed text-violet">{club.title}</p>
        <p className="mt-3 max-w-xl font-medium text-slate-500">{club.school}</p>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-600">{club.description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/registration" className="button-primary">Δήλωση Ομάδας <ArrowRight size={18} /></Link>
          <Link to="/club" className="button-secondary">Δείτε τον Όμιλο</Link>
        </div>
      </div>
      <div className="relative mx-auto w-full max-w-md">
        <div aria-hidden className="absolute inset-8 rounded-[3rem] bg-gradient-to-br from-sunshine/55 via-pink-200/60 to-sky-200/70 -rotate-6" />
        <img src={images.interactiveArt} alt="Παιδί μπροστά σε πολύχρωμο διαδραστικό εικαστικό" className="relative w-full drop-shadow-2xl" />
        <span className="absolute right-3 top-8 rounded-2xl bg-white px-3 py-2 text-sm font-extrabold text-coral shadow-playful">Φτιάχνουμε μαζί!</span>
      </div>
    </section>
    <section className="shell grid gap-4 sm:grid-cols-2">
      <div className="surface border-t-4 border-t-sunshine p-5"><CalendarClock className="mb-3 text-coral" /><p className="font-extrabold text-slate-800">Συναντήσεις</p><p className="mt-1 font-medium text-slate-500">{club.meetings} · {club.duration}</p></div>
      <div className="surface border-t-4 border-t-violet p-5"><GraduationCap className="mb-3 text-violet" /><p className="font-extrabold text-slate-800">Μαθητές και μαθήτριες</p><p className="mt-1 font-medium text-slate-500">{club.students}</p></div>
    </section>
    <section className="shell mt-12 grid items-center gap-7 rounded-3xl bg-gradient-to-r from-sky-50 via-white to-yellow-50 p-6 sm:p-8 lg:grid-cols-[.72fr_1.28fr]">
      <img src={images.teamDesign} alt="Μαθητές και μαθήτριες που σχεδιάζουν μαζί" className="mx-auto w-56 sm:w-64" loading="lazy" />
      <div><p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.16em] text-coral"><Heart size={16} fill="currentColor" />Τεχνολογίες</p><div className="mt-4 flex flex-wrap gap-2">{club.technologies.map((technology, index) => <span key={technology} className={`rounded-full px-3 py-1.5 text-sm font-bold ${index % 3 === 0 ? 'bg-sky-100 text-sky-700' : index % 3 === 1 ? 'bg-violet/10 text-violet' : 'bg-sunshine/25 text-orange-700'}`}>{technology}</span>)}</div></div>
    </section>
  </>
}
