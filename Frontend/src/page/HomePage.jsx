import MainHeader from '../components/MainHeader'
import HeroSection from '../components/HeroSection'
import CategoriesSection from '../components/CategoriesSection'
import FeaturedEvents from '../components/FeaturedEvents'
import EventGallery from '../components/EventGallery'

function HomePage() {
  return (
    <div>
      <MainHeader />  
      <HeroSection />
      <CategoriesSection />
      <FeaturedEvents />
      <EventGallery />
    </div>
  )
}

export default HomePage
