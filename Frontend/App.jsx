import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import RootLayout from './src/layouts/RootLayout'
import ProtectedRoute from './src/components/auth/ProtectedRoute'
import DashboardLayout from './src/layouts/DashboardLayout'
import PageSkeleton from './src/components/ui/PageSkeleton'

const HomePage = lazy(() => import('./src/pages/HomePage'))
const EventsPage = lazy(() => import('./src/pages/EventsPage'))
const VenuesPage = lazy(() => import('./src/pages/VenuesPage'))
const ContactPage = lazy(() => import('./src/pages/ContactPage'))
const AuthPage = lazy(() => import('./src/pages/AuthPage'))
const UserDashboard = lazy(() => import('./src/pages/UserDashboard'))
const DashboardEvents = lazy(() => import('./src/pages/dashboard/EventsPage'))
const DashboardOrganizers = lazy(() => import('./src/pages/dashboard/OrganizersPage'))
const DashboardProfile = lazy(() => import('./src/pages/dashboard/ProfilePage'))

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
