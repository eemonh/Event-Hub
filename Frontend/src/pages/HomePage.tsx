import { lazy, Suspense } from 'react'
import { MapPin, CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'
import HeroSection from '../components/sections/HeroSection'
import CategoriesSection from '../components/sections/CategoriesSection'
import FeaturedEvents from '../components/sections/FeaturedEvents'
import EventGallery from '../components/sections/EventGallery'
import Testimonials from '../components/sections/Testimonials'
import Footer from '../layouts/Footer'
import { useAuth } from '../context/AuthContext'
import { useRecommendedEvents } from '../hooks/queries/useEvents'

const Newsletter = lazy(() => import('../components/sections/Newsletter'))

function HomePage() {
  const { user } = useAuth()
  const { data: recData } = useRecommendedEvents({ enabled: !!user })

  const recommendedEvents = recData?.events?.slice(0, 6) || []

  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedEvents />
      {user && recommendedEvents.length > 0 && (
        <section className="bg-bg-muted px-4 py-16 sm:px-6 md:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="font-[Poppins] text-3xl font-bold text-slate-900 sm:text-4xl">Recommended for You</h2>
                <p className="mt-1 text-slate-500">Personalized picks based on your interests.</p>
              </div>
              <Link to="/dashboard" className="hidden text-sm font-semibold text-violet-700 hover:text-violet-800 sm:block">View all</Link>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {recommendedEvents.map((event) => {
                const startDate = new Date(event.startDate)
                return (
                  <Link key={event._id || event.id} to={'/events/' + (event._id || event.id)}
                    className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <div className="relative h-48 overflow-hidden">
                      <img src={event.coverImage || 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop'} alt={event.name} loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop' }}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                      <div className="absolute left-3 top-3 flex flex-col gap-1">
                        <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-violet-700 shadow">{event.category}</span>
                        {event.reason && (
                          <span className="rounded-md bg-violet-700 px-2 py-1 text-xs font-medium text-white shadow">{event.reason}</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-3 p-4">
                      <h3 className="font-[Poppins] text-xl font-semibold leading-snug text-slate-900">{event.name}</h3>
                      <div className="space-y-1.5 text-sm text-slate-500">
                        <div className="flex items-center gap-2"><CalendarDays size={14} />{startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                        <div className="flex items-center gap-2"><MapPin size={14} />{event.venue}</div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
      <EventGallery />
      <Testimonials />
      <Suspense fallback={<div className="h-40 animate-pulse bg-gray-100" />}>
        <Newsletter />
      </Suspense>
      <Footer />
    </div>
  )
}

export default HomePage
