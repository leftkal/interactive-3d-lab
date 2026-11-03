import { Box } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Brand() {
  return <Link to="/" className="flex items-center gap-2.5 font-extrabold tracking-tight text-slate-800" aria-label="Interactive 3D Lab — Αρχική">
    <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-sunshine via-coral to-violet text-white shadow-glow"><Box size={21} strokeWidth={2.5} /></span>
    <span>Interactive <span className="text-cyan">3D</span> Lab</span>
  </Link>
}
