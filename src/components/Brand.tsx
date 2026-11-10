import { Link } from 'react-router-dom'
import { images } from '../lib/assets'

export function Brand() {
  return <Link to="/" className="flex items-center gap-2.5 font-extrabold tracking-tight text-slate-800" aria-label="Interactive 3D Lab — Αρχική">
    <img src={images.logo} alt="Λογότυπο Interactive 3D Lab" className="h-11 w-11 rounded-full object-cover shadow-glow" />
    <span>Interactive <span className="text-cyan">3D</span> Lab</span>
  </Link>
}
