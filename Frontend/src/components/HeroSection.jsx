import { heroEvents } from "../data/heroEvents"

const EventCard = ({ title, category, image, featured }) => {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl shadow-lg
        group cursor-pointer w-full md:w-[315px]
        transition-all duration-300 hover:-translate-y-2
        ${featured ? "h-[320px] md:-mt-8" : "h-[256px]"}
      `}
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

        <p className="text-white/80 text-sm leading-5 mt-1">
          {category}
        </p>
      </div>
    </div>
  )
}

const HeroSection = () => {
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

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          {heroEvents.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
