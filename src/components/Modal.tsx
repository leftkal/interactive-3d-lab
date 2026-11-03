import { X } from 'lucide-react'
import { type ReactNode, useEffect } from 'react'

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [onClose])
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div className="surface max-h-[90vh] w-full max-w-lg overflow-y-auto p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4"><h2 id="modal-title" className="text-xl font-bold">{title}</h2><button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Κλείσιμο"><X /></button></div>
      {children}
    </div>
  </div>
}
