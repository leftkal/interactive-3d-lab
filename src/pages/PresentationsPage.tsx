import { ArrowUpRight, Download, ExternalLink, Link2, Presentation } from 'lucide-react'
import { useMemo, useState } from 'react'

const decks = [
  { id: 'intro', title: 'Γνωριμία με το Interactive 3D Lab', slides: '14 διαφάνειες', file: 'interactive-3d-lab-01.pptx' },
  { id: 'design', title: 'Εισαγωγή στο 3D Design', slides: '10 διαφάνειες', file: 'interactive-3d-lab-02.pptx' },
]

const usefulLinks = [
  { title: 'Η τάξη μας στο Tinkercad', description: 'Σύνδεση στην ψηφιακή τάξη του Ομίλου.', href: 'https://www.tinkercad.com/joinclass/S3J6HBFZU', primary: true },
  { title: 'Tinkercad Learning & Projects', description: 'Επίσημο υλικό για 3D σχεδιασμό και πρωτότυπα.', href: 'https://www.tinkercad.com/projects' },
  { title: 'Home Assistant', description: 'Επίσημη τεκμηρίωση εγκατάστασης σε Raspberry Pi.', href: 'https://www.home-assistant.io/installation/raspberrypi/' },
  { title: 'ESPHome', description: 'Επίσημη τεκμηρίωση για Native API και ESP32.', href: 'https://esphome.io/components/api/' },
  { title: 'ESP32 & WS2812 LED', description: 'Τεκμηρίωση για addressable RGB LED ταινίες.', href: 'https://esphome.io/components/light/esp32_rmt_led_strip/' },
]

export function PresentationsPage() {
  const [selected, setSelected] = useState(decks[0])
  const sourceUrl = useMemo(() => `${window.location.origin}${import.meta.env.BASE_URL}presentations/${selected.file}`, [selected.file])
  const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(sourceUrl)}`

  return <div className="shell py-12 sm:py-16">
    <header className="max-w-3xl"><p className="eyebrow">Υλικό συναντήσεων</p><h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">Παρουσιάσεις</h1><p className="mt-4 leading-relaxed text-slate-600">Οι παρουσιάσεις των συναντήσεων του Ομίλου σε μία σελίδα.</p></header>
    <section className="mt-9 grid gap-5 lg:grid-cols-[270px_1fr]">
      <div className="space-y-3">{decks.map((deck) => <button key={deck.id} onClick={() => setSelected(deck)} className={`w-full rounded-2xl border p-4 text-left transition ${selected.id === deck.id ? 'border-cyan bg-cyan/10 shadow-playful' : 'border-sky-100 bg-white hover:border-cyan/40'}`}><span className={`mb-3 grid h-9 w-9 place-items-center rounded-xl ${selected.id === deck.id ? 'bg-cyan text-white' : 'bg-violet/10 text-violet'}`}><Presentation size={19} /></span><p className="font-extrabold text-slate-800">{deck.title}</p><p className="mt-1 text-sm font-medium text-slate-500">{deck.slides}</p></button>)}</div>
      <div className="surface overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 px-5 py-4"><div><p className="font-extrabold text-slate-800">{selected.title}</p><p className="text-sm text-slate-500">{selected.slides}</p></div><div className="flex gap-2"><a className="button-secondary !px-3 !py-2 text-sm" href={viewerUrl} target="_blank" rel="noreferrer"><ExternalLink size={16} />Προβολή</a><a className="button-primary !px-3 !py-2 text-sm" href={`${import.meta.env.BASE_URL}presentations/${selected.file}`} download><Download size={16} />Λήψη</a></div></div><iframe key={selected.id} src={viewerUrl} title={selected.title} className="h-[62vh] min-h-[420px] w-full bg-sky-50" loading="lazy" /><p className="px-5 py-3 text-sm text-slate-500">Αν η προεπισκόπηση δεν ανοίξει, επιλέξτε «Λήψη» για να ανοίξετε το αρχείο PowerPoint.</p></div>
    </section>
    <section className="mt-14"><div className="flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan/10 text-cyan"><Link2 size={19} /></span><div><h2 className="text-2xl font-extrabold text-slate-800">Χρήσιμοι σύνδεσμοι</h2><p className="text-sm text-slate-500">Επίσημες πηγές και εργαλεία του Ομίλου.</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{usefulLinks.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className={`group rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-playful ${link.primary ? 'border-cyan/30 bg-cyan/10' : 'border-sky-100 bg-white hover:border-cyan/40'}`}><div className="flex items-start justify-between gap-3"><p className={`font-extrabold ${link.primary ? 'text-cyan' : 'text-slate-800'}`}>{link.title}</p><ArrowUpRight size={18} className="shrink-0 text-slate-400 transition group-hover:text-cyan" /></div><p className="mt-2 text-sm leading-relaxed text-slate-500">{link.description}</p></a>)}</div></section>
  </div>
}
