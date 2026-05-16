import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import RootLayout from './components/layout/RootLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import DashboardLayout from './components/layout/DashboardLayout'
import PageSkeleton from './components/ui/PageSkeleton'

const HomePage = lazy(() => import('./pages/HomePage'))
const EventsPage = lazy(() => import('./pages/EventsPage'))
const VenuesPage = lazy(() => import('./pages/VenuesPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const UserDashboard = lazy(() => import('./pages/UserDashboard'))
const DashboardEvents = lazy(() => import('./pages/dashboard/EventsPage'))
const DashboardOrganizers = lazy(() => import('./pages/dashboard/OrganizersPage'))
const DashboardProfile = lazy(() => import('./pages/dashboard/ProfilePage'))

export default function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/venues" element={<VenuesPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          <Route path="/register" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/dashboard/events" element={<DashboardEvents />} />
              <Route path="/dashboard/organizers" element={<DashboardOrganizers />} />
              <Route path="/dashboard/profile" element={<DashboardProfile />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}
