import { useCallback, useEffect, useRef, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  X,
} from "lucide-react"
import SectionHeading from "../ui/SectionHeading"
import { getEvents } from "../../services/events"

const cloudinaryFetchBase =
  "https://res.cloudinary.com/demo/image/fetch/f_auto,q_auto,w_1400"

const FALLBACK_GALLERY_ITEMS = [
  {
    id: "indie-night-live",
    title: "Indie Night Live",
    category: "Concerts",
    location: "Warehouse Stage, New York",
    date: "April 2026",
    image:
      `${cloudinaryFetchBase}/https://images.unsplash.com/photo-1501386761578-eac5c94b800a`,
    alt: "Crowd cheering under purple stage lights at an indoor concert hosted by Event Hub",
    featured: true,
    summary:
      "A packed live music night with local bands, food stalls, and a closing set that kept the room moving past midnight.",
  },
  {
    id: "founders-table",
    title: "Founders Table",
    category: "Networking",
    location: "Civic Loft, New York",
    date: "March 2026",
    image:
      `${cloudinaryFetchBase}/https://images.unsplash.com/photo-1521737711867-e3b97375f902`,
    alt: "Professionals talking around a table during a hosted networking event",
    featured: false,
    summary:
      "An invite-only evening for founders, operators, and investors built around short talks and meaningful introductions.",
  },
  {
    id: "product-craft-summit",
    title: "Product Craft Summit",
    category: "Conferences",
    location: "Pier 59 Studios, New York",
    date: "February 2026",
    image:
      `${cloudinaryFetchBase}/https://images.unsplash.com/photo-1540575467063-178a50c2df87`,
    alt: "Conference audience seated in front of a lit stage during a hosted summit",
    featured: false,
    summary:
      "A one-day conference for product teams with keynote sessions, hands-on breakouts, and a closing reception.",
  },
  {
    id: "summer-sound-festival",
    title: "Summer Sound Festival",
    category: "Festivals",
    location: "Riverside Park, Brooklyn",
    date: "August 2025",
    image:
      `${cloudinaryFetchBase}/https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f`,
    alt: "Festival crowd with raised hands watching a performer on an outdoor stage",
    featured: false,
    summary:
      "A full-day outdoor celebration with live performances, creator booths, food vendors, and family-friendly programming.",
  },
  {
    id: "makers-exhibition",
    title: "Makers Exhibition",
    category: "Exhibitions",
    location: "Hudson Gallery, Manhattan",
    date: "November 2025",
    image:
      `${cloudinaryFetchBase}/https://images.unsplash.com/photo-1511578314322-379afb476865`,
    alt: "Guests walking through a warmly lit exhibition space during an Event Hub showcase",
    featured: false,
    summary:
      "A curated showcase where independent makers presented installations, prototypes, and limited-run creative work.",
  },
  {
    id: "tech-meetup-afterhours",
    title: "Tech Meetup Afterhours",
    category: "Meetups",
    location: "Northside Studio, Queens",
    date: "October 2025",
    image:
      `${cloudinaryFetchBase}/https://images.unsplash.com/photo-1516321318423-f06f85e504b3`,
    alt: "Speaker presenting to attendees at a hosted technology meetup",
    featured: false,
    summary:
      "A community meetup with lightning talks, product demos, and relaxed time for builders to compare notes.",
  },
]

