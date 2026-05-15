import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import EventCard from "../ui/EventCard"
import SectionHeading from "../ui/SectionHeading"
import { featuredEvents } from "../../data/featuredEvents"

const filters = ["All", "Online", "Music", "Food & Drink"]

const FeaturedEvents = () => {
  return (
    <section className="bg-bg-muted py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title="Exciting Events Around the Corner">
          <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1">
            {filters.map((item, index) => (
              <button
                key={item}
                className={`rounded-lg px-6 py-2 text-sm font-medium transition-all ${
                  index === 3
                    ? "bg-primary text-white shadow-sm"
                    : index === 0
                    ? "bg-white text-text-primary shadow-sm"
                    : "text-gray-600 hover:bg-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </SectionHeading>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr]">
          <EventCard
            {...featuredEvents[0]}
            variant="stacked"
            featured
          />

          <div className="flex flex-col gap-6">
            {featuredEvents.slice(1).map((event) => (
              <EventCard
                key={event.id}
                {...event}
                variant="stacked"
              />
            ))}
          </div>
        </div>

        <Link
          to="/events"
          className="mt-6 rounded-2xl bg-primary px-6 py-8 md:py-10 shadow-md flex items-center justify-between"
        >
          <h3 className="max-w-xl text-3xl font-bold text-white">
            Discover a Wide Range of Exciting Activities
          </h3>

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition hover:bg-white/30">
            <ArrowRight className="text-white" size={24} />
          </div>
        </Link>
      </div>
    </section>
  )
}

export default FeaturedEvents
