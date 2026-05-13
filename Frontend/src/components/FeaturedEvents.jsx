import { MapPin, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { featuredEvents } from "../data/featuredEvents"

const filters = ["All", "Online", "Music", "Food & Drink"]

const FeaturedEvents = () => {
  return (
    <section className="bg-bg-muted py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-6">
          <h2 className="max-w-[340px] text-center text-3xl md:text-4xl lg:text-[42px] font-bold leading-[1.05] tracking-[-0.02em] text-text-primary">
            Exciting Events Around the Corner
          </h2>

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
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr]">
          <div className="overflow-hidden rounded-2xl border border-border-light bg-white shadow-md">
            <div className="h-[300px] md:h-[540px] overflow-hidden">
              <img
                src={featuredEvents[0].image}
                alt={featuredEvents[0].title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-6">
              <h3 className="text-[32px] font-bold text-text-primary">
                {featuredEvents[0].title}
              </h3>

              <div className="mt-2 flex items-center gap-1 text-sm text-text-muted">
                <MapPin size={16} />
                {featuredEvents[0].location}
              </div>

              <div className="mt-6 flex items-end justify-between">
                <div className="text-sm leading-5 text-gray-800">
                  <p>{featuredEvents[0].time}</p>
                  <p className="text-text-muted">{featuredEvents[0].date}</p>
                </div>

                <p className="text-3xl font-bold text-primary">
                  {featuredEvents[0].price}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {featuredEvents.slice(1).map((event) => (
              <div
                key={event.id}
                className="overflow-hidden rounded-2xl border border-border-light bg-white shadow-md"
              >
                <div className="h-40 md:h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-2xl font-bold text-text-primary">
                    {event.title}
                  </h3>

                  <div className="mt-1 flex items-center gap-1 text-sm text-text-muted">
                    <MapPin size={16} />
                    {event.location}
                  </div>

                  <div className="mt-5 flex items-end justify-between">
                    <div className="text-sm leading-5 text-gray-800">
                      <p>{event.time}</p>
                      <p className="text-text-muted">{event.date}</p>
                    </div>

                    <p className="text-2xl font-bold text-primary">
                      {event.price}
                    </p>
                  </div>
                </div>
              </div>
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
