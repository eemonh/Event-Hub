import MainHeader from '../components/MainHeader'
import HeroSection from '../components/HeroSection'
import CategoriesSection from '../components/CategoriesSection'
import FeaturedEvents from '../components/FeaturedEvents'
import EventGallery from '../components/EventGallery'
import Testimonials from '../components/Testimonials'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'

function HomePage() {
  return (
    <div>
      <MainHeader />  
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
