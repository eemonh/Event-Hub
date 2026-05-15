import HeroSection from '../components/sections/HeroSection'
import CategoriesSection from '../components/sections/CategoriesSection'
import FeaturedEvents from '../components/sections/FeaturedEvents'
import EventGallery from '../components/sections/EventGallery'
import Testimonials from '../components/sections/Testimonials'
import Newsletter from '../components/sections/Newsletter'
import Footer from '../components/layout/Footer'

function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedEvents />
      <EventGallery />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  )
}

export default HomePage
