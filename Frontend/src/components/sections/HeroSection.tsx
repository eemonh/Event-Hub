import { useMemo, useRef } from "react"
import EventCard from "../ui/EventCard"
import useCarousel from "../../hooks/useCarousel"

const heroEvents = [
  {
    title: "Tech Meetup",
    category: "Networking",
    image:
      "https://images.unsplash.com/photo-1576085898323-218337e3e43c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    featured: false,
  },
  {
    title: "Summer Festival",
    category: "Music & Arts",
    image:
      "https://images.unsplash.com/photo-1631179234473-f48fedffed9a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    featured: true,
  },
  {
    title: "City Marathon",
    category: "Sports",
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop",
    featured: false,
  },
]

const HeroSection = () => {
  const initialFeaturedIndex = useMemo(() => {
    const featuredIndex = heroEvents.findIndex((event) => event.featured)
    return featuredIndex >= 0 ? featuredIndex : 0
  }, [])

  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const { activeIndex } = useCarousel({
    items: heroEvents,
    containerRef: scrollContainerRef,
    itemRefs: cardRefs,
    initialIndex: initialFeaturedIndex,
  })

  return (
    <section className="relative overflow-hidden bg-bg-muted py-16 pb-24 md:py-20 md:pb-32">
      <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-[600px] rounded-[9999px] bg-gradient-to-b from-indigo-100/40 to-transparent blur-3xl opacity-70" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-8 flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="max-w-[700px] text-4xl md:text-5xl lg:text-[72px] leading-tight md:leading-[72px] font-bold tracking-[-1.8px] text-text-primary">
            Discover Amazing
            <br />
            Events Around You
          </h1>

          <p className="max-w-[672px] text-[20px] leading-[28px] text-text-muted">
            Helping you create and find memorable experiences with ease.
            Let&apos;s turn your vision into reality!
          </p>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex w-screen snap-x snap-mandatory items-center gap-4 overflow-x-auto px-[max(14vw,calc((100vw-315px)/2))] md:hidden"
        >
          {heroEvents.map((event, index) => (
            <div
              key={index}
              ref={(card) => { cardRefs.current[index] = card }}
              className="w-[72vw] max-w-[315px] shrink-0 snap-center"
            >
              <EventCard {...event} featured={index === activeIndex} />
            </div>
          ))}
        </div>

        <div className="hidden md:flex flex-row items-center justify-center gap-6">
          {heroEvents.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
