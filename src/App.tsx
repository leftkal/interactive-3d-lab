import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AdminPage } from './pages/AdminPage'
import { ClubPage } from './pages/ClubPage'
import { HomePage } from './pages/HomePage'
import { RegistrationPage } from './pages/RegistrationPage'
import { PresentationsPage } from './pages/PresentationsPage'

export default function App() {
  return <Routes><Route element={<Layout />}><Route path="/" element={<HomePage />} /><Route path="/club" element={<ClubPage />} /><Route path="/presentations" element={<PresentationsPage />} /><Route path="/registration" element={<RegistrationPage />} /><Route path="/admin" element={<AdminPage />} /><Route path="*" element={<HomePage />} /></Route></Routes>
}
