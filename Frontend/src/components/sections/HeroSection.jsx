import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import EventCard from "../ui/EventCard"
import { heroEvents } from "../../data/heroEvents"

const HeroSection = () => {
  const initialFeaturedIndex = useMemo(() => {
    const featuredIndex = heroEvents.findIndex((event) => event.featured)

    return featuredIndex >= 0 ? featuredIndex : 0
  }, [])

  const scrollContainerRef = useRef(null)
  const cardRefs = useRef([])
  const [activeIndex, setActiveIndex] = useState(initialFeaturedIndex)

  const updateActiveCard = useCallback(() => {
    const container = scrollContainerRef.current

    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const containerCenter = containerRect.left + containerRect.width / 2

    let nextActiveIndex = 0
    let closestDistance = Infinity

    cardRefs.current.forEach((card, index) => {
      if (!card) return

      const cardRect = card.getBoundingClientRect()
      const cardCenter = cardRect.left + cardRect.width / 2
      const distance = Math.abs(containerCenter - cardCenter)

      if (distance < closestDistance) {
        closestDistance = distance
        nextActiveIndex = index
      }
    })

    setActiveIndex((currentIndex) =>
      currentIndex === nextActiveIndex ? currentIndex : nextActiveIndex
    )
  }, [])

  useEffect(() => {
    const container = scrollContainerRef.current

    if (!container) return

    const mediaQuery = window.matchMedia("(max-width: 767px)")
    let animationFrameId = null

    const requestActiveCardUpdate = () => {
      if (!mediaQuery.matches || animationFrameId) return

      animationFrameId = window.requestAnimationFrame(() => {
        animationFrameId = null
        updateActiveCard()
      })
    }

    const scrollInitialCardIntoView = () => {
      if (!mediaQuery.matches) return

      cardRefs.current[initialFeaturedIndex]?.scrollIntoView({
        block: "nearest",
        inline: "center",
      })
      updateActiveCard()
    }

    scrollInitialCardIntoView()

    container.addEventListener("scroll", requestActiveCardUpdate, {
      passive: true,
    })
    window.addEventListener("resize", requestActiveCardUpdate)

    return () => {
      container.removeEventListener("scroll", requestActiveCardUpdate)
      window.removeEventListener("resize", requestActiveCardUpdate)

      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId)
      }
    }
  }, [initialFeaturedIndex, updateActiveCard])

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
              ref={(card) => {
                cardRefs.current[index] = card
              }}
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
