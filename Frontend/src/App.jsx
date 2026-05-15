import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import RootLayout from './layouts/RootLayout'
import HomePage from './page/HomePage'
import EventsPage from './page/EventsPage'
import VenuesPage from './page/VenuesPage'
import ContactPage from './page/ContactPage'
import RegisterPage from './page/RegisterPage'
import UserDashboard from './page/UserDashboard'

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
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
        </Route>
      </Routes>
    </>
  )
}
