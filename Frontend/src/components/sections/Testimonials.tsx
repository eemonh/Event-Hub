import { useRef } from "react"
import Card from "../ui/Card"
import SectionHeading from "../ui/SectionHeading"
import useCarousel from "../../hooks/useCarousel"

const testimonials = [
  {
    id: 1,
    quote:
      "EventHub completely transformed how we organize our local tech meetups. The platform is intuitive and our attendees love the seamless registration process!",
    name: "Sarah Jenkins",
    role: "Community Manager",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 2,
    quote:
      "Finding the perfect venue and managing ticket sales used to be a nightmare. EventHub simplified everything, allowing me to focus on creating an amazing experience.",
    name: "Michael Chen",
    role: "Event Organizer",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 3,
    quote:
      "I've discovered so many unique local events through EventHub. The personalized recommendations are spot on, and I love how easy it is to keep track of my experiences!",
    name: "Elena Rodriguez",
    role: "Attendee",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
  },
]

export default function Testimonials() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const { activeIndex, scrollTo } = useCarousel({
    items: testimonials,
    containerRef: scrollContainerRef,
    itemRefs: cardRefs,
  })

  return (
    <section className="w-full bg-white py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-16 px-8">
        <SectionHeading
          title="What Our Users Say"
          subtitle="Discover why people love EventHub for their experiences."
        />

        <div className="flex w-full max-w-[768px] flex-col items-center gap-10">
          <div
            ref={scrollContainerRef}
            className="flex w-full snap-x snap-mandatory overflow-x-auto [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                ref={(el) => { cardRefs.current[index] = el }}
                className="w-full shrink-0 snap-center px-4"
              >
                <Card
                  shadow="sm"
                  radius="sm"
                  className="flex flex-col items-center px-8 md:px-16 py-16"
                >
                  <div className="pb-10 text-center">
                    <p className="max-w-[592px] text-xl md:text-[24px] italic leading-[32px] text-gray-600">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />

                    <div className="text-center">
                      <h4 className="text-lg font-bold leading-7 text-text-primary">
                        {testimonial.name}
                      </h4>

                      <p className="text-sm leading-5 text-text-muted">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                aria-label={`Go to testimonial ${index + 1}`}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  activeIndex === index ? "bg-primary w-6" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
