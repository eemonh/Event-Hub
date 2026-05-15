import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import RootLayout from './components/layout/RootLayout'
import HomePage from './pages/HomePage'
import EventsPage from './pages/EventsPage'
import VenuesPage from './pages/VenuesPage'
import ContactPage from './pages/ContactPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'

export default function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/venues" element={<VenuesPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  )
}
