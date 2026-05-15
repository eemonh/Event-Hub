import { Routes, Route } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import HomePage from './page/HomePage'
import EventsPage from './page/EventsPage'
import VenuesPage from './page/VenuesPage'
import ContactPage from './page/ContactPage'
import RegisterPage from './page/RegisterPage'
import LoginPage from './page/LoginPage'

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/venues" element={<VenuesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Routes>
  )
}
