import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { club } from '../data/club'
import { Brand } from './Brand'

const linkClass = ({ isActive }: { isActive: boolean }) => `rounded-xl px-3 py-2 text-sm font-bold transition ${isActive ? 'bg-sunshine/25 text-orange-700' : 'text-slate-600 hover:bg-sky-50 hover:text-cyan'}`

export function Layout() {
  const [open, setOpen] = useState(false)
  const links = <>
    <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>Αρχική</NavLink>
    <NavLink to="/club" className={linkClass} onClick={() => setOpen(false)}>Ο Όμιλος</NavLink>
    <NavLink to="/registration" className={linkClass} onClick={() => setOpen(false)}>Δήλωση Ομάδας</NavLink>
  </>
  return <div className="relative min-h-screen overflow-x-hidden">
    <div aria-hidden className="pointer-events-none absolute -top-48 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-sky-200/55 blur-3xl" />
    <div aria-hidden className="pointer-events-none absolute top-72 -left-24 h-64 w-64 rounded-full bg-sunshine/25 blur-3xl" />
    <div aria-hidden className="pointer-events-none absolute top-[38rem] -right-20 h-72 w-72 rounded-full bg-pink-200/35 blur-3xl" />
    <header className="relative border-b border-sky-100 bg-white/85 backdrop-blur">
      <div className="shell flex h-16 items-center justify-between">
        <Brand />
        <nav className="hidden items-center gap-1 sm:flex" aria-label="Κύρια πλοήγηση">{links}</nav>
        <button className="rounded-xl p-2 text-slate-700 hover:bg-sky-50 sm:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Κλείσιμο μενού' : 'Άνοιγμα μενού'}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav className="shell flex flex-col gap-1 border-t border-sky-100 py-3 sm:hidden" aria-label="Κύρια πλοήγηση">{links}</nav>}
    </header>
    <main className="relative"><Outlet /></main>
    <footer className="relative mt-16 border-t border-sky-100 bg-white/60 py-6 text-center text-sm font-medium text-slate-500">Interactive 3D Lab · {club.year}</footer>
  </div>
}
