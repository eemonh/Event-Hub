import { MapPin } from "lucide-react"

export default function EventCard({
  image,
  title,
  category,
  format,
  location,
  time,
  date,
  price,
  recommendationReason,
  variant = "overlay",
  featured = false,
  className = "",
}) {
  if (variant === "stacked") {
    return (
      <div
        className={`overflow-hidden rounded-2xl border border-border-light bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${className}`}
      >
        <div
          className={`overflow-hidden ${
            featured
              ? "h-64 sm:h-80 lg:h-[520px]"
              : "h-44 sm:h-48 lg:h-[210px]"
          }`}
        >
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />
        </div>

        <div className={featured ? "p-5 sm:p-6" : "p-5"}>
          {(category || format) && (
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {category && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {category}
                </span>
              )}

              {format && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-text-muted">
                  {format}
                </span>
              )}
            </div>
          )}

          <h3
            className={`font-bold leading-tight text-text-primary ${
              featured ? "text-2xl sm:text-[32px]" : "text-xl sm:text-2xl"
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

          {recommendationReason && (
            <p className="mt-4 text-sm font-medium leading-5 text-primary">
              {recommendationReason}
            </p>
          )}

          <div className="mt-5 flex items-end justify-between gap-4 md:mt-6">
            {(time || date) && (
              <div className="text-sm leading-5 text-gray-800">
                {time && <p>{time}</p>}
                {date && <p className="text-text-muted">{date}</p>}
              </div>
            )}

            {price && (
              <p
                className={`shrink-0 font-bold text-primary ${
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
