import { Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Layout } from './components/Layout'
import { AdminPage } from './pages/AdminPage'
import { ClubPage } from './pages/ClubPage'
import { HomePage } from './pages/HomePage'
import { RegistrationPage } from './pages/RegistrationPage'
import { PresentationsPage } from './pages/PresentationsPage'

const ClubBookPage = lazy(async () => ({ default: (await import('./pages/ClubBookPage')).ClubBookPage }))

export default function App() {
  return <Routes><Route element={<Layout />}><Route path="/" element={<HomePage />} /><Route path="/club" element={<ClubPage />} /><Route path="/presentations" element={<PresentationsPage />} /><Route path="/book" element={<Suspense fallback={<div className="shell py-16 text-slate-500">Φόρτωση βιβλίου…</div>}><ClubBookPage /></Suspense>} /><Route path="/registration" element={<RegistrationPage />} /><Route path="/admin" element={<AdminPage />} /><Route path="*" element={<HomePage />} /></Route></Routes>
}
