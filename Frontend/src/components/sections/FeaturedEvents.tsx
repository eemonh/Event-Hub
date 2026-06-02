import { useMemo, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import Button from "../ui/Button"
import EventCard from "../ui/EventCard"
import SectionHeading from "../ui/SectionHeading"

const featuredEvents = [
  {
    id: 1,
    title: "Flavor Fest",
    category: "Food & Drink",
    format: "In person",
    location: "Central Park Pavilion",
    city: "New York",
    time: "9:00 AM",
    date: "Thu, Apr 20",
    price: "$79",
    tags: ["food-drink", "tasting", "outdoor", "weekend"],
    audience: ["foodies", "young-professionals"],
    popularity: 92,
    recommendationReason: "Because you viewed chef-led tastings",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1400&auto=format&fit=crop",
    large: true,
  },
  {
    id: 2,
    title: "Sips & Bites",
    category: "Food & Drink",
    format: "In person",
    location: "Riverfront Market",
    city: "New York",
    time: "12:00 PM",
    date: "Fri, Feb 15",
    price: "$79",
    tags: ["food-drink", "market", "nightlife", "local"],
    audience: ["foodies", "couples"],
    popularity: 86,
    recommendationReason: "Popular near your saved area",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Indie Night Live",
    category: "Music",
    format: "In person",
    location: "Warehouse Stage",
    city: "New York",
    time: "8:00 PM",
    date: "Sat, Apr 22",
    price: "$49",
    tags: ["music", "live", "nightlife", "indie"],
    audience: ["music-fans", "young-professionals"],
    popularity: 88,
    recommendationReason: "Because you follow live music nights",
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Studio Sessions Online",
    category: "Music",
    format: "Online",
    location: "Streaming Room",
    city: "Virtual",
    time: "7:00 PM",
    date: "Wed, Apr 26",
    price: "$29",
    tags: ["music", "online", "artist-talk", "workshop"],
    audience: ["music-fans", "remote-attendees"],
    popularity: 74,
    recommendationReason: "A remote pick from your music history",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Founders Table",
    category: "Networking",
    format: "In person",
    location: "Civic Loft",
    city: "New York",
    time: "6:00 PM",
    date: "Thu, Apr 27",
    price: "$39",
    tags: ["networking", "founders", "local", "career"],
    audience: ["founders", "young-professionals"],
    popularity: 81,
    recommendationReason: "Trending with professionals nearby",
    image:
      "https://images.unsplash.com/photo-1515169067865-5387ec356754?q=80&w=1200&auto=format&fit=crop",
  },
]

const filters = [
  { label: "For You", value: "for-you" },
  { label: "All", value: "all" },
  { label: "Online", value: "online" },
  { label: "Music", value: "music" },
  { label: "Food & Drink", value: "food-drink" },
]

const mockUserSignals = {
  interests: ["food-drink", "music", "workshop"],
  history: ["food-drink", "online", "nightlife"],
  location: {
    city: "New York",
  },
  demographics: {
    audience: ["young-professionals", "remote-attendees"],
  },
}

const categoryToSlug = (category = "") =>
  category.toLowerCase().replace(/&/g, "").replace(/\s+/g, "-")

const eventMatchesFilter = (event: typeof featuredEvents[0], selectedFilter: string) => {
  if (selectedFilter === "for-you" || selectedFilter === "all") {
    return true
  }

  if (selectedFilter === "online") {
    return (
      event.format?.toLowerCase() === "online" ||
      event.tags?.includes("online")
    )
  }

  return (
    categoryToSlug(event.category) === selectedFilter ||
    event.tags?.includes(selectedFilter)
  )
}

const getRecommendationScore = (event: typeof featuredEvents[0], userSignals: typeof mockUserSignals) => {
  const eventTags = event.tags ?? []
  const eventAudience = event.audience ?? []
  let score = event.popularity ?? 0

  if (userSignals.interests.some((interest) => eventTags.includes(interest))) {
    score += 28
  }

  if (userSignals.history.some((item) => eventTags.includes(item))) {
    score += 22
  }

  if (event.city === userSignals.location.city) {
    score += 16
  }

  if (
    userSignals.demographics.audience.some((audience) =>
      eventAudience.includes(audience)
    )
  ) {
    score += 12
  }

  return score
}

const getRankedFeaturedEvents = ({
  events,
  selectedFilter,
  userSignals = mockUserSignals,
}: {
  events: typeof featuredEvents;
  selectedFilter: string;
  userSignals?: typeof mockUserSignals;
}) => {
  const matchingEvents = events.filter((event: typeof featuredEvents[0]) =>
    eventMatchesFilter(event, selectedFilter)
  )
  const sourceEvents = matchingEvents.length > 0 ? matchingEvents : events

  return sourceEvents
    .map((event: typeof featuredEvents[0], index: number) => ({
      ...event,
      score:
        selectedFilter === "for-you"
          ? getRecommendationScore(event, userSignals)
          : (event.popularity ?? 0) - index,
    }))
    .sort((first: { score: number }, second: { score: number }) => second.score - first.score)
}

const FeaturedEvents = () => {
  const [selectedFilter, setSelectedFilter] = useState("for-you")

  const rankedEvents = useMemo(
    () =>
      getRankedFeaturedEvents({
        events: featuredEvents,
        selectedFilter,
        userSignals: mockUserSignals,
      }),
    [selectedFilter]
  )

  const primaryEvent = rankedEvents[0]
  const supportingEvents = rankedEvents.slice(1, 3)
  const activeFilter = filters.find((filter) => filter.value === selectedFilter)

  return (
    <section className="bg-bg-muted px-4 py-16 sm:px-6 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title="Exciting Events Around the Corner">
          <div className="w-full overflow-x-auto pb-2 sm:w-auto sm:overflow-visible sm:pb-0">
            <div className="flex min-w-max items-center gap-1 rounded-full bg-gray-100 p-1">
              {filters.map((item) => {
                const isActive = selectedFilter === item.value

                return (
                  <Button
                    key={item.value}
                    type="button"
                    variant={isActive ? "primary" : "ghost"}
                    size="sm"
                    aria-pressed={isActive}
                    onClick={() => setSelectedFilter(item.value)}
                  >
                    {item.label}
                  </Button>
                )
              })}
            </div>
          </div>
        </SectionHeading>

        <div className="mt-8 text-center md:mt-10 md:text-left">
          <p className="text-sm font-semibold text-primary">
            {selectedFilter === "for-you"
              ? "Personalized from your interests, history, and location"
              : `Showing ${activeFilter?.label ?? "matching"} events`}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-[2fr_1fr] lg:gap-6 items-start">
          {primaryEvent && (
            <EventCard {...primaryEvent} variant="stacked" featured />
          )}

          {supportingEvents.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-1 lg:gap-6">
              {supportingEvents.map((event) => (
                <EventCard key={event.id} {...event} variant="stacked" />
              ))}
            </div>
          )}
        </div>

        <Link
          to="/events"
          className="group mt-6 flex flex-col gap-6 rounded-2xl bg-primary px-5 py-7 shadow-md transition hover:bg-primary-hover sm:px-6 md:flex-row md:items-center md:justify-between md:py-10"
        >
          <h3 className="max-w-xl text-2xl font-bold leading-tight text-white sm:text-3xl">
            Discover a Wide Range of Exciting Activities
          </h3>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition group-hover:bg-white/30">
            <ArrowRight className="text-white" size={24} />
          </div>
        </Link>
      </div>
    </section>
  )
}

export default FeaturedEvents
