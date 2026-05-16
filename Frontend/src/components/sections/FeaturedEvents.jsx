import { useMemo, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import Button from "../ui/Button"
import EventCard from "../ui/EventCard"
import SectionHeading from "../ui/SectionHeading"
import { featuredEvents } from "../../data/featuredEvents"

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

const eventMatchesFilter = (event, selectedFilter) => {
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

const getRecommendationScore = (event, userSignals) => {
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
}) => {
  const matchingEvents = events.filter((event) =>
    eventMatchesFilter(event, selectedFilter)
  )
  const sourceEvents = matchingEvents.length > 0 ? matchingEvents : events

  return sourceEvents
    .map((event, index) => ({
      ...event,
      score:
        selectedFilter === "for-you"
          ? getRecommendationScore(event, userSignals)
          : (event.popularity ?? 0) - index,
    }))
    .sort((first, second) => second.score - first.score)
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
  const supportingEvents = rankedEvents.slice(1, 4)
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

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-[2fr_1fr] lg:gap-6">
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