export default function EventGallery() {
  const [galleryItems, setGalleryItems] = useState(FALLBACK_GALLERY_ITEMS)
  const [activeItemId, setActiveItemId] = useState(null)
  const closeButtonRef = useRef(null)
  const previouslyFocusedElement = useRef(null)
  const visibleItems = galleryItems

  useEffect(() => {
    async function fetchGalleryEvents() {
      try {
        const data = await getEvents(null, { limit: 6 })
        if (data.events && data.events.length > 0) {
          const mapped = data.events.map((event, index) => ({
            id: event._id || event.id,
            title: event.name,
            category: event.category,
            location: event.venue,
            date: new Date(event.startDate).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
            image: event.coverImage,
            alt: `${event.name} event cover image`,
            featured: index === 0,
            summary: event.description || "",
          }))
          setGalleryItems(mapped)
        }
      } catch {
        /* keep fallback data */
      }
    }
    fetchGalleryEvents()
  }, [])

  const activeIndex = visibleItems.findIndex((item) => item.id === activeItemId)
  const activeItem = activeIndex >= 0 ? visibleItems[activeIndex] : null

  const openLightbox = (itemId) => {
    previouslyFocusedElement.current = document.activeElement
    setActiveItemId(itemId)
  }

  const closeLightbox = useCallback(() => {
    setActiveItemId(null)
    previouslyFocusedElement.current?.focus?.()
  }, [])

  const showPreviousItem = useCallback(() => {
    if (activeIndex < 0) return

    const previousIndex =
      activeIndex === 0 ? visibleItems.length - 1 : activeIndex - 1

    setActiveItemId(visibleItems[previousIndex].id)
  }, [activeIndex, visibleItems])

  const showNextItem = useCallback(() => {
    if (activeIndex < 0) return

    const nextIndex =
      activeIndex === visibleItems.length - 1 ? 0 : activeIndex + 1

    setActiveItemId(visibleItems[nextIndex].id)
  }, [activeIndex, visibleItems])

  useEffect(() => {
    if (!activeItem) return undefined

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeButtonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeLightbox()
      }

      if (event.key === "ArrowLeft") {
        showPreviousItem()
      }

      if (event.key === "ArrowRight") {
        showNextItem()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [activeItem, closeLightbox, showNextItem, showPreviousItem])

  return (
    <section className="bg-gray-50 px-4 py-20 sm:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl mx-auto">
          <SectionHeading
            center={true}
            title="Event Gallery"
            subtitle="A glimpse into some of our most memorable experiences"
          />
        </div>

        

        {visibleItems.length >= 6 ? (
          <>
            <StandardGalleryGrid
              className="lg:hidden"
              items={visibleItems}
              onOpen={openLightbox}
            />
            <DesktopCollage items={visibleItems} onOpen={openLightbox} />
          </>
        ) : (
          <StandardGalleryGrid
            items={visibleItems}
            onOpen={openLightbox}
          />
        )}
      </div>

      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 px-4 py-6 backdrop-blur-sm sm:px-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-gallery-lightbox-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeLightbox()
            }
          }}
        >
          <div className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl lg:grid lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.7fr)]">
            <div className="relative min-h-[280px] bg-gray-950 sm:min-h-[420px] lg:min-h-[640px]">
              <img
                src={activeItem.image}
                alt={activeItem.alt}
                className="h-full max-h-[64vh] w-full object-cover lg:max-h-none"
              />

              {visibleItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPreviousItem}
                    aria-label="Show previous hosted event"
                    className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-text-primary shadow-lg outline-none transition hover:bg-white focus-visible:ring-4 focus-visible:ring-primary/40"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={showNextItem}
                    aria-label="Show next hosted event"
                    className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-text-primary shadow-lg outline-none transition hover:bg-white focus-visible:ring-4 focus-visible:ring-primary/40"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>

            <div className="flex min-h-0 flex-col overflow-y-auto p-5 sm:p-7 lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {activeItem.category}
                </span>

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeLightbox}
                  aria-label="Close hosted event viewer"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-text-primary outline-none transition hover:bg-gray-200 focus-visible:ring-4 focus-visible:ring-primary/30"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-8">
                <p className="text-sm font-semibold text-text-muted">
                  {activeIndex + 1} / {visibleItems.length}
                </p>

                <h3
                  id="event-gallery-lightbox-title"
                  className="mt-3 text-3xl font-bold leading-tight text-text-primary sm:text-4xl"
                >
                  {activeItem.title}
                </h3>

                <div className="mt-5 flex flex-col gap-3 text-sm font-medium text-text-muted">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                    {activeItem.location}
                  </span>
                  <span>{activeItem.date}</span>
                </div>

                {activeItem.summary && (
                  <p className="mt-6 text-base leading-7 text-text-muted">
                    {activeItem.summary}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

const StandardGalleryGrid = ({
  items,
  onOpen,
  className = "",
}) => {
  return (
    <div
      className={`mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[230px] lg:grid-cols-3 ${className}`}
    >
      {items.map((item, index) => (
        <GalleryCard
          key={item.id}
          item={item}
          isFeatured={item.featured}
          onOpen={() => onOpen(item.id)}
          priority={index + 1}
        />
      ))}
    </div>
  )
}

const DesktopCollage = ({ items, onOpen }) => {
  const collageItems = items.slice(0, 6)
  const [leftTop, leftBottom, rightTop, rightMiddleLeft, rightMiddleRight, rightBottom] =
    collageItems

  return (
    <div className="mt-8 hidden h-[620px] overflow-hidden rounded-[2rem] bg-white p-1.5 shadow-lg ring-1 ring-gray-200 lg:grid lg:grid-cols-2 lg:gap-1.5">
      <div className="grid min-h-0 grid-rows-[3fr_2fr] gap-1.5">
        <GalleryCard
          item={leftTop}
          onOpen={() => onOpen(leftTop.id)}
          priority={1}
          variant="collage"
        />
        <GalleryCard
          item={leftBottom}
          onOpen={() => onOpen(leftBottom.id)}
          priority={2}
          variant="collage"
        />
      </div>

      <div className="grid min-h-0 grid-rows-[2fr_1fr_2fr] gap-1.5">
        <GalleryCard
          item={rightTop}
          onOpen={() => onOpen(rightTop.id)}
          priority={3}
          variant="collage"
        />

        <div className="grid min-h-0 grid-cols-2 gap-1.5">
          <GalleryCard
            item={rightMiddleLeft}
            onOpen={() => onOpen(rightMiddleLeft.id)}
            priority={4}
            variant="collage"
          />
          <GalleryCard
            item={rightMiddleRight}
            onOpen={() => onOpen(rightMiddleRight.id)}
            priority={5}
            variant="collage"
          />
        </div>

        <GalleryCard
          item={rightBottom}
          onOpen={() => onOpen(rightBottom.id)}
          priority={6}
          variant="collage"
        />
      </div>
    </div>
  )
}

const GalleryCard = ({
  item,
  isFeatured = false,
  onOpen,
  priority,
  variant = "grid",
}) => {
  const isCollage = variant === "collage"

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${item.title} hosted event photo`}
      className={`group relative overflow-hidden bg-gray-900 text-left outline-none transition-all duration-300 focus-visible:ring-4 focus-visible:ring-primary/35 ${
        isCollage
          ? "min-h-0 rounded-[1.5rem]"
          : `min-h-[280px] rounded-[1.75rem] shadow-md hover:-translate-y-1 hover:shadow-xl ${
              isFeatured ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""
            }`
      }`}
    >
      <img
        src={item.image}
        alt={item.alt}
        loading={priority <= 2 ? "eager" : "lazy"}
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105 group-focus-visible:scale-105"
      />

      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-950/85 via-gray-950/25 to-transparent transition-all duration-300 group-hover:from-gray-950/90 ${
          isCollage
            ? "h-[52%] group-hover:h-[58%]"
            : isFeatured
              ? "h-[72%] group-hover:h-[78%]"
              : "h-[64%] group-hover:h-[70%]"
        }`}
      />

      <div className={`absolute inset-x-0 bottom-0 z-10 ${isCollage ? "p-5" : "p-5 sm:p-6"}`}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary">
            {item.category}
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm lg:hidden">
            {item.date}
          </span>
        </div>

        <h3
          className={`font-bold leading-tight text-white ${
            isCollage
              ? "text-xl sm:text-2xl"
              : isFeatured
                ? "text-3xl sm:text-4xl"
                : "text-2xl"
          }`}
        >
          {item.title}
        </h3>

        <p className="mt-3 flex items-center gap-2 text-sm font-medium leading-5 text-white/85 lg:hidden">
          <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{item.location}</span>
        </p>
      </div>
    </button>
  )
}
