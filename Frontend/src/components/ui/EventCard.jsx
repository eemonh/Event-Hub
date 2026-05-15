import { MapPin } from "lucide-react"

export default function EventCard({
  image,
  title,
  category,
  location,
  time,
  date,
  price,
  variant = "overlay",
  featured = false,
  className = "",
}) {
  if (variant === "stacked") {
    return (
      <div
        className={`overflow-hidden rounded-2xl border border-border-light bg-white shadow-md ${className}`}
      >
        <div
          className={`overflow-hidden ${
            featured
              ? "h-[300px] md:h-[540px]"
              : "h-40 md:h-48"
          }`}
        >
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />
        </div>

        <div className={featured ? "p-6" : "p-5"}>
          <h3
            className={`font-bold text-text-primary ${
              featured ? "text-[32px]" : "text-2xl"
            }`}
          >
            {title}
          </h3>

          {location && (
            <div className="mt-1 md:mt-2 flex items-center gap-1 text-sm text-text-muted">
              <MapPin size={16} />
              {location}
            </div>
          )}

          <div className="mt-5 md:mt-6 flex items-end justify-between">
            {(time || date) && (
              <div className="text-sm leading-5 text-gray-800">
                {time && <p>{time}</p>}
                {date && <p className="text-text-muted">{date}</p>}
              </div>
            )}

            {price && (
              <p
                className={`font-bold text-primary ${
                  featured ? "text-3xl" : "text-2xl"
                }`}
              >
                {price}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer w-full md:w-[315px] transition-all duration-300 hover:-translate-y-2 ${
        featured ? "h-[320px] md:-mt-8" : "h-[256px]"
      } ${className}`}
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div
        className={`absolute inset-0 ${
          featured
            ? "bg-gradient-to-t from-black/90 to-transparent"
            : "bg-gradient-to-t from-black/80 to-transparent"
        }`}
      />

      <div className="absolute bottom-6 left-6 z-10">
        <h3 className="text-white text-[24px] font-bold leading-8">
          {title}
        </h3>

        {category && (
          <p className="text-white/80 text-sm leading-5 mt-1">{category}</p>
        )}
      </div>
    </div>
  )
}
