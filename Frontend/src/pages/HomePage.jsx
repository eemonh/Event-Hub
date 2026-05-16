import { lazy, Suspense } from 'react'
import HeroSection from '../components/sections/HeroSection'
import CategoriesSection from '../components/sections/CategoriesSection'
import FeaturedEvents from '../components/sections/FeaturedEvents'
import EventGallery from '../components/sections/EventGallery'
import Testimonials from '../components/sections/Testimonials'
import Footer from '../layouts/Footer'

const Newsletter = lazy(() => import('../components/sections/Newsletter'))

function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedEvents />
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
